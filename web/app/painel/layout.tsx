"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/painel";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#04110f] text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0b1f1c] border-r border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-8">Painel</h2>

        <nav className="space-y-2">
            <ul>
              <li>
                <Link href="/painel/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/painel/pedidos">Pedidos</Link>
              </li>
            </ul>
          </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}