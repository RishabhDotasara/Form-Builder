import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { isGeneratorObject } from "util/types";

export function ResponsesTab({ responses }: { responses: any[] }) {
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  const { toast } = useToast();
  const totalResponses = responses.length;
  const lastResponseDate =
    responses.length > 0 ? responses[0].dateResponded : "N/A";

  const prepareData = async ()=>{
    try 
    {
      const data = responses.map((response:any)=>{
        const {id, ...rest} ={
          "Username":response.userName,
          ...response.responses,
          "Submitted At":new Date(response.dateResponded).toLocaleString()
        }

        return rest
      })


      return data;
    }
    catch(err)
    {
      console.log(err)
      toast({
        title:"Error Generating Excel!",
        description:"Please Try Again.",
        variant:"destructive"
      })
    }
  }

  const generateExcel = async () => {
    try {
      setIsGeneratingExcel(true);
      //preapare the fucking data to generate the excel
      const jsonData = await prepareData()
      // @ts-ignore
      const ws = XLSX.utils.json_to_sheet(jsonData);

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      XLSX.writeFile(wb, "data.xlsx");
      setIsGeneratingExcel(false);
    } catch (err) {
      console.log(err);
      setIsGeneratingExcel(false);
      toast({
        title: "Error Generating Excel!",
        description: "Please Try Again.",
        variant: "destructive",
      });
    } 
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* {JSON.stringify(responses)} */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Response Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastResponseDate}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button onClick={generateExcel} disabled={isGeneratingExcel}>
          {isGeneratingExcel && <Loader2 className="animate-spin mr-2"/>}
          {isGeneratingExcel ? "Generating..." : "Generate Excel"}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
      {/* <ScrollArea className="h-[400px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UserName</TableHead>
              <TableHead>Submitted At</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index:number) => (
              <TableRow key={index}>
                <TableCell>{response.id}</TableCell>
                <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea> */}
    </div>
  );
}
