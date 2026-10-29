import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Send,
  User,
  Loader2,
  Trash2,
  Copy,
  Check,
  Bot,
  BrainCircuit,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = [
  "Today's business summary",
  'Who has the highest pending amount?',
  'Who is overdue?',
  'Top 5 debtors',
  'Who crossed credit limit?',
  'Inactive customers',
  'Business health snapshot',
];

const WELCOME = {
  role: 'assistant',
  content:
    'Hi! I can answer questions from your live khata records — collections, overdue customers, credit limits, top debtors, and business health. What do you want to check?',
};

const STAT_CARDS = [
  { label: 'Live Records', value: 'Owner-scoped', tag: 'MongoDB', accent: 'blue' },
  { label: 'Grounded AI', value: 'No guesswork', tag: 'Verified', accent: 'green' },
  { label: 'Response Mode', value: 'Fast & clear', tag: 'Secure', accent: 'violet' },
];

const SIDEBAR_STATS = [
  { label: 'Collections', value: '₹8.4L', trend: '+12.4%' },
  { label: 'Overdue', value: '₹2.1L', trend: '-6.2%' },
  { label: 'Risk', value: 'Moderate', trend: '3 flags' },
];

const mdComponents = {
  table: (p) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full text-xs border-collapse" {...p} />
    </div>
  ),
  th: (p) => <th className="text-left font-semibold px-2 py-1.5 border-b border-slate-200 bg-slate-50" {...p} />,
  td: (p) => <td className="px-2 py-1.5 border-b border-slate-100" {...p} />,
  ul: (p) => <ul className="list-disc pl-5 space-y-1 my-2" {...p} />,
  ol: (p) => <ol className="list-decimal pl-5 space-y-1 my-2" {...p} />,
  p: (p) => <p className="my-1.5 leading-relaxed" {...p} />,
  h1: (p) => <h3 className="text-base font-bold mt-3 mb-1" {...p} />,
  h2: (p) => <h3 className="text-base font-bold mt-3 mb-1" {...p} />,
  h3: (p) => <h4 className="text-sm font-bold mt-2 mb-1" {...p} />,
  blockquote: (p) => (
    <blockquote className="border-l-4 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-r-xl pl-3 pr-2 py-2 my-2 whitespace-pre-wrap" {...p} />
  ),
  a: (p) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...p} />,
};

/**
 * AI Business Assistant chat (route: /ai-insights)
 * Premium, grounded assistant experience with local chat state only.
 */
export default function AiAssistantPage() {
  const { showToast } = useAuth();
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const copyMessage = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      showToast('Response copied to clipboard.', 'success', 'Copied');
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch (error) {
      showToast('Unable to copy response.', 'error', 'Copy failed');
    }
  };

  const send = useCallback(
    async (text) => {
      const question = (text ?? input).trim();
      if (!question || loading) return;

      const history = messages
        .filter((m) => m !== WELCOME && !m.error)
        .map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, { role: 'user', content: question }]);
      setInput('');
      setLoading(true);
      try {
        const res = await aiService.chat(question, history);
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data.answer }]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: err.message || 'Something went wrong. Please try again.', error: true },
        ]);
        showToast(err.message, 'error', 'Assistant unavailable');
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, showToast]
  );

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-12rem)] overflow-hidden px-3 py-4 sm:px-4 lg:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.22),transparent_20%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.20),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 grid gap-3 md:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-[28px] border border-slate-800/60 bg-slate-950 p-4 text-white shadow-[0_30px_80px_-35px_rgba(2,6,23,0.9)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#8b5cf6)] shadow-[0_18px_32px_-18px_rgba(37,99,235,0.9)]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Finance OS</p>
                  <h3 className="text-lg font-semibold tracking-tight">Credit AI</h3>
                </div>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                Live
              </div>
            </div>

            <div className="space-y-3">
              {SIDEBAR_STATS.map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    <span>{item.label}</span>
                    <span className={index === 2 ? 'text-amber-300' : 'text-emerald-300'}>{item.trend}</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-violet-500/20 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(59,130,246,0.08))] p-3">
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-violet-200">
                <Sparkles className="h-3.5 w-3.5" />
                Analyst mode
              </div>
              <p className="text-sm leading-relaxed text-slate-200">
                Answers grounded in customers, transactions, limits, and overdue trends — never generic guesses.
              </p>
            </div>
          </aside>

          <main className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/85 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.95),rgba(51,65,85,0.92))] px-5 py-4 text-white sm:px-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-300">Risk intelligence</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">Ask your business</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMessages([WELCOME])}
                  disabled={loading || messages.length === 1}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>
            </div>

            <div className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-4">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-3 sm:p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <BrainCircuit className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Assistant</div>
                        <div className="text-sm font-semibold text-slate-800">Business analyst</div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      online
                    </div>
                  </div>

                  <div className="space-y-3">
                    {messages.map((m, i) => {
                      const isUser = m.role === 'user';

                      return (
                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          {!isUser && (
                            <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                              <Bot className="h-4 w-4" />
                            </div>
                          )}

                          <div
                            className={`max-w-[90%] rounded-[22px] px-4 py-3 text-sm shadow-[0_18px_30px_-24px_rgba(15,23,42,0.45)] ${
                              isUser
                                ? 'bg-[linear-gradient(135deg,#0f172a,#1e293b)] text-white'
                                : m.error
                                ? 'border border-rose-200 bg-rose-50 text-rose-700'
                                : 'border border-slate-200 bg-white text-slate-800'
                            }`}
                          >
                            {isUser ? (
                              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                            ) : (
                              <div className="space-y-2">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                  {m.content}
                                </ReactMarkdown>

                                {!m.error && (
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => copyMessage(m.content, i)}
                                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                                    >
                                      {copiedIndex === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                      {copiedIndex === i ? 'Copied' : 'Copy'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {isUser && (
                            <div className="ml-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {loading && (
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                        <span>Scanning your ledger and customer health…</span>
                      </div>
                    )}

                    <div ref={endRef} />
                  </div>
                </div>

                {messages.length === 1 && (
                  <div className="rounded-[22px] border border-slate-200 bg-white p-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Quick prompts</div>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {STAT_CARDS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 shadow-[0_18px_30px_-28px_rgba(15,23,42,0.4)]"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</span>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[9px] font-bold tracking-[0.14em] uppercase ${
                          item.accent === 'blue'
                            ? 'bg-blue-50 text-blue-700'
                            : item.accent === 'green'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-violet-50 text-violet-700'
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-lg font-semibold tracking-tight text-slate-900">{item.value}</p>
                  </div>
                ))}

                <div className="rounded-[22px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-4 text-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.8)]">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Secure answers
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">
                    Only your company data is used to answer questions and identify risk signals.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6">
              <div className="mx-auto flex max-w-4xl items-end gap-2">
                <div className="relative flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    maxLength={500}
                    placeholder="Ask about overdue customers, collections, debtors, or business health…"
                    className="max-h-32 min-h-[56px] w-full resize-none rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.5)] ring-1 ring-slate-200">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b5cf6,#2563eb)] text-white shadow-[0_20px_30px_-18px_rgba(99,102,241,0.9)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>

              <div className="mt-2 flex flex-col gap-1 text-[10px] font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Grounded to your credit data
                </div>
                <div className="inline-flex items-center gap-1.5 text-slate-400">
                  Enter to send
                  <span className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[9px] text-slate-500">↵</span>
                  <span className="mx-1">•</span>
                  Shift + Enter for new line
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
