'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateRandomPaper } from '@/ai/flows/generate-random-paper.ts';
import type { PaperConfig } from '@/lib/types';
import { Loader2, Bot } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

interface GeneratePaperDialogProps {
  config: PaperConfig;
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
    <p className="font-headline text-lg">আপনার জন্য একটি বিশেষ প্রশ্নপত্র তৈরি করা হচ্ছে...</p>
    <p className="text-sm text-muted-foreground">এতে কয়েক মুহূর্ত সময় লাগতে পারে।</p>
  </div>
);

const FormattedPaper = ({ paper }: { paper: string }) => {
  const sections = paper.split('\n\n');
  return (
    <div className="space-y-4 text-left">
      {sections.map((section, i) => {
        const lines = section.split('\n');
        const title = lines[0];
        const questions = lines.slice(1);
        if (title.startsWith('##')) {
          return (
            <div key={i}>
              <h3 className="text-lg font-bold font-headline mb-2 text-amber-400">{title.replace('##', '').trim()}</h3>
              <ul className="space-y-2 list-inside">
                {questions.map((q, j) => <li key={j} className="ml-4">{q}</li>)}
              </ul>
            </div>
          );
        }
        return <p key={i}>{section}</p>
      })}
    </div>
  )
}

export default function GeneratePaperDialog({ config }: GeneratePaperDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    setGeneratedPaper(null);
    try {
      const result = await generateRandomPaper(config);
      setGeneratedPaper(result.examPaper);
      toast({
        title: "আপনার মাস্টারপিস প্রস্তুত!",
        description: "AI দ্বারা তৈরি প্রশ্নপত্র সফলভাবে জেনারেট হয়েছে।",
      });
    } catch (error) {
      console.error('Failed to generate paper:', error);
      toast({
        variant: 'destructive',
        title: 'একটি সমস্যা হয়েছে',
        description: 'প্রশ্নপত্র তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        setGeneratedPaper(null);
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 border border-amber-500/50">
          <Bot className="mr-2 h-5 w-5" />
          AI দিয়ে প্রশ্নপত্র তৈরি করুন
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-amber-400">স্বয়ংক্রিয় প্রশ্নপত্র জেনারেটর</DialogTitle>
          <DialogDescription>
            আপনার নির্বাচিত কাঠামোর উপর ভিত্তি করে AI একটি অনন্য প্রশ্নপত্র তৈরি করবে।
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 min-h-[200px] flex items-center justify-center">
            {isLoading ? (
                <LoadingSpinner />
            ) : generatedPaper ? (
                <Card className="w-full bg-primary/20 max-h-96">
                    <CardContent className="p-4">
                        <ScrollArea className="h-80">
                            <FormattedPaper paper={generatedPaper} />
                        </ScrollArea>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center text-muted-foreground">
                    <p>আপনি কি একটি নতুন প্রশ্নপত্র তৈরি করতে প্রস্তুত?</p>
                    <p className="text-sm">'জেনারেট করুন' বোতামে ক্লিক করুন।</p>
                </div>
            )}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>বন্ধ করুন</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-amber-500 text-accent-foreground hover:bg-amber-600"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            {generatedPaper ? 'আবার জেনারেট করুন' : 'জেনারেট করুন'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
