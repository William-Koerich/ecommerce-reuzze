"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type PaymentStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

type Product = {
  id: string;
  name: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: Product;
};

type Order = {
  id: string;

  buyerName?: string;
  companyName?: string;
  whatsapp?: string;

  total: number;
  amountPaid: number;

  paymentStatus: PaymentStatus;
  createdAt: string;

  items: OrderItem[];
};

/* ================= HELPERS ================= */

function translateStatus(status: PaymentStatus) {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "PARTIALLY_PAID":
      return "Pago parcial";
    case "PAID":
      return "Pago";
    case "FAILED":
      return "Falhou";
    case "REFUNDED":
      return "Reembolsado";
  }
}

function getStatusColor(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return "bg-green-500/20 text-green-400";
    case "PARTIALLY_PAID":
      return "bg-blue-500/20 text-blue-400";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-400";
    case "FAILED":
      return "bg-red-500/20 text-red-400";
    case "REFUNDED":
      return "bg-gray-500/20 text-gray-400";
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/* ================= PAGE ================= */

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [amountPaid, setAmountPaid] = useState<number>(0);

  const [updating, setUpdating] = useState(false);

  /* ================= FETCH ================= */

  async function fetchOrders() {
    try {
      const res = await fetch("http://localhost:3333/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= SYNC MODAL ================= */

  useEffect(() => {
    if (selectedOrder) {
      setStatus(selectedOrder.paymentStatus);
      setAmountPaid(selectedOrder.amountPaid || 0);
    }
  }, [selectedOrder]);

  /* ================= UPDATE ================= */

  async function handleUpdateOrder() {
    if (!selectedOrder) return;

    try {
      setUpdating(true);

      await fetch(
        `http://localhost:3333/api/orders/${selectedOrder.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: status,
            amountPaid:
              status === "PARTIALLY_PAID" ? amountPaid : undefined,
          }),
        }
      );

      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error("Erro ao atualizar pedido:", err);
    } finally {
      setUpdating(false);
    }
  }

  /* ================= UI ================= */

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">
        Pedidos
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400">Carregando pedidos...</p>
      )}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <p className="text-gray-400">
          Nenhum pedido encontrado
        </p>
      )}

      {/* LISTA */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="cursor-pointer bg-[#0b1f1c] border border-white/10 rounded-xl p-5 hover:bg-white/5 transition"
          >
            <div className="flex justify-between items-center">
              
              {/* INFO */}
              <div>
                <p className="text-sm font-medium">
                  #{order.id.slice(0, 8)}
                </p>

                <p className="text-xs text-gray-400">
                  {order.buyerName || "Cliente não informado"}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* VALORES */}
              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(order.total)}
                </p>

                <p className="text-xs text-gray-400">
                  Pago: {formatCurrency(order.amountPaid || 0)}
                </p>

                <span
                  className={`text-xs px-3 py-1 rounded mt-1 inline-block ${getStatusColor(
                    order.paymentStatus
                  )}`}
                >
                  {translateStatus(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0b1f1c] p-6 rounded-xl w-full max-w-2xl">

            <h2 className="text-lg font-semibold mb-4">
              Pedido #{selectedOrder.id.slice(0, 8)}
            </h2>

            {/* INFO */}
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Cliente:</strong> {selectedOrder.buyerName}</p>
              <p><strong>Empresa:</strong> {selectedOrder.companyName}</p>
              <p><strong>WhatsApp:</strong> {selectedOrder.whatsapp}</p>
            </div>

            {/* STATUS + PAGAMENTO */}
            <div className="mb-4 space-y-3">

              <div>
                <label className="text-sm">Status</label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as PaymentStatus)
                  }
                  className="w-full mt-1 bg-[#04110f] border border-white/10 rounded p-2"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="PARTIALLY_PAID">Pago parcial</option>
                  <option value="PAID">Pago</option>
                  <option value="FAILED">Falhou</option>
                  <option value="REFUNDED">Reembolsado</option>
                </select>
              </div>

              {status === "PARTIALLY_PAID" && (
                <div>
                  <label className="text-sm">
                    Valor pago
                  </label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) =>
                      setAmountPaid(Number(e.target.value))
                    }
                    className="w-full mt-1 bg-[#04110f] border border-white/10 rounded p-2"
                  />
                </div>
              )}
            </div>

            {/* ITENS */}
            <div className="mb-4">
              <h3 className="mb-2 font-medium">Itens</h3>

              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm bg-white/5 p-2 rounded"
                  >
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>

                    <span>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="flex justify-between font-semibold mb-4">
              <span>Total</span>
              <span>
                {formatCurrency(selectedOrder.total)}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-white/10 rounded"
              >
                Fechar
              </button>

              <button
                onClick={handleUpdateOrder}
                disabled={updating}
                className="px-4 py-2 bg-[#008568] rounded disabled:opacity-50"
              >
                {updating ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}