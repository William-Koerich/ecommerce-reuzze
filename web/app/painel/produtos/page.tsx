"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* ================= TYPES ================= */

type Category = "FIOS" | "MALHAS" | "MAQUINAS";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  imageUrl: string | null;
  createdAt: string;
};

/* ================= HELPERS ================= */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Erro inesperado";
}

/* ================= PAGE ================= */

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Product | null>(null);

  /* EDIT STATE */
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [category, setCategory] = useState<Category>("FIOS");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */

  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:3333/api/products");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= OPEN MODAL ================= */

  function openModal(product: Product) {
    setSelected(product);

    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setCategory(product.category);

    console.log(product.imageUrl);

    setPreview(
      product.imageUrl ? `http://localhost:3333/${product.imageUrl}` : null,
    );

    setImage(null);
  }

  /* ================= UPDATE ================= */

  async function handleUpdate() {
    if (!selected) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        `http://localhost:3333/api/products/${selected.id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!res.ok) {
        const data: { message?: string } = await res.json();
        throw new Error(data.message ?? "Erro ao atualizar produto");
      }

      await fetchProducts();
      setSelected(null);
    } catch (error: unknown) {
      alert(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  /* ================= IMAGE ================= */

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  /* ================= UI ================= */

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Produtos</h1>

      {loading && <p className="text-gray-400">Carregando...</p>}

      {/* GRID COM SEU CARD */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => openModal(product)}
            className="bg-[#0b1f1c] border border-white/5 rounded-xl overflow-hidden hover:border-[#008568]/40 transition hover:scale-[1.02] cursor-pointer"
          >
            <div className="relative w-full h-60">
              {product.imageUrl && (
                <Image
                  src={`http://localhost:3333/${product.imageUrl}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              )}
            </div>

            <div className="p-5">
              <h3 className="font-semibold">{product.name}</h3>

              <p className="text-[#008568] mt-2 font-bold">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0b1f1c] p-6 rounded-xl w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Editar Produto</h2>

            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-[#04110f] rounded"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-[#04110f] rounded"
              />

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 bg-[#04110f] rounded"
              />

              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2 bg-[#04110f] rounded"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-2 bg-[#04110f] rounded"
              >
                <option value="FIOS">Fio</option>
                <option value="MALHAS">Malha</option>
                <option value="MAQUINAS">Máquina</option>
              </select>

              <input type="file" onChange={handleImageChange} />

              {preview && (
                <div className="relative w-32 h-32">
                  <Image
                    src={preview}
                    alt={preview}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-white/10 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 bg-[#008568] rounded"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
