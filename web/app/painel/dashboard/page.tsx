"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Metric = {
  label: string;
  value: string;
};

type Order = {
  id: string;
  companyName: string | null;
  total: number;
  paymentStatus: string;
};

type Summary = {
  ordersToday: number;
  revenueToday: number;
  productsCount: number;
  lowStock: number;
};

type DashboardResponse = {
  metrics: {
    revenue: number;
    orders: number;
    averageTicket: number;
  };
  summary: Summary;
  recentOrders: Order[];
};

/* ================= HELPERS ================= */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

function translateStatus(status: string) {
  switch (status) {
    case "PAID":
      return "Pago";
    case "PENDING":
      return "Pendente";
    case "PARTIALLY_PAID":
      return "Parcial";
    case "FAILED":
      return "Falhou";
    case "REFUNDED":
      return "Reembolsado";
    default:
      return status;
  }
}

function statusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-500/20 text-green-400";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

/* ================= COMPONENT ================= */

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3333/api/dashboard");
        const data: DashboardResponse = await res.json();

        setMetrics([
          {
            label: "Recebido no mês",
            value: formatCurrency(data.metrics.revenue),
          },
          {
            label: "Qtd. Pedidos",
            value: String(data.metrics.orders),
          },
          {
            label: "Ticket médio",
            value: formatCurrency(data.metrics.averageTicket),
          },
        ]);

        setOrders(data.recentOrders);
        setSummary(data.summary);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#04110f] text-white p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 text-sm">Visão geral da sua loja</p>
      </div>

      {/* METRICS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-[#0b1f1c] border border-white/10 rounded-xl p-5"
          >
            <p className="text-sm text-gray-400 mb-2">{metric.label}</p>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{metric.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      {summary && (
        <div className="bg-[#0b1f1c] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6">Resumo rápido</h2>

          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Pedidos hoje</span>
              <span>{summary.ordersToday}</span>
            </div>

            <div className="flex justify-between">
              <span>Receita hoje</span>
              <span>{formatCurrency(summary.revenueToday)}</span>
            </div>

            <div className="flex justify-between">
              <span>Produtos ativos</span>
              <span>{summary.productsCount}</span>
            </div>

            <div className="flex justify-between">
              <span>Baixo estoque</span>
              <span className="text-red-400">{summary.lowStock}</span>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      <div className="mt-10 bg-[#0b1f1c] border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">Pedidos recentes</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b border-white/10 pb-3"
            >
              <div>
                <p className="text-sm">{order.id}</p>
                <p className="text-xs text-gray-400">
                  {order.companyName || "Cliente"}
                </p>
              </div>

              <p className="text-sm font-medium">
                {formatCurrency(order.total)}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded ${statusStyle(order.paymentStatus)}`}
              >
                {translateStatus(order.paymentStatus)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
