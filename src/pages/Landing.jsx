import React from "react";
import { Link } from "react-router-dom";
import LandingLayout from "../components/LandingLayout";
import {
  Bot,
  Users,
  Code,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  FileText,
  Timer,
  Shield,
  Brain,
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      title: "Content & Portfolio",
      desc: "Blogs, projects, skills, PDFs, notes — rich editors, full control.",
      icon: <FileText className="w-7 h-7" />,
    },
    {
      title: "AI Assistant",
      desc: "Custom-trained chatbot with memory, history, and your voice.",
      icon: <Bot className="w-7 h-7" />,
    },
    {
      title: "Productivity OS",
      desc: "Pomodoro, OKRs, expenses, markdown, JSON — everything integrated.",
      icon: <Timer className="w-7 h-7" />,
    },
    {
      title: "Real-Time Teams",
      desc: "Chat, tasks, roles, shared boards — no more Slack chaos.",
      icon: <Users className="w-7 h-7" />,
    },
    {
      title: "Developer Hub",
      desc: "Code logs, prompts, formatters, export — built for builders.",
      icon: <Code className="w-7 h-7" />,
    },
    {
      title: "Enterprise Admin",
      desc: "User roles, audit logs, analytics, permissions — total control.",
      icon: <Shield className="w-7 h-7" />,
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for getting started",
      features: [
        "1 Project",
        "2K AI tokens/mo",
        "Basic Tools",
        "Notes & Tasks",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      desc: "For creators & power users",
      features: [
        "Unlimited Projects",
        "50K AI tokens/mo",
        "Export & Analytics",
        "Priority Support",
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      name: "Teams",
      price: "$29",
      desc: "For growing teams",
      features: [
        "Everything in Pro",
        "200K tokens/mo",
        "Team Chat & Roles",
        "Admin Controls",
      ],
      cta: "Start Team Plan",
      popular: false,
    },
  ];

  const testimonials = [
    {
      quote: "One app finally replaced Notion, Slack, and my AI tools.",
      author: "Alex Rivera",
      role: "Founder",
    },
    {
      quote: "The AI writes like me. It's scary good.",
      author: "Jamie Park",
      role: "Content Creator",
    },
    {
      quote: "Our team actually uses this. Daily.",
      author: "Morgan Lee",
      role: "Engineering Lead",
    },
  ];

  const roadmap = [
    "Third-party integrations (GitHub, Figma, Slack)",
    "Real-time co-editing & comments",
    "Native mobile apps (iOS & Android)",
    "Advanced analytics & AI insights",
    "Custom domains & white-label",
    "SSO & enterprise security",
  ];

  return (
    <LandingLayout>
      {/* HERO - Ultra Premium */}
      <section className="pt-24 lg:pt-32 pb-12 lg:pb-24 px-2 lg:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-indigo-300 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide mb-8">
            <Sparkles className="w-4 h-4" />
            14-day Pro trial · No card needed
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 leading-tight">
            Your Second Brain.
            <br />
            Rebuilt.
          </h1>

          <p className="mt-6 text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            One platform for everything you do. No tabs. No chaos. Just flow.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-semibold rounded-2xl transition-all hover:shadow-xl hover:scale-105 active:scale-95"
            >
              See How It Works
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
            Join 8,000+ creators, developers, and teams
          </p>
        </div>
      </section>

      {/* FEATURES - Grid Perfection */}
      <section
        id="features"
        className="py-8 px-2 lg:py-24 lg:px-6 bg-gray-50/50 dark:bg-black/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
              One Tool to Rule Them All
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Replace 12 apps. Keep your sanity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-gray-900/70 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section className="py-8 px-2 lg:py-24 lg:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                The Tab Madness Ends Here
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                You're drowning in Notion pages, Slack threads, random notes,
                and AI chats that forget everything.
              </p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Every switch costs focus. Every disconnect costs time.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-10 rounded-3xl border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                Welcome to Nexus
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                One unified workspace where your AI remembers, your team
                collaborates, and your work actually gets done.
              </p>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Claim Your Workspace <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - Clean & Bold */}
      <section
        id="pricing"
        className="py-8 px-2 lg:py-24 lg:px-6 bg-gray-50/50 dark:bg-black/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
              Pricing That Makes Sense
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 transition-all hover:-translate-y-3 duration-500 ${
                  plan.popular
                    ? "bg-blue-600 text-white shadow-2xl ring-4 ring-indigo-600/30"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-indigo-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                <h3
                  className={`text-2xl font-bold ${
                    plan.popular
                      ? "text-white"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span
                    className={`text-5xl font-extrabold ${
                      plan.popular
                        ? "text-white"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`ml-2 ${
                      plan.popular ? "text-indigo-100" : "text-gray-500"
                    }`}
                  >
                    /month
                  </span>
                </div>
                <p
                  className={`mt-3 ${
                    plan.popular
                      ? "text-indigo-100"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {plan.desc}
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check
                        className={`w-5 h-5 ${
                          plan.popular ? "text-indigo-200" : "text-indigo-600"
                        }`}
                      />
                      <span
                        className={
                          plan.popular
                            ? "text-indigo-50"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-10 w-full py-4 rounded-2xl font-bold transition-all ${
                    plan.popular
                      ? "bg-white text-indigo-600 hover:bg-gray-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } shadow-lg hover:shadow-xl`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Minimal Power */}
      <section className="py-8 px-2 lg:py-24 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
              Real People. Real Results.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900/70 p-10 rounded-3xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="mt-8">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {t.author}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US — THE ULTIMATE STORY SECTION */}
      <section id="about" className="py-24 bg-gray-50 dark:bg-black/30">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">
            The Ultimate Productivity Platform
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            We’re building the{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              one tool that does it all
            </span>{" "}
            — securely, beautifully, and without compromise.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
          {/* Left: The Vision */}
          <div className="space-y-8">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-4">Born from Frustration</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We were tired of paying for 12 apps that barely talked to each
                other. Notion for notes. Slack for chat. Trello for tasks.
                ChatGPT for writing. Every switch stole focus. Every disconnect
                wasted time.
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                So we asked:{" "}
                <strong>“What if everything just… worked together?”</strong>
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To give creators, developers, and teams a{" "}
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  single source of truth
                </span>{" "}
                — where ideas flow, teams sync instantly, and AI actually
                remembers who you are.
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                No more tab overload. No more “where did I save that?” Just
                pure, uninterrupted{" "}
                <strong className="text-blue-600 dark:text-blue-400">
                  flow
                </strong>
                .
              </p>
            </div>
          </div>

          {/* Right: The Reality */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900/70 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                Built for Real People
              </h3>
              <ul className="space-y-4 text-left">
                {[
                  "Solo makers shipping side projects",
                  "Developers managing code + prompts + docs",
                  "Writers who hate switching between 5 apps",
                  "Startup teams replacing Slack + Notion + Linear",
                  "Agencies running client portals without Webflow",
                  "Students organizing research, goals, and resumes",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
              <p className="text-blue-100 leading-relaxed">
                15,000+ people already ditched app chaos. They’re writing
                faster, shipping more, and actually enjoying Mondays.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">You’re next.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Punch */}
        <div className="mt-20 text-center">
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            This isn’t just another tool.
          </p>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-4">
            This is your second brain — rebuilt from scratch.
          </p>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
            What's Coming Next
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {roadmap.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {/* FAQ — THE MOST COMPREHENSIVE & CONVERTING FAQ EVER */}
      <section id="faq" className="py-12 lg:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">
            Got Questions? We’ve Got Answers
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Everything you need to know before joining 15,000+ happy users.
          </p>

          <div className="space-y-6">
            {[
              {
                q: "Is there a free plan?",
                a: "Yes! Our Free plan is forever free — no credit card, no limits on core features. Perfect for individuals just getting started.",
              },
              {
                q: "Do you offer a free trial for Pro?",
                a: "Absolutely. 14-day free trial of Pro with full 50K AI tokens, unlimited projects, and priority support. No card required.",
              },
              {
                q: "Can I cancel or downgrade anytime?",
                a: "Yes — 100%. Cancel or downgrade instantly from your settings. No questions, no hassle, no hidden fees.",
              },
              {
                q: "Is my data safe and private?",
                a: "Yes. End-to-end encryption, SOC 2 compliant, regular security audits. Your data is never sold or used to train public AI models.",
              },
              {
                q: "Can I use Nexus offline?",
                a: "Yes! Core features (notes, tasks, code logs) work offline. Everything syncs automatically when you’re back online.",
              },
              {
                q: "Do you have a mobile app?",
                a: "Native iOS & Android apps are launching Q1 2026. The web app is fully responsive and works beautifully on phones right now.",
              },
              {
                q: "Can I import from Notion, Obsidian, or Roam?",
                a: "Yes! One-click import from Notion, Markdown files, Obsidian vaults, and CSV. We make migration painless.",
              },
              {
                q: "Is the AI assistant private?",
                a: "Completely. Your chats and training data are private to you (or your team). We never use your data to train public models.",
              },
              {
                q: "Can I self-host or get a white-label version?",
                a: "Yes — Enterprise plans include self-hosting, custom domains, white-label branding, and dedicated support.",
              },
              {
                q: "Do you support team collaboration?",
                a: "Yes! Real-time chat, shared projects, task assignment, comments, mentions, and role-based permissions (admin, editor, viewer).",
              },
              {
                q: "What happens if I exceed AI token limits?",
                a: "You’ll be notified and can upgrade instantly. Or switch to pay-as-you-go for extra tokens — no overage surprises.",
              },
              {
                q: "Still have questions?",
                a: (
                  <span>
                    We're here 24/7. Email{" "}
                    <a
                      href="mailto:hello@nexus.app"
                      className="text-blue-600 dark:text-blue-400 font-semibold underline"
                    >
                      hello@nexus.app
                    </a>{" "}
                    or chat with us — average response time:{" "}
                    <strong>under 3 minutes</strong>.
                  </span>
                ),
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-gray-900/70 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <summary className="flex justify-between items-center font-semibold text-lg cursor-pointer list-none">
                  <span>{faq.q}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {typeof faq.a === "string" ? faq.a : faq.a}
                </div>
              </details>
            ))}
          </div>

          {/* Final Trust Line */}
          <div className="mt-16 text-center">
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Now ready to start?
            </p>
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-3">
              Join 12,000+ who stopped switching apps.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Start Free Trial <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default Landing;
