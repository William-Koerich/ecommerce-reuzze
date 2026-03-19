"use client";

import { useState } from "react";

export default function PainelAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cnpjOrCpf: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const url = isLogin
        ? "http://localhost:3333/api/login"
        : "http://localhost:3333/api/users";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          cnpjOrCpf: form.cnpjOrCpf,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro");
      }

      const data = await response.json();

      // 👉 salva token (depois você usa pra proteger rotas)
      localStorage.setItem("token", data.token);

      // 👉 redireciona pro dashboard
      window.location.href = "/painel/dashboard";

    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#04110f] flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* LOGO / TITLE */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Reuzze Admin
          </h1>
          <p className="text-gray-400 text-sm">
            Gerencie sua loja com facilidade
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#0b1f1c] border border-white/10 rounded-2xl p-8 shadow-xl">

          {/* TOGGLE */}
          <div className="flex mb-6 bg-[#04110f] rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md text-sm transition ${
                isLogin
                  ? "bg-[#008568] text-white"
                  : "text-gray-400"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md text-sm transition ${
                !isLogin
                  ? "bg-[#008568] text-white"
                  : "text-gray-400"
              }`}
            >
              Criar conta
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <>
                <input
                  name="name"
                  placeholder="Nome"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-[#04110f] border border-white/10 p-3 rounded-lg text-sm"
                  required
                />

                <input
                  name="cnpjOrCpf"
                  placeholder="CNPJ ou CPF"
                  value={form.cnpjOrCpf}
                  onChange={handleChange}
                  className="w-full bg-[#04110f] border border-white/10 p-3 rounded-lg text-sm"
                  required
                />
              </>
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#04110f] border border-white/10 p-3 rounded-lg text-sm"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#04110f] border border-white/10 p-3 rounded-lg text-sm"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#008568] hover:bg-[#00a17e] py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading
                ? "Carregando..."
                : isLogin
                ? "Entrar"
                : "Criar conta"}
            </button>
          </form>

        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Painel administrativo • Reuzze
        </p>

      </div>

    </main>
  );
}