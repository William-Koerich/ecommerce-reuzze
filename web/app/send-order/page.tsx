"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export default function SendOrderPage() {
  const [form, setForm] = useState({
    empresa: "",
    comprador: "",
    cnpj: "",
    whatsapp: "",
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ carregar carrinho corretamente (sem erro de render)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Carrinho vazio");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3333/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.qty,
          })),
          companyName: form.empresa,
          buyerName: form.comprador,
          cnpj: form.cnpj,
          whatsapp: form.whatsapp,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao enviar pedido");
      }

      // sucesso
      localStorage.removeItem("cart");
      setCart([]);
      setSuccess(true);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#04110f] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[2fr_1fr] gap-10">
        {/* FORM */}
        <div>
          <h1 className="text-3xl font-semibold mb-8">Finalizar pedido</h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 border border-white/10 p-6 rounded-xl bg-[#0b1f1c]"
          >
            <input
              name="empresa"
              placeholder="Nome da empresa"
              value={form.empresa}
              onChange={handleChange}
              className="w-full bg-[#04110f] border border-white/20 p-4 rounded-lg"
              required
            />

            <input
              name="comprador"
              placeholder="Nome do comprador"
              value={form.comprador}
              onChange={handleChange}
              className="w-full bg-[#04110f] border border-white/20 p-4 rounded-lg"
              required
            />

            <input
              name="cnpj"
              placeholder="CNPJ"
              value={form.cnpj}
              onChange={handleChange}
              className="w-full bg-[#04110f] border border-white/20 p-4 rounded-lg"
              required
            />

            <input
              name="whatsapp"
              placeholder="WhatsApp"
              value={form.whatsapp}
              onChange={handleChange}
              className="w-full bg-[#04110f] border border-white/20 p-4 rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#008568] hover:bg-[#00a17e] py-4 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar pedido"}
            </button>
          </form>
        </div>

        {/* RESUMO */}
        <div className="border border-white/10 rounded-xl p-6 h-fit bg-[#0b1f1c]">
          <h2 className="text-xl font-semibold mb-6">Resumo do pedido</h2>

          {cart.length === 0 ? (
            <p className="text-gray-400 text-sm">Seu carrinho está vazio.</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.qty}
                    </span>

                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-gray-400 mb-2">
                <span>Subtotal</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-semibold border-t border-white/10 pt-4">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(subtotal)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {success && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#0b1f1c] border border-white/10 p-10 rounded-2xl max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4">🎉 Pedido enviado!</h2>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Recebemos seu pedido com sucesso. Nossa equipe entrará em contato
              via WhatsApp.
            </p>

            <button
              onClick={() => (window.location.href = "/store")}
              className="bg-[#008568] hover:bg-[#00a17e] px-6 py-3 rounded-lg"
            >
              Voltar para loja
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
