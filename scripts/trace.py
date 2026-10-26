#!/usr/bin/env python3
"""npm run trace [id ...]
Compiles each solution from mysolutions/*.txt exactly as you wrote it, runs it under lldb with the
example from src/problems.json, and writes src/traces/<id>.json. Checks the real answer against `expect`."""
import json, re, shlex, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEADERS = "".join(f"#include <{h}>\n" for h in "vector map set deque stack queue string algorithm iostream fstream sstream cstring cmath tuple utility numeric climits".split())


def split_cpp(raw):
    """One string per `class Solution`; a helper class (mdq) goes with the Solution after it."""
    out, helper = [], ""
    for part in re.split(r"\n(?=class (?:Solution|mdq))", raw):
        if not part.startswith("class "):
            continue  # a "Q1." label
        code = part[: part.rindex("};") + 2]
        if part.startswith("class mdq"):
            helper = code + "\n\n"
        else:
            out.append(helper + code)
            helper = ""
    return out


def entry_method(cpp):
    """The last method in the class is the one the judge calls."""
    found = re.findall(r"^ {2,4}(?! |if\b|for\b|while\b|else\b|return\b)([\w:<>,&* ]+?)\s+(\w+)\s*\(([^)]*)\)\s*\{\s*$", cpp, re.M)
    ret, name, params = found[-1]
    args = []
    for p in params.split(","):
        typ, var = p.replace("&", " ").rsplit(None, 1)
        args.append((typ.replace("const", "").strip(), var))
    return ret.strip(), name, args


def literal(typ, x):
    if typ == "vector<int>":
        return "{" + ",".join(map(str, x)) + "}"
    return json.dumps(x) if typ == "string" else str(x)


def driver(cpp, ret, name, args, example):
    decls = "".join(f"  {t} a{i} = {literal(t, x)};\n" for i, ((t, _), x) in enumerate(zip(args, example)))
    return f"""{HEADERS}using namespace std;
#line 1 "solution.cpp"
{cpp}
#line 1 "driver"
string show(bool x) {{ return x ? "true" : "false"; }}
string show(int x) {{ return to_string(x); }}
string show(long long x) {{ return to_string(x); }}
string show(const string& x) {{ return x; }}
string show(const vector<int>& x) {{ string s = "["; for (size_t i = 0; i < x.size(); i++) s += (i ? "," : "") + to_string(x[i]); return s + "]"; }}
void scrub() {{ char junk[6 << 20]; memset(junk, 0, sizeof junk); asm volatile("" :: "r"(junk) : "memory"); }}
int main(int, char** argv) {{
  scrub();  // zero the stack first, so a local you have not set yet shows 0 instead of old garbage
{decls}  Solution* s = new Solution;  // heap, like the judge: some solutions hold 36 MB tables
  {ret} r = s->{name}({", ".join(f"a{i}" for i in range(len(args)))});
  ofstream(argv[1]) << show(r);
}}
"""


def array_cap(example):
    lens = [len(x) for x in example if isinstance(x, (list, str))]
    return (max(lens) if lens else example[0]) + 1  # dp tables are indexed 0..n


def run(p, cpp):
    ret, name, args = entry_method(cpp)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        (tmp / "solution.cpp").write_text(driver(cpp, ret, name, args, p["example"]))
        exe, result, out = tmp / "run", tmp / "result.txt", tmp / "trace.json"
        cc = subprocess.run(["clang++", "-std=c++17", "-g", "-O0", "-w", "-o", exe, tmp / "solution.cpp"], capture_output=True, text=True)
        if cc.returncode:
            sys.exit(f"{p['id']} does not compile:\n{cc.stderr}")
        bindings = [(n.strip(), k + 1) for k, l in enumerate(cpp.split("\n")) for g in re.findall(r"auto\s*&?\s*\[([^\]]+)\]", l) for n in g.split(",")]
        lldb = ["lldb", "-b", "-o", f"command script import {ROOT}/scripts/lldb_tracer.py",
                "-o", f"walk {exe} solution.cpp {name} {array_cap(p['example'])} {out} {result} {shlex.quote(json.dumps(bindings))}"]
        dbg = subprocess.run(lldb, capture_output=True, text=True, timeout=180, cwd=tmp)
        if not out.exists():
            sys.exit(f"{p['id']}: lldb produced no trace\n{dbg.stdout}\n{dbg.stderr}")
        got = result.read_text()
        frames = json.loads(out.read_text())
    ok = got == p["expect"]
    print(f"{'ok  ' if ok else 'FAIL'} {p['id']:10} {len(frames):5} steps  returned {got}" + ("" if ok else f"  expected {p['expect']}"), flush=True)
    (ROOT / "src/traces").mkdir(exist_ok=True)
    (ROOT / f"src/traces/{p['id']}.json").write_text(json.dumps({"cpp": cpp, "result": got, "frames": frames}, separators=(",", ":")))
    return ok


def attempt(p, cpp):
    try:
        return run(p, cpp)
    except (SystemExit, Exception) as e:  # report it and carry on with the other problems
        print(f"FAIL {p['id']}: {e}", flush=True)
        return False


def main():
    problems = json.loads((ROOT / "src/problems.json").read_text())
    want = sys.argv[1:]
    chunks = {f: split_cpp((ROOT / "mysolutions" / f).read_text()) for f in {p["file"] for p in problems}}
    for f, c in chunks.items():
        have = sum(p["file"] == f for p in problems)
        assert len(c) == have, f"{f}: {len(c)} solutions in the txt, {have} in problems.json"
    todo = [p for p in problems if not want or p["id"] in want]
    with ThreadPoolExecutor(4) as pool:
        results = list(pool.map(lambda p: attempt(p, chunks[p["file"]][p["index"]]), todo))
    sys.exit(0 if all(results) else 1)


if __name__ == "__main__":
    main()
