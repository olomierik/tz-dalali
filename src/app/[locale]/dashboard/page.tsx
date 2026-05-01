"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Car, CreditCard, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Welcome back, {user?.firstName || "Guest"}!</h1>
        <p className="text-gray-500">Here's what's happening with your marketplace listings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Earnings", value: "$12,840", icon: TrendingUp, color: "text-green-600" },
          { title: "Active Listings", value: "8", icon: Building2, color: "text-blue-600" },
          { title: "Pending Deals", value: "3", icon: CreditCard, color: "text-orange-600" },
          { title: "Views this month", value: "1.2k", icon: Car, color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">No recent activity to show.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-700 font-bold">!</span>
              </div>
              <div>
                <p className="font-medium">Identity not verified</p>
                <p className="text-sm text-gray-500">Complete KYC to start selling at scale.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
