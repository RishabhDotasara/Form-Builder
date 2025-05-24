"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, log } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllDocuments } from "@/lib/firestore-utils";
import { User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {useQuery} from "@tanstack/react-query";

export function UserSearchMenu({
  onSelect,
}: {
  onSelect: (user: User) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);
  const { toast } = useToast();
  const getUsersByQuery = async () => {
    try {
      let users:any;
      if (value)
      {
        users = await getAllDocuments("users", 5, "email", value);
        console.log(`${value}`, users);
      }
      else 
      {
        users = await getAllDocuments("users", 5);
      }
      setUsers(users.map((user:any)=>{return {...user, uid:user.id}}));
      log(users.map((user:any)=>{return {...user, uid:user.id}}))
    } catch (err) {
      log(err);
      toast({
        title: "Error fetching users",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserByEmailQuery = useQuery({
    queryKey: ["users", value],
    queryFn: getUsersByQuery,
    enabled: Boolean(value),
  })

  // React.useEffect(()=>{
  //   getUsersByQuery()
  // },[])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          
            Select user...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command >
          <CommandInput placeholder="Search users by email..." value={value} onValueChange={setValue}/>
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandList>
          <CommandGroup>
            {users.map((user:User) => (
              <CommandItem
                key={user.uid}
                onSelect={() => {
                  setValue(user.email as string);
                  setOpen(false);
                  onSelect(user);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === user.email ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center">
                  <img
                    src={user.photoURL as string}
                    alt={user.displayName as string}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <div>
                    <div>{user.displayName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
