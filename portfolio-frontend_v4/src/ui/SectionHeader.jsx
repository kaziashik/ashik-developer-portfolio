export default function SectionHeader({ label, title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 ${className}`}>
      <div>
        <p className="eyebrow text-primary text-xs mb-2 uppercase tracking-widest">{label}</p>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-base-content leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base-content/60 text-sm mt-2 max-w-xl leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
