import Image from 'next/image';
import Button from '../ui/Button';
import UnicornStudioEmbed from '../ui/UnicornStudioEmbed';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-end bg-white overflow-hidden">
      {/* Content - Canto Esquerdo Inferior */}
      <div className="relative z-10 w-full pb-12 pl-4 sm:pl-6 lg:pl-8">
        <div className="max-w-2xl space-y-6 lg:space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl lg:text-[52px] font-normal uppercase text-brand-title leading-[1.1]">
            O Marketing do <br />
            Futuro com Impacto <br />
            no Presente
          </h1>

          {/* Badge */}
          <div className="inline-flex items-center gap-3 py-2 rounded-full">
            <div className="flex -space-x-3">
              <Image src="/socialproof/social-proof1 (1).webp" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Social Proof 1" />
              <Image src="/socialproof/social-proof1 (2).webp" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Social Proof 2" />
              <Image src="/socialproof/social-proof1 (3).webp" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Social Proof 3" />
              <Image src="/socialproof/social-proof1 (4).webp" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Social Proof 4" />
              <Image src="/socialproof/social-proof1 (5).webp" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="Social Proof 5" />
            </div>
            <div className="flex flex-col text-sm font-bold text-brand-title leading-tight">
              <span>Confiam na</span>
              <span>Futurah and Co.</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <p className="text-base text-brand-body leading-relaxed max-w-xl">
              Somos a <span className="font-bold text-brand-title">Futurah and Co.</span> Um estúdio de Marketing Inteligente que une a tecnologia para alavancar negócios no digital.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <Button variant="primary" showIcon href="/aplicacao">
              Comece sua jornada agora
            </Button>
          </div>
        </div>
      </div>

      {/* Unicorn Studio embed - Canto Direito Inferior da Hero */}
      <div className="absolute bottom-8 right-8 z-10 hidden lg:block">
        <UnicornStudioEmbed />
      </div>
    </section>
  );
}
