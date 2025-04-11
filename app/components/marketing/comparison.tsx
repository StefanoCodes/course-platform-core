import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { X, Check } from "lucide-react";
import { ElegantShape } from "./hero";

export const comparisonConfig = {
    title: "Tired of traditional learning methods?",
    subtitle: "See how our platform transforms the learning experience",
    
    traditional: {
      title: "Traditional Learning",
      className: "border-r-2 border-l-2 border-gray-200  pr-0 rounded-none",
      titleColor: "text-red-600",
      iconColor: "text-red-500",
      items: [
        {
          text: "Fixed schedules and locations",
        },
        {
          text: "Limited access to quality education",
        },
        {
          text: "One-size-fits-all approach",
        },
        {
          text: "High costs and commuting time",
        },
        {
          text: "Limited interaction with experts",
        },
      ],
    },
    
    platform: {
      title: "Learning with Our Platform",
    //   className: "bg-green-50/50 border-green-100",
      titleColor: "text-green-600",
      iconColor: "text-green-500",
      items: [
        {
          text: "Learn at your own pace, anywhere",
        },
        {
          text: "Access to world-class instructors",
        },
        {
          text: "Personalized learning paths",
        },
        {
          text: "Cost-effective and time-saving",
        },
        {
          text: "Interactive and engaging content",
        },
      ],
    },
  }

interface ComparisonCardProps {
  title: string;
  items: { text: string }[];
  className?: string;
  titleColor: string;
  iconColor: string;
  Icon: React.ReactNode;
  customIndex: number;
}

function ComparisonCard({
  title,
  items,
  className,
  titleColor,
  iconColor,
  Icon,
  customIndex,
}: ComparisonCardProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      custom={customIndex}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("rounded-3xl p-8 flex-1", className)}
    >
      <h3 className={cn("text-2xl font-bold mb-6", titleColor)}>
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            {Icon}
            <span className="text-gray-700">{item.text}</span>
          </li>
        ))}
      </ul>
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
  const { title, subtitle, traditional, platform } = comparisonConfig;

  return (
    <section className="py-24 px-4 relative overflow-hidden">
         <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.2]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.2]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.2]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.2]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.2]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      <div className="container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeUpVariants}
            custom={0}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeUpVariants}
            custom={1}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <div className="flex flex-col gap-4 md:flex-row  max-w-5xl mx-auto ">
          <ComparisonCard
            {...traditional}
            Icon={<X className="w-4 h-4 text-red-500 mt-1"/>}
            customIndex={2}
            
          />
          <ComparisonCard
            {...platform}
            Icon={<Check className="w-4 h-4 text-green-500 mt-1"/>}
            customIndex={3}
          />
        </div>
      </div>
    </section>
  );
}
