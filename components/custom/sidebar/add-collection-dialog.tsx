import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addDocument } from "@/lib/firestore-utils";
import { Loader2 } from "lucide-react";
import {useQueryClient} from "@tanstack/react-query"

export function AddCollectionDialog({
  open,
  setOpen,
}: {
  open: boolean | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [collectionName, setCollectionName] = useState("");
  const { toast } = useToast();
  const [IsCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient()
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!collectionName) {
      toast({
        title: "Invalid Category Name!",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const userId = JSON.parse(localStorage.getItem("user") as string).uid || "";
      const data = {
        name: collectionName,
        forms: [],
        userId: userId,
      };
      const category = await addDocument("category", data);
      toast({
        title: `Created ${data.name}`,
        description: "You can start adding forms.",
      });

      // invalidate the documents in sidebar
      queryClient.invalidateQueries({queryKey:["userDocuments"]})
      setIsCreating(false);
      setOpen(false)
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      toast({
        title: "Error Creating the Category",
        description: "Please Try Again!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.altKey) &&  e.key ===  "c") {
        e.preventDefault();
        setOpen((visible) => !visible);
        if (!open) {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

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
                ref={inputRef}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={IsCreating}>
              Add Collection{" "}
              {IsCreating && <Loader2 className="animate-spin ml-2" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
