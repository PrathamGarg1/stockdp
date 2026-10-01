// Shows frames[index]. The trace already ran. This file only changes the index.
import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Board } from "@/draw"
import { usePlayback } from "@/engine/usePlayback"
import type { CodeStage, Frame, Problem } from "@/engine/types"
import { comparePairs, problemById } from "@/problems/registry"
import { cn } from "@/lib/utils"

export function Player({ problem }: { problem: Problem }) {
  const [preset, setPreset] = useState("0")
  const [raw, setRaw] = useState(problem.presets[0]?.raw ?? "")
  const { frames, error } = useMemo(() => run(problem, raw), [problem, raw])
  const playback = usePlayback(`${problem.id}:${raw}`, frames.length)
  const frame = frames[playback.index]
  const locked = Boolean(frame?.answer) && frames.length > 0 && playback.index === frames.length - 1
  const links = comparePairs.filter((pair) => pair.a === problem.id || pair.b === problem.id)

  useEffect(() => {
    setPreset("0")
    setRaw(problem.presets[0]?.raw ?? "")
  }, [problem])

  useEffect(() => {
    document.getElementById(`step-${problem.id}-${playback.index}`)?.scrollIntoView({ block: "nearest" })
  }, [playback.index, problem.id])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b bg-background/70 px-4 py-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            {problem.leetcode} {problem.title}
            <Badge variant="secondary">{problem.complexity}</Badge>
          </h1>
          <p className="text-sm text-muted-foreground">{problem.pattern}</p>
        </div>
        <div className="text-right">
          <Badge variant={locked ? "default" : "outline"} className="num font-mono">
            {locked ? "answer" : "running"} {frame?.answer ?? "—"}
          </Badge>
          {links.map((pair) => (
            <Link key={pair.title} className="mt-1 block text-xs text-muted-foreground underline" to={`/compare/${pair.a}/${pair.b}`}>
              compare · {pair.title}
            </Link>
          ))}
        </div>
      </header>
      <div className="flex gap-2 border-b bg-background/70 px-4 py-2">
        <Select
          value={preset}
          onValueChange={(value) => {
            setPreset(value)
            setRaw(problem.presets[Number(value)]?.raw ?? "")
          }}
        >
          <SelectTrigger className="w-40" aria-label={problem.presets[Number(preset)]?.name ?? "Preset"}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {problem.presets.map((item, index) => (
              <SelectItem key={item.name} value={String(index)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input aria-label="Input" value={raw} placeholder={problem.hint} onChange={(event) => setRaw(event.target.value)} className="font-mono" />
        {(problem.id === "188" || problem.id === "3573") && <KSlider raw={raw} onRaw={setRaw} />}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ScrollArea className="min-h-0">
          <div className="space-y-4 p-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {frame && (
              <>
                <p className="text-sm">{frame.caption}</p>
                <p className="text-sm text-muted-foreground">{frame.invariant}</p>
                <Card className="bg-card/80">
                  <CardContent className="pt-6">
                    <Board frame={frame} />
                  </CardContent>
                </Card>
                <Ladder stages={problem.ladder} runs={problem.runs} />
              </>
            )}
          </div>
        </ScrollArea>
        <ScrollArea className="min-h-0 border-t lg:border-l lg:border-t-0">
          <ol>
            {frames.map((item, index) => (
              <li key={index}>
                <button
                  id={`step-${problem.id}-${index}`}
                  onClick={() => {
                    playback.setPlaying(false)
                    playback.setIndex(index)
                  }}
                  className={cn("w-full border-b px-3 py-2 text-left text-xs", index === playback.index ? "bg-accent" : "hover:bg-accent/50")}
                >
                  {index + 1}. {item.caption}
                </button>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </div>
      <Transport
        index={playback.index}
        length={frames.length}
        playing={playback.playing}
        speed={playback.speed}
        onIndex={(index) => {
          playback.setPlaying(false)
          playback.setIndex(index)
        }}
        onToggle={() => playback.setPlaying((value) => !value)}
        onSpeed={playback.setSpeed}
      />
    </div>
  )
}

export function Compare() {
  const { a = "", b = "" } = useParams()
  const left = problemById(a)
  const right = problemById(b)
  const pair = comparePairs.find((item) => item.a === a && item.b === b)
  const [raw, setRaw] = useState(pair?.raw ?? "")
  const leftRun = useMemo(() => (left ? run(left, raw) : { frames: [], error: "" }), [left, raw])
  const rightRun = useMemo(() => (right ? run(right, raw) : { frames: [], error: "" }), [right, raw])
  const length = Math.max(leftRun.frames.length, rightRun.frames.length, 1)
  const playback = usePlayback(`${a}:${b}:${raw}`, length)
  if (!left || !right || !pair) return <Navigate to="/" replace />
  const at = (frames: Frame[]) => frames[Math.min(playback.index, Math.max(0, frames.length - 1))]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="space-y-2 border-b bg-background/70 px-4 py-3">
        <h1 className="text-lg font-semibold">{pair.title}</h1>
        <p className="text-sm text-muted-foreground">{pair.blurb}</p>
        <div className="flex gap-2">
          <Input aria-label="Shared input" value={raw} onChange={(event) => setRaw(event.target.value)} className="font-mono" />
          <Button variant="outline" size="sm" asChild>
            <Link to={`/${left.family}/${left.id}`}>{left.leetcode}</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/${right.family}/${right.id}`}>{right.leetcode}</Link>
          </Button>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto p-4 lg:grid-cols-2">
        <Pane problem={left} frame={at(leftRun.frames)} error={leftRun.error} />
        <Pane problem={right} frame={at(rightRun.frames)} error={rightRun.error} />
      </div>
      <Transport
        index={playback.index}
        length={length}
        playing={playback.playing}
        speed={playback.speed}
        onIndex={(index) => {
          playback.setPlaying(false)
          playback.setIndex(index)
        }}
        onToggle={() => playback.setPlaying((value) => !value)}
        onSpeed={playback.setSpeed}
      />
    </div>
  )
}

function Pane({ problem, frame, error }: { problem: Problem; frame?: Frame; error: string }) {
  return (
    <Card className="bg-card/80">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">
          {problem.leetcode} {problem.title}
        </CardTitle>
        <Badge variant="secondary" className="num font-mono">
          {frame?.answer ?? "—"}
        </Badge>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {frame && (
          <>
            <p className="mb-3 text-sm">{frame.caption}</p>
            <Board frame={frame} />
          </>
        )}
      </CardContent>
    </Card>
  )
}

function Ladder({ stages, runs }: { stages: CodeStage[]; runs: string }) {
  const initial = stages.find((stage) => stage.id === runs)?.id ?? stages[0]?.id ?? "code"
  return (
    <Tabs defaultValue={initial}>
      <TabsList className="h-auto flex-wrap">
        {stages.map((stage) => (
          <TabsTrigger key={stage.id} value={stage.id}>
            {stage.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {stages.map((stage) => (
        <TabsContent key={stage.id} value={stage.id}>
          <Card className="bg-card/80">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardDescription>{stage.delta}</CardDescription>
                {stage.badge && <Badge variant="outline">{stage.badge}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto font-mono text-xs leading-5">{stage.code}</pre>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}

function Transport({
  index,
  length,
  playing,
  speed,
  onIndex,
  onToggle,
  onSpeed,
}: {
  index: number
  length: number
  playing: boolean
  speed: number
  onIndex: (index: number) => void
  onToggle: () => void
  onSpeed: (speed: number) => void
}) {
  const max = Math.max(0, length - 1)
  return (
    <div className="flex items-center gap-2 border-t bg-background/80 px-3 py-2">
      <Button variant="outline" size="sm" aria-label="Previous step" onClick={() => onIndex(Math.max(0, index - 1))}>
        prev
      </Button>
      <Button size="sm" aria-label={playing ? "Pause" : "Play"} onClick={onToggle}>
        {playing ? "pause" : "play"}
      </Button>
      <Button variant="outline" size="sm" aria-label="Next step" onClick={() => onIndex(Math.min(max, index + 1))}>
        next
      </Button>
      <Slider aria-label="Scrub decisions" className="mx-2" min={0} max={max} step={1} value={[Math.min(index, max)]} onValueChange={([value]) => onIndex(value ?? 0)} />
      <span className="num w-12 text-right font-mono text-xs text-muted-foreground">{length === 0 ? "0/0" : `${index + 1}/${length}`}</span>
      <Select value={String(speed)} onValueChange={(value) => onSpeed(Number(value))}>
        <SelectTrigger className="w-16" aria-label="Speed">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1×</SelectItem>
          <SelectItem value="2">2×</SelectItem>
          <SelectItem value="4">4×</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function KSlider({ raw, onRaw }: { raw: string; onRaw: (raw: string) => void }) {
  const match = raw.match(/k=(\d+)/)
  const k = Math.min(3, Math.max(1, match ? Number(match[1]) : 2))
  return (
    <label className="flex w-36 items-center gap-2 text-xs text-muted-foreground">
      k {k}
      <Slider
        aria-label="Transaction cap"
        min={1}
        max={3}
        step={1}
        value={[k]}
        onValueChange={([value]) => {
          const next = String(value ?? k)
          onRaw(raw.includes("k=") ? raw.replace(/k=\d+/, `k=${next}`) : `k=${next}; ${raw}`)
        }}
      />
    </label>
  )
}

function run(problem: Problem, raw: string): { frames: Frame[]; error: string } {
  try {
    return { frames: problem.trace(problem.parse(raw)), error: "" }
  } catch (error) {
    return { frames: [], error: error instanceof Error ? error.message : "Could not run that input." }
  }
}
