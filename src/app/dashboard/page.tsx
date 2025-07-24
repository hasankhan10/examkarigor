
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { PaperConfig, Question, AiQuestion, QuestionTypeDetail } from '@/lib/types';
import { initialConfig } from '@/lib/mock-data';
import Header from '@/components/app/Header';
import QuestionBank from '@/components/app/QuestionBank';
import PaperPreview from '@/components/app/PaperPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSignature, Sigma } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { getQuestionsFromBank } from '@/ai/flows/get-questions-from-bank';
import { useToast } from '@/hooks/use-toast';

const questionTypeOrder = { 'MCQ': 1, 'SAQ': 2, 'True/False': 3, 'Fill in the Blanks': 4, 'Long': 5, 'Rochonadhormi': 6 };

function DashboardComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [config, setConfig] = useState<PaperConfig>(initialConfig);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [isBankLoading, setIsBankLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0 && params.class) { // Check for a required param
      const newConfig: PaperConfig = {
        schoolName: params.schoolName || initialConfig.schoolName,
        examTerm: params.examTerm || initialConfig.examTerm,
        time: params.time || initialConfig.time,
        class: params.class || initialConfig.class,
        subject: params.subject || initialConfig.subject,
        chapter: params.chapter ? params.chapter.split(',') : initialConfig.chapter,
        mcq: {
          enabled: params['mcq.enabled'] === 'true',
          count: Number(params['mcq.count']) || initialConfig.mcq.count,
          marks: Number(params['mcq.marks']) || initialConfig.mcq.marks,
        },
        saq: {
          enabled: params['saq.enabled'] === 'true',
          count: Number(params['saq.count']) || initialConfig.saq.count,
          marks: Number(params['saq.marks']) || initialConfig.saq.marks,
        },
        long: {
          enabled: params['long.enabled'] === 'true',
          count: Number(params['long.count']) || initialConfig.long.count,
          marks: Number(params['long.marks']) || initialConfig.long.marks,
        },
        trueFalse: {
          enabled: params['trueFalse.enabled'] === 'true',
          count: Number(params['trueFalse.count']) || initialConfig.trueFalse.count,
          marks: Number(params['trueFalse.marks']) || initialConfig.trueFalse.marks,
        },
        fillInBlanks: {
          enabled: params['fillInBlanks.enabled'] === 'true',
          count: Number(params['fillInBlanks.count']) || initialConfig.fillInBlanks.count,
          marks: Number(params['fillInBlanks.marks']) || initialConfig.fillInBlanks.marks,
        },
        rochonadhormi: {
            enabled: params['rochonadhormi.enabled'] === 'true',
            count: Number(params['rochonadhormi.count']) || initialConfig.rochonadhormi.count,
            marks: Number(params['rochonadhormi.marks']) || initialConfig.rochonadhormi.marks,
        }
      };
      setConfig(newConfig);
    } else {
        router.push('/generate-pattern');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!config.class || !config.subject) return;

    const fetchBankQuestions = async () => {
        setIsBankLoading(true);
        setBankQuestions([]);

        const requestedTypes = (Object.keys(config) as Array<keyof PaperConfig>)
            .filter(key => {
                const detail = config[key] as QuestionTypeDetail;
                return detail && typeof detail.enabled === 'boolean' && detail.enabled;
            })
            .map(type => {
                switch(type) {
                    case 'mcq': return 'MCQ';
                    case 'saq': return 'SAQ';
                    case 'long': return 'Long';
                    case 'trueFalse': return 'True/False';
                    case 'fillInBlanks': return 'Fill in the Blanks';
                    case 'rochonadhormi': return 'Rochonadhormi';
                    default: return null;
                }
            }).filter(Boolean) as ('MCQ' | 'SAQ' | 'Long' | 'True/False' | 'Fill in the Blanks' | 'Rochonadhormi')[];

        if (requestedTypes.length === 0 || config.chapter.length === 0) {
            setIsBankLoading(false);
            return;
        }

        try {
            const result = await getQuestionsFromBank({
                class: config.class,
                subject: config.subject,
                chapters: config.chapter,
                questionTypes: requestedTypes,
                language: lang === 'bn' ? 'Bengali' : 'English',
            });

            const newBankQuestions: Question[] = result.questions.map((q, index) => ({
                ...q,
                id: Date.now() + index, // Assign a unique ID
                class: config.class,
                subject: config.subject,
            }));

            setBankQuestions(newBankQuestions);
        } catch (error) {
            console.error("Failed to fetch question bank:", error);
            toast({
                variant: 'destructive',
                title: t('toast_error_title'),
                description: "প্রশ্ন ভান্ডার লোড করা যায়নি।",
            });
        } finally {
            setIsBankLoading(false);
        }
    };

    fetchBankQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, lang]);

  const totalMarks = useMemo(() => {
    return (config.mcq.enabled ? (config.mcq.count * config.mcq.marks) : 0) + 
           (config.saq.enabled ? (config.saq.count * config.saq.marks) : 0) + 
           (config.long.enabled ? (config.long.count * config.long.marks) : 0) +
           (config.trueFalse.enabled ? (config.trueFalse.count * config.trueFalse.marks) : 0) +
           (config.fillInBlanks.enabled ? (config.fillInBlanks.count * config.fillInBlanks.marks) : 0) +
           (config.rochonadhormi.enabled ? (config.rochonadhormi.count * config.rochonadhormi.marks) : 0);
  }, [config]);
  
  const handleGoBack = () => {
     const params = new URLSearchParams({
        schoolName: config.schoolName,
        examTerm: config.examTerm,
        time: config.time,
        class: config.class,
        subject: config.subject,
        chapter: config.chapter.join(','),
        'mcq.enabled': String(config.mcq.enabled),
        'mcq.count': String(config.mcq.count),
        'mcq.marks': String(config.mcq.marks),
        'saq.enabled': String(config.saq.enabled),
        'saq.count': String(config.saq.count),
        'saq.marks': String(config.saq.marks),
        'long.enabled': String(config.long.enabled),
        'long.count': String(config.long.count),
        'long.marks': String(config.long.marks),
        'trueFalse.enabled': String(config.trueFalse.enabled),
        'trueFalse.count': String(config.trueFalse.count),
        'trueFalse.marks': String(config.trueFalse.marks),
        'fillInBlanks.enabled': String(config.fillInBlanks.enabled),
        'fillInBlanks.count': String(config.fillInBlanks.count),
        'fillInBlanks.marks': String(config.fillInBlanks.marks),
        'rochonadhormi.enabled': String(config.rochonadhormi.enabled),
        'rochonadhormi.count': String(config.rochonadhormi.count),
        'rochonadhormi.marks': String(config.rochonadhormi.marks),
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
      id: Date.now() + index,
      class: config.class,
      subject: config.subject,
      chapter: "AI Generated",
    }));
    setSelectedQuestions(prev => sortQuestions([...prev, ...newQuestions]));
  };

  const getBadgeText = (type: 'mcq' | 'saq' | 'long' | 'trueFalse' | 'fillInBlanks' | 'rochonadhormi') => {
    const typeConfig = config[type];
    const key = `badge_${type}` as const;
    return t(key, { count: typeConfig.count, marks: typeConfig.marks });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
            <div>
                <h1 className="font-headline text-3xl text-amber-400">{t('create_paper_title')}</h1>
                <p className="text-muted-foreground">{t('create_paper_desc')}</p>
            </div>
            <Button onClick={handleGoBack} variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('change_structure')}
            </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8 no-print">
            <Card className="border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <FileSignature className="w-8 h-8 text-amber-400" />
                        <div>
                            <CardTitle className="font-headline text-2xl text-amber-400">{t('your_structure')}</CardTitle>
                            <CardDescription> {t('subject')}: {config.subject}, {t('class')}: {config.class}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='pt-0 flex flex-col gap-4'>
                    <div className='flex flex-wrap gap-2'>
                        {config.mcq.enabled && <Badge variant="secondary">{getBadgeText('mcq')}</Badge>}
                        {config.saq.enabled && <Badge variant="secondary">{getBadgeText('saq')}</Badge>}
                        {config.long.enabled && <Badge variant="secondary">{getBadgeText('long')}</Badge>}
                        {config.trueFalse.enabled && <Badge variant="secondary">{getBadgeText('trueFalse')}</Badge>}
                        {config.fillInBlanks.enabled && <Badge variant="secondary">{getBadgeText('fillInBlanks')}</Badge>}
                        {config.rochonadhormi.enabled && <Badge variant="secondary">{getBadgeText('rochonadhormi')}</Badge>}
                    </div>
                     <div className="flex items-center gap-2 text-right self-end">
                           <Sigma className="w-5 h-5 text-amber-400" />
                           <div>
                            <p className='text-xs text-muted-foreground'>{t('total_marks')}</p>
                            <p className='font-bold text-xl text-amber-400'>{totalMarks}</p>
                           </div>
                        </div>
                </CardContent>
            </Card>
            <QuestionBank
              questions={bankQuestions}
              isLoading={isBankLoading}
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
    <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
        </div>
      }
    >
      <DashboardComponent />
    </Suspense>
  )
}
