"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: "FIOS" | "MALHAS" | "MAQUINAS";
};

export default function StorePage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);

  async function loadProducts(selectedCategory?: string) {
    try {

      const url = selectedCategory
        ? `http://localhost:3333/api/products?category=${selectedCategory}`
        : `http://localhost:3333/api/products`;

      const res = await fetch(url);

      const data = await res.json();

      setProducts(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts(category || undefined);
  }, [category]);

  return (
    <main className="min-h-screen bg-[#04110f] text-white">

      {/* HEADER */}
      <header className="border-b border-white/10 backdrop-blur bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between">

          <Link href="/" className="text-2xl font-bold text-[#008568]">
            Reuzze
          </Link>

          <input
            placeholder="Buscar produtos..."
            className="bg-[#0b1f1c] px-4 py-2 rounded-lg text-sm outline-none"
          />

        </div>
      </header>

      {/* LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-10 px-6 py-10">

        {/* SIDEBAR */}
        <aside className="col-span-3 hidden md:block">

          <h3 className="font-semibold mb-6">
            Categorias
          </h3>

          <ul className="space-y-3 text-sm">

            <li
              onClick={() => setCategory(null)}
              className={`cursor-pointer ${
                category === null
                  ? "text-[#008568]"
                  : "text-gray-400 hover:text-[#008568]"
              }`}
            >
              Todos
            </li>

            <li
              onClick={() => setCategory("FIOS")}
              className={`cursor-pointer ${
                category === "FIOS"
                  ? "text-[#008568]"
                  : "text-gray-400 hover:text-[#008568]"
              }`}
            >
              Fios
            </li>

            <li
              onClick={() => setCategory("MALHAS")}
              className={`cursor-pointer ${
                category === "MALHAS"
                  ? "text-[#008568]"
                  : "text-gray-400 hover:text-[#008568]"
              }`}
            >
              Malhas
            </li>

            <li
              onClick={() => setCategory("MAQUINAS")}
              className={`cursor-pointer ${
                category === "MAQUINAS"
                  ? "text-[#008568]"
                  : "text-gray-400 hover:text-[#008568]"
              }`}
            >
              Máquinas
            </li>

          </ul>

        </aside>

        {/* PRODUTOS */}
        <section className="col-span-12 md:col-span-9">

          <h1 className="text-3xl font-bold mb-8">
            Produtos
          </h1>

          {loading && (
            <p className="text-gray-400">
              Carregando produtos...
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {products.length > 0 ? (
              products.map((product) => (

              <Link key={product.id} href={`/store/${product.id}`}>

                <div className="bg-[#0b1f1c] border border-white/5 rounded-xl overflow-hidden hover:border-[#008568]/40 transition hover:scale-[1.02] cursor-pointer">

                  <div className="relative w-full h-60">

                    <Image
                      src={`http://localhost:3333/${product.imageUrl}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />

                  </div>

                  <div className="p-5">

                    <h3 className="font-semibold">
                      {product.name}
                    </h3>

                    <p className="text-[#008568] mt-2 font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
                    </p>

                  </div>

                </div>

              </Link>

            ))) : (

              <p className="text-gray-400">
                Nenhum produto encontrado.
              </p>

            )}

          </div>

        </section>

      </div>

    </main>
  );
}