import { Textarea } from '@/components/ui/textarea'
import React from 'react'

export default function Description({isEditing}:{isEditing:Boolean}) {
  return (
    <Textarea
      placeholder="Enter the description"
      disabled={!isEditing}
      className="w-full mt-2"
    />
  )
}
