export type MarkTone =
  | "cursor"
  | "take"
  | "lock"
  | "best"
  | "wall"
  | "win"
  | "loss"
  | "alice"
  | "bob"

export type RangeTone = "best" | "active" | "muted" | "rise"

export type Mark =
  | { kind: "index"; i: number; tone: MarkTone }
  | { kind: "range"; from: number; to: number; tone: RangeTone }
  | { kind: "arc"; from: number; to: number; tone: "legal" | "chosen" | "same" }
  | { kind: "band"; from: number; to: number }

export type CellTone = "empty" | "write" | "parent" | "answer" | "win" | "loss"

export type Cell = { text: string; tone?: CellTone }

export type DpTable = {
  caption?: string
  rowLabels: string[]
  colLabels: string[]
  cells: Cell[][]
  active?: [number, number]
  parent?: [number, number]
}

// One step. caption is the sentence, values is the array, answer is the running result.
export type Frame = {
  caption: string
  invariant: string
  meters: { label: string; value: string }[]
  marks: Mark[]
  table?: DpTable
  deque?: number[]
  stacks?: { name: string; values: number[] }[]
  answer?: string
  values?: number[]
  labels?: string[]
  secondary?: { label: string; values: string[] }
  guides?: { value: number; label: string }[]
  skyline?: boolean
}

export type CodeStage = {
  id: string
  title: string
  delta: string
  code: string
  badge?: string
}

export type Family = "stocks" | "jumps" | "stones"
export type BoardKind = "price" | "jump" | "stone" | "numberline"

export type Preset = { name: string; raw: string; answer: string }

export type Problem = {
  id: string
  leetcode: number
  title: string
  family: Family
  complexity: string
  pattern: string
  board: BoardKind
  hint: string
  presets: Preset[]
  parse: (raw: string) => unknown
  trace: (input: unknown) => Frame[]
  ladder: CodeStage[]
  runs: string
}
