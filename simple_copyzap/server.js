const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'ERRO: A API Key do Gemini não foi encontrada no servidor!' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const body = req.body;
        const { mode, subMode, funnelType, socialNetwork, product, price, audience, pain, tone } = body;

        let systemPrompt = `Você é um Copywriter Especialista em Vendas Consultivas do Agronegócio. 
Sua missão é vender as "${product || 'Sementes de Mega Sorgo Santa Elisa'}".
Siga rigorosamente a seguinte proporção comportamental e técnica:
- 20% EMPATIA: Compreenda as dores profundas do produtor rural (seca, custo alto da ração, frustração na colheita).
- 70% PERSUASÃO E BENEFÍCIOS: Foque no lucro, aumento leiteiro/corte e redução de custos. Use Autoridade e Prova Social com os números do produto.
- 10% URGÊNCIA ASSUMIDA: Apenas no final do texto ou do funil, seja direto e use de técnica de fechamento absoluto para forçar a decisão (sem arrogância, apenas confiança).

Você sabe sobre o produto: 
- Alta Produção: 130 a 140 toneladas/hectare/ano (até 100t na safra de out/nov), 5 metros de altura.
- Altíssima capacidade de rebrota, garantindo produção contínua.
- 200% mais volumoso que o milho! E a silagem tem cacho, sendo muito nutritiva (80% superior ao Capiaçu).
- Alta resistência à seca e às pragas do milho.\n`;

        let userPrompt = `DADOS DA OFERTA:\nProduto: ${product}\nCondição: ${price}\nPúblico-alvo: ${audience}\nVantagem/Dor Focada: ${pain}\nTom: ${tone}\n\n`;

        if (mode === 'funil') {
            systemPrompt += `CRIE UM FUNIL PARA WHATSAPP. Divida o JSON em 4 blocos (MENSAGEM 1 a MENSAGEM 4). Textos curtos, instigantes e conversacionais. Sem parecer um robô.\n`;
            if (funnelType === 'frio') userPrompt += `Lead Frio. Msg 1: Curiosidade absurda (Gatilho da Atenção). Msg 2: Bater na Dor e apresentar a solução (Certeza). Msg 3: Oferta Irrecusável (Lógica e Emoção). Msg 4: Ultimato/Escassez (Call to Action).`;
            else if (funnelType === 'quente') userPrompt += `Lead Quente. Msg 1: Reconexão amigável. Msg 2: Reforço da Autoridade do Mega Sorgo. Msg 3: Condição Especial com Prazo. Msg 4: Gatilho do Medo de Ficar de Fora (FOMO).`;
            else if (funnelType === 'sumido') userPrompt += `Lead Sumido. Msg 1: "Aconteceu alguma coisa?". Msg 2: Quebra de Padrão (notícia impactante do agro). Msg 3: Oportunidade Final. Msg 4: Fechamento assumido.`;
            else if (funnelType === 'caro') userPrompt += `Objeção "Tá Caro". Msg 1: Validar (Dale Carnegie - Empatia). Msg 2: Ancoragem Ridícula (Comparar lucro por hectare x custo da semente). Msg 3: Prova Incontestável. Msg 4: Chamada de Risco Zero.`;
        } else if (mode === 'legenda') {
            systemPrompt += `CRIE UMA LEGENDA DE ALTA CONVERSÃO PARA REDES SOCIAIS (Plataforma: ${socialNetwork || 'Instagram'}). Use Emojis do Agro. Formato AIDA ou PAS (Problema, Agitação, Solução). Insira hashtags relevantes no final.\n`;
            userPrompt += `Divida em: "HOOK (Título Curioso)", "CORPO (Retenção e Desejo)", "CALL TO ACTION (Direct ou Link na Bio)".`;
        } else if (mode === 'script') {
            systemPrompt += `CRIE UM ROTEIRO (SCRIPT) PROFISSIONAL. Formato: ${subMode || 'Geral'}. Use técnicas persuasivas de retenção.\n`;
            if (subMode === 'call') userPrompt += `SITUAÇÃO: Ligação de Vendas (Cold Call). Divida em: "INTRODUÇÃO/QUEBRA DE GELO", "QUALIFICAÇÃO (Perguntas de Dor)", "PROPOSTA DE VALOR", "COMBINADO (Próximo Passo)".`;
            else if (subMode === 'audio') userPrompt += `SITUAÇÃO: Script para Áudio de WhatsApp (Máx 90s). Divida em: "GANCHO INICIAL", "CONTEXTO RÁPIDO", "O GRANDE DIFERENCIAL", "CTA PARA RESPONDER".`;
            else if (subMode === 'direct') userPrompt += `SITUAÇÃO: Abordagem Direct/Messenger (Texto Curto). Divida em: "ABERTURA PERSONALIZADA", "A ISCA (Curiosidade)", "CONVITE PARA CONVERSA".`;
            else if (subMode === 'meeting') userPrompt += `SITUAÇÃO: Roteiro para Reunião Presencial/Consultiva. Divida em: "RAPPORT", "DEMONSTRAR NÚMEROS (Lógica)", "FECHAMENTO ASSUMIDO".`;
            else userPrompt += `Divida em: "SEGUNDOS INICIAIS (Prender)", "EXPLICAÇÃO LÓGICA", "PONTO DE EMOÇÃO", "FECHAMENTO".`;
        } else if (mode === 'copy') {
            systemPrompt += `Crie uma COPY DE VENDAS COMPLETA. Formato: ${subMode || 'Landing Page'}. Use forte storytelling agro.\n`;
            if (subMode === 'vsl') userPrompt += `FORMATO: VSL (Video Sales Letter). Divida em: "A GRANDE PROMESSA", "A HISTÓRIA DO PROBLEMA", "A REVELAÇÃO DA SOLUÇÃO", "A OFERTA IRRECUSÁVEL".`;
            else if (subMode === 'email') userPrompt += `FORMATO: E-mail Marketing de Alta Conversão. Divida em: "ASSUNTO IMPACTANTE", "GANCHO (Corpo do e-mail)", "AUTORIDADE", "LINK DE AÇÃO".`;
            else if (subMode === 'sms') userPrompt += `FORMATO: Mensagem Curta (SMS/Push). Divida em: "ALERTA/NOTIFICAÇÃO", "OPORTUNIDADE", "LINK CURTO".`;
            else userPrompt += `Divida nos títulos lógicos de uma Landing Page (Promessa, Benefícios, Depoimento Fictício Baseado em Fatos, Oferta).`;
        } else {
            systemPrompt += `Crie uma COPY DE VENDAS GERAL.\n`;
            userPrompt += `Divida em: "PROMESSA", "BENEFÍCIOS", "OFERTA".`;
        }

        userPrompt += `\n\nResponda ESTRITAMENTE num formato JSON contendo um array de objetos chamado "results". Cada objeto deve ter 'title' (o estágio) e 'content' (o texto da mensagem).
Exemplo Válido: {"results": [{"title": "MENSAGEM 1 - INTRODUÇÃO", "content": "Oi fulano..."}]}
NÃO RETORNE MARKDOWN FORA DO JSON. RETORNE SOMENTE O TEXTO JSON PURO!`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(systemPrompt + '\n' + userPrompt);
        const textOutput = result.response.text();
        
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("O formato retornado pela Inteligência Artificial foi inválido.");
        res.json(JSON.parse(jsonMatch[0]));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Erro interno no servidor' });
    }
});

// Serve index.html as a fallback for the root path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`CopyZap Server running on port ${port}`));
