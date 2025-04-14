import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { Shield, Clock, Languages, Users, RefreshCcw, DollarSign } from "lucide-react";

export const comparisonConfig = {
    title: "Tired of saying NO to students?",
    subtitle: "See how our platform transforms the learning experience",
    
    challenges: [
      {
        title: "Income Limitations",
        description: "Cap your income — You only earn when you're actively teaching, with no passive revenue.",
        icon: <Shield className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Capacity Constraints",
        description: "Turn away eager students — Limited time slots mean saying no to learners who want to join.",
        icon: <Clock className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Work-Life Imbalance",
        description: "Face burnout — Managing high demand with no scalable tools leads to mental and physical exhaustion.",
        icon: <Languages className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Limited Growth",
        description: "Limited growth potential — You can only teach so many hours a day.",
        icon: <Users className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Scheduling Conflicts",
        description: "Struggle with scheduling — Conflicting time zones and calendars make it hard to fit everyone in.",
        icon: <Clock className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Income Insecurity",
        description: "Risk income gaps — If you take time off or fall sick, your earnings stop.",
        icon: <DollarSign className="h-6 w-6 text-indigo-400" />
      }
    ],
    
    benefits: [
      {
        title: "Global Reach",
        description: "Expand globally — Make your expertise available to learners worldwide, across all time zones.",
        icon: <Shield className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Passive Income",
        description: "Generate passive income 24/7 — Create once and earn anytime, maximize your earnings even in the times you're offline or on break.",
        icon: <Clock className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Full Ownership",
        description: "Own your platform — Maintain full control over your content and avoid using third party platforms.",
        icon: <Languages className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Unlimited Students",
        description: "Grow without limits — Serve unlimited students without increasing your teaching hours.",
        icon: <Users className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "100% Revenue",
        description: "Keep 100% of your earnings — No monthly fees, no commissions, no revenue sharing.",
        icon: <DollarSign className="h-6 w-6 text-indigo-400" />
      },
      {
        title: "Future-Proof Business",
        description: "Future-proof your income — Even if you stop live teaching, your lessons keep working for you.",
        icon: <RefreshCcw className="h-6 w-6 text-indigo-400" />
      }
    ]
  }

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  customIndex: number;
}

function FeatureCard({
  title,
  description,
  icon,
  customIndex,
}: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      custom={customIndex}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg p-6 flex flex-col shadow-[0_0_15px_rgba(79,70,229,0.15)] hover:shadow-[0_0_20px_rgba(79,70,229,0.25)] transition-all duration-300"
    >
      <div className="rounded-full bg-indigo-500/20 p-3 w-fit mb-4 border border-indigo-500/30">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-indigo-600">
        {title}
      </h3>
      <p className="text-gray-700">
        {description}
      </p>
    </motion.div>
  );
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.3 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export default function Comparison() {
  const { title, subtitle, challenges, benefits } = comparisonConfig;

  return (
    <section className="py-16 px-4 relative">
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
        </div>

        <div className="space-y-16">
          {/* Challenges Section */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <FeatureCard
                  key={index}
                  title={challenge.title}
                  description={challenge.description}
                  icon={challenge.icon}
                  customIndex={index}
                />
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Say YES instead
          </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <FeatureCard
                  key={index}
                  title={benefit.title}
                  description={benefit.description}
                  icon={benefit.icon}
                  customIndex={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
