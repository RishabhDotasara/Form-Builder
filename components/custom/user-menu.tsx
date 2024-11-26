'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {  Settings, HelpCircle, LogOut, ChevronUp, UserIcon } from 'lucide-react'
import { handleLogout } from '@/lib/auth-utils'
import { useToast } from '@/hooks/use-toast'
import { auth } from '@/lib/firebase'
import { User } from 'firebase/auth'
import { useRouter } from 'next/navigation'



export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const {toast} = useToast()
  const router = useRouter()
  const [user, setUser] = useState<User | null>()
  useEffect(() => {
    // @ts-ignore
    const storedUser: User | null = JSON.parse(localStorage.getItem("user"));
    // console.log(storedUser)
    setUser(storedUser)
  }, []);
  const handleuserLogout = async ()=>{
    try 
    {
      const res = await handleLogout()
      if (res)
      {
        toast({
          title:"Logged Out Successfully!"
        })
        router.push("/signin")
      }
      else 
      {
        toast({
          title:"Error Logging You Out!",
          description:"Please Try Again."
        })
      }
    }
    catch(err)
    {
      console.error(err)
      
    }
  }

  return (
    <div className="border-t border-border bg-background">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="themed" className="w-full justify-start px-4 py-8  hover:bg-purple-50 hover:text-primary">
            <div className="flex items-center justify-between">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={user?.photoURL as string} alt={user?.displayName as string} />
                <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">{user?.displayName}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              {/* <ChevronUp className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} /> */}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleuserLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}