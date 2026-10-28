import { useMemo } from "react"
import { motion } from "motion/react"

const GAP_X = 74
const GAP_Y = 54

// The trace has no tree, only `depth` per step. depth goes up = a call started, down = it returned.
function buildTree(frames) {
  const nodes = []
  const stack = []
  let prev = 0
  frames.forEach((f, k) => {
    if (f.depth > prev && f.depth >= 1) {
      const args = f.args.map((a) => f.vars[a]).filter((v) => typeof v !== "object")
      nodes.push({ id: nodes.length, parent: stack.at(-1) ?? -1, label: `${f.fn}(${args.join(",")})`, open: k })
      stack.push(nodes.length - 1)
    }
    for (let d = prev; d > f.depth; d--) {
      const done = nodes[stack.pop()]
      if (done) Object.assign(done, { close: k, ret: f.rets?.[prev - d] }) // rets: innermost call first
    }
    prev = f.depth
  })
  return nodes
}

export function Tree({ frames, step }) {
  const nodes = useMemo(() => buildTree(frames), [frames])
  if (!frames.some((f) => f.depth >= 2)) return null // not recursive

  const now = nodes.find((n) => n.close === step)?.id ?? nodes.filter((n) => n.open <= step && (n.close ?? Infinity) > step).at(-1)?.id
  const shown = nodes.filter((n) => n.open <= step)
  const kids = (id) => shown.filter((n) => n.parent === id)
  const pos = new Map()
  let leaf = 0
  const place = (n, depth) => {
    const ch = kids(n.id).map((c) => place(c, depth + 1))
    const x = ch.length ? (ch[0] + ch.at(-1)) / 2 : leaf++
    pos.set(n.id, { x, y: depth })
    return x
  }
  kids(-1).forEach((r) => place(r, 0))

  const width = Math.max(leaf, 1) * GAP_X
  const height = (Math.max(...[...pos.values()].map((p) => p.y), 0) + 1) * GAP_Y + 20
  const at = (id) => ({ x: pos.get(id).x * GAP_X + GAP_X / 2, y: pos.get(id).y * GAP_Y + 24 })
  return (
    <div className="max-h-80 overflow-auto rounded-lg border bg-white">
      <svg width={width} height={height}>
        {shown.filter((n) => n.parent >= 0).map((n) => (
          <line key={n.id} x1={at(n.parent).x} y1={at(n.parent).y} x2={at(n.id).x} y2={at(n.id).y} stroke="#cbd5e1" />
        ))}
        {shown.map((n) => {
          const done = n.close !== undefined && n.close <= step
          const { x, y } = at(n.id)
          return (
            <motion.g key={n.id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ originX: `${x}px`, originY: `${y}px` }}>
              <rect
                x={x - 33} y={y - 17} width={66} height={34} rx={8}
                fill={n.id === now ? "#fde68a" : done ? "#d1fae5" : "#ede9fe"}
                stroke={n.id === now ? "#f59e0b" : done ? "#34d399" : "#a78bfa"}
                strokeWidth={n.id === now ? 2.5 : 1.5}
              />
              <text x={x} y={y - 3} textAnchor="middle" fontSize={9} fontFamily="monospace">{n.label.slice(0, 13)}</text>
              <text x={x} y={y + 10} textAnchor="middle" fontSize={11} fontWeight={700}>{done ? String(n.ret ?? "") : "..."}</text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
