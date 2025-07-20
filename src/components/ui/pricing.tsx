
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";

export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you. All plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useIsMobile();
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  const getDiscountedMonthlyPrice = (plan: PricingPlan) => {
      const priceNum = Number(plan.price);
      if (isNaN(priceNum)) return plan.price;
      return String(Math.round(priceNum * 0.75));
  }

  const getPrice = (plan: PricingPlan) => {
    return isMonthly ? plan.price : getDiscountedMonthlyPrice(plan);
  };
  
  const getAnnualPrice = (plan: PricingPlan) => {
    const discountedMonthlyPrice = Number(getDiscountedMonthlyPrice(plan));
    if (isNaN(discountedMonthlyPrice) || discountedMonthlyPrice === 0) {
      return null;
    }
    return (discountedMonthlyPrice * 12);
  }

  const getPeriod = (plan: PricingPlan) => {
    return "মাস";
  }

  const formatPrice = (price: string | number) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return price;
    return `₹${numPrice}`;
  };

  return (
    <div className="container py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 sm:text-6xl">
          আপনার জন্য <span className="bg-yellow-400 text-background px-2 rounded-md">সঠিক</span> প্ল্যান
        </h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center items-center mb-16 space-x-2">
        <span className="font-semibold">মাসিক বিল</span>
        <Label>
            <Switch
              ref={switchRef as any}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
        </Label>
        <span className="font-semibold">
          বার্ষিক বিল <span className="text-amber-500">(২৫% ছাড়)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {plans.map((plan, index) => (
          <div key={index} className="relative h-full">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{
                y: 0,
                opacity: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.2 + index * 0.1,
              }}
              className={cn(
                `rounded-2xl p-6 text-center lg:flex lg:flex-col lg:justify-center relative border overflow-hidden`,
                plan.isPopular
                  ? "border-amber-500 border-2 shadow-amber-500/10 shadow-lg"
                  : "border-primary/20",
                "flex flex-col h-full"
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="absolute top-[18px] right-[-34px] w-[120px] transform rotate-45 bg-amber-500 py-1 px-3 text-center flex items-center justify-center gap-1 z-10">
                    <Star className="text-background h-4 w-4 fill-current" />
                    <span className="text-background text-sm font-semibold">
                      সবচেয়ে জনপ্রিয়
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex-1 flex flex-col pt-4">
                <p className="text-lg font-headline font-semibold text-amber-400">
                  {plan.name}
                </p>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-x-1">
                    <span className="text-5xl font-bold tracking-tight text-foreground">
                      {formatPrice(getPrice(plan))}
                    </span>
                    {plan.price !== "0" && (
                      <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                        / {getPeriod(plan)}
                      </span>
                    )}
                  </div>
                   {!isMonthly && getAnnualPrice(plan) && (
                      <p className="text-sm text-muted-foreground mt-1">বার্ষিক বিল {formatPrice(getAnnualPrice(plan) || 0)}</p>
                    )}
                </div>


                <ul className="mt-8 gap-3 flex flex-col">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-center gap-2"
                    >
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-xs leading-5 text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <Link
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "default" : "outline",
                    size: "lg",
                  }),
                  "mt-8 w-full",
                  plan.isPopular &&
                    "bg-amber-500 text-accent-foreground hover:bg-amber-600"
                )}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
