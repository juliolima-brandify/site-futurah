import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-brand-title';
  
  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold tracking-tight ${textColor} transition-colors duration-300 group-hover:text-brand-button-hover`}>
          Futura and Co.
        </span>
        <span className={`text-xs font-medium tracking-wider ${variant === 'light' ? 'text-gray-300' : 'text-brand-body'} uppercase`}>
          Human Academy
        </span>
      </div>
    </Link>
  );
}
