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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
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
            Copy the form ID and follow the instructions to embed this form in your application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="formId" className="text-right">
              Form ID
            </Label>
            <div className="col-span-3 flex">
              <Input
                id="formId"
                value={formId}
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
            <li>Install our SDK: <code className="text-primary">npm install @formAI/form-sdk</code></li>
            <li>Import the Form component: <code className="text-primary">import &#123; EmbedForm &#125; from &apos;@formAI/form-sdk&apos;</code></li>
            <li>Use the EmbedForm component in your React application:</li>
            <li>For more information, read the <Link href={"#"} className='text-primary hover:underline'>Docs</Link></li>
          </ol>
          <pre className="rounded-md bg-primary-foreground p-2 font-mono text-xs text-primary">
            {`<EmbedForm formId="${formId}" />`}
          </pre>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => document.getElementById('closeDialog')?.click()}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

