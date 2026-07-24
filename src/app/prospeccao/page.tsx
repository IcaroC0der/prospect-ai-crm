"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Phone, MessageSquare, ChevronRight, MapPin, Globe, CheckCircle, ExternalLink, Map } from "lucide-react";
import Link from "next/link";

export default function ProspectingModePage() {
  const [approvedLeads, setApprovedLeads] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [callResult, setCallResult] = useState("reuniao_agendada");
  const [savingCall, setSavingCall] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?status=approved");
      const data = await res.json();
      setApprovedLeads(data || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Erro ao carregar leads para prospecção:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleRegisterCall = async () => {
    if (!currentLead) return;
    setSavingCall(true);
    try {
      let nextStage = "contato_iniciado";
      if (callResult === "reuniao_agendada") nextStage = "reuniao_agendada";
      if (callResult === "retornar") nextStage = "follow_up";

      await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: currentLead.id,
          answered: true,
          spokeWith: currentLead.contactPerson || "Proprietário",
          notes: callNotes,
          result: callResult,
          nextStage,
        }),
      });

      setShowCallModal(false);
      setCallNotes("");

      if (currentIndex < approvedLeads.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        fetchLeads();
      }
    } catch (err) {
      console.error("Erro ao salvar ligação:", err);
    } finally {
      setSavingCall(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center h-full text-[var(--foreground)]">
        <span className="font-bold tracking-widest uppercase text-sm">Carregando Modo Prospecção...</span>
      </div>
    );
  }

  const currentLead = approvedLeads[currentIndex];

  if (!currentLead) {
    return (
      <div className="p-12 max-w-4xl mx-auto text-center flex flex-col items-center justify-center h-full">
        <CheckCircle size={64} className="mb-4 text-green-500" />
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Nenhum Lead Aprovado na Fila!</h2>
        <p className="text-sm text-[var(--muted-text)] mb-6">
          Acesse a aba <strong>Revisão Diária</strong> para aprovar os novos leads pesquisados pela IA antes de iniciar a prospecção.
        </p>
        <Link href="/revisao">
          <Button size="lg">Ir para Revisão Diária</Button>
        </Link>
      </div>
    );
  }

  const questions: string[] = currentLead.suggestedQuestions ? JSON.parse(currentLead.suggestedQuestions) : [];
  const mapsUrl = currentLead?.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentLead?.name} ${currentLead?.city}`)}`;

  return (
    <div className="p-8 lg:p-12 max-w-6xl w-full mx-auto flex flex-col h-full relative">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)]">
            Fila de Ligação • Lead {currentIndex + 1} de {approvedLeads.length}
          </span>
          <h2 className="text-3xl font-black tracking-tighter uppercase text-[var(--foreground)]">
            {currentLead.name}
          </h2>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setShowCallModal(true)} variant="primary">
            <Phone className="mr-2" size={16} /> Registrar Ligação
          </Button>
          <Button
            onClick={() => {
              if (currentIndex < approvedLeads.length - 1) setCurrentIndex((prev) => prev + 1);
            }}
            variant="outline"
          >
            Próximo Lead <ChevronRight className="ml-1" size={16} />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Coluna Esquerda: Informações & Contato */}
        <Card className="flex flex-col justify-between p-6">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase bg-brand-black dark:bg-[#222222] text-brand-creme px-3 py-1 inline-block mb-4">
              Score {currentLead.score}
            </div>

            <h3 className="text-xl font-black uppercase mb-1">{currentLead.contactPerson || "Decisor"}</h3>
            <p className="text-xs uppercase text-[var(--muted-text)] tracking-wider mb-6">{currentLead.role || "Sócio"}</p>

            <div className="space-y-3 text-sm font-semibold mb-6">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[var(--muted-text)]" />
                <span>{currentLead.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[var(--muted-text)]" />
                <span>{currentLead.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-[var(--muted-text)]" />
                <span>{currentLead.segment}</span>
              </div>

              {/* Link Website */}
              {currentLead.website && (
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                  <ExternalLink size={16} className="text-blue-500" />
                  <a
                    href={currentLead.website.startsWith("http") ? currentLead.website : `https://${currentLead.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-500 hover:underline truncate font-bold"
                  >
                    {currentLead.website}
                  </a>
                </div>
              )}

              {/* Link Google Maps */}
              <div className="flex items-center gap-2">
                <Map size={16} className="text-emerald-500" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-500 hover:underline font-bold"
                >
                  Ver no Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
            <a href={`tel:${currentLead.phone}`} className="block">
              <Button variant="primary" className="w-full">
                <Phone className="mr-2" size={16} /> Ligar Agora
              </Button>
            </a>
            <a
              href={`https://wa.me/55${currentLead.phone?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 text-green-600" size={16} /> Abrir WhatsApp
              </Button>
            </a>
          </div>
        </Card>

        {/* Coluna Central/Direita: Script Inteligente */}
        <Card className="lg:col-span-2 p-6 flex flex-col overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Quebra-Gelo Recomendado</h4>
            <div className="p-4 border-l-4 border-brand-black dark:border-brand-creme bg-[var(--border-color)] text-sm font-medium italic">
              "{currentLead.icebreaker}"
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Resumo Operacional</h4>
            <p className="text-sm font-medium leading-relaxed">{currentLead.summary}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--muted-text)] mb-2">Perguntas de Abordagem</h4>
            <ul className="list-disc list-inside text-sm space-y-2 font-medium">
              {questions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Modal de Registro de Ligação */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 bg-[var(--card-bg)] border-[var(--border-color)]">
            <h3 className="text-xl font-black uppercase mb-4">Registrar Resultado da Chamada</h3>

            <label className="block text-xs font-bold uppercase tracking-wider mb-2">Resultado</label>
            <select
              value={callResult}
              onChange={(e) => setCallResult(e.target.value)}
              className="w-full p-3 border border-[var(--border-color)] bg-[var(--background)] text-sm mb-4 font-semibold"
            >
              <option value="reuniao_agendada">Reunião Agendada 🎯</option>
              <option value="contato_iniciado">Atendeu / Em Conversa</option>
              <option value="retornar">Pediu para Retornar (Follow-up)</option>
              <option value="sem_resposta">Não Atendeu</option>
              <option value="sem_interesse">Sem Interesse</option>
            </select>

            <label className="block text-xs font-bold uppercase tracking-wider mb-2">Observações / Anotações</label>
            <textarea
              rows={3}
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="Digite resumo da conversa..."
              className="w-full p-3 border border-[var(--border-color)] bg-[var(--background)] text-sm mb-6 font-medium"
            />

            <div className="flex gap-3">
              <Button onClick={() => setShowCallModal(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleRegisterCall} disabled={savingCall} variant="primary" className="flex-1">
                {savingCall ? "Salvando..." : "Salvar e Avançar"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
