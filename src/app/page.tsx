"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, CheckCircle, Phone, Calendar, TrendingUp, ArrowRight, Sparkles, Headphones, Search } from "lucide-react";
import Link from "next/link";

const DAYS_ROUTINE: Record<number, { dayName: string; mode: "pesquisa" | "prospeccao"; title: string; subtitle: string; actionText: string; actionHref: string }> = {
  1: {
    dayName: "Segunda-feira",
    mode: "pesquisa",
    title: "Dia de Pesquisa & Qualificação",
    subtitle: "A IA tem como meta buscar 15 novas empresas hoje. Revise e aprove para acumular para quarta-feira.",
    actionText: "Ir para Revisão Diária (15 Leads)",
    actionHref: "/revisao",
  },
  2: {
    dayName: "Terça-feira",
    mode: "pesquisa",
    title: "Dia de Pesquisa & Qualificação",
    subtitle: "Mais 15 empresas sendo preparadas. Ao final de hoje você terá 30 empresas acumuladas para amanhã!",
    actionText: "Ir para Revisão Diária (15 Leads)",
    actionHref: "/revisao",
  },
  3: {
    dayName: "Quarta-feira",
    mode: "prospeccao",
    title: "🎯 Dia de Prospecção (Home Office)",
    subtitle: "Bom dia! Hoje é dia exclusivo de ligações. Você possui 30 empresas preparadas na fila.",
    actionText: "▶ Iniciar Ligações do Dia (30 Leads)",
    actionHref: "/prospeccao",
  },
  4: {
    dayName: "Quinta-feira",
    mode: "pesquisa",
    title: "Dia de Pesquisa & Qualificação",
    subtitle: "Retorno ao modo pesquisa. A IA trará mais 15 empresas hoje.",
    actionText: "Ir para Revisão Diária (15 Leads)",
    actionHref: "/revisao",
  },
  5: {
    dayName: "Sexta-feira",
    mode: "pesquisa",
    title: "Dia de Pesquisa & Qualificação",
    subtitle: "Última pesquisa da semana. Acumulando 30 empresas para a maratona de sábado.",
    actionText: "Ir para Revisão Diária (15 Leads)",
    actionHref: "/revisao",
  },
  6: {
    dayName: "Sábado",
    mode: "prospeccao",
    title: "🎯 Dia de Prospecção",
    subtitle: "Dia de ligações! Suas 30 empresas acumuladas na quinta e sexta estão prontas.",
    actionText: "▶ Iniciar Ligações do Dia (30 Leads)",
    actionHref: "/prospeccao",
  },
  0: {
    dayName: "Domingo",
    mode: "prospeccao",
    title: "Dia de Follow-ups & Fechamento",
    subtitle: "Finalizar empresas restantes e realizar retornos de agendamento.",
    actionText: "Ver Leads para Follow-up",
    actionHref: "/prospeccao",
  },
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    leadsEncontradosHoje: 0,
    leadsNovos: 0,
    ligacoesPendentes: 0,
    reunioesAgendadas: 0,
  });
  const [loading, setLoading] = useState(true);

  // Identifica o dia da semana atual em produção
  const currentDayOfWeek = new Date().getDay();
  const todayRoutine = DAYS_ROUTINE[currentDayOfWeek] || DAYS_ROUTINE[1];

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/leads");
        const leads: any[] = await res.json();

        if (Array.isArray(leads)) {
          const novos = leads.filter((l) => l.status === "new").length;
          const aprovados = leads.filter((l) => l.status === "approved").length;
          const reunioes = leads.filter((l) => l.pipelineStage === "reuniao_agendada").length;

          setMetrics({
            leadsEncontradosHoje: leads.length,
            leadsNovos: novos,
            ligacoesPendentes: aprovados,
            reunioesAgendadas: reunioes,
          });
        }
      } catch (err) {
        console.error("Erro ao carregar métricas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="p-8 lg:p-12 max-w-6xl w-full mx-auto flex flex-col h-full space-y-8">
      <header>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-[var(--foreground)]">
          Dashboard • Copiloto Comercial
        </h2>
        <p className="text-sm text-[var(--muted-text)] font-medium tracking-wide">
          Visão geral da rotina operacional diária de prospecção.
        </p>
      </header>

      {/* Card do Gestor Comercial (Orientação do Dia em Produção) */}
      <Card className="p-8 border-2 border-[var(--foreground)] bg-[var(--card-bg)] shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-black uppercase tracking-widest bg-brand-black dark:bg-[#222222] text-brand-creme px-3 py-1">
                {todayRoutine.dayName}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)] border border-[var(--border-color)] px-3 py-1">
                {todayRoutine.mode === "pesquisa" ? "Modo Pesquisa (15 Leads)" : "Modo Ligações (30 Leads)"}
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-[var(--foreground)]">
              {todayRoutine.title}
            </h3>
            <p className="text-sm font-medium text-[var(--muted-text)] max-w-xl">
              {todayRoutine.subtitle}
            </p>
          </div>

          <Link href={todayRoutine.actionHref} className="shrink-0">
            <Button size="lg" variant="primary" className="shadow-lg">
              {todayRoutine.mode === "pesquisa" ? <Search className="mr-2" size={18} /> : <Headphones className="mr-2" size={18} />}
              {todayRoutine.actionText}
            </Button>
          </Link>
        </div>
      </Card>

      {/* Grid de Métricas Reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Leads Totais no Banco" value={metrics.leadsEncontradosHoje.toString()} icon={<Users size={24} />} />
        <MetricCard title="Aguardando Revisão" value={metrics.leadsNovos.toString()} icon={<CheckCircle size={24} />} />
        <MetricCard title="Aprovados p/ Ligar" value={metrics.ligacoesPendentes.toString()} icon={<Phone size={24} />} />
        <MetricCard title="Reuniões Agendadas" value={metrics.reunioesAgendadas.toString()} icon={<Calendar size={24} />} />
      </div>

      {/* Meta Semanal de Produção */}
      <Card className="p-6 border border-[var(--border-color)] bg-[var(--background)]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)] mb-4">
          Resumo da Rotina Semanal de Produção
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center text-xs font-semibold uppercase">
          <div className={`p-3 border ${currentDayOfWeek === 1 ? "border-[var(--foreground)] bg-[var(--card-bg)] font-black" : "border-[var(--border-color)] text-[var(--muted-text)]"}`}>
            <div>Segunda</div>
            <div className="text-[10px] mt-1 text-emerald-500 font-bold">15 Pesquisados</div>
          </div>
          <div className={`p-3 border ${currentDayOfWeek === 2 ? "border-[var(--foreground)] bg-[var(--card-bg)] font-black" : "border-[var(--border-color)] text-[var(--muted-text)]"}`}>
            <div>Terça</div>
            <div className="text-[10px] mt-1 text-emerald-500 font-bold">15 Pesquisados</div>
          </div>
          <div className={`p-3 border ${currentDayOfWeek === 3 ? "border-[var(--foreground)] bg-[var(--card-bg)] font-black" : "border-[var(--border-color)] text-[var(--muted-text)]"}`}>
            <div>Quarta</div>
            <div className="text-[10px] mt-1 text-blue-500 font-bold">30 Ligações</div>
          </div>
          <div className={`p-3 border ${currentDayOfWeek === 4 ? "border-[var(--foreground)] bg-[var(--card-bg)] font-black" : "border-[var(--border-color)] text-[var(--muted-text)]"}`}>
            <div>Quinta</div>
            <div className="text-[10px] mt-1 text-emerald-500 font-bold">15 Pesquisados</div>
          </div>
          <div className={`p-3 border ${currentDayOfWeek === 5 ? "border-[var(--foreground)] bg-[var(--card-bg)] font-black" : "border-[var(--border-color)] text-[var(--muted-text)]"}`}>
            <div>Sexta</div>
            <div className="text-[10px] mt-1 text-emerald-500 font-bold">15 Pesquisados</div>
          </div>
          <div className={`p-3 border ${currentDayOfWeek === 6 ? "border-[var(--foreground)] bg-[var(--card-bg)] font-black" : "border-[var(--border-color)] text-[var(--muted-text)]"}`}>
            <div>Sábado</div>
            <div className="text-[10px] mt-1 text-blue-500 font-bold">30 Ligações</div>
          </div>
          <div className={`p-3 border ${currentDayOfWeek === 0 ? "border-[var(--foreground)] bg-[var(--card-bg)] font-black" : "border-[var(--border-color)] text-[var(--muted-text)]"}`}>
            <div>Domingo</div>
            <div className="text-[10px] mt-1 text-purple-500 font-bold">Follow-ups</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-bold text-[var(--muted-text)] uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="text-[var(--foreground)]">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black uppercase tracking-tighter text-[var(--foreground)] mt-1">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
