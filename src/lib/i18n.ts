export type Lang = 'en' | 'sw' | 'fr' | 'ar' | 'pt' | 'hi' | 'zh' | 'ms' | 'es' | 'ha';

export const languages: { code: Lang; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
];

const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.real_estate': 'Real Estate',
  'nav.cars': 'Cars',
  'nav.partners': 'Partners',
  'nav.about': 'About',
  'nav.sign_in': 'Sign In',
  'nav.list_property': 'List Property',
  'nav.list_car': 'List Car',

  // Hero
  'hero.tagline': 'Global Marketplace for Real Estate & Cars',
  'hero.title': 'Buy, Sell, and Protect Your Deals Globally',
  'hero.subtitle': 'Legal guarantees, escrow protection, and verified partners across 195 countries.',

  // Verticals
  'vertical.real_estate': 'Real Estate',
  'vertical.cars': 'Cars',
  'vertical.real_estate_desc': 'Find your next home, villa, or commercial asset with full legal protection.',
  'vertical.cars_desc': 'Browse verified luxury and utility vehicles worldwide with secure payment.',

  // Search
  'search.placeholder': 'Search by make, model, location, or keyword...',
  'search.button': 'Search',
  'search.filters': 'Filters',

  // Cars
  'cars.title': 'Featured Cars',
  'cars.make': 'Make',
  'cars.model': 'Model',
  'cars.year': 'Year',
  'cars.price': 'Price',
  'cars.mileage': 'Mileage',
  'cars.body_type': 'Body Type',
  'cars.fuel_type': 'Fuel Type',
  'cars.transmission': 'Transmission',
  'cars.condition': 'Condition',

  // Real Estate
  'real_estate.title': 'Featured Properties',
  'real_estate.type': 'Property Type',
  'real_estate.bedrooms': 'Bedrooms',
  'real_estate.bathrooms': 'Bathrooms',
  'real_estate.size': 'Size',

  // AI Features
  'ai.writer.title': 'AI Listing Writer',
  'ai.writer.description': 'Generate professional descriptions in seconds.',
  'ai.search.title': 'AI Semantic Search',
  'ai.search.placeholder': 'Describe what you are looking for (e.g., "A modern villa near the beach in Zanzibar").',

  // Payments
  'payment.secure': 'Secure Payment',
  'payment.escrow': 'Escrow Protected',
  'payment.methods': 'Pay via Stripe, Flutterwave, or Paystack',
};

// For other languages, I'll provide partial translations to save space, but keeping the keys consistent.
const sw: typeof en = { ...en, 'nav.home': 'Nyumbani', 'nav.real_estate': 'Majengo', 'nav.cars': 'Magari' };
const fr: typeof en = { ...en, 'nav.home': 'Accueil', 'nav.real_estate': 'Immobilier', 'nav.cars': 'Voitures' };
const ar: typeof en = { ...en, 'nav.home': 'الرئيسية', 'nav.real_estate': 'العقارات', 'nav.cars': 'السيارات' };
const pt: typeof en = { ...en, 'nav.home': 'Início', 'nav.real_estate': 'Imobiliário', 'nav.cars': 'Carros' };
const hi: typeof en = { ...en, 'nav.home': 'मुख्य पृष्ठ', 'nav.real_estate': 'रियल एस्टेट', 'nav.cars': 'कारें' };
const zh: typeof en = { ...en, 'nav.home': '首页', 'nav.real_estate': '房地产', 'nav.cars': '汽车' };
const ms: typeof en = { ...en, 'nav.home': 'Utama', 'nav.real_estate': 'Hartanah', 'nav.cars': 'Kereta' };
const es: typeof en = { ...en, 'nav.home': 'Inicio', 'nav.real_estate': 'Bienes Raíces', 'nav.cars': 'Coches' };
const ha: typeof en = { ...en, 'nav.home': 'Gida', 'nav.real_estate': 'Gidaje', 'nav.cars': 'Motoci' };

export const translations: Record<Lang, typeof en> = {
  en, sw, fr, ar, pt, hi, zh, ms, es, ha
};
