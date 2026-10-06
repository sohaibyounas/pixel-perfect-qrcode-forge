import { useState, useRef, useEffect } from "react";
import {
  DEFAULT_DESIGN,
  DEFAULT_QR_DATA,
  QRCodeData,
  QRDesign,
} from "@/lib/qr-utils";
import QRCanvas from "@/components/QRCanvas";
import DataInput from "@/components/DataInput";
import DesignCustomizer from "@/components/DesignCustomizer";
import { QRStudioLogo } from "@/components/QRStudioLogo";
import { Toaster } from "sonner";
import {
  QrCode,
  Palette,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Printer,
  ChevronDown,
  Lock,
  Eye,
  ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [qrData, setQrData] = useState<QRCodeData>(DEFAULT_QR_DATA);
  const [design, setDesign] = useState<QRDesign>(DEFAULT_DESIGN);
  const [activeTab, setActiveTab] = useState<"data" | "design">("data");
  const [showFloatingPreview, setShowFloatingPreview] =
    useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDataChange = (newData: QRCodeData) => {
    setQrData(newData);
  };

  const handleDesignChange = (newDesign: QRDesign) => {
    setDesign(newDesign);
  };

  const handleResetDesign = () => {
    setDesign(DEFAULT_DESIGN);
    setQrData(DEFAULT_QR_DATA);
  };

  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Detect scroll to show floating mobile preview button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowFloatingPreview(true);
      } else {
        setShowFloatingPreview(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7FCFA] text-hunt-dark selection:bg-hunt-mint selection:text-hunt-dark font-sans flex flex-col overflow-x-hidden">
      {/* 1. TOP ANNOUNCEMENT BANNER - Mobile Responsive */}
      <div className="bg-hunt-teal text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 text-center font-medium border-b border-hunt-sage/30 flex items-center justify-center gap-1.5 sm:gap-2">
        <span className="bg-hunt-butter text-hunt-dark text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
          100% Free
        </span>
        <span className="truncate">
          No sign-up or paywalls • Unlimited scans • Vector SVG
        </span>
      </div>

      {/* 2. HEADER NAVIGATION - Streamlined for Mobile */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-hunt-mint/50 shadow-2xs">
        <div className="container mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo Brand Mark from Image 2 */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 280, damping: 16 }}
              className="cursor-pointer"
              onClick={handleResetDesign}
            >
              <QRStudioLogo size={34} className="sm:w-10 sm:h-10" />
            </motion.div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-hunt-dark whitespace-nowrap">
                QR Studio
              </span>
              <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-hunt-light text-hunt-teal border border-hunt-mint hidden sm:inline">
                Free
              </span>
            </div>
          </div>

          {/* Quick Nav Links on Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-hunt-dark/80">
            <a
              href="#studio"
              className="hover:text-hunt-teal transition-colors"
            >
              Studio
            </a>
            <a
              href="#comparison"
              className="hover:text-hunt-teal transition-colors"
            >
              Why Free?
            </a>
            <a href="#faq" className="hover:text-hunt-teal transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons with Mobile-Tuned Sizing */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleResetDesign}
              title="Reset to default design"
              className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs font-semibold text-hunt-teal hover:bg-hunt-light rounded-xl border border-hunt-mint/70 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </motion.button>

            {/* Mobile preview jump pill */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={scrollToPreview}
              className="lg:hidden h-8 sm:h-9 px-3 bg-hunt-teal hover:bg-hunt-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shadow-hunt-teal/20 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 3. HERO INTRO - Mobile Responsive Typography */}
      <section className="pt-6 sm:pt-10 pb-5 sm:pb-8 px-3 sm:px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-hunt-light border border-hunt-mint text-[11px] sm:text-xs font-semibold text-hunt-teal shadow-2xs max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-hunt-sage flex-shrink-0" />
            <span className="truncate"> 100% Client-Side</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-hunt-dark tracking-tight leading-tight">
            Create Custom QR Codes with <br className="hidden sm:block" />
            <span className="text-hunt-teal bg-gradient-to-r from-hunt-teal via-hunt-sage to-hunt-teal bg-clip-text text-transparent">
              Precision Gradients & Vector Export
            </span>
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Customize body shapes, finder eyes, brand logos, and call-to-action
            ribbons. Download in crystal clear high-resolution PNG, scalable
            vector SVG, or print-ready PDF.
          </p>

          {/* Key Value Badges */}
          <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs font-medium text-hunt-dark/90">
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-hunt-mint/60 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-hunt-sage" /> No
              Paywalls or Expirations
            </span>
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-hunt-mint/60 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-hunt-teal" /> 100% Private (Runs
              in Browser)
            </span>
            <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-hunt-mint/60 shadow-2xs">
              <Printer className="w-3.5 h-3.5 text-hunt-sage" /> 300 DPI Vector
              SVG & PDF
            </span>
          </div>
        </motion.div>
      </section>

      {/* 4. MAIN WORKBENCH / STUDIO */}
      <main id="studio" className="container mx-auto px-3 sm:px-6 pb-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* LEFT COLUMN: CUSTOMIZATION WORKBENCH (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="lg:col-span-7 space-y-4"
          >
            {/* Step Switcher: Data vs Design */}
            <div className="flex rounded-2xl bg-white p-1 border border-hunt-mint/50 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("data")}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "data"
                    ? "bg-hunt-teal text-white shadow-sm shadow-hunt-teal/20"
                    : "text-muted-foreground hover:text-hunt-dark hover:bg-hunt-light/40"
                }`}
              >
                <QrCode className="w-4 h-4 flex-shrink-0" />
                <span>1. Content & Type</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 hidden sm:inline font-mono">
                  {qrData.type.toUpperCase()}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("design")}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "design"
                    ? "bg-hunt-teal text-white shadow-sm shadow-hunt-teal/20"
                    : "text-muted-foreground hover:text-hunt-dark hover:bg-hunt-light/40"
                }`}
              >
                <Palette className="w-4 h-4 flex-shrink-0" />
                <span>2. Style & Branding</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-hunt-butter/30 text-hunt-dark font-mono hidden sm:inline">
                  {design.useGradient ? "GRADIENT" : "SOLID"}
                </span>
              </button>
            </div>

            {/* Active Workspace View */}
            <AnimatePresence mode="wait">
              {activeTab === "data" ? (
                <motion.div
                  key="data-panel"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <DataInput data={qrData} onDataChange={handleDataChange} />

                  {/* Next Step Callout */}
                  <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-hunt-mint/50 flex items-center justify-between shadow-2xs gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-hunt-dark">
                        Ready to style your QR code?
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Add brand colors, logo emblems, or frame ribbons.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab("design")}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-hunt-light text-hunt-teal font-bold text-xs border border-hunt-mint hover:bg-hunt-mint/30 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      <span>Customize</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="design-panel"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <DesignCustomizer
                    design={design}
                    onDesignChange={handleDesignChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT COLUMN: STICKY LIVE PREVIEW & EXPORT (5 cols) */}
          <motion.div
            ref={previewRef}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-5 lg:sticky lg:top-24 space-y-4"
          >
            <div className="p-4 sm:p-6 bg-white rounded-3xl border border-hunt-mint/50 shadow-lg shadow-teal-950/5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-hunt-mint/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-hunt-dark tracking-tight">
                    Real-Time Studio Preview
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-hunt-sage bg-hunt-light px-2.5 py-0.5 rounded-full border border-hunt-mint/40">
                  Live Sync
                </span>
              </div>

              {/* The QR Canvas Component */}
              <QRCanvas qrData={qrData} design={design} />
            </div>

            {/* Quick Tips Callout */}
            <div className="p-4 rounded-2xl bg-hunt-light/80 border border-hunt-mint/50 text-xs space-y-1.5">
              <div className="font-bold text-hunt-dark flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-hunt-teal" />
                <span>Camera Scan Guarantee</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                QR Studio automatically calculates error correction levels and
                contrast ratios so your QR codes scan reliably from print,
                packaging, and digital screens.
              </p>
            </div>
          </motion.div>
        </div>

        {/* 5. WHY QR STUDIO BEATS PAID GENERATORS (COMPARISON) */}
        <section
          id="comparison"
          className="mt-16 sm:mt-20 pt-8 sm:pt-10 border-t border-hunt-mint/40"
        >
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2 px-2">
            <span className="text-xs font-bold text-hunt-teal uppercase tracking-wider bg-hunt-light px-3 py-1 rounded-full border border-hunt-mint">
              Honest Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-hunt-dark">
              Why QR Studio Beats Costly Paid Services
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Services like QR.io and QR-Code-Generator charge $12 to $25 per
              month or disable your QR codes after 50 scans. We believe static
              QR code creation should be completely free, private, and
              unlimited.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-hunt-mint/50 bg-white shadow-xs max-w-4xl mx-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
              <thead className="bg-hunt-light/70 text-hunt-dark font-bold border-b border-hunt-mint/40">
                <tr>
                  <th className="p-3 sm:p-4">Feature</th>
                  <th className="p-3 sm:p-4 text-hunt-teal font-black bg-hunt-mint/20">
                    QR Studio
                  </th>
                  <th className="p-3 sm:p-4 text-muted-foreground">
                    QR.io ($15/mo)
                  </th>
                  <th className="p-3 sm:p-4 text-muted-foreground">
                    QR-Code-Gen ($12/mo)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hunt-mint/20 text-hunt-dark/90">
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">Monthly Cost</td>
                  <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-hunt-mint/10">
                    100% Free Forever
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    $15 / month
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    $12 / month
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">Scan Limits</td>
                  <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-hunt-mint/10">
                    Unlimited Scans
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Capped or Disabled
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Limited free scans
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">
                    Vector SVG Export
                  </td>
                  <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-hunt-mint/10">
                    Free Scalable Vector
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Paid tier only
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Paid tier only
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">
                    Print-Ready 300 DPI PDF
                  </td>
                  <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-hunt-mint/10">
                    Included Free
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Upgrade required
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Upgrade required
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">
                    Account & Sign-up
                  </td>
                  <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-hunt-mint/10">
                    No Sign-up Ever
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Requires registration
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Requires registration
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">User Privacy</td>
                  <td className="p-3 sm:p-4 font-bold text-emerald-700 bg-hunt-mint/10">
                    100% Client Browser
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Tracked via server
                  </td>
                  <td className="p-3 sm:p-4 text-muted-foreground">
                    Tracked via server
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. POPULAR USE CASES SHOWCASE */}
        <section className="mt-16 sm:mt-20">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2 px-2">
            <h2 className="text-2xl sm:text-3xl font-black text-hunt-dark">
              Engineered for Every Use Case
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything you need for hospitality, retail packaging, events, and
              personal branding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                icon: "🍽️",
                title: "Restaurant Menus & Reorders",
                desc: 'Print durable contactless menus. Use table numbers or online ordering URLs with custom "SCAN FOR MENU" banners.',
              },
              {
                icon: "💼",
                title: "vCard & Digital Business Cards",
                desc: "Share contact information instantly at trade shows. Saves name, phone, email, and company into phone address books.",
              },
              {
                icon: "📶",
                title: "Instant Guest WiFi Connect",
                desc: "No more typing 20-character complex passwords. Guests scan and join your secure network with 1 tap.",
              },
              {
                icon: "🎟️",
                title: "Events, Tickets & Check-in",
                desc: "Encode calendar invitations, RSVP links, and conference venue Google Maps locations.",
              },
              {
                icon: "💬",
                title: "WhatsApp Direct Chat Links",
                desc: "Enable customers to message your sales or support line with pre-filled inquiry text.",
              },
              {
                icon: "🪙",
                title: "Crypto Payments & Tip Jars",
                desc: "Receive Bitcoin, Ethereum, and USDT directly without error-prone wallet address typing.",
              },
            ].map((uc) => (
              <motion.div
                key={uc.title}
                whileHover={{ y: -3 }}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-hunt-mint/50 shadow-2xs hover:border-hunt-teal/60 transition-all space-y-2"
              >
                <div className="text-3xl mb-1">{uc.icon}</div>
                <h3 className="text-sm font-bold text-hunt-dark">{uc.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {uc.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="mt-16 sm:mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 space-y-2 px-2">
            <h2 className="text-2xl sm:text-3xl font-black text-hunt-dark">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Clear answers to help you print and distribute with confidence.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Do these QR codes ever expire?",
                a: "No! All QR codes generated here are standard static QR codes that directly encode your text or URL. They will work forever without any expiration date or subscription check.",
              },
              {
                q: "Is there a limit on how many scans I can get?",
                a: "There are zero scan limits. Unlike services that cap free accounts at 50 or 100 scans, our QR codes are scanned directly by camera software without routing through middleman tracking servers.",
              },
              {
                q: "Can I use these QR codes for commercial projects?",
                a: "Yes, 100%! You are completely free to print them on products, billboards, restaurant menus, flyers, business cards, and digital advertisements.",
              },
              {
                q: "What format should I use for high-quality printing?",
                a: "For professional print shops, we recommend downloading the Vector SVG or the 300 DPI PDF document. If you need an image file, use the 2000px Ultra resolution PNG.",
              },
              {
                q: "Why is a protective background needed around the logo?",
                a: "QR codes rely on a grid matrix to decode data. When you place a logo in the center, clearing the modules immediately behind the logo ensures cameras can cleanly separate the logo from data points, maintaining 100% scan accuracy.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-4 rounded-2xl bg-white border border-hunt-mint/50 shadow-2xs cursor-pointer transition-all open:border-hunt-teal/60"
              >
                <summary className="font-bold text-xs sm:text-sm text-hunt-dark flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-hunt-sage transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-hunt-mint/20">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Mobile Preview Button */}
      <AnimatePresence>
        {showFloatingPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="lg:hidden fixed bottom-5 right-5 z-50"
          >
            <button
              onClick={scrollToPreview}
              className="flex items-center gap-2 px-4 py-2.5 bg-hunt-teal hover:bg-hunt-dark text-white rounded-full font-bold text-xs shadow-lg shadow-teal-900/25 border border-white/20 cursor-pointer active:scale-95 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. CRAFTED FOOTER */}
      <footer className="bg-white border-t border-hunt-mint/50 py-8 sm:py-10 mt-auto">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <QRStudioLogo size={32} />
              <div>
                <span className="font-bold text-sm text-hunt-dark">
                  QR Studio
                </span>
                <p className="text-[11px] text-muted-foreground">
                  High-precision QR engineering with zero paywalls.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground font-medium">
              <a
                href="#studio"
                className="hover:text-hunt-teal transition-colors"
              >
                Generator Studio
              </a>
              <a
                href="#comparison"
                className="hover:text-hunt-teal transition-colors"
              >
                Comparison
              </a>
              <a href="#faq" className="hover:text-hunt-teal transition-colors">
                FAQ
              </a>
              <span className="text-hunt-mint hidden sm:inline">•</span>
              <span className="text-hunt-sage hidden sm:inline">
                Color Hunt Palette #287A74 / #55A9A0 / #AEEED3 / #FFF8B0
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-center md:text-right">
              <p>
                © {new Date().getFullYear()} QR Studio. Crafted with precision &
                ❤️
              </p>
              <p className="text-[11px] text-hunt-sage mt-0.5">
                Free resources • 100% Client-side secure
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default Index;
