import { motion } from "framer-motion"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"
import { Link } from "react-router"

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

export default function Hero({
  title1 = "Are you a teacher looking to increase",
  title2 = " your income?",
  description ="Our platform empowers you to create, market, and deliver engaging online courses to your students."
}: {
  badge?: string
  title1?: string
  title2?: string
  description?: string
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  return (
    <div className="relative min-h-[calc(100dvh-var(--navbar-height))] w-full flex items-start pt-12 md:items-center justify-center overflow-hidden bg-white">


      <div className="relative z-10 container mx-auto px-4  md:px-6">
        <div className="max-w-3xl mx-auto text-center">

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-7xl  font-bold mb-6 md:mb-8 tracking-tight md:leading-[1.1]">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-gray-800/80">{title1} <br /> {title2}</span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 leading-relaxed  tracking-wide max-w-xl mx-auto px-4">
              {description}
            </p>
          </motion.div>
          <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
          <Link to="https://cal.com/seif-platform/15min" target="_blank" className="w-full">
            <Button className="cursor-pointer inset-ring-2 inset-ring-indigo-300 bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white">Book a Demo</Button>
          </Link>
          </motion.div>
          <motion.div custom={4} variants={fadeUpVariants} initial="hidden" animate="visible" className="py-4">
            <img 
              src="/images/marketing/students_dashboard.png" 
              alt="dashboard students panel screenshot" 
              className="w-full h-full object-cover rounded-lg shadow-[0_8px_30px_rgba(79,70,229,0.15)] bg-indigo-50 backdrop-blur-2xl" 
            />
          </motion.div>
        </div>
      </div>

      {/* <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" /> */}
    </div>
  )
}

