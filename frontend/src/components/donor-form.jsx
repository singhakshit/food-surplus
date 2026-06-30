"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { X, Plus } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

export default function DonorForm({ isOpen, onClose, session}) {
  const [formData, setFormData] = useState({
    foodDescription: "",
    quantity: "",
    pickupAddress: "",
    expirationTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('donations')
        .insert([
          {
            food_type: formData.foodDescription,
            quantity: formData.quantity,
            expiration_time: formData.expirationTime,
            pickup_location: formData.pickupAddress,
            email: session?.user?.email || null,
          },
        ]);

      if (error) throw error;

      setFormData({
        foodDescription: "",
        quantity: "",
        pickupAddress: "",
        expirationTime: "",
      });

      onClose();
      alert("🎉 Thank you for your donation! Your surplus food has been logged on Supabase.");
    } catch (error) {
      console.error("Error submitting donation to Supabase:", error);
      alert("Error submitting donation to Supabase database: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <CardHeader>
          <CardTitle className="text-2xl">Start Donating</CardTitle>
          <CardDescription>
            Share the details of your food donation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="foodDescription" className="text-base font-medium">
                Food Description
              </Label>
              <Textarea
                id="foodDescription"
                name="foodDescription"
                placeholder="e.g., Fresh vegetables, baked goods, canned items..."
                value={formData.foodDescription}
                onChange={handleInputChange}
                required
                className="min-h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-base font-medium">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="text"
                placeholder="e.g., 50 lbs, 100 servings, 2 boxes..."
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupAddress" className="text-base font-medium">
                Pickup Address
              </Label>
              <Input
                id="pickupAddress"
                name="pickupAddress"
                type="text"
                placeholder="Street address, city, state, zip..."
                value={formData.pickupAddress}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationTime" className="text-base font-medium">
                Expiration Date & Time
              </Label>
              <Input
                id="expirationTime"
                name="expirationTime"
                type="datetime-local"
                value={formData.expirationTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Donation
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}