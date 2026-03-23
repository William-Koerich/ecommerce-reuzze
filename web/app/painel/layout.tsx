"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  PlusCircle,
  List,
  Menu,
} from "lucide-react";

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/painel";

  const [collapsed, setCollapsed] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  function isActive(path: string) {
    return pathname.startsWith(path);
  }

  return (
    <div className="flex min-h-screen bg-[#04110f] text-white">
      {/* SIDEBAR */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-[#0b1f1c] border-r border-white/10 p-4 transition-all duration-300`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h2 className="text-xl font-semibold">Painel</h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/10 rounded"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* NAV */}
        <nav className="space-y-2 text-sm">
          {/* DASHBOARD */}
          <Link
            href="/painel/dashboard"
            className={`flex items-center gap-3 p-2 rounded hover:bg-white/10 ${
              isActive("/painel/dashboard")
                ? "bg-white/10"
                : ""
            }`}
          >
            <LayoutDashboard size={18} />
            {!collapsed && "Dashboard"}
          </Link>

          {/* PEDIDOS */}
          <Link
            href="/painel/pedidos"
            className={`flex items-center gap-3 p-2 rounded hover:bg-white/10 ${
              isActive("/painel/pedidos")
                ? "bg-white/10"
                : ""
            }`}
          >
            <ShoppingCart size={18} />
            {!collapsed && "Pedidos"}
          </Link>

          {/* PRODUTOS (COM SUBMENU) */}
          <div>
            <button
              onClick={() =>
                setOpenProducts(!openProducts)
              }
              className={`w-full flex items-center gap-3 p-2 rounded hover:bg-white/10 ${
                isActive("/painel/produtos")
                  ? "bg-white/10"
                  : ""
              }`}
            >
              <Package size={18} />
              {!collapsed && "Produtos"}
            </button>

            {/* SUBMENU */}
            {!collapsed && openProducts && (
              <div className="ml-8 mt-2 space-y-2">
                <Link
                  href="/painel/produtos"
                  className={`flex items-center gap-2 p-2 rounded hover:bg-white/10 ${
                    pathname === "/painel/produtos"
                      ? "bg-white/10"
                      : ""
                  }`}
                >
                  <List size={16} />
                  Lista
                </Link>

                <Link
                  href="/painel/produtos/novo"
                  className={`flex items-center gap-2 p-2 rounded hover:bg-white/10 ${
                    pathname ===
                    "/painel/produtos/novo"
                      ? "bg-white/10"
                      : ""
                  }`}
                >
                  <PlusCircle size={16} />
                  Novo Produto
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}