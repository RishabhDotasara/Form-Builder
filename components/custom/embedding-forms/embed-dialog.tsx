'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Code, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EmbedDialog({ formId , trigger}: { formId: string, trigger?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`<iframe src="${window?.origin}/form/share/${formId}"/>`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!trigger ? <Button variant="outline" size="icon">
          <Code/>
          <span className="sr-only">Open embed dialog</span>
        </Button> : trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Embed Form</DialogTitle>
          <DialogDescription>
            Copy the IFrame and follow the instructions to embed this form in your application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="formId" className="text-right">
              Iframe 
            </Label>
            <div className="col-span-3 flex">
              <Input
                id="formId"
                value={`<iframe src="${window?.origin}/form/share/${formId}"/>`}
                readOnly
                className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="button"
                variant="secondary"
                className="rounded-l-none px-3"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
          <h4 className="font-medium text-foreground">Instructions:</h4>
          <ol className="list-decimal pl-4 space-y-2">
            <li>Use iframe to embed the form, copy the given link and paste it in your code.</li>
          </ol>
          {/* <pre className="rounded-md bg-primary-foreground p-2 font-mono text-xs text-primary">
            {`<EmbedForm formId="${formId}" />`}
          </pre> */}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

