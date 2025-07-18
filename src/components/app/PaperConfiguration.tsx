'use client';

import type { Dispatch, SetStateAction } from 'react';
import { subjectDetails } from '@/lib/mock-data';
import type { PaperConfig } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileSignature, Bot, Info } from 'lucide-react';

interface PaperConfigurationProps {
  config: PaperConfig;
  setConfig: Dispatch<SetStateAction<PaperConfig>>;
}

export default function PaperConfiguration({ config, setConfig }: PaperConfigurationProps) {
  const handleSelectChange = (name: keyof PaperConfig) => (value: string) => {
    const newConfig: PaperConfig = { ...config, [name]: value };
    if (name === 'subject') {
      newConfig.chapter = 'all'; // Reset chapter on subject change
      const newClass = subjectDetails[value]?.classes[0] || '';
      newConfig.class = newClass;
    }
    setConfig(newConfig);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const availableSubjects = Object.keys(subjectDetails);
  const availableClasses = subjectDetails[config.subject]?.classes || [];
  const availableChapters = subjectDetails[config.subject]?.chapters[config.class] || [];

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <div className="flex items-center gap-4">
          <FileSignature className="w-8 h-8 text-amber-400" />
          <div>
            <CardTitle className="font-headline text-2xl text-amber-400">পত্র কাঠামো</CardTitle>
            <CardDescription>আপনার পরীক্ষার প্রশ্নপত্রের কাঠামো সেট করুন</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">বিষয়</Label>
              <Select name="subject" value={config.subject} onValueChange={handleSelectChange('subject')}>
                <SelectTrigger id="subject"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">শ্রেণী</Label>
              <Select name="class" value={config.class} onValueChange={handleSelectChange('class')}>
                <SelectTrigger id="class"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chapter">অধ্যায়</Label>
          <Select name="chapter" value={config.chapter} onValueChange={handleSelectChange('chapter')}>
            <SelectTrigger id="chapter"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সমস্ত অধ্যায়</SelectItem>
              {availableChapters.map((chap) => (
                <SelectItem key={chap} value={chap}>{chap}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalMarks">মোট নম্বর</Label>
            <Input type="number" id="totalMarks" name="totalMarks" value={config.totalMarks} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mcqCount" className="flex items-center gap-1">
              MCQ সংখ্যা
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                  <TooltipContent><p>Multiple Choice Questions</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input type="number" id="mcqCount" name="mcqCount" value={config.mcqCount} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="saqCount" className="flex items-center gap-1">
              SAQ সংখ্যা
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                  <TooltipContent><p>Short Answer Questions</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input type="number" id="saqCount" name="saqCount" value={config.saqCount} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longQuestionCount" className="flex items-center gap-1">
              বড় প্রশ্ন সংখ্যা
               <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild><Info className="w-3 h-3 cursor-help" /></TooltipTrigger>
                  <TooltipContent><p>Long Answer Questions</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input type="number" id="longQuestionCount" name="longQuestionCount" value={config.longQuestionCount} onChange={handleInputChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
