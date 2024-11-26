import { useState, useMemo } from "react";
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
import { Download, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function ResponsesTab({ responses, questions }: { responses: any[], questions: any[] }) {
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  const { toast } = useToast();
  const totalResponses = responses.length;
  const lastResponseDate =
    responses.length > 0 ? responses[0].dateResponded : "N/A";

  const prepareData = async () => {
    try {
      const data = responses.map((response: any) => {
        const { id, ...rest } = {
          "Username": response.userName,
          ...response.responses,
          "Submitted At": new Date(response.dateResponded).toLocaleString()
        }
        return rest;
      });
      return data;
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Generating Excel!",
        description: "Please Try Again.",
        variant: "destructive"
      });
    }
  }

  const generateExcel = async () => {
    try {
      setIsGeneratingExcel(true);
      const jsonData = await prepareData();
      const ws = XLSX.utils.json_to_sheet(jsonData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "data.xlsx");
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Generating Excel!",
        description: "Please Try Again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingExcel(false);
    }
  };

  const multipleChoiceQuestions = useMemo(() => {
    return questions.filter(q => q.type === 'multipleChoice');
  }, [questions]);

  const getQuestionStats = (questionId: string) => {
    const questionResponses = responses.map(r => r.responses[questionId]).filter(Boolean);
    const total = questionResponses.length;
    const counts = questionResponses.reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value: (value as number / total) * 100
    }));
  };

  const COLORS = [
    '#FF6B6B', // Vibrant Red
    '#45B7D1', // Sky Blue
    '#4ECDC4', // Turquoise
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7FFF7', // Almost White
    '#FFD93D', // Bright Yellow
    '#FF8C42', // Dark Orange
    '#6A0572', // Deep Purple
    '#1A5F7A', // Dark Teal
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
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
      {multipleChoiceQuestions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle>{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                data: {
                  label: "Data",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getQuestionStats(question.id)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getQuestionStats(question.id).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

