import { Pencil, Star, Sparkles } from "lucide-react";
import { CreativePricing, type PricingTier } from "../ui/creative-pricing";
import { motion } from "motion/react";
const sampleTiers: PricingTier[] = [
    {
        name: "Creator",
        icon: <Pencil className="w-6 h-6" />,
        price: 29,
        description: "Perfect for short video beginners",
        color: "amber",
        features: [
            "60-second Video Export",
            "10 Trending Templates",
            "Auto Text-to-Speech",
            "Basic Transitions",
        ],
    },
    {
        name: "Influencer",
        icon: <Star className="w-6 h-6" />,
        price: 79,
        description: "For serious content creators",
        color: "blue",
        features: [
            "3-minute Video Export",
            "Voice Effects & Filters",
            "Trending Sound Library",
            "Auto Captions & Subtitles",
        ],
        popular: true,
    },
    {
        name: "Pro Studio",
        icon: <Sparkles className="w-6 h-6" />,
        price: 149,
        description: "For viral content masters",
        color: "purple",
        features: [
            "Multi-clip Editing",
            "Green Screen Effects",
            "Viral Sound Detection",
            "Engagement Analytics",
        ],
    },
];

export function Pricing() {
    return (
        <motion.section
            id="pricing"
            className=" py-8 md:py-16 px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <CreativePricing 
                tag="Simple Pricing"
                title="Our Pricing Plans"
                description="Choose the plan that's right for you"
                tiers={sampleTiers}
            />
        </motion.section>
    )
}
