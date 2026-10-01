import type { Problem } from "../engine/types"

export type Draft = Omit<Problem, "ladder" | "runs">
