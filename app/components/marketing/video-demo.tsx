import { Play } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { useState } from "react";

export default function VideoDemo() {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <motion.section
        id="video-section"
        className=" py-8 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
    
          <div className="max-w-7xl mx-auto">
            {/* section title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
                Watch a demo
            </h2>
            {/* Browser Window Mockup */}
            <div className="rounded-xl overflow-hidden bg-zinc-900/50 shadow-2xl border border-white/5">
              {/* Browser Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                </div>
                <div className="flex-1  flex justify-center ">
                  <div className="bg-black/40 self-center rounded-md py-1.5 px-3 text-xs  text-zinc-500 max-w-[300px] flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-zinc-800" />
                    my-new-online-course-platform.com
                  </div>
                </div>
              </div>

              {/* Video/Content Area */}
              <div className="aspect-[16/9] relative">
                {isPlaying ? (
                  <iframe
                    src={`https://player.vimeo.com/video/1055784280?h=your_hash_here&autoplay=1&title=0&byline=0&portrait=0`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="absolute inset-0">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lQJe60OxxGongNvLeFeJWGT3Gz0Rra.png"
                        alt="Weaves every interaction into a web of knowledge"
                        
                        className="object-cover h-full w-full absolute top-0 left-0"
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        size="lg"
                        className="relative z-10 size-16 md:size-20 rounded-full p-0 bg-black/20 hover:bg-black/30 transition-all duration-200 backdrop-blur-sm"
                      >
                        <Play className="size-6 md:size-8 text-white" />
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </motion.section>
    )
}