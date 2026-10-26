# Runs INSIDE lldb:  lldb -b -o "command script import lldb_tracer.py" -o "walk <exe> <file.cpp> <entry> <cap> <out.json> <result.txt> '<[[name, line]...]>'"
# Steps through the unmodified C++ one line at a time and records what the program looked like at every stop.
import json, shlex
import lldb

MAX_STEPS = 1500
seen = set()  # (call, variable, declaration line) that have been initialised at least once


def array(v, cap):
    """A C array like dp[100005][3][2]: read just the first `cap` cells of each dimension straight from memory.
    (Asking lldb for the whole object would copy megabytes on every single step.)"""
    t, dims = v.GetType(), []
    while t.IsArrayType():
        dims.append(t.GetByteSize() // t.GetArrayElementType().GetByteSize())
        t = t.GetArrayElementType()
    size, base, err, process = t.GetByteSize(), v.GetLoadAddress(), lldb.SBError(), v.GetProcess()
    signed, boolean = "unsigned" not in t.GetName(), t.GetCanonicalType().GetBasicType() == lldb.eBasicTypeBool

    def read(level, offset):
        count = min(dims[level], cap)
        if level == len(dims) - 1:
            raw = process.ReadMemory(base + offset, count * size, err)
            cells = [int.from_bytes(raw[k * size:(k + 1) * size], "little", signed=signed) for k in range(count)]
            return [bool(c) for c in cells] if boolean else cells
        stride = size
        for d in dims[level + 1:]:
            stride *= d
        return [read(level + 1, offset + k * stride) for k in range(count)]

    return read(0, 0)


def value(v, cap):
    """An SBValue as plain JSON: number, bool, string, list (vector / array / deque / map) or {field: value}."""
    t = v.GetType()
    if t.IsReferenceType():
        v = v.Dereference()
        t = v.GetType()
    if t.IsArrayType():
        return array(v, cap)
    name = t.GetCanonicalType().GetName() or ""
    if "basic_string" in name:
        return (v.GetSummary() or '""').strip('"')
    n = v.GetNumChildren()
    if n == 0:
        basic = t.GetCanonicalType().GetBasicType()
        if basic == lldb.eBasicTypeInvalid:
            return []  # an empty vector / deque / map
        return v.GetValue() == "true" if basic == lldb.eBasicTypeBool else v.GetValueAsSigned()
    kids = [v.GetChildAtIndex(k) for k in range(min(n, 60))]
    if kids[0].GetName() and kids[0].GetName().startswith("["):
        return [value(c, cap) for c in kids]
    fields = {c.GetName(): value(c, cap) for c in kids}
    return fields["c"] if list(fields) == ["c"] else fields  # std::stack / std::queue wrap a container called c


def snapshot(frame, cap, line, bindings):
    """Args, locals and class members. A local stays hidden until its declaration has run (before that it is garbage)."""
    args = [v.GetName() for v in frame.GetVariables(True, False, False, True)]
    local = {}
    for v in frame.GetVariables(True, True, False, True):
        name, decl = v.GetName(), v.GetDeclaration().GetLine()
        key = (frame.GetCFA(), name, decl)
        if name != "this" and (name in args or decl < line or key in seen):
            seen.add(key)
            local[name] = value(v, cap)
    for name, decl in bindings:  # auto [i, tag] = ...: lldb will not list these, but it can evaluate them by name
        key = (frame.GetCFA(), name, decl)
        if decl < line or key in seen:
            v = frame.EvaluateExpression(name)
            if v.GetError().Success():
                seen.add(key)
                local[name] = value(v, cap)
    members = {}
    this = frame.FindVariable("this")
    if this.IsValid():  # build each member from its address, so a 36 MB dp table is never copied
        cls, addr = this.GetType().GetPointeeType(), this.GetValueAsUnsigned()
        for k in range(cls.GetNumberOfFields()):
            f = cls.GetFieldAtIndex(k)
            members[f.GetName()] = value(this.CreateValueFromAddress(f.GetName(), addr + f.GetOffsetInBytes(), f.GetType()), cap)
    return {"vars": local, "args": [a for a in args if a != "this"], "mem": members}


def returned(frame, ret_type):
    """What the call that just came back returned: read the return register as the function's return type."""
    if ret_type is None or ret_type.GetByteSize() == 0 or ret_type.GetCanonicalType().GetBasicType() == lldb.eBasicTypeInvalid:
        return None  # void, or a class we do not decode
    reg = frame.FindRegister("x0")  # arm64; rax on Intel
    raw = (reg if reg.IsValid() else frame.FindRegister("rax")).GetValueAsUnsigned()
    bits = 8 * ret_type.GetByteSize()
    raw &= (1 << bits) - 1
    if ret_type.GetCanonicalType().GetBasicType() == lldb.eBasicTypeBool:
        return bool(raw)
    return raw - (1 << bits) if raw >> (bits - 1) else raw


def walk(debugger, command, result, internal_dict):
    exe, src, entry, cap, out, answer, bindings = shlex.split(command)
    bindings = json.loads(bindings)
    debugger.SetAsync(False)
    debugger.HandleCommand("settings set target.process.thread.step-avoid-regexp ^std::|^__gnu_cxx::")
    target = debugger.CreateTarget(exe)
    target.BreakpointCreateByName("Solution::" + entry)
    process = target.LaunchSimple([answer], None, ".")
    thread = process.GetSelectedThread()
    base = thread.GetNumFrames()
    frames, prev_depth, prev_type, lost = [], 0, None, 0
    while process.GetState() == lldb.eStateStopped and len(frames) < MAX_STEPS:
        depth = thread.GetNumFrames() - base
        frame = thread.GetFrameAtIndex(0)
        where = frame.GetLineEntry()
        if depth < 0:  # the entry method returned to main
            break
        if where.GetFileSpec().GetFilename() != src:
            lost += 1
            if lost > 200:  # crashed, or stuck outside your code
                break
            thread.StepOut()  # landed in something that is not your code
            continue
        f = {"line": where.GetLine(), "depth": depth, "fn": (frame.GetFunctionName() or "").split("(")[0].replace("Solution::", "")}
        f.update(snapshot(frame, int(cap), where.GetLine(), bindings))
        if depth < prev_depth:  # the previous stop was a `return`
            ret = returned(frame, prev_type)
            if ret is not None:
                f["ret"] = ret
        frames.append(f)
        prev_depth, prev_type = depth, frame.GetFunction().GetType().GetFunctionReturnType()
        thread.StepInto()
    process.Continue()  # let main finish and write the real answer
    json.dump(frames, open(out, "w"), separators=(",", ":"))


def __lldb_init_module(debugger, internal_dict):
    debugger.HandleCommand("command script add -f lldb_tracer.walk walk")
