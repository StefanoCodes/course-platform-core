import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { features2 } from '~/config/app.config';

interface Feature {
  step: string
  title?: string | React.ReactNode
  content: string | React.ReactNode
  image: string
}

interface FeatureStepsProps {
  features: Feature[]
  className?: string
  title?: string | React.ReactNode
  autoPlayInterval?: number
  imageHeight?: string
}

export function FeatureSteps({
  features,
  className,
  title = 'How to get Started',
  autoPlayInterval = 3000,
  imageHeight = 'h-[400px]',
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval])

  return (
    <section id='how-it-works' className={cn('', className)}>
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl lg:text-5xl">{title}</h2>
        <Tabs defaultValue='students' className="w-full flex flex-col gap-8">
      <TabsList className='w-full'>
        <TabsTrigger value="students" className='data-[state=active]:bg-brand-primary cursor-pointer data-[state=active]:text-white' >Students</TabsTrigger>
        <TabsTrigger value="videos" className='data-[state=active]:bg-brand-primary cursor-pointer data-[state=active]:text-white'>Videos</TabsTrigger>
      </TabsList>
      <TabsContent value="students">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-16">
          <div className="order-2 space-y-8 md:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 md:h-10 md:w-10',
                    index === currentFeature
                      ? 'bg-brand-primary border-brand-primary text-primary-foreground scale-110'
                      : 'bg-muted border-muted-foreground',
                  )}
                >
                  {index <= currentFeature ? (
                    <span className="text-lg font-bold">✓</span>
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                <div className="flex-1">
                  {feature.title ? (
                    feature.title
                  ) : (
                    <h3 className="text-xl font-semibold md:text-2xl">
                      {feature.title || feature.step}
                    </h3>
                  )}

                  {feature.content ? (
                    feature.content
                  ) : (
                    <p className="text-muted-foreground text-sm md:text-lg">{feature.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              'relative order-1 h-[200px] overflow-hidden rounded-lg md:order-2 md:h-[300px] lg:h-[400px]',
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 overflow-hidden rounded-lg"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <img
                        src={feature.image}
                        width={1000}
                        height={500}
                        alt={feature.step}
                        className="h-full w-full transform object-cover transition-transform"
                      />
                      {/* <div className="from-background via-background/50 absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t to-transparent" /> */}
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="videos">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-center md:gap-16">
          <div className="order-2 space-y-8 md:order-1">
            {features2.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 md:h-10 md:w-10',
                    index === currentFeature
                      ? 'bg-brand-primary border-brand-primary text-primary-foreground scale-110'
                      : 'bg-muted border-muted-foreground',
                  )}
                >
                  {index <= currentFeature ? (
                    <span className="text-lg font-bold">✓</span>
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                <div className="flex-1">
                  {feature.title ? (
                    feature.title
                  ) : (
                    <h3 className="text-xl font-semibold md:text-2xl">
                      {feature.title || feature.step}
                    </h3>
                  )}

                  {feature.content ? (
                    feature.content
                  ) : (
                    <p className="text-muted-foreground text-sm md:text-lg">{feature.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              'relative order-1 h-[200px] overflow-hidden rounded-lg md:order-2 md:h-[300px] lg:h-[400px]',
            )}
          >
            <AnimatePresence mode="wait">
              {features2.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 overflow-hidden rounded-lg"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <img
                        src={feature.image}
                        width={1000}
                        height={500}
                        alt={feature.step}
                        className="h-full w-full transform object-cover transition-transform"
                      />
                      {/* <div className="from-background via-background/50 absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t to-transparent" /> */}
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </div>
      </TabsContent>
    </Tabs>
      
      </div>
    </section>
  )
}
