export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-24 bg-gray-800 rounded-xl"
          />
        ))}
      </div>

      <div className="h-64 bg-gray-800 rounded-xl" />
    </div>
  )
}
