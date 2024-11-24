import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddCollectionDialog({open, setOpen}:{open:boolean | undefined, setOpen:(open:boolean)=>void}) {

  const [collectionName, setCollectionName] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the collectionName to your database
    console.log('Adding collection:', collectionName)
    setOpen(false)
    setCollectionName('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
     
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Form Collection</DialogTitle>
          <DialogDescription>
            Enter a name for the new form collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="collection-name" className="text-right">
                Name
              </Label>
              <Input
                id="collection-name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Collection</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

