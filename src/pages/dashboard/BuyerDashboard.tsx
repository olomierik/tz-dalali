import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface BuyerDashboardProps {
  children?: React.ReactNode;
}

export default function BuyerDashboard({ children }: BuyerDashboardProps) {
  return (
    <DashboardLayout>
      {children}
      <Outlet />
    </DashboardLayout>
  );
}