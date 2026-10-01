import type { Cell, DpTable, Frame } from "../engine/types"
import { fmt } from "../lib/utils"

export function F(caption: string, invariant: string, extra: Partial<Frame> = {}): Frame {
  return { caption, invariant, marks: [], meters: [], ...extra }
}

export function grid(
  rowLabels: string[],
  colLabels: string[],
  data: number[][],
  active?: [number, number],
  caption?: string,
): DpTable {
  return {
    caption,
    rowLabels,
    colLabels,
    active,
    cells: data.map((row, r) =>
      row.map((value, c) => ({
        text: fmt(value),
        tone: (active && active[0] === r && active[1] === c ? "write" : "empty") as Cell["tone"],
      })),
    ),
  }
}
