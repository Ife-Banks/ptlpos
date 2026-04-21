import Link from "next/link";
import { 
  ShoppingCart, 
  Package, 
  Store, 
  BarChart3, 
  Users, 
  TrendingUp,
  Cloud,
  Shield,
  HeadphonesIcon,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-light">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-primary">PTLPOS</span>
            <div className="hidden md:flex gap-6 text-sm font-medium text-text-secondary">
              <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="#solutions" className="hover:text-primary transition-colors">Solutions</Link>
              <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link href="#resources" className="hover:text-primary transition-colors">Resources</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden lg:block text-sm font-medium text-text-secondary px-4 py-2 hover:bg-surface rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-lg hover:scale-[0.98] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-surface to-accent-bg opacity-50" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-bg text-primary text-sm font-medium rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>Trusted by 500+ Businesses</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
                All-in-One Retail Management{" "}
                <span className="text-primary">Platform</span>
              </h1>
              
              <p className="text-lg text-text-secondary max-w-xl">
                Streamline your operations with PTLPOS - the complete solution for 
                multi-branch retail management, POS, inventory tracking, and customer relationships.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register" 
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-base font-medium px-6 py-4 rounded-lg shadow-lg hover:scale-[0.98] transition-all"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/login" 
                  className="flex items-center justify-center gap-2 border border-border text-text-primary text-base font-medium px-6 py-4 rounded-lg hover:bg-surface transition-colors"
                >
                  Schedule Demo
                </Link>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-1">
                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                  <div className="text-center p-8">
                    <ShoppingCart className="w-24 h-24 text-primary mx-auto mb-4" />
                    <p className="text-2xl font-bold text-text-primary">PTLPOS</p>
                    <p className="text-text-secondary">Enterprise Retail Management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Powerful features designed for modern retail businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShoppingCart, title: "POS Terminal", desc: "Fast, intuitive point of sale with barcode scanning and multiple payment methods" },
              { icon: Package, title: "Inventory Management", desc: "Real-time stock tracking, low stock alerts, and automated reordering" },
              { icon: Store, title: "Multi-Branch", desc: "Manage unlimited branches from a single dashboard with centralized control" },
              { icon: Users, title: "Customer CRM", desc: "Build lasting customer relationships with loyalty programs and targeted marketing" },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Data-driven insights with customizable reports and dashboards" },
              { icon: Cloud, title: "Cloud-Based", desc: "Access your business anywhere, anytime from any device" },
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl border border-border-light hover:border-primary hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary-bg rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "500+", label: "Active Businesses" },
              { number: "50K+", label: "Daily Transactions" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-bold">{stat.number}</p>
                <p className="text-primary-bg text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Join hundreds of retailers already using PTLPOS to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-base font-medium px-8 py-4 rounded-lg shadow-lg transition-all"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 border border-border text-text-primary text-base font-medium px-8 py-4 rounded-lg hover:bg-surface transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-border-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">PTLPOS</h3>
              <p className="text-text-secondary text-sm">
                The complete retail management solution for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link href="#" className="hover:text-primary">Features</Link></li>
                <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
            <p>&copy; 2024 PTLPOS. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}