import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'



export function ResponsesTab({ responses }: { responses: any[] }) {
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false)

  const totalResponses = responses.length
  const lastResponseDate = responses.length > 0 
    ? responses[0].dateResponded
    : 'N/A'

  const generateExcel = async () => {
    setIsGeneratingExcel(true)
    try {
      const res = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'responses.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating Excel file:', error)
    } finally {
      setIsGeneratingExcel(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Response Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastResponseDate}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button onClick={generateExcel} disabled={isGeneratingExcel}>
          {isGeneratingExcel ? 'Generating...' : 'Generate Excel'}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
      {/* <ScrollArea className="h-[400px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UserName</TableHead>
              <TableHead>Submitted At</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index:number) => (
              <TableRow key={index}>
                <TableCell>{response.id}</TableCell>
                <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea> */}
    </div>
  )
}

