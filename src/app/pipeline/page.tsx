"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Phone, Calendar, ArrowRight, RefreshCw } from "lucide-react";

const PIPELINE_STAGES = [
  { id: "pronto_para_contato", label: "Pronto p/ Contato" },
  { id: "contato_iniciado", label: "Contato Iniciado" },
  { id: "conversando", label: "Em Conversa" },
  { id: "follow_up", label: "Follow-up" },
  { id: "reuniao_agendada", label: "Reunião Agendada 🎯" },
  { id: "proposta", label: "Proposta" },
  { id: "cliente", label: "Cliente Fechado 🚀" },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data || []);
    } catch (err) {
      console.error("Erro ao buscar pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const moveLeadStage = async (leadId: string, currentStage: string) => {
    const stageIds = PIPELINE_STAGES.map((s) => s.id);
    const currentIndex = stageIds.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex >= stageIds.length - 1) return;

    const nextStage = stageIds[currentIndex + 1];

    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, pipelineStage: nextStage }),
      });
      fetchLeads();
    } catch (err) {
      console.error("Erro ao mover lead:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center h-full text-[var(--foreground)]">
        <RefreshCw className="animate-spin mr-3" size={24} />
        <span className="font-bold tracking-widest uppercase text-sm">Carregando Pipeline...</span>
      </div>
    );
  }

  const leadsByStage: Record<string, any[]> = {};
  PIPELINE_STAGES.forEach((stage) => {
    leadsByStage[stage.id] = leads.filter((l) => l.pipelineStage === stage.id || (!l.pipelineStage && stage.id === "pronto_para_contato"));
  });

  return (
    <div className="p-8 lg:p-12 flex-1 w-full h-full flex flex-col">
      <header className="mb-8">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-[var(--foreground)]">
          Pipeline de Vendas
        </h2>
        <p className="text-sm text-[var(--muted-text)] font-medium tracking-wide">
          Acompanhe o avanço das empresas desde o primeiro contato até o fechamento.
        </p>
      </header>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max h-full pb-8">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leadsByStage[stage.id] || [];
            return (
              <div key={stage.id} className="w-80 flex flex-col">
                <div className="bg-brand-black dark:bg-[#222222] text-brand-creme px-4 py-3 font-bold tracking-widest uppercase text-xs mb-4 border border-[var(--border-color)] flex justify-between items-center">
                  <span>{stage.label}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{stageLeads.length}</span>
                </div>

                <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
                  {stageLeads.map((lead) => (
                    <Card key={lead.id} className="p-4 hover:border-[var(--foreground)] transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase text-[var(--muted-text)]">
                          Score {lead.score}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[var(--muted-text)]">
                          {lead.city}
                        </span>
                      </div>
                      <h4 className="text-base font-black uppercase mb-1">{lead.name}</h4>
                      <p className="text-xs text-[var(--muted-text)] mb-4">{lead.segment}</p>

                      <Button
                        onClick={() => moveLeadStage(lead.id, lead.pipelineStage)}
                        variant="outline"
                        size="sm"
                        className="w-full text-[10px] py-2"
                      >
                        Avançar Estágio <ArrowRight className="ml-1" size={12} />
                      </Button>
                    </Card>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="border border-dashed border-[var(--border-color)] p-6 text-center text-xs text-[var(--muted-text)] font-semibold uppercase">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
