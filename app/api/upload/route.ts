import * as XLSX from "xlsx"
import { PrismaClient } from "@prisma/client"
import {
  calculateWorkedHours,
  isLeaveDay
} from "@/lib/attendanceUtils"

const prisma = new PrismaClient()

// Allowed Excel cell types
type ExcelCell = string | number | null

// Row structure coming from Excel
interface ExcelRow {
  "Employee Name": string
  Date: ExcelCell
  "In-Time"?: ExcelCell
  "Out-Time"?: ExcelCell
}

// Convert Excel time (number | string | null) → "HH:MM"
function excelTimeToString(value: ExcelCell): string | null {
  if (value === null || value === undefined || value === "") return null

  if (typeof value === "string") return value

  if (typeof value === "number") {
    const totalMinutes = Math.round(value * 24 * 60)
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
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "No file uploaded" }),
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet, {
      defval: null
    })

    for (const row of rows) {
      const employeeName = row["Employee Name"]
      const rawDate = row.Date

      if (!employeeName || !rawDate) continue

      // ---- DATE NORMALIZATION ----
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

      const inTime =
        excelTimeToString(row["In-Time"] ?? null) ?? undefined
      const outTime =
        excelTimeToString(row["Out-Time"] ?? null) ?? undefined

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
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error"

    console.error("UPLOAD ERROR:", message)

    return new Response(
      JSON.stringify({ error: "Failed to process file" }),
      { status: 500 }
    )
  }
}
