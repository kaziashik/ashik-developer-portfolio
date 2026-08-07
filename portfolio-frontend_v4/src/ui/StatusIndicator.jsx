// Small blinking square — reads as an "online/available" status marker.
export default function StatusIndicator({ label = 'AVAILABLE FOR WORK' }) {
  return (
    <div className="inline-flex items-center gap-2 eyebrow text-xs text-base-content/60">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full bg-primary animate-pulse-dot" />
      </span>
      {label}
    </div>
  )
}
