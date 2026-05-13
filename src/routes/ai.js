const express = require('express');
const { z } = require('zod');
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const requireSubscription = require('../middleware/requireSubscription');
const { query } = require('../db');

const router = express.Router();

function getClient() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY não definido');
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const MessageSchema = z.object({
  message: z.string().min(1, 'Mensagem obrigatória').max(2000),
});

async function chat(req, res, next, assistantType) {
  try {
    const { message } = MessageSchema.parse(req.body);

    const { rows: history } = await query(
      `select role, content
       from ai_messages
       where user_id = $1 and assistant_type = $2
       order by created_at desc
       limit 20`,
      [req.user.id, assistantType]
    );

    const system =
      assistantType === 'lia-fit'
      ? `Você é a Lia Fit, uma personal trainer IA feminina, cuidadosa e motivadora.
    Seu público são mulheres 30+ com pouco tempo e rotina corrida.
    Responda em português do Brasil, de forma simples, prática e gentil.

    Regras de segurança:
    - Treinos em casa (10–15 min), sem equipamentos ou com itens simples.
    - Antes de sugerir, faça perguntas rápidas: nível (iniciante/intermediário), objetivo e dores/limitações.
    - Adapte o treino para limitações leves (ex.: joelho sensível, lombar sensível) com alternativas de baixo impacto.
    - Nunca faça diagnóstico médico, nunca peça exames, nunca substitua acompanhamento profissional.
    - Se relatar dor forte, lesão, tontura, falta de ar, palpitações, desmaio, sangramento, febre, ou condição médica relevante: pare e recomende procurar um profissional de saúde.
    - Evite promessas irreais; foque em constância, técnica e segurança.`
      : `Você é a Nina Nutri, uma nutricionista IA feminina, simples e prática.
    Seu público são mulheres 30+ com pouco tempo.
    Responda em português do Brasil com orientações gerais, seguras e fáceis de aplicar.

    Regras de segurança:
    - Sugestões alimentares gerais (não é dieta médica).
    - Foque em rotina simples, saciedade, proteína, hidratação, fibras e consistência.
    - Nunca prescreva medicamentos, suplementos com dose, ou condutas clínicas.
    - Não prometa cura, emagrecimento garantido ou tratamento de doenças.
    - Se houver sinais de condição médica, gravidez/aleitamento com restrições, ou transtorno alimentar: recomende procurar um profissional de saúde.`;

    const messages = [
      { role: 'system', content: system },
      ...history
        .reverse()
        .map((m) => ({ role: m.role, content: m.content }))
        .filter((m) => m.role === 'user' || m.role === 'assistant'),
      { role: 'user', content: message },
    ];

    await query(
      `insert into ai_messages (id, user_id, assistant_type, role, content)
       values (gen_random_uuid(), $1, $2, 'user', $3)`,
      [req.user.id, assistantType, message]
    );

    const client = getClient();

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
    });

    const answer = completion.choices?.[0]?.message?.content?.trim() || 'Não consegui responder agora. Tente novamente.';

    await query(
      `insert into ai_messages (id, user_id, assistant_type, role, content)
       values (gen_random_uuid(), $1, $2, 'assistant', $3)`,
      [req.user.id, assistantType, answer]
    );

    return res.json({ reply: answer });
  } catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
    }
    return next(err);
  }
}

router.post('/ai/lia-fit', auth, requireSubscription, (req, res, next) => chat(req, res, next, 'lia-fit'));
router.post('/ai/nina-nutri', auth, requireSubscription, (req, res, next) => chat(req, res, next, 'nina-nutri'));

router.get('/ai/lia-fit/history', auth, requireSubscription, async (req, res, next) => {
  try {
    const { rows } = await query(
      `select role, content
       from ai_messages
       where user_id = $1 and assistant_type = 'lia-fit'
       order by created_at asc
       limit 50`,
      [req.user.id]
    );
    return res.json({ messages: rows });
  } catch (err) {
    return next(err);
  }
});

router.get('/ai/nina-nutri/history', auth, requireSubscription, async (req, res, next) => {
  try {
    const { rows } = await query(
      `select role, content
       from ai_messages
       where user_id = $1 and assistant_type = 'nina-nutri'
       order by created_at asc
       limit 50`,
      [req.user.id]
    );
    return res.json({ messages: rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
