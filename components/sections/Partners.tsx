import Container from '../layout/Container';

const partners = [
  'Moma',
  'Hotmart',
  'Samsung',
  'Essential',
  'Cogna Educacao',
  '3coracoes',
  'DPZ',
  'Artplan',
  'IH',
  'Africa',
  'Damn Good Advice',
];

export default function Partners() {
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="bg-brand-button-hover overflow-hidden">
      <Container className="py-6 sm:py-8">
        <div className="flex items-center gap-8 sm:gap-12 lg:gap-16 whitespace-nowrap logo-marquee">
          {marqueeItems.map((partner, index) => (
            <span
              key={`${partner}-${index}`}
              className="text-white/85 text-sm sm:text-base font-semibold uppercase tracking-[0.22em]"
            >
              {partner}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
