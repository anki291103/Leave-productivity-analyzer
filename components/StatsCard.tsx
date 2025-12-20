import { motion } from "framer-motion"

type Props = {
  title: string
  value: string | number
  highlight?: boolean
  percentage?: number
}

export default function StatsCard({
  title,
  value,
  highlight,
  percentage
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl p-6 shadow-xl ${
        highlight
          ? "bg-gradient-to-r from-green-500 to-emerald-600"
          : "bg-gray-800"
      }`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>

      {percentage !== undefined && (
        <div className="mt-4 w-full bg-black/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}
