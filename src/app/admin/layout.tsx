"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, LayoutDashboard, PenSquare, Home } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.startsWith('/admin/articles/new')) return 'New Article';
    if (pathname.startsWith('/admin/articles/edit')) return 'Edit Article';
    if (pathname.startsWith('/admin/articles')) return 'Articles';
    return 'Admin';
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold font-headline">FlexPress</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin'}>
                <Link href="/admin">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/articles')}>
                <Link href="/admin/articles">
                  <PenSquare />
                  Articles
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex-col gap-4">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@flexpress.com</p>
                </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    View Site
                </Link>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-card h-16">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-bold font-headline">{getPageTitle()}</h1>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8 bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
