"use client";

import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { X, Plus } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

export default function DonorForm({ isOpen, onClose, session}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    foodDescription: "",
    quantity: "",
    pickupAddress: "",
    expirationTime: "",
    lat: null,
    lng: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("📍 Geolocation is not supported by your current browser profile.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            setFormData((prev) => ({
              ...prev,
              pickupAddress: data.display_name
            }));
          }
        } catch (err) {
          console.error("Error converting coordinates to text address:", err);
          setFormData((prev) => ({
            ...prev,
            pickupAddress: `📍 Position: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("GPS Access Denied:", error);
        setIsLocating(false);
        alert("🔒 Location Access Denied. Please enable location permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
    

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lat || !formData.lng) {
      alert("⚠️ Location missing! Please use the 'Use Current Location' button to lock onto your pickup position.");
      return;
    }

    setIsSubmitting(true);

    try {
      const expirationInUTC = new Date(formData.expirationTime).toISOString();
      const { error } = await supabase
        .from('donations')
        .insert([
          {
            food_type: formData.foodDescription,
            quantity: formData.quantity,
            expiration_time: expirationInUTC,
            pickup_location: formData.pickupAddress,
            phone: formData.phone,
            lat: formData.lat, 
            lng: formData.lng,
            email: session?.user?.email || null,
            status: "available"
          },
        ]);

      if (error) throw error;

      setFormData({
        foodDescription: "",
        quantity: "",
        pickupAddress: "",
        phone: "", 
        expirationTime: "",
        lat: null,
        lng: null
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
          type="button"
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

            {/* ADDRESS CONTAINER & HARDWARE GPS PROMPT INTERFACE */}
            <div className="space-y-2">
              <Label htmlFor="pickupAddress" className="text-base font-medium">
                Pickup Address
              </Label>
              <div className="relative">
                <Input
                  id="pickupAddress"
                  name="pickupAddress"
                  type="text"
                  placeholder="Street address or click button below to fetch..."
                  value={formData.pickupAddress}
                  onChange={handleInputChange}
                  required
                  className="pr-10"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>

            
              
              {/* 🛰️ Trigger Button for hardware tracking coordinates */}
              
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 mt-1.5"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Triangulating Coordinates...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    Use Current Location
                  </>
                )}
              </Button>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">
                Phone Number (+91)
              </Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

              {/* Success Badge
              {formData.lat && (
                <p className="text-xs text-emerald-600 font-medium pt-0.5 animate-fade-in">
                  ✨ Coordinates Locked: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                </p>
              )} */}
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
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
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