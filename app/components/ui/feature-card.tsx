
interface FeatureCardProps {
  image: string;
  heading: string;
  description: string;
  className?: string;
}

export function FeatureCard({ image, heading, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`flex flex-col-reverse  md:flex-row-reverse items-center gap-4 rounded-xl bg-white shadow-lg border border-gray-100 ${className}`}>
      <div className="w-full flex-1 aspect-video rounded-lg overflow-hidden bg-gray-100">
        <img 
          src={image}
          alt={heading} 
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
} 