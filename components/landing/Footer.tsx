import { AnimateOnScroll } from "./AnimateOnScroll";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 px-6 py-16 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-4xl">
        {/* About section - Simplified */}
        <AnimateOnScroll>
          <section className="text-left md:text-center">
            <h3 className="text-lg font-bold tracking-wide text-neutral-900 md:text-xl">
              About ShiftCrew
            </h3>
            <div className="mx-auto mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-neutral-600 md:mt-8 md:text-base">
              <p>
                I spent 15+ years in restaurants—as a worker and a manager—and
                understood both perspectives deeply.
              </p>
              <p>
                Workers deserve to know what they&apos;re walking into: the culture,
                the team, the real compensation.
              </p>
              <p>
                Restaurants deserve to know who they&apos;re hiring: the work ethic,
                the reliability, the track record.
              </p>
              <p className="font-semibold text-neutral-900">
                ShiftCrew brings that clarity to both sides.
              </p>
              <p className="pt-2 text-sm italic text-neutral-500">
                — Brian & the ShiftCrew Team
              </p>
            </div>
          </section>
        </AnimateOnScroll>

        {/* Contact Email */}
        <AnimateOnScroll delay={100}>
          <div className="mt-12 text-center">
            <p className="text-base text-neutral-600 md:text-lg">
              Questions? You can email me at:{" "}
              <a
                href="mailto:fullstackbrian@gmail.com"
                className="font-semibold text-neutral-900 transition-colors hover:text-green-600"
              >
                fullstackbrian@gmail.com
              </a>
            </p>
          </div>
        </AnimateOnScroll>

        {/* Copyright */}
        <AnimateOnScroll delay={200}>
          <p className="mt-12 text-center text-base text-neutral-600 md:text-lg">
            © 2026 ShiftCrew.{" "}
            <span className="font-bold text-neutral-900">
              Built by crew, for crew.
            </span>
          </p>
        </AnimateOnScroll>
      </div>
    </footer>
  );
}
