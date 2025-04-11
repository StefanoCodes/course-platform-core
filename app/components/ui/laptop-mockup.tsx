import { cn } from "~/lib/utils"

interface DesktopMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function LaptopMockup({ children, className, ...props }: DesktopMockupProps) {
  return (
    <div className={cn("relative w-full overflow-visible", className)} {...props}>
      <div className="max-w-7xl mx-auto w-full px-8">
        <div className="relative mx-auto">
          {/* Monitor Frame */}
          <div className="relative mx-auto bg-[#e6e6e6] rounded-[24px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[800px] w-full p-3 shadow-xl">
            {/* Black Border */}
            <div className="absolute inset-0 rounded-[24px] border-black/10 border-[1px]" />
            {/* Screen Content */}
            <div className="rounded-[12px] overflow-hidden h-full w-full bg-white relative z-10">
              {/* Screen Border */}
              <div className="absolute inset-0 border-black/5 border-[1px] rounded-[12px]" />
              {children}
            </div>
            {/* Bottom Chin with Logo */}
            <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-black/5" />
            </div>
          </div>
          {/* Stand */}
          <div className="relative mx-auto -z-10">
            {/* Neck */}
            <div className="mx-auto w-[80px] h-[80px] bg-gradient-to-b from-[#e6e6e6] to-[#d1d1d1] rounded-b-lg" />
            {/* Base */}
            <div className="mx-auto w-[180px] h-[4px] bg-[#d1d1d1] rounded-[12px] -mt-1" />
            <div className="mx-auto w-[220px] h-[20px] bg-gradient-to-b from-[#d1d1d1] to-[#e6e6e6] rounded-[12px]" />
          </div>
        </div>
      </div>
    </div>
  )
} 