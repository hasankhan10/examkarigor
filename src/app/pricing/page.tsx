
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "বিনামূল্যে",
    price: "₹0",
    description: "শুরু করার জন্য দুর্দান্ত",
    features: [
      "মাসে ৫টি প্রশ্নপত্র তৈরি",
      "বেসিক প্রশ্ন ভান্ডার",
      "AI দিয়ে প্রশ্ন তৈরি (সীমিত)",
      "PDF ডাউনলোড",
    ],
    cta: "শুরু করুন",
    link: "/generate-pattern"
  },
  {
    name: "প্রো",
    price: "₹199",
    pricePeriod: "/ মাস",
    description: "পেশাদার শিক্ষকদের জন্য",
    features: [
      "সীমাহীন প্রশ্নপত্র তৈরি",
      "সম্পূর্ণ প্রশ্ন ভান্ডার",
      "সীমাহীন AI প্রশ্ন তৈরি",
      "PDF ডাউনলোড এবং সম্পাদনা",
      "অগ্রাধিকার সমর্থন",
    ],
    cta: "প্রো প্ল্যান কিনুন",
    link: "#"
  },
  {
    name: "প্রতিষ্ঠানের জন্য",
    price: "যোগাযোগ করুন",
    description: "স্কুল এবং কোচING সেন্টারের জন্য",
    features: [
      "প্রো প্ল্যানের সমস্ত সুবিধা",
      "একাধিক শিক্ষক অ্যাকাউন্ট",
      "প্রতিষ্ঠানের ব্র্যান্ডিং",
      "ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার",
    ],
    cta: "যোগাযোগ করুন",
    link: "#"
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
        <section className="container mx-auto px-4 py-12 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 mb-4">
                আপনার জন্য সঠিক প্ল্যান
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                আমাদের সহজ এবং স্বচ্ছ মূল্য পরিকল্পনা থেকে বেছে নিন। কোনো লুকানো চার্জ নেই।
            </p>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.name} className="flex flex-col border-primary/20 shadow-lg shadow-primary/5 hover:border-amber-400/50 hover:shadow-amber-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-amber-400">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <div>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.pricePeriod && <span className="text-muted-foreground">{plan.pricePeriod}</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild size="lg" className="w-full bg-amber-500 text-accent-foreground hover:bg-amber-600">
                    <Link href={plan.link}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full py-6 text-center text-muted-foreground text-sm z-10">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} EXAM কারিগর। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
}
