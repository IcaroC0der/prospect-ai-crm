"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, Globe, Phone, RefreshCw, ExternalLink, Map, X, Eye, MessageSquare, CheckCircle } from "lucide-react";

export default function CarteiraPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data || []);
    } catch (err) {
      console.error("Erro ao carregar carteira:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const segments = Array.from(new Set(filteredLeads.map((l) => l.segment)));

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center h-full text-[var(--foreground)]">
        <RefreshCw className="animate-spin mr-3" size={24} />
        <span className="font-bold tracking-widest uppercase text-sm">Carregando Carteira...</span>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 flex-1 w-full max-w-7xl mx-auto flex flex-col h-full relative">
      <header className="mb-8">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-[var(--foreground)]">
          Carteira de Oportunidades
        </h2>
        <p className="text-sm text-[var(--muted-text)] font-medium tracking-wide mb-6">
          Banco centralizado de leads. Clique em qualquer empresa para ver a **Ficha Completa da Oportunidade** ({leads.length} cadastradas).
        </p>

        {/* Barra de Pesquisa */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 text-[var(--muted-text)]" size={18} />
          <input
            type="text"
            placeholder="Buscar por empresa, nicho ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] text-sm font-semibold focus:outline-none focus:border-[var(--foreground)]"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2">
        {segments.map((segment) => {
          const leadsInSegment = filteredLeads.filter((l) => l.segment === segment);
          return (
            <div key={segment}>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4 border-b border-[var(--border-color)] pb-2 flex justify-between items-center">
                <span>{segment}</span>
                <span className="text-xs text-[var(--muted-text)] font-bold">({leadsInSegment.length} empresas)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leadsInSegment.map((lead) => (
                  <Card
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-6 flex flex-col justify-between cursor-pointer hover:border-[var(--foreground)] transition-all transform hover:-translate-y-0.5 shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold uppercase bg-brand-black dark:bg-[#222222] text-brand-creme px-2 py-0.5">
                          Score {lead.score}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[var(--muted-text)]">
                          {lead.status === "new" ? "Novo" : lead.status === "approved" ? "Aprovado" : lead.status}
                        </span>
                      </div>

                      <h4 className="text-lg font-black uppercase truncate mb-1">{lead.name}</h4>
                      <p className="text-xs text-[var(--muted-text)] font-semibold mb-4 flex items-center gap-1">
                        <MapPin size={12} /> {lead.city}
                      </p>
                      <p className="text-xs line-clamp-2 text-[var(--foreground)] font-medium mb-4">{lead.summary}</p>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-xs font-semibold">
                      <span className="text-[var(--muted-text)]">{lead.phone}</span>
                      <Button variant="outline" size="sm" className="text-[10px]">
                        <Eye size={12} className="mr-1" /> Ver Ficha Completa
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {filteredLeads.length === 0 && (
          <div className="p-12 text-center text-sm font-bold uppercase text-[var(--muted-text)]">
            Nenhuma empresa encontrada com este termo de busca.
          </div>
        )}
      </div>

      {/* Modal da Interna de Oportunidade (Ficha Completa) */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="max-w-3xl w-full p-8 bg-[var(--card-bg)] border-[var(--border-color)] relative max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Botão Fechar */}
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-6 right-6 text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors p-2"
            >
              <X size={24} />
            </button>

            {/* Cabeçalho do Lead */}
            <div className="border-b border-[var(--border-color)] pb-6 mb-6 pr-10 shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase bg-brand-black dark:bg-[#222222] text-brand-creme px-3 py-1">
                  Score: {selectedLead.score}
                </span>
                <span className="text-xs font-bold uppercase text-[var(--muted-text)] border border-[var(--border-color)] px-3 py-1">
                  Estágio: {selectedLead.pipelineStage}
                </span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--foreground)] mb-2">
                {selectedLead.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase text-[var(--muted-text)]">
                <span className="flex items-center gap-1"><MapPin size={14} /> {selectedLead.city}</span>
                <span className="flex items-center gap-1"><Globe size={14} /> {selectedLead.segment}</span>
                {selectedLead.phone && (
                  <span className="flex items-center gap-1"><Phone size={14} /> {selectedLead.phone}</span>
                )}
              </div>
            </div>

            {/* Conteúdo da Ficha Completa */}
            <div className="overflow-y-auto flex-1 space-y-6 pr-2">
              {/* Botões de Ação Rápida */}
              <div className="flex flex-wrap gap-3 p-4 bg-[var(--background)] border border-[var(--border-color)]">
                {selectedLead.phone && (
                  <a href={`tel:${selectedLead.phone}`}>
                    <Button size="sm" variant="primary">
                      <Phone size={14} className="mr-2" /> Ligar ({selectedLead.phone})
                    </Button>
                  </a>
                )}
                {selectedLead.phone && (
                  <a
                    href={`https://wa.me/55${selectedLead.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <MessageSquare size={14} className="mr-2 text-green-600" /> WhatsApp
                    </Button>
                  </a>
                )}
                {selectedLead.website && (
                  <a
                    href={selectedLead.website.startsWith("http") ? selectedLead.website : `https://${selectedLead.website}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <ExternalLink size={14} className="mr-2 text-blue-500" /> Abrir Website
                    </Button>
                  </a>
                )}
                <a
                  href={selectedLead.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedLead.name} ${selectedLead.city}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="sm" variant="outline">
                    <Map size={14} className="mr-2 text-emerald-500" /> Ver no Google Maps
                  </Button>
                </a>
              </div>

              {/* Panorama da IA */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Panorama & Presença Digital (IA)</h4>
                <p className="text-sm leading-relaxed font-medium bg-[var(--background)] p-4 border border-[var(--border-color)]">
                  {selectedLead.summary}
                </p>
              </div>

              {/* Dor & Oportunidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Principal Dor Digital</h4>
                  <div className="p-4 bg-[var(--background)] border border-[var(--border-color)] text-sm font-semibold">
                    {selectedLead.principalPain}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Oportunidade Comercial</h4>
                  <div className="p-4 bg-[var(--background)] border-l-4 border-brand-black dark:border-brand-creme text-sm font-semibold">
                    {selectedLead.opportunity}
                  </div>
                </div>
              </div>

              {/* Quebra Gelo */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Quebra-Gelo Sugerido</h4>
                <div className="p-4 bg-[var(--background)] border border-[var(--border-color)] text-sm italic font-medium">
                  "{selectedLead.icebreaker}"
                </div>
              </div>

              {/* Histórico de Ligações */}
              {selectedLead.calls && selectedLead.calls.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Histórico de Chamadas</h4>
                  <div className="space-y-2">
                    {selectedLead.calls.map((call: any) => (
                      <div key={call.id} className="p-3 border border-[var(--border-color)] bg-[var(--background)] text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold uppercase mr-2">Resultado: {call.result}</span>
                          <span className="text-[var(--muted-text)] font-medium">({call.notes || "Sem anotações"})</span>
                        </div>
                        <span className="text-[var(--muted-text)] font-mono">{new Date(call.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[var(--border-color)] flex justify-end shrink-0">
              <Button onClick={() => setSelectedLead(null)} variant="primary">
                Fechar Ficha
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
