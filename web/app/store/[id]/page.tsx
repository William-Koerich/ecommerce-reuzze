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

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`http://localhost:3333/api/products/${id}`);

      const data = await res.json();

      setProduct(data);
    }

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Carregando produto...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#04110f] text-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8 text-sm text-gray-400">
        <Link href="/store" className="hover:text-white">
          Store
        </Link>

        <span className="mx-2">/</span>

        <span className="text-white">{product.name}</span>
      </div>

      {/* Conteúdo */}
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
            />
          </div>

          {/* thumbs fake (layout estilo medusa) */}
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

        {/* INFO PRODUTO */}
        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          <p className="text-3xl text-[#00a17e] font-bold mt-4">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </p>

          <p className="text-gray-400 mt-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-sm text-gray-400 mt-8">Quantidade (em Kg)</p>
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
          <button className="mt-8 w-full bg-[#008568] hover:bg-[#00a17e] transition py-4 rounded-lg font-semibold">
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
