/** Pulsing placeholders shown while section data loads. */
export function TimelineSkeleton({ rows = 2 }) {
  return (
    <div className="space-y-8" aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="border-l-2 border-base-300 pl-5 space-y-2 animate-pulse">
          <div className="h-3 w-36 rounded bg-base-300" />
          <div className="h-5 w-56 max-w-full rounded bg-base-300" />
          <div className="h-3 w-28 rounded bg-base-300" />
          <div className="h-4 w-full max-w-md rounded bg-base-300" />
          <div className="h-4 w-5/6 max-w-sm rounded bg-base-300" />
        </div>
      ))}
    </div>
  )
}

export function ProjectGridSkeleton({ cards = 3 }) {
  return (
    <div className="grid md:grid-cols-3 gap-5" aria-hidden="true">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="card border border-base-300 overflow-hidden animate-pulse">
          <div className="aspect-video w-full bg-base-300" />
          <div className="card-body p-5 space-y-3">
            <div className="h-5 w-3/4 rounded bg-base-300" />
            <div className="h-4 w-full rounded bg-base-300" />
            <div className="h-4 w-5/6 rounded bg-base-300" />
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-16 rounded-full bg-base-300" />
              <div className="h-6 w-16 rounded-full bg-base-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
