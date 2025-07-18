
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { PaperConfig, Question } from '@/lib/types';
import { initialConfig, questionBank } from '@/lib/mock-data';
import Header from '@/components/app/Header';
import QuestionBank from '@/components/app/QuestionBank';
import PaperPreview from '@/components/app/PaperPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';


function DashboardComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [config, setConfig] = useState<PaperConfig>(initialConfig);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      const newConfig = {
        class: params.class || initialConfig.class,
        subject: params.subject || initialConfig.subject,
        chapter: params.chapter || initialConfig.chapter,
        totalMarks: Number(params.totalMarks) || initialConfig.totalMarks,
        mcqCount: Number(params.mcqCount) || initialConfig.mcqCount,
        saqCount: Number(params.saqCount) || initialConfig.saqCount,
        longQuestionCount: Number(params.longQuestionCount) || initialConfig.longQuestionCount,
      };
      setConfig(newConfig);
    } else {
        // if no params, redirect to pattern generation
        router.push('/generate-pattern');
    }
  }, [searchParams, router]);
  
  const filteredQuestions = useMemo(() => {
    return questionBank.filter(
      (q) =>
        q.subject === config.subject &&
        q.class === config.class &&
        (config.chapter === 'all' || q.chapter === config.chapter)
    );
  }, [config.subject, config.class, config.chapter]);
  
  const handleGoBack = () => {
    const query = new URLSearchParams(config as any).toString();
    router.push(`/generate-pattern?${query}`);
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // Dropping within the same list (reordering)
    if (source.droppableId === destination.droppableId && destination.droppableId === 'paper-preview') {
      const items = Array.from(selectedQuestions);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setSelectedQuestions(items);
    }
    // Moving from question bank to paper preview
    else if (source.droppableId === 'question-bank' && destination.droppableId === 'paper-preview') {
      const sourceList = filteredQuestions;
      const destinationList = Array.from(selectedQuestions);
      
      const movedItem = { ...sourceList[source.index] };

      // Prevent adding duplicates
      if (destinationList.find(q => q.id === movedItem.id)) {
        return;
      }
      
      destinationList.splice(destination.index, 0, movedItem);
      setSelectedQuestions(destinationList);
    }
  };

  const handleRemoveQuestion = (questionId: number) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleReset = () => {
    setSelectedQuestions([]);
  };

  const handleAddAiQuestions = (aiQuestions: Omit<Question, 'id' | 'class' | 'subject' | 'chapter'>[]) => {
    const newQuestions: Question[] = aiQuestions.map((q, index) => ({
      ...q,
      id: Date.now() + index, // Create a unique ID
      class: config.class,
      subject: config.subject,
      chapter: config.chapter,
    }));
    setSelectedQuestions(prev => [...prev, ...newQuestions]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 no-print">
            <div>
                <h1 className="font-headline text-3xl text-amber-400">প্রশ্নপত্র তৈরি করুন</h1>
                <p className="text-muted-foreground">প্রশ্ন ভান্ডার থেকে প্রশ্ন নির্বাচন করুন অথবা AI দিয়ে তৈরি করুন।</p>
            </div>
            <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                কাঠামো পরিবর্তন করুন
            </Button>
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8 no-print">
                <Card className="border-primary/20 shadow-lg shadow-primary/5">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                        <FileSignature className="w-8 h-8 text-amber-400" />
                        <div>
                            <CardTitle className="font-headline text-2xl text-amber-400">আপনার কাঠামো</CardTitle>
                            <CardDescription> বিষয়: {config.subject}, শ্রেণী: {config.class}, মোট নম্বর: {config.totalMarks}</CardDescription>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent className='pt-0'>
                    <div className='flex flex-wrap gap-2'>
                        <Badge variant="secondary">MCQ: {config.mcqCount}</Badge>
                        <Badge variant="secondary">SAQ: {config.saqCount}</Badge>
                        <Badge variant="secondary">বড় প্রশ্ন: {config.longQuestionCount}</Badge>
                    </div>
                    </CardContent>
                </Card>
                <QuestionBank
                questions={filteredQuestions}
                />
            </div>
            <div className="lg:col-span-3">
                <PaperPreview
                config={config}
                questions={selectedQuestions}
                onRemoveQuestion={handleRemoveQuestion}
                onReset={handleReset}
                onAddAiQuestions={handleAddAiQuestions}
                />
            </div>
            </div>
        </DragDropContext>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardComponent />
    </Suspense>
  )
}
