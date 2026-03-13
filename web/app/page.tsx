"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/* =========================
   COUNT UP HOOK
========================= */

function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [start, end, duration]);

  return count;
}

function ThreadAnimation() {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 1.3]);

  const threads = [
    {
      d: "M-100 300 C100 50 300 550 500 300 C700 50 900 550 1100 300",
      width: 2.5,
      delay: 0,
      dur: 3,
    },
    {
      d: "M-100 380 C150 130 350 630 550 380 C750 130 950 630 1150 380",
      width: 1.5,
      delay: 0.5,
      dur: 3.5,
    },
    {
      d: "M-100 460 C200 210 400 710 600 460 C800 210 1000 710 1200 460",
      width: 1,
      delay: 1,
      dur: 4,
    },
  ];

  return (
    <motion.svg
      style={{ scale, opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
    >
      {threads.map((t, i) => (
        <motion.path
          key={i}
          d={t.d}
          stroke="#008568"
          strokeWidth={t.width}
          fill="transparent"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: t.dur,
            delay: t.delay,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}

      {/* partículas */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={120 + i * 100}
          cy={350}
          r={2}
          fill="#008568"
          animate={{
            y: [-10, 10, -10],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 0.3,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.svg>
  );
}

/* =========================
   NAVBAR
========================= */

function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Sobre", href: "#sobre" },
    { label: "Produtos", href: "#produtos" },
    { label: "Serviços", href: "#servicos" },
    { label: "Números", href: "#metricas" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* LOGO */}
        <a href="#home" className="text-2xl font-bold text-[#008568]">
          Reuzze
        </a>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex gap-8 text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-[#008568] transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* BOTÃO DESKTOP */}
        <a
          href="#contato"
          className="hidden md:block px-5 py-2 rounded-full bg-[#008568] text-white text-sm font-semibold hover:scale-105 transition"
        >
          Fale conosco
        </a>

        {/* BOTÃO MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/90 backdrop-blur-xl"
        >
          <div className="flex flex-col items-center py-6 gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg text-gray-300 hover:text-[#008568]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="mt-4 px-6 py-3 rounded-full bg-[#008568] text-white font-semibold"
            >
              Fale conosco
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

/* =========================
   HERO
========================= */

function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center text-center px-6"
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#071a17] via-[#081f1b] to-[#04110f]" />

      <div className="absolute w-200 h-200 bg-[#008568] opacity-20 blur-[200px] rounded-full" />

      <ThreadAnimation />

      <div className="relative z-10 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold leading-tight"
        >
          Reuzze
          <br />
          <span className="text-[#008568]">Têxtil</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mt-8 text-xl"
        >
          Tecnologia e sustentabilidade na reutilização de fios e malhas.
        </motion.p>

        <div className="mt-12 flex gap-6 justify-center">
          <a
            href="#servicos"
            className="px-8 py-4 rounded-full bg-[#008568] text-white font-semibold hover:scale-105 transition"
          >
            Conheça a empresa
          </a>

          <a
            href="#contato"
            className="px-8 py-4 rounded-full border border-[#008568] text-white hover:bg-[#008568]/20 transition"
          >
            Entre em contato
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================
   ABOUT
========================= */

function About() {
  return (
    <section id="sobre" className="py-32 bg-[#051816] text-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* TEXTO */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold mb-6">
            Tecendo o <span className="text-[#008568]">futuro</span>
          </h2>

          <p className="text-gray-300 text-lg mb-6">
            A Reuzze Têxtil é especialista na reutilização de fios e malhas
            provenientes de sobras industriais.
          </p>

          <p className="text-gray-300 text-lg">
            Transformamos resíduos têxteis em novos produtos com qualidade
            industrial e sustentabilidade.
          </p>
        </motion.div>

        {/* IMAGEM */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-105 rounded-xl overflow-hidden"
        >
          <Image
            src={`http://localhost:3333/uploads/products/maquina.png`}
            alt="Produção têxtil"
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </div>
    </section>
  );
}
function Produtos() {
  const produtos = [
    {
      nome: "Fios Reciclados",
      desc: "Produzidos a partir da reutilização de resíduos têxteis com alto padrão de qualidade.",
      img: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c",
    },
    {
      nome: "Malhas Sustentáveis",
      desc: "Tecidos reciclados com excelente acabamento para moda e indústria.",
      img: "https://images.unsplash.com/photo-1593032457862-44b632e76d7b",
    },
    {
      nome: "Algodão Recuperado",
      desc: "Matéria-prima sustentável pronta para novas aplicações têxteis.",
      img: "https://images.unsplash.com/photo-1604514813560-1e4f3c3a7f3d",
    },
  ];

  return (
    <section id="produtos" className="relative py-32 px-6 overflow-hidden">
      {/* background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#04110f] via-[#071a17] to-[#04110f]" />

      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-175 bg-[#008568] opacity-20 blur-[200px] rounded-full" />

      <div className="relative max-w-7xl mx-auto text-center">
        {/* titulo */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-6"
        >
          Conheça nossos <span className="text-[#008568]">produtos</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg"
        >
          Desenvolvemos fios e materiais reciclados com tecnologia e
          sustentabilidade. Explore nosso catálogo completo de produtos têxteis.
        </motion.p>

        {/* cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {produtos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="group bg-[#0b1f1c] rounded-2xl overflow-hidden border border-white/5 hover:border-[#008568]/40 transition"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.nome}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="p-8 text-left">
                <h3 className="text-2xl font-semibold mb-3">{p.nome}</h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* botão ecommerce */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <a
            href="/store"
            className="inline-flex items-center gap-3 bg-[#008568] hover:bg-[#00a07f] text-white px-10 py-5 rounded-xl text-lg font-semibold transition shadow-lg shadow-[#008568]/30"
          >
            Ver catálogo completo
            <span className="text-2xl">→</span>
          </a>

          <p className="text-gray-500 mt-4 text-sm">
            Acesse nossa loja e explore todos os produtos disponíveis
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================
   SERVICES
========================= */

function Services() {
  const services = [
    {
      title: "Repasse de Fios",
      desc: "Grande variedade de fios reutilizáveis com qualidade industrial.",
    },
    {
      title: "Tingimento",
      desc: "Processos de tingimento sustentáveis com grande variação de cores.",
    },
    {
      title: "Produção de Malhas",
      desc: "Fabricação de malhas com tecnologia moderna.",
    },
  ];

  return (
    <section id="servicos" className="py-32 bg-[#071a17] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-20">
          O que <span className="text-[#008568]">oferecemos</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-2xl border border-white/10 bg-black/30"
            >
              <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
              <p className="text-gray-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================
   METRICS
========================= */

function MetricCard({
  value,
  label,
  inView,
}: {
  value: number;
  label: string;
  inView: boolean;
}) {
  const count = useCountUp(value, 2, inView);

  return (
    <div className="text-center">
      <h3 className="text-5xl font-bold text-[#008568]">+{count}</h3>

      <p className="text-gray-400 mt-4">{label}</p>
    </div>
  );
}

function Metrics() {
  const { ref, inView } = useInView({ triggerOnce: true });

  const metrics = [
    { value: 500, label: "Clientes atendidos" },
    { value: 15, label: "Tipos de fios" },
    { value: 5, label: "Anos no mercado" },
    { value: 1000, label: "Toneladas reaproveitadas" },
  ];

  return (
    <section id="metricas" ref={ref} className="py-32 bg-[#051816] text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
        {metrics.map((m, i) => (
          <MetricCard key={i} value={m.value} label={m.label} inView={inView} />
        ))}
      </div>
    </section>
  );
}

/* =========================
   CONTACT
========================= */

function Contact() {
  return (
    <section
      id="contato"
      className="relative py-32 px-6 bg-linear-to-b from-[#071a17] to-[#04110f]"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* texto */}
        <div>
          <h2 className="text-5xl font-bold mb-6">Fale conosco</h2>

          <p className="text-gray-400 text-lg mb-10">
            Entre em contato com nossa equipe e conheça nossas soluções
            sustentáveis para a indústria têxtil.
          </p>

          <a
            href="https://wa.me/5547996637188"
            target="_blank"
            className="inline-flex items-center gap-3 bg-[#008568] hover:bg-[#00a07f] text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-[#008568]/30"
          >
            Falar no WhatsApp
          </a>

          <p className="text-gray-500 mt-6">
            Visite nossa empresa no endereço.
          </p>
        </div>

        {/* mapa */}
        <div className="w-full h-105 rounded-2xl overflow-hidden border border-white/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.620697830867!2d-49.11518622987671!3d-26.85091782574351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94df1e058466c531%3A0x81f56d6a0c9b3ee0!2sR.%20Leopoldo%20Ewald%2C%20300%20-%20Itoupavazinha%2C%20Blumenau%20-%20SC%2C%2089066-620!5e0!3m2!1spt-BR!2sbr!4v1773347243543!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/* =========================
   FOOTER
========================= */

function Footer() {
  return (
    <footer className="py-10 border-t border-white/10 bg-[#04110f] text-center text-gray-400">
      © {new Date().getFullYear()} Reuzze Têxtil
    </footer>
  );
}

/* =========================
   PAGE
========================= */

export default function Home() {
  return (
    <main className="bg-[#04110f] text-white">
      <Navbar />
      <Hero />
      <About />
      <Produtos />
      <Services />
      <Metrics />
      <Contact />
      <Footer />
    </main>
  );
}
