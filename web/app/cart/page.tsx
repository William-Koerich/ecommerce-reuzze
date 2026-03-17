"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("cart") || "[]");
  });

  function updateQty(id: number, change: number) {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + change);
        return { ...item, qty: newQty };
      }
      return item;
    });

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function removeItem(id: number) {
    const updated = cart.filter((item) => item.id !== id);

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <main className="min-h-screen bg-[#04110f] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-10">Carrinho</h1>

        {cart.length === 0 && (
          <div className="text-gray-400">
            Seu carrinho está vazio.
            <Link href="/store" className="block mt-4 text-[#00a17e]">
              Voltar para a loja
            </Link>
          </div>
        )}

        {cart.length > 0 && (
          <div className="grid md:grid-cols-[2fr_1fr] gap-10">
            {/* LISTA PRODUTOS */}
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 border border-white/10 p-4 rounded-lg"
                >
                  {/* IMAGEM */}
                  <div className="relative w-24 h-24">
                    <Image
                      src={`http://localhost:3333/${item.imageUrl}`}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                      unoptimized
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1">
                    <h2 className="font-medium">{item.name}</h2>

                    <p className="text-gray-400 text-sm">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price)}
                    </p>
                  </div>

                  {/* QUANTIDADE */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 border border-white/20 rounded"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 border border-white/20 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* SUBTOTAL */}
                  <p className="w-24 text-right font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price * item.qty)}
                  </p>

                  {/* REMOVER */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 text-sm"
                  >
                    remover
                  </button>
                </div>
              ))}
            </div>

            {/* RESUMO */}
            <div className="border border-white/10 rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-6">Resumo do pedido</h2>

              <div className="flex justify-between text-gray-400 mb-2">
                <span>Subtotal</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-gray-400 mb-6">
                <span>Frete</span>
                <span>Calculado no checkout</span>
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

              <button className="mt-6 w-full bg-[#008568] hover:bg-[#00a17e] py-4 rounded-lg font-semibold transition">
                Ir para pagamento
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
