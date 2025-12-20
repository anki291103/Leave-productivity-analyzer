import * as XLSX from "xlsx"
import { PrismaClient } from "@prisma/client"
import {
  calculateWorkedHours,
  isLeaveDay
} from "@/lib/attendanceUtils"

const prisma = new PrismaClient()

// ✅ Convert Excel time (number or string) → "HH:MM"
function excelTimeToString(value: any): string | null {
  if (value === null || value === undefined || value === "") return null

  if (typeof value === "string") return value

  if (typeof value === "number") {
    const totalMinutes = Math.floor(value * 24 * 60 + 0.5)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`
  }

  return null
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file uploaded" }),
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null })

    for (const row of rows) {
      const employeeName = row["Employee Name"]
      const rawDate = row["Date"]

      if (!employeeName || !rawDate) continue

      // ✅ Date normalization (all Excel cases)
      let date: Date
      if (typeof rawDate === "number") {
        date = new Date(Math.round((rawDate - 25569) * 86400 * 1000))
      } else {
        const parsed = new Date(rawDate)
        if (isNaN(parsed.getTime())) continue
        date = new Date(
          parsed.getFullYear(),
          parsed.getMonth(),
          parsed.getDate()
        )
      }

      let employee = await prisma.employee.findFirst({
        where: { name: employeeName }
      })

      if (!employee) {
        employee = await prisma.employee.create({
          data: { name: employeeName }
        })
      }

 const inTime = excelTimeToString(row["In-Time"]) ?? undefined
const outTime = excelTimeToString(row["Out-Time"]) ?? undefined


      const workedHours = calculateWorkedHours(inTime, outTime)
      const leave = isLeaveDay(date, inTime, outTime)

      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date,
          inTime,
          outTime,
          workedHours,
          isLeave: leave
        }
      })
    }

    return new Response(
      JSON.stringify({ message: "Excel file processed successfully" }),
      { status: 200 }
    )
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err?.message || err)
    return new Response(
      JSON.stringify({ error: "Failed to process file" }),
      { status: 500 }
    )
  }
}
