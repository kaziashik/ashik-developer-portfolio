export default function HeroSkeleton() {
  return (
    <section className="hero-section page-container">
      <div className="hero-grid">
        <div className="mx-auto md:mx-0 w-full max-w-[272px]">
          <div className="skeleton aspect-square rounded-xl w-full" />
          <div className="skeleton h-8 w-full mt-3 rounded-lg" />
        </div>
        <div className="min-w-0 space-y-3">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-10 w-full max-w-md" />
          <div className="skeleton h-10 w-4/5 max-w-sm" />
          <div className="skeleton h-16 w-full max-w-lg" />
          <div className="skeleton h-8 w-64 rounded-full" />
          <div className="flex gap-3">
            <div className="skeleton h-9 w-32 rounded-full" />
            <div className="skeleton h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
