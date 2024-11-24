"use client"

import * as React from "react"
import { Calculator, Calendar, CreditCard, Settings, Smile, User, Search } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CommandDialogMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleOpen = () => setOpen(true)

  return (
    <>
      <div className="flex items-center justify-center ">
        {/* Full input for larger screens */}
        <div className="hidden sm:flex text-sm text-muted-foreground cursor-pointer border items-center justify-center px-2 rounded-md">
          <Input 
            className="border-none outline-none cursor-pointer ring-none" 
            placeholder="Ask AI.."
            onClick={handleOpen}
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>
          </kbd>
          <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">J</span>
          </kbd>
        </div>

        {/* Search icon for small screens */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="sm:hidden"
          onClick={handleOpen}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Open command menu</span>
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  )
}