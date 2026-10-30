import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import {
  ArrowDown,
  ArrowRight,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  IceCreamBowl,
  Mail,
  MapPin,
  Menu,
  Milk,
  Phone,
  Play,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Wheat,
  X,
} from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const img = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;

const photos = {
  heroCone: img("cone-hero.webp"),
  emptyCone: img("cone-empty.webp"),
  family: img("deal-family.webp"),
  sundae: img("deal-date.webp"),
  parlour: img("parlour.webp"),
  bogo: img("bogo-badge.svg"),
};

const scoops = {
  pista: img("scoop-pistachio.webp"),
  mango: img("scoop-mango.webp"),
  rajbhog: img("scoop-coffee.webp"),
  berry: img("scoop-strawberry.webp"),
  mawa: img("scoop-meetha.webp"),
  choco: img("scoop-cocoa.webp"),
};

const toppings = {
  strawberry: img("topping-strawberry.webp"),
  pista: img("topping-pistachio.webp"),
  wafer: img("topping-waffle.webp"),
  chocolate: img("topping-chocolate.webp"),
};

const flavours = [
  { name: "Kesar Pista", price: 55, tone: "pista", badge: "Bestseller" },
  { name: "Alphonso Mango", price: 50, tone: "mango", badge: "Seasonal" },
  { name: "Rajbhog Royale", price: 65, tone: "rajbhog", badge: "New" },
  { name: "Berry Bliss", price: 60, tone: "berry", badge: "Kids' Pick" },
  { name: "Mawa Badam", price: 65, tone: "mawa", badge: "Bestseller" },
  { name: "Choco Chip Crunch", price: 60, tone: "choco", badge: "Seasonal" },
] as const;

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function Logo({ full = false }: { full?: boolean }) {
  return (
    <a href="/" className={full ? "logo logo-full" : "logo"} aria-label="Kathiyawad Ice Cream home">
      <img src={img(full ? "logo-kathiyawad-full.png" : "logo-kathiyawad.png")} alt="Kathiyawad Ice Cream" />
    </a>
  );
}

function Header({ cart }: { cart: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = ["Home", "Our Story", "Flavours", "Outlets", "Contact"];
  const href = (label: string) =>
    label === "Home" ? "/" : label === "Our Story" ? "/about" : `/${label.toLowerCase().replace(" ", "-")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={scrolled ? "site-header scrolled" : "site-header"}>
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a href={href(link)} key={link}>
              {link}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="button small desktop-order" href="#bestsellers">
            Order now
          </a>
          <button className="icon-button cart-button" aria-label={`${cart} items in cart`}>
            <ShoppingBag size={21} />
            <span>{cart}</span>
          </button>
          <button className="icon-button mobile-menu-button" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}>
            <div className="mobile-menu-top">
              <Logo />
              <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X />
              </button>
            </div>
            <nav>
              {links.map((link, i) => (
                <motion.a
                  href={href(link)}
                  key={link}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <span>0{i + 1}</span> {link}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SectionTitle({ eyebrow, script, children }: { eyebrow: string; script?: string; children: React.ReactNode }) {
  return (
    <div className="section-title">
      <span className="script">{script ?? eyebrow.charAt(0) + eyebrow.slice(1).toLowerCase()}</span>
      <h2>{children}</h2>
    </div>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.section>
  );
}

/** Layered outline text — the copies drift apart as the heading scrolls into view. */
function Stroked({ children, tone = "pop" }: { children: React.ReactNode; tone?: "pop" | "warm" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 55%"] });
  const near = useTransform(scrollYProgress, (v) => `translate(${v * 0.045}em, ${v * 0.045}em)`);
  const far = useTransform(scrollYProgress, (v) => `translate(${v * 0.09}em, ${v * 0.09}em)`);
  return (
    <span ref={ref} className={`stroked stroked-${tone}`}>
      <span className="stroked-front">{children}</span>
      <motion.span aria-hidden="true" className="stroked-layer layer-near" style={{ transform: near }}>{children}</motion.span>
      <motion.span aria-hidden="true" className="stroked-layer layer-far" style={{ transform: far }}>{children}</motion.span>
    </span>
  );
}

function CurvedTitle({ script, text }: { script: string; text: string }) {
  return (
    <div className="curved-title">
      <span className="script">{script}</span>
      <svg viewBox="0 0 1000 230" role="img" aria-label={text}>
        <path id="curved-title-path" d="M 70 215 Q 500 10 930 215" fill="none" />
        {["far", "near", "front"].map((layer, i) => (
          <text key={layer} className={`curve-${layer}`} transform={`translate(${(2 - i) * 5} ${(2 - i) * 5})`}>
            <textPath href="#curved-title-path" startOffset="50%" textAnchor="middle">{text}</textPath>
          </text>
        ))}
      </svg>
    </div>
  );
}

function ParallaxPanel({ src, alt, kicker, title, text, link, side }: { src: string; alt: string; kicker: string; title: string; text: string; link: string; side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <div ref={ref} className={`parallax-panel ${side}`}>
      <motion.img src={src} alt={alt} loading="lazy" style={{ y }} />
      <motion.div className="parallax-card" initial={{ y: 70, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <span>{kicker}</span>
        <h3>{title}</h3>
        <p>{text}</p>
        <a className="button" href="#outlets">{link} <ArrowRight size={18} /></a>
      </motion.div>
    </div>
  );
}

/** Pinned scroll scene: a red shape spins open to fill the screen, then the scoops parade across. */
function Indulgence() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bgScale = useTransform(scrollYProgress, [0, 0.32], [0.18, 1]);
  const bgRotate = useTransform(scrollYProgress, [0, 0.32], [-165, 0]);
  const bgRadius = useTransform(scrollYProgress, [0, 0.32], ["46%", "0%"]);
  const titleScale = useTransform(scrollYProgress, [0, 0.3], [0.7, 1]);
  const titleY = useTransform(scrollYProgress, [0.3, 0.5], ["0vh", "-26vh"]);
  const track = useTransform(scrollYProgress, [0.36, 1], [0, 1]);
  const trackTransform = useTransform(track, (t) => `translateX(calc(${(1 - t) * 100}vw - ${t * 100}%))`);
  const items = [
    ["Kesar Pista", scoops.pista], ["Alphonso Mango", scoops.mango], ["Berry Bliss", scoops.berry],
    ["Rajbhog Royale", scoops.rajbhog], ["Mawa Badam", scoops.mawa], ["Choco Chip Crunch", scoops.choco],
  ];
  return (
    <section ref={ref} className="indulgence" aria-label="Unlock a world full of indulgence">
      <div className="indulgence-sticky">
        <motion.div className="indulgence-bg" style={{ scale: bgScale, rotate: bgRotate, borderRadius: bgRadius }} />
        <motion.h2 style={{ scale: titleScale, y: titleY }}>
          Unlock a world <br /> full of indulgence
        </motion.h2>
        <motion.div className="indulgence-track" style={{ transform: trackTransform }}>
          {items.map(([name, src]) => (
            <figure key={name}>
              <img src={src} alt={`${name} scoop`} loading="lazy" />
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const heroSlides = [
  {
    theme: "berry",
    kind: "cone",
    kicker: "Handcrafted in Gujarat",
    line1: "Scooped with",
    accent: "love.",
    text: "Small-batch ice cream churned with pure milk, real ingredients, and a generous spoonful of Gujarati warmth.",
    main: photos.heroCone,
    alt: "A waffle cone with mango, strawberry and pistachio scoops",
    toppings: [toppings.strawberry, toppings.pista, toppings.wafer, toppings.chocolate],
    note: ["100+", "joyful flavours"],
  },
  {
    theme: "mango",
    kind: "scoop",
    kicker: "Summer's golden favourite",
    line1: "Mango made",
    accent: "magical.",
    text: "Ripe Alphonso pulp folded into fresh cream — sunshine in every single spoonful, only while the season lasts.",
    main: scoops.mango,
    alt: "A scoop of Alphonso mango ice cream",
    toppings: [toppings.wafer, toppings.pista, scoops.berry, toppings.chocolate],
    note: ["₹50", "Alphonso Mango"],
  },
  {
    theme: "mawa",
    kind: "scoop",
    kicker: "Real milk. Real joy.",
    line1: "Taste the",
    accent: "good stuff.",
    text: "Slow-cooked mawa, roasted almonds and crunchy caramel bites in our richest, creamiest scoop yet.",
    main: scoops.mawa,
    alt: "A scoop of Mawa Badam ice cream with almonds",
    toppings: [toppings.chocolate, toppings.pista, toppings.wafer, toppings.strawberry],
    note: ["₹65", "Mawa Badam"],
  },
];

type HeroSlideData = (typeof heroSlides)[number];

const heroCopy = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.1, duration: 0.55, ease: "easeOut" as const } }),
};

function HeroArt({ slide }: { slide: HeroSlideData }) {
  return (
    <div className={`ice-art art-${slide.kind}`} role="img" aria-label={slide.alt}>
      <motion.span className="art-circle" variants={{ hidden: { scale: 0.55, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } } }} />
      <motion.img className="art-main" src={slide.main} alt="" variants={{ hidden: { y: -140, opacity: 0, rotate: -10 }, show: { y: 0, opacity: 1, rotate: 0, transition: { type: "spring", bounce: 0.42, delay: 0.15 } } }} />
      {slide.toppings.map((src, i) => (
        <motion.span className={`floating-piece p-${i}`} key={i} variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { delay: 0.5 + i * 0.09, type: "spring", bounce: 0.5 } } }}>
          <img src={src} alt="" />
        </motion.span>
      ))}
    </div>
  );
}

function HeroSlide({ slide, index, show }: { slide: HeroSlideData; index: number; show: boolean }) {
  const Title = index === 0 ? "h1" : "h2";
  return (
    <motion.div className="hero-grid" initial="hidden" animate={show ? "show" : "hidden"}>
      <div className="hero-copy">
        <motion.span className="eyebrow" custom={0} variants={heroCopy}>{slide.kicker}</motion.span>
        <motion.div custom={1} variants={heroCopy}>
          <Title className="hero-title">
            {slide.line1} <Stroked>{slide.accent}</Stroked>
          </Title>
        </motion.div>
        <motion.p custom={2} variants={heroCopy}>{slide.text}</motion.p>
        <motion.div className="hero-buttons" custom={3} variants={heroCopy}>
          <a className="button" href="#bestsellers">
            Explore flavours <ArrowRight size={18} />
          </a>
          <a className="button button-outline" href="#outlets">
            Find an outlet
          </a>
        </motion.div>
      </div>
      <div className="hero-visual">
        <HeroArt slide={slide} />
        <motion.div className="hero-note" variants={{ hidden: { opacity: 0, y: 20, rotate: 3 }, show: { opacity: 1, y: 0, rotate: 3, transition: { delay: 0.85 } } }}>
          <Sparkles size={18} />
          <strong>{slide.note[0]}</strong>
          <span>{slide.note[1]}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Hero({ ready }: { ready: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        className="hero-swiper"
      >
        {heroSlides.map((slide, i) => (
          <SwiperSlide key={slide.accent} className={`hero-slide theme-${slide.theme}`}>
            <HeroSlide slide={slide} index={i} show={ready && i === active} />
          </SwiperSlide>
        ))}
      </Swiper>
      <a className="scroll-down" href="#marquee" aria-label="Scroll down">
        <svg className="spin-text" viewBox="0 0 100 100" aria-hidden="true">
          <path id="scroll-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" fill="none" />
          <text><textPath href="#scroll-circle">SCROLL DOWN • SCROLL DOWN • </textPath></text>
        </svg>
        <ArrowDown />
      </a>
    </section>
  );
}

function Marquee() {
  const rows = [
    { label: "Scoops", tone: "pill-pink", items: [["Kesar Pista", scoops.pista], ["Alphonso Mango", scoops.mango], ["Rajbhog", scoops.rajbhog], ["Berry Bliss", scoops.berry], ["Mawa Badam", scoops.mawa], ["Choco Chip", scoops.choco]] },
    { label: "Take Home", tone: "pill-sky", items: [["Family Packs", scoops.rajbhog], ["Party Tubs", scoops.berry], ["Kulfi", scoops.mawa], ["Waffle Cones", photos.heroCone], ["Sundaes", scoops.pista], ["Bulk Packs", scoops.choco]] },
  ];
  return (
    <section id="marquee" className="marquee-wrap" aria-label="Popular flavours">
      {rows.map((row, r) => (
        <div className={r ? "marquee-row reverse" : "marquee-row"} key={row.label}>
          <span className={`marquee-pill ${row.tone}`}>{row.label}</span>
          <div className="marquee-track">
            <div className="marquee-inner">
              {[...row.items, ...row.items].map(([name, src], i) => (
                <span className="marquee-item" key={i} aria-hidden={i >= row.items.length}>
                  <img src={src} alt="" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function StatsPromises() {
  const stats = [
    ["25+", "Categories"],
    ["100+", "Flavours"],
    ["10+", "Sweet years"],
    ["50K+", "Happy smiles"],
  ];
  const promises = [
    [Milk, "Pure Milk", "Sourced fresh from trusted local dairies."],
    [Wheat, "No Shortcuts", "Patiently churned for a silkier scoop."],
    [Sparkles, "Fresh Every Day", "Made in small, joyful batches."],
    [Heart, "Made with Care", "Ingredients we proudly serve family."],
  ] as const;
  return (
    <Reveal className="section promises-section">
      <div className="container">
        <div className="stats">
          {stats.map(([number, label]) => (
            <div key={label}>
              <strong><Stroked tone="warm">{number}</Stroked></strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <SectionTitle eyebrow="OUR PROMISE">
          Goodness in <Stroked>every scoop.</Stroked>
        </SectionTitle>
        <div className="promise-grid">
          {promises.map(([Icon, title, text]) => (
            <article className="promise-card" key={title}>
              <div className="promise-icon">
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function ProductVisual({ tone, name }: { tone: keyof typeof scoops; name: string }) {
  return (
    <div className={`product-visual ${tone}`}>
      <img src={scoops[tone]} alt={`${name} scoop`} loading="lazy" />
    </div>
  );
}

function Bestsellers({ onAdd }: { onAdd: () => void }) {
  return (
    <Reveal className="section bestsellers" >
      <div className="container" id="bestsellers">
        <div className="title-row">
          <SectionTitle eyebrow="MOST LOVED">
            Meet our <Stroked>crowd pleasers.</Stroked>
          </SectionTitle>
          <div className="slider-arrows">
            <button className="icon-button best-prev" aria-label="Previous flavour"><ChevronLeft /></button>
            <button className="icon-button best-next" aria-label="Next flavour"><ChevronRight /></button>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{ prevEl: ".best-prev", nextEl: ".best-next" }}
          autoplay={{ delay: 2600, disableOnInteraction: false }}
          loop
          spaceBetween={18}
          breakpoints={{ 0: { slidesPerView: 1.15 }, 640: { slidesPerView: 2.15 }, 960: { slidesPerView: 3 }, 1200: { slidesPerView: 4 } }}
        >
          {flavours.map((item) => (
            <SwiperSlide key={item.name}>
              <article className="product-card">
                <span className="badge">{item.badge}</span>
                <ProductVisual tone={item.tone} name={item.name} />
                <h3>{item.name}</h3>
                <p>Rich, creamy and unmistakably indulgent.</p>
                <div className="product-bottom">
                  <strong>₹{item.price} <small>/ 110 ml</small></strong>
                  <button className="add-button" onClick={onAdd}>Add +</button>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Reveal>
  );
}

type FlavourTone = (typeof flavours)[number]["tone"];

const flavourStories: Record<FlavourTone, { bg: string; ink: string; note: string; meters: [number, number, number] }> = {
  pista: { bg: "#d3e9a8", ink: "#3f3a12", note: "Saffron-kissed milk with a fistful of roasted pistachios in every bite.", meters: [86, 64, 58] },
  mango: { bg: "#ffc94a", ink: "#5a3410", note: "Ripe Alphonso pulp churned into cream — pure Gujarati summer.", meters: [72, 82, 12] },
  rajbhog: { bg: "#f2c48d", ink: "#5a3018", note: "A royal mix of kesar, cardamom and dry fruits, slow-churned for festivals.", meters: [80, 74, 66] },
  berry: { bg: "#f9b8c7", ink: "#62182c", note: "Juicy strawberries swirled through a light, tangy cream base.", meters: [68, 78, 18] },
  mawa: { bg: "#f6e3b4", ink: "#5a3a1c", note: "Slow-cooked mawa, roasted almonds and caramel crunch — our richest scoop.", meters: [95, 70, 76] },
  choco: { bg: "#5b3424", ink: "#fff7ca", note: "Dark cocoa cream loaded with crunchy chocolate chips.", meters: [88, 66, 72] },
};

const sprinkleColours = ["#f00540", "#fca081", "#8fd8f5", "#ffd23f", "#fff", "#b98af0"];

/** Spin-the-wheel flavour picker: the dial turns, the section floods with the flavour's colour. */
function FlavourWheel({ onAdd }: { onAdd: () => void }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [added, setAdded] = useState(false);
  const reduced = useReducedMotion();
  const count = flavours.length;
  const angle = 360 / count;
  const index = ((step % count) + count) % count;
  const active = flavours[index];
  const story = flavourStories[active.tone];
  const sprinkles = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({ left: (i * 37) % 100, delay: -((i * 1.7) % 9), duration: 7 + ((i * 13) % 6), rotate: (i * 47) % 180, colour: sprinkleColours[i % sprinkleColours.length] })),
    [],
  );

  useEffect(() => {
    if (paused || reduced) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 3800);
    return () => clearTimeout(timer);
  }, [step, paused, reduced]);

  const select = (i: number) => {
    const delta = ((i - index + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
    setStep((s) => s + delta);
  };
  const add = () => {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.section
      className="section flavour-wheel"
      animate={{ backgroundColor: story.bg, color: story.ink }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="sprinkle-rain" aria-hidden="true">
        {sprinkles.map((sp, i) => (
          <span key={i} style={{ left: `${sp.left}%`, background: sp.colour, animationDelay: `${sp.delay}s`, animationDuration: `${sp.duration}s`, rotate: `${sp.rotate}deg` }} />
        ))}
      </div>
      <div className="container wheel-layout">
        <div className="wheel-copy">
          <SectionTitle eyebrow="SPIN THE WHEEL">
            Find your <Stroked>flavour mood.</Stroked>
          </SectionTitle>
          <div className="wheel-info" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={active.name} initial="hidden" animate="show" exit="exit">
                <motion.span className="wheel-badge" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}>{active.badge}</motion.span>
                <h3 className="wheel-name" aria-label={active.name}>
                  {active.name.split(" ").map((word, w, words) => {
                    const offset = words.slice(0, w).join(" ").length + (w ? 1 : 0);
                    return (
                      <span className="wheel-word" key={w} aria-hidden="true">
                        {word.split("").map((ch, i) => (
                          <motion.span
                            key={i}
                            variants={{ hidden: { y: "0.9em", opacity: 0, rotate: 12 }, show: { y: 0, opacity: 1, rotate: 0, transition: { delay: (offset + i) * 0.03, type: "spring", bounce: 0.45 } }, exit: { y: "-0.6em", opacity: 0, transition: { duration: 0.18 } } }}
                          >
                            {ch}
                          </motion.span>
                        ))}
                      </span>
                    );
                  })}
                </h3>
                <motion.p variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { delay: 0.25 } }, exit: { opacity: 0 } }}>{story.note}</motion.p>
              </motion.div>
            </AnimatePresence>
            <div className="taste-meters">
              {["Creaminess", "Sweetness", "Crunch"].map((label, i) => (
                <div className="meter" key={label}>
                  <span>{label}</span>
                  <div className="meter-track">
                    <motion.i animate={{ width: `${story.meters[i]}%` }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 * i }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="wheel-actions">
              <strong>₹{active.price} <small>/ 110 ml</small></strong>
              <button className="button" onClick={add}>
                {added ? <>Added <Check size={18} /></> : <>Add to order <ShoppingBag size={18} /></>}
              </button>
            </div>
          </div>
        </div>

        <div className="wheel-stage">
          <div className="wheel">
            <span className="wheel-pointer" aria-hidden="true" />
            <motion.div className="wheel-ring" animate={{ rotate: -step * angle }} transition={{ type: "spring", stiffness: 55, damping: 14 }}>
              {flavours.map((f, i) => (
                <div className="wheel-slot" key={f.name} style={{ transform: `rotate(${i * angle}deg) translateY(calc(var(--wheel-r) * -1))` }}>
                  <motion.button
                    className={i === index ? "wheel-thumb active" : "wheel-thumb"}
                    animate={{ rotate: step * angle - i * angle, scale: i === index ? 1.22 : 1 }}
                    transition={{ type: "spring", stiffness: 55, damping: 14 }}
                    onClick={() => select(i)}
                    aria-label={`Show ${f.name}`}
                    aria-pressed={i === index}
                  >
                    <img src={scoops[f.tone]} alt="" />
                  </motion.button>
                </div>
              ))}
            </motion.div>
            <div className="wheel-centre">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={active.name}
                  src={scoops[active.tone]}
                  alt={`${active.name} scoop`}
                  initial={{ scale: 0.2, rotate: -120, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.2, rotate: 120, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                />
              </AnimatePresence>
            </div>
          </div>
          <div className="wheel-controls">
            <button className="icon-button" onClick={() => setStep((s) => s - 1)} aria-label="Previous flavour"><ChevronLeft /></button>
            <span>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
            <button className="icon-button" onClick={() => setStep((s) => s + 1)} aria-label="Next flavour"><ChevronRight /></button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Categories() {
  const items = [
    ["Cups", "24 treats", "cup", scoops.berry], ["Cones", "18 treats", "cone", photos.heroCone], ["Family Packs", "14 treats", "pack", scoops.rajbhog],
    ["Kulfi", "12 treats", "kulfi", scoops.mawa], ["Candies", "9 treats", "candy", scoops.mango], ["Sundaes", "16 treats", "sundae", scoops.pista], ["Bulk Packs", "8 sizes", "bulk", scoops.choco],
  ];
  return (
    <Reveal className="section categories">
      <div className="container">
        <SectionTitle eyebrow="THE WORLD OF MITHO" script="The world of Mitho">
          Every kind of <Stroked>happy.</Stroked>
        </SectionTitle>
        <div className="category-grid">
          {items.map(([name, count, kind, image], i) => (
            <motion.a href={`/flavours?category=${encodeURIComponent(name)}`} className={`category-card category-${kind}`} key={name} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <div className="category-product"><img src={image} alt="" loading="lazy" /></div>
              <span>{count}</span><h3>{name}</h3><ArrowRight />
            </motion.a>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Process() {
  const steps = [[Milk, "Fresh milk"], [Clock3, "Slow churn"], [Sparkles, "Real ingredients"], [IceCreamBowl, "Frozen fresh"]] as const;
  return (
    <Reveal className="section process">
      <div className="container">
        <SectionTitle eyebrow="FROM DAIRY TO DELIGHT">
          Made slowly. Loved <Stroked>instantly.</Stroked>
        </SectionTitle>
        <div className="timeline">
          <motion.div className="timeline-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
          {steps.map(([Icon, label], i) => (
            <div className="process-step" key={label}><span>0{i + 1}</span><div><Icon /></div><h3>{label}</h3></div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function OffersExperience() {
  return (
    <>
      <div className="offer-ribbon"><span>{"SPECIAL OFFER • SPECIAL OFFER • SPECIAL OFFER • ".repeat(4)}</span></div>
      <Reveal className="section offers">
        <div className="container offer-grid">
          <article className="offer-card big">
            <img className="offer-photo" src={photos.family} alt="A family sharing tubs of ice cream at home" loading="lazy" />
            <img className="bogo-badge" src={photos.bogo} alt="Buy 1 get 1 free" />
            <p>DOUBLE THE JOY</p><h2>Buy 1, get 1 on family packs.</h2><a href="#bestsellers" className="button button-cream">Grab the offer</a>
          </article>
          <article className="offer-card party">
            <img className="party-scoop" src={scoops.berry} alt="" loading="lazy" />
            <p>CELEBRATE BIG</p><h2>Party & wedding orders</h2><span>Custom carts, live counters and tubs for every kind of gathering.</span><a href="/contact" className="button button-outline">Plan your event</a>
          </article>
        </div>
      </Reveal>
      <Reveal className="section experience">
        <div className="container">
          <SectionTitle eyebrow="BEYOND THE SCOOP">
            Come for dessert. Stay for <Stroked>the feeling.</Stroked>
          </SectionTitle>
        </div>
        <ParallaxPanel side="right" src={photos.sundae} alt="Two friends sharing a big ice cream sundae" kicker="The tasting bar" title="A little adventure in every bowl." text="Sample small-batch specials, build sundae flights, and discover your next favourite flavour." link="Explore our parlour" />
        <ParallaxPanel side="left" src={photos.parlour} alt="Bright pastel ice cream parlour with a gelato counter" kicker="The Mitho moment" title="Your happy place, after every long day." text="Bright corners, generous sundaes and room for one more friend around the table." link="Find your table" />
      </Reveal>
    </>
  );
}

function Testimonials() {
  const reviews = [
    ["“The Kesar Pista tastes like summer holidays at nani's house — creamy, fragrant and not too sweet.”", "Riya Patel", "Vesu, Surat", img("note-family.webp")],
    ["“We booked the cart for our sangeet. The team was warm, quick and the Rajbhog disappeared first!”", "Dhruv Shah", "Adajan, Surat", img("note-couple.webp")],
    ["“My children vote Berry Bliss. I quietly finish the Mawa Badam after they sleep.”", "Anjali Mehta", "Navsari", img("note-kid.webp")],
    ["“Fresh flavour, lovely service and the happiest little corner in the neighbourhood.”", "Kabir Desai", "Bardoli", img("note-friends.webp")],
  ];
  return (
    <Reveal className="section testimonials">
      <div className="container">
        <CurvedTitle script="Scoops of love" text="Loved by our regulars" />
        <Swiper modules={[Autoplay]} autoplay={{ delay: 2800 }} loop spaceBetween={22} breakpoints={{ 0: { slidesPerView: 1.08 }, 700: { slidesPerView: 2.1 }, 1050: { slidesPerView: 3 } }}>
          {reviews.map(([quote, name, area, photo], i) => (
            <SwiperSlide key={name}><article className={`review review-${i}`}><img className="review-photo" src={photo} alt={`${name} enjoying Mitho ice cream`} loading="lazy" /><div className="stars">{[1,2,3,4,5].map(n => <Star key={n} size={16} fill="currentColor" />)}</div><blockquote>{quote}</blockquote><div className="reviewer"><span>{name[0]}</span><div><strong>{name}</strong><small>{area}</small></div></div></article></SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Reveal>
  );
}

type Outlet = {
  slug: string;
  name: string;
  area: string;
  city: string;
  address: string;
  pincode: string;
  hours: [number, number];
  hoursLabel: string;
  phone: string;
  since: string;
  tagline: string;
  headline: string;
  intro: string;
  hero: string;
  heroAlt: string;
  story: { title: string; text: string; img: string; alt: string }[];
  highlights: string[];
  specials: { name: string; note: string; visual: MenuVisual }[];
};

const outletList: Outlet[] = [
  {
    slug: "vesu",
    name: "Mitho Flagship Parlour",
    area: "Vesu",
    city: "Surat",
    address: "G-12, Aagam Arcade, Vesu, Surat",
    pincode: "395007",
    hours: [11 * 60, 23 * 60 + 30],
    hoursLabel: "11 AM – 11:30 PM",
    phone: "+91 98765 43210",
    since: "2015",
    tagline: "Where it all began",
    headline: "Our very first scoop shop.",
    intro: "The parlour where Mitho's first batch was churned. Pastel corners, a 24-flavour counter and the sundae bar all of Vesu talks about.",
    hero: photos.parlour,
    heroAlt: "Pastel Mitho parlour with a gelato counter and plants",
    story: [
      { title: "Ice creams that make you go waah!", text: "Pick from 24 tubs at the counter, stack them high, and watch the team crown your sundae with sauces, cherries and crunch.", img: img("product-sundae.webp"), alt: "A rainbow sundae with cherries and whipped cream" },
      { title: "We bet it's your best scoop ever.", text: "Fresh milk from local dairies, churned in small batches every morning — so the scoop in your cone was made today.", img: img("note-friends.webp"), alt: "Three friends laughing with ice cream cones" },
    ],
    highlights: ["24-flavour counter", "Live sundae bar", "Party corner · 30 guests", "Free parking"],
    specials: [
      { name: "Rainbow Sundae", note: "Flagship favourite", visual: { kind: "photo", src: img("product-sundae.webp") } },
      { name: "Triple Scoop Cone", note: "Built to share", visual: { kind: "photo", src: photos.heroCone } },
      { name: "Kesar Pista", note: "Since day one", visual: { kind: "scoop", src: scoops.pista } },
      { name: "Mawa Badam", note: "Richest scoop", visual: { kind: "scoop", src: scoops.mawa } },
      { name: "Dry Fruit Kulfi", note: "Old-school classic", visual: { kind: "photo", src: img("product-kulfi.webp") } },
    ],
  },
  {
    slug: "citylight",
    name: "Mitho Citylight",
    area: "Citylight",
    city: "Surat",
    address: "Near Science Centre, City Light Road, Surat",
    pincode: "395001",
    hours: [12 * 60, 23 * 60],
    hoursLabel: "12 PM – 11 PM",
    phone: "+91 98765 43211",
    since: "2019",
    tagline: "The family hangout",
    headline: "Three generations, one table.",
    intro: "Big tables, a kids' corner and birthday packages — Citylight is where Surat's families come for Sunday scoops after the Science Centre.",
    hero: img("note-family.webp"),
    heroAlt: "Grandparents and a grandchild laughing over cups of ice cream",
    story: [
      { title: "Family packs, made for sharing.", text: "Grab a twin-flavour litre tub at the counter, or settle in with a spoon for everyone at our long family tables.", img: img("deal-family.webp"), alt: "A family sharing tubs of ice cream at home" },
      { title: "Little faces, big smiles.", text: "Our kids' corner has mini cones, sprinkle stations and colouring sheets — and the Berry Bliss is always on the house for birthdays.", img: img("note-kid.webp"), alt: "A little girl laughing with a pink ice cream cone" },
    ],
    highlights: ["Kids' play corner", "Birthday packages", "Wheelchair friendly", "Home delivery"],
    specials: [
      { name: "Royal Family Pack", note: "1 L of Rajbhog & Mawa", visual: { kind: "stack", scoops: [scoops.rajbhog, scoops.mawa] } },
      { name: "Berry Bliss Cup", note: "Kids' pick", visual: { kind: "scoop", src: scoops.berry } },
      { name: "Mango Waffle Cone", note: "Summer special", visual: { kind: "cone", scoop: scoops.mango } },
      { name: "Orange Candy", note: "₹10 treat", visual: { kind: "photo", src: img("product-candy.webp") } },
      { name: "Choco Chip Cup", note: "After-school fix", visual: { kind: "scoop", src: scoops.choco } },
    ],
  },
  {
    slug: "navsari",
    name: "Mitho Navsari",
    area: "Navsari",
    city: "Navsari",
    address: "Lunsikui Main Road, Navsari",
    pincode: "396445",
    hours: [11 * 60, 23 * 60],
    hoursLabel: "11 AM – 11 PM",
    phone: "+91 98765 43212",
    since: "2022",
    tagline: "Late-night scoops",
    headline: "Scoops under the market lights.",
    intro: "Right on Lunsikui's buzzing main road — come for a late-night cone, stay for the fairy lights, the music and one more scoop.",
    hero: img("note-couple.webp"),
    heroAlt: "A couple sharing an ice cream cone under string lights",
    story: [
      { title: "Date-night sundaes for two.", text: "Our big glass bowl comes with two long spoons, three scoops and all the toppings you can fit — perfect after a walk around the market.", img: photos.sundae, alt: "Two people sharing a large sundae under fairy lights" },
      { title: "Kulfi the way Navsari likes it.", text: "Slow-reduced milk, saffron and dry fruits, frozen on a stick — our Navsari kulfi recipe comes straight from the neighbourhood.", img: img("product-kulfi.webp"), alt: "A dry fruit kulfi on a stick" },
    ],
    highlights: ["Open till 11 PM", "Outdoor seating", "Kulfi specials", "Live music Fridays"],
    specials: [
      { name: "Date-Night Sundae", note: "Serves two", visual: { kind: "photo", src: photos.sundae } },
      { name: "Kesar Kulfi", note: "Navsari recipe", visual: { kind: "photo", src: img("product-kulfi.webp"), tint: "sepia(.35) saturate(1.9) hue-rotate(-12deg)" } },
      { name: "Alphonso Mango", note: "Seasonal", visual: { kind: "scoop", src: scoops.mango } },
      { name: "Kala Khatta Candy", note: "Street favourite", visual: { kind: "photo", src: img("product-candy.webp"), tint: "hue-rotate(245deg) saturate(1.2)" } },
      { name: "Choco Chip Cone", note: "Late-night craving", visual: { kind: "cone", scoop: scoops.choco } },
    ],
  },
];

const isOpenNow = (outlet: Outlet) => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= outlet.hours[0] && minutes < outlet.hours[1];
};

const directionsUrl = (outlet: Outlet) => `https://maps.google.com/?q=${encodeURIComponent(`${outlet.name}, ${outlet.address}`)}`;

function Outlets() {
  const [city, setCity] = useState("All");
  const [pincode, setPincode] = useState("All");
  const shown = outletList.filter((o) => (city === "All" || o.city === city) && (pincode === "All" || o.pincode === pincode));
  return (
    <Reveal className="section outlets wave-top" >
      <div className="container" id="outlets">
        <SectionTitle eyebrow="FIND YOUR NEAREST SCOOP">
          Joy is just around <Stroked>the corner.</Stroked>
        </SectionTitle>
        <div className="locator-bar">
          <label>City<select value={city} onChange={(e) => setCity(e.target.value)}><option>All</option><option>Surat</option><option>Navsari</option></select></label>
          <label>Pincode<select value={pincode} onChange={(e) => setPincode(e.target.value)}><option value="All">Choose pincode</option>{outletList.map((o) => <option key={o.slug}>{o.pincode}</option>)}</select></label>
          <button className="button" onClick={() => { setCity("All"); setPincode("All"); }}><Search size={18} /> Show all</button>
        </div>
        <div className="outlet-grid">
          {shown.map((o) => (
            <article className="outlet-card" key={o.slug}>
              <div className="outlet-card-photo"><img src={o.hero} alt="" loading="lazy" /><span className={isOpenNow(o) ? "open-pill open" : "open-pill"}><i />{isOpenNow(o) ? "Open now" : "Closed"}</span></div>
              <span>{o.area}</span>
              <h3><a className="outlet-card-link" href={`/outlets/${o.slug}`}>{o.name}</a></h3>
              <p>{o.address}</p>
              <small><Clock3 size={15} /> {o.hoursLabel}</small>
              <div className="outlet-card-actions">
                <span className="outlet-card-cta">Explore outlet <ArrowRight size={16} /></span>
                <a className="outlet-card-directions" target="_blank" rel="noreferrer" href={directionsUrl(o)}>Directions</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function OutletBanner({ outlet }: { outlet: Outlet }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const open = isOpenNow(outlet);
  return (
    <section className="outlet-banner">
      <div className="container">
        <motion.span className="script" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>{outlet.tagline}</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", bounce: 0.35 }}>
          Mitho <Stroked>{outlet.area}</Stroked>
        </motion.h1>
        <motion.div
          ref={ref}
          className="outlet-photo"
          initial={{ clipPath: "inset(12% 20% 12% 20% round 60px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
        >
          <motion.img src={outlet.hero} alt={outlet.heroAlt} style={{ y: photoY }} initial={{ scale: 1.3 }} animate={{ scale: 1.12 }} transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }} />
          <motion.span className={open ? "open-pill open" : "open-pill"} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
            <i />{open ? "Open now" : "Closed now"} · {outlet.hoursLabel}
          </motion.span>
        </motion.div>
        <div className="outlet-intro">
          <motion.div className="outlet-stamp" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1, type: "spring", bounce: 0.45 }}>
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <path id="outlet-stamp-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none" />
              <text><textPath href="#outlet-stamp-path">{`MITHO • ${outlet.area.toUpperCase()} • SINCE ${outlet.since} • `}</textPath></text>
            </svg>
            <span className="logo-scoop">m</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}>
            <h2>{outlet.headline}</h2>
            <p>{outlet.intro}</p>
            <ul className="outlet-chips">
              <li><MapPin size={17} /> {outlet.address}</li>
              <li><Clock3 size={17} /> {outlet.hoursLabel}</li>
              <li><Phone size={17} /> <a href={`tel:${outlet.phone.replace(/\s/g, "")}`}>{outlet.phone}</a></li>
            </ul>
            <div className="outlet-actions">
              <a className="button" href={directionsUrl(outlet)} target="_blank" rel="noreferrer">Get directions <ArrowRight size={18} /></a>
              <a className="button button-outline" href="#outlet-party">Book a party</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OutletStoryImage({ src, alt, drift }: { src: string; alt: string; drift: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  return (
    // the visibility trigger sits on the unclipped wrapper: a fully clipped element never counts as "in view"
    <motion.div ref={ref} className="story-photo" style={{ y }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <motion.div
        className="story-photo-wipe"
        variants={{ hidden: { clipPath: "inset(100% 0% 0% 0% round 28px)" }, show: { clipPath: "inset(0% 0% 0% 0% round 28px)", transition: { duration: 1, ease: [0.65, 0, 0.35, 1] } } }}
      >
        <img src={src} alt={alt} loading="lazy" />
      </motion.div>
    </motion.div>
  );
}

function OutletStory({ outlet }: { outlet: Outlet }) {
  const [first, second] = outlet.story;
  const icons = [Sparkles, IceCreamBowl, Heart, Star];
  const text = (block: Outlet["story"][number]) => (
    <motion.div className="story-text" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}>
      <h3>{block.title}</h3>
      <p>{block.text}</p>
    </motion.div>
  );
  return (
    <section className="section outlet-story wave-top">
      <div className="container story-grid">
        <div className="story-col">
          {text(first)}
          <OutletStoryImage src={first.img} alt={first.alt} drift={40} />
        </div>
        <div className="story-col offset">
          <OutletStoryImage src={second.img} alt={second.alt} drift={-30} />
          {text(second)}
        </div>
      </div>
      <div className="container">
        <ul className="outlet-highlights">
          {outlet.highlights.map((h, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.li key={h} initial={{ opacity: 0, scale: 0.7, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", bounce: 0.45 }}>
                <span><Icon size={20} /></span>
                {h}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function OutletSpecials({ outlet }: { outlet: Outlet }) {
  return (
    <section className="outlet-specials">
      <div className="container specials-head">
        <SectionTitle eyebrow="ONLY AT" script={`Only at ${outlet.area}`}>
          Signature <Stroked>scoops.</Stroked>
        </SectionTitle>
        <div className="slider-arrows">
          <button className="icon-button specials-prev" aria-label="Previous special"><ChevronLeft /></button>
          <button className="icon-button specials-next" aria-label="Next special"><ChevronRight /></button>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{ prevEl: ".specials-prev", nextEl: ".specials-next" }}
        autoplay={{ delay: 3200, disableOnInteraction: false }}
        loop
        spaceBetween={0}
        breakpoints={{ 0: { slidesPerView: 1.25 }, 640: { slidesPerView: 2.2 }, 1000: { slidesPerView: 3 } }}
        className="specials-swiper"
      >
        {outlet.specials.map((sp) => (
          <SwiperSlide key={sp.name}>
            <article className="special-card">
              <MenuVisualArt visual={sp.visual} name={sp.name} />
              <div className="special-label"><small>{sp.note}</small><strong>{sp.name}</strong></div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

function OutletParty({ outlet }: { outlet: Outlet }) {
  const [sent, setSent] = useState(false);
  return (
    <section className="section outlet-party" id="outlet-party">
      <div className="container party-grid">
        <div>
          <span className="script">Celebrate with us</span>
          <h2>Plan a party at <Stroked>{outlet.area}.</Stroked></h2>
          <p>Birthdays, kitty parties, office treats or a surprise for someone special — tell us the date and we'll set up the scoops.</p>
          <ul className="party-perks">
            {["Custom sundae bar", "Decor in your colours", "Packages from ₹2,499"].map((perk) => <li key={perk}><Check size={18} /> {perk}</li>)}
          </ul>
        </div>
        <form className="party-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="done" className="success" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Check />
                <h3>Party request sent!</h3>
                <p>The {outlet.area} team will call you within a day.</p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                <div className="field-row">
                  <label>Name<input required placeholder="Your name" /></label>
                  <label>Phone<input required pattern="[0-9 +]{8,}" placeholder="+91" /></label>
                </div>
                <div className="field-row">
                  <label>Date<input required type="date" /></label>
                  <label>Guests<input required type="number" min={2} max={200} placeholder="20" /></label>
                </div>
                <label>Anything else?<textarea rows={3} placeholder="Theme, favourite flavours, surprises…" /></label>
                <button className="button" type="submit">Send request <ArrowRight size={18} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}

function OtherOutlets({ current }: { current: string }) {
  return (
    <section className="section other-outlets">
      <div className="container">
        <SectionTitle eyebrow="MORE MITHO NEAR YOU" script="More Mitho near you">
          Visit our other <Stroked>parlours.</Stroked>
        </SectionTitle>
        <div className="other-grid">
          {outletList.filter((o) => o.slug !== current).map((o, i) => (
            <motion.a key={o.slug} href={`/outlets/${o.slug}`} className="other-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <img src={o.hero} alt="" loading="lazy" />
              <div>
                <span>{o.tagline}</span>
                <h3>{o.name}</h3>
                <p>{o.address}</p>
              </div>
              <ArrowRight />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutletPage({ slug }: { slug?: string }) {
  const outlet = outletList.find((o) => o.slug === slug);
  useEffect(() => {
    document.title = outlet ? `${outlet.name} · Mitho Ice Cream` : "Outlets · Mitho Ice Cream";
  }, [outlet]);
  return (
    <>
      <Header cart={0} />
      <main className="inner-page outlet-page">
        {outlet ? (
          <>
            <OutletBanner outlet={outlet} />
            <OutletStory outlet={outlet} />
            <OutletSpecials outlet={outlet} />
            <OutletParty outlet={outlet} />
            <OtherOutlets current={outlet.slug} />
          </>
        ) : (
          <>
            <section className="page-hero"><span>MITHO ICE CREAM CO.</span><h1>Our parlours</h1><p>Three happy corners across Surat and Navsari.</p></section>
            <Outlets />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function ContactNewsletter() {
  const [sent, setSent] = useState(false);
  return (
    <Reveal className="section contact-section">
      <div className="container scream-title">
        <span className="script">We hear you scream</span>
        <h2><Stroked>for ice-cream!</Stroked></h2>
      </div>
      <div className="container contact-grid">
        <div className="contact-copy"><span>Let's talk sweet</span><h2>Have a party in mind?</h2><p>Tell us what you're dreaming up. Our celebration team will get back to you within one business day.</p><a href="tel:+919876543210"><Phone /> +91 98765 43210</a><a href="mailto:hello@mithoicecream.in"><Mail /> hello@mithoicecream.in</a></div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="contact-form">
          {sent ? <motion.div className="success" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check /><h3>Sweet! Message received.</h3><p>We'll be in touch very soon.</p></motion.div> : <>
            <div className="field-row"><label>Name<input required placeholder="Your name" /></label><label>Phone<input required pattern="[0-9 +]{8,}" placeholder="+91" /></label></div>
            <label>Email<input required type="email" placeholder="you@example.com" /></label>
            <label>Message<textarea required rows={4} placeholder="Tell us about your celebration..." /></label>
            <button className="button" type="submit">Send enquiry <ArrowRight size={18} /></button>
          </>}
        </form>
      </div>
      <div className="container newsletter"><div><span>Fresh from the churn</span><h3>Get new flavours first.</h3></div><form><input type="email" required placeholder="Your email address" /><button className="button" aria-label="Subscribe"><ArrowRight /></button></form></div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-wave" />
      <div className="container footer-grid">
        <div><Logo full /><p>Small-batch joy, lovingly churned in Surat, Gujarat.</p><div className="socials"><a href="#" aria-label="Instagram"><Camera /></a><a href="#" aria-label="Youtube"><Play /></a></div></div>
        <div><h4>Products</h4><a href="/flavours?category=Cups">Cups</a><a href="/flavours?category=Cones">Cones</a><a href="/flavours?category=Family%20Packs">Family packs</a><a href="/flavours?category=Kulfi">Kulfi</a></div>
        <div><h4>Company</h4><a href="/about">Our story</a><a href="#outlets">Outlets</a><a href="/contact">Contact</a><a href="/contact">Party orders</a></div>
        <div><h4>Visit us</h4><p>G-12, Aagam Arcade,<br />Vesu, Surat, Gujarat</p><p>Open daily<br />11 AM – 11:30 PM</p></div>
      </div>
      <div className="container copyright"><span>© 2025 Mitho Ice Cream Co.</span><span>Made with milk & a little magic.</span></div>
    </footer>
  );
}

const menuCategories = ["All", "Cups", "Cones", "Sundaes", "Family Packs", "Kulfi", "Candies", "Bulk Packs"] as const;
type MenuCategory = Exclude<(typeof menuCategories)[number], "All">;

type MenuVisual =
  | { kind: "scoop"; src: string }
  | { kind: "cone"; scoop: string }
  | { kind: "stack"; scoops: string[] }
  | { kind: "photo"; src: string; tint?: string };

type MenuItem = { name: string; category: MenuCategory; price: number; size: string; note: string; tag?: string; visual: MenuVisual };

const categoryIntros: Record<MenuCategory, string> = {
  Cups: "Single scoops in a cup — grab a spoon and smile.",
  Cones: "Crisp waffle cones piled high with your favourite scoops.",
  Sundaes: "Glass bowls of scoops, sauces, cherries and crunch.",
  "Family Packs": "Litre tubs for movie nights and big family dinners.",
  Kulfi: "Slow-reduced milk frozen on a stick, the old-fashioned way.",
  Candies: "Icy, fruity sticks — ₹10 of pure summer.",
  "Bulk Packs": "Party-size tubs for weddings, birthdays and celebrations.",
};

const menuItems: MenuItem[] = [
  { name: "Kesar Pista Cup", category: "Cups", price: 55, size: "110 ml", note: "Saffron cream, roasted pistachios.", tag: "Bestseller", visual: { kind: "scoop", src: scoops.pista } },
  { name: "Alphonso Mango Cup", category: "Cups", price: 50, size: "110 ml", note: "Ripe Alphonso pulp in fresh cream.", tag: "Seasonal", visual: { kind: "scoop", src: scoops.mango } },
  { name: "Berry Bliss Cup", category: "Cups", price: 60, size: "110 ml", note: "Strawberry swirl, light and tangy.", visual: { kind: "scoop", src: scoops.berry } },
  { name: "Choco Chip Cup", category: "Cups", price: 60, size: "110 ml", note: "Dark cocoa loaded with chips.", visual: { kind: "scoop", src: scoops.choco } },
  { name: "Triple Scoop Cone", category: "Cones", price: 120, size: "3 scoops", note: "Mango, berry and pista with white-choc drizzle.", tag: "Signature", visual: { kind: "photo", src: photos.heroCone } },
  { name: "Mango Waffle Cone", category: "Cones", price: 70, size: "1 scoop", note: "A golden scoop on a crisp waffle cone.", visual: { kind: "cone", scoop: scoops.mango } },
  { name: "Berry Waffle Cone", category: "Cones", price: 75, size: "1 scoop", note: "Strawberry swirl on a crunchy cone.", visual: { kind: "cone", scoop: scoops.berry } },
  { name: "Choco Chip Cone", category: "Cones", price: 75, size: "1 scoop", note: "Cocoa and chips, cone to the last bite.", visual: { kind: "cone", scoop: scoops.choco } },
  { name: "Rainbow Sundae", category: "Sundaes", price: 180, size: "Serves 2", note: "Three scoops, whipped cream, cherries and sprinkles.", tag: "Share it", visual: { kind: "photo", src: img("product-sundae.webp") } },
  { name: "Date-Night Sundae", category: "Sundaes", price: 220, size: "Serves 2", note: "Our big glass bowl with two long spoons.", visual: { kind: "photo", src: photos.sundae } },
  { name: "Mango–Pista Twin Pack", category: "Family Packs", price: 299, size: "1 L", note: "Half Alphonso Mango, half Kesar Pista.", tag: "BOGO", visual: { kind: "stack", scoops: [scoops.mango, scoops.pista] } },
  { name: "Berry–Choco Twin Pack", category: "Family Packs", price: 329, size: "1 L", note: "Berry Bliss meets Choco Chip.", visual: { kind: "stack", scoops: [scoops.berry, scoops.choco] } },
  { name: "Royal Family Pack", category: "Family Packs", price: 349, size: "1 L", note: "Rajbhog Royale and Mawa Badam together.", visual: { kind: "stack", scoops: [scoops.rajbhog, scoops.mawa] } },
  { name: "Dry Fruit Kulfi", category: "Kulfi", price: 40, size: "60 ml", note: "Malai kulfi packed with almonds and cashews.", tag: "Classic", visual: { kind: "photo", src: img("product-kulfi.webp") } },
  { name: "Kesar Kulfi", category: "Kulfi", price: 45, size: "60 ml", note: "Saffron-rich and fragrant.", visual: { kind: "photo", src: img("product-kulfi.webp"), tint: "sepia(.35) saturate(1.9) hue-rotate(-12deg)" } },
  { name: "Pista Kulfi", category: "Kulfi", price: 45, size: "60 ml", note: "Ground pistachio in slow-cooked milk.", visual: { kind: "photo", src: img("product-kulfi.webp"), tint: "hue-rotate(38deg) saturate(1.25)" } },
  { name: "Orange Candy", category: "Candies", price: 10, size: "55 ml", note: "Tangy orange ice on a stick.", tag: "₹10", visual: { kind: "photo", src: img("product-candy.webp") } },
  { name: "Kala Khatta Candy", category: "Candies", price: 10, size: "55 ml", note: "Sweet, sour and a pinch of masala.", visual: { kind: "photo", src: img("product-candy.webp"), tint: "hue-rotate(245deg) saturate(1.2)" } },
  { name: "Raspberry Candy", category: "Candies", price: 10, size: "55 ml", note: "Bright berry ice, extra refreshing.", visual: { kind: "photo", src: img("product-candy.webp"), tint: "hue-rotate(-32deg) saturate(1.35)" } },
  { name: "Party Bulk Pack", category: "Bulk Packs", price: 899, size: "4 L", note: "Mango, Berry and Pista for a full party.", tag: "Party", visual: { kind: "stack", scoops: [scoops.mango, scoops.berry, scoops.pista] } },
  { name: "Celebration Tub", category: "Bulk Packs", price: 1099, size: "5 L", note: "Choco Chip, Mawa Badam and Rajbhog Royale.", visual: { kind: "stack", scoops: [scoops.choco, scoops.mawa, scoops.rajbhog] } },
];

const categoryFromUrl = (): (typeof menuCategories)[number] => {
  const wanted = new URLSearchParams(window.location.search).get("category");
  return menuCategories.find((c) => c.toLowerCase() === wanted?.toLowerCase()) ?? "All";
};

function MenuVisualArt({ visual, name }: { visual: MenuVisual; name: string }) {
  if (visual.kind === "photo") {
    return <div className="menu-visual photo"><img src={visual.src} alt={name} loading="lazy" style={visual.tint ? { filter: visual.tint } : undefined} /></div>;
  }
  if (visual.kind === "cone") {
    return (
      <div className="menu-visual cone" role="img" aria-label={name}>
        <img className="cone-base" src={photos.emptyCone} alt="" loading="lazy" />
        <img className="cone-scoop" src={visual.scoop} alt="" loading="lazy" />
      </div>
    );
  }
  if (visual.kind === "stack") {
    return (
      <div className={`menu-visual stack stack-${visual.scoops.length}`} role="img" aria-label={name}>
        {visual.scoops.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}
      </div>
    );
  }
  return <div className="menu-visual scoop"><img src={visual.src} alt={name} loading="lazy" /></div>;
}

function MenuCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  const [added, setAdded] = useState(false);
  return (
    <motion.article
      layout
      className="menu-card"
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      {item.tag && <span className="badge">{item.tag}</span>}
      <MenuVisualArt visual={item.visual} name={item.name} />
      <div className="menu-card-body">
        <span className="menu-card-cat">{item.category} · {item.size}</span>
        <h3>{item.name}</h3>
        <p>{item.note}</p>
        <div className="product-bottom">
          <strong>₹{item.price}</strong>
          <button className="add-button" onClick={() => { onAdd(); setAdded(true); setTimeout(() => setAdded(false), 1200); }}>
            {added ? "Added ✓" : "Add +"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function FlavoursMenu({ onAdd }: { onAdd: () => void }) {
  const [category, setCategory] = useState(categoryFromUrl);
  const [query, setQuery] = useState("");
  const tabsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // keep the selected tab visible in the horizontally scrolling tab row on phones
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>("button.active");
    if (row && tab) row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [category]);
  const choose = (next: (typeof menuCategories)[number]) => {
    setCategory(next);
    const url = new URL(window.location.href);
    if (next === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(null, "", url);
  };
  const q = query.trim().toLowerCase();
  const shown = menuItems.filter((item) => (category === "All" || item.category === category) && (!q || `${item.name} ${item.note}`.toLowerCase().includes(q)));
  const countFor = (c: (typeof menuCategories)[number]) => (c === "All" ? menuItems.length : menuItems.filter((i) => i.category === c).length);

  return (
    <section className="container menu-page">
      <div className="menu-tools">
        <div className="tabs" role="tablist" aria-label="Flavour categories" ref={tabsRef}>
          {menuCategories.map((c) => (
            <button key={c} role="tab" aria-selected={category === c} className={category === c ? "active" : ""} onClick={() => choose(c)}>
              {category === c && <motion.span className="tab-pill" layoutId="menu-tab-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="tab-label">{c} <small>{countFor(c)}</small></span>
            </button>
          ))}
        </div>
        <label><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search flavours" aria-label="Search flavours" /></label>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={category} className="menu-intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <h2>{category === "All" ? "Everything we churn" : category}</h2>
          <p>{category === "All" ? "Every scoop, cone, stick and tub in one place." : categoryIntros[category]} <span>{shown.length} {shown.length === 1 ? "treat" : "treats"}</span></p>
        </motion.div>
      </AnimatePresence>
      <motion.div layout className="menu-grid">
        <AnimatePresence mode="popLayout">
          {shown.map((item) => <MenuCard key={item.name} item={item} onAdd={onAdd} />)}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && <p className="menu-empty">No treats match “{query}”. Try another flavour.</p>}
    </section>
  );
}

function SimplePage({ type }: { type: "flavours" | "about" | "contact" }) {
  const [cart, setCart] = useState(0);
  const content = {
    flavours: ["Our full flavour menu", "Find the scoop that feels like you."],
    about: ["Born in Gujarat. Made for joy.", "A decade of turning honest ingredients into happy memories."],
    contact: ["Come say hello", "Find our flagship parlour or drop us a sweet note."],
  }[type];
  return (
    <>
      <Header cart={cart} />
      <main className="inner-page">
        <section className="page-hero"><span>MITHO ICE CREAM CO.</span><h1>{content[0]}</h1><p>{content[1]}</p></section>
        {type === "flavours" && <FlavoursMenu onAdd={() => setCart((c) => c + 1)} />}
        {type === "about" && <section className="container story-page"><img src={img("note-family.webp")} alt="Grandparents and a grandchild sharing ice cream in a parlour" /><div><span>OUR STORY</span><h2>Pure milk. Bold flavours. Gujarati heart.</h2><p>Mitho began with one tiny batch and a big belief: ice cream should taste like the ingredients on its label. We work closely with local dairy partners, fold in fruits and nuts by hand, and let every batch take its own sweet time.</p>{["2015 — Our first churn in Surat", "2019 — The 50th flavour joins the family", "2025 — 50,000 happy regulars and counting"].map(x => <div className="story-milestone" key={x}>{x}</div>)}</div></section>}
        {type === "contact" && <ContactNewsletter />}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [cart, setCart] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();
  const path = window.location.pathname;

  useEffect(() => {
    if (!reduced) {
      const lenis = new Lenis({ duration: 1.05 });
      let frame = 0;
      const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
      return () => { cancelAnimationFrame(frame); lenis.destroy(); };
    }
  }, [reduced]);
  useEffect(() => { const timer = setTimeout(() => setLoaded(true), reduced ? 0 : 950); return () => clearTimeout(timer); }, [reduced]);

  const page = useMemo(() => path.includes("flavours") ? "flavours" : path.includes("about") ? "about" : path.includes("contact") ? "contact" : null, [path]);
  if (path.startsWith("/outlets")) return <OutletPage slug={path.split("/")[2] || undefined} />;
  if (page) return <SimplePage type={page} />;

  return (
    <>
      <AnimatePresence>{!loaded && <motion.div className="intro" exit={{ opacity: 0 }}><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><Logo /><span /></motion.div></motion.div>}</AnimatePresence>
      <Header cart={cart} />
      <main>
        <Hero ready={loaded} />
        <Marquee />
        <StatsPromises />
        <Bestsellers onAdd={() => setCart((c) => c + 1)} />
        <Indulgence />
        <FlavourWheel onAdd={() => setCart((c) => c + 1)} />
        <Categories />
        <Process />
        <OffersExperience />
        <Testimonials />
        <Outlets />
        <ContactNewsletter />
      </main>
      <a className="whatsapp" href="https://wa.me/919876543210" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">WA</a>
      <Footer />
    </>
  );
}
