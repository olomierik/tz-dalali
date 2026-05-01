"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

export const SiteFooter = () => {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#003580] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">TZ</span>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[#003580]">Dalali</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t("aboutDesc")}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              <span>195 {t("countries")}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">{t("forGuests")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/real-estate" className="text-gray-500 hover:text-[#003580]">{t("propertiesForSale")}</Link></li>
              <li><Link href="/real-estate" className="text-gray-500 hover:text-[#003580]">{t("rentals")}</Link></li>
              <li><Link href="/real-estate?property_type=commercial" className="text-gray-500 hover:text-[#003580]">{t("commercial")}</Link></li>
              <li><Link href="/search?ai=true" className="text-gray-500 hover:text-[#003580]">{t("aiSmartSearch")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">{t("forOwners")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/host/properties/new" className="text-gray-500 hover:text-[#003580]">{t("listYourProperty")}</Link></li>
              <li><Link href="/dashboard" className="text-gray-500 hover:text-[#003580]">{t("ownerDashboard")}</Link></li>
              <li><Link href="/pricing" className="text-gray-500 hover:text-[#003580]">{t("pricing")}</Link></li>
              <li><Link href="/partner" className="text-gray-500 hover:text-[#003580]">{t("becomePartner")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">{t("about")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-gray-500 hover:text-[#003580]">{t("aboutTzDalali")}</Link></li>
              <li><Link href="/locations" className="text-gray-500 hover:text-[#003580]">{t("allLocations")}</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-[#003580]">{t("contactUs")}</Link></li>
              <li><Link href="/sign-in" className="text-gray-500 hover:text-[#003580]">{t("signIn")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">{t("support")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:support@tzdalali.com" className="text-gray-500 hover:text-[#003580] flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{t("helpCenter")}</a></li>
              <li><a href="tel:+255123456789" className="text-gray-500 hover:text-[#003580] flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{t("callUs")}</a></li>
              <li><Link href="/about" className="text-gray-500 hover:text-[#003580] flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{t("findUs")}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>© {currentYear} TzDalali</span>
              <span className="hidden md:inline">·</span>
              <Link href="/terms" className="hover:text-[#003580]">{t("terms")}</Link>
              <Link href="/privacy" className="hover:text-[#003580]">{t("privacy")}</Link>
              <Link href="/cookies" className="hover:text-[#003580]">{t("cookies")}</Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{t("legalPartners")}: </span>
              <span className="font-medium">GODVIL Consult</span>
              <span>·</span>
              <span className="font-medium">PRIME AUDITORS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
