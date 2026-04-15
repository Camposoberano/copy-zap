"use client";

import { useState, useEffect } from 'react';
import { CardButton } from '@/components/ui/CardButton';
import { Chip } from '@/components/ui/Chip';
import { CopyResult } from '@/components/ui/CopyResult';
import { Sparkles, MessageCircle, Camera, Target, ScrollText, AlertCircle, RefreshCw, Sprout, TrendingUp, Zap, Radio, Phone, Users, Mail, Play, Smartphone, FileText } from 'lucide-react';

const FUNNEL_TYPES = [
  { id: 'frio', icon: '❄️', title: 'Lead Frio', desc: 'Nunca te conheceu. Abordagem suave de 4 msgs' },
  { id: 'quente', icon: '🔥', title: 'Lead Quente', desc: 'Já demonstrou interesse. Foco em fechar' },
  { id: 'sumido', icon: '👻', title: 'Lead Sumido', desc: 'Conversou, interessou mas desapareceu' },
  { id: 'caro', icon: '💸', title: 'Disse que tá caro', desc: 'Funil específico pra objeção de preço' }
];

const COPY_TYPES = [
  { id: 'lp', icon: <FileText size={20} />, label: 'Landing Page Completa' },
  { id: 'vsl', icon: <Play size={20} />, label: 'VSL (Vídeo de Vendas)' },
  { id: 'email', icon: <Mail size={20} />, label: 'E-mail Marketing' },
  { id: 'sms', icon: <Smartphone size={20} />, label: 'SMS / WhatsApp Curto' }
];

const SCRIPT_TYPES = [
  { id: 'call', icon: <Phone size={20} />, label: 'Ligação Fria (Cold Call)' },
  { id: 'audio', icon: <Radio size={20} />, label: 'Script áudio WhatsApp' },
  { id: 'direct', icon: <MessageCircle size={20} />, label: 'Abordagem Direct' },
  { id: 'meeting', icon: <Users size={20} />, label: 'Reunião Consultiva' }
];

const PREDEFINED_PRODUCTS = [
  { icon: '🌱', label: 'Sementes de Mega Sorgo Santa Elisa' },
  { icon: '🌾', label: 'Sementes de Sorgo p/ Silagem' }
];

const PREDEFINED_AUDIENCES = [
  { icon: '🐄', label: 'Pecuarista de Gado de Leite' },
  { icon: '🥩', label: 'Pecuarista de Gado de Corte' },
  { icon: '🚜', label: 'Produtor de Silagem' },
  { icon: '🌾', label: 'Zona Rural / Agro' }
];

const PREDEFINED_PAINS = [
  { icon: '📈', label: 'Alta Produtividade (+140 ton/ha/ano e 5m altura)' },
  { icon: '🔄', label: 'Rebrota Vigorosa (Produção permanente)' },
  { icon: '🛡️', label: 'Alta Resistência (Seca e Pragas do Milho)' },
  { icon: '🌽', label: 'Substituto do Milho (Produz 200% mais)' },
  { icon: '🌿', label: 'Superior ao Capiaçu (Qualidade 80% maior)' }
];

const TONES = [
  { icon: '⚡', label: 'Direto e Comercial' },
  { icon: '🤩', label: 'Amigável e Simples' },
  { icon: '💎', label: 'Autoridade Agro' },
  { icon: '🤝', label: 'Empático (Focado na dor)' }
];

const SOCIAL_NETWORKS = [
  { icon: '📸', label: 'Instagram' },
  { icon: '📘', label: 'Facebook' },
  { icon: '▶️', label: 'YouTube Shorts' },
  { icon: '📺', label: 'YouTube Vídeo Longo' }
];

export default function CopyZapHome() {
  const [credits, setCredits] = useState<number | null>(null);
  const [mode, setMode] = useState('funil');
  const [subMode, setSubMode] = useState('');
  const [funnelType, setFunnelType] = useState('frio');
  const [socialNetwork, setSocialNetwork] = useState('Instagram');
  
  const [product, setProduct] = useState('Sementes de Mega Sorgo Santa Elisa');
  const [price, setPrice] = useState('');
  const [audience, setAudience] = useState('');
  const [pain, setPain] = useState('');
  const [tone, setTone] = useState('Autoridade Agro');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{title: string, content: string}[] | null>(null);
  const [error, setError] = useState('');

  // Carregar créditos no load
  useEffect(() => {
    const savedCredits = localStorage.getItem('copyzap_credits');
    if (savedCredits) {
      setCredits(parseInt(savedCredits, 10));
    } else {
      setCredits(10);
      localStorage.setItem('copyzap_credits', '10');
    }
  }, []);

  const handleGenerate = async () => {
    if (credits !== null && credits <= 0) return;
    if (!product || !audience || !pain) {
      setError("Preencha ao menos Produto, Público e Dor/Vantagem.");
      return;
    }
    
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, subMode, funnelType, socialNetwork, product, price, audience, pain, tone })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao gerar sua copy. Tente novamente.');
      }

      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error(data.message || 'Erro: A IA não retornou o formato de resultados esperado.');
      }

      setResults(data.results);
      
      const newCredits = (credits || 10) - 1;
      setCredits(newCredits);
      localStorage.setItem('copyzap_credits', newCredits.toString());

    } catch (err: unknown) {
      setError((err as Error).message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!results) return;
    const text = results.map(r => `*${r.title}*\n${r.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const resetCredits = () => {
    setCredits(10);
    localStorage.setItem('copyzap_credits', '10');
    alert("🚀 Seus 10 créditos foram restaurados com sucesso!");
  };

  // Paywall View
  if (credits !== null && credits <= 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
        <div className="text-8xl mb-6 drop-shadow-2xl">🚜</div>
        <h1 className="text-4xl font-bold mb-4 text-white">Sua colheita acabou!</h1>
        <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
          Para continuar gerando copys que vendem de verdade no campo, desbloqueie seu acesso completo.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a 
            href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20desbloquear%20o%20CopyZap%20%F0%9F%94%A5" 
            target="_blank" 
            rel="noreferrer"
            className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <Zap size={20} /> Pack 100 Cópias
          </a>
          <button 
            onClick={resetCredits}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors py-2"
          >
            Tenho uma licença (Beta)
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-10 pb-32">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-orange flex items-center justify-center shadow-xl shadow-brand-orange/20 rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <Sprout className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Copyzap<span className="text-brand-orange">.AI</span>
              <Sparkles className="text-brand-orange animate-pulse" size={20} />
            </h1>
            <p className="text-gray-500 text-sm font-semibold tracking-wider uppercase">Marketing para o Campo</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10 pr-4">
          <div className="bg-gradient-orange px-4 py-2 rounded-xl text-white font-bold text-sm shadow-inner shadow-white/20">
            {credits ?? 10} CRÉDITOS
          </div>
          <div className="flex flex-col gap-1 w-24">
             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-orange transition-all duration-1000 ease-out" 
                  style={{ width: `${((credits ?? 10) / 10) * 100}%` }}
                />
             </div>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Bateria de IA</p>
          </div>
          <button onClick={resetCredits} className="p-2 text-white/20 hover:text-brand-orange transition-colors" title="Resetar (Admin)">
            <RefreshCw size={14} />
          </button>
        </div>
      </header>

      {/* Main Modes Grid */}
      <section className="mb-14">
        <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-6 uppercase flex items-center gap-3">
          <span className="w-10 h-[2px] bg-brand-orange/30 rounded-full"></span>
          Ferramentas de Vendas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardButton 
            icon={<MessageCircle className="text-brand-orange" size={32} />} 
            title="Funil Whats" 
            subtitle="4 mensagens"
            selected={mode === 'funil'}
            onClick={() => { setMode('funil'); setSubMode('frio'); }}
          />
          <CardButton 
            icon={<Camera className="text-brand-orange" size={32} />} 
            title="Legenda Insta" 
            subtitle="Legendas AIDA"
            selected={mode === 'legenda'}
            onClick={() => { setMode('legenda'); setSubMode(''); }}
          />
          <CardButton 
            icon={<TrendingUp className="text-brand-orange" size={32} />} 
            title="Página / Copy" 
            subtitle="Copys Longas"
            selected={mode === 'copy'}
            onClick={() => { setMode('copy'); setSubMode('lp'); }}
          />
          <CardButton 
            icon={<ScrollText className="text-brand-orange" size={32} />} 
            title="Scripts Venda" 
            subtitle="Vídeo e Áudio"
            selected={mode === 'script'}
            onClick={() => { setMode('script'); setSubMode('audio'); }}
          />
        </div>
      </section>

      {/* Sub Modes Rendering */}
      <div className="min-h-[140px]">
        {mode === 'funil' && (
          <section className="mb-10 animate-in slide-in-from-left duration-300">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-4 uppercase">Estado do Pecuarista</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FUNNEL_TYPES.map(ft => (
                <CardButton
                  key={ft.id}
                  icon={ft.icon}
                  title={ft.title}
                  subtitle={ft.desc}
                  compact
                  selected={funnelType === ft.id}
                  onClick={() => setFunnelType(ft.id)}
                />
              ))}
            </div>
          </section>
        )}

        {mode === 'legenda' && (
          <section className="mb-10 animate-in slide-in-from-left duration-300">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-4 uppercase">Qual plataforma?</h2>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_NETWORKS.map(sn => (
                <Chip 
                  key={sn.label} 
                  icon={sn.icon} 
                  label={sn.label} 
                  selected={socialNetwork === sn.label}
                  onClick={() => setSocialNetwork(sn.label)} 
                />
              ))}
            </div>
          </section>
        )}

        {mode === 'copy' && (
          <section className="mb-10 animate-in slide-in-from-left duration-300">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-4 uppercase">Qual tipo de material?</h2>
            <div className="flex flex-wrap gap-3">
              {COPY_TYPES.map(ct => (
                <Chip 
                  key={ct.id} 
                  icon={ct.icon} 
                  label={ct.label} 
                  selected={subMode === ct.id}
                  onClick={() => setSubMode(ct.id)} 
                />
              ))}
            </div>
          </section>
        )}

        {mode === 'script' && (
          <section className="mb-10 animate-in slide-in-from-left duration-300">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-4 uppercase">Qual tipo de roteiro?</h2>
            <div className="flex flex-wrap gap-3">
              {SCRIPT_TYPES.map(st => (
                <Chip 
                  key={st.id} 
                  icon={st.icon} 
                  label={st.label} 
                  selected={subMode === st.id}
                  onClick={() => setSubMode(st.id)} 
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Context Form */}
      <section className="glass-card rounded-3xl p-6 md:p-10 border-white/5 mb-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Target size={18} className="text-brand-orange" />
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Contexto da Oferta</h2>
        </div>
        
        <div className="space-y-8">
            {/* Product */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 pr-2">O que você está vendendo hoje?</label>
              <input 
                type="text" 
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Ex: Sementes de Mega Sorgo"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/30 transition-all text-lg font-medium"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {PREDEFINED_PRODUCTS.map(p => (
                  <Chip key={p.label} icon={p.icon} label={p.label} onClick={() => setProduct(p.label)} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Audience */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quem vai comprar?</label>
                  <input 
                    type="text" 
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Ex: Pecuarista de Leite"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 outline-none focus:border-brand-orange/30 transition-all font-medium"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {PREDEFINED_AUDIENCES.map(a => (
                      <Chip key={a.label} icon={a.icon} label={a.label} selected={audience === a.label} onClick={() => setAudience(a.label)} />
                    ))}
                  </div>
                </div>

                {/* Pain Point */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Principal Diferencial / Dor</label>
                  <input 
                    type="text" 
                    value={pain}
                    onChange={(e) => setPain(e.target.value)}
                    placeholder="Ex: Alta rebrota e resistência"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 outline-none focus:border-brand-orange/30 transition-all font-medium"
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {PREDEFINED_PAINS.map(p => (
                      <Chip key={p.label} icon={p.icon} label={p.label} selected={pain === p.label} onClick={() => setPain(p.label)} />
                    ))}
                  </div>
                </div>
            </div>

            {/* Price & Tone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                 <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Preço / Oferta</label>
                    <input 
                        type="text" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ex: R$ 85,00 o saco ou 12x"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 outline-none focus:border-brand-orange/30 transition-all font-medium"
                    />
                </div>
                <div>
                   <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Tom de Voz</label>
                   <div className="flex flex-wrap gap-2">
                        {TONES.map(t => (
                        <Chip 
                            key={t.label} 
                            icon={t.icon} 
                            label={t.label} 
                            selected={tone === t.label}
                            onClick={() => setTone(t.label)} 
                        />
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Error Output */}
      {error && (
        <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 animate-in shake-in duration-300">
          <AlertCircle size={24} />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Action Button */}
      <button 
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full py-6 px-10 rounded-3xl font-extrabold text-xl text-white transition-all shadow-2xl flex items-center justify-center gap-4 group
          ${loading ? 'bg-gray-800 cursor-not-allowed border border-white/10' : 'bg-gradient-orange hover:shadow-brand-orange/30 hover:scale-[1.01] active:scale-95'}
        `}
      >
        {loading ? (
          <><RefreshCw className="animate-spin" size={24} /> <span className="animate-pulse">Plantando ideias e gerando Lucro...</span></>
        ) : (
          <><Sparkles className="group-hover:rotate-12 transition-transform" size={24} /> GERAR TEXTO AGORA</>
        )}
      </button>

      {/* Results Section */}
      {results && results.length > 0 && (
        <section className="mt-20 scroll-mt-10 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-700" id="results">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                   📋 Colheita Concluída!
                </h2>
                <p className="text-gray-500 text-sm font-medium mt-1">Copie o conteúdo abaixo e use nas suas vendas.</p>
            </div>
            <button 
              onClick={copyAll}
              className="text-sm bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange border border-brand-orange/20 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <ScrollText size={18} /> Copiar Tudo
            </button>
          </div>
          <div className="space-y-6">
            {results.map((res, i) => (
              <CopyResult key={i} title={res.title} content={res.content} />
            ))}
          </div>
          
          <div className="mt-12 p-8 border-2 border-dashed border-white/5 rounded-3xl text-center">
             <p className="text-gray-500 font-medium mb-4">Gostou desse resultado? Experimente mudar o Tom de Voz para variar as abordagens.</p>
             <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-brand-orange font-bold hover:underline">Subir para o topo ↑</button>
          </div>
        </section>
      )}
      
      {/* Footer Branding */}
      <footer className="mt-20 text-center pb-10">
         <div className="flex items-center justify-center gap-2 text-gray-600 font-bold tracking-widest text-[10px] uppercase mb-4">
            <div className="w-4 h-[1px] bg-gray-800"></div>
            Powered by Agro Intelligence
            <div className="w-4 h-[1px] bg-gray-800"></div>
         </div>
      </footer>
    </main>
  );
}
