
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { subjectDetails, classList } from '@/lib/mock-data';
import type { PaperConfig } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileSignature, Info, ArrowRight, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/app/Header';
import { initialConfig } from '@/lib/mock-data';

export default function GeneratePatternPage() {
  const [config, setConfig] = useState<PaperConfig>(initialConfig);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
        const newConfig: PaperConfig = { ...initialConfig };
        newConfig.class = params.class || initialConfig.class;
        newConfig.subject = params.subject || initialConfig.subject;
        newConfig.chapter = params.chapter || initialConfig.chapter;
        newConfig.mcq.count = Number(params['mcq.count']) || initialConfig.mcq.count;
        newConfig.mcq.marks = Number(params['mcq.marks']) || initialConfig.mcq.marks;
        newConfig.saq.count = Number(params['saq.count']) || initialConfig.saq.count;
        newConfig.saq.marks = Number(params['saq.marks']) || initialConfig.saq.marks;
        newConfig.long.count = Number(params['long.count']) || initialConfig.long.count;
        newConfig.long.marks = Number(params['long.marks']) || initialConfig.long.marks;
        setConfig(newConfig);
    }
  }, [searchParams]);

  const totalMarks = useMemo(() => {
    return (config.mcq.count * config.mcq.marks) + 
           (config.saq.count * config.saq.marks) + 
           (config.long.count * config.long.marks);
  }, [config]);

  const handleSelectChange = (name: keyof PaperConfig) => (value: string) => {
    const newConfig: PaperConfig = { ...config, [name]: value };
    
    if (name === 'class') {
      const firstSubjectForClass = Object.keys(subjectDetails).find(sub => subjectDetails[sub].classes.includes(value)) || '';
      newConfig.subject = firstSubjectForClass;
      newConfig.chapter = 'all';
    } else if (name === 'subject') {
      newConfig.chapter = 'all';
    }
    
    setConfig(newConfig);
  };
  
  const handleInputChange = (type: 'mcq' | 'saq' | 'long', field: 'count' | 'marks') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setConfig(prev => ({
        ...prev,
        [type]: {
            ...prev[type],
            [field]: value
        }
    }));
  };
  
  const handleSubmit = () => {
    const params = {
        class: config.class,
        subject: config.subject,
        chapter: config.chapter,
        'mcq.count': String(config.mcq.count),
        'mcq.marks': String(config.mcq.marks),
        'saq.count': String(config.saq.count),
        'saq.marks': String(config.saq.marks),
        'long.count': String(config.long.count),
        'long.marks': String(config.long.marks),
    };
    const query = new URLSearchParams(params).toString();
    router.push(`/dashboard?${query}`);
  };

  const availableSubjects = Object.keys(subjectDetails).filter(sub => subjectDetails[sub].classes.includes(config.class));
  const availableChapters = subjectDetails[config.subject]?.chapters[config.class] || [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
            <Card className="w-full max-w-2xl border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <FileSignature className="w-8 h-8 text-amber-400" />
                            <div>
                                <CardTitle className="font-headline text-2xl text-amber-400">পত্র কাঠামো</CardTitle>
                                <CardDescription>আপনার পরীক্ষার প্রশ্নপত্রের কাঠামো সেট করুন</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-right">
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
                            <Select name="subject" value={config.subject} onValueChange={handleSelectChange('subject')}>
                                <SelectTrigger id="subject" disabled={!availableSubjects.length}><SelectValue /></SelectTrigger>
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
                        <Select name="chapter" value={config.chapter} onValueChange={handleSelectChange('chapter')}>
                            <SelectTrigger id="chapter" disabled={!availableChapters.length}><SelectValue /></SelectTrigger>
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
                            <Label className="flex items-center gap-1 mb-2 text-base">
                                MCQ
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                                    <TooltipContent><p>Multiple Choice Questions</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mcqCount">সংখ্যা</Label>
                                    <Input type="number" id="mcqCount" value={config.mcq.count} onChange={handleInputChange('mcq', 'count')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mcqMarks">প্রতি প্রশ্নের নম্বর</Label>
                                    <Input type="number" id="mcqMarks" value={config.mcq.marks} onChange={handleInputChange('mcq', 'marks')} />
                                </div>
                            </div>
                        </div>

                        <div className='p-4 border rounded-lg'>
                           <Label className="flex items-center gap-1 mb-2 text-base">
                                SAQ
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                                    <TooltipContent><p>Short Answer Questions</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                           <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="saqCount">সংখ্যা</Label>
                                    <Input type="number" id="saqCount" value={config.saq.count} onChange={handleInputChange('saq', 'count')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="saqMarks">প্রতি প্রশ্নের নম্বর</Label>
                                    <Input type="number" id="saqMarks" value={config.saq.marks} onChange={handleInputChange('saq', 'marks')} />
                                </div>
                            </div>
                        </div>

                        <div className='p-4 border rounded-lg'>
                           <Label className="flex items-center gap-1 mb-2 text-base">
                                বড় প্রশ্ন
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                                    <TooltipContent><p>Long Answer Questions</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                           <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="longCount">সংখ্যা</Label>
                                    <Input type="number" id="longCount" value={config.long.count} onChange={handleInputChange('long', 'count')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longMarks">প্রতি প্রশ্নের নম্বর</Label>
                                    <Input type="number" id="longMarks" value={config.long.marks} onChange={handleInputChange('long', 'marks')} />
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
