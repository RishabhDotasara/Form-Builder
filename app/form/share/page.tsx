'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FormQuestion } from "@/components/form-question"

interface FormData {
  id: string
  question: string
  required: boolean
  type: string
}

// This would typically come from your API or database
const mockFormData: FormData[] = [
  {
    id: "1732471369333",
    question: "Title of the first test form.",
    required: true,
    type: "text"
  },
  {
    id: "1732471369334",
    question: "Please provide a detailed description.",
    required: false,
    type: "textarea"
  },
  {
    id: "1732471369335",
    question: "What is your favorite color?",
    required: true,
    type: "text"
  }
]

export default function SharedFormPage() {
  const params = useParams()
  const formId = params.id as string
  const [formResponses, setFormResponses] = useState<Record<string, string>>({})

  // In a real application, you would fetch the form data based on the formId
  const formData = mockFormData

  const handleQuestionChange = (id: string, value: string) => {
    setFormResponses(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the formResponses to your backend
    console.log('Form responses:', formResponses)
    // You could also show a success message or redirect the user
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Formai Shared Form</CardTitle>
          <CardDescription className="text-center">Please fill out the form below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {formData.map((question) => (
              <FormQuestion
                key={question.id}
                id={question.id}
                question={question.question}
                required={question.required}
                type={question.type}
                onChange={handleQuestionChange}
              />
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Submit</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

