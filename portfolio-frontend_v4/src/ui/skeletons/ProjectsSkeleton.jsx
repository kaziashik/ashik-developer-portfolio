export default function ProjectsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card border border-base-300 overflow-hidden md:flex">
            <div className="skeleton aspect-video md:w-[46%] md:aspect-auto md:min-h-[240px]" />
            <div className="card-body p-6 space-y-3 flex-1">
              <div className="skeleton h-6 w-2/3" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card border border-base-300 overflow-hidden">
            <div className="skeleton aspect-video w-full" />
            <div className="card-body p-5 space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
