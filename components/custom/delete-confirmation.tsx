"use client"

import * as React from "react"
import { Loader2, Trash2 } from 'lucide-react'
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

interface DeleteConfirmationDialogProps {
  title: string
  description: string
  onDelete: () => void
  trigger?: React.ReactNode,
}

export function DeleteConfirmationDialog({
  title,
  description,
  onDelete,
  trigger,
}: DeleteConfirmationDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [IsDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    await onDelete()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={IsDeleting}
          >
            {IsDeleting && <Loader2 className="animate-spin"/>}
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

