"use client"

import { useEffect, useState } from "react"
import UploadBox from "@/components/UploadBox"
import StatsCard from "@/components/StatsCard"
import AttendanceTable from "@/components/AttendanceTable"
import LoadingSkeleton from "@/components/LoadingSkeleton"

interface SummaryData {
  expectedHours: number
  actualHours: number
  leavesUsed: number
  productivity: number
  daily: AttendanceRecord[]
}

interface AttendanceRecord {
  id: string
  date: string
  inTime: string | null
  outTime: string | null
  workedHours: number
  isLeave: boolean
}

export default function Dashboard() {
  const [month, setMonth] = useState("2024-01")
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    fetch(`/api/summary?month=${month}`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        setLoading(false)
      })
  }, [month])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white p-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-4xl">📊</span>
        <h1 className="text-4xl font-bold">
          Leave & Productivity Dashboard
        </h1>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-6 mb-10">
        <UploadBox />
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="bg-gray-800 px-4 py-2 rounded-lg text-white"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <LoadingSkeleton />
      ) : data ? (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatsCard
              title="Expected Hours"
              value={data.expectedHours}
            />
            <StatsCard
              title="Worked Hours"
              value={data.actualHours.toFixed(2)}
            />
            <StatsCard
              title="Leaves Used"
              value={`${data.leavesUsed} / 2${
                data.leavesUsed > 2 ? " (Exceeded)" : ""
              }`}
            />
            <StatsCard
              title="Productivity"
              value={`${data.productivity}%`}
              highlight
              percentage={data.productivity}
            />
          </div>

          {/* TABLE */}
          <AttendanceTable records={data.daily} />
        </>
      ) : null}
    </main>
  )
}
