"use client";

import { UserButton } from "@clerk/nextjs";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transações" },
  { href: "/subscription", label: "Assinatura" },
];

const Navbar = () => {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClassName = (href: string) =>
    pathName === href ? "font-bold text-primary" : "text-muted-foreground";

  return (
    <nav
      suppressHydrationWarning
      className="sticky top-0 z-40 border-b border-solid bg-background"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-8">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="Expense Ai"
              width={173}
              height={39}
              priority
              className="h-7 w-auto sm:h-[39px]"
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex lg:gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClassName(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {/* Em telas pequenas o nome do usuário é ocultado para não estourar a barra */}
          <div className="[&_.cl-userButtonOuterIdentifier]:hidden sm:[&_.cl-userButtonOuterIdentifier]:block">
            <UserButton showName />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          >
            {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="flex flex-col border-t border-solid px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`rounded-md px-2 py-3 ${linkClassName(link.href)}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
