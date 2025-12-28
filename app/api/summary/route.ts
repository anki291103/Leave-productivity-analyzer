export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getExpectedHours } from "@/lib/attendanceUtils"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get("month") // YYYY-MM

  if (!month) {
    return NextResponse.json(
      { error: "Month is required (YYYY-MM)" },
      { status: 400 }
    )
  }

  const startDate = new Date(`${month}-01`)
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + 1)

  const attendance = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate
      }
    },
    orderBy: { date: "asc" }
  })

  let expectedHours = 0
  let actualHours = 0
  let leavesUsed = 0

  for (const record of attendance) {
    expectedHours += getExpectedHours(record.date)
    actualHours += record.workedHours
    if (record.isLeave) leavesUsed++
  }

  const productivity =
    expectedHours > 0
      ? Number(((actualHours / expectedHours) * 100).toFixed(2))
      : 0

  return NextResponse.json({
    expectedHours,
    actualHours,
    leavesUsed,
    productivity,
    daily: attendance
  })
}
