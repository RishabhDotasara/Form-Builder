import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function TextType({isEditing}:{isEditing:Boolean}) {
  return (
    <Textarea
      placeholder="Enter your answer"
      disabled={true}
      className="w-full mt-2"
    />
  );
}
