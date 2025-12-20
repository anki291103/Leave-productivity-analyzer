"use client"

import { motion } from "framer-motion"

interface AttendanceRecord {
  id: string
  date: string
  inTime: string | null
  outTime: string | null
  workedHours: number
  isLeave: boolean
}

type Props = {
  records: AttendanceRecord[]
}

export default function AttendanceTable({ records }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
    >
      <table className="w-full text-sm">
        <thead className="bg-gray-700 text-gray-300">
          <tr>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-center">In</th>
            <th className="p-4 text-center">Out</th>
            <th className="p-4 text-center">Hours</th>
            <th className="p-4 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r, i) => (
            <tr
              key={r.id}
              className={`border-b border-gray-700 transition hover:bg-gray-700 ${
                i % 2 === 0 ? "bg-gray-800" : "bg-gray-850"
              }`}
            >
              <td className="p-4">
                {new Date(r.date).toDateString()}
              </td>

              <td className="p-4 text-center">
                {r.inTime || "-"}
              </td>

              <td className="p-4 text-center">
                {r.outTime || "-"}
              </td>

              <td className="p-4 text-center">
                {r.workedHours}
              </td>

              <td className="p-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    r.isLeave
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {r.isLeave ? "Leave" : "Present"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
