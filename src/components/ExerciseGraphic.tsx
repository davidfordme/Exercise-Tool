import type { ReactNode, SVGProps } from 'react'

type GraphicProps = {
  exerciseId: string
  className?: string
}

const COLORS: Record<string, string> = {
  'sit-ups': '#7eb8ff',
  'reverse-crunches': '#5ee0f0',
  'sitting-twists': '#9ec5ff',
  'high-crunches': '#4fc3f7',
  'knee-crunches': '#82aaff',
  'knee-to-elbow': '#6dd3ce',
  plank: '#5b9cff',
  'elbow-plank': '#8ab4f8',
  generic: '#7a9cc7',
}

function Frame({
  color,
  children,
  className,
}: {
  color: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`graphic ${className ?? ''}`} style={{ background: `${color}22`, color }}>
      {children}
    </div>
  )
}

function Figure({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function SitUps() {
  return (
    <Figure>
      <path d="M28 118h104" {...stroke} opacity="0.35" />
      <circle cx="52" cy="58" r="10" {...stroke} />
      <path d="M50 70c8 16 18 28 38 32l28 6" {...stroke} />
      <path d="M88 102c12-8 22-22 24-38" {...stroke} />
      <path d="M48 118c8-18 22-32 40-16" {...stroke} />
    </Figure>
  )
}

function ReverseCrunches() {
  return (
    <Figure>
      <path d="M28 122h104" {...stroke} opacity="0.35" />
      <circle cx="46" cy="78" r="10" {...stroke} />
      <path d="M56 84c18 8 36 10 52 4" {...stroke} />
      <path d="M70 118c4-20 8-34 18-38 14-6 28 8 36 22" {...stroke} />
      <path d="M108 52c-4 16 4 28 18 34" {...stroke} />
    </Figure>
  )
}

function SittingTwists() {
  return (
    <Figure>
      <path d="M32 122h96" {...stroke} opacity="0.35" />
      <circle cx="80" cy="44" r="10" {...stroke} />
      <path d="M80 56v28" {...stroke} />
      <path d="M48 78c12 6 44 8 64-18" {...stroke} />
      <path d="M52 118c8-22 20-34 28-34s20 12 28 34" {...stroke} />
    </Figure>
  )
}

function HighCrunches() {
  return (
    <Figure>
      <path d="M26 124h108" {...stroke} opacity="0.35" />
      <circle cx="58" cy="50" r="10" {...stroke} />
      <path d="M62 62c10 18 22 30 46 28" {...stroke} />
      <path d="M48 122c6-24 16-44 34-40 18 4 28 22 36 40" {...stroke} />
    </Figure>
  )
}

function KneeCrunches() {
  return (
    <Figure>
      <path d="M28 122h104" {...stroke} opacity="0.35" />
      <circle cx="50" cy="58" r="10" {...stroke} />
      <path d="M58 68c12 14 20 22 20 34" {...stroke} />
      <path d="M78 102c18-2 30 10 40 20" {...stroke} />
      <path d="M48 122c10-16 22-28 36-20" {...stroke} />
    </Figure>
  )
}

function KneeToElbow() {
  return (
    <Figure>
      <circle cx="80" cy="36" r="10" {...stroke} />
      <path d="M80 48c-2 16 2 28 10 36" {...stroke} />
      <path d="M68 58c-16 8-24 8-32 2" {...stroke} />
      <path d="M96 86c16 4 24 16 26 30" {...stroke} />
      <path d="M70 90c-8 16-8 28-2 38" {...stroke} />
      <path d="M90 84c-18 8-28 6-38-8" {...stroke} />
    </Figure>
  )
}

function Plank() {
  return (
    <Figure>
      <path d="M24 118h112" {...stroke} opacity="0.35" />
      <circle cx="38" cy="70" r="10" {...stroke} />
      <path d="M48 74h72" {...stroke} />
      <path d="M38 82v20h18" {...stroke} />
      <path d="M120 74v28" {...stroke} />
    </Figure>
  )
}

function ElbowPlank() {
  return (
    <Figure>
      <path d="M28 122h104" {...stroke} opacity="0.35" />
      <circle cx="80" cy="40" r="10" {...stroke} />
      <path d="M80 52v36" {...stroke} />
      <path d="M80 88c-28 0-38 18-40 34" {...stroke} />
      <path d="M80 72c24 6 36 22 40 50" {...stroke} />
    </Figure>
  )
}

function Generic() {
  return (
    <Figure>
      <circle cx="80" cy="80" r="36" {...stroke} />
      <path d="M80 52v56M58 80h44" {...stroke} />
    </Figure>
  )
}

const ILLUSTRATIONS: Record<string, () => ReactNode> = {
  'sit-ups': SitUps,
  'reverse-crunches': ReverseCrunches,
  'sitting-twists': SittingTwists,
  'high-crunches': HighCrunches,
  'knee-crunches': KneeCrunches,
  'knee-to-elbow': KneeToElbow,
  plank: Plank,
  'elbow-plank': ElbowPlank,
  generic: Generic,
}

export function ExerciseGraphic({ exerciseId, className }: GraphicProps) {
  const Illustration = ILLUSTRATIONS[exerciseId] ?? Generic
  const color = COLORS[exerciseId] ?? COLORS.generic
  return (
    <Frame color={color} className={className}>
      <Illustration />
    </Frame>
  )
}
