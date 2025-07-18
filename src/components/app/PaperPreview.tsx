
'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { PaperConfig, Question } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, Trash2, X, FileText, Bot, GripVertical } from 'lucide-react';
import { Badge } from '../ui/badge';
import GeneratePaperDialog from './GeneratePaperDialog';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface PaperPreviewProps {
  config: PaperConfig;
  questions: Question[];
  onRemoveQuestion: (questionId: number) => void;
  onReset: () => void;
}

export default function PaperPreview({ config, questions, onRemoveQuestion, onReset }: PaperPreviewProps) {
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="sticky top-24 border-amber-500/20 shadow-lg shadow-amber-500/5 print-container">
      <div className="print-card">
        <CardHeader className="print-card-header">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-amber-400" />
                <div>
                  <CardTitle className="font-headline text-2xl text-amber-400 print-text-black">প্রশ্নপত্রের পূর্বরূপ</CardTitle>
                  <CardDescription>আপনার তৈরি করা প্রশ্নপত্রটি এখানে দেখুন</CardDescription>
                </div>
              </div>
              <div className="no-print">
                 <GeneratePaperDialog config={config} />
              </div>
           </div>
        </CardHeader>
        <CardContent className="print-card-content">
          <div className="p-4 border rounded-lg bg-background print-border">
            <header className="text-center mb-6">
              <h2 className="text-xl font-bold font-headline print-text-black">{config.subject} পরীক্ষা</h2>
              <p className="print-text-black">শ্রেণী: {config.class}</p>
              <p className="print-text-black">পূর্ণমান: {config.totalMarks}</p>
            </header>
            <Droppable droppableId="paper-preview" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
              {(provided) => (
                <ScrollArea 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="h-[calc(100vh-32rem)] min-h-96"
                >
                    <div className="space-y-6 pr-4">
                      {questions.length > 0 ? (
                        questions.map((q, index) => (
                           <Draggable key={q.id} draggableId={String(q.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-start gap-2 text-sm print-text-black p-2 rounded-lg transition-colors ${snapshot.isDragging ? 'bg-primary/30' : ''}`}
                              >
                                <div {...provided.dragHandleProps} className="no-print cursor-grab text-muted-foreground hover:text-foreground pt-1">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <span className="font-bold">{index + 1}.</span>
                                <div className="flex-1">
                                  <p>{q.text}</p>
                                  {q.options && (
                                    <ol className="list-alpha list-inside grid grid-cols-2 gap-2 mt-2">
                                      {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                                    </ol>
                                  )}
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
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-16">
                          <p>প্রশ্ন ভান্ডার থেকে প্রশ্ন এখানে টেনে আনুন।</p>
                          <p className="text-sm">আপনার নির্বাচিত প্রশ্নগুলি এখানে প্রদর্শিত হবে।</p>
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                </ScrollArea>
              )}
            </Droppable>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center no-print">
            <div className="text-lg font-bold">
                <span className="text-muted-foreground">মোট:</span> <span className="text-amber-400">{totalMarks}</span> / {config.totalMarks}
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
