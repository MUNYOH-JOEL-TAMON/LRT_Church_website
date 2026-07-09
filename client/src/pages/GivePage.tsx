import { useState } from 'react';
import {
  Smartphone,
  Copy,
  CheckCircle2,
  HandCoins,
  Heart,
  ShieldCheck,
  ChevronRight,
  Phone,
  MessageSquare,
  ArrowRight,
  Banknote,
  Star,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────── */
type GivingType = 'tithe' | 'offering' | 'building' | 'missions' | 'other';

interface MomoOption {
  provider: 'MTN' | 'Orange';
  number: string;
  name: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  steps: string[];
}

/* ─── Constants ─────────────────────────────────────────── */
const GIVING_TYPES: { id: GivingType; label: string; description: string; icon: typeof HandCoins }[] = [
  { id: 'tithe',    label: 'Tithes',          description: 'Return the first 10% to God',              icon: HandCoins },
  { id: 'offering', label: 'Offerings',        description: 'Give generously from your heart',          icon: Heart },
  { id: 'building', label: 'Building Fund',    description: 'Help expand our physical ministry',        icon: ShieldCheck },
  { id: 'missions', label: 'Missions',         description: 'Support evangelism & outreach programs',   icon: ArrowRight },
  { id: 'other',    label: 'Other',            description: 'Any other form of giving to the ministry', icon: Star },
];

const MOMO_OPTIONS: MomoOption[] = [
  {
    provider: 'MTN',
    number: '677 000 000',
    name: 'Latter Rain Tabernacle',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: '📱',
    steps: [
      'Dial *126# on your MTN line',
      'Select "Transfer Money"',
      'Enter the number: 677 000 000',
      'Enter the amount you wish to give',
      'Enter your MoMo PIN to confirm',
      'Save your transaction ID',
    ],
  },
  {
    provider: 'Orange',
    number: '699 000 000',
    name: 'Latter Rain Tabernacle',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: '🟠',
    steps: [
      'Dial #150*50# on your Orange line',
      'Select "Send Money"',
      'Enter the number: 699 000 000',
      'Enter the amount you wish to give',
      'Enter your Orange Money PIN',
      'Save your transaction ID',
    ],
  },
];

const IMPACT_ITEMS = [
  { label: 'Families Reached',      value: '500+',  color: 'text-primary' },
  { label: 'Outreach Events',        value: '80+',   color: 'text-secondary-dark' },
  { label: 'Years of Ministry',      value: '15+',   color: 'text-emerald-600' },
  { label: 'Nations Touched',        value: '5+',    color: 'text-rose-600' },
];

/* ─── Component ─────────────────────────────────────────── */
const GivePage = () => {
  const [selectedType, setSelectedType] = useState<GivingType>('tithe');
  const [activeProvider, setActiveProvider] = useState<0 | 1>(0);
  const [copiedNumber, setCopiedNumber] = useState('');

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\s/g, '')).catch(() => {});
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(''), 2500);
  };

  const selected = MOMO_OPTIONS[activeProvider];

  return (
    <div className="pt-24 pb-20 min-h-screen">

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="bg-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-20 animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary rounded-full filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-widest mb-4">
            <HandCoins className="w-4 h-4" /> Give Online
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-5">
            Sow Into the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-secondary">
              Kingdom
            </span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Every seed you plant is an act of worship. Support the vision of Latter Rain Tabernacle
            and help us reach more lives for Christ.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-20">

        {/* ── Scripture Banner ─────────────────────────── */}
        <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl font-heading font-bold leading-relaxed mb-4 italic">
              "Give, and it will be given to you. A good measure, pressed down, shaken together and
              running over…"
            </p>
            <span className="text-secondary font-semibold text-sm tracking-widest uppercase">Luke 6:38</span>
          </div>
        </div>

        {/* ── Choose Giving Type ────────────────────────── */}
        <section>
          <div className="text-center mb-10">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Step 1</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-800 mt-2 mb-3">
              What Would You Like to Give Toward?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Select the category that reflects your giving intention. Each seed is precious to God.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {GIVING_TYPES.map(({ id, label, description, icon: Icon }) => {
              const active = selectedType === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedType(id)}
                  className={`group flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                    active
                      ? 'border-primary bg-primary text-white shadow-xl shadow-primary/30'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      active ? 'bg-white/20' : 'bg-primary/10 group-hover:bg-primary/20'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${active ? 'text-secondary' : 'text-primary'}`} />
                  </div>
                  <p className="font-heading font-bold text-sm leading-tight mb-1">{label}</p>
                  <p className={`text-xs leading-snug hidden sm:block ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                    {description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Choose Provider + How-To Steps ───────────── */}
        <section>
          <div className="text-center mb-10">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Step 2</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-800 mt-2 mb-3">
              Choose Your Mobile Money Provider
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              We accept both MTN Mobile Money and Orange Money. Follow the steps below to complete
              your giving.
            </p>
          </div>

          {/* Provider Tabs */}
          <div className="flex gap-3 mb-8 justify-center">
            {MOMO_OPTIONS.map((opt, idx) => (
              <button
                key={opt.provider}
                onClick={() => setActiveProvider(idx as 0 | 1)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeProvider === idx
                    ? `${opt.bg} ${opt.color} ${opt.border} border-2 shadow-md`
                    : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                {opt.provider} MoMo
              </button>
            ))}
          </div>

          {/* Card */}
          <div className={`rounded-3xl border-2 ${selected.border} ${selected.bg} p-6 md:p-10`}>
            <div className="grid md:grid-cols-2 gap-10 items-start">

              {/* Left – Account Details */}
              <div className="space-y-6">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${selected.color}`}>
                    {selected.provider} Mobile Money
                  </p>
                  <h3 className="text-2xl font-heading font-extrabold text-slate-800">
                    Account Details
                  </h3>
                </div>

                {/* Number box */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Account Number
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-3xl font-heading font-extrabold text-slate-800 tracking-widest">
                      {selected.number}
                    </span>
                    <button
                      onClick={() => handleCopy(selected.number)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        copiedNumber === selected.number
                          ? 'bg-emerald-100 text-emerald-700'
                          : `${selected.bg} ${selected.color} hover:opacity-80`
                      }`}
                    >
                      {copiedNumber === selected.number ? (
                        <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Name</p>
                      <p className="font-bold text-slate-800">{selected.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                    <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Reference / Note</p>
                      <p className="font-semibold text-slate-700 capitalize">
                        {GIVING_TYPES.find(g => g.id === selectedType)?.label} – LRT
                      </p>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="flex items-start gap-3 p-4 bg-white/70 rounded-xl border border-slate-200 text-slate-600 text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p>
                    After sending, you will receive an SMS confirmation. Please save it as your
                    giving receipt. Thank you for your generosity!
                  </p>
                </div>
              </div>

              {/* Right – Step-by-step */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Smartphone className={`w-6 h-6 ${selected.color}`} />
                  <h4 className="text-lg font-heading font-bold text-slate-800">
                    How to Send via {selected.provider} MoMo
                  </h4>
                </div>
                <ol className="space-y-4">
                  {selected.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${selected.bg} ${selected.color} border ${selected.border}`}
                      >
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 font-medium pt-1 text-sm leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ── Confirmation / After Step ─────────────────── */}
        <section>
          <div className="text-center mb-10">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Step 3</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-800 mt-2 mb-3">
              After Your Giving
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle2,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                title: 'Save Your Receipt',
                body: 'Keep the SMS confirmation from your mobile network as proof of your transaction.',
              },
              {
                icon: MessageSquare,
                color: 'text-primary',
                bg: 'bg-primary/10',
                title: 'Notify the Church',
                body: 'You may screenshot your confirmation and share it with our finance team via WhatsApp for tracking.',
              },
              {
                icon: Heart,
                color: 'text-rose-500',
                bg: 'bg-rose-50',
                title: 'Trust God's Return',
                body: 'Rest in faith that your seed is working. God is faithful and He rewards those who honour Him.',
              },
            ].map(({ icon: Icon, color, bg, title, body }) => (
              <div key={title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-heading font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Impact Stats ──────────────────────────────── */}
        <section className="bg-slate-900 rounded-3xl p-10 md:p-14 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary rounded-full filter blur-3xl opacity-20" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-secondary rounded-full filter blur-3xl opacity-10" />
          </div>
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">Your Giving Makes a Difference</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every contribution directly fuels our mission to spread the Gospel and transform communities.
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {IMPACT_ITEMS.map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={`text-4xl md:text-5xl font-heading font-extrabold mb-2 ${color}`}>{value}</p>
                <p className="text-slate-400 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ / Other Ways to Give ──────────────────── */}
        <section>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Other Ways */}
            <div>
              <span className="text-secondary font-bold text-sm uppercase tracking-widest">Alternatives</span>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 mt-2 mb-6">
                Other Ways to Give
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Banknote,
                    title: 'In Person',
                    body: 'Drop your tithe or offering in the offering basket during any of our Sunday Services or midweek meetings.',
                  },
                  {
                    icon: Phone,
                    title: 'Bank Transfer',
                    body: 'Contact our finance team for bank account details if you prefer a direct bank transfer.',
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-slate-800 mb-1">{title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <span className="text-secondary font-bold text-sm uppercase tracking-widest">FAQ</span>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 mt-2 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'Is my giving secure?',
                    a: 'Yes. All transactions are handled directly through MTN Mobile Money and Orange Money — both are trusted, regulated payment platforms in Cameroon.',
                  },
                  {
                    q: 'Can I give anonymously?',
                    a: 'Absolutely. You do not need to notify us. Simply send the funds and trust God with the rest.',
                  },
                  {
                    q: 'What is the minimum amount I can give?',
                    a: 'There is no minimum amount. God honors every seed, no matter the size.',
                  },
                  {
                    q: 'Who do I contact for receipts or queries?',
                    a: 'Please reach out to our finance team via the church contact page or WhatsApp.',
                  },
                ].map(({ q, a }) => (
                  <details key={q} className="group bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none">
                      <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-5 pb-4">
                      <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────── */}
        <section className="rounded-3xl bg-gradient-to-br from-secondary-dark via-secondary to-secondary-light p-10 md:p-14 text-center shadow-2xl shadow-secondary/30">
          <HandCoins className="w-14 h-14 text-slate-900/40 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-4">
            Ready to Give Today?
          </h2>
          <p className="text-slate-800/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Your generosity is the fuel that powers our outreach, worship, and community programs.
            Thank you for partnering with Latter Rain Tabernacle.
          </p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Give Now <ArrowRight className="w-5 h-5" />
          </a>
        </section>

      </div>
    </div>
  );
};

export default GivePage;
