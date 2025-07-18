
'use client';

import { useState } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface QuestionBankProps {
  questions: Question[];
}

export default function QuestionBank({ questions }: QuestionBankProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
         <div className="flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-amber-400" />
          <div>
            <CardTitle className="font-headline text-2xl text-amber-400">প্রশ্ন ভান্ডার</CardTitle>
            <CardDescription>এখান থেকে প্রশ্ন নির্বাচন করে টেনে আনুন</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          placeholder="প্রশ্ন খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Droppable droppableId="question-bank" isDropDisabled={true} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided, snapshot) => (
            <ScrollArea 
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="h-96 w-full"
            >
              <div className="space-y-4 pr-4">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q, index) => (
                    <Draggable key={q.id} draggableId={String(q.id)} index={index}>
                      {(provided, snapshot) => (
                        <>
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-lg border border-primary/20 bg-background hover:bg-white/5 transition-colors flex items-start justify-between gap-4
                                ${snapshot.isDragging ? 'shadow-lg shadow-amber-500/20' : ''}`}
                            >
                            <div className="flex-1 space-y-2">
                                <p className="font-medium">{q.text}</p>
                                {q.options && (
                                <ol className="list-alpha list-inside text-sm text-muted-foreground">
                                    {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                                </ol>
                                )}
                                <div className="flex items-center gap-2 text-xs">
                                    <Badge variant="secondary">{q.type}</Badge>
                                    <Badge variant="outline" className="border-amber-400/50 text-amber-400">{q.marks} নম্বর</Badge>
                                </div>
                            </div>
                             <div className="text-muted-foreground hover:text-foreground cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </div>
                          </div>
                          {snapshot.isDragging && (
                            <div className="p-4 rounded-lg border border-dashed border-primary/20 bg-background/50 !mt-4">
                               <div className="flex-1 space-y-2">
                                <p className="font-medium">{q.text}</p>
                                 <div className="flex items-center gap-2 text-xs">
                                    <Badge variant="secondary">{q.type}</Badge>
                                    <Badge variant="outline" className="border-amber-400/50 text-amber-400">{q.marks} নম্বর</Badge>
                                </div>
                            </div>
                            </div>
                          )}
                        </>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-16">
                    <p>কোনো প্রশ্ন পাওয়া যায়নি।</p>
                    <p className="text-sm">অনুগ্রহ করে আপনার শ্রেণী বা বিষয় পরিবর্তন করে দেখুন।</p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            </ScrollArea>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}

const listAlpha = "list-[lower-alpha]";
