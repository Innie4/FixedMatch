import React from "react";
import { BarChart3, Users, Package, FileText, Star, Globe, Settings, UserCog, CreditCard } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Package Management',
    href: '/admin/packages',
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: 'Prediction Management',
    href: '/admin/predictions',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Review Management',
    href: '/admin/reviews',
    icon: <Star className="h-5 w-5" />,
  },
  {
    title: 'VIP Content Management',
    href: '/admin/vip-content',
    icon: <Star className="h-5 w-5" />,
  },
  {
    title: 'SEO Management',
    href: '/admin/seo',
    icon: <Globe className="h-5 w-5" />,
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: 'Admin User Management',
    href: '/admin/admin-users',
    icon: <UserCog className="h-5 w-5" />,
  },
  {
    title: 'Payment Methods',
    href: '/admin/payment-methods',
    icon: <CreditCard className="h-5 w-5" />,
  },
]; 