
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
import type { PaperConfig, AiQuestion } from '@/lib/types';
import { Loader2, Bot, Check, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/hooks/use-language';


interface GeneratePaperDialogProps {
  config: PaperConfig;
  onAccept: (questions: AiQuestion[]) => void;
}

export default function GeneratePaperDialog({ config, onAccept }: GeneratePaperDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<AiQuestion[] | null>(null);
  const [difficulty, setDifficulty] = useState(50); // Default to medium difficulty
  const { toast } = useToast();
  const { t, lang } = useLanguage();

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
      <p className="font-headline text-lg">{t('ai_spinner_title')}</p>
      <p className="text-sm text-muted-foreground">{t('ai_spinner_desc')}</p>
    </div>
  );
  
  const FormattedPaper = ({ questions }: { questions: AiQuestion[] }) => {
    return (
      <div className="space-y-4 text-left">
        {questions.map((q, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="font-bold">{i + 1}.</span>
            <div className="flex-1">
              {q.alternatives.map((alt, altIndex) => (
                <div key={altIndex}>
                  {altIndex > 0 && <p className='font-bold my-1'>{t('or')}</p>}
                  <p>{alt.text}</p>
                  {alt.options && (
                    <ol className="list-alpha list-inside grid grid-cols-2 gap-2 mt-2">
                      {alt.options.map((opt, j) => <li key={j}>{opt}</li>)}
                    </ol>
                  )}
                </div>
              ))}
            </div>
            <Badge variant="outline">[{q.marks}]</Badge>
          </div>
        ))}
      </div>
    )
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedQuestions(null);
    try {
      const language = config.subject === 'English' ? 'English' : 'Bengali';
      const result = await generateRandomPaper({ ...config, difficulty, language });
      setGeneratedQuestions(result.questions);
      toast({
        title: t('toast_ai_success_title'),
        description: t('toast_ai_success_desc'),
      });
    } catch (error) {
      console.error('Failed to generate paper:', error);
      toast({
        variant: 'destructive',
        title: t('toast_error_title'),
        description: t('toast_error_desc'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (generatedQuestions) {
        onAccept(generatedQuestions);
        toast({
            title: t('toast_add_success_title'),
            description: t('toast_add_success_desc'),
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

  const handleSliderChange = (value: number[]) => {
    setDifficulty(value[0]);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 border border-amber-500/50">
          <Bot className="mr-2 h-5 w-5" />
          {t('generate_with_ai')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-amber-400">{t('ai_modal_title')}</DialogTitle>
          <DialogDescription>
            {t('ai_modal_desc')}
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
                <div className="text-center text-muted-foreground space-y-4 w-full px-8">
                    <div>
                        <Label className='text-base font-semibold'>{t('select_difficulty')}: <span className='font-bold text-amber-400'>{difficulty}</span></Label>
                         <div className='py-4'>
                            <Slider
                                defaultValue={[difficulty]}
                                onValueChange={handleSliderChange}
                                max={100}
                                step={1}
                            />
                         </div>
                         <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t('difficulty_very_easy')}</span>
                            <span>{t('difficulty_medium')}</span>
                            <span>{t('difficulty_very_hard')}</span>
                        </div>
                    </div>
                     <p className="text-sm pt-4">{t('click_generate_button')}</p>
                </div>
            )}
        </div>

        <DialogFooter>
            {generatedQuestions ? (
                <>
                    <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
                        <X className="mr-2 h-4 w-4" />
                        {t('close_button')}
                    </Button>
                    <Button onClick={handleAccept} className="bg-green-600 text-white hover:bg-green-700">
                        <Check className="mr-2 h-4 w-4" />
                        {t('accept_button')}
                    </Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="bg-amber-500 text-accent-foreground hover:bg-amber-600"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        {t('regenerate_button')}
                    </Button>
                </>
            ) : (
                <>
                    <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>{t('close_button')}</Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="bg-amber-500 text-accent-foreground hover:bg-amber-600"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        {t('generate_button')}
                    </Button>
                </>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
