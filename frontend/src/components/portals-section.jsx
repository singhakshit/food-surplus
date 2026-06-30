"use client";

import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, Building2, Heart, CheckCircle2 } from "lucide-react";
import { useState } from "react";

function PortalCard({ title, description, icon, features, buttonText, variant }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${
        isHovered ? "border-primary" : "border-border"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background */}
      <div 
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : ""
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${
          variant === "donor" 
            ? "from-primary/5 via-transparent to-transparent" 
            : "from-accent/5 via-transparent to-transparent"
        }`} />
      </div>

      <CardHeader className="relative pb-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
          variant === "donor" ? "bg-primary/10" : "bg-accent/10"
        }`}>
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-2">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 ${
                variant === "donor" ? "text-primary" : "text-accent"
              }`} />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Wrapped Button in React Router Link for routing functionality */}
        <Button 
          className={`w-full h-12 text-base font-medium ${
            variant === "donor" 
              ? "bg-green-700 hover:bg-green-800 text-white" 
              : "bg-accent hover:bg-accent/90 text-accent-foreground"
          }`}
          asChild
        >
          <Link to="/login" className="flex items-center justify-center gap-2 no-underline">
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function PortalsSection() {
  const portals = [
    {
      title: "Donor Portal",
      description: "For restaurants, grocers, caterers, and food businesses looking to donate surplus food.",
      icon: <Building2 className="w-8 h-8 text-primary" />,
      features: [
        "Schedule pickups at your convenience",
        "Track your donations and impact",
        "Receive tax deduction receipts",
        "Join a network of sustainable businesses",
      ],
      buttonText: "Sign In as Donor",
      variant: "donor",
    },
    {
      title: "Recipient Portal",
      description: "For food banks, shelters, community kitchens, and nonprofits serving those in need.",
      icon: <Heart className="w-8 h-8 text-accent" />,
      features: [
        "Browse available food donations",
        "Request specific food items",
        "Coordinate delivery or pickup",
        "Connect with local food donors",
      ],
      buttonText: "Sign In as Recipient",
      variant: "recipient",
    },
  ];

  return (
    <section id="portals" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Choose Your Portal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you have food to share or are seeking support for your community, 
            we&apos;ve built dedicated experiences for both.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {portals.map((portal, index) => (
            <PortalCard key={index} {...portal} />
          ))}
        </div>
      </div>
    </section>
  );
}