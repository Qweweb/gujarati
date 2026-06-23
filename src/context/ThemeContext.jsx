import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Define path mapping to feature flag keys
export const PATH_TO_FEATURE_KEY = {
  '/panchang': 'panchang',
  '/kundali': 'kundali',
  '/kuldevi': 'kuldevi',
  '/vastu': 'vastu',
  '/interest-calculator': 'interest_calculator',
  '/namkaran': 'namkaran',
  '/health': 'health',
  '/tools': 'tools',
  '/card': 'card',
  '/biodata': 'biodata',
  '/devotional-cards': 'devotional_cards',
  '/community': 'community',
  '/swipe-cards': 'swipe_cards',
  '/gujarat-safari': 'gujarat_safari',
  '/passport': 'passport',
  '/mysteries': 'mysteries',
  '/devotional': 'devotional',
  '/gita': 'gita',
  '/shradhanjali': 'shradhanjali',
  '/daily-challenge': 'daily_challenge',
  '/rewards': 'rewards',
  '/society': 'society',
  '/games': 'games',
  '/english': 'english',
};

// Default states for all features
export const DEFAULT_FEATURE_FLAGS = {
  devotional: 'live',
  health: 'live',
  community: 'live',
  tools: 'live',
  panchang: 'live',
  kundali: 'live',
  kuldevi: 'live',
  vastu: 'live',
  interest_calculator: 'live',
  namkaran: 'live',
  card: 'live',
  biodata: 'live',
  shradhanjali: 'live',
  devotional_cards: 'live',
  swipe_cards: 'live',
  gujarat_safari: 'live',
  passport: 'live',
  mysteries: 'live',
  rewards: 'live',
  society: 'live',
  english: 'live',
  games: 'live',
  daily_challenge: 'live',
};

// Define the themes
export const THEMES = {
  default: {
    id: 'default',
    name: 'ગઈકાલના કલર્સ (Default)',
    primaryAccent: '#B45309',
    primaryAccentLight: '#FFF8EF',
    primaryAccentRgb: '180, 83, 9',
    bgLight: '#F9F9F7',
    bgDark: '#141210',
    surfLight: '#FFFFFF',
    surfDark: '#1E1A18',
    bdrLight: '#E8E6E3',
    bdrDark: '#2E2825',
    txtLight: '#1A1614',
    txtDark: '#F2F0EE',
    gradient: 'linear-gradient(135deg, #B45309, #F97316)',
    heroGradient: 'linear-gradient(135deg, #ea580c, #f97316)',
    heroShadow: '0 8px 20px rgba(234,88,12,0.2)',
    cardShadow: '0 8px 24px rgba(249, 115, 22, 0.2)',
    tabActiveBorder: '1.5px solid #F59E0B',
    tabActiveBg: '#FFF8EF',
    tabActiveText: '#B45309',
    tools: [
      { cat:'spiritual', icon:'calendar_month',   label:'પંચાંગ',    path:'/panchang',             bg:'#FFFBEB', iconBg:'#F59E0B', iconClr:'#fff' },
      { cat:'spiritual', icon:'stars',            label:'કુંડળી',    path:'/kundali',              bg:'#F5F3FF', iconBg:'#8B5CF6', iconClr:'#fff' },
      { cat:'spiritual', icon:'temple_hindu',     label:'કુળદેવી',   path:'/kuldevi',              bg:'#FFF1F2', iconBg:'#E11D48', iconClr:'#fff' },
      { cat:'spiritual', icon:'explore',          label:'વાસ્તુ',    path:'/vastu',                bg:'#F0FDF4', iconBg:'#22C55E', iconClr:'#fff' },
      { cat:'utilities', icon:'calculate',        label:'વ્યાજ ગણક', path:'/interest-calculator',  bg:'#F0FDF4', iconBg:'#10B981', iconClr:'#fff' },
      { cat:'utilities', icon:'auto_fix_high',    label:'નામકરણ',   path:'/namkaran',             bg:'#F5F3FF', iconBg:'#6366F1', iconClr:'#fff' },
      { cat:'utilities', icon:'favorite',         label:'સ્વાસ્થ્ય', path:'/health',               bg:'#FEF2F2', iconBg:'#F43F5E', iconClr:'#fff' },
      { cat:'utilities', icon:'construction',     label:'ટૂલ્સ',    path:'/tools',                bg:'#F1F5F9', iconBg:'#64748B', iconClr:'#fff' },
      { cat:'business',  icon:'badge',            label:'BizCard',  path:'/card',                 bg:'#EEF2FF', iconBg:'#4F46E5', iconClr:'#fff' },
      { cat:'business',  icon:'description',      label:'બાયોડેટા', path:'/biodata',              bg:'#FFFBEB', iconBg:'#D97706', iconClr:'#fff' },
      { cat:'business',  icon:'frame_person',     label:'કાર્ડ',    path:'/devotional-cards',     bg:'#FDF4FF', iconBg:'#C026D3', iconClr:'#fff' },
      { cat:'business',  icon:'groups',           label:'કોમ્યુ.',  path:'/community',            bg:'#ECFDF5', iconBg:'#059669', iconClr:'#fff' },
      { cat:'games',     icon:'style',            label:'કાર્ડ્સ',  path:'/swipe-cards',          bg:'#F5F3FF', iconBg:'#7C3AED', iconClr:'#fff' },
      { cat:'games',     icon:'map',              label:'સફારી',    path:'/gujarat-safari',       bg:'#F0FDF4', iconBg:'#16A34A', iconClr:'#fff' },
      { cat:'games',     icon:'menu_book',        label:'પાસપોર્ટ', path:'/passport',             bg:'#EFF6FF', iconBg:'#2563EB', iconClr:'#fff' },
      { cat:'games',     icon:'search',           label:'રહસ્યો',   path:'/mysteries',            bg:'#F8FAFC', iconBg:'#475569', iconClr:'#fff' },
    ]
  },
  theme1: {
    id: 'theme1',
    name: 'ડાર્ક ટીલ (Theme-1)',
    primaryAccent: '#0D9488',
    primaryAccentLight: '#E6F4F1',
    primaryAccentRgb: '13, 148, 136',
    bgLight: '#F8FAFC',
    bgDark: '#0B0F19',
    surfLight: '#FFFFFF',
    surfDark: '#111827',
    bdrLight: '#E2E8F0',
    bdrDark: '#1F2937',
    txtLight: '#0F172A',
    txtDark: '#F1F5F9',
    gradient: 'linear-gradient(135deg, #2D3748, #0D9488)',
    heroGradient: 'linear-gradient(135deg, #0F766E, #0D9488)',
    heroShadow: '0 8px 20px rgba(13,148,136,0.25)',
    cardShadow: '0 8px 24px rgba(13, 148, 136, 0.2)',
    tabActiveBorder: '1.5px solid #0D9488',
    tabActiveBg: 'var(--bg-active, #F8FAFC)',
    tabActiveText: 'var(--text-active, #2D3748)',
    tools: [
      { cat:'spiritual', icon:'calendar_month',   label:'પંચાંગ',    path:'/panchang',             bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'spiritual', icon:'stars',            label:'કુંડળી',    path:'/kundali',              bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'spiritual', icon:'temple_hindu',     label:'કુળદેવી',   path:'/kuldevi',              bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'spiritual', icon:'explore',          label:'વાસ્તુ',    path:'/vastu',                bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'utilities', icon:'calculate',        label:'વ્યાજ ગણક', path:'/interest-calculator',  bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'utilities', icon:'auto_fix_high',    label:'નામકરણ',   path:'/namkaran',             bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'utilities', icon:'favorite',         label:'સ્વાસ્થ્ય', path:'/health',               bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'utilities', icon:'construction',     label:'ટૂલ્સ',    path:'/tools',                bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'business',  icon:'badge',            label:'BizCard',  path:'/card',                 bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'business',  icon:'description',      label:'બાયોડેટા', path:'/biodata',              bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'business',  icon:'frame_person',     label:'કાર્ડ',    path:'/devotional-cards',     bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'business',  icon:'groups',           label:'કોમ્યુ.',  path:'/community',            bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'games',     icon:'style',            label:'કાર્ડ્સ',  path:'/swipe-cards',          bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'games',     icon:'map',              label:'સફારી',    path:'/gujarat-safari',       bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'games',     icon:'menu_book',        label:'પાસપોર્ટ', path:'/passport',             bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
      { cat:'games',     icon:'search',           label:'રહસ્યો',   path:'/mysteries',            bg:'transparent', iconBg:'#F8FAFC', iconClr:'#2D3748', border:'1px solid #E8E6E3' },
    ]
  },
  theme2: {
    id: 'theme2',
    name: 'રોયલ પર્પલ (Theme-2)',
    primaryAccent: '#7C3AED',
    primaryAccentLight: '#F3E8FF',
    primaryAccentRgb: '124, 58, 237',
    bgLight: '#FAF5FF',
    bgDark: '#120B1E',
    surfLight: '#FFFFFF',
    surfDark: '#1C0F30',
    bdrLight: '#E9D5FF',
    bdrDark: '#2E1E43',
    txtLight: '#1E1B4B',
    txtDark: '#F3E8FF',
    gradient: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
    heroGradient: 'linear-gradient(135deg, #6D28D9, #7C3AED)',
    heroShadow: '0 8px 20px rgba(124,58,237,0.25)',
    cardShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
    tabActiveBorder: '1.5px solid #7C3AED',
    tabActiveBg: 'var(--bg-active, #F5F3FF)',
    tabActiveText: 'var(--text-active, #4C1D95)',
    tools: [
      { cat:'spiritual', icon:'calendar_month',   label:'પંચાંગ',    path:'/panchang',             bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'spiritual', icon:'stars',            label:'કુંડળી',    path:'/kundali',              bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'spiritual', icon:'temple_hindu',     label:'કુળદેવી',   path:'/kuldevi',              bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'spiritual', icon:'explore',          label:'વાસ્તુ',    path:'/vastu',                bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'utilities', icon:'calculate',        label:'વ્યાજ ગણક', path:'/interest-calculator',  bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'utilities', icon:'auto_fix_high',    label:'નામકરણ',   path:'/namkaran',             bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'utilities', icon:'favorite',         label:'સ્વાસ્થ્ય', path:'/health',               bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'utilities', icon:'construction',     label:'ટૂલ્સ',    path:'/tools',                bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'business',  icon:'badge',            label:'BizCard',  path:'/card',                 bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'business',  icon:'description',      label:'બાયોડેટા', path:'/biodata',              bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'business',  icon:'frame_person',     label:'કાર્ડ',    path:'/devotional-cards',     bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'business',  icon:'groups',           label:'કોમ્યુ.',  path:'/community',            bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'games',     icon:'style',            label:'કાર્ડ્સ',  path:'/swipe-cards',          bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'games',     icon:'map',              label:'સફારી',    path:'/gujarat-safari',       bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'games',     icon:'menu_book',        label:'પાસપોર્ટ', path:'/passport',             bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
      { cat:'games',     icon:'search',           label:'રહસ્યો',   path:'/mysteries',            bg:'transparent', iconBg:'#F8FAFC', iconClr:'#4C1D95', border:'1px solid #E8E6E3' },
    ]
  },
  theme3: {
    id: 'theme3',
    name: 'Gujarat - 1',
    primaryAccent: '#73322B',
    primaryAccentLight: '#FFF2F0',
    primaryAccentRgb: '115, 50, 43',
    bgLight: '#FFFDF9',
    bgDark: '#2B1814',
    surfLight: '#FFFFFF',
    surfDark: '#352726',
    bdrLight: '#F5EEDC',
    bdrDark: '#4A3532',
    txtLight: '#2B1814',
    txtDark: '#FFEFEF',
    gradient: 'linear-gradient(135deg, #73322B, #FF8E1F)',
    heroGradient: 'linear-gradient(135deg, #73322B, #F08833)',
    heroShadow: '0 8px 20px rgba(115,50,43,0.25)',
    cardShadow: '0 8px 24px rgba(115,50,43,0.2)',
    tabActiveBorder: '1.5px solid #F08833',
    tabActiveBg: '#FFF2F0',
    tabActiveText: '#73322B',
    tools: [
      { cat:'spiritual', icon:'calendar_month',   label:'પંચાંગ',    path:'/panchang',             bg:'#FFF2F0', iconBg:'#73322B', iconClr:'#fff' },
      { cat:'spiritual', icon:'stars',            label:'કુંડળી',    path:'/kundali',              bg:'#FFF2F0', iconBg:'#73322B', iconClr:'#fff' },
      { cat:'spiritual', icon:'temple_hindu',     label:'કુળદેવી',   path:'/kuldevi',              bg:'#FFF2F0', iconBg:'#73322B', iconClr:'#fff' },
      { cat:'spiritual', icon:'explore',          label:'વાસ્તુ',    path:'/vastu',                bg:'#FFF2F0', iconBg:'#73322B', iconClr:'#fff' },
      { cat:'utilities', icon:'calculate',        label:'વ્યાજ ગણક', path:'/interest-calculator',  bg:'#FFF7ED', iconBg:'#F08833', iconClr:'#fff' },
      { cat:'utilities', icon:'auto_fix_high',    label:'નામકરણ',   path:'/namkaran',             bg:'#FFF7ED', iconBg:'#F08833', iconClr:'#fff' },
      { cat:'utilities', icon:'favorite',         label:'સ્વાસ્થ્ય', path:'/health',               bg:'#FFF7ED', iconBg:'#F08833', iconClr:'#fff' },
      { cat:'utilities', icon:'construction',     label:'ટૂલ્સ',    path:'/tools',                bg:'#FFF7ED', iconBg:'#F08833', iconClr:'#fff' },
      { cat:'business',  icon:'badge',            label:'BizCard',  path:'/card',                 bg:'#FEF3C7', iconBg:'#FF8E1F', iconClr:'#fff' },
      { cat:'business',  icon:'description',      label:'બાયોડેટા', path:'/biodata',              bg:'#FEF3C7', iconBg:'#FF8E1F', iconClr:'#fff' },
      { cat:'business',  icon:'frame_person',     label:'કાર્ડ',    path:'/devotional-cards',     bg:'#FEF3C7', iconBg:'#FF8E1F', iconClr:'#fff' },
      { cat:'business',  icon:'groups',           label:'કોમ્યુ.',  path:'/community',            bg:'#FEF3C7', iconBg:'#FF8E1F', iconClr:'#fff' },
      { cat:'games',     icon:'style',            label:'કાર્ડ્સ',  path:'/swipe-cards',          bg:'#F5F5F4', iconBg:'#7F4D27', iconClr:'#fff' },
      { cat:'games',     icon:'map',              label:'સફારી',    path:'/gujarat-safari',       bg:'#F5F5F4', iconBg:'#7F4D27', iconClr:'#fff' },
      { cat:'games',     icon:'menu_book',        label:'પાસપોર્ટ', path:'/passport',             bg:'#F5F5F4', iconBg:'#7F4D27', iconClr:'#fff' },
      { cat:'games',     icon:'search',           label:'રહસ્યો',   path:'/mysteries',            bg:'#F5F5F4', iconBg:'#7F4D27', iconClr:'#fff' },
    ]
  },
  theme4: {
    id: 'theme4',
    name: 'Gujarat - 2',
    primaryAccent: '#004D40',
    primaryAccentLight: '#E6F2ED',
    primaryAccentRgb: '0, 77, 64',
    bgLight: '#FFFDF9',
    bgDark: '#11231E',
    surfLight: '#FFFFFF',
    surfDark: '#1A2F2A',
    bdrLight: '#E8D5C0',
    bdrDark: '#243D37',
    txtLight: '#004D40',
    txtDark: '#E6F2ED',
    gradient: 'linear-gradient(135deg, #004D40, #8C6239)',
    heroGradient: 'linear-gradient(135deg, #004D40, #8C6239)',
    heroShadow: '0 8px 20px rgba(0,77,64,0.18)',
    cardShadow: '0 8px 24px rgba(0,77,64,0.12)',
    tabActiveBorder: '1.5px solid #8C6239',
    tabActiveBg: '#E6F2ED',
    tabActiveText: '#004D40',
    tools: [
      { cat:'spiritual', icon:'calendar_month',   label:'પંચાંગ',    path:'/panchang',             bg:'#E6F2ED', iconBg:'#004D40', iconClr:'#fff' },
      { cat:'spiritual', icon:'stars',            label:'કુંડળી',    path:'/kundali',              bg:'#E6F2ED', iconBg:'#004D40', iconClr:'#fff' },
      { cat:'spiritual', icon:'temple_hindu',     label:'કુળદેવી',   path:'/kuldevi',              bg:'#E6F2ED', iconBg:'#004D40', iconClr:'#fff' },
      { cat:'spiritual', icon:'explore',          label:'વાસ્તુ',    path:'/vastu',                bg:'#E6F2ED', iconBg:'#004D40', iconClr:'#fff' },
      { cat:'utilities', icon:'calculate',        label:'વ્યાજ ગણક', path:'/interest-calculator',  bg:'#FDF8F2', iconBg:'#8C6239', iconClr:'#fff' },
      { cat:'utilities', icon:'auto_fix_high',    label:'નામકરણ',   path:'/namkaran',             bg:'#FDF8F2', iconBg:'#8C6239', iconClr:'#fff' },
      { cat:'utilities', icon:'favorite',         label:'સ્વાસ્થ્ય', path:'/health',               bg:'#FDF8F2', iconBg:'#8C6239', iconClr:'#fff' },
      { cat:'utilities', icon:'construction',     label:'ટૂલ્સ',    path:'/tools',                bg:'#FDF8F2', iconBg:'#8C6239', iconClr:'#fff' },
      { cat:'business',  icon:'badge',            label:'BizCard',  path:'/card',                 bg:'#FBF6EF', iconBg:'#5C3E21', iconClr:'#fff' },
      { cat:'business',  icon:'description',      label:'બાયોડેટા', path:'/biodata',              bg:'#FBF6EF', iconBg:'#5C3E21', iconClr:'#fff' },
      { cat:'business',  icon:'frame_person',     label:'કાર્ડ',    path:'/devotional-cards',     bg:'#FBF6EF', iconBg:'#5C3E21', iconClr:'#fff' },
      { cat:'business',  icon:'groups',           label:'કોમ્યુ.',  path:'/community',            bg:'#FBF6EF', iconBg:'#5C3E21', iconClr:'#fff' },
      { cat:'games',     icon:'style',            label:'કાર્ડ્સ',  path:'/swipe-cards',          bg:'#E6F2ED', iconBg:'#004D40', iconClr:'#fff' },
      { cat:'games',     icon:'map',              label:'સફારી',    path:'/gujarat-safari',       bg:'#E6F2ED', iconBg:'#004D40', iconClr:'#fff' },
      { cat:'games',     icon:'menu_book',        label:'પાસપોર્ટ', path:'/passport',             bg:'#E6F2ED', iconBg:'#004D40', iconClr:'#fff' },
      { cat:'games',     icon:'search',           label:'રહસ્યો',   path:'/mysteries',            bg:'#E6F2ED', iconBg:'#004D40', iconClr:'#fff' },
    ]
  }
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [activeThemeId, setActiveThemeId] = useState(() => {
    return localStorage.getItem('otlo_active_theme') || 'default';
  });

  const [featureFlags, setFeatureFlags] = useState(() => {
    try {
      const cached = localStorage.getItem('gujarati_feature_flags');
      return cached ? JSON.parse(cached) : DEFAULT_FEATURE_FLAGS;
    } catch {
      return DEFAULT_FEATURE_FLAGS;
    }
  });

  const [comingSoonFeature, setComingSoonFeature] = useState(null);

  const activeTheme = THEMES[activeThemeId] || THEMES.default;

  const changeTheme = (themeId) => {
    if (THEMES[themeId]) {
      setActiveThemeId(themeId);
      localStorage.setItem('otlo_active_theme', themeId);
    }
  };

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'feature_control')
          .single();
        if (!error && data) {
          const parsed = JSON.parse(data.value);
          const merged = { ...DEFAULT_FEATURE_FLAGS, ...parsed };
          setFeatureFlags(merged);
          localStorage.setItem('gujarati_feature_flags', JSON.stringify(merged));
        } else if (error && error.code === 'PGRST116') {
          // Row not found, seed with defaults
          await supabase.from('app_settings').upsert({
            key: 'feature_control',
            value: JSON.stringify(DEFAULT_FEATURE_FLAGS)
          });
        }
      } catch (err) {
        console.error("Error fetching feature flags:", err);
      }
    };

    fetchFeatureFlags();

    const handleRefetch = () => fetchFeatureFlags();
    window.addEventListener('refetch-feature-flags', handleRefetch);
    return () => window.removeEventListener('refetch-feature-flags', handleRefetch);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    const updateColors = () => {
      const isDark = root.classList.contains('dark') || body.classList.contains('dark') || localStorage.getItem('sanskari_darkMode') === 'true';
      const bg = isDark ? (activeTheme.bgDark || '#141210') : (activeTheme.bgLight || '#F9F9F7');
      const surface = isDark ? (activeTheme.surfDark || '#1E1A18') : (activeTheme.surfLight || '#FFFFFF');
      const border = isDark ? (activeTheme.bdrDark || '#2E2825') : (activeTheme.bdrLight || '#E8E6E3');
      const text = isDark ? (activeTheme.txtDark || '#F2F0EE') : (activeTheme.txtLight || '#1A1614');

      root.style.backgroundColor = bg;
      body.style.backgroundColor = bg;

      root.style.setProperty('--primary-color', activeTheme.primaryAccent);
      root.style.setProperty('--bg-color', bg);
      root.style.setProperty('--on-surface-color', text);
      root.style.setProperty('--outline-color', border);
      root.style.setProperty('--surface-container-color', surface);

      root.style.setProperty('--brand-600', activeTheme.primaryAccent);
      root.style.setProperty('--brand-50', activeTheme.primaryAccentLight);
      
      root.style.setProperty('--dark-bg', activeTheme.bgDark || '#031412');
      root.style.setProperty('--dark-surface', activeTheme.surfDark || '#051816');
      root.style.setProperty('--dark-accent', activeTheme.primaryAccent || '#C49F67');
    };

    updateColors();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors();
        }
      });
    });

    observer.observe(root, { attributes: true });

    return () => observer.disconnect();
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ 
      activeTheme, 
      changeTheme, 
      themes: THEMES,
      featureFlags,
      setFeatureFlags,
      comingSoonFeature,
      setComingSoonFeature,
      PATH_TO_FEATURE_KEY
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
