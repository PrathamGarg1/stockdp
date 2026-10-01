export function read(raw: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of raw.split(";")) {
    const bit = part.trim()
    if (!bit) continue
    const eq = bit.indexOf("=")
    if (eq === -1) {
      if (out.values) throw new Error("Separate extra fields with semicolons, as key=value.")
      out.values = bit
    } else {
      out[bit.slice(0, eq).trim()] = bit.slice(eq + 1).trim()
    }
  }
  return out
}

export function ints(source: string | undefined, label: string): number[] {
  if (!source) throw new Error(`Missing ${label}.`)
  const parts = source.split(",").map((part) => part.trim()).filter(Boolean)
  if (!parts.length) throw new Error(`${label} is empty.`)
  const nums = parts.map((part) => Number(part))
  if (nums.some((n) => !Number.isInteger(n))) throw new Error(`${label} must be integers.`)
  return nums
}

export function limited(list: number[], label: string, max: number): number[] {
  if (list.length > max) {
    throw new Error(`Use at most ${max} ${label} so each decision stays readable.`)
  }
  return list
}

export function smallK(raw: string | undefined, fallback = 2): number {
  const k = raw === undefined || raw === "" ? fallback : Number(raw)
  if (!Number.isInteger(k) || k < 1 || k > 3) throw new Error("Use k from 1 to 3 so the table fits.")
  return k
}

export function pricesOf(raw: string, max = 10): number[] {
  const fields = read(raw)
  return limited(ints(fields.prices ?? fields.values, "prices"), "prices", max)
}
