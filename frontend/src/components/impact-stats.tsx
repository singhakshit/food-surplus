"use client";

import { useEffect, useState } from "react";
import { Apple, Truck, MapPin, Leaf } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function StatCard({ icon, value, suffix, label, delay }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div className="relative group">
      <div className="bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
          {count.toLocaleString()}{suffix}
        </div>
        <p className="text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}

export function ImpactStats() {
  const stats = [
    {
      icon: <Apple className="w-7 h-7 text-primary" />,
      value: 2.4,
      suffix: "M",
      label: "Meals Redistributed",
      delay: 0,
    },
    {
      icon: <Truck className="w-7 h-7 text-primary" />,
      value: 850,
      suffix: "K",
      label: "Pounds of Food Saved",
      delay: 200,
    },
    {
      icon: <MapPin className="w-7 h-7 text-primary" />,
      value: 120,
      suffix: "+",
      label: "Cities Served",
      delay: 400,
    },
    {
      icon: <Leaf className="w-7 h-7 text-primary" />,
      value: 340,
      suffix: "K",
      label: "CO₂ Emissions Prevented",
      delay: 600,
    },
  ];

  return (
    <section id="impact" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Our Collective Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Together, we&apos;re making a measurable difference in reducing food waste 
            and fighting hunger in communities across the nation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
