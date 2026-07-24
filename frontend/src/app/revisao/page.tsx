"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, X, Clock, MapPin, Globe, Phone, RefreshCw, Sparkles, ExternalLink, Map, PlusCircle } from "lucide-react";

export default function DailyReviewPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetCity, setTargetCity] = useState("São Paulo");
  const [manualExtraCount, setManualExtraCount] = useState(0);

  const fetchNewLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?status=new");
      const data = await res.json();
      setLeads(data || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Erro ao carregar revisão:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewLeads();
  }, []);

  const handleGenerateBatch = async (countToGenerate = 3, isManualExtra = true) => {
    setGenerating(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_batch", count: countToGenerate, city: targetCity || "São Paulo", cityCustomized: Boolean(targetCity) }),
      });
      if (res.ok) {
        if (isManualExtra) {
          setManualExtraCount((prev) => prev + countToGenerate);
        }
        await fetchNewLeads();
      }
    } catch (err) {
      console.error("Erro ao gerar leads por IA:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleAction = async (status: "approved" | "discarded" | "postponed") => {
    if (leads.length === 0) return;
    const currentLead = leads[currentIndex];

    if (status !== "postponed") {
      try {
        await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentLead.id, status }),
        });
      } catch (err) {
        console.error("Erro ao atualizar lead:", err);
      }
    }

    // Se o lead foi DESCARTADO, dispara reposição automática de +1 lead qualificado via IA
    if (status === "discarded") {
      handleGenerateBatch(1, false);
    }

    if (currentIndex < leads.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      fetchNewLeads();
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center h-full text-[var(--foreground)]">
        <RefreshCw className="animate-spin mr-3" size={24} />
        <span className="font-bold tracking-widest uppercase text-sm">Carregando Fila do Dia...</span>
      </div>
    );
  }

  const currentLead = leads[currentIndex];
  const mapsUrl = currentLead?.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentLead?.name} ${currentLead?.city}`)}`;

  return (
    <div className="p-8 lg:p-12 max-w-5xl w-full mx-auto flex flex-col h-full">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-[var(--foreground)]">
              Revisão dos Leads do Dia
            </h2>
            {manualExtraCount > 0 && (
              <span className="text-[10px] font-bold uppercase bg-purple-600 text-white px-2 py-0.5 rounded">
                +{manualExtraCount} Extras Manuais
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--muted-text)] font-medium tracking-wide">
            {leads.length > 0
              ? `Empresa ${currentIndex + 1} de ${leads.length} na fila.`
              : "Nenhum lead pendente de revisão."}
          </p>
        </div>

        {/* Controles de Busca Customizada & Botão Extra Manual */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={targetCity}
            onChange={(e) => setTargetCity(e.target.value)}
            placeholder="Cidade (ex: São Paulo)"
            className="px-3 py-2 border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--foreground)] text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-[var(--foreground)]"
          />
          <Button onClick={() => handleGenerateBatch(3, true)} disabled={generating} variant="outline" size="sm">
            <PlusCircle className="mr-2 text-purple-500" size={16} />
            {generating ? "Pesquisando Google..." : "Modo Extra (+3 Leads)"}
          </Button>
        </div>
      </header>

      {!currentLead ? (
        <Card className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <Sparkles size={48} className="mb-4 text-[var(--muted-text)] animate-bounce" />
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-[var(--foreground)]">Fila de Revisão Vazia!</h3>
          <p className="text-sm text-[var(--muted-text)] max-w-md mb-6">
            A IA processou todos os leads. A rotina automática roda às <strong>06:00 AM na Vercel</strong>, mas se você quiser dar uma extrapolada agora, clique no botão abaixo para gerar <strong>+3 Leads Extras</strong> via IA!
          </p>
          <Button onClick={() => handleGenerateBatch(3, true)} disabled={generating} size="lg" variant="primary">
            {generating ? "Pesquisando no Google..." : "⚡ Gerar +3 Leads Extras com IA Agora"}
          </Button>
        </Card>
      ) : (
        <>
          <Card className="mb-6 border-[var(--border-color)] relative flex-1 flex flex-col overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-black dark:bg-[#222222] text-brand-creme px-4 py-1 text-xs font-bold tracking-widest uppercase z-10 border-b border-l border-[var(--border-color)]">
              Score: {currentLead.score}
            </div>

            <CardHeader className="border-b border-[var(--border-color)] pb-4 shrink-0">
              <CardTitle className="text-2xl font-black tracking-tighter uppercase mb-2 text-[var(--foreground)]">
                {currentLead.name}
              </CardTitle>
              <div className="flex flex-wrap gap-4 text-xs font-semibold tracking-widest uppercase text-[var(--muted-text)]">
                <span className="flex items-center gap-1"><MapPin size={14} /> {currentLead.city}</span>
                <span className="flex items-center gap-1"><Globe size={14} /> {currentLead.segment}</span>
                {currentLead.phone && (
                  <span className="flex items-center gap-1"><Phone size={14} /> {currentLead.phone}</span>
                )}
                {currentLead.website && (
                  <a
                    href={currentLead.website.startsWith("http") ? currentLead.website : `https://${currentLead.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:underline font-bold"
                  >
                    <ExternalLink size={14} /> Abrir Website
                  </a>
                )}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-500 hover:underline font-bold"
                >
                  <Map size={14} /> Ver no Google Maps
                </a>
              </div>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Resumo da IA</h4>
                <p className="text-sm leading-relaxed font-medium text-[var(--foreground)]">{currentLead.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Principal Dor</h4>
                  <p className="text-sm font-medium bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] p-3">{currentLead.principalPain}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Oportunidade</h4>
                  <p className="text-sm font-medium bg-[var(--background)] text-[var(--foreground)] p-3 border-l-4 border-brand-black dark:border-brand-creme">
                    {currentLead.opportunity}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Quebra-Gelo Sugerido</h4>
                <div className="p-4 border border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] text-sm italic font-medium">
                  "{currentLead.icebreaker}"
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 shrink-0">
            <Button onClick={() => handleAction("discarded")} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              <X className="mr-2" size={18} /> Descartar
            </Button>
            <Button onClick={() => handleAction("postponed")} variant="secondary">
              <Clock className="mr-2" size={18} /> Adiar
            </Button>
            <Button onClick={() => handleAction("approved")} variant="primary">
              <Check className="mr-2" size={18} /> Aprovar Lead
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
