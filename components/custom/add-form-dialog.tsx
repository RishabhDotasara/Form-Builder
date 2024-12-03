import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { log } from "@/lib/utils";
import { addDocument, updateDocument } from "@/lib/firestore-utils";
import { Loader, Loader2 } from "lucide-react";
import { Form } from "@/types/types";
import { useRouter } from "next/navigation";

export function AddFormDialog({
  openDialog,
  setOpen,
  category,
  TocategoryData,

}: {
  openDialog: boolean | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
  category: string;
  TocategoryData: any;

}) {
  const [formName, setFormName] = useState("");
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [IsSaving, setIsSaving] = useState(false);
  const router = useRouter()

  useEffect(() => {
    localStorage.getItem("user") ? setUserId(JSON.parse(localStorage.getItem("user") || "").uid) : router.push("/signin");
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formName) {
      toast({
        title: "Invalid Form Name!",
        variant: "destructive",
      });
      return;
    }
    try {
      //prepare the form to save
      setIsSaving(true);
      const id = new Date().getTime().toString();
      const formData:Omit<Form, "id"> = {
        formId: id,
        name: formName,
        userId: userId || "",
        questions: [],
        responses: [],
        collaborators:[]
      };

      //this is what goes to forms field in category data
      const categoryFormData = {
        formId: id,
        formName: formName,
      };

      //this is what goes to category collection
      const newCategoryData = {
        ...TocategoryData,
        forms: [...TocategoryData.forms, categoryFormData],
      };

      const res = await addDocument("forms", formData);
      //update the category data
      const res2 = await updateDocument("category", category, newCategoryData);
      // console.log(res);
      setIsSaving(false);
      setOpen(false);
    } catch (err) {
      setIsSaving(false);
      toast({
        title: "Error Creating Form",
        description: "Please Try Again!",
        variant: "destructive",
      });
      log("Error:" + err);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Form</DialogTitle>
          <DialogDescription>Enter a name for the new form.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="form-name" className="text-right">
                Name
              </Label>
              <Input
                id="form-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={IsSaving} onClick={handleSubmit}>
              Add Form {IsSaving && <Loader2 className="ml-2 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
