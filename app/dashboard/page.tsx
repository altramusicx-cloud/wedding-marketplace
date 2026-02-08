// app/dashboard/layout.tsx - SESUAI STRUKTUR YANG ADA
import { DashboardSidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />

      <div className="flex">
        {/* Sidebar untuk Desktop */}
        <aside className="hidden md:block w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200">
          <DashboardSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation untuk Mobile */}
      <BottomNav />
    </div>
  );
}