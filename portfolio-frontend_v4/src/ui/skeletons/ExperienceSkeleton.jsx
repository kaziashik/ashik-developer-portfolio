export default function ExperienceSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="border-l-2 border-base-300 pl-5 space-y-2">
          <div className="skeleton h-3 w-40" />
          <div className="skeleton h-5 w-64" />
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-4 w-full max-w-md" />
          <div className="skeleton h-4 w-5/6 max-w-sm" />
        </div>
      ))}
    </div>
  )
}
