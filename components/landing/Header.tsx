import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start">
          <span className="font-heading text-xl font-bold text-green-600 leading-tight">
            ShiftCrew
          </span>
          <span className="text-[10px] font-normal text-neutral-500 tracking-wider uppercase">
            Built by crew, for crew
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            How it works
          </Link>
          <Link
            href="#problems"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            For Workers
          </Link>
          <Link
            href="#for-employers"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            For Employers
          </Link>
        </nav>

      </div>
    </header>
  );
}
