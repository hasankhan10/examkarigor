
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pricing } from '@/components/ui/pricing';
import type { PricingPlan } from '@/components/ui/pricing';

const plans: PricingPlan[] = [
  {
    name: "বেসিক প্ল্যান",
    price: "0",
    yearlyPrice: "0",
    period: "মাস",
    features: [
      "মাসে ৫টি প্রশ্নপত্র তৈরি",
      "বেসিক প্রশ্ন ভান্ডার",
      "AI দিয়ে প্রশ্ন তৈরি (সীমিত)",
      "PDF ডাউনলোড",
    ],
    description: "শুরু করার জন্য দুর্দান্ত",
    buttonText: "শুরু করুন",
    href: "/generate-pattern",
    isPopular: false,
  },
  {
    name: "প্রো",
    price: "199",
    yearlyPrice: "159", // ~20% off 199
    period: "মাস",
    features: [
      "সীমাহীন প্রশ্নপত্র তৈরি",
      "সম্পূর্ণ প্রশ্ন ভান্ডার",
      "সীমাহীন AI প্রশ্ন তৈরি",
      "PDF ডাউনলোড এবং সম্পাদনা",
      "অগ্রাধিকার সমর্থন",
    ],
    description: "পেশাদার শিক্ষকদের জন্য",
    buttonText: "প্রো প্ল্যান কিনুন",
    href: "#",
    isPopular: true,
  },
  {
    name: "প্রতিষ্ঠানের জন্য",
    price: "Custom",
    yearlyPrice: "Custom",
    period: "যোগাযোগ",
    features: [
      "প্রো প্ল্যানের সমস্ত সুবিধা",
      "একাধিক শিক্ষক অ্যাকাউন্ট",
      "প্রতিষ্ঠানের ব্র্যান্ডিং",
      "ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার",
    ],
    description: "স্কুল এবং কোচিং সেন্টারের জন্য",
    buttonText: "যোগাযোগ করুন",
    href: "#",
    isPopular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            EXAM কারিগর
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/pricing">মূল্য</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard">লগইন করুন</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <Pricing 
            plans={plans}
            title="আপনার জন্য সঠিক প্ল্যান"
            description={`আমাদের সহজ এবং স্বচ্ছ মূল্য পরিকল্পনা থেকে বেছে নিন।\nকোনো লুকানো চার্জ নেই।`}
        />
      </main>

      <footer className="w-full py-6 text-center text-muted-foreground text-sm z-10">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} EXAM কারিগর। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
}
