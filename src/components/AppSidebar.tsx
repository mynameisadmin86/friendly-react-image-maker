
import React from 'react';
import { Link } from 'react-router-dom';
import LogisticsLogo from './LogisticsLogo';
import { 
  Home,
  Package,
  Truck,
  FileText,
  Users,
  Settings,
  BarChart3 
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarItems = [
  {
    icon: Home,
    label: 'Home',
    href: '/'
  },
  {
    icon: FileText,
    label: 'Billing',
    href: '/billing'
  },
  {
    icon: Package,
    label: 'Shipments',
    href: '/shipments'
  },
  {
    icon: Truck,
    label: 'Transport',
    href: '/transport'
  },
  {
    icon: Users,
    label: 'Customers',
    href: '/customers'
  },
  {
    icon: BarChart3,
    label: 'Reports',
    href: '/reports'
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings'
  }
];

const AppSidebar = () => {
  return (
    <Sidebar className="border-r">
      <div className="p-4 border-b">
        <LogisticsLogo />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href} className="flex items-center gap-3 px-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
