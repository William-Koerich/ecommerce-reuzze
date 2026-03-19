"use client";

import { useState } from "react";
import Image from "next/image";

/* ================= TYPES ================= */

type Category =
  | "FIOS"
  | "MALHAS"
  | "MAQUINAS"

/* ================= HELPERS ================= */

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Erro inesperado";
}

/* ================= PAGE ================= */

export default function NovoProdutoPage() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [category, setCategory] = useState<Category>("FIOS");
  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("http://localhost:3333/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data: { message?: string } = await res.json();
        throw new Error(data.message ?? "Erro ao criar produto");
      }

      alert("Produto criado com sucesso!");

      /* RESET */
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("FIOS");
      setImage(null);
      setPreview(null);

    } catch (error: unknown) {
      console.error(error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  /* ================= HANDLE IMAGE ================= */

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    setImage(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">
        Novo Produto
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-[#0b1f1c] p-6 rounded-xl border border-white/10"
      >
        {/* NOME */}
        <div>
          <label className="text-sm">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            required
            className="w-full mt-1 bg-[#04110f] border border-white/10 rounded p-2"
          />
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="text-sm">Descrição</label>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            required
            className="w-full mt-1 bg-[#04110f] border border-white/10 rounded p-2"
          />
        </div>

        {/* PREÇO */}
        <div>
          <label className="text-sm">Preço</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(e.target.value)
            }
            required
            className="w-full mt-1 bg-[#04110f] border border-white/10 rounded p-2"
          />
        </div>

        {/* ESTOQUE */}
        <div>
          <label className="text-sm">Estoque</label>
          <input
            type="number"
            value={stock}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStock(e.target.value)
            }
            required
            className="w-full mt-1 bg-[#04110f] border border-white/10 rounded p-2"
          />
        </div>

        {/* CATEGORIA */}
        <div>
          <label className="text-sm">Categoria</label>
          <select
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCategory(e.target.value as Category)
            }
            className="w-full mt-1 bg-[#04110f] border border-white/10 rounded p-2"
          >
            <option value="FIOS">Fio</option>
            <option value="MALHAS">Malha</option>
            <option value="MAQUINAS">Máquina</option>
          </select>
        </div>

        {/* IMAGEM */}
        <div>
          <label className="text-sm">Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1 text-sm"
          />
        </div>

        {/* PREVIEW COM NEXT/IMAGE */}
        {preview && (
          <div>
            <p className="text-xs text-gray-400 mb-2">
              Preview:
            </p>

            <div className="relative w-32 h-32">
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-cover rounded"
              />
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#008568] py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Criar Produto"}
        </button>
      </form>
    </div>
  );
}