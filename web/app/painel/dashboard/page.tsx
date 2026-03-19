"use client";

type Metric = {
  label: string;
  value: string;
  change: string;
};

type Order = {
  id: string;
  customer: string;
  total: number;
  status: string;
};

export default function DashboardPage() {
  // ✅ Dados mockados direto (sem useEffect)
  const metrics: Metric[] = [
    { label: "Recebido no mês", value: "R$ 12.450", change: "+12%" },
    { label: "Qtd. Pedidos", value: "148", change: "+8%" },
    { label: "Ticket médio", value: "R$ 84,12", change: "+3%" },
  ];

  const orders: Order[] = [
    {
      id: "#1024",
      customer: "Empresa Alpha",
      total: 320,
      status: "Pago",
    },
    {
      id: "#1023",
      customer: "João Silva",
      total: 120,
      status: "Pendente",
    },
    {
      id: "#1022",
      customer: "Mercado Beta",
      total: 890,
      status: "Pago",
    },
  ];

  return (
    <main className="min-h-screen bg-[#04110f] text-white p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Visão geral da sua loja
        </p>
      </div>

      {/* METRICS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-[#0b1f1c] border border-white/10 rounded-xl p-5"
          >
            <p className="text-sm text-gray-400 mb-2">
              {metric.label}
            </p>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {metric.value}
              </h2>

              <span className="text-green-400 text-sm">
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-1 gap-6">

        {/* SUMMARY */}
        <div className="bg-[#0b1f1c] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6">
            Resumo rápido
          </h2>

          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Pedidos hoje</span>
              <span>12</span>
            </div>

            <div className="flex justify-between">
              <span>Receita hoje</span>
              <span>R$ 1.240</span>
            </div>

            <div className="flex justify-between">
              <span>Produtos ativos</span>
              <span>34</span>
            </div>

            <div className="flex justify-between">
              <span>Baixo estoque</span>
              <span className="text-red-400">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* ORDERS */}
      <div className="mt-10 bg-[#0b1f1c] border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">
          Pedidos recentes
        </h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b border-white/10 pb-3"
            >
              <div>
                <p className="text-sm">{order.id}</p>
                <p className="text-xs text-gray-400">
                  {order.customer}
                </p>
              </div>

              <p className="text-sm font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(order.total)}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  order.status === "Pago"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}