"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const notifications = useQuery(api.notifications.getUnread) || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-[#003580]">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4 border-b">
          <h3 className="font-bold text-black">Notifications</h3>
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
        ) : (
          notifications.map((n: any) => (
            <DropdownMenuItem key={n._id} className="p-4 focus:bg-gray-50 flex flex-col items-start cursor-pointer">
              <p className="font-bold text-sm text-black">{n.title}</p>
              <p className="text-xs text-gray-500">{n.message}</p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
