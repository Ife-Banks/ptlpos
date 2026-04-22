"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Icons ----------
const PosIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const InventoryIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BranchIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ---------- Data ----------
const features = [
  {
    icon: <PosIcon />,
    title: "POS Terminal",
    description: "Lightning-fast checkout with touch-first design, barcode scanning, and keyboard shortcuts.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: <InventoryIcon />,
    title: "Inventory",
    description: "Real-time stock tracking, multi-branch visibility, and low-stock alerts.",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: <AnalyticsIcon />,
    title: "Analytics",
    description: "Live dashboards with sales trends, staff performance, and inventory valuation.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: <BranchIcon />,
    title: "Multi-Branch",
    description: "Manage multiple locations from a single dashboard with real-time sync.",
    gradient: "from-cyan-500 to-cyan-600",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50M+", label: "Transactions" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for small businesses",
    features: ["1 Branch", "Basic POS", "Inventory Tracking", "Email Support"],
    popular: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/mo",
    description: "For growing businesses",
    features: ["3 Branches", "Advanced POS", "Multi-branch Sync", "Analytics Dashboard", "Priority Support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: ["Unlimited Branches", "Custom Integrations", "Dedicated Support", "Advanced Reports", "API Access"],
    popular: false,
  },
];

const testimonials = [
  { name: "Sarah Chen", role: "Bakery Owner", content: "PTLPOS transformed our checkout. Sales are 30% faster!" },
  { name: "Michael Rodriguez", role: "Retail Chain Manager", content: "Managing 5 branches from one dashboard is a game-changer." },
  { name: "Emma Thompson", role: "Store Owner", content: "The production tracking is incredible. Everything connects seamlessly." },
];

const howItWorks = [
  { step: "01", title: "Register", description: "Create your account and set up your organization." },
  { step: "02", title: "Add Products", description: "Import products via CSV or add them manually." },
  { step: "03", title: "Start Selling", description: "Open the POS terminal and process transactions." },
];

// ---------- Animation Variants ----------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// ---------- Components ----------
// Full width container without max-width restrictions
const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 ${className}`}>{children}</div>
);

const SectionHeader = ({ title, subtitle }: { title: React.ReactNode; subtitle?: string }) => (
  <div className="text-center mb-12">
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="text-lg text-on-surface-variant max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <a
    href={href}
    onClick={(e) => {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        onClick?.();
      }
    }}
    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
  >
    {children}
  </a>
);

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
        }`}
      >
        <Container className="py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl text-primary">
              PTLPOS
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </Container>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border-light bg-white dark:bg-gray-900 shadow-lg"
            >
              <Container className="py-4 space-y-3">
                <NavLink href="#features" onClick={() => setMobileMenuOpen(false)}>
                  Features
                </NavLink>
                <NavLink href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                  Pricing
                </NavLink>
                <NavLink href="#testimonials" onClick={() => setMobileMenuOpen(false)}>
                  Testimonials
                </NavLink>
                <Link
                  href="/login"
                  className="block py-2 text-sm text-primary font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          </div>
          <Container>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl"
            >
              <motion.span
                variants={fadeUp}
                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                Multi-tenant POS & Retail Management
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Run Your Retail Business{" "}
                <span className="text-primary">Smarter</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-xl text-on-surface-variant max-w-6xl mb-10">
                The all-in-one point of sale, inventory, and analytics platform built for modern retailers. Lightning-fast checkout, real-time insights, multi-branch control.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                >
                  Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <button className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-border text-on-surface font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <Play className="mr-2 w-4 h-4" /> Watch Demo
                </button>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-border-light bg-black/5 dark:bg-white/5">
          <Container>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-base text-on-surface-variant">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32">
          <Container>
            <SectionHeader
              title={
                <>
                  Everything You Need to <span className="text-primary">Scale</span>
                </>
              }
              subtitle="From lightning-fast checkout to comprehensive analytics, PTLPOS has every tool your business needs."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  className="group bg-surface-raised dark:bg-gray-900 rounded-2xl border border-border p-8 hover:border-primary/30 hover:shadow-xl transition-all"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 text-white shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-32 bg-black/5 dark:bg-white/5">
          <Container>
            <SectionHeader title="How It Works" subtitle="Get started in minutes with our intuitive onboarding" />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {howItWorks.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="relative bg-surface-raised dark:bg-gray-900 rounded-2xl border border-border p-10 hover:shadow-lg transition-all"
                >
                  <span className="text-6xl font-bold text-primary/10 absolute top-6 right-8">{item.step}</span>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-on-surface-variant">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 lg:py-32">
          <Container>
            <SectionHeader title="Loved by Retailers" />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="bg-surface-raised dark:bg-gray-900 rounded-2xl border border-border p-8 hover:shadow-lg transition-all"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-base mb-6 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-on-surface-variant">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 lg:py-32 bg-black/5 dark:bg-white/5">
          <Container>
            <SectionHeader title="Simple Pricing" subtitle="Choose the plan that fits your business. No hidden fees." />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {plans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  className={`relative bg-white dark:bg-gray-900 rounded-2xl border-2 p-8 ${
                    plan.popular ? "border-primary shadow-xl" : "border-border hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium shadow-lg">Popular</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-base text-on-surface-variant">{plan.period}</span>}
                  </div>
                  <p className="text-on-surface-variant mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, fidx) => (
                      <li key={fidx} className="flex items-center gap-3">
                        <CheckIcon />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block w-full py-3 rounded-xl text-center font-medium transition-all ${
                      plan.popular
                        ? "bg-primary text-white hover:bg-primary/90 shadow-md"
                        : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
                    }`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : plan.price === "Free" ? "Start Free" : "Start Trial"}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-24 lg:py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
              <p className="text-xl text-white/80 mb-10">Join thousands of retailers who trust PTLPOS. Start your free trial today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-white/90 transition-all shadow-xl"
                >
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-surface-raised border-t border-border-light">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-lg">PTLPOS</span>
            </div>
            <p className="text-sm text-on-surface-variant">© 2026 PTLPOS. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}