"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserSearchMenu } from "./user-search-menu";
import { User } from "firebase/auth";
import { Label } from "@/components/ui/label";
import { log } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  addDocument,
  deleteByField,
  deleteDocument,
  updateDocument,
} from "@/lib/firestore-utils";
import { Collaborator, Form } from "@/types/types";
import { collection, doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteConfirmationDialog } from "../delete-confirmation";

export function AddCollaboratorsDialog({
  trigger,
  activeForm,
}: {
  trigger: React.ReactNode;
  activeForm: Form;
}) {
  const [isOpen, setIsOpen] = useState(false);
  //existing collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    ...activeForm.collaborators,
  ]);
  const [newCollaborators, setNewCollaborators] = useState<Collaborator[]>([]);
  const { toast } = useToast();
  const [savingChanges, setSavingChanges] = useState(false);

  const addNewCollaborator = (user: User) => {
    if (!collaborators.some((c) => c.email === user.email)) {
      setNewCollaborators([...newCollaborators, { ...user, role: "editor" }]);
    }
  };

  const removeCollaborator = (email: string) => {
    setNewCollaborators(newCollaborators.filter((c) => c.email !== email));
  };

  const handleSubmit = async () => {
    try {
      setSavingChanges(true);
      log(collaborators);
      await runTransaction(db, async (transaction) => {
        // Reference to the form document
        const formRef = doc(db, "forms", activeForm.id);

        // Update the form document with collaborators
        transaction.update(formRef, {
          ...activeForm,
          collaborators: [...newCollaborators, ...collaborators],
        });

        // Add documents to the sharedDocuments collection
        newCollaborators.forEach((collaborator: Collaborator) => {
          const sharedDocRef = doc(collection(db, "sharedDocuments")); // Auto-generate ID
          transaction.set(sharedDocRef, {
            formId: activeForm.formId,
            formName: activeForm.name,
            userId: collaborator.uid,
          });
        });

        setCollaborators([...collaborators, ...newCollaborators]);

        toast({
          title: "Collaborators added",
          description: "Refresh the page to see changes",
        });
      });

      setSavingChanges(false);
    } catch (err) {
      setSavingChanges(false);
      log(err);
      toast({
        title: "Error adding collaborators",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleRemoveExistingCollaborator = async (userId: string) => {
    try {
      setCollaborators(collaborators.filter((c) => c.uid !== userId));
      await deleteByField("sharedDocuments", "userId", userId);
      toast({
        title: "Collaborator removed",
        description: "Refresh the page to see changes",
      });
    } catch (err) {
      log(err);
      toast({
        title: "Error removing collaborator",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Collaborators</DialogTitle>
          <DialogDescription>
            Invite people to collaborate on this form. They&apos;ll receive an email
            invitation.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="existing">
          <TabsList className="w-full">
            <TabsTrigger value="existing" className="flex-1">
              Current
            </TabsTrigger>
            <TabsTrigger value="add" className="flex-1">
              Add
            </TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <Label>Your Collaborators</Label>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {collaborators.map((collaborator: Collaborator) => (
                <div
                  key={collaborator.email}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm text-gray-500">
                        {collaborator.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <select
                      value={collaborator.role}
                      onChange={(e) => {
                        const newRole = e.target.value as "editor" | "viewer";
                        setCollaborators(
                          collaborators.map((c) =>
                            c.email === collaborator.email
                              ? { ...c, role: newRole }
                              : c
                          )
                        );
                      }}
                      className="mr-2 rounded border p-1 text-sm"
                    >
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <DeleteConfirmationDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      }
                      onDelete={()=>{handleRemoveExistingCollaborator(collaborator.uid)}}
                      title={"Are you sure?"}
                      description={`${collaborator.displayName} will be removed as a collaborator`}
                    />
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="add">
            <div className="grid gap-4 py-4">
              <UserSearchMenu onSelect={addNewCollaborator} />
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {newCollaborators.map((collaborator: Collaborator) => (
                  <div
                    key={collaborator.email}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm text-gray-500">
                          {collaborator.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <select
                        value={collaborator.role}
                        onChange={(e) => {
                          const newRole = e.target.value as "editor" | "viewer";
                          setCollaborators(
                            collaborators.map((c) =>
                              c.email === collaborator.email
                                ? { ...c, role: newRole }
                                : c
                            )
                          );
                        }}
                        className="mr-2 rounded border p-1 text-sm"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeCollaborator(collaborator.email || "")
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={savingChanges}
              >
                {savingChanges && <Loader2 className="animate-spin" />}
                Add
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
