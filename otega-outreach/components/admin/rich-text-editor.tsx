"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Import the editor component dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

// Import the styles for the editor
import "react-quill/dist/quill.snow.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
]

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [editorValue, setEditorValue] = useState(value)

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update the editor value when the prop changes
  useEffect(() => {
    setEditorValue(value)
  }, [value])

  const handleChange = (content: string) => {
    setEditorValue(content)
    onChange(content)
  }

  if (!mounted) {
    return (
      <div className="border rounded-md p-4 h-64 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="h-64 mb-12"
      />
    </div>
  )
}
