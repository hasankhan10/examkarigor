
'use client';

import { useState } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { useLanguage } from '@/hooks/use-language';

interface QuestionBankProps {
  questions: Question[];
  onAddQuestion: (question: Question) => void;
  selectedIds: number[];
}

export default function QuestionBank({ questions, onAddQuestion, selectedIds }: QuestionBankProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { t, lang } = useLanguage();

  const filteredQuestions = questions.filter((q) =>
    q.alternatives.some(alt => alt.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
         <div className="flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-amber-400" />
          <div>
            <CardTitle className="font-headline text-2xl text-amber-400">{t('question_bank_title')}</CardTitle>
            <CardDescription>{t('question_bank_desc')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          placeholder={t('search_questions_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ScrollArea className="h-96 w-full">
          <div className="space-y-4 pr-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => {
                const isSelected = selectedIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-lg border border-primary/20 bg-background flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 space-y-2">
                        {q.alternatives.map((alt, altIndex) => (
                           <div key={altIndex}>
                             {altIndex > 0 && <p className='font-bold my-1 text-sm'>{t('or')}</p>}
                             <p className="font-medium">{alt.text}</p>
                             {alt.options && (
                               <ol className="list-alpha list-inside text-sm text-muted-foreground">
                                   {alt.options.map((opt, i) => <li key={i}>{opt}</li>)}
                               </ol>
                             )}
                           </div>
                        ))}
                        <div className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary">{q.type}</Badge>
                            <Badge variant="outline" className="border-amber-400/50 text-amber-400">{t('marks_badge', { marks: q.marks })}</Badge>
                        </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-green-500/70 hover:bg-green-500/10 hover:text-green-500 disabled:text-muted-foreground disabled:hover:bg-transparent"
                      onClick={() => onAddQuestion(q)}
                      disabled={isSelected}
                      aria-label="Add question"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </Button>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-muted-foreground py-16">
                <p>{t('no_questions_found')}</p>
                <p className="text-sm">{t('try_changing_class_subject')}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
