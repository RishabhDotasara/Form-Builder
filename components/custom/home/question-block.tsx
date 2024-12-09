import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { QuestionType } from "@/types/types";
import { SelectValue } from "@radix-ui/react-select";
import { AlignLeft, ImageIcon, List, PlusCircle } from "lucide-react";

const QuestionTypeSelector = ({addQuestion}:{addQuestion:Function}) => {
    return (
      <Select onValueChange={(value: QuestionType) => addQuestion(value)}>
        <SelectTrigger className="w-fit">
          <PlusCircle className="h-4 w-4 font-light mr-2" />
          {/* <SelectValue placeholder="Add" /> */}
          Add
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">
            <div className="flex items-center">
              <AlignLeft className="mr-2 h-4 w-4" />
              Text Question
            </div>
          </SelectItem>
          <SelectItem value="multipleChoice">
            <div className="flex items-center">
              <List className="mr-2 h-4 w-4" />
              Multiple Choice
            </div>
          </SelectItem>
          <SelectItem value="imageUpload">
            <div className="flex items-center">
              <ImageIcon className="mr-2 h-4 w-4" />
              Image Upload
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  };

export default QuestionTypeSelector;