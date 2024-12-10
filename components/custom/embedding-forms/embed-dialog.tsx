import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Code } from 'lucide-react'
import React from 'react'

export default function EmbedDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
            <Code/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
       
        This is the Content
        
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
