"use client";

import { Button } from "@/components/ui/button";
import { Building2, Car } from "lucide-react";
import { useTranslations } from "next-intl";

interface VerticalToggleProps {
  vertical: "property" | "car";
  onChange: (vertical: "property" | "car") => void;
}

export function VerticalToggle({ vertical, onChange }: VerticalToggleProps) {
  const t = useTranslations("HomePage");

  return (
    <div className="flex gap-2 mb-4 justify-center">
      <Button 
        variant={vertical === "property" ? "default" : "secondary"}
        className={vertical === "property" ? "bg-[#febb02] text-[#003580] hover:bg-[#febb02]/90" : "bg-white/10 text-white hover:bg-white/20"}
        onClick={() => onChange("property")}
      >
        <Building2 className="mr-2 h-4 w-4" />
        {t("realEstate")}
      </Button>
      <Button 
        variant={vertical === "car" ? "default" : "secondary"}
        className={vertical === "car" ? "bg-[#febb02] text-[#003580] hover:bg-[#febb02]/90" : "bg-white/10 text-white hover:bg-white/20"}
        onClick={() => onChange("car")}
      >
        <Car className="mr-2 h-4 w-4" />
        {t("cars")}
      </Button>
    </div>
  );
}
