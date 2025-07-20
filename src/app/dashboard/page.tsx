
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { PaperConfig, Question, AiQuestion } from '@/lib/types';
import { initialConfig, questionBank } from '@/lib/mock-data';
import Header from '@/components/app/Header';
import QuestionBank from '@/components/app/QuestionBank';
import PaperPreview from '@/components/app/PaperPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Sigma } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const questionTypeOrder = { 'MCQ': 1, 'SAQ': 2, 'True/False': 3, 'Fill in the Blanks': 4, 'Long': 5 };

function DashboardComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [config, setConfig] = useState<PaperConfig>(initialConfig);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0 && params.class) { // Check for a required param
      const newConfig: PaperConfig = {
        schoolName: params.schoolName || initialConfig.schoolName,
        examTerm: params.examTerm || initialConfig.examTerm,
        time: params.time || initialConfig.time,
        class: params.class || initialConfig.class,
        subject: params.subject || initialConfig.subject,
        chapter: params.chapter || initialConfig.chapter,
        mcq: {
          count: Number(params['mcq.count']) || initialConfig.mcq.count,
          marks: Number(params['mcq.marks']) || initialConfig.mcq.marks,
        },
        saq: {
          count: Number(params['saq.count']) || initialConfig.saq.count,
          marks: Number(params['saq.marks']) || initialConfig.saq.marks,
        },
        long: {
          count: Number(params['long.count']) || initialConfig.long.count,
          marks: Number(params['long.marks']) || initialConfig.long.marks,
        },
        trueFalse: {
          count: Number(params['trueFalse.count']) || initialConfig.trueFalse.count,
          marks: Number(params['trueFalse.marks']) || initialConfig.trueFalse.marks,
        },
        fillInBlanks: {
          count: Number(params['fillInBlanks.count']) || initialConfig.fillInBlanks.count,
          marks: Number(params['fillInBlanks.marks']) || initialConfig.fillInBlanks.marks,
        },
      };
      setConfig(newConfig);
    } else {
        router.push('/generate-pattern');
    }
  }, [searchParams, router]);

  const totalMarks = useMemo(() => {
    return (config.mcq.count * config.mcq.marks) + 
           (config.saq.count * config.saq.marks) + 
           (config.long.count * config.long.marks) +
           (config.trueFalse.count * config.trueFalse.marks) +
           (config.fillInBlanks.count * config.fillInBlanks.marks);
  }, [config]);
  
  const filteredQuestions = useMemo(() => {
    return questionBank.filter(
      (q) =>
        q.subject === config.subject &&
        q.class === config.class &&
        (config.chapter === 'all' || q.chapter === config.chapter)
    );
  }, [config.subject, config.class, config.chapter]);
  
  const handleGoBack = () => {
     const params = new URLSearchParams({
        schoolName: config.schoolName,
        examTerm: config.examTerm,
        time: config.time,
        class: config.class,
        subject: config.subject,
        chapter: config.chapter,
        'mcq.count': String(config.mcq.count),
        'mcq.marks': String(config.mcq.marks),
        'saq.count': String(config.saq.count),
        'saq.marks': String(config.saq.marks),
        'long.count': String(config.long.count),
        'long.marks': String(config.long.marks),
        'trueFalse.count': String(config.trueFalse.count),
        'trueFalse.marks': String(config.trueFalse.marks),
        'fillInBlanks.count': String(config.fillInBlanks.count),
        'fillInBlanks.marks': String(config.fillInBlanks.marks),
     });
    router.push(`/generate-pattern?${params.toString()}`);
  }

  const sortQuestions = (questions: Question[]) => {
    return [...questions].sort((a, b) => {
      const typeA = questionTypeOrder[a.type] || 99;
      const typeB = questionTypeOrder[b.type] || 99;
      if (typeA !== typeB) {
        return typeA - typeB;
      }
      return a.id - b.id; // Fallback to id for stable sort within the same type
    });
  };

  const handleAddQuestion = (question: Question) => {
    // Prevent adding duplicates
    if (!selectedQuestions.find(q => q.id === question.id)) {
      setSelectedQuestions(prev => sortQuestions([...prev, question]));
    }
  };

  const handleRemoveQuestion = (questionId: number) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleReset = () => {
    setSelectedQuestions([]);
  };

  const handleAddAiQuestions = (aiQuestions: AiQuestion[]) => {
    const newQuestions: Question[] = aiQuestions.map((q, index) => ({
      ...q,
      id: Date.now() + index, // Create a unique ID
      class: config.class,
      subject: config.subject,
      chapter: config.chapter,
    }));
    setSelectedQuestions(prev => sortQuestions([...prev, ...newQuestions]));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
            <div>
                <h1 className="font-headline text-3xl text-amber-400">প্রশ্নপত্র তৈরি করুন</h1>
                <p className="text-muted-foreground">প্রশ্ন ভান্ডার থেকে প্রশ্ন নির্বাচন করুন অথবা AI দিয়ে তৈরি করুন।</p>
            </div>
            <Button onClick={handleGoBack} variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                কাঠামো পরিবর্তন করুন
            </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8 no-print">
            <Card className="border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <FileSignature className="w-8 h-8 text-amber-400" />
                        <div>
                            <CardTitle className="font-headline text-2xl text-amber-400">আপনার কাঠামো</CardTitle>
                            <CardDescription> বিষয়: {config.subject}, শ্রেণী: {config.class}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='pt-0 flex flex-col gap-4'>
                    <div className='flex flex-wrap gap-2'>
                        <Badge variant="secondary">MCQ: {config.mcq.count}টি x {config.mcq.marks} নম্বর</Badge>
                        <Badge variant="secondary">SAQ: {config.saq.count}টি x {config.saq.marks} নম্বর</Badge>
                        <Badge variant="secondary">বড় প্রশ্ন: {config.long.count}টি x {config.long.marks} নম্বর</Badge>
                        <Badge variant="secondary">সত্য/মিথ্যা: {config.trueFalse.count}টি x {config.trueFalse.marks} নম্বর</Badge>
                        <Badge variant="secondary">শূন্যস্থান পূরণ: {config.fillInBlanks.count}টি x {config.fillInBlanks.marks} নম্বর</Badge>
                    </div>
                     <div className="flex items-center gap-2 text-right self-end">
                           <Sigma className="w-5 h-5 text-amber-400" />
                           <div>
                            <p className='text-xs text-muted-foreground'>মোট নম্বর</p>
                            <p className='font-bold text-xl text-amber-400'>{totalMarks}</p>
                           </div>
                        </div>
                </CardContent>
            </Card>
            <QuestionBank
              questions={filteredQuestions}
              onAddQuestion={handleAddQuestion}
              selectedIds={selectedQuestions.map(q => q.id)}
            />
          </div>
          <div className="lg:col-span-3">
            <PaperPreview
              config={config}
              questions={selectedQuestions}
              totalMarks={totalMarks}
              onRemoveQuestion={handleRemoveQuestion}
              onReset={handleReset}
              onAddAiQuestions={handleAddAiQuestions}
            />
          </div>
        </div>
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
