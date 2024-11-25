import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FormQuestionProps {
  id: string
  question: string
  required: boolean
  type: string
  onChange: (id: string, value: string) => void
}

export function FormQuestion({ id, question, required, type, onChange }: FormQuestionProps) {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value)
    onChange(id, e.target.value)
  }

  return (
    <div className="mb-6">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {question}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {type === 'text' ? (
        <Input
          type="text"
          id={id}
          value={value}
          onChange={handleChange}
          required={required}
          className="w-full"
        />
      ) : type === 'textarea' ? (
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          required={required}
          className="w-full"
        />
      ) : null}
    </div>
  )
}

