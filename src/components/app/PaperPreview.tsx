
'use client';

import type { PaperConfig, Question, AiQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Trash2, X, FileText } from 'lucide-react';
import { Badge } from '../ui/badge';
import GeneratePaperDialog from './GeneratePaperDialog';


interface PaperPreviewProps {
  config: PaperConfig;
  questions: Question[];
  totalMarks: number;
  onRemoveQuestion: (questionId: number) => void;
  onReset: () => void;
  onAddAiQuestions: (questions: AiQuestion[]) => void;
}

export default function PaperPreview({ config, questions, totalMarks, onRemoveQuestion, onReset, onAddAiQuestions }: PaperPreviewProps) {
  const selectedTotalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  const handlePrint = () => {
    window.print();
  };

  const groupedQuestions = questions.reduce((acc, q) => {
    (acc[q.type] = acc[q.type] || []).push(q);
    return acc;
  }, {} as Record<Question['type'], Question[]>);

  const typeNames: Record<Question['type'], string> = {
    'MCQ': 'সঠিক উত্তরটি নির্বাচন করো (MCQ)',
    'SAQ': 'সংক্ষিপ্ত উত্তরভিত্তিক প্রশ্ন (SAQ)',
    'Long': 'দীর্ঘ উত্তরভিত্তিক প্রশ্ন',
  };
  
  const questionTypeOrder: Question['type'][] = ['MCQ', 'SAQ', 'Long'];

  let questionCounter = 0;

  return (
    <Card className="sticky top-24 border-amber-500/20 shadow-lg shadow-amber-500/5 print-container">
      <div className="print-card">
        <CardHeader className="print-card-header no-print">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-amber-400" />
                <div>
                  <CardTitle className="font-headline text-2xl text-amber-400">প্রশ্নপত্রের পূর্বরূপ</CardTitle>
                  <CardDescription>আপনার তৈরি করা প্রশ্নপত্রটি এখানে দেখুন</CardDescription>
                </div>
              </div>
              <div className="no-print">
                 <GeneratePaperDialog config={config} onAccept={onAddAiQuestions} />
              </div>
           </div>
        </CardHeader>
        <CardContent className="print-card-content">
          <div className="p-4 border rounded-lg bg-background print-border print:!p-0 print:!border-0">
            <header className="text-center mb-6">
              <h2 className="text-xl font-bold font-headline print-text-black">{config.subject} পরীক্ষা</h2>
              <p className="print-text-black">শ্রেণী: {config.class}</p>
              <p className="print-text-black">পূর্ণমান: {totalMarks}</p>
            </header>
            <div className="print-paper-content">
                <div className="space-y-6">
                  {questions.length > 0 ? (
                    questionTypeOrder.map(type => {
                      const group = groupedQuestions[type];
                      if (!group || group.length === 0) return null;
                      
                      const groupMarks = group.reduce((sum, q) => sum + q.marks, 0);
                      const groupName = typeNames[type];

                      return (
                        <div key={type}>
                          <h3 className="text-lg font-headline font-bold mb-3 p-2 bg-primary/10 rounded-md print-text-black">{groupName} <span className="text-sm font-normal text-muted-foreground">({group.length}টি প্রশ্ন, মোট {groupMarks} নম্বর)</span></h3>
                          {group.map((q) => {
                             questionCounter++;
                             return (
                              <div key={q.id} className="flex items-start gap-2 text-sm print-text-black p-2 rounded-lg mb-2">
                                <span className="font-bold">{questionCounter}.</span>
                                <div className="flex-1">
                                  {q.alternatives.map((alt, altIndex) => (
                                    <div key={altIndex}>
                                      {altIndex > 0 && <p className='font-bold my-1'>অথবা</p>}
                                      <p>{alt.text}</p>
                                      {alt.options && (
                                        <ol className="list-alpha list-inside grid grid-cols-2 gap-2 mt-2">
                                          {alt.options.map((opt, i) => <li key={i}>{opt}</li>)}
                                        </ol>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <Badge variant="outline" className="print-text-black print-border">[{q.marks}]</Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-6 h-6 text-red-500/70 hover:bg-red-500/10 hover:text-red-500 shrink-0 no-print"
                                  onClick={() => onRemoveQuestion(q.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-muted-foreground py-16 no-print h-[calc(100vh-32rem)] min-h-96 flex flex-col justify-center items-center">
                      <p>প্রশ্ন ভান্ডার থেকে প্রশ্ন যোগ করুন।</p>
                      <p className="text-sm">আপনার নির্বাচিত প্রশ্নগুলি এখানে প্রদর্শিত হবে।</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center no-print">
            <div className="text-lg font-bold">
                <span className="text-muted-foreground">মোট:</span> <span className="text-amber-400">{selectedTotalMarks}</span> / {totalMarks}
            </div>
            <div className="flex gap-2">
                 <Button variant="outline" onClick={onReset} disabled={questions.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    রিসেট
                </Button>
                <Button onClick={handlePrint} className="bg-amber-500 text-accent-foreground hover:bg-amber-600" disabled={questions.length === 0}>
                    <Printer className="mr-2 h-4 w-4" />
                    প্রিন্ট / PDF
                </Button>
            </div>
        </CardFooter>
      </div>
    </Card>
  );
}
