import { useState } from 'react';
import {
  Copy,
  CheckCircle2,
  HandCoins,
  Heart,
  ShieldCheck,
  ChevronDown,
  Phone,
  MessageSquare,
  ArrowRight,
  Banknote,
  Sparkles,
  Users,
  Globe,
  Church,
  Lock,
} from 'lucide-react';

/* ─────────────────────────────────────── Types */
type GivingType = 'tithe' | 'offering' | 'building' | 'missions' | 'other';

/* ─────────────────────────────────────── Data */
const GIVING_TYPES: {
  id: GivingType;
  label: string;
  verse: string;
  color: string;
  glow: string;
  icon: React.ElementType;
}[] = [
  { id: 'tithe',    label: 'Tithes',       verse: 'Mal 3:10',   color: 'from-primary to-primary-light',          glow: 'shadow-primary/40',         icon: HandCoins },
  { id: 'offering', label: 'Offerings',    verse: '2 Cor 9:7',  color: 'from-rose-500 to-rose-400',              glow: 'shadow-rose-400/40',        icon: Heart },
  { id: 'building', label: 'Building',     verse: 'Hag 1:8',    color: 'from-emerald-600 to-emerald-400',        glow: 'shadow-emerald-500/40',     icon: Church },
  { id: 'missions', label: 'Missions',     verse: 'Matt 28:19', color: 'from-violet-600 to-violet-400',          glow: 'shadow-violet-500/40',      icon: Globe },
  { id: 'other',    label: 'Other',        verse: 'Phil 4:17',  color: 'from-secondary-dark to-secondary',      glow: 'shadow-secondary/40',       icon: Sparkles },
];

const MOMO_OPTIONS = [
  {
    provider: 'MTN' as const,
    tagline: 'MTN Mobile Money',
    number: '677 000 000',
    name: 'Latter Rain Tabernacle',
    accent: '#FFCB00',
    textCls: 'text-amber-700',
    bgCls: 'bg-amber-50',
    badgeCls: 'bg-amber-400',
    borderCls: 'border-amber-300',
    ringCls: 'ring-amber-300',
    btnCls: 'bg-amber-400 hover:bg-amber-300 text-slate-900',
    logo: 'M',
    steps: [
      { action: 'Dial', detail: '*126#' },
      { action: 'Select', detail: '"Transfer Money"' },
      { action: 'Enter number', detail: '677 000 000' },
      { action: 'Enter amount', detail: 'Your giving amount' },
      { action: 'Confirm PIN', detail: 'Your MoMo PIN' },
      { action: 'Screenshot', detail: 'Your confirmation SMS' },
    ],
  },
  {
    provider: 'Orange' as const,
    tagline: 'Orange Money',
    number: '699 000 000',
    name: 'Latter Rain Tabernacle',
    accent: '#FF6B00',
    textCls: 'text-orange-700',
    bgCls: 'bg-orange-50',
    badgeCls: 'bg-orange-500',
    borderCls: 'border-orange-300',
    ringCls: 'ring-orange-300',
    btnCls: 'bg-orange-500 hover:bg-orange-400 text-white',
    logo: 'O',
    steps: [
      { action: 'Dial', detail: '#150*50#' },
      { action: 'Select', detail: '"Send Money"' },
      { action: 'Enter number', detail: '699 000 000' },
      { action: 'Enter amount', detail: 'Your giving amount' },
      { action: 'Confirm PIN', detail: 'Your Orange PIN' },
      { action: 'Screenshot', detail: 'Your confirmation SMS' },
    ],
  },
];

const IMPACT = [
  { icon: Users,    value: '500+', label: 'Families Reached',   gradient: 'from-primary to-primary-light' },
  { icon: Globe,    value: '5+',   label: 'Nations Touched',    gradient: 'from-violet-600 to-violet-400' },
  { icon: Church,   value: '15+',  label: 'Years of Ministry',  gradient: 'from-emerald-600 to-emerald-400' },
  { icon: Heart,    value: '80+',  label: 'Outreach Events',    gradient: 'from-rose-500 to-rose-400' },
];

const FAQS = [
  { q: 'Is my giving secure?',             a: 'Yes. All transactions go through MTN Mobile Money and Orange Money — both are regulated, trusted platforms in Cameroon.' },
  { q: 'Can I give anonymously?',           a: 'Absolutely. Simply send the funds without notifying us. God sees every seed sown.' },
  { q: 'Is there a minimum giving amount?', a: 'There is no minimum. God honours every seed, no matter the size. Give what is on your heart.' },
  { q: 'How do I get a giving receipt?',    a: 'Your mobile network will send you an SMS receipt immediately. Screenshot it and share with our finance team if needed.' },
  { q: 'What is the Building Fund for?',   a: 'The Building Fund goes directly toward expanding our facility to accommodate our growing congregation and ministry programs.' },
];

/* ─────────────────────────────────────── Component */
export default function GivePage() {
  const [selectedType, setSelectedType] = useState<GivingType>('tithe');
  const [activeProvider, setActiveProvider] = useState<0 | 1>(0);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const momo = MOMO_OPTIONS[activeProvider];
  const givingLabel = GIVING_TYPES.find(g => g.id === selectedType)?.label ?? 'Giving';

  const handleCopy = () => {
    navigator.clipboard.writeText(momo.number.replace(/\s/g, '')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">

      {/* ═══════════════════════════════ HERO */}
      <section className="relative bg-slate-900 pt-32 pb-28 overflow-hidden">
        {/* layered gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary opacity-20 blur-[120px]" />
          <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-secondary opacity-15 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>

        {/* grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full border border-secondary/30 bg-secondary/10 backdrop-blur-md">
            <HandCoins className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Give Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-tight mb-6">
            Sow Into the{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light via-secondary to-secondary-dark">
                Kingdom
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-secondary-light to-secondary-dark rounded-full opacity-60" />
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Every seed you plant is an act of worship. Partner with Latter Rain Tabernacle
            and help us reach more lives for Christ.
          </p>

          {/* quick hero stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[['500+', 'Families Reached'], ['15+', 'Years of Ministry'], ['5+', 'Nations']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-heading font-extrabold text-secondary">{v}</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* scroll cue */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary-light" />

      <div className="container mx-auto px-4 py-20 space-y-28">

        {/* ═══════════════════════════════ SCRIPTURE */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative z-10 text-center px-8 py-16 md:px-20 md:py-20">
            <p className="text-3xl md:text-4xl font-heading font-bold text-white leading-relaxed mb-5 italic">
              "Give, and it will be given to you — a good measure, pressed down,
              shaken together and running over…"
            </p>
            <span className="inline-flex items-center gap-2 text-secondary font-bold tracking-widest text-sm uppercase">
              <span className="w-8 h-px bg-secondary inline-block" />
              Luke 6:38
              <span className="w-8 h-px bg-secondary inline-block" />
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════ STEP 1 — GIVING TYPE */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Step 1 of 2
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-800 mb-4">
              What Are You Giving Toward?
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-lg">
              Choose a category that reflects your heart of giving.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {GIVING_TYPES.map(({ id, label, verse, color, glow, icon: Icon }) => {
              const active = selectedType === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedType(id)}
                  className={`relative group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                    active
                      ? `border-transparent bg-gradient-to-br ${color} text-white shadow-xl ${glow}`
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    active ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'
                  }`}>
                    <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">{label}</p>
                    <p className={`text-xs mt-0.5 ${active ? 'text-white/70' : 'text-slate-400'}`}>{verse}</p>
                  </div>
                  {active && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════ STEP 2 — MOBILE MONEY */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Step 2 of 2
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-800 mb-4">
              Send Your Giving
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-lg">
              Choose your mobile money provider and follow the simple steps below.
            </p>
          </div>

          {/* Provider toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl gap-1">
              {MOMO_OPTIONS.map((opt, idx) => (
                <button
                  key={opt.provider}
                  onClick={() => { setActiveProvider(idx as 0 | 1); setCopied(false); }}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeProvider === idx
                      ? `bg-white shadow-md ${opt.textCls} ring-2 ${opt.ringCls}`
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white ${opt.badgeCls}`}
                  >
                    {opt.logo}
                  </span>
                  {opt.tagline}
                </button>
              ))}
            </div>
          </div>

          {/* Main MoMo card */}
          <div className={`rounded-3xl border-2 ${momo.borderCls} overflow-hidden transition-all duration-500`}>
            {/* header stripe */}
            <div
              className="px-8 py-5 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${momo.accent}22, ${momo.accent}44)` }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white ${momo.badgeCls}`}>
                  {momo.logo}
                </span>
                <div>
                  <p className={`font-heading font-extrabold text-lg ${momo.textCls}`}>{momo.tagline}</p>
                  <p className="text-slate-500 text-xs">Instant · Secure · Trusted</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                Secure
              </div>
            </div>

            <div className="bg-white p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-10">

                {/* LEFT — Account details */}
                <div className="space-y-6">
                  {/* Phone number display */}
                  <div className={`${momo.bgCls} rounded-2xl p-6 border ${momo.borderCls}`}>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Account Number</p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-3xl md:text-4xl font-heading font-extrabold text-slate-800 tracking-widest">
                        {momo.number}
                      </span>
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex-shrink-0 ${
                          copied
                            ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300'
                            : `${momo.btnCls} shadow-md hover:shadow-lg`
                        }`}
                      >
                        {copied ? (
                          <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                        ) : (
                          <><Copy className="w-4 h-4" /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Meta info cards */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Name</p>
                        <p className="font-bold text-slate-800 truncate">{momo.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Reference / Note</p>
                        <p className="font-bold text-slate-800">{givingLabel} – LRT</p>
                      </div>
                    </div>
                  </div>

                  {/* Security note */}
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-800 leading-relaxed">
                      <strong>Secure & private.</strong> Your transaction is handled end-to-end by{' '}
                      {momo.tagline}. You'll receive an SMS confirmation immediately.
                    </p>
                  </div>
                </div>

                {/* RIGHT — Steps */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                    How to Send via {momo.tagline}
                  </p>
                  <div className="space-y-3">
                    {momo.steps.map((step, idx) => (
                      <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                        idx === 0 ? `${momo.bgCls} border ${momo.borderCls}` : 'bg-slate-50 border border-slate-100'
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                          idx === 0 ? `${momo.badgeCls} text-white` : 'bg-slate-200 text-slate-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{step.action}</p>
                          <p className="font-semibold text-slate-800">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ IMPACT */}
        <section className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-slate-900" />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full opacity-10 blur-3xl pointer-events-none" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-3">
                Your Giving Changes Lives
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Every seed you sow powers the mission of Latter Rain Tabernacle.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {IMPACT.map(({ icon: Icon, value, label, gradient }) => (
                <div key={label} className="text-center group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-4xl font-heading font-extrabold text-white mb-1">{value}</p>
                  <p className="text-slate-400 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ AFTER GIVING + OTHER WAYS */}
        <section className="grid md:grid-cols-2 gap-10">

          {/* After giving */}
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 mb-2">
              After You Give
            </h2>
            <p className="text-slate-500 mb-7">Three simple things to do once your seed is sown.</p>
            <div className="space-y-4">
              {[
                { num: '01', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', title: 'Save Your SMS Receipt', body: 'Your network sends an instant confirmation. Keep it as your giving record.' },
                { num: '02', icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/5 border-primary/20', title: 'Notify Our Finance Team', body: 'Optionally screenshot and share on WhatsApp for our internal tracking.' },
                { num: '03', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200', title: "Trust God's Faithfulness", body: "Rest in faith. God is not unrighteous to forget your work and your love for His name." },
              ].map(({ num, icon: Icon, color, bg, title, body }) => (
                <div key={num} className={`flex gap-4 p-5 rounded-2xl border ${bg}`}>
                  <div className="flex-shrink-0 pt-0.5">
                    <div className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{num}</p>
                    <h4 className="font-heading font-bold text-slate-800 mb-1">{title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other ways */}
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 mb-2">
              Other Ways to Give
            </h2>
            <p className="text-slate-500 mb-7">Prefer a different method? We've got you covered.</p>
            <div className="space-y-4">
              {[
                { icon: Banknote, color: 'bg-secondary/10 text-secondary-dark', title: 'In Person', body: 'Drop your offering in the basket during any Sunday Service, Bible Study, or Prayer Meeting.' },
                { icon: Phone, color: 'bg-primary/10 text-primary', title: 'Bank Transfer', body: 'Contact our finance team for direct bank account details if you prefer wire transfer.' },
              ].map(({ icon: Icon, color, title, body }) => (
                <div key={title} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-800 mb-1">{title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 mt-10 mb-2">
              Common Questions
            </h2>
            <p className="text-slate-500 mb-6">Everything you need to know about giving at LRT.</p>
            <div className="space-y-3">
              {FAQS.map(({ q, a }, idx) => (
                <div key={q} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40' : 'max-h-0'}`}>
                    <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ CTA FOOTER BANNER */}
        <section className="relative rounded-3xl overflow-hidden">
          {/* gold gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-dark via-secondary to-secondary-light" />
          {/* texture */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00000022 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 text-center px-8 py-16 md:px-20 md:py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/20 flex items-center justify-center mx-auto mb-6">
              <HandCoins className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 mb-5">
              Ready to Make an Impact?
            </h2>
            <p className="text-slate-800/75 max-w-xl mx-auto text-lg mb-10 leading-relaxed">
              Your generosity is the fuel that powers our outreach, worship, and community programs.
              Thank you for partnering with LRT.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
            >
              Give Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
