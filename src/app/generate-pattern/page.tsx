
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { subjectDetails, classList } from '@/lib/mock-data';
import type { PaperConfig, QuestionType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileSignature, Info, ArrowRight, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/app/Header';
import { initialConfig } from '@/lib/mock-data';

function GeneratePatternComponent() {
  const [config, setConfig] = useState<PaperConfig>(initialConfig);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
        const newConfig: PaperConfig = { ...initialConfig };
        newConfig.schoolName = params.schoolName || initialConfig.schoolName;
        newConfig.examTerm = params.examTerm || initialConfig.examTerm;
        newConfig.time = params.time || initialConfig.time;
        newConfig.class = params.class || initialConfig.class;
        newConfig.subject = params.subject || initialConfig.subject;
        newConfig.chapter = params.chapter || initialConfig.chapter;
        
        newConfig.mcq.enabled = params['mcq.enabled'] === 'true';
        newConfig.mcq.count = Number(params['mcq.count']) || initialConfig.mcq.count;
        newConfig.mcq.marks = Number(params['mcq.marks']) || initialConfig.mcq.marks;
        
        newConfig.saq.enabled = params['saq.enabled'] === 'true';
        newConfig.saq.count = Number(params['saq.count']) || initialConfig.saq.count;
        newConfig.saq.marks = Number(params['saq.marks']) || initialConfig.saq.marks;

        newConfig.long.enabled = params['long.enabled'] === 'true';
        newConfig.long.count = Number(params['long.count']) || initialConfig.long.count;
        newConfig.long.marks = Number(params['long.marks']) || initialConfig.long.marks;
        
        newConfig.trueFalse.enabled = params['trueFalse.enabled'] === 'true';
        newConfig.trueFalse.count = Number(params['trueFalse.count']) || initialConfig.trueFalse.count;
        newConfig.trueFalse.marks = Number(params['trueFalse.marks']) || initialConfig.trueFalse.marks;
        
        newConfig.fillInBlanks.enabled = params['fillInBlanks.enabled'] === 'true';
        newConfig.fillInBlanks.count = Number(params['fillInBlanks.count']) || initialConfig.fillInBlanks.count;
        newConfig.fillInBlanks.marks = Number(params['fillInBlanks.marks']) || initialConfig.fillInBlanks.marks;
        
        // Ensure subject is valid for the class
        const availableSubjectsForClass = Object.keys(subjectDetails).filter(sub => subjectDetails[sub].classes.includes(newConfig.class));
        if (!availableSubjectsForClass.includes(newConfig.subject)) {
            newConfig.subject = availableSubjectsForClass[0] || '';
        }

        // Ensure chapter is valid
        const availableChaptersForSubject = subjectDetails[newConfig.subject]?.chapters[newConfig.class] || [];
        if (!availableChaptersForSubject.includes(newConfig.chapter) && newConfig.chapter !== 'all') {
            newConfig.chapter = 'all';
        }
        
        setConfig(newConfig);
    }
  }, [searchParams]);

  const totalMarks = useMemo(() => {
    return (config.mcq.enabled ? (config.mcq.count * config.mcq.marks) : 0) + 
           (config.saq.enabled ? (config.saq.count * config.saq.marks) : 0) + 
           (config.long.enabled ? (config.long.count * config.long.marks) : 0) +
           (config.trueFalse.enabled ? (config.trueFalse.count * config.trueFalse.marks) : 0) +
           (config.fillInBlanks.enabled ? (config.fillInBlanks.count * config.fillInBlanks.marks) : 0);
  }, [config]);

  const handleSelectChange = (name: 'class' | 'subject' | 'chapter') => (value: string) => {
    setConfig(prevConfig => {
        const newConfig = { ...prevConfig, [name]: value };

        if (name === 'class') {
            const firstSubjectForClass = Object.keys(subjectDetails).find(sub => subjectDetails[sub].classes.includes(value)) || '';
            newConfig.subject = firstSubjectForClass;
            newConfig.chapter = 'all';
        } else if (name === 'subject') {
            newConfig.chapter = 'all';
        }

        return newConfig;
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuestionConfigChange = (type: QuestionType, field: 'count' | 'marks') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setConfig(prev => ({
        ...prev,
        [type]: {
            ...prev[type],
            [field]: value
        }
    }));
  };

  const handleToggleChange = (type: QuestionType) => (checked: boolean) => {
    setConfig(prev => {
        const newTypeConfig = { ...prev[type], enabled: checked };
        if (!checked) {
            newTypeConfig.count = 0;
            newTypeConfig.marks = 0;
        }
        return {
            ...prev,
            [type]: newTypeConfig
        };
    });
};
  
  const handleSubmit = () => {
    const params = new URLSearchParams({
        schoolName: config.schoolName,
        examTerm: config.examTerm,
        time: config.time,
        class: config.class,
        subject: config.subject,
        chapter: config.chapter,
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
    });
    router.push(`/dashboard?${params.toString()}`);
  };

  const availableSubjects = Object.keys(subjectDetails).filter(sub => subjectDetails[sub].classes.includes(config.class));
  const availableChapters = subjectDetails[config.subject]?.chapters[config.class] || [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
            <Card className="w-full max-w-2xl border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <FileSignature className="w-8 h-8 text-amber-400" />
                            <div>
                                <CardTitle className="font-headline text-2xl text-amber-400">পত্র কাঠামো</CardTitle>
                                <CardDescription>আপনার পরীক্ষার প্রশ্নপত্রের কাঠামো সেট করুন</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-right self-end sm:self-center">
                           <Sigma className="w-6 h-6 text-amber-400" />
                           <div>
                            <p className='text-xs text-muted-foreground'>মোট নম্বর</p>
                            <p className='font-bold text-2xl text-amber-400'>{totalMarks}</p>
                           </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="schoolName">স্কুলের নাম</Label>
                            <Input id="schoolName" name="schoolName" value={config.schoolName} onChange={handleInputChange} placeholder="আপনার স্কুলের নাম লিখুন" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="examTerm">পরীক্ষার পর্ব</Label>
                            <Input id="examTerm" name="examTerm" value={config.examTerm} onChange={handleInputChange} placeholder="বার্ষিক পরীক্ষা" />
                        </div>
                    </div>
                     <div className="space-y-2">
                            <Label htmlFor="time">সময়</Label>
                            <Input id="time" name="time" value={config.time} onChange={handleInputChange} placeholder="৩ ঘন্টা ১৫ মিনিট" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="class">শ্রেণী</Label>
                            <Select name="class" value={config.class} onValueChange={handleSelectChange('class')}>
                                <SelectTrigger id="class"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                {classList.map((cls) => (
                                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">বিষয়</Label>
                            <Select name="subject" value={config.subject} onValueChange={handleSelectChange('subject')} disabled={!config.class || availableSubjects.length === 0}>
                                <SelectTrigger id="subject"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                {availableSubjects.length > 0 ? availableSubjects.map((sub) => (
                                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                )) : <SelectItem value="" disabled>এই শ্রেণীর জন্য কোনো বিষয় নেই</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="chapter">অধ্যায়</Label>
                        <Select name="chapter" value={config.chapter} onValueChange={handleSelectChange('chapter')} disabled={!config.subject || availableChapters.length === 0}>
                            <SelectTrigger id="chapter"><SelectValue /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">সমস্ত অধ্যায়</SelectItem>
                            {availableChapters.map((chap) => (
                                <SelectItem key={chap} value={chap}>{chap}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <div className='p-4 border rounded-lg'>
                           <div className="flex items-center justify-between mb-2">
                                <Label className="flex items-center gap-1 text-base">
                                    MCQ
                                    <TooltipProvider>
                                        <Tooltip>
                                        <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                                        <TooltipContent><p>Multiple Choice Questions</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Switch checked={config.mcq.enabled} onCheckedChange={handleToggleChange('mcq')} />
                           </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mcqCount">সংখ্যা</Label>
                                    <Input type="number" id="mcqCount" value={config.mcq.count} onChange={handleQuestionConfigChange('mcq', 'count')} disabled={!config.mcq.enabled} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mcqMarks">প্রতি প্রশ্নের নম্বর</Label>
                                    <Input type="number" id="mcqMarks" value={config.mcq.marks} onChange={handleQuestionConfigChange('mcq', 'marks')} disabled={!config.mcq.enabled} />
                                </div>
                            </div>
                        </div>

                        <div className='p-4 border rounded-lg'>
                           <div className="flex items-center justify-between mb-2">
                               <Label className="flex items-center gap-1 text-base">
                                    SAQ
                                    <TooltipProvider>
                                        <Tooltip>
                                        <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                                        <TooltipContent><p>Short Answer Questions</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Switch checked={config.saq.enabled} onCheckedChange={handleToggleChange('saq')} />
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="saqCount">সংখ্যা</Label>
                                    <Input type="number" id="saqCount" value={config.saq.count} onChange={handleQuestionConfigChange('saq', 'count')} disabled={!config.saq.enabled} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="saqMarks">প্রতি প্রশ্নের নম্বর</Label>
                                    <Input type="number" id="saqMarks" value={config.saq.marks} onChange={handleQuestionConfigChange('saq', 'marks')} disabled={!config.saq.enabled} />
                                </div>
                            </div>
                        </div>

                        <div className='p-4 border rounded-lg'>
                           <div className="flex items-center justify-between mb-2">
                                <Label className="flex items-center gap-1 text-base">
                                    বড় প্রশ্ন
                                    <TooltipProvider>
                                        <Tooltip>
                                        <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                                        <TooltipContent><p>Long Answer Questions</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Switch checked={config.long.enabled} onCheckedChange={handleToggleChange('long')} />
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="longCount">সংখ্যা</Label>
                                    <Input type="number" id="longCount" value={config.long.count} onChange={handleQuestionConfigChange('long', 'count')} disabled={!config.long.enabled} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longMarks">প্রতি প্রশ্নের নম্বর</Label>
                                    <Input type="number" id="longMarks" value={config.long.marks} onChange={handleQuestionConfigChange('long', 'marks')} disabled={!config.long.enabled} />
                                </div>
                            </div>
                        </div>
                        
                        <div className='p-4 border rounded-lg'>
                           <div className="flex items-center justify-between mb-2">
                               <Label className="flex items-center gap-1 text-base">
                                    সত্য/মিথ্যা
                                    <TooltipProvider>
                                        <Tooltip>
                                        <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                                        <TooltipContent><p>True/False Questions</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Switch checked={config.trueFalse.enabled} onCheckedChange={handleToggleChange('trueFalse')} />
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="trueFalseCount">সংখ্যা</Label>
                                    <Input type="number" id="trueFalseCount" value={config.trueFalse.count} onChange={handleQuestionConfigChange('trueFalse', 'count')} disabled={!config.trueFalse.enabled} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="trueFalseMarks">প্রতি প্রশ্নের নম্বর</Label>
                                    <Input type="number" id="trueFalseMarks" value={config.trueFalse.marks} onChange={handleQuestionConfigChange('trueFalse', 'marks')} disabled={!config.trueFalse.enabled} />
                                </div>
                            </div>
                        </div>

                        <div className='p-4 border rounded-lg'>
                            <div className="flex items-center justify-between mb-2">
                               <Label className="flex items-center gap-1 text-base">
                                    শূন্যস্থান পূরণ
                                    <TooltipProvider>
                                        <Tooltip>
                                        <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                                        <TooltipContent><p>Fill in the Blanks</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Switch checked={config.fillInBlanks.enabled} onCheckedChange={handleToggleChange('fillInBlanks')} />
                            </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fillInBlanksCount">সংখ্যা</Label>
                                    <Input type="number" id="fillInBlanksCount" value={config.fillInBlanks.count} onChange={handleQuestionConfigChange('fillInBlanks', 'count')} disabled={!config.fillInBlanks.enabled} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fillInBlanksMarks">প্রতি প্রশ্নের নম্বর</Label>
                                    <Input type="number" id="fillInBlanksMarks" value={config.fillInBlanks.marks} onChange={handleQuestionConfigChange('fillInBlanks', 'marks')} disabled={!config.fillInBlanks.enabled} />
                                </div>
                            </div>
                        </div>

                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSubmit} size="lg" className="bg-amber-500 text-accent-foreground hover:bg-amber-600">
                        পরবর্তী ধাপ
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </CardFooter>
            </Card>
        </main>
    </div>
  );
}

export default function GeneratePatternPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GeneratePatternComponent />
        </Suspense>
    )
}

    