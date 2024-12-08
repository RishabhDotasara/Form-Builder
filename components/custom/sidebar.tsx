import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  Boxes,
  ChevronDown,
  Delete,
  DeleteIcon,
  File,
  Files,
  FileText,
  Library,
  Plus,
  Trash2Icon,
} from "lucide-react";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { H4 } from "../ui/h4";
import { H3 } from "../ui/h3";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Small } from "../ui/small";
import { Large } from "../ui/large";
import { P } from "../ui/p";
import { ScrollArea } from "../ui/scroll-area";
import UserMenu from "./user-menu";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AddFormDialog } from "./add-form-dialog";
import { AddCollectionDialog } from "./add-collection-dialog";
import { Skeleton } from "../ui/skeleton";
import { log } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  deleteByFormId,
  deleteDocument,
  getAllMyDocuments,
  getFormByFormId,
  updateDocument,
} from "@/lib/firestore-utils";
import { Category, Form, sharedForms } from "@/types/types";
import { DeleteConfirmationDialog } from "./delete-confirmation";

export default function SideBar({
  categories,
  setCategories,
  activeForm,
  setActiveForm,
  sharedForms,
}: {
  categories: Category[] | undefined;
  activeForm: any;
  setActiveForm: any;
  setCategories: any;
  sharedForms: sharedForms[] | null;
}) {
  // const [activeCategory, setActiveCategory] = useState(categories.length > 0 ? categories[0].name : );
  const [toCreateFormCategory, setCreateFormCategory] = useState(""); //id for the form creating category
  const [toCreateCategoryData, setCategoryData] = useState<any>();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const { toast } = useToast();
  //user states

  const addForm = (categoryName: string, formName: string) => {
    setCategories(
      categories?.map((category: any) =>
        category.name === categoryName
          ? { ...category, forms: [...category.forms, formName] }
          : category
      )
    );
  };

  //using formId
  const getFormById = async (id: string) => {
    try {
      setIsLoadingForm(true);
      //get form from forms collectuion using the formId field using firestore methods
      const res = await getFormByFormId(id, (data: Form | null) => {
        setIsLoadingForm(false);
        setActiveForm(data);
      });
      console.log(res);
      setIsLoadingForm(false);
    } catch (err) {
      log("Error fetching Form, try again.");
      toast({
        title: "Error Fetching Form.",
        description: "Please Try Again!",
        variant: "destructive",
      });
    }
  };

  const handleCollectionDelete = async (id: string) => {
    try {
      //delete the forms first
      const forms = categories?.filter(
        (category: Category) => category.id === id
      )[0].forms;
      forms?.forEach(async (form: any) => {
        console.log(form);
        await deleteByFormId("forms",form.formId);
      });
      //now delete the category
      await deleteDocument("category", id);

      setCategories(
        categories?.filter((category: Category) => category.id !== id)
      );

      toast({
        title: "Collection Deleted",
        description: "Collection and all its forms have been deleted!",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Deleting Collection",
        description: "Please Try Again!",
        variant: "destructive",
      });
    }
  };

  const handleFormDeletion = async (formId: string, categoryId: string) => {
    try {
      await deleteByFormId(formId, "forms");
      await deleteByFormId(formId, "sharedDocuments")
      toast({
        title: "Form Deleted!",
        description: "Form has been deleted! Refresh to see changes.",
      });
      const category = categories?.filter(
        (category: Category) => category.id === categoryId
      )[0];
      updateDocument("category", categoryId, {
        ...category,
        forms: category?.forms.filter((form: any) => form.formId !== formId),
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Deleting Form",
        description: "Please Try Again!",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="bg-background ">
      <AddFormDialog
        openDialog={formDialogOpen}
        setOpen={setFormDialogOpen}
        category={toCreateFormCategory}
        TocategoryData={toCreateCategoryData}
        getForm={getFormById}
      />
      <AddCollectionDialog
        open={collectionDialogOpen}
        setOpen={setCollectionDialogOpen}
      />
      <SidebarHeader className="border border-b-muted">
        <H3 className="flex justify-center items-center gap-2">
          {/* <FileText className=" text-purple-600" /> */}
          <TextGenerateEffect words="FormAI" />
        </H3>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="mb-4">
          <SidebarMenu className="">
            <SidebarGroup>
              <SidebarGroupLabel>Your Forms</SidebarGroupLabel>
              <SidebarGroupContent>
                {!categories && (
                  <div className="flex flex-col gap-2 p-2 items-center ">
                    <Skeleton className="w-full h-8 px-2" />
                    <Skeleton className="w-full h-8 px-2" />
                    <Skeleton className="w-full h-8 px-2" />
                  </div>
                )}
                {categories &&
                  categories.map((category: any, index: number) => (
                    <Collapsible className="group/collapsible" key={index}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger className="flex justify-between items-center w-full py-2 hover:bg-purple-50 dark:hover:bg-background hover:text-primary px-4">
                          <Files className="h-4 w-4 mr-2" />
                          <Large className="text-semibold">
                            {category.name}
                          </Large>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {category.forms &&
                              category.forms.map((form: any, index: number) => (
                                <div
                                  className="flex w-full justify-between"
                                  key={index}
                                >
                                  <SidebarMenuItem
                                    key={form.formId}
                                    className="w-full"
                                  >
                                    <SidebarMenuButton
                                      onClick={() => {
                                        getFormById(form.formId);
                                      }}
                                      className=" hover:bg-purple-50  text-muted-foreground hover:text-primary"
                                    >
                                      <P className="py-2 flex items-center gap-2">
                                        <File className="h-4 w-4 "/>
                                        {form.formName.length < 10
                                          ? form.formName
                                          : form.formName.substring(0, 13) +
                                            "..."}
                                      </P>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                  <DeleteConfirmationDialog
                                    title="Are you Sure?"
                                    description="The form will be deleted. This action can't be undone!"
                                    trigger={
                                      <Button variant={"ghost"}>
                                        <Trash2Icon />
                                      </Button>
                                    }
                                    onDelete={() => {
                                      handleFormDeletion(
                                        form.formId,
                                        category.id
                                      );
                                    }}
                                  />
                                </div>
                              ))}

                            {!category.forms && (
                              <SidebarMenuItem>No Forms</SidebarMenuItem>
                            )}
                            <SidebarMenuSubItem>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-purple-50"
                                onClick={() => {
                                  setCreateFormCategory(category.id);
                                  setCategoryData(category);
                                  setFormDialogOpen(true);
                                }}
                              >
                                <P className="flex justify-between items-center">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Form
                                </P>
                              </Button>
                              <DeleteConfirmationDialog
                                title="You sure want to delete this collection?"
                                description="It will delete all forms in this collection. This can't be undone!"
                                onDelete={() => {
                                  handleCollectionDelete(category.id);
                                }}
                                trigger={
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-red-50"
                                  >
                                    <P className="flex justify-between items-center">
                                      <DeleteIcon className="w-4 h-4 mr-2" />
                                      Delete Collection
                                    </P>
                                  </Button>
                                }
                              />
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ))}

                {categories && categories.length == 0 && (
                  <SidebarMenuItem className="text-center">
                    No Collections
                  </SidebarMenuItem>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Shared To You</SidebarGroupLabel>
              <SidebarGroupContent>
                {!sharedForms && (
                  <div className="flex flex-col gap-2 p-2 items-center ">
                    <Skeleton className="w-full h-8 px-2" />
                    <Skeleton className="w-full h-8 px-2" />
                    <Skeleton className="w-full h-8 px-2" />
                  </div>
                )}
                {sharedForms &&
                  sharedForms.map((form: sharedForms, index: number) => (
                    <SidebarMenuItem key={form.formId} className="w-full">
                      <SidebarMenuButton
                        onClick={() => {
                          getFormById(form.formId);
                        }}
                        // variant={"outline"}
                        className=" hover:bg-purple-50  text-muted-foreground hover:text-primary"
                      >
                        <P className="py-2 flex items-center gap-2">
                        <File className="h-4 w-4 "/>
                          {form.formName.length < 10
                            ? form.formName
                            : form.formName.substring(0, 13) + "..."}
                        </P>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                {sharedForms && sharedForms.length == 0 && (
                  <SidebarMenuItem className=" text-center">
                    No Shared Form
                  </SidebarMenuItem>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarMenu>
          <Button
            variant="ghost"
            className="w-full justify-start mt-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => {
              setCollectionDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Collection
          </Button>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="h-20">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
