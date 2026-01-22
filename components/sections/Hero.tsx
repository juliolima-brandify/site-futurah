import Container from '../layout/Container';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-end bg-white overflow-hidden">
      {/* Content - Canto Esquerdo Inferior */}
      <div className="relative z-10 w-full pb-12 pl-4 sm:pl-6 lg:pl-8">
        <div className="max-w-2xl space-y-6 lg:space-y-8">
          {/* Main Heading */}
          <h1 className="text-[52px] font-medium text-brand-title leading-[1.1]">
            O Marketing do <br />
            Futuro com Impacto <br />
            no Presente
          </h1>

          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
            </div>
            <span className="text-sm font-bold text-brand-title">13K+</span>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <p className="text-base text-brand-body leading-relaxed max-w-xl">
              Somos a <span className="font-bold text-brand-title">Futurah and Co.</span> Um estúdio de Marketing Inteligente que une a tecnologia para alavancar negócios no digital.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <Button variant="primary" showIcon>
              Comece sua jornada agora
            </Button>
          </div>
        </div>
      </div>

      {/* Video - Canto Direito Inferior da Hero */}
      <div className="absolute bottom-8 right-8 z-0 hidden lg:block">
        <div className="w-[400px] h-[400px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            className="w-full h-full object-cover rounded-3xl pointer-events-none"
            poster="/images/hero/video-poster.jpg"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
            <source src="/videos/hero-video.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
}
