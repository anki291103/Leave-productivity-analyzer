"use client"

export default function UploadBox() {
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    await fetch("/api/upload", {
      method: "POST",
      body: formData
    })

    alert("Excel uploaded successfully!")
    window.location.reload()
  }

  return (
    <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all px-6 py-3 rounded-xl shadow-lg hover:scale-105">
      📂 Upload Excel
      <input
        type="file"
        accept=".xlsx"
        onChange={handleUpload}
        hidden
      />
    </label>
  )
}
