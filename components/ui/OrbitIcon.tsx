import React from 'react';
import Image from 'next/image';

interface OrbitIconProps {
    className?: string;
    size?: number;
    variant?: 'light' | 'dark';
}

const OrbitIcon: React.FC<OrbitIconProps> = ({ className = "w-24 h-24", size = 24, variant = 'light' }) => {
    const isDark = variant === 'dark';

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Central Icon */}
            <div className="absolute z-10 w-1/3 h-1/3 flex items-center justify-center -mt-[4%]">
                <Image
                    src={isDark ? "/images/ele-gray.webp" : "/images/ele-white.webp"}
                    alt="Futurah Icon"
                    width={32}
                    height={32}
                    className="object-contain w-full h-full"
                />
            </div>

            {/* Rotating Text Ring */}
            <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <defs>
                        <path
                            id="orbitPath"
                            d="M 50, 50 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
                            fill="none"
                        />
                    </defs>
                    <text className={`${isDark ? 'fill-black/90' : 'fill-white/90'} text-[8px] font-normal tracking-[0.3em] uppercase`}>
                        <textPath href="#orbitPath" startOffset="0%" textLength="190" lengthAdjust="spacingAndGlyphs">
                            FUTURAH • FUTURAH • FUTURAH •
                        </textPath>
                    </text>
                </svg>
            </div>
        </div>
    );
};
export default OrbitIcon;
