import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Question } from '@/types/types'
import React from 'react'

export default function UserFacingImageType({question, ...rest}:{question:Question}) {
  return (
    <div className="mt-2">
    
      <Input
        id={`${ question.id}-image`}
        type="file"
        accept="image/*"
        {...rest}
      />
    </div>
  )
}
