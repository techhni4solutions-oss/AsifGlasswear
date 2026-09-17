import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "800+", label: "Projects Completed" },
  { value: "500+", label: "Happy Clients" },
  { value: "30+", label: "Expert Team" },
];

const WHY_US = [
  { icon: "💎", title: "Premium Materials", desc: "We source only certified grade aluminium profiles and tempered/laminated glass meeting international standards." },
  { icon: "🔧", title: "Expert Installation", desc: "Our certified installation teams have decades of hands-on experience across residential and commercial projects." },
  { icon: "📐", title: "Custom Solutions", desc: "Every project is designed and fabricated to your exact specification — no off-the-shelf compromise." },
  { icon: "⏱️", title: "On-Time Completion", desc: "We plan meticulously and deliver on schedule. Your project timeline is our commitment." },
];

const PROCESS = [
  { num: "01", title: "Consultation", desc: "We listen to your requirements and assess your space." },
  { num: "02", title: "Site Measurement", desc: "Precision survey by our technical team." },
  { num: "03", title: "Quotation", desc: "Detailed, transparent quotation within 48 hours." },
  { num: "04", title: "Fabrication", desc: "Custom manufacturing in our state-of-the-art facility." },
  { num: "05", title: "Installation", desc: "Professional installation with full quality sign-off." },
];

interface Props {
  onMount: () => void;
  onViewProjects: () => void;
  onGetQuote: () => void;
  onProjectClick: (id: number) => void;
}

export default function HomePage({ onMount, onViewProjects, onGetQuote, onProjectClick }: Props) {
  const { projects, services, testimonials, settings, addTestimonial } = useData();
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const activeServices = services.filter((s) => s.status === "Active");
  const publishedTestimonials = testimonials.filter((t) => t.published);

  const cleanPhone = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, "") : "923066426139";
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  useEffect(() => {
    onMount();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTestimonial({
        name: feedbackName,
        project: "Customer Review",
        rating: feedbackRating,
        review: feedbackText,
        published: true
      });
      setFeedbackSubmitted(true);
      setFeedbackName("");
      setFeedbackText("");
      setFeedbackRating(5);
    } catch (err) {
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden" style={{ backgroundColor: "var(--dark-bg)" }}>
        <img
          src="https://images.unsplash.com/photo-1690944851207-3f288c8fcd0b?w=1400&h=900&fit=crop&auto=format"
          alt="Modern glass building facade"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,15,14,0.95) 30%, rgba(15,15,14,0.35) 100%)" }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 pb-48 md:pb-28 pt-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6 border" style={{ borderColor: "rgba(201,169,110,0.3)", color: "var(--gold)", backgroundColor: "rgba(201,169,110,0.08)", fontFamily: "'JetBrains Mono',monospace" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Serving Gujranwala & Punjab Since 2009
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight text-white mb-5">
              {settings.hero_title || "Premium Aluminium & Glass Solutions"}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: "rgba(245,244,240,0.72)" }}>
              {settings.hero_subtitle || "Modern doors, windows, partitions, facades and custom glass solutions — designed and installed with precision."}
            </p>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onGetQuote}
                className="btn-gold px-8 py-4 rounded-xl text-base font-semibold w-full sm:w-auto text-center"
              >
                Get a Free Quote
              </button>
              <button
                onClick={onViewProjects}
                className="px-8 py-4 rounded-xl text-base font-semibold border w-full sm:w-auto text-center transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.9)" }}
              >
                View Projects →
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(15,15,14,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="py-4 px-4 text-center">
                <div className="font-serif text-2xl md:text-3xl text-gold-gradient">{s.value}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(245,244,240,0.45)", fontFamily: "'JetBrains Mono',monospace" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 md:py-24" style={{ backgroundColor: "var(--secondary)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>About Us</div>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">{settings.company_name}</h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
                Founded in Gujranwala, {settings.company_name} has been delivering premium aluminium and glass solutions across Punjab for over 15 years. From our modern workshop on Ghulam Dastagir Khan Road, we have grown into one of Pakistan's most trusted names in architectural glass and aluminium work.
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--muted-foreground)" }}>
                We specialise in custom windows, doors, sliding systems, glass partitions, shop fronts, building facades, shower cabins, and bespoke glass work — serving homeowners, architects, contractors, and commercial clients throughout Pakistan.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Established", value: "2009" },
                  { label: "Location", value: "Gujranwala, Pakistan" },
                  { label: "Specialty", value: "Aluminium & Glass" },
                  { label: "Phone", value: settings.phone },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
                    <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "var(--muted-foreground)" }}>{item.label}</div>
                    <div className="font-semibold text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-square bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1479293581560-aee98bb24f7f?w=800&h=800&fit=crop&auto=format"
                alt={`${settings.company_name} workshop`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.12) 0%, transparent 60%)" }} />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl" style={{ backgroundColor: "rgba(15,15,14,0.85)", backdropFilter: "blur(8px)" }}>
                <div className="text-white font-semibold text-sm mb-0.5">{settings.company_name}</div>
                <div className="text-xs" style={{ color: "rgba(245,244,240,0.6)" }}>{settings.address}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>What We Do</div>
          <h2 className="font-serif text-3xl md:text-5xl" style={{ color: "var(--foreground)" }}>Our Expertise</h2>
          <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: "var(--muted-foreground)" }}>
            From single windows to complete building facades — fully custom, precision-fabricated.
          </p>
        </div>
        {/* Services grid */}
        <div className="flex gap-3 overflow-x-auto snap-x hide-scrollbar md:grid md:grid-cols-5 md:gap-4">
          {activeServices.map((svc) => (
            <div
              key={svc.id}
              className="snap-start flex-shrink-0 w-44 md:w-auto rounded-xl overflow-hidden border group cursor-pointer transition-all hover:-translate-y-1"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
            >
              <div className="aspect-video md:aspect-square overflow-hidden">
                <img src={svc.image} alt={svc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 md:p-4">
                <div className="text-lg mb-1">{svc.icon}</div>
                <div className="font-semibold text-sm leading-tight">{svc.name}</div>
                <div className="text-xs mt-1 leading-relaxed hidden md:block" style={{ color: "var(--muted-foreground)" }}>{svc.description ? svc.description.slice(0, 70) : ''}...</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section id="projects" className="py-16 md:py-24" style={{ backgroundColor: "var(--secondary)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>Portfolio</div>
              <h2 className="font-serif text-3xl md:text-5xl" style={{ color: "var(--foreground)" }}>Our Recent Projects</h2>
            </div>
            <button onClick={onViewProjects} className="hidden md:block text-sm font-medium underline underline-offset-4" style={{ color: "var(--muted-foreground)" }}>
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {featuredProjects.map((proj, i) => (
              <button
                key={proj.id}
                onClick={() => onProjectClick(proj.id)}
                className={`group relative rounded-2xl overflow-hidden text-left ${i === 0 ? "md:row-span-2" : ""}`}
                style={{ minHeight: i === 0 ? "480px" : "220px" }}
              >
                <img
                  src={proj.image}
                  alt={proj.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,15,14,0.92) 0%, rgba(15,15,14,0.08) 60%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="font-mono text-xs mb-2" style={{ color: "var(--gold-light)", opacity: 0.9 }}>{proj.type}</div>
                  <div className="font-serif text-lg md:text-xl text-white leading-tight mb-1">{proj.name}</div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>📍 {proj.location}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <button onClick={onViewProjects} className="btn-gold px-6 py-3 rounded-xl font-semibold text-base w-full max-w-sm mx-auto">View All Projects</button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>Why Asif Glass</div>
          <h2 className="font-serif text-3xl md:text-5xl">Why Choose Us</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {WHY_US.map((w) => (
            <div key={w.title} className="p-6 rounded-2xl border hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <div className="text-3xl mb-4">{w.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{w.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "var(--dark-bg)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>How We Work</div>
            <h2 className="font-serif text-3xl md:text-5xl text-white">Our Process</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-0">
            {PROCESS.map((step, i) => (
              <div key={step.num} className="relative flex-1">
                {i < PROCESS.length - 1 && (
                  <div className="absolute hidden md:block top-7 left-1/2 w-full h-px" style={{ backgroundColor: "rgba(201,169,110,0.2)" }} />
                )}
                <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-3 p-4 md:p-6 md:text-center">
                  {i < PROCESS.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-px md:hidden" style={{ backgroundColor: "rgba(201,169,110,0.2)" }} />
                  )}
                  <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center font-mono text-sm font-bold z-10" style={{ borderColor: "var(--gold)", color: "var(--gold)", backgroundColor: "var(--dark-bg)" }}>
                    {step.num}
                  </div>
                  <div>
                    <div className="font-semibold text-base text-white mb-1">{step.title}</div>
                    <div className="text-sm leading-relaxed" style={{ color: "rgba(245,244,240,0.5)" }}>{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>Client Reviews</div>
          <h2 className="font-serif text-3xl md:text-5xl mb-4">What Our Clients Say</h2>
          <button onClick={() => {
            const el = document.getElementById("feedback-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }} className="text-sm font-medium underline underline-offset-4" style={{ color: "var(--muted-foreground)" }}>
            Leave a Feedback
          </button>
        </div>
        {/* Mobile swipe */}
        <div className="md:hidden">
          {publishedTestimonials.length > 0 && (
            <>
              <div className="rounded-2xl p-6 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
                <div className="flex mb-3" style={{ color: "var(--gold)" }}>{"★".repeat(publishedTestimonials[testimonialIdx]?.rating || 5)}</div>
                <p className="text-base leading-relaxed mb-5">"{publishedTestimonials[testimonialIdx]?.review}"</p>
                <div className="flex items-center gap-3">
                  <img src={publishedTestimonials[testimonialIdx]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format'} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-sm">{publishedTestimonials[testimonialIdx]?.name}</div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{publishedTestimonials[testimonialIdx]?.project}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {publishedTestimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestimonialIdx(i)} className="w-2 h-2 rounded-full transition-all" style={{ backgroundColor: i === testimonialIdx ? "var(--gold)" : "var(--muted)" }} />
                ))}
              </div>
            </>
          )}
        </div>
        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {publishedTestimonials.map((t) => (
            <div key={t.id} className="rounded-2xl p-6 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}>
              <div className="flex mb-3" style={{ color: "var(--gold)" }}>{"★".repeat(t.rating || 5)}</div>
              <p className="text-sm leading-relaxed mb-5">"{t.review}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format'} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{t.project}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      <section id="feedback-section" className="py-16 md:py-24 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>Feedback</div>
          <h2 className="font-serif text-3xl">We value your opinion</h2>
          <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>Please share your feedback so we can improve our services.</p>
        </div>

        {feedbackSubmitted ? (
          <div className="p-8 text-center rounded-2xl border bg-green-50 border-green-200">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-semibold text-lg text-green-800">Thank you for your feedback!</h3>
            <p className="text-sm text-green-700 mt-1">Your review has been submitted.</p>
            <button onClick={() => setFeedbackSubmitted(false)} className="mt-4 text-xs font-semibold text-green-900 underline">Submit another</button>
          </div>
        ) : (
          <form className="flex flex-col gap-4 rounded-2xl p-6 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }} onSubmit={handleFeedbackSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1.5">Your Name *</label>
              <input
                type="text"
                placeholder="Asif Ahmed"
                required
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Rating *</label>
              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                    style={{ color: star <= (hoverRating || feedbackRating) ? "var(--gold)" : "#d1d5db" }}
                    title={`${star} Star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs font-medium ml-2 font-mono" style={{ color: "var(--gold)" }}>
                  {hoverRating || feedbackRating} / 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Your Feedback *</label>
              <textarea
                placeholder="Share your experience with our services..."
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm resize-none"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              ></textarea>
            </div>

            <button type="submit" className="btn-gold py-3.5 rounded-xl font-semibold w-full sm:w-auto self-center px-8">Submit Feedback</button>
          </form>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "var(--dark-bg)" }}>
        <img src="https://images.unsplash.com/photo-1479293581560-aee98bb24f7f?w=1400&h=600&fit=crop&auto=format" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)" }}>Ready to Start?</div>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-5">Have a Project in Mind?</h2>
          <p className="text-lg mb-8" style={{ color: "rgba(245,244,240,0.65)" }}>
            Get a customized quotation for your Aluminium & Glass project. Our team will respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onGetQuote} className="btn-gold px-8 py-4 rounded-xl text-base font-semibold w-full sm:w-auto">
              Get Free Quote
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold whatsapp-btn w-full sm:w-auto"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t" style={{ backgroundColor: "var(--dark-bg)", borderColor: "var(--dark-border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded flex items-center justify-center border" style={{ borderColor: "rgba(201,169,110,0.3)" }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="2" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
                    <rect x="11" y="2" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
                    <rect x="2" y="11" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
                    <rect x="11" y="11" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <div className="font-serif text-base text-white">{settings.company_name}</div>
                  <div className="text-xs tracking-widest uppercase" style={{ color: "var(--gold)", fontFamily: "'JetBrains Mono',monospace", fontSize: "8px" }}>Gujranwala, Pakistan</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-xs mb-4" style={{ color: "rgba(245,244,240,0.5)" }}>
                Premium aluminium and glass solutions for residential and commercial projects in Gujranwala and across Punjab since 2009.
              </p>
              <p className="text-xs" style={{ color: "rgba(245,244,240,0.35)", fontFamily: "'JetBrains Mono',monospace" }}>
                {settings.address}
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-4">Services</div>
              <div className="flex flex-col gap-2">
                {activeServices.slice(0, 6).map((s) => (
                  <span key={s.id} className="text-sm" style={{ color: "rgba(245,244,240,0.45)" }}>{s.name}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-4">Contact</div>
              <div className="flex flex-col gap-3 text-sm" style={{ color: "rgba(245,244,240,0.5)" }}>
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-amber-400 transition-colors">📞 {settings.phone}</a>
                <a href={whatsappUrl} className="hover:text-green-400 transition-colors">💬 {settings.whatsapp}</a>
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors">✉️ {settings.email}</a>
                <span>📍 {settings.address}</span>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: "var(--dark-border)", color: "rgba(245,244,240,0.3)" }}>
            <span>© 2026 {settings.company_name}. All rights reserved. Gujranwala, Pakistan.</span>
            <span>Powered by <a href="https://www.4techsolutions.digital/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">4techsolutions.digital</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
