import {
  Phone, Scissors, Leaf, Sprout, TreePine, Trash2, CalendarDays,
  Star, ShieldCheck, CircleDollarSign, Clock3, MapPin
} from "lucide-react";

export const siteConfig = {
  privacyPolicy: {
    enabled: import.meta.env.VITE_ENABLE_PRIVACY_POLICY !== "false",
    path: "/privacy-policy.html"
  },
  sections: {
    services: true,
    about: true,
    gallery: true,
    reviews: true,
    reviewForm: true,
    areas: true,
    contact: true,
    googleBusinessProfile: true
  },
  services: [
    { title: "Lawn Mowing", description: "Regular or one-off lawn mowing to keep your lawn looking perfect.", icon: Scissors, enabled: true, slug: "lawn-mowing" },
    { title: "Lawn Edging", description: "Neat and clean edges for a professional finish.", icon: Leaf, enabled: true, slug: "lawn-edging" },
    { title: "Garden Maintenance", description: "Weeding, trimming, pruning and general garden care.", icon: Sprout, enabled: true, slug: "garden-maintenance" },
    { title: "Hedge Trimming", description: "Keep your hedges neat, healthy and well shaped.", icon: TreePine, enabled: true, slug: "hedge-trimming" },
    { title: "Weed Removal", description: "Effective weed control to keep your garden clean.", icon: Sprout, enabled: true, slug: "weed-removal" },
    { title: "Garden Clean Ups", description: "One-off or seasonal garden clean ups.", icon: Trash2, enabled: true, slug: "garden-clean-ups" },
    { title: "Green Waste Removal", description: "We remove and dispose of green waste responsibly.", icon: Trash2, enabled: true, slug: "green-waste-removal" },
    { title: "Regular Maintenance", description: "Weekly, fortnightly or monthly garden and lawn care.", icon: CalendarDays, enabled: true, slug: "regular-maintenance" }
  ],
  areas: [
    { name: "Mt Albert", enabled: true },
    { name: "St Lukes", enabled: true },
    { name: "Sandringham", enabled: true },
    { name: "Epsom", enabled: true },
    { name: "Mt Roskill", enabled: true },
    { name: "Avondale", enabled: true },
    { name: "New Lynn", enabled: true },
    { name: "Blockhouse Bay", enabled: true },
    { name: "Henderson", enabled: true },
    { name: "Glen Eden", enabled: true },
    { name: "Titirangi", enabled: true },
    { name: "Surrounding Auckland", enabled: true }
  ],
  reviews: [
    {
      quote: "AVCENA did an amazing job on our lawn and garden. Very reliable, friendly and the results are outstanding. Highly recommend their service.",
      name: "Customer Review",
      location: "Auckland, New Zealand",
      rating: 5,
      enabled: true
    }
  ],
  googleBusinessProfile: {
    enabled: true,
    label: "Google Business Profile",
    url: "https://www.google.com/search?q=AVCENA+Gardening+%26+Lawnmowing+Auckland"
  },
  googleReview: {
    enabled: true,
    label: "Google Review",
    url: "https://www.google.com/search?q=AVCENA+Gardening+%26+Lawnmowing+Auckland"
  },
  reviewRequest: {
    enabled: true,
    label: "Leave a review",
    url: "https://neeraj-geetu2026.github.io/avcena.github.io/#reviews",
    messengerText: "Thanks for choosing AVCENA Gardening & Lawnmowing. We’d really appreciate your feedback. Please leave a review here: https://neeraj-geetu2026.github.io/avcena.github.io/#reviews"
  },
  trustItems: [
    { icon: Clock3, title: "Reliable & Punctual", description: "We show up on time, every time.", enabled: true },
    { icon: Star, title: "High Quality Work", description: "We take pride in every lawn and garden.", enabled: true },
    { icon: CircleDollarSign, title: "Affordable Prices", description: "Quality service at competitive rates.", enabled: true },
    { icon: ShieldCheck, title: "Satisfaction Guaranteed", description: "We aim for 100% satisfaction on every job.", enabled: true }
  ],
  suburbContent: [
    { name: "Mt Albert", enabled: true, text: "Garden maintenance and lawn mowing for homes in Mt Albert and surrounding areas." },
    { name: "Epsom", enabled: true, text: "Reliable lawn care and hedge trimming for Epsom properties and family homes." },
    { name: "New Lynn", enabled: true, text: "Affordable garden and lawn services across New Lynn and surrounding suburbs." }
  ]
};
