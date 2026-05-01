"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Building2, 
  Car, 
  Users, 
  CreditCard, 
  Settings, 
  ShieldCheck 
} from "lucide-react";

const links = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Properties", href: "/host/properties", icon: Building2 },
  { name: "My Cars", href: "/host/cars", icon: Car },
  { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
  { name: "Verification", href: "/dashboard/verification", icon: ShieldCheck },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r h-screen p-4 flex flex-col">
      <div className="font-serif text-2xl font-bold text-[#003580] mb-8 px-2">
        TzDalali
      </div>
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.includes(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#003580] text-white" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
