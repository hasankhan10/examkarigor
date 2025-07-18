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
import type { PaperConfig, Question } from '@/lib/types';
import { Loader2, Bot, Check, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

type AiQuestion = Omit<Question, 'id' | 'class' | 'subject' | 'chapter'>;

interface GeneratePaperDialogProps {
  config: PaperConfig;
  onAccept: (questions: AiQuestion[]) => void;
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
    <p className="font-headline text-lg">আপনার জন্য একটি বিশেষ প্রশ্নপত্র তৈরি করা হচ্ছে...</p>
    <p className="text-sm text-muted-foreground">এতে কয়েক মুহূর্ত সময় লাগতে পারে।</p>
  </div>
);

const FormattedPaper = ({ questions }: { questions: AiQuestion[] }) => {
  return (
    <div className="space-y-4 text-left">
      {questions.map((q, i) => (
        <div key={i} className="flex items-start gap-2 text-sm">
          <span className="font-bold">{i + 1}.</span>
          <div className="flex-1">
            <p>{q.text}</p>
            {q.options && (
              <ol className="list-alpha list-inside grid grid-cols-2 gap-2 mt-2">
                {q.options.map((opt, j) => <li key={j}>{opt}</li>)}
              </ol>
            )}
          </div>
          <Badge variant="outline">[{q.marks}]</Badge>
        </div>
      ))}
    </div>
  )
}

export default function GeneratePaperDialog({ config, onAccept }: GeneratePaperDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<AiQuestion[] | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedQuestions(null);
    try {
      const result = await generateRandomPaper(config);
      setGeneratedQuestions(result.questions);
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

  const handleAccept = () => {
    if (generatedQuestions) {
        onAccept(generatedQuestions);
        toast({
            title: 'সফলভাবে যোগ করা হয়েছে!',
            description: 'AI দ্বারা তৈরি প্রশ্নগুলি আপনার প্রশ্নপত্রে যোগ করা হয়েছে।',
        });
        handleOpenChange(false);
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        setGeneratedQuestions(null);
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
            ) : generatedQuestions ? (
                <Card className="w-full bg-primary/20 max-h-96">
                    <CardContent className="p-4">
                        <ScrollArea className="h-80 pr-4">
                           <FormattedPaper questions={generatedQuestions} />
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
            {generatedQuestions ? (
                <>
                    <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
                        <X className="mr-2 h-4 w-4" />
                        বন্ধ করুন
                    </Button>
                    <Button onClick={handleAccept} className="bg-green-600 text-white hover:bg-green-700">
                        <Check className="mr-2 h-4 w-4" />
                        গ্রহণ করুন
                    </Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="bg-amber-500 text-accent-foreground hover:bg-amber-600"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        আবার জেনারেট করুন
                    </Button>
                </>
            ) : (
                <>
                    <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>বন্ধ করুন</Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="bg-amber-500 text-accent-foreground hover:bg-amber-600"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        জেনারেট করুন
                    </Button>
                </>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
