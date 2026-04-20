import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { RotatingBackground } from "./RotatingBackground";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <RotatingBackground />
      <SiteHeader />
      <main className="flex-1 over-image">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};
