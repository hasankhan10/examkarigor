import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-background"></div>
        <div className="absolute bottom-0 left-0 h-1/2 w-1/2 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute top-0 right-0 h-1/2 w-1/2 rounded-full bg-primary/20 blur-3xl"></div>
      </div>
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="text-2xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            EXAM কারিগর
          </Link>
          <Button asChild variant="ghost">
            <Link href="/dashboard">লগইন করুন</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-amber-400 uppercase rounded-full bg-primary/30 border border-amber-500/30">
            শিক্ষকদের জন্য একটি বিপ্লবী টুল
          </div>
          <h2 className="text-5xl md:text-7xl font-headline font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 mb-6 leading-normal md:leading-relaxed">
            প্রশ্নপত্র তৈরি করুন, <br /> নিমিষে ও নিখুঁতভাবে।
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-10">
            ‘EXAM কারিগর’ আপনার শিক্ষাদানের পদ্ধতিকে আরও সহজ ও কার্যকর করে তুলবে। আধুনিক প্রযুক্তির সাহায্যে এখন থেকে প্রশ্নপত্র তৈরি হবে আরও দ্রুত এবং সুন্দরভাবে।
          </p>
          <Button asChild size="lg" className="bg-amber-500 text-accent-foreground hover:bg-amber-600 text-lg py-7 px-10 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105">
            <Link href="/generate-pattern">
              প্রশ্নপত্র তৈরি করুন
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-muted-foreground text-sm z-10">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} EXAM কারিগর। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
}
