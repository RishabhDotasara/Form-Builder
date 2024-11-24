import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function ImageUploadType({questionId, isEditing}:{questionId:string, isEditing:Boolean}) {
  return (
    <div className="mt-2">
      <Label htmlFor={`${questionId}-image`} className="block mb-2">
        Upload Image
      </Label>
      <Input
        id={`${questionId}-image`}
        type="file"
        accept="image/*"
        disabled={!isEditing}
      />
    </div>
  );
}
