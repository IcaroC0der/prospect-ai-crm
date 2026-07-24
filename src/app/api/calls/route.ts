import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, answered, spokeWith, durationSeconds, interestLevel, notes, result, nextStage } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId é obrigatório' }, { status: 400 });
    }

    // Registra a ligação
    const callLog = await prisma.callLog.create({
      data: {
        leadId,
        answered: Boolean(answered),
        spokeWith,
        durationSeconds: Number(durationSeconds) || 0,
        interestLevel,
        notes,
        result,
      },
    });

    // Atualiza o lead com a data do último contato e próximo estágio se informado
    const updateData: any = {
      lastContactAt: new Date(),
    };

    if (nextStage) {
      updateData.pipelineStage = nextStage;
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    return NextResponse.json({ success: true, callLog });
  } catch (error) {
    console.error('Erro ao registrar ligação:', error);
    return NextResponse.json({ error: 'Erro ao registrar ligação' }, { status: 500 });
  }
}
