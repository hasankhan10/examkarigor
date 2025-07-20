
'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { PaperConfig, Question, AiQuestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Trash2, X, FileText, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import GeneratePaperDialog from './GeneratePaperDialog';


interface PaperPreviewProps {
  config: PaperConfig;
  questions: Question[];
  totalMarks: number;
  onRemoveQuestion: (questionId: number) => void;
  onReset: () => void;
  onAddAiQuestions: (questions: AiQuestion[]) => void;
}

export default function PaperPreview({ config, questions, totalMarks, onRemoveQuestion, onReset, onAddAiQuestions }: PaperPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const selectedTotalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  const handleDownloadPdf = async () => {
    const paperContentElement = document.getElementById('paper-content');
    if (!paperContentElement) return;

    setIsDownloading(true);

    // Temporarily hide all remove buttons before rendering
    const removeButtons = paperContentElement.querySelectorAll('.remove-on-print');
    removeButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');

    try {
        const canvas = await html2canvas(paperContentElement, {
            scale: 2, // Increase scale for better resolution
            useCORS: true,
            backgroundColor: '#ffffff', // Use a white background for the PDF
            onclone: (document) => {
              document.body.classList.add('print-pdf');
              // Manually hide elements with .no-print class for html2canvas
              document.querySelectorAll('.no-print').forEach(el => {
                (el as HTMLElement).style.display = 'none';
              });
            }
        });

        // Show the buttons again after canvas is created
        removeButtons.forEach(btn => (btn as HTMLElement).style.display = 'flex');

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const imgHeightOnPdf = pdfWidth / ratio;
        let heightLeft = imgHeightOnPdf;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightOnPdf);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightOnPdf);
            heightLeft -= pdfHeight;
        }

        pdf.save('question-paper.pdf');
    } catch (error) {
        console.error("Could not generate PDF", error);
         // Ensure buttons are shown even if an error occurs
        removeButtons.forEach(btn => (btn as HTMLElement).style.display = 'flex');
    } finally {
        setIsDownloading(false);
    }
  };

  const groupedQuestions = questions.reduce((acc, q) => {
    (acc[q.type] = acc[q.type] || []).push(q);
    return acc;
  }, {} as Record<Question['type'], Question[]>);

  const typeNames: Record<Question['type'], string> = {
    'MCQ': 'সঠিক উত্তরটি নির্বাচন করো (MCQ)',
    'SAQ': 'সংক্ষিপ্ত উত্তরভিত্তিক প্রশ্ন (SAQ)',
    'Long': 'দীর্ঘ উত্তরভিত্তিক প্রশ্ন',
    'True/False': 'সত্য/মিথ্যা নিরূপণ করো',
    'Fill in the Blanks': 'শূন্যস্থান পূরণ করো',
  };
  
  const questionTypeOrder: Question['type'][] = ['MCQ', 'SAQ', 'True/False', 'Fill in the Blanks', 'Long'];

  let questionCounter = 0;

  return (
    <Card className="sticky top-24 border-amber-500/20 shadow-lg shadow-amber-500/5 print-container">
      <div className="print-card">
        <CardHeader className="print-card-header no-print">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-amber-400" />
                <div>
                  <CardTitle className="font-headline text-2xl text-amber-400">প্রশ্নপত্রের পূর্বরূপ</CardTitle>
                  <CardDescription>আপনার তৈরি করা প্রশ্নপত্রটি এখানে দেখুন</CardDescription>
                </div>
              </div>
              <div className="no-print w-full sm:w-auto">
                 <GeneratePaperDialog config={config} onAccept={onAddAiQuestions} />
              </div>
           </div>
        </CardHeader>
        <CardContent className="print-card-content">
          <div id="paper-content" className="p-6 border rounded-lg bg-background print-border print:!p-0 print:!border-0 print:!shadow-none">
            <header className="text-center mb-8 space-y-2">
              <h1 className="text-2xl font-bold font-headline print-text-black">{config.schoolName}</h1>
              <h2 className="text-xl font-semibold print-text-black">{config.examTerm}</h2>
              <div className="flex justify-center items-center gap-x-4">
                <h3 className="text-lg print-text-black">{config.subject} পরীক্ষা</h3>
                <h3 className="text-lg print-text-black">শ্রেণী: {config.class}</h3>
              </div>
              <div className="flex justify-between text-sm pt-2 print-text-black">
                <span>পূর্ণমান: {totalMarks}</span>
                <span>সময়: {config.time}</span>
              </div>
            </header>
            <div className="print-paper-content">
                <div className="space-y-6">
                  {questions.length > 0 ? (
                    questionTypeOrder.map(type => {
                      const group = groupedQuestions[type];
                      if (!group || group.length === 0) return null;
                      
                      const groupMarks = group.reduce((sum, q) => sum + q.marks, 0);
                      const groupName = typeNames[type];

                      return (
                        <div key={type}>
                          <h3 className="text-lg font-headline font-bold mb-3 p-2 bg-primary/10 rounded-md print-text-black">{groupName} <span className="text-sm font-normal text-muted-foreground print-text-black">({group.length}টি প্রশ্ন, মোট {groupMarks} নম্বর)</span></h3>
                          {group.map((q) => {
                             questionCounter++;
                             return (
                              <div key={q.id} className="flex items-start gap-2 text-sm print-text-black p-2 rounded-lg mb-2">
                                <span className="font-bold">{questionCounter}.</span>
                                <div className="flex-1">
                                  {q.alternatives.map((alt, altIndex) => (
                                    <div key={altIndex}>
                                      {altIndex > 0 && <p className='font-bold my-1'>অথবা</p>}
                                      <p>{alt.text}</p>
                                      {alt.options && (
                                        <ol className="list-alpha list-inside grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                          {alt.options.map((opt, i) => <li key={i}>{opt}</li>)}
                                        </ol>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <Badge variant="outline" className="print-badge-transparent">[{q.marks}]</Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-6 h-6 text-red-500/70 hover:bg-red-500/10 hover:text-red-500 shrink-0 no-print remove-on-print"
                                  onClick={() => onRemoveQuestion(q.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-muted-foreground py-16 no-print h-[calc(100vh-32rem)] min-h-96 flex flex-col justify-center items-center">
                      <p>প্রশ্ন ভান্ডার থেকে প্রশ্ন যোগ করুন।</p>
                      <p className="text-sm">আপনার নির্বাচিত প্রশ্নগুলি এখানে প্রদর্শিত হবে।</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
            <div className="text-lg font-bold">
                <span className="text-muted-foreground">মোট:</span> <span className="text-amber-400">{selectedTotalMarks}</span> / {totalMarks}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                 <Button variant="outline" onClick={onReset} disabled={questions.length === 0} className="w-1/2 sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" />
                    রিসেট
                </Button>
                <Button onClick={handleDownloadPdf} className="bg-amber-500 text-accent-foreground hover:bg-amber-600 w-1/2 sm:w-auto" disabled={questions.length === 0 || isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                    {isDownloading ? 'ডাউনলোড হচ্ছে...' : 'প্রিন্ট / PDF'}
                </Button>
            </div>
        </CardFooter>
      </div>
    </Card>
  );
}
