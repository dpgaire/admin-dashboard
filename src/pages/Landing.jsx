import React from "react";
import { Link } from "react-router-dom";
import LandingLayout from "../components/LandingLayout";
import {
  FileText,
  Bot,
  Zap,
  Users,
  Code,
  Lock,
  Check,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      title: "Content & Portfolio",
      desc: "Blogs, projects, skills, PDFs, notes, quick links — full control with rich editors.",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "AI-Powered Assistant",
      desc: "Custom-trained chatbot with history, training data, and real-time responses.",
      icon: <Bot className="w-8 h-8 text-purple-500" />,
    },
    {
      title: "Productivity Suite",
      desc: "Pomodoro, OKRs, expense tracker, markdown, JSON, code snippets — all integrated.",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: "Team Collaboration",
      desc: "Real-time chat, user roles, task assignment, and shared dashboards.",
      icon: <Users className="w-8 h-8 text-green-500" />,
    },
    {
      title: "Developer Toolkit",
      desc: "Code log, prompt storage, JSON formatter, rich text, and markdown with export.",
      icon: <Code className="w-8 h-8 text-cyan-500" />,
    },
    {
      title: "Admin Control",
      desc: "User management, permissions, analytics, and full audit trail for teams.",
      icon: <Lock className="w-8 h-8 text-red-500" />,
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      desc: "Perfect for solo creators and freelancers.",
      features: [
        "5 Projects & Blogs",
        "AI Chat (10K tokens/mo)",
        "Pomodoro & Notes",
        "Basic Analytics",
        "Export to PDF/MD",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      desc: "For growing teams and power users.",
      features: [
        "Unlimited Projects & Blogs",
        "AI Chat (100K tokens/mo)",
        "Team Chat & Roles",
        "Advanced Analytics",
        "Priority Support",
        "Custom Domains",
      ],
      cta: "Most Popular",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For organizations with advanced needs.",
      features: [
        "Everything in Pro",
        "Unlimited AI Tokens",
        "SSO & Audit Logs",
        "Dedicated Support",
        "Custom Integrations",
        "SLA & Uptime Guarantee",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const testimonials = [
    {
      quote: "Nexus replaced 6 apps for me. I finally have one place for everything.",
      author: "Sarah Chen",
      role: "Indie Developer",
      rating: 5,
    },
    {
      quote: "The AI assistant writes in my voice better than I do. It's like having a co-founder.",
      author: "Michael Torres",
      role: "Technical Writer",
      rating: 5,
    },
    {
      quote: "Our team cut meeting time by 40% after switching to Nexus chat and tasks.",
      author: "Emily Park",
      role: "Product Lead, Startup",
      rating: 5,
    },
  ];

  return (
    <LandingLayout>
      {/* HERO */}
      <section className="text-center py-16 sm:py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          14-day free trial · No credit card required
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          One Platform. All Your Tools.
        </h1>
        <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Manage content, projects, productivity, and team communication — without switching apps.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-7 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Start Free Trial
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-7 rounded-lg border border-gray-200 transition-all hover:shadow-md"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Everything in One Place
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Replace 10+ tools with a single, powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="mb-4 transition-transform group-hover:scale-110">{f.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION */}
      <section className="py-16 sm:py-24 bg-gray-50 -mx-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Stop Juggling Apps
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              One fragmented workflow = lost time, focus, and momentum.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">The Problem</h3>
              <p className="text-gray-600 leading-relaxed">
                You’re using <strong>Notion</strong> for notes, <strong>Trello</strong> for tasks,{" "}
                <strong>Slack</strong> for chat, <strong>GitHub</strong> for code, and{" "}
                <strong>Google Docs</strong> for writing.
              </p>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Context switching kills productivity. Nothing syncs. You’re overwhelmed.
              </p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Our Solution</h3>
              <p className="text-gray-600 leading-relaxed">
                A <strong>unified platform</strong> where everything lives together — securely,
                intuitively, and in real-time.
              </p>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Write, code, plan, chat, track, and grow — all without leaving the app.
              </p>
              <div className="mt-5">
                <Link
                  to="/register"
                  className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all shadow-sm hover:shadow"
                >
                  Claim Your Workspace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Always upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative bg-white p-6 sm:p-8 rounded-xl border ${
                  plan.popular
                    ? "border-blue-500 shadow-xl ring-2 ring-blue-100"
                    : "border-gray-200 shadow-sm"
                } transition-all hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-3 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="ml-1 text-gray-600">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.desc}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start text-sm text-gray-600">
                      <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-8 w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-16 sm:py-24 bg-gray-50 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Loved by Creators & Teams
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              Join thousands who’ve reclaimed their focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{t.quote}"</p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Built for Real Work
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you’re a solo creator, a growing team, or an admin managing users — this
              platform adapts to you.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600 mx-auto">
            <p className="text-center text-lg sm:text-xl font-medium text-gray-700">
              Our application is a{" "}
              <span className="text-blue-600">
                comprehensive, all-in-one productivity and management platform
              </span>{" "}
              designed to be the central hub for your work.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  For Individuals
                </h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-2" /> Personal dashboard & quick
                    links
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-2" /> AI assistant trained on your
                    style
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-2" /> Pomodoro, goals, and expense
                    tracking
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-2" /> Full control over blogs,
                    projects, and code
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  For Teams & Admins
                </h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-2" /> Role-based access
                    (superAdmin, admin, user)
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-2" /> Real-time team chat & task
                    assignment
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-2" /> Shared library, notes, and
                    analytics
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-2" /> Audit logs and user
                    management
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            The Journey Ahead
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            We’re just getting started. Here’s what’s coming:
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              { title: "Third-Party Integrations", desc: "GitHub, Slack, Google Drive, Figma" },
              { title: "Real-Time Co-Editing", desc: "Collaborate on docs, notes, and tasks" },
              { title: "Mobile App", desc: "iOS & Android — work from anywhere" },
              { title: "Advanced Analytics", desc: "Productivity insights & team performance" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100"
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-gray-600">
            <strong>We’re building the ultimate workspace.</strong> Join us.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 bg-blue-600 -mx-4 px-4 rounded-3xl mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Reclaim Your Focus?
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-blue-100">
            Start free. Upgrade when you’re ready.
          </p>

          <div className="mt-6">
            <Link
              to="/register"
              className="inline-block w-full sm:w-auto bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-lg text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started — It's Free
            </Link>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-blue-200">
            No credit card required • 14-day free trial of Pro features
          </p>
        </div>
      </section>
    </LandingLayout>
  );
};

export default Landing;