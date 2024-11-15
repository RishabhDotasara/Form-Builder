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
  Library,
  Plus,
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

export default function SideBar({
  categories,
  setCategories,
  activeForm,
  setActiveForm,
}: {
  categories: any;
  activeForm: any;
  setActiveForm: any;
  setCategories: any;
}) {

 
  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  //user states
  
  const addCategory = (name: string) => {
    setCategories([...categories, { name, forms: [] }]);
  };

  const addForm = (categoryName: string, formName: string) => {
    setCategories(
      categories.map((category: any) =>
        category.name === categoryName
          ? { ...category, forms: [...category.forms, formName] }
          : category
      )
    );
  };

  return (
    <Sidebar className="bg-background ">
      <SidebarHeader className="border border-b-muted">
        <H3 className="flex justify-center">
          <TextGenerateEffect words="FormAI" />
        </H3>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="mb-4">
          <SidebarMenu className="">
            {categories.map((category: any) => (
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger className="flex justify-between items-center w-full py-2 hover:bg-purple-50 hover:text-primary px-4">
                    <Boxes className="h-4 w-4 mr-2" />
                    <Large className="text-semibold">{category.name}</Large>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {category.forms.map((form: any) => (
                        <SidebarMenuItem key={form}>
                          <SidebarMenuButton
                            onClick={() => {
                              setActiveCategory(category.name);
                              setActiveForm(form);
                            }}
                            className=" hover:bg-purple-50  text-muted-foreground hover:text-primary"
                          >
                            <P className="py-2">{form}</P>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                      <SidebarMenuSubItem>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-purple-50"
                          onClick={() => {
                            const formName = prompt("Enter new form name:");
                            if (formName) addForm(category.name, formName);
                          }}
                        >
                          <P className="flex justify-between items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Form
                          </P>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-red-50"
                          onClick={() => {
                            const formName = prompt("Enter new form name:");
                            if (formName) addForm(category.name, formName);
                          }}
                        >
                          <P className="flex justify-between items-center">
                            <DeleteIcon className="w-4 h-4 mr-2" />
                            Delete Collection
                          </P>
                        </Button>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
          <Button
            variant="ghost"
            className="w-full justify-start mt-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            onClick={() => {
              const categoryName = prompt("Enter new category name:");
              if (categoryName) addCategory(categoryName);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="h-20">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
