"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

type CartItem = Product & {
  qty: number;
};

function getCartCount() {
  if (typeof window === "undefined") return 0;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  return cart.reduce((acc: number, item: CartItem) => acc + item.qty, 0);
}

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`http://localhost:3333/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    }

    fetchProduct();
  }, [id]);

  function addToCart() {
    if (!product) return;

    const cart: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.push({
        ...product,
        qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setCartCount(getCartCount());

    alert("Produto adicionado ao carrinho!");
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Carregando produto...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#04110f] text-white">

      {/* HEADER COM CARRINHO */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center">

        <Link href="/store" className="text-lg font-semibold">
          Store
        </Link>

        <Link href="/cart" className="relative">

          {/* ICON */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>

          {/* CONTADOR */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#00a17e] text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}

        </Link>
      </div>

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 pt-6 text-sm text-gray-400">
        <Link href="/store" className="hover:text-white">
          Store
        </Link>

        <span className="mx-2">/</span>

        <span className="text-white">{product.name}</span>
      </div>

      {/* CONTEÚDO */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 px-6 py-10">

        {/* GALERIA */}
        <div>
          <div className="relative w-full h-130 rounded-xl overflow-hidden border border-white/10">
            <Image
              src={`http://localhost:3333/${product.imageUrl}`}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <div className="relative w-24 h-24 border border-white/10 rounded-md overflow-hidden">
              <Image
                src={`http://localhost:3333/${product.imageUrl}`}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* INFO */}
        <div>

          <h1 className="text-3xl font-semibold">
            {product.name}
          </h1>

          <p className="text-3xl text-[#00a17e] font-bold mt-4">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </p>

          <p className="text-gray-400 mt-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-sm text-gray-400 mt-8">
            Quantidade (em Kg)
          </p>

          {/* QUANTIDADE */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
              className="w-10 h-10 border border-white/20 rounded-md"
            >
              -
            </button>

            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-20 text-center bg-[#0b1f1c] border border-white/20 rounded-md h-10 outline-none"
            />

            <button
              onClick={() => setQty(qty + 1)}
              className="w-10 h-10 border border-white/20 rounded-md"
            >
              +
            </button>
          </div>

          {/* BOTÃO */}
          <button
            onClick={addToCart}
            className="mt-8 w-full bg-[#008568] hover:bg-[#00a17e] transition py-4 rounded-lg font-semibold"
          >
            Adicionar ao carrinho
          </button>

          {/* INFO EXTRA */}
          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-gray-400 space-y-3">
            <p>✔ Produto disponível em estoque</p>
            <p>✔ Envio para todo Brasil</p>
            <p>✔ Pagamento seguro</p>
          </div>

        </div>

      </div>

    </main>
  );
}