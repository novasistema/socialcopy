import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Video, 
  Target, 
  Clock, 
  Palette, 
  Send, 
  Copy, 
  Check, 
  RefreshCw,
  Hash,
  MessageSquare,
  Zap,
  ChevronRight,
  Instagram,
  Linkedin,
  Youtube,
  Type as TypeIcon,
  Mic,
  FileText,
  History,
  Trash2,
  Layers,
  Share2,
  MoreVertical
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateVideoCopy, type VideoCopyRequest, type VideoCopyResponse } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PLATFORMS = [
  { id: 'TikTok', icon: Zap, color: 'text-[#000000]' },
  { id: 'Instagram Reels', icon: Instagram, color: 'text-[#E4405F]' },
  { id: 'YouTube Shorts', icon: Youtube, color: 'text-[#FF0000]' },
  { id: 'LinkedIn Video', icon: Linkedin, color: 'text-[#0A66C2]' },
] as const;

const TONES = ['Profesional', 'Casual', 'Enérgico', 'Inspirador', 'Sarcástico', 'Urgente'];
const DURATIONS = ['15s', '30s', '60s', '90s+'] as const;
const STYLES = ['Storytelling', 'Educativo', 'Promocional', 'Humorístico', 'Tendencia'] as const;

interface SavedCopy extends VideoCopyResponse {
  id: string;
  topic: string;
  timestamp: number;
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoCopyResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'post'>('script');
  const [history, setHistory] = useState<SavedCopy[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const [formData, setFormData] = useState<VideoCopyRequest>({
    topic: '',
    platform: 'TikTok',
    tone: 'Casual',
    targetAudience: '',
    duration: '30s',
    style: 'Storytelling'
  });

  useEffect(() => {
    const saved = localStorage.getItem('socialcopy_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (res: VideoCopyResponse) => {
    const newItem: SavedCopy = {
      ...res,
      id: Math.random().toString(36).substr(2, 9),
      topic: formData.topic,
      timestamp: Date.now()
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('socialcopy_history', JSON.stringify(updated));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.targetAudience) return;
    
    setLoading(true);
    try {
      const data = await generateVideoCopy(formData);
      setResult(data);
      saveToHistory(data);
    } catch (error) {
      console.error('Error generating copy:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('socialcopy_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('socialcopy_history');
  };

  const copyAll = () => {
    if (!result) return;
    const fullText = `GANCHO:\n${result.hook}\n\nTEXTO EN PANTALLA:\n${result.onScreenText.join('\n')}\n\nGUION:\n${result.body}\n\nCTA:\n${result.cta}`;
    copyToClipboard(fullText, 'all');
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-slate-200 shadow-sm z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center shadow-md shadow-sky-100">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight">SocialCopy AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-3 h-3" /> Idea del Video
                </label>
                <textarea
                  required
                  placeholder="¿De qué trata tu video?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm min-h-[100px] resize-none bg-slate-50/50"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-3 h-3" /> Audiencia
                </label>
                <input
                  required
                  type="text"
                  placeholder="¿A quién le hablas?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm bg-slate-50/50"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Tiempo
                  </label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm bg-slate-50/50"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value as any })}
                  >
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Estilo
                  </label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm bg-slate-50/50"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value as any })}
                  >
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plataforma</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, platform: p.id })}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-bold transition-all",
                        formData.platform === p.id 
                          ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      <p.icon className={cn("w-3.5 h-3.5", formData.platform === p.id ? "text-white" : p.color)} />
                      {p.id.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tono</label>
                <div className="flex flex-wrap gap-1.5">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, tone: t })}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all",
                        formData.tone === t
                          ? "bg-sky-100 border-sky-200 text-sky-700"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Generar Contenido
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {history.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-3 h-3" /> Recientes
                </h3>
                <button 
                  onClick={clearHistory}
                  className="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                >
                  Limpiar
                </button>
              </div>
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setResult(item)}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group relative"
                  >
                    <p className="text-xs font-bold text-slate-700 truncate pr-6">{item.topic}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                    <Trash2 
                      onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                      className="w-3 h-3 text-slate-300 hover:text-red-500 absolute right-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Editor de Guiones</span>
              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-600 text-[10px] font-bold uppercase tracking-wider">v2.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
              AI
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Tabs */}
                  <div className="flex items-center justify-between">
                    <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                      <button
                        onClick={() => setActiveTab('script')}
                        className={cn(
                          "px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                          activeTab === 'script' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        Guion del Video
                      </button>
                      <button
                        onClick={() => setActiveTab('post')}
                        className={cn(
                          "px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                          activeTab === 'post' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Post y Estrategia
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={copyAll}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                      >
                        {copiedField === 'all' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        Copiar Todo
                      </button>
                      <button 
                        onClick={() => setResult(null)}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Nuevo Proyecto
                      </button>
                    </div>
                  </div>

                  {activeTab === 'script' ? (
                    <div className="grid gap-6">
                      {/* Hook Section */}
                      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative group">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-sky-50 rounded-2xl flex items-center justify-center">
                              <Zap className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">El Gancho Viral</h4>
                              <p className="text-[10px] text-slate-400">Primeros 3 segundos críticos</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(result.hook, 'hook')}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            {copiedField === 'hook' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          </button>
                        </div>
                        <p className="text-xl font-display font-medium text-slate-900 leading-relaxed italic border-l-4 border-sky-500 pl-6 py-2">
                          "{result.hook}"
                        </p>
                      </div>

                      {/* On Screen Text Section */}
                      <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          <Layers className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                              <TypeIcon className="w-5 h-5 text-sky-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">Texto en Pantalla</h4>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Visual Overlays</p>
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {result.onScreenText.map((text, idx) => (
                              <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all">
                                <span className="text-[10px] font-mono text-sky-400 font-bold">0{idx + 1}</span>
                                <p className="text-sm font-bold text-white tracking-tight">{text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Body Section */}
                      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
                              <Mic className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">Desarrollo del Guion</h4>
                              <p className="text-[10px] text-slate-400">Contenido hablado paso a paso</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(result.body, 'body')}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            {copiedField === 'body' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          </button>
                        </div>
                        <div className="prose prose-slate max-w-none">
                          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base font-medium">
                            {result.body}
                          </p>
                        </div>
                      </div>

                      {/* CTA Section */}
                      <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 shadow-sm relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                              <ChevronRight className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h4 className="text-sm font-bold text-emerald-900">Llamada a la Acción</h4>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(result.cta, 'cta')}
                            className="p-2.5 bg-white hover:bg-emerald-100 rounded-xl transition-all shadow-sm"
                          >
                            {copiedField === 'cta' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-emerald-400" />}
                          </button>
                        </div>
                        <p className="text-lg font-bold text-emerald-900">
                          {result.cta}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-8">
                      {/* Post Caption */}
                      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-slate-900">Copy para el Post</h4>
                              <p className="text-xs text-slate-400">Optimizado para {formData.platform}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(result.description, 'desc')}
                            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                          >
                            {copiedField === 'desc' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                          </button>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-lg text-slate-700 leading-relaxed font-medium">
                            {result.description}
                          </p>
                        </div>
                      </div>

                      {/* Hashtags */}
                      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center">
                              <Hash className="w-6 h-6 text-sky-600" />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-slate-900">Hashtags Estratégicos</h4>
                              <p className="text-xs text-slate-400">Para maximizar el alcance algorítmico</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(result.hashtags.join(' '), 'tags')}
                            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                          >
                            {copiedField === 'tags' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {result.hashtags.map(tag => (
                            <span key={tag} className="text-sm font-bold text-sky-600 bg-sky-50 px-5 py-3 rounded-2xl border border-sky-100 hover:bg-sky-600 hover:text-white transition-all cursor-default">
                              #{tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl border border-slate-100 flex items-center justify-center relative z-10">
                      <MessageSquare className="w-10 h-10 text-slate-300" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-sky-500 rounded-2xl shadow-lg flex items-center justify-center z-20 animate-bounce">
                      <Sparkles className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="max-w-md space-y-4">
                    <h3 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Tu estudio creativo personal</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      Configura los parámetros en el panel izquierdo y genera guiones de alto impacto en segundos.
                    </p>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-6 w-full max-w-2xl pt-8">
                    {[
                      { icon: Zap, label: "Ganchos Virales", desc: "Retención máxima", color: "text-amber-500" },
                      { icon: TypeIcon, label: "Overlays", desc: "Texto visual", color: "text-sky-500" },
                      { icon: Target, label: "Segmentado", desc: "Audiencia real", color: "text-emerald-500" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2">
                        <item.icon className={cn("w-6 h-6 mx-auto", item.color)} />
                        <p className="text-xs font-bold text-slate-900">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Menu Overlay (Simplified for now) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center"
        >
          <History className="w-6 h-6" />
        </button>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
