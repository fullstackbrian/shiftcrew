import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="ShiftCrew - Built by crew, for crew"
            width={140}
            height={42}
            className="h-auto w-auto"
            priority
          />
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
