"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CheckSquare, Settings, Headphones, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#000000] text-[#F5F1E8] flex flex-col h-screen border-r border-[#222222] shrink-0 select-none">
      <div className="p-6 border-b border-[#222222]">
        <h1 className="text-xl font-black tracking-tighter uppercase">ProspectAI</h1>
        <p className="text-xs text-[#A3A3A3] mt-1 tracking-widest uppercase">IPR Tech</p>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1">
        <SidebarLink href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarLink href="/carteira" icon={<Users size={20} />} label="Carteira de Oportunidades" />
        <SidebarLink href="/revisao" icon={<CheckSquare size={20} />} label="Revisão Diária" />
        <SidebarLink href="/prospeccao" icon={<Headphones size={20} />} label="Modo Prospecção" />
        <SidebarLink href="/pipeline" icon={<Users size={20} />} label="Pipeline" />
      </nav>

      <div className="p-6 border-t border-[#222222] flex flex-col gap-1">
        <ThemeToggle />
        <SidebarLink href="/config" icon={<Settings size={20} />} label="Configurações" />
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 py-3 pr-6 transition-all border-l-4 text-xs tracking-widest uppercase ${
        isActive
          ? "border-[#F5F1E8] bg-[#1A1A1A] text-white font-black pl-5 shadow-inner"
          : "border-transparent text-[#A3A3A3] hover:bg-[#111111] hover:text-[#F5F1E8] font-semibold pl-5"
      }`}
    >
      <span className={isActive ? "text-[#F5F1E8]" : "text-[#A3A3A3]"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-4 pl-5 pr-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-[#111111] text-[#A3A3A3] hover:text-[#F5F1E8] transition-colors w-full text-left border-l-4 border-transparent"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
    </button>
  );
}
