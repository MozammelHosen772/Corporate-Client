import { useTheme } from "@/contexts/ThemeContext";
import ProductSearch from "@/modules/AdminDashboard/AdminProducts/Productsearch";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  onMenuClick: () => void;
};

export default function MobileTopNavbar({ onMenuClick }: Props) {
  const { theme } = useTheme();

  return (
    <header className="sm:hidden sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between gap-3 px-1.5 py-2">
        <div className="flex gap-4 items-center">
          {/* Menu */}
          <button onClick={onMenuClick} aria-label="Open sidebar menu">
            <Menu aria-hidden="true" className="h-6 w-6 cursor-pointer" />
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Taqwa Tech home">
            {theme?.logoUrl ? (
              <Image
                src={theme.logoUrl}
                alt="Taqwa Tech"
                width={120}
                height={40}
                sizes="120px"
                priority
              />
            ) : (
              <span className="text-lg font-bold">Taqwa Tech</span>
            )}
          </Link>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-[160px] shrink-0">
          <ProductSearch variant="mobile" />
        </div>
      </div>
    </header>
  );
}
