import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  IceCreamBowl,
  Info,
  ListChecks,
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
  TriangleAlert,
  Wheat,
  X,
  BadgeCheck,
  Coffee,
  CreditCard,
  Headset,
  Hotel,
  Package,
  PartyPopper,
  Store,
  Truck,
  UtensilsCrossed,
  UserRound,
  Minus,
  Plus,
  Trash2,
  CalendarDays,
  LogOut,
  RotateCcw,
  Lock,
  Building2,
  Landmark,
  FileText,
  Smartphone,
  Wallet,
  Banknote,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { actions, DELIVERY, gbp, orderTotals, tubCount, TUB, useStore } from "./store";
import type { AccountType, DeliveryAddress, FulfilmentMethod, Order, Payment, PaymentMethod } from "./store";
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

type FlavourFamily = "Fruity" | "Chocolate & Nutty" | "Cookies & Treats" | "Creamy Classics";

type Flavour = {
  slug: string;
  name: string;
  family: FlavourFamily;
  note: string;
  colour: string;
  ink: string;
  meters: [number, number, number];
  badge?: string;
};

/** Avellino Gelato's flavour photos live in public/images/flavours/<slug>.webp */
const fl = (slug: string) => img(`flavours/${slug}.webp`);

const flavourFamilies: FlavourFamily[] = ["Fruity", "Chocolate & Nutty", "Cookies & Treats", "Creamy Classics"];

const flavourList: Flavour[] = [
  { slug: "alphonso-mango", name: "Alphonso Mango", family: "Fruity", note: "Sweet Alphonso mango churned into silky gelato — sunshine in a scoop.", colour: "#ffc94a", ink: "#5a3410", meters: [72, 82, 8], badge: "Seasonal" },
  { slug: "blueberry", name: "Blueberry", family: "Fruity", note: "Plump blueberries rippled through a smooth, creamy base.", colour: "#c9b8f2", ink: "#3b2466", meters: [70, 72, 10] },
  { slug: "cherry-amarena", name: "Cherry Amarena", family: "Fruity", note: "Italian amarena cherries folded through sweet cream gelato.", colour: "#f7c1d4", ink: "#5e1630", meters: [78, 76, 12] },
  { slug: "lemon", name: "Lemon", family: "Fruity", note: "Bright, zesty and refreshing — a clean, citrusy scoop.", colour: "#fff09a", ink: "#5a4a10", meters: [60, 64, 4] },
  { slug: "pineapple", name: "Pineapple", family: "Fruity", note: "Tropical, tangy and juicy, like summer on a spoon.", colour: "#ffe27a", ink: "#5a4410", meters: [58, 70, 6] },
  { slug: "raspberry-ripple", name: "Raspberry Ripple", family: "Fruity", note: "Classic vanilla with a ribbon of tangy raspberry sauce.", colour: "#f6b6c5", ink: "#62182c", meters: [80, 74, 6], badge: "Classic" },
  { slug: "strawberry", name: "Strawberry", family: "Fruity", note: "Ripe strawberries in a smooth, artisanal gelato.", colour: "#f9b8c7", ink: "#62182c", meters: [74, 76, 10] },
  { slug: "wild-berry", name: "Wild Berry", family: "Fruity", note: "A deep, jammy mix of forest berries with a fruity tang.", colour: "#6e2a52", ink: "#ffe8f1", meters: [66, 70, 12] },
  { slug: "chocolate", name: "Chocolate", family: "Chocolate & Nutty", note: "Rich, smooth cocoa gelato for true chocolate lovers.", colour: "#7a4a33", ink: "#fff7ca", meters: [88, 70, 6] },
  { slug: "chocolate-ferrero", name: "Chocolate Ferrero", family: "Chocolate & Nutty", note: "Ferrero Rocher inspired hazelnut and chocolate.", colour: "#5b3424", ink: "#fff7ca", meters: [90, 74, 60], badge: "Fan favourite" },
  { slug: "hazelnut-white-bueno", name: "Hazelnut White Bueno", family: "Chocolate & Nutty", note: "Smooth white chocolate and roasted hazelnut.", colour: "#e3c9a6", ink: "#4f321c", meters: [88, 76, 56], badge: "New" },
  { slug: "pistachio", name: "Pistachio", family: "Chocolate & Nutty", note: "Select Sicilian pistachios in creamy, nutty gelato.", colour: "#d3e9a8", ink: "#3f3a12", meters: [86, 62, 40], badge: "Bestseller" },
  { slug: "mint-chocolate-chip", name: "Mint Chocolate Chip", family: "Chocolate & Nutty", note: "Cool, fresh mint loaded with dark chocolate chips.", colour: "#bfeedd", ink: "#1f4a3c", meters: [78, 66, 48] },
  { slug: "coconut-raffaello", name: "Coconut Raffaello", family: "Chocolate & Nutty", note: "Coconut, creamy white chocolate and a hint of almond.", colour: "#f4efe6", ink: "#4f3a2c", meters: [90, 72, 30] },
  { slug: "biscoff", name: "Biscoff", family: "Cookies & Treats", note: "Caramelised Biscoff biscuit swirled through creamy gelato.", colour: "#e7b97f", ink: "#4f2c12", meters: [84, 80, 52], badge: "Bestseller" },
  { slug: "brownie-fudge", name: "Brownie Fudge", family: "Cookies & Treats", note: "Dark chocolate gelato with fudgy brownie pieces.", colour: "#b98763", ink: "#3a2010", meters: [86, 80, 62] },
  { slug: "cookie-and-cream", name: "Cookie and Cream", family: "Cookies & Treats", note: "Vanilla cream loaded with crunchy chocolate cookie pieces.", colour: "#e9e4dc", ink: "#33261c", meters: [84, 72, 58] },
  { slug: "bubblegum-blue", name: "Bubblegum Blue", family: "Cookies & Treats", note: "Sweet, nostalgic bubblegum in a bright blue scoop.", colour: "#9fe3f5", ink: "#0f3d52", meters: [72, 86, 4], badge: "Kids' pick" },
  { slug: "luxury-vanilla", name: "Luxury Vanilla", family: "Creamy Classics", note: "Made with real vanilla pods — smooth and creamy.", colour: "#fbf1d6", ink: "#4f3a1c", meters: [92, 70, 4], badge: "Classic" },
  { slug: "coffee-latte", name: "Coffee Latte", family: "Creamy Classics", note: "Smooth latte gelato with a rich, roasted coffee kick.", colour: "#d9b892", ink: "#3d2514", meters: [86, 64, 8] },
  { slug: "salted-caramel", name: "Salted Caramel", family: "Creamy Classics", note: "Buttery caramel balanced with a pinch of sea salt.", colour: "#e9b56a", ink: "#4a2a0c", meters: [88, 82, 10], badge: "Bestseller" },
  { slug: "honeycomb", name: "Honeycomb", family: "Creamy Classics", note: "Creamy vanilla with crunchy honey biscuit pieces.", colour: "#f3d58e", ink: "#4f3610", meters: [84, 80, 54] },
  { slug: "rose", name: "Rose", family: "Creamy Classics", note: "Delicate rose essence — like Rooh Afza in gelato form.", colour: "#f9c9d4", ink: "#5e2236", meters: [80, 70, 4] },
];

/** Official descriptions and ingredient lists supplied by Avellino Gelato (allergens in CAPITALS are shown in bold). */
const flavourDetails: Record<string, { description: string; ingredients: string }> = {
  "alphonso-mango": { description: "Bright and velvety, this mango gelato captures the pure sweetness of ripe fruit, crafted with Italian artistry for a taste of effortless elegance.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK), dextrose, sugar, glucose syrup, mango alphonso puree 15%, water, acid (malic acid, citric acid) colours (tumeric, caramel (E150c), carotenes), flavourings, thickeners, (agar-agar, pectin)" },
  "biscoff": { description: "Our Biscoff Gelato combines creamy caramelized goodness with the irresistible crunch of Biscoff biscuit crumbs. Smooth, spiced, and indulgently sweet, it’s the perfect treat for cookie butter lovers.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK), caramel (glucose syrup, caramel (sugar, water) natural flavouring, flavourings water, sugar, thickener (agar-agar) modified starch, colour ( caramel (E150c) cinnamon powder," },
  "blueberry": { description: "Delight in the vibrant taste of our Blueberry Gelato, bursting with the natural sweetness and tartness of ripe blueberries. Smooth, creamy, and refreshingly fruity, it’s a perfect balance of summer flavor in every scoop.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, frozen blueberries (15%), water, acidifier: citric acid, concentrated blueberry juice (6%), colours: caramel (E150c), anthocyanins, indigotine, flavourings, thickeners: pectin, tara gum." },
  "brownie-fudge": { description: "Our Brownie Fudge Gelato is a luxurious marriage of rich dark chocolate gelato infused with chewy velvety pockets of baked fudge brownie pieces.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, Cocoa, rapeseed oil, cocoa biscuits (WHEAT flour, palm vegetable fat, sugar, cocoa, raising agent sodium bicarbonate, salt);emulsifier SOY lecithin." },
  "bubblegum-blue": { description: "Bubble Gum Gelato, Playful yet sophisticated. The product aims to evoke a sense of nostalgia and joy for consumers of all ages, offering a unique and eye-catching treat for gelato shops.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, modified starch, flavourings, colour (patent blue V)." },
  "cherry-amarena": { description: "Our Cherry Amarena Gelato is crafted with ripe, juicy cherries blended into a creamy base, complete with real cherry pieces for a natural texture. Bright, fruity, and refreshingly sweet, it’s summer in every scoop.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK), sour cherries, glucose syrup, water, acid: citric acid, acidity regulator sodium citrate, flavours, modified starch, colours: azorubine, sulphite ammonia caramel; preservative potassium sorbate." },
  "chocolate": { description: "Rich and indulgent chocolate, blending intense cocoa flavour with a velvety smooth texture.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, low fat cocoa powder, 60%, vegetable oils, (rapeseed, sunflower), vegetable fat, emulsifier ( SOYBEAN lecithin) cocoa paste, flavourings cocoa extract, salt," },
  "chocolate-ferrero": { description: "A rich, Ferrero Rocher inspired paste featuring creamy hazelnut and chocolate notes.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup,hazelnut paste, low fat cocoa powder, vegetable oils (rapeseed, sunflower), vegetable fat (palm), emulsifier (SOYBEAN lecithin), flavourings, salt." },
  "coconut-raffaello": { description: "Our Coconut Raffaello Gelato captures the tropical sweetness of coconut blended with creamy white chocolate and hints of almond. Luxuriously smooth and delicately nutty, it’s inspired by the classic Raffaello treat.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, dextrose, rapeseed oil, coconut flakes, caramelised almonds pieces, whey powder (MILK), whole milk powder (MILK), emulsifiers: SOY lecithyn, flavours, cocoa butter (MILK), iodized salt." },
  "coffee-latte": { description: "Our Coffee Latte Gelato blends the bold aroma of freshly brewed coffee with the smooth richness of creamy milk. Perfectly balanced and velvety, it’s a refreshing pick-me-up for coffee lovers.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK), Sugar, Glucose syrup, coffee extract, colorant: sulphite ammonia caramel, modified starch, flavor, acidity regulator: tartaric acid, preservative potassium sorbate, whole MILK powder." },
  "cookie-and-cream": { description: "Our Cookie Cream Gelato combines smooth, velvety cream with crunchy cookie pieces for the perfect balance of texture and flavor. Rich, indulgent, and irresistibly creamy, it’s a timeless favorite for cookie lovers.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, dextrose, maltodextrine, cream powder (MILK), natural flavourings." },
  "hazelnut-white-bueno": { description: "Indulge in our White Hazelnut Bueno Gelato, a luxuriously creamy blend of smooth white chocolate and roasted hazelnut.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM, dextrose, sugar, glucose syrup, HAZELNUT paste, CREAM powder, flavourings, cocoa butter, emulsifier (SOYBEAN lecithin). vegetable fat (palm)" },
  "honeycomb": { description: "Our Honeycomb Gelato is a golden blend of creamy vanilla and crunchy honey biscuit pieces.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),vegetable oil (rapeseed, sunflower), biscuits (WHEAT flour, sugar, cocoa, palm oil, whole MILK powder), HAZELNUT paste, cocoa, whole MILK powder, maltodextrin, WHEAT starch, WHEAT gluten, emulsifiers: polyglycerol polyricinoleate, soy lecithin; flavors." },
  "lemon": { description: "Our Lemon Gelato is a refreshing burst of citrus made with real lemon juice and zest. Smooth, tangy, and perfectly balanced, it delivers a bright, zesty flavor that awakens the senses.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, glucose syrup, lemon juice concentrate, acid: citric acid, modified starch, acidity regulator: sodium citrate, preservative potassium sorbate, natural lemon flavour with other natural flavours." },
  "luxury-vanilla": { description: "Crafted with real vanilla pods, this gelato reveals a smooth creamy texture and the quiet depth of true Italian refinement.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, water, flavourings, salt, ground vanilla pods, colour (E150c) thickeners, ( agar agar, pectin) natural flavour, vanilla extract." },
  "mint-chocolate-chip": { description: "Our Mint Chocolate Chip Gelato combines cool, refreshing mint with rich, crunchy chocolate pieces. Smooth, creamy, and delightfully indulgent, it’s a classic treat for mint lovers.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK), Sugar, Dextrose, glucose syrup, natural flavouring, modified starch, natural mint flavouring, colours: brilliant blue FCF. dark chocolate chips (SOY)" },
  "pineapple": { description: "Our Pineapple Gelato is a refreshing tropical treat made with juicy, sun-ripened pineapples. Smooth, tangy, and naturally sweet, it delivers a bright burst of island flavor in every creamy spoonful.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),frozen pineapple, concentrated juice of pineapple, glucose syrup, acidifier: citric acid, water, flavourings, thickener: pectin, colour: turmeric." },
  "pistachio": { description: "Crafted from select Sicilian pistachios, this gelato offers a creamy, nutty elegance that embodies true Italian refinement.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, PISTACHIO paste 97.57%, salt, colour (E141, turmeric). maltodextrin, emulsifiers (E472b, E477)gum), MILK proteins, SOYBEAN flour, salt." },
  "raspberry-ripple": { description: "Raspberry Ripple gelato features a rich vanilla gelato base rippled with a tangy, sweet raspberry sauce that contains frozen raspberries, offering bursts of fruit flavour and a visually appealing cascade of red throughout the creamy white ice cream.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, frozen raspberry puree, thickeners ( agar-agar) acid (citric acid, malic acid) flavourings colours ( caramel (E150c) anthocyanins) natural flavourings." },
  "rose": { description: "Delicately infused with rose essence, this gelato embodies quiet luxury and is comparable to the Rooh Afza drink.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK), Sugar, Dextrose, Rose paste, thickeners (agar-agar,pectin), colour (allura red AC*).vegetable fat (coconut), maltodextrin, dried glucose syrup, emulsifiers (E472b, E477), MILK proteins,SOYBEAN flour, salt." },
  "salted-caramel": { description: "Sweet buttery caramel with a contrasting harmonious touch of salt.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Glucose syrup, sweetened condensed MILK , natural flavour, colour caramel (E150c) flavourings, water, salt, modified starch." },
  "strawberry": { description: "Bursting with the sweet taste and aroma of ripe strawberries, this gelato is a smooth, artisanal delight that captures the essence of summer.", ingredients: "PASTEURISED MILK, SKIMMED MILK POWDER, DOUBLE CREAM (MILK),Sugar, Dextrose, glucose syrup, frozen strawberries, glucose syrup, water, acid (citric acid), concentrated strawberry juice, strawberry seeds, flavourings, thickeners (pectin, tara gum), colours (turmeric, azorubine*).maltodextrin, dried glucose syrup, emulsifiers (E472b, E477), MILK proteins, SOYBEAN flour, salt." },
  "wild-berry": { description: "Refined and authentic, our Wild Berry Gelato balances vibrant fruit with delicate cream for a taste of understated luxury.", ingredients: "PASTEURISED (MILK), DOUBLE CREAM (MILK), SKIMMED MILK POWDER, Sugar, Dextrose, Glucose Syrup, Frozen Mixed Berries (blackcurrant, blueberries, blackberries, raspberries), Citric Acid, Concentrated Strawberry Juice, Natural Flavourings, Colours: anthocyanins, indigotine, thickeners: pectin." },
};

const flavourMayContain = "SOYBEANS, MILK, EGG, ALMONDS, HAZELNUTS, WALNUTS, PISTACHIO NUTS.";
const flavourAllergenAdvice = "For allergens, see ingredients in bold. Also, not suitable for customers with an allergy to nuts due to the manufacturing methods.";

/** Bold the allergens written in capitals (MILK, SOYBEAN, WHEAT…), leaving colour codes like FCF / AC alone. */
function IngredientText({ text }: { text: string }) {
  const notAllergens = new Set(["AC", "FCF"]);
  return (
    <>
      {text.split(/([A-Z][A-Z]+(?:\s+[A-Z][A-Z]+)*)/).map((part, i) =>
        /^[A-Z][A-Z]+(?:\s+[A-Z][A-Z]+)*$/.test(part) && !notAllergens.has(part) ? <strong key={i}>{part}</strong> : part,
      )}
    </>
  );
}

const pickFlavours = (...slugs: string[]) => slugs.map((slug) => {
  const found = flavourList.find((f) => f.slug === slug);
  if (!found) throw new Error(`Unknown flavour: ${slug}`);
  return found;
});

const bestsellers = pickFlavours("pistachio", "biscoff", "chocolate-ferrero", "salted-caramel", "alphonso-mango", "raspberry-ripple", "bubblegum-blue", "hazelnut-white-bueno");
const wheelFlavours = pickFlavours("alphonso-mango", "pistachio", "bubblegum-blue", "strawberry", "chocolate-ferrero", "biscoff", "mint-chocolate-chip", "wild-berry");

const contactInfo = {
  hqName: "Avellino Gelato HQ",
  hqLines: ["Unit 2 Gloucester Court", "Leeds", "LS12 2ER"],
  phone: "+44 113 460 1693",
  phoneHref: "tel:+441134601693",
  whatsapp: "https://wa.me/441134601693",
  email: "hello@avellinogelato.in",
  instagram: "https://www.instagram.com/avellinogelato/",
};
const hqMapUrl = `https://maps.google.com/?q=${encodeURIComponent(`${contactInfo.hqName}, ${contactInfo.hqLines.join(", ")}`)}`;

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/** Avellino Gelato badge, redrawn as SVG: gold ring, cone, script name and swoosh. Lettering uses currentColor. */
function AvellinoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`avellino-mark ${className}`} viewBox="80 60 1640 1230" role="img" aria-label="Avellino Gelato">
      <g fill="none" stroke="var(--logo-gold, #f2a93b)" strokeLinecap="round">
        <path d="M 359 519 A 548 548 0 0 1 1395 470" strokeWidth="38" />
        <path d="M 1417 800 A 548 548 0 0 1 350 790" strokeWidth="38" />
        <path d="M 655 290 A 455 455 0 0 1 780 240" strokeWidth="13" />
        <path d="M 1030 240 A 455 455 0 0 1 1160 300" strokeWidth="13" />
        <path d="M 1225 975 A 455 455 0 0 1 585 985" strokeWidth="13" />
      </g>
      <path d="M 676 820 Q 1090 772 1500 728 L 1496 744 Q 1092 792 686 834 Z" fill="var(--logo-gold, #f2a93b)" />
      <path d="M 900 752 Q 1120 734 1330 718" fill="none" stroke="var(--logo-gold, #f2a93b)" strokeWidth="7" strokeLinecap="round" />
      <g fill="currentColor">
        <path d="M 838 300 L 952 300 L 868 492 Z" transform="rotate(-8 895 300)" />
        <circle cx="866" cy="262" r="46" />
        <circle cx="928" cy="250" r="54" />
        <circle cx="898" cy="208" r="50" />
        <text x="890" y="738" textAnchor="middle" textLength="1470" lengthAdjust="spacingAndGlyphs" transform="rotate(-5 890 640)" style={{ font: '400 330px "Pacifico", cursive' }}>Avellino</text>
        <text x="915" y="958" textAnchor="middle" textLength="600" lengthAdjust="spacingAndGlyphs" style={{ font: '400 132px "Paytone One", sans-serif', letterSpacing: "8px" }}>GELATO</text>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={640 + i * 78} y="992" width="44" height="9" rx="4.5" />)}
      </g>
    </svg>
  );
}

function Logo({ full = false }: { full?: boolean }) {
  return (
    <a href="/" className={full ? "logo logo-full" : "logo"} aria-label="Avellino Gelato home">
      <AvellinoMark />
    </a>
  );
}

function Header() {
  const { cart, user } = useStore();
  const count = tubCount(cart);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = ["Home", "Our Story", "Flavours", "Sell Our Gelato", "Contact"];
  const href = (label: string) =>
    label === "Home" ? "/" : label === "Our Story" ? "/about" : `/${label.toLowerCase().replace(/ /g, "-")}`;

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
          <a className="button small desktop-order" href="/flavours">
            Order now
          </a>
          <a className="icon-button account-button" href={user ? "/account" : "/login"} aria-label={user ? `My account (${user.name})` : "Log in"} title={user ? user.name : "Log in"}>
            <UserRound size={21} />
            {user && <i className="account-dot" />}
          </a>
          <button className="icon-button cart-button" onClick={() => actions.openCart(true)} aria-label={`Basket: ${count} tubs`}>
            <ShoppingBag size={21} />
            <span>{count}</span>
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
      <CartDrawer />
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

function ParallaxPanel({ src, alt, kicker, title, text, link, side }: { src: string; alt: string; kicker: string; title: string; text: string; link?: string; side: "left" | "right" }) {
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
        {link && <a className="button" href="#outlets">{link} <ArrowRight size={18} /></a>}
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
    // transparent cut-outs (public/images/flavours/cutout) so the scoops float on the red
    ...pickFlavours("strawberry", "pistachio", "bubblegum-blue", "biscoff", "chocolate-ferrero", "raspberry-ripple").map((f) => [f.name, img(`flavours/cutout/${f.slug}.png`)]),
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
    kicker: "Handcrafted in London",
    line1: "Scooped with",
    accent: "love.",
    text: "Experience what could be the finest ice cream you’ve ever tasted—crafted to deliver exceptional flavour in every bite.",
    main: photos.heroCone,
    alt: "A waffle cone with mango, strawberry and pistachio scoops",
    toppings: [toppings.strawberry, toppings.pista, toppings.wafer, toppings.chocolate],
    note: ["23", "handcrafted flavours"],
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
    toppings: [toppings.wafer, toppings.pista, toppings.strawberry, toppings.chocolate],
    note: ["Seasonal", "Alphonso Mango"],
  },
  {
    theme: "mawa",
    kind: "scoop",
    kicker: "Real milk. Real joy.",
    line1: "Taste the",
    accent: "good stuff.",
    text: "Roasted pistachios folded through fresh milk and double cream — our silky, nutty signature scoop.",
    main: scoops.pista,
    alt: "A scoop of pistachio gelato",
    toppings: [toppings.chocolate, toppings.pista, toppings.wafer, toppings.strawberry],
    note: ["Bestseller", "Pistachio"],
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
    { label: "Fruity", tone: "pill-pink", items: flavourList.filter((f) => f.family === "Fruity").map((f) => [f.name, fl(f.slug)]) },
    { label: "Indulgent", tone: "pill-sky", items: flavourList.filter((f) => f.family !== "Fruity").slice(0, 9).map((f) => [f.name, fl(f.slug)]) },
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
    ["4", "Flavour families"],
    ["23", "Flavours"],
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

function ProductVisual({ src, name }: { src: string; name: string }) {
  return (
    <div className="product-visual">
      <img src={src} alt={`${name} gelato`} loading="lazy" />
    </div>
  );
}

function Bestsellers() {
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
          {bestsellers.map((item) => (
            <SwiperSlide key={item.slug}>
              <article className="product-card">
                {item.badge && <span className="badge">{item.badge}</span>}
                <ProductVisual src={fl(item.slug)} name={item.name} />
                <h3>{item.name}</h3>
                <p>{item.note}</p>
                <div className="product-bottom">
                  <small className="card-family tub-price">5L tub · <strong>{gbp(TUB.price)}</strong></small>
                  <button className="add-button" onClick={() => actions.addTub(item.slug)}>Add +</button>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Reveal>
  );
}

const sprinkleColours = ["#f00540", "#fca081", "#8fd8f5", "#ffd23f", "#fff", "#b98af0"];

/** Spin-the-wheel flavour picker: the dial turns, the section floods with the flavour's colour. */
function FlavourWheel() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [added, setAdded] = useState(false);
  const reduced = useReducedMotion();
  const count = wheelFlavours.length;
  const angle = 360 / count;
  const index = ((step % count) + count) % count;
  const active = wheelFlavours[index];
  const story = { bg: active.colour, ink: active.ink, note: active.note, meters: active.meters };
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
    actions.addTub(active.slug);
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
                <motion.span className="wheel-badge" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}>{active.badge ?? active.family}</motion.span>
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
              <strong className="wheel-family">5L tub · {gbp(TUB.price)} <small>≈ {TUB.scoops} scoops</small></strong>
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
              {wheelFlavours.map((f, i) => (
                <div className="wheel-slot" key={f.slug} style={{ transform: `rotate(${i * angle}deg) translateY(calc(var(--wheel-r) * -1))` }}>
                  <motion.button
                    className={i === index ? "wheel-thumb active" : "wheel-thumb"}
                    animate={{ rotate: step * angle - i * angle, scale: i === index ? 1.22 : 1 }}
                    transition={{ type: "spring", stiffness: 55, damping: 14 }}
                    onClick={() => select(i)}
                    aria-label={`Show ${f.name}`}
                    aria-pressed={i === index}
                  >
                    <img src={fl(f.slug)} alt="" />
                  </motion.button>
                </div>
              ))}
            </motion.div>
            <div className="wheel-centre">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={active.name}
                  src={fl(active.slug)}
                  alt={`${active.name} gelato`}
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
  const cover: Record<FlavourFamily, string> = { Fruity: "raspberry-ripple", "Chocolate & Nutty": "chocolate-ferrero", "Cookies & Treats": "biscoff", "Creamy Classics": "salted-caramel" };
  const items = flavourFamilies.map((family) => [family, `${flavourList.filter((f) => f.family === family).length} flavours`, family.split(" ")[0].toLowerCase(), img(`flavours/cutout/${cover[family]}.png`)]);
  return (
    <Reveal className="section categories">
      <div className="container">
        <SectionTitle eyebrow="THE WORLD OF AVELLINO" script="The world of Avellino">
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
        <ParallaxPanel side="right" src={photos.sundae} alt="Two friends sharing a big ice cream sundae" kicker="The tasting bar" title="A little adventure in every bowl." text="Sample small-batch specials, build sundae flights, and discover your next favourite flavour." />
        <ParallaxPanel side="left" src={photos.parlour} alt="Bright pastel ice cream parlour with a gelato counter" kicker="The Avellino moment" title="Your happy place, after every long day." text="Bright corners, generous sundaes and room for one more friend around the table." link="Find your table" />
      </Reveal>
    </>
  );
}

function Testimonials() {
  const reviews = [
    ["“The Pistachio tastes like a summer holiday in Italy — silky, nutty and not too sweet.”", "Riya Patel", "Vesu, Surat", img("note-family.webp")],
    ["“We booked Avellino for our party. The team was warm and quick — and the Biscoff disappeared first!”", "Dhruv Shah", "Adajan, Surat", img("note-couple.webp")],
    ["“My children vote Bubblegum Blue. I quietly finish the Salted Caramel after they sleep.”", "Anjali Mehta", "Navsari", img("note-kid.webp")],
    ["“Fresh flavour, lovely service and the happiest little corner in the neighbourhood.”", "Kabir Desai", "Bardoli", img("note-friends.webp")],
  ];
  return (
    <Reveal className="section testimonials">
      <div className="container">
        <CurvedTitle script="Scoops of love" text="Loved by our regulars" />
        <Swiper modules={[Autoplay]} autoplay={{ delay: 2800 }} loop spaceBetween={22} breakpoints={{ 0: { slidesPerView: 1.08 }, 700: { slidesPerView: 2.1 }, 1050: { slidesPerView: 3 } }}>
          {reviews.map(([quote, name, area, photo], i) => (
            <SwiperSlide key={name}><article className={`review review-${i}`}><img className="review-photo" src={photo} alt={`${name} enjoying Avellino gelato`} loading="lazy" /><div className="stars">{[1,2,3,4,5].map(n => <Star key={n} size={16} fill="currentColor" />)}</div><blockquote>{quote}</blockquote><div className="reviewer"><span>{name[0]}</span><div><strong>{name}</strong><small>{area}</small></div></div></article></SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Reveal>
  );
}

function Outlets() {
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(`${contactInfo.hqLines.join(", ")}`)}&z=15&output=embed`;
  return (
    <Reveal className="section outlets wave-top" >
      <div className="container" id="outlets">
        <SectionTitle eyebrow="FIND OUR LOCATION" script="Find our location">
          Joy is just around <Stroked>the corner.</Stroked>
        </SectionTitle>
        <div className="location-card">
          <div className="location-info">
            <div className="location-photo"><img src={photos.parlour} alt="Inside the Avellino Gelato parlour" loading="lazy" /></div>
            <div className="location-text">
              <span>Leeds</span>
              <h3>{contactInfo.hqName}</h3>
              <p className="location-address"><MapPin size={18} /> <span>{contactInfo.hqLines.join(", ")}</span></p>
              <p className="location-address"><Phone size={18} /> <a href={contactInfo.phoneHref}>{contactInfo.phone}</a></p>
              <div className="hero-buttons">
                <a className="button" href={hqMapUrl} target="_blank" rel="noreferrer">Get directions <ArrowRight size={18} /></a>
                <a className="button button-outline" href="/contact">Contact us</a>
              </div>
            </div>
          </div>
          <div className="location-map">
            <iframe title={`Map showing ${contactInfo.hqName}`} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

const tradeBusinessTypes = ["Restaurant", "Cafe", "Hotel", "Catering Company", "Retail Store", "Distributor", "Other"];
const tradeFrequencies = ["Weekly", "Bi-weekly", "Monthly", "Seasonal", "As needed"];
const tradeVolumes = ["Small (Under £100)", "Medium (£100-£500)", "Large (£500-£1000)", "Very Large (£1000+)"];

function WholesalePage() {
  const [sent, setSent] = useState(false);
  useEffect(() => {
    document.title = "Sell Our Gelato · Trade & Wholesale · Avellino Gelato";
  }, []);
  const benefits = [
    [BadgeCheck, "Competitive wholesale pricing", "Premium gelato at trade prices that leave room for a healthy margin."],
    [CreditCard, "Flexible payment terms", "Payment options that fit the way your business runs."],
    [Headset, "Dedicated account support", "One friendly contact who knows your account and your menu."],
    [Truck, "Fast and reliable delivery", "Frozen, on time and ready to scoop for your customers."],
  ] as const;
  const partners = [
    [UtensilsCrossed, "Restaurants"], [Coffee, "Cafés"], [Hotel, "Hotels"],
    [PartyPopper, "Caterers"], [Store, "Retail stores"], [Package, "Distributors"],
  ] as const;
  const showcase = pickFlavours("strawberry", "pistachio", "bubblegum-blue", "biscoff", "chocolate-ferrero", "raspberry-ripple");
  const rise = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.6 } };

  return (
    <>
      <Header />
      <main className="inner-page trade-page">
        <section className="page-hero"><span>TRADE &amp; WHOLESALE</span><h1>Sell our gelato</h1><p>Join our wholesale programme and offer premium gelato to your customers.</p></section>

        <section className="section trade-benefits wave-top">
          <div className="container">
            <SectionTitle eyebrow="WHY PARTNER WITH US" script="Why partner with us">
              Gelato your customers <Stroked>will love.</Stroked>
            </SectionTitle>
            <div className="trade-benefit-grid">
              {benefits.map(([Icon, title, text], i) => (
                <motion.article className="trade-benefit" key={title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.1, duration: 0.55 }}>
                  <span className="trade-icon"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="trade-showcase">
          <div className="container trade-showcase-inner">
            <motion.div {...rise}>
              <span className="script">Ready for your menu</span>
              <h2>23 handcrafted flavours.</h2>
              <p>Made with fresh milk and double cream — from fruity favourites to rich, nutty classics.</p>
              <a className="button button-cream" href="/flavours">See all flavours <ArrowRight size={18} /></a>
            </motion.div>
            <div className="trade-scoops">
              {showcase.map((f, i) => (
                <motion.figure key={f.slug} initial={{ opacity: 0, y: 40, rotate: -10 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", bounce: 0.4 }}>
                  <img src={img(`flavours/cutout/${f.slug}.png`)} alt={`${f.name} gelato`} loading="lazy" />
                  <figcaption>{f.name}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section trade-enquiry" id="trade-form">
          <div className="container trade-grid">
            <motion.div className="trade-copy" {...rise}>
              <span className="script">Get trade pricing</span>
              <h2>Trade &amp; wholesale <Stroked>inquiry.</Stroked></h2>
              <p>Complete the form and our trade team will get back to you with pricing, delivery options and everything you need to get started.</p>
              <h3>Who we work with</h3>
              <ul className="trade-partners">
                {partners.map(([Icon, label]) => <li key={label}><Icon size={18} /> {label}</li>)}
              </ul>
              <div className="trade-contact">
                <a href={contactInfo.phoneHref}><Phone size={18} /> {contactInfo.phone}</a>
                <a href={`mailto:${contactInfo.email}`}><Mail size={18} /> {contactInfo.email}</a>
              </div>
            </motion.div>

            <form className="trade-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="done" className="success" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Check />
                    <h3>Thank you — inquiry received!</h3>
                    <p>Our trade team will be in touch within one business day.</p>
                  </motion.div>
                ) : (
                  <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                    <h3 className="trade-form-title">Get trade pricing</h3>
                    <div className="field-row">
                      <label>First Name *<input required autoComplete="given-name" /></label>
                      <label>Last Name *<input required autoComplete="family-name" /></label>
                    </div>
                    <div className="field-row">
                      <label>Email Address *<input required type="email" autoComplete="email" /></label>
                      <label>Phone Number<input type="tel" autoComplete="tel" /></label>
                    </div>
                    <div className="field-row">
                      <label>Company Name *<input required autoComplete="organization" /></label>
                      <label>Business Type *
                        <select required defaultValue="">
                          <option value="" disabled>Select business type</option>
                          {tradeBusinessTypes.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </label>
                    </div>
                    <label>Business Address<input autoComplete="street-address" /></label>
                    <div className="field-row">
                      <label>Expected Order Frequency
                        <select defaultValue="">
                          <option value="" disabled>Select frequency</option>
                          {tradeFrequencies.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </label>
                      <label>Expected Order Volume
                        <select defaultValue="">
                          <option value="" disabled>Select volume</option>
                          {tradeVolumes.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </label>
                    </div>
                    <label>Additional Information<textarea rows={4} placeholder="Tell us about your business needs, specific products you're interested in, or any questions you have..." /></label>
                    <label className="trade-consent">
                      <input type="checkbox" required />
                      <span>I agree to receive trade communications and understand that my information will be used in accordance with the privacy policy. *</span>
                    </label>
                    <button className="button full" type="submit">Submit Trade Inquiry <ArrowRight size={18} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContactNewsletter() {
  const [sent, setSent] = useState(false);
  return (
    <Reveal className="section contact-section wave-top">
      <div className="container scream-title">
        <span className="script">We hear you scream</span>
        <h2><Stroked>for ice-cream!</Stroked></h2>
      </div>
      <div className="container contact-grid">
        <div className="contact-copy"><span>Let's talk sweet</span><h2>Have a party in mind?</h2><p>Tell us what you're dreaming up. Our celebration team will get back to you within one business day.</p><a href={contactInfo.phoneHref}><Phone /> {contactInfo.phone}</a><a href={`mailto:${contactInfo.email}`}><Mail /> {contactInfo.email}</a>
          <address className="hq-card">
            <span className="hq-pin"><MapPin /></span>
            <div>
              <strong>{contactInfo.hqName}</strong>
              {contactInfo.hqLines.map((line) => <span key={line}>{line}</span>)}
              <a href={hqMapUrl} target="_blank" rel="noreferrer">Get directions <ArrowRight size={15} /></a>
            </div>
          </address>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="contact-form">
          {sent ? <motion.div className="success" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check /><h3>Sweet! Message received.</h3><p>We'll be in touch very soon.</p></motion.div> : <>
            <div className="field-row"><label>Name<input required placeholder="Your name" /></label><label>Phone<input required pattern="[0-9 +]{8,}" placeholder="+44" /></label></div>
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
        <div><Logo full /><p>Small-batch gelato, lovingly churned with fresh milk and double cream.</p><div className="socials"><a href={contactInfo.instagram} target="_blank" rel="noreferrer" aria-label="Avellino Gelato on Instagram">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
          </a><a href="#" aria-label="Youtube"><Play /></a></div></div>
        <div><h4>Flavours</h4><a href="/flavours?category=Fruity">Fruity</a><a href="/flavours?category=Chocolate%20%26%20Nutty">Chocolate &amp; nutty</a><a href="/flavours?category=Cookies%20%26%20Treats">Cookies &amp; treats</a><a href="/flavours?category=Creamy%20Classics">Creamy classics</a></div>
        <div><h4>Company</h4><a href="/about">Our story</a><a href="/sell-our-gelato">Sell our gelato</a><a href="/#outlets">Find us</a><a href="/contact">Contact</a><a href="/contact">Party orders</a></div>
        <div><h4>Visit us</h4><p><strong>{contactInfo.hqName}</strong><br />{contactInfo.hqLines.map((line, i) => <span key={line}>{line}{i < contactInfo.hqLines.length - 1 && <br />}</span>)}</p><p><a href={contactInfo.phoneHref}>{contactInfo.phone}</a></p></div>
      </div>
      <div className="container copyright"><span>© 2025 Avellino Gelato</span><span>Made with milk & a little magic.</span></div>
    </footer>
  );
}

const menuCategories = ["All", ...flavourFamilies] as const;
type MenuCategory = FlavourFamily;

type MenuVisual =
  | { kind: "tile"; src: string }
  | { kind: "scoop"; src: string }
  | { kind: "photo"; src: string; tint?: string };

type MenuItem = { slug: string; name: string; category: MenuCategory; note: string; tag?: string; visual: MenuVisual };

const categoryIntros: Record<MenuCategory, string> = {
  Fruity: "Bright, juicy scoops made with real fruit — fresh, tangy and full of flavour.",
  "Chocolate & Nutty": "Rich cocoa, roasted pistachio and hazelnut — deep, indulgent and silky.",
  "Cookies & Treats": "Biscuits, brownies and a little bubblegum fun in every scoop.",
  "Creamy Classics": "Timeless, smooth and beautifully balanced — the scoops we never take off the counter.",
};

const menuItems: MenuItem[] = flavourList.map((f) => ({ slug: f.slug, name: f.name, category: f.family, note: f.note, tag: f.badge, visual: { kind: "tile", src: fl(f.slug) } }));

const categoryFromUrl = (): (typeof menuCategories)[number] => {
  const wanted = new URLSearchParams(window.location.search).get("category");
  return menuCategories.find((c) => c.toLowerCase() === wanted?.toLowerCase()) ?? "All";
};

function MenuVisualArt({ visual, name }: { visual: MenuVisual; name: string }) {
  if (visual.kind === "photo") {
    return <div className="menu-visual photo"><img src={visual.src} alt={name} loading="lazy" style={visual.tint ? { filter: visual.tint } : undefined} /></div>;
  }
  if (visual.kind === "tile") {
    return <div className="menu-visual tile"><img src={visual.src} alt={`${name} gelato`} loading="lazy" /></div>;
  }
  return <div className="menu-visual scoop"><img src={visual.src} alt={name} loading="lazy" /></div>;
}

function MenuCard({ item }: { item: MenuItem }) {
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
        <span className="menu-card-cat">{item.category}</span>
        <h3>{item.name}</h3>
        <p>{item.note}</p>
        <p className="tub-line">5L tub · ≈ {TUB.scoops} scoops · <strong>{gbp(TUB.price)}</strong></p>
        <div className="product-bottom">
          <a className="details-button" href={`/flavours/${item.slug}`}>Details <ArrowRight size={15} /></a>
          <button className="add-button" onClick={() => { actions.addTub(item.slug); setAdded(true); setTimeout(() => setAdded(false), 1200); }}>
            {added ? "Added ✓" : "Add +"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function FlavoursMenu() {
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
    <section className="menu-section wave-top">
      <div className="container menu-page">
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
          <h2>{category === "All" ? "All 23 flavours" : category}</h2>
          <p>{category === "All" ? "Every flavour we churn — from bright, fruity scoops to rich, nutty classics." : categoryIntros[category]} <span>{shown.length} {shown.length === 1 ? "flavour" : "flavours"}</span></p>
        </motion.div>
      </AnimatePresence>
      <motion.div layout className="menu-grid">
        <AnimatePresence mode="popLayout">
          {shown.map((item) => <MenuCard key={item.name} item={item} />)}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && <p className="menu-empty">No flavours match “{query}”. Try another search.</p>}
      </div>
    </section>
  );
}

function OurStory() {
  const pillars = [
    [Milk, "Fresh milk & double cream", "Every batch starts with fresh milk and rich double cream — the base of our silky-smooth texture."],
    [Sparkles, "Carefully selected ingredients", "We choose each nut, fruit and cocoa for flavour first, so every scoop tastes exactly as it should."],
    [Clock3, "Precision & patience", "Slowly churned and beautifully balanced — we never rush a batch on its way to your cone."],
  ] as const;
  const promises = ["Exceptional texture", "Authentic flavour", "A truly memorable dessert experience"];
  const rise = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.6 } };
  return (
    <>
      <section className="section our-story wave-top">
        <div className="container our-story-grid">
          <motion.div className="story-collage" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
            <img className="collage-main" src={photos.parlour} alt="Inside an Avellino Gelato parlour, with the gelato counter" />
            <img className="collage-side" src={img("product-sundae.webp")} alt="A gelato sundae with cherries and whipped cream" loading="lazy" />
            <img className="collage-scoop" src={scoops.pista} alt="" loading="lazy" />
            <span className="collage-badge"><strong>100%</strong> fresh milk &amp;<br />double cream</span>
          </motion.div>
          <div className="our-story-copy">
            <motion.span className="script" {...rise}>Our story</motion.span>
            <motion.h2 {...rise}>Pure. Delicious. <Stroked>Memorable.</Stroked></motion.h2>
            <motion.p className="story-lead" {...rise}>
              At Avellino Gelato we believe gelato should be as pure and delicious as it is memorable. That's why every batch is made with fresh milk and double cream, combined with carefully selected ingredients.
            </motion.p>
            <motion.p {...rise}>
              Silky-smooth and beautifully balanced, our gelato is crafted with precision, patience, and the finest ingredients. Every batch is made to deliver exceptional texture, authentic flavour, and a truly memorable dessert experience.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="section story-pillars wave-top">
        <div className="container">
          <SectionTitle eyebrow="IN EVERY BATCH" script="In every batch">
            What makes it <Stroked>Avellino.</Stroked>
          </SectionTitle>
          <div className="pillar-grid">
            {pillars.map(([Icon, title, text], i) => (
              <motion.article className="pillar-card" key={title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.12, duration: 0.6 }}>
                <span className="pillar-num">0{i + 1}</span>
                <div className="pillar-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-promise">
        <div className="container">
          <motion.p className="promise-quote" {...rise}>“Silky-smooth and beautifully balanced.”</motion.p>
          <ul>
            {promises.map((item, i) => (
              <motion.li key={item} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12, type: "spring", bounce: 0.4 }}>
                <Check size={18} /> {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section story-cta">
        <motion.div className="container story-cta-inner" {...rise}>
          <span className="script">Come and see for yourself</span>
          <h2>Taste the <Stroked>difference.</Stroked></h2>
          <div className="hero-buttons">
            <a className="button" href="/flavours">Explore flavours <ArrowRight size={18} /></a>
            <a className="button button-outline" href="/#outlets">Find an outlet</a>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function FlavourDetailPage({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const flavour = flavourList.find((f) => f.slug === slug);
  useEffect(() => {
    document.title = flavour ? `${flavour.name} · Avellino Gelato` : "Flavour not found · Avellino Gelato";
    window.scrollTo(0, 0);
  }, [flavour]);

  const back = () => {
    // return to wherever the visitor came from on this site; otherwise open the flavour's family tab
    const cameFromSite = document.referrer && new URL(document.referrer).origin === window.location.origin;
    if (cameFromSite && window.history.length > 1) window.history.back();
    else window.location.href = flavour ? `/flavours?category=${encodeURIComponent(flavour.family)}` : "/flavours";
  };

  if (!flavour) {
    return (
      <>
        <Header />
        <main className="inner-page flavour-missing">
          <h1>We couldn't find that flavour.</h1>
          <a className="button" href="/flavours">See all flavours <ArrowRight size={18} /></a>
        </main>
        <Footer />
      </>
    );
  }

  const index = flavourList.indexOf(flavour);
  const prev = flavourList[(index - 1 + flavourList.length) % flavourList.length];
  const next = flavourList[(index + 1) % flavourList.length];
  const related = flavourList.filter((f) => f.family === flavour.family && f.slug !== flavour.slug).slice(0, 3);
  const info = flavourDetails[flavour.slug];

  return (
    <>
      <Header />
      <main className="inner-page flavour-page">
        <section className="flavour-hero" style={{ background: flavour.colour, color: flavour.ink }}>
          <div className="container">
            <button className="back-button" onClick={back}><ChevronLeft size={18} /> Back</button>
            <div className="flavour-hero-grid">
              <motion.div className="flavour-photo" initial={{ scale: 0.6, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", bounce: 0.4, duration: 0.9 }}>
                <img src={fl(flavour.slug)} alt={`${flavour.name} gelato`} />
              </motion.div>
              <motion.div className="flavour-info" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
                <div className="flavour-tags">
                  <a href={`/flavours?category=${encodeURIComponent(flavour.family)}`}>{flavour.family}</a>
                  {flavour.badge && <span>{flavour.badge}</span>}
                </div>
                <h1>{flavour.name}</h1>
                <p className="flavour-note">{info?.description ?? flavour.note}</p>
                <div className="taste-meters">
                  {["Creaminess", "Sweetness", "Crunch"].map((label, i) => (
                    <div className="meter" key={label}>
                      <span>{label}</span>
                      <div className="meter-track"><motion.i initial={{ width: 0 }} animate={{ width: `${flavour.meters[i]}%` }} transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: "easeOut" }} /></div>
                    </div>
                  ))}
                </div>
                <div className="tub-box">
                  <div className="tub-box-info">
                    <span className="tub-badge">{TUB.litres}L</span>
                    <div>
                      <strong>{TUB.litres} litre tub</strong>
                      <small>Approx. {TUB.scoops} scoops · {gbp(TUB.price)} per tub</small>
                    </div>
                  </div>
                  <div className="tub-box-actions">
                    <div className="qty-stepper" aria-label="Number of tubs">
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One fewer tub"><Minus size={16} /></button>
                      <span>{qty}</span>
                      <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="One more tub"><Plus size={16} /></button>
                    </div>
                    <button className="button" onClick={() => { actions.addTub(flavour.slug, qty); setAdded(true); setQty(1); setTimeout(() => setAdded(false), 1400); }}>
                      {added ? <>Added <Check size={18} /></> : <>Add to basket · {gbp(qty * TUB.price)}</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {info && (
          <section className="section flavour-facts">
            <div className="container facts-grid">
              <motion.article className="fact-card ingredients" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
                <div className="fact-head"><span><ListChecks /></span><h2>Ingredients</h2></div>
                <p><IngredientText text={info.ingredients} /></p>
                <small className="fact-hint">Allergens are shown in <strong>bold</strong>.</small>
              </motion.article>
              <div className="fact-stack">
                <motion.article className="fact-card warning" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.1 }}>
                  <div className="fact-head"><span><TriangleAlert /></span><h2>May contain</h2></div>
                  <p><IngredientText text={flavourMayContain} /></p>
                </motion.article>
                <motion.article className="fact-card advice" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.2 }}>
                  <div className="fact-head"><span><Info /></span><h2>Allergen advice</h2></div>
                  <p>{flavourAllergenAdvice}</p>
                </motion.article>
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="section flavour-related">
            <div className="container">
              <SectionTitle eyebrow="YOU MIGHT ALSO LOVE" script="You might also love">
                More <Stroked>{flavour.family.toLowerCase()}.</Stroked>
              </SectionTitle>
              <div className="related-grid">
                {related.map((f) => (
                  <a className="related-card" key={f.slug} href={`/flavours/${f.slug}`}>
                    <img src={fl(f.slug)} alt="" loading="lazy" />
                    <div><h3>{f.name}</h3><p>{f.note}</p><span>Details <ArrowRight size={15} /></span></div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <nav className="container flavour-pager" aria-label="Other flavours">
          <a href={`/flavours/${prev.slug}`}><ChevronLeft /> <span><small>Previous</small>{prev.name}</span></a>
          <a href="/flavours" className="pager-all">All flavours</a>
          <a href={`/flavours/${next.slug}`}><span><small>Next</small>{next.name}</span> <ChevronRight /></a>
        </nav>
      </main>
      <Footer />
    </>
  );
}

/** Slide-out basket, shared by every page. */
function CartDrawer() {
  const { cart, cartOpen } = useStore();
  const { subtotal, tubs } = orderTotals(cart, "collection");
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && actions.openCart(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen]);
  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => actions.openCart(false)} />
          <motion.aside className="cart-drawer" role="dialog" aria-label="Your basket" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }} data-lenis-prevent>
            <div className="drawer-head">
              <div><span className="script">Your basket</span><h2>{tubs} {tubs === 1 ? "tub" : "tubs"}</h2></div>
              <button className="icon-button" onClick={() => actions.openCart(false)} aria-label="Close basket"><X /></button>
            </div>
            {cart.length === 0 ? (
              <div className="drawer-empty">
                <ShoppingBag size={42} />
                <p>Your basket is empty.</p>
                <a className="button" href="/flavours">Browse flavours <ArrowRight size={18} /></a>
              </div>
            ) : (
              <>
                <ul className="drawer-lines">
                  <AnimatePresence initial={false}>
                    {cart.map((line) => {
                      const f = flavourList.find((x) => x.slug === line.slug);
                      if (!f) return null;
                      return (
                        <motion.li key={line.slug} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                          <img src={fl(f.slug)} alt="" />
                          <div className="line-info">
                            <a href={`/flavours/${f.slug}`}>{f.name}</a>
                            <small>{TUB.litres}L tub · ≈ {TUB.scoops} scoops</small>
                            <div className="qty-stepper small">
                              <button onClick={() => actions.setQty(f.slug, line.qty - 1)} aria-label={`One fewer ${f.name} tub`}><Minus size={14} /></button>
                              <span>{line.qty}</span>
                              <button onClick={() => actions.setQty(f.slug, line.qty + 1)} aria-label={`One more ${f.name} tub`}><Plus size={14} /></button>
                            </div>
                          </div>
                          <div className="line-end">
                            <strong>{gbp(line.qty * TUB.price)}</strong>
                            <button className="line-remove" onClick={() => actions.remove(f.slug)} aria-label={`Remove ${f.name}`}><Trash2 size={16} /></button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
                <div className="drawer-foot">
                  <div className="drawer-total"><span>Subtotal</span><strong>{gbp(subtotal)}</strong></div>
                  <small>Collection from Leeds HQ: no minimum order. Local delivery: minimum {DELIVERY.minTubs} tubs, free delivery.</small>
                  <a className="button full" href="/checkout">Checkout <ArrowRight size={18} /></a>
                  <button className="text-button" onClick={() => actions.openCart(false)}>Continue shopping</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

const nextParam = () => new URLSearchParams(window.location.search).get("next") || "/account";

function DemoNote() {
  return <p className="demo-note"><Lock size={14} /> Demo mode — accounts and orders are saved in this browser only, and no payment is taken.</p>;
}

function LoginPage() {
  const { user } = useStore();
  const [mode, setMode] = useState<"login" | "signup">(new URLSearchParams(window.location.search).get("mode") === "signup" ? "signup" : "login");
  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [error, setError] = useState("");
  useEffect(() => {
    document.title = "Log in · Avellino Gelato";
  }, []);
  useEffect(() => {
    if (user) window.location.replace(nextParam());
  }, [user]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const problem = mode === "login"
      ? actions.logIn(get("email"))
      : actions.signUp({ name: get("name"), email: get("email"), phone: get("phone"), type: accountType, company: accountType === "business" ? get("company") : undefined });
    setError(problem ?? "");
  };

  return (
    <>
      <Header />
      <main className="inner-page auth-page">
        <section className="auth-wrap">
          <motion.div className="auth-side" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <span className="script">Order online</span>
            <h1>5 litre tubs, <Stroked>delivered.</Stroked></h1>
            <p>Every Avellino flavour comes in a {TUB.litres} litre tub — about {TUB.scoops} scoops. Log in to order for collection from our Leeds HQ or delivery to your door.</p>
            <div className="auth-scoops">
              {pickFlavours("strawberry", "pistachio", "biscoff").map((f) => <img key={f.slug} src={img(`flavours/cutout/${f.slug}.png`)} alt="" />)}
            </div>
          </motion.div>
          <motion.div className="auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="auth-tabs" role="tablist">
              {(["login", "signup"] as const).map((m) => (
                <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? "active" : ""} onClick={() => { setMode(m); setError(""); }}>
                  {mode === m && <motion.span className="tab-pill" layoutId="auth-tab" />}
                  <span className="tab-label">{m === "login" ? "Log in" : "Create account"}</span>
                </button>
              ))}
            </div>
            <form className="auth-form" onSubmit={submit} key={mode}>
              {mode === "signup" && (
                <>
                  <div className="account-type">
                    {(["personal", "business"] as const).map((t) => (
                      <label key={t} className={accountType === t ? "active" : ""}>
                        <input type="radio" name="type" checked={accountType === t} onChange={() => setAccountType(t)} />
                        {t === "personal" ? <UserRound size={18} /> : <Building2 size={18} />}
                        {t === "personal" ? "Personal" : "Business"}
                      </label>
                    ))}
                  </div>
                  <label>Full name *<input name="name" required autoComplete="name" /></label>
                  {accountType === "business" && <label>Company name *<input name="company" required autoComplete="organization" /></label>}
                  <label>Phone number *<input name="phone" type="tel" required autoComplete="tel" placeholder="+44" /></label>
                </>
              )}
              <label>Email address *<input name="email" type="email" required autoComplete="email" /></label>
              <label>Password *<input name="password" type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button full" type="submit">{mode === "login" ? "Log in" : "Create account"} <ArrowRight size={18} /></button>
              <p className="auth-switch">
                {mode === "login" ? "New to Avellino? " : "Already have an account? "}
                <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>{mode === "login" ? "Create an account" : "Log in"}</button>
              </p>
              <DemoNote />
            </form>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const collectionSlots = ["11:00 – 13:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 19:00"];
const deliverySlots = ["Morning (9am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)"];
const isoDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};
const prettyDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function OrderLines({ lines }: { lines: { slug: string; qty: number }[] }) {
  return (
    <ul className="summary-lines">
      {lines.map((line) => {
        const f = flavourList.find((x) => x.slug === line.slug);
        return f ? (
          <li key={line.slug}>
            <img src={fl(f.slug)} alt="" />
            <span><strong>{f.name}</strong><small>{line.qty} × {TUB.litres}L tub</small></span>
            <b>{gbp(line.qty * TUB.price)}</b>
          </li>
        ) : null;
      })}
    </ul>
  );
}

const ukBanks = ["Barclays", "HSBC UK", "Lloyds", "NatWest", "Santander", "Nationwide", "Halifax", "Monzo", "Starling", "Revolut"];

const paymentChoices: { id: PaymentMethod; label: string; hint: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Card", hint: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "apple", label: "Apple Pay", hint: "Pay with Face ID or Touch ID", icon: Smartphone },
  { id: "google", label: "Google Pay", hint: "Pay with your Google wallet", icon: Smartphone },
  { id: "paypal", label: "PayPal", hint: "Pay with your PayPal account", icon: Wallet },
  { id: "bank", label: "Pay by bank", hint: "Approve in your banking app", icon: Landmark },
  { id: "invoice", label: "Pay on invoice", hint: "Business accounts · 30-day terms", icon: FileText },
  { id: "collection", label: "Pay on collection", hint: "Card or cash when you pick up", icon: Banknote },
];

const luhnValid = (digits: string) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return digits.length >= 13 && sum % 10 === 0;
};
const formatCardNumber = (value: string) => value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};
const expiryValid = (value: string) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
};

function CheckoutPage() {
  const { cart, user } = useStore();
  const [method, setMethod] = useState<FulfilmentMethod>("collection");
  const [error, setError] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [bank, setBank] = useState("");
  const [processing, setProcessing] = useState<null | { stage: "processing" | "approved"; text: string }>(null);
  useEffect(() => {
    document.title = "Checkout · Avellino Gelato";
    if (!user) window.location.replace("/login?next=/checkout");
  }, [user]);
  if (!user) return null;

  const totals = orderTotals(cart, method);
  const shortBy = method === "delivery" ? Math.max(0, DELIVERY.minTubs - totals.tubs) : 0;
  const payOptions = paymentChoices.filter((p) => (p.id !== "invoice" || user.type === "business") && (p.id !== "collection" || method === "collection"));
  const pay = payOptions.some((p) => p.id === payMethod) ? payMethod : "card";
  const payButton: Record<PaymentMethod, string> = {
    card: `Pay ${gbp(totals.total)}`,
    apple: `Pay ${gbp(totals.total)} with Apple Pay`,
    google: `Pay ${gbp(totals.total)} with Google Pay`,
    paypal: `Continue to PayPal · ${gbp(totals.total)}`,
    bank: `Pay ${gbp(totals.total)} by bank`,
    invoice: `Place order on invoice · ${gbp(totals.total)}`,
    collection: `Place order · pay ${gbp(totals.total)} on collection`,
  };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    let address: DeliveryAddress | undefined;
    if (method === "delivery") {
      if (totals.tubs < DELIVERY.minTubs) return setError(`Delivery needs at least ${DELIVERY.minTubs} tubs — please add ${DELIVERY.minTubs - totals.tubs} more or choose collection.`);
      const postcode = get("postcode").toUpperCase();
      if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(postcode)) return setError("Please enter a valid UK postcode.");
      if (!DELIVERY.postcodePrefixes.some((prefix) => postcode.startsWith(prefix) && /\d/.test(postcode[prefix.length]))) {
        return setError("We currently deliver to Leeds (LS) postcodes only — please choose collection instead.");
      }
      address = { line1: get("line1"), line2: get("line2") || undefined, city: get("city"), postcode };
    }

    // demo payment: validate the chosen method, never keep card details (only the last 4 digits)
    let payment: Payment;
    const choice = paymentChoices.find((p) => p.id === pay)!;
    if (pay === "card") {
      const digits = card.number.replace(/\D/g, "");
      if (!luhnValid(digits)) return setError("Please check your card number.");
      if (!expiryValid(card.expiry)) return setError("Please check the card expiry date (MM/YY).");
      if (!/^\d{3,4}$/.test(card.cvc)) return setError("Please enter the 3 or 4 digit security code.");
      if (!card.name.trim()) return setError("Please enter the name on the card.");
      payment = { method: pay, label: "Card", detail: `•••• ${digits.slice(-4)}`, status: "Paid" };
    } else if (pay === "bank") {
      if (!bank) return setError("Please choose your bank.");
      payment = { method: pay, label: "Pay by bank", detail: bank, status: "Paid" };
    } else if (pay === "invoice") {
      payment = { method: pay, label: "Invoice", detail: "Due in 30 days", status: "Invoice due" };
    } else if (pay === "collection") {
      payment = { method: pay, label: "Pay on collection", detail: "Card or cash at Leeds HQ", status: "Pay on collection" };
    } else {
      payment = { method: pay, label: choice.label, status: "Paid" };
    }
    setError("");

    const finish = () => {
      const order = actions.placeOrder({
        method,
        date: get("date"),
        slot: get("slot"),
        address,
        contact: { name: get("name"), email: get("email"), phone: get("phone"), company: user.company },
        notes: get("notes") || undefined,
        payment,
      });
      window.location.href = `/order-confirmation?id=${order.id}`;
    };
    const waitingText: Record<PaymentMethod, string> = {
      card: "Processing your card payment…",
      apple: "Confirming with Apple Pay…",
      google: "Confirming with Google Pay…",
      paypal: "Redirecting to PayPal…",
      bank: `Connecting to ${bank || "your bank"}…`,
      invoice: "Placing your order…",
      collection: "Placing your order…",
    };
    const approvedText = payment.status === "Paid" ? "Payment approved" : "Order placed";
    setProcessing({ stage: "processing", text: waitingText[pay] });
    setTimeout(() => setProcessing({ stage: "approved", text: approvedText }), 1700);
    setTimeout(finish, 2600);
  };

  return (
    <>
      <Header />
      <main className="inner-page checkout-page">
        <section className="container checkout-wrap">
          <div className="checkout-head">
            <span className="script">Almost there</span>
            <h1>Checkout</h1>
          </div>
          {cart.length === 0 ? (
            <div className="checkout-empty">
              <ShoppingBag size={44} />
              <h2>Your basket is empty</h2>
              <p>Add a 5 litre tub of your favourite flavour to get started.</p>
              <a className="button" href="/flavours">Browse flavours <ArrowRight size={18} /></a>
            </div>
          ) : (
            <form className="checkout-grid" onSubmit={submit}>
              <div className="checkout-steps">
                <fieldset className="checkout-step">
                  <legend><span>1</span> How would you like your order?</legend>
                  <div className="method-options">
                    <label className={method === "collection" ? "method active" : "method"}>
                      <input type="radio" name="method" checked={method === "collection"} onChange={() => { setMethod("collection"); setError(""); }} />
                      <MapPin />
                      <strong>Collect from our location</strong>
                      <small>{contactInfo.hqName}, {contactInfo.hqLines.join(", ")} · Free · No minimum order</small>
                    </label>
                    <label className={method === "delivery" ? "method active" : "method"}>
                      <input type="radio" name="method" checked={method === "delivery"} onChange={() => { setMethod("delivery"); setError(""); }} />
                      <Truck />
                      <strong>Online delivery</strong>
                      <small>Leeds (LS) postcodes · Minimum {DELIVERY.minTubs} tubs · Free delivery</small>
                    </label>
                  </div>
                  <AnimatePresence>
                    {method === "delivery" && shortBy > 0 && (
                      <motion.div key="min" className="min-notice" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <Truck size={20} />
                        <div>
                          <strong>Delivery needs at least {DELIVERY.minTubs} tubs.</strong>
                          <span>You have {totals.tubs} — add {shortBy} more {shortBy === 1 ? "tub" : "tubs"}, or choose collection (no minimum order).</span>
                        </div>
                        <a className="details-button" href="/flavours">Add tubs <Plus size={15} /></a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    {method === "delivery" && (
                      <motion.div key="addr" className="address-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <label>Address line 1 *<input name="line1" required autoComplete="address-line1" /></label>
                        <label>Address line 2<input name="line2" autoComplete="address-line2" /></label>
                        <div className="field-row">
                          <label>Town / city *<input name="city" required defaultValue="Leeds" autoComplete="address-level2" /></label>
                          <label>Postcode *<input name="postcode" required autoComplete="postal-code" placeholder="LS12 2ER" /></label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </fieldset>

                <fieldset className="checkout-step">
                  <legend><span>2</span> {method === "collection" ? "Collection" : "Delivery"} date &amp; time</legend>
                  <div className="field-row">
                    <label>Date *<input name="date" type="date" required min={isoDate(method === "collection" ? 0 : 1)} defaultValue={isoDate(1)} key={method} /></label>
                    <label>Time slot *
                      <select name="slot" required defaultValue="" key={`slot-${method}`}>
                        <option value="" disabled>Select a time</option>
                        {(method === "collection" ? collectionSlots : deliverySlots).map((slot) => <option key={slot}>{slot}</option>)}
                      </select>
                    </label>
                  </div>
                  <small className="step-hint"><CalendarDays size={15} /> {method === "collection" ? "Collection orders are ready from 2 hours after ordering." : "Delivery orders are delivered from the next day."}</small>
                </fieldset>

                <fieldset className="checkout-step">
                  <legend><span>3</span> Contact details</legend>
                  <div className="field-row">
                    <label>Full name *<input name="name" required defaultValue={user.name} autoComplete="name" /></label>
                    <label>Phone *<input name="phone" type="tel" required defaultValue={user.phone} autoComplete="tel" /></label>
                  </div>
                  <label>Email *<input name="email" type="email" required defaultValue={user.email} autoComplete="email" /></label>
                  {user.company && <p className="step-hint"><Building2 size={15} /> Ordering for <strong>{user.company}</strong></p>}
                  <label>Order notes<textarea name="notes" rows={3} placeholder="Anything we should know about your order?" /></label>
                </fieldset>

                <fieldset className="checkout-step">
                  <legend><span>4</span> Payment</legend>
                  <div className="pay-options" role="radiogroup" aria-label="Payment method">
                    {payOptions.map((p) => {
                      const Icon = p.icon;
                      return (
                        <label key={p.id} className={pay === p.id ? `pay-option pay-${p.id} active` : `pay-option pay-${p.id}`}>
                          <input type="radio" name="payMethod" checked={pay === p.id} onChange={() => { setPayMethod(p.id); setError(""); }} />
                          <Icon size={20} />
                          <span><strong>{p.label}</strong><small>{p.hint}</small></span>
                        </label>
                      );
                    })}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={pay} className="pay-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      {pay === "card" && (
                        <>
                          <label>Card number *<input inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} /></label>
                          <div className="field-row three">
                            <label>Expiry *<input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} /></label>
                            <label>CVC *<input inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} /></label>
                            <label>Name on card *<input autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></label>
                          </div>
                          <p className="pay-note"><ShieldCheck size={15} /> Demo: test card 4242 4242 4242 4242, any future expiry and any 3-digit CVC. Card details are never stored.</p>
                        </>
                      )}
                      {(pay === "apple" || pay === "google" || pay === "paypal") && (
                        <p className="pay-note big"><ShieldCheck size={18} /> You'll confirm the payment with {pay === "apple" ? "Apple Pay (Face ID / Touch ID)" : pay === "google" ? "Google Pay" : "your PayPal account"} after pressing the button below.</p>
                      )}
                      {pay === "bank" && (
                        <>
                          <label>Choose your bank *
                            <select value={bank} onChange={(e) => setBank(e.target.value)}>
                              <option value="" disabled>Select your bank</option>
                              {ukBanks.map((b) => <option key={b}>{b}</option>)}
                            </select>
                          </label>
                          <p className="pay-note"><Landmark size={15} /> You'll approve the payment securely in your banking app — no card needed.</p>
                        </>
                      )}
                      {pay === "invoice" && (
                        <p className="pay-note big"><FileText size={18} /> We'll email an invoice to {user.company ?? user.name}. Payment is due within 30 days by bank transfer.</p>
                      )}
                      {pay === "collection" && (
                        <p className="pay-note big"><Banknote size={18} /> Pay by card or cash when you collect your order from {contactInfo.hqName}.</p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </fieldset>
              </div>

              <aside className="checkout-summary">
                <h2>Order summary</h2>
                <OrderLines lines={cart} />
                <div className="summary-row"><span>Subtotal ({totals.tubs} {totals.tubs === 1 ? "tub" : "tubs"})</span><span>{gbp(totals.subtotal)}</span></div>
                <div className="summary-row"><span>{method === "collection" ? "Collection" : "Delivery"}</span><span>{totals.deliveryFee ? gbp(totals.deliveryFee) : "Free"}</span></div>
                <div className="summary-row total"><span>Total</span><strong>{gbp(totals.total)}</strong></div>
                <small className="vat-note">Prices include VAT. Demo prices.</small>
                <label className="allergen-confirm">
                  <input type="checkbox" required />
                  <span>I've read the <a href="/flavours" target="_blank" rel="noreferrer">allergen information</a> for these flavours. Not suitable for customers with a nut allergy.</span>
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                {shortBy > 0 && <p className="form-error" role="status">Add {shortBy} more {shortBy === 1 ? "tub" : "tubs"} for delivery (minimum {DELIVERY.minTubs}).</p>}
                <button className={`button full pay-button pay-btn-${pay}`} type="submit" disabled={shortBy > 0 || !!processing}><Lock size={17} /> {payButton[pay]}</button>
                <div className="pay-badges" aria-hidden="true"><span>VISA</span><span>Mastercard</span><span>Amex</span><span>Apple Pay</span><span>G Pay</span><span>PayPal</span></div>
                <DemoNote />
              </aside>
            </form>
          )}
        </section>
      </main>
      <AnimatePresence>
        {processing && (
          <motion.div className="pay-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="assertive">
            <motion.div className="pay-modal" initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }}>
              <AnimatePresence mode="wait">
                {processing.stage === "processing" ? (
                  <motion.div key="spin" className="pay-spinner" exit={{ scale: 0 }}><LoaderCircle size={46} /></motion.div>
                ) : (
                  <motion.div key="ok" className="pay-done" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }}><Check size={40} /></motion.div>
                )}
              </AnimatePresence>
              <h3>{processing.text}</h3>
              <p>{gbp(totals.total)} · Demo payment, no money is taken.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}

function OrderMeta({ order }: { order: Order }) {
  return (
    <div className="order-meta">
      <div><small>{order.method === "collection" ? "Collection from" : "Delivery to"}</small>
        <strong>{order.method === "collection" ? contactInfo.hqName : order.address?.line1}</strong>
        <span>{order.method === "collection" ? contactInfo.hqLines.join(", ") : [order.address?.line2, order.address?.city, order.address?.postcode].filter(Boolean).join(", ")}</span>
      </div>
      <div><small>Date &amp; time</small><strong>{prettyDate(order.date)}</strong><span>{order.slot}</span></div>
      <div><small>Payment</small><strong>{order.payment?.label ?? "Card"}{order.payment?.detail ? ` · ${order.payment.detail}` : ""}</strong><span className={order.payment && order.payment.status !== "Paid" ? "pay-status due" : "pay-status"}>{order.payment?.status ?? "Paid"} · {gbp(order.total)}</span></div>
      <div><small>Order status</small><strong className="status-pill">{order.status}</strong><span>We'll keep you updated by email</span></div>
    </div>
  );
}

function OrderConfirmationPage() {
  const { orders } = useStore();
  const id = new URLSearchParams(window.location.search).get("id");
  const order = orders.find((o) => o.id === id);
  useEffect(() => {
    document.title = "Order confirmed · Avellino Gelato";
  }, []);
  return (
    <>
      <Header />
      <main className="inner-page confirm-page">
        <section className="container confirm-wrap">
          {order ? (
            <motion.div className="confirm-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <motion.div className="confirm-check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}><Check size={40} /></motion.div>
              <span className="script">Thank you, {order.contact.name.split(" ")[0]}!</span>
              <h1>Order <Stroked>confirmed.</Stroked></h1>
              <p className="confirm-id">Order number <strong>{order.id}</strong> · confirmation sent to {order.contact.email}</p>
              <OrderMeta order={order} />
              <OrderLines lines={order.lines} />
              <div className="summary-row total"><span>{order.payment && order.payment.status !== "Paid" ? "Total due" : "Total paid"}</span><strong>{gbp(order.total)}</strong></div>
              <DemoNote />
              <div className="hero-buttons center">
                <a className="button" href="/account">View my orders <ArrowRight size={18} /></a>
                <a className="button button-outline" href="/flavours">Keep browsing</a>
              </div>
            </motion.div>
          ) : (
            <div className="checkout-empty">
              <h2>We couldn't find that order.</h2>
              <a className="button" href="/account">My orders <ArrowRight size={18} /></a>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function AccountPage() {
  const { user, orders } = useStore();
  useEffect(() => {
    document.title = "My account · Avellino Gelato";
    if (!user) window.location.replace("/login?next=/account");
  }, [user]);
  if (!user) return null;
  const mine = orders.filter((o) => o.email === user.email);
  return (
    <>
      <Header />
      <main className="inner-page account-page">
        <section className="container account-wrap">
          <div className="account-head">
            <div>
              <span className="script">Welcome back</span>
              <h1>{user.name.split(" ")[0]}'s <Stroked>account.</Stroked></h1>
            </div>
            <button className="button button-outline" onClick={() => { actions.logOut(); window.location.href = "/"; }}><LogOut size={18} /> Log out</button>
          </div>
          <div className="account-grid">
            <aside className="profile-card">
              <span className="profile-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <h2>{user.name}</h2>
              <p className="profile-type">{user.type === "business" ? <><Building2 size={15} /> Business account</> : <><UserRound size={15} /> Personal account</>}</p>
              {user.company && <p><strong>{user.company}</strong></p>}
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <a className="button full" href="/flavours">Order tubs <ArrowRight size={18} /></a>
            </aside>
            <div className="orders-list">
              <h2>My orders</h2>
              {mine.length === 0 ? (
                <div className="checkout-empty small">
                  <ShoppingBag size={36} />
                  <p>No orders yet — your first 5 litre tub is waiting.</p>
                  <a className="button" href="/flavours">Browse flavours <ArrowRight size={18} /></a>
                </div>
              ) : (
                mine.map((order, i) => (
                  <motion.article className="order-card" key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <div className="order-card-head">
                      <div><strong>{order.id}</strong><small>Placed {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</small></div>
                      <button className="details-button" onClick={() => actions.reorder(order)}><RotateCcw size={15} /> Reorder</button>
                    </div>
                    <OrderMeta order={order} />
                    <div className="order-thumbs">
                      {order.lines.map((line) => {
                        const f = flavourList.find((x) => x.slug === line.slug);
                        return f ? <span key={line.slug}><img src={fl(f.slug)} alt="" />{line.qty} × {f.name}</span> : null;
                      })}
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SimplePage({ type }: { type: "flavours" | "about" | "contact" }) {
  const content = {
    flavours: ["Our full flavour menu", "Find the scoop that feels like you."],
    about: ["Our Story", "Pure, delicious and made to be remembered."],
    contact: ["Come say hello", "Visit Avellino Gelato HQ in Leeds, give us a call or drop us a sweet note."],
  }[type];
  return (
    <>
      <Header />
      <main className="inner-page">
        <section className="page-hero"><span>AVELLINO GELATO</span><h1>{content[0]}</h1><p>{content[1]}</p></section>
        {type === "flavours" && <FlavoursMenu />}
        {type === "about" && <OurStory />}
        {type === "contact" && <div className="contact-page-body wave-top"><ContactNewsletter /></div>}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
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
  if (path.startsWith("/sell-our-gelato") || path.startsWith("/outlets")) return <WholesalePage />;
  if (path.startsWith("/login")) return <LoginPage />;
  if (path.startsWith("/checkout")) return <CheckoutPage />;
  if (path.startsWith("/order-confirmation")) return <OrderConfirmationPage />;
  if (path.startsWith("/account")) return <AccountPage />;
  if (path.startsWith("/flavours/") && path.split("/")[2]) return <FlavourDetailPage slug={path.split("/")[2]} />;
  if (page) return <SimplePage type={page} />;

  return (
    <>
      <AnimatePresence>{!loaded && <motion.div className="intro" exit={{ opacity: 0 }}><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><Logo /><span /></motion.div></motion.div>}</AnimatePresence>
      <Header />
      <main>
        <Hero ready={loaded} />
        <Marquee />
        <StatsPromises />
        <Bestsellers />
        <Indulgence />
        <FlavourWheel />
        <Categories />
        <Process />
        <OffersExperience />
        <Testimonials />
        <Outlets />
        <ContactNewsletter />
      </main>
      <a className="whatsapp" href={contactInfo.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with Avellino Gelato on WhatsApp">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      </a>
      <Footer />
    </>
  );
}
