import { Wifi, EggFried, Car, Dumbbell, BellRing, Sparkles } from "lucide-react"

export const hotel = {
    checkIn: "3:00 PM",
    checkOut: "10:00 AM",
    address: "123 Custom Street, Your City, ST 00000",
    phone: "+1 (123) 456-7890",
    email: "support@roomify.com"
}

export const included = [
    { icon: Wifi, label: "Free high-speed Wifi"},
    { icon: EggFried, label: "Daily breakfast"},
    { icon: Car, label: "Parking (with fee)"},
    { icon: Dumbbell, label: "Fitness room access"},
    { icon: BellRing, label: "In-room service"},
    { icon: Sparkles, label: "Daily housekeeping"}
]

export const policies = [
    {
        title: "Cancellation",
        text: "Free cancellation up to 48 hours before check-in. Later cancellations are charged one night.",
        href: "/policies#cancellation"
    },
    {
        title: "Payment",
        text: "We accept cards of any type and digital wallets.",
        href: "/policies#payment"
    },
    {
        title: "Accessabiliity",
        text: "Elevator access",
        href: "/accessability"
    },
]

export const cancellationRules = [
    { when: "48+ hours before check-in", outcome: "Full refund"},
    { when: "Less than 48 hours before check-in", outcome: "First night charged"},
    { when: "No-show", outcome: "Full stay charged"}
]

export const paymentInfo = {
    methods: ["Visa", "Mastercard", "Amex", "American Express", "Discover", "Paypal", "Apple Pay and Google Pay"],
    steps: [
        "Your card will be verified when you book. No charge will be made yet.",
        "The full stay is charged at check-in.",
        "A refundable $100 hold is placed at check-in, and released within 5 business days of check-out.",
        "In-room orders are added to your room services bill and settled at check-out."
    ]
}

export const accessibilityFeatures = [
    "Step-free entrance and elevator access to all floors.",
    "Fire alarms and doorbell alerts are available.",
    "Service animals are welcome in all areas.",
    "Underground parking in both the hotel and nearby areas.",
    "Accessible rooms that are handicapped-friendly."
]

export const faqs = [
        { category: "Booking", q: "Can I check in early", a: "Early check-in depends on availability. Request it when you book and we'll confirm the day before."},
        { category: "Booking", q: "Can I change my dates?", a: "Yes, from the Bookings page, free of charge up to 48 hours before check-in "},
        { category: "During your stay", q: "Are pets allowed?", a: "Service pets are allowed. Pet-friendly rooms are available on request."},
        { category: "During your stay", q: "How do I order room service?", a: "Use the Roomify app or the rablet in your room to order food and amenitiews 24/7."},
        { category: "Getting here", q: "Is there parking?", a: "Yes, on-site parking is avaiable for a daily fee."}
]

export const reviews = [
  { name: "John R.", rating: 5, text: "Calm, quiet, and the in-room ordering was a treat.", stay: "Deluxe Double · Aug 2026" },
  { name: "Daniel K.", rating: 5, text: "Check-in took two minutes. Staff were lovely.", stay: "Garden Suite · Jul 2026" },
  { name: "Carla S.", rating: 4, text: "Beautiful room and great breakfast. Would stay again.", stay: "Standard King · Jul 2026" },
  { name: "Michelle G.", rating: 5, text: "Our family loved staying here. Great service and the beds were comfy!", stay: "Family Suite · Aug 2026" }
]
