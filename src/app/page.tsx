"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Play, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/theme-provider";

const primaryColor = "#003D9B";
const secondaryColor = "#0066FF";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    title: "Lightning-Fast POS",
    description: "Touch-optimized checkout with barcode scanning, keyboard shortcuts, and instant processing.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Smart Inventory",
    description: "Real-time stock tracking across all branches with automated low-stock alerts and transfers.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "Powerful Analytics",
    description: "Live dashboards showing sales trends, top products, staff performance, and inventory value.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Multi-Branch Control",
    description: "Manage unlimited locations from one dashboard with real-time sync and branch-specific settings.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Customer Management",
    description: "Build customer profiles, track purchase history, and manage store credit balances.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Production Tracking",
    description: "Track raw materials, manage recipes, and monitor production batches seamlessly.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "10K+", label: "Active Businesses" },
  { value: "50M+", label: "Transactions Processed" },
  { value: "99.9%", label: "Platform Uptime" },
  { value: "24/7", label: "Customer Support" },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for new businesses getting started",
    features: ["1 Branch", "Basic POS Terminal", "Inventory Tracking", "Email Support", "1,000 Products"],
    popular: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/month",
    description: "For growing businesses with multiple needs",
    features: ["3 Branches", "Advanced POS Terminal", "Multi-branch Sync", "Analytics Dashboard", "Priority Support", "10,000 Products", "Production Tracking"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom requirements",
    features: ["Unlimited Branches", "Custom POS Configuration", "API Access", "Advanced Reports", "Dedicated Support", "Unlimited Products", "Custom Integrations"],
    popular: false,
  },
];

const testimonials = [
  { name: "Sarah Chen", role: "Bakery Owner, Miami", content: "PTLPOS transformed our checkout process. Sales are 30% faster and inventory is always accurate." },
  { name: "Michael Rodriguez", role: "Retail Chain Manager, Texas", content: "Managing 5 branches from one dashboard is a game-changer. Everything syncs in real-time." },
  { name: "Emma Thompson", role: "Cafe Owner, Portland", content: "The production tracking feature is incredible for managing our recipes and raw materials." },
];

const steps = [
  { number: "01", title: "Create Account", description: "Sign up in seconds and set up your business profile." },
  { number: "02", title: "Add Products", description: "Import your inventory via CSV or add products manually." },
  { number: "03", title: "Start Selling", description: "Open the POS terminal and process transactions instantly." },
];

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Documentation", "API Reference", "Support", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [mobileMenuOpen]);

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-white"}`}>
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? `${isDark ? "bg-gray-950/95" : "bg-white/95"} backdrop-blur-md shadow-lg` 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-25 h-20 rounded-xl overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/logo-Dark.png" alt="PTLPOS" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              {/* <span className={`text-xl font-bold ${isDark ? "text-white" : "text-[#003D9B]"}`}>PTLPOS</span> */}
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {["Features", "Pricing", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors ${
                    isDark 
                      ? "text-gray-300 hover:text-white" 
                      : "text-gray-600 hover:text-[#003D9B]"
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link 
                href="/login"
                className={`text-sm font-medium transition-colors ${
                  isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-[#003D9B]"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className={`inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg ${
                  isDark 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-[#003D9B] hover:bg-[#002d7a]"
                }`}
              >
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-t ${isDark ? "bg-gray-950 border-gray-800" : "bg-white border-gray-100"}`}
            >
              <div className="px-4 py-6 space-y-4">
                {["Features", "Pricing", "Testimonials"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-base font-medium ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item}
                  </a>
                ))}
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-base font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-center py-3 rounded-lg font-semibold text-white ${
                    isDark ? "bg-blue-600" : "bg-[#003D9B]"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section className={`relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden ${isDark ? "bg-gray-950" : "bg-gradient-to-b from-blue-50/50 to-white"}`}>
          <div className="absolute inset-0 -z-10">
            <div className={`absolute top-0 right-0 w-[900px] h-[900px] rounded-full blur-3xl opacity-30 ${
              isDark ? "bg-blue-600/20" : "bg-[#003D9B]/10"
            }`} />
            <div className={`absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-3xl opacity-20 ${
              isDark ? "bg-blue-500/20" : "bg-[#0066FF]/10"
            }`} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-5xl mx-auto text-center"
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${
                  isDark 
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                    : "bg-[#003D9B]/10 text-[#003D9B] border border-[#003D9B]/20"
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Multi-tenant POS Platform
                </span>
              </motion.div>
              
              <motion.h1 
                variants={fadeUp}
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Run Your Retail Business{" "}
                <span className={`bg-gradient-to-r ${
                  isDark ? "from-blue-400 to-blue-500" : "from-[#003D9B] to-[#0066FF]"
                } bg-clip-text text-transparent`}>
                  Smarter
                </span>
</motion.h1>
               
              <motion.p
                variants={fadeUp}
                className={`text-lg sm:text-xl mb-10 max-w-4xl mx-auto ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                The all-in-one point of sale, inventory, and analytics platform built for modern retailers.
                Lightning-fast checkout, real-time insights, multi-branch control.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className={`inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white transition-all hover:shadow-xl hover:-translate-y-0.5 ${
                    isDark 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-[#003D9B] hover:bg-[#002d7a]"
                  }`}
                >
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className={`inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium transition-all hover:-translate-y-0.5 ${
                  isDark 
                    ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700" 
                    : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm"
                }`}>
                  <Play className="mr-2 w-5 h-5" /> Watch Demo
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={`py-16 border-y ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-[#003D9B]"
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={`py-20 lg:py-32 ${isDark ? "bg-gray-950" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeUp} className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Everything You Need to{" "}
                <span className={isDark ? "text-blue-400" : "text-[#003D9B]"}>Scale</span>
              </motion.h2>
              <motion.p variants={fadeUp} className={`text-lg max-w-4xl mx-auto ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                From lightning-fast checkout to comprehensive analytics, PTLPOS has every tool your business needs.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className={`group p-6 rounded-2xl transition-all duration-300 ${
                    isDark 
                      ? "bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/30" 
                      : "bg-white hover:shadow-xl border border-gray-100 hover:border-[#003D9B]/20"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    isDark 
                      ? "bg-blue-500/20 text-blue-400" 
                      : "bg-[#003D9B]/10 text-[#003D9B]"
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className={`py-20 lg:py-32 ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeUp} className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Get Started in Minutes
              </motion.h2>
              <motion.p variants={fadeUp} className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Simple onboarding, powerful features
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="relative"
                >
                  <div className={`${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} border rounded-2xl p-8 h-full`}>
                    <div className={`text-6xl font-bold mb-4 ${
                      isDark ? "text-blue-500/10" : "text-[#003D9B]/10"
                    }`}>
                      {step.number}
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {step.title}
                    </h3>
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                      {step.description}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`hidden md:block absolute top-1/2 -right-7 transform -translate-y-1/2 ${
                      isDark ? "text-gray-700" : "text-gray-300"
                    }`}>
                      <ChevronRight className="w-8 h-8" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className={`py-20 lg:py-32 ${isDark ? "bg-gray-950" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeUp} className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Loved by Retailers
              </motion.h2>
              <motion.p variants={fadeUp} className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                See what business owners are saying about PTLPOS
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className={`${isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-100"} border rounded-2xl p-8`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className={`text-lg mb-6 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      isDark 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "bg-[#003D9B]/10 text-[#003D9B]"
                    }`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {t.name}
                      </div>
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {t.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className={`py-20 lg:py-32 ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeUp} className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Simple, Transparent Pricing
              </motion.h2>
              <motion.p variants={fadeUp} className={`text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Choose the plan that fits your business. No hidden fees.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {plans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className={`relative rounded-2xl p-8 transition-all ${
                    plan.popular 
                      ? isDark 
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-500/20" 
                        : "bg-gradient-to-br from-[#003D9B] to-[#0066FF] text-white shadow-xl shadow-[#003D9B]/20"
                      : isDark 
                        ? "bg-gray-900 border border-gray-800" 
                        : "bg-white border border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-medium shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? "text-white" : isDark ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-bold ${plan.popular ? "text-white" : isDark ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={plan.popular ? "text-white/70" : isDark ? "text-gray-400" : "text-gray-500"}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  
                  <p className={`mb-6 ${plan.popular ? "text-white/80" : isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, fidx) => (
                      <li key={fidx} className="flex items-center gap-3">
                        <Check className={`w-5 h-5 ${plan.popular ? "text-white" : "text-emerald-500"}`} />
                        <span className={plan.popular ? "text-white/90" : isDark ? "text-gray-300" : "text-gray-600"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/register"
                    className={`block w-full py-3 rounded-xl text-center font-semibold transition-all ${
                      plan.popular
                        ? "bg-white text-[#003D9B] hover:bg-gray-100"
                        : isDark
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-[#003D9B] text-white hover:bg-[#002d7a]"
                    }`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : plan.price === "Free" ? "Start Free" : "Start Trial"}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className={`py-24 lg:py-32 relative overflow-hidden ${
          isDark ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800" : "bg-gradient-to-br from-[#003D9B] via-[#0047AB] to-[#0066FF]"
        }`}>
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/80 mb-10">
                Join thousands of retailers who trust PTLPOS. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-[#003D9B] font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5">
                  Schedule Demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-16 ${isDark ? "bg-gray-950 border-t border-gray-800" : "bg-white border-t border-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDark ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-[#003D9B] to-[#0066FF]"
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className={`text-xl font-bold ${isDark ? "text-white" : "text-[#003D9B]"}`}>
                  PTLPOS
                </span>
              </Link>
              <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                The modern POS platform for growing retail businesses.
              </p>
              <div className="flex gap-4">
                {["twitter", "linkedin", "github"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isDark 
                        ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700" 
                        : "bg-gray-100 text-gray-500 hover:text-[#003D9B] hover:bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className={`text-sm transition-colors ${
                          isDark 
                            ? "text-gray-400 hover:text-white" 
                            : "text-gray-600 hover:text-[#003D9B]"
                        }`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t ${
            isDark ? "border-gray-800" : "border-gray-100"
          }`}>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              © 2026 PTLPOS. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className={`text-sm transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#003D9B]"}`}>
                Privacy
              </a>
              <a href="#" className={`text-sm transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#003D9B]"}`}>
                Terms
              </a>
              <a href="#" className={`text-sm transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#003D9B]"}`}>
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}