'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PaperConfig, Question } from '@/lib/types';
import { initialConfig, questionBank } from '@/lib/mock-data';
import Header from '@/components/app/Header';
import PaperConfiguration from '@/components/app/PaperConfiguration';
import QuestionBank from '@/components/app/QuestionBank';
import PaperPreview from '@/components/app/PaperPreview';

function DashboardComponent() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<PaperConfig>(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      return {
        class: params.class || initialConfig.class,
        subject: params.subject || initialConfig.subject,
        chapter: params.chapter || initialConfig.chapter,
        totalMarks: Number(params.totalMarks) || initialConfig.totalMarks,
        mcqCount: Number(params.mcqCount) || initialConfig.mcqCount,
        saqCount: Number(params.saqCount) || initialConfig.saqCount,
        longQuestionCount: Number(params.longQuestionCount) || initialConfig.longQuestionCount,
      };
    }
    return initialConfig;
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      setConfig({
        class: params.class || initialConfig.class,
        subject: params.subject || initialConfig.subject,
        chapter: params.chapter || initialConfig.chapter,
        totalMarks: Number(params.totalMarks) || initialConfig.totalMarks,
        mcqCount: Number(params.mcqCount) || initialConfig.mcqCount,
        saqCount: Number(params.saqCount) || initialConfig.saqCount,
        longQuestionCount: Number(params.longQuestionCount) || initialConfig.longQuestionCount,
      });
    }
  }, [searchParams]);

  const handleAddQuestion = (question: Question) => {
    setSelectedQuestions((prev) => {
      if (prev.find((q) => q.id === question.id)) {
        return prev;
      }
      return [...prev, question];
    });
  };

  const handleRemoveQuestion = (questionId: number) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleReset = () => {
    setSelectedQuestions([]);
  };

  const filteredQuestions = useMemo(() => {
    return questionBank.filter(
      (q) =>
        q.subject === config.subject &&
        q.class === config.class &&
        (config.chapter === 'all' || q.chapter === config.chapter)
    );
  }, [config.subject, config.class, config.chapter]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <PaperConfiguration config={config} setConfig={setConfig} />
            <QuestionBank
              questions={filteredQuestions}
              onAddQuestion={handleAddQuestion}
            />
          </div>
          <div className="lg:col-span-3">
            <PaperPreview
              config={config}
              questions={selectedQuestions}
              onRemoveQuestion={handleRemoveQuestion}
              onReset={handleReset}
              setSelectedQuestions={setSelectedQuestions}
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
