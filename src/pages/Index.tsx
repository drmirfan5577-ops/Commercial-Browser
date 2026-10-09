import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAppData, useSaveTheme } from "@/hooks/use-app-data.ts";
import { useAuth } from "@/hooks/use-auth.ts";
import { motion, AnimatePresence } from "motion/react";
import { THEMES, getTheme } from "@/lib/themes.ts";
import type { Theme } from "@/lib/themes.ts";
import {
  Search, Globe, Mic, ArrowRight, X, ChevronRight, Plus,
  ArrowLeft, RotateCcw, Home, Shield, Zap, Lock,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type AppEntry = { name: string; url: string; icon: string; nameUrdu?: string };
type HubEntry = { id: string; name: string; nameUrdu: string; icon: string; color: string; apps: AppEntry[] };
type TabId = "home" | "browser" | "islamic" | "news" | "social" | "themes" | "media" | "notes" | "admin";

// ─── Smart Hubs Data ─────────────────────────────────────────────────────────

const SMART_HUBS: HubEntry[] = [
  {
    id: "islamic", name: "Islamic Hub", nameUrdu: "اسلامی مرکز", icon: "🕌", color: "#00c853",
    apps: [
      { name: "Quran.com", url: "https://quran.com", icon: "📖", nameUrdu: "قرآن" },
      { name: "IslamicFinder", url: "https://islamicfinder.org", icon: "🕌" },
      { name: "Sunnah.com", url: "https://sunnah.com", icon: "📚" },
      { name: "Prayer Times", url: "https://www.islamicfinder.org/prayer-times/", icon: "🕐", nameUrdu: "نماز" },
      { name: "Duas.org", url: "https://duas.org", icon: "🤲", nameUrdu: "دعائیں" },
      { name: "Muslim Pro", url: "https://muslimpro.com", icon: "☪️" },
      { name: "Tanzil", url: "https://tanzil.net", icon: "✨" },
      { name: "HadithColl.", url: "https://hadithcollection.com", icon: "📜", nameUrdu: "احادیث" },
      { name: "IslamQA", url: "https://islamqa.info", icon: "❓" },
      { name: "Dar Al Ifta", url: "https://daralifta.org", icon: "⚖️" },
      { name: "OnlineSalah", url: "https://onlinesalah.com", icon: "🙏" },
      { name: "QuranExplorer", url: "https://quranexplorer.com", icon: "🔍" },
      { name: "eShaykh", url: "https://eshaykh.com", icon: "👳" },
      { name: "IslamWeb", url: "https://islamweb.net", icon: "🌐" },
      { name: "Al-Islam.org", url: "https://al-islam.org", icon: "📗" },
      { name: "Hijri Cal.", url: "https://www.islamicfinder.org/islamic-calendar/", icon: "📅", nameUrdu: "ہجری" },
      { name: "Zakat Calc", url: "https://www.islamicfinder.org/zakat-calculator/", icon: "💰", nameUrdu: "زکات" },
      { name: "99 Names", url: "https://myislam.org/99-names-of-allah/", icon: "💫", nameUrdu: "اسماء" },
      { name: "Al-Wazifa", url: "https://alwazifa.com", icon: "🌙", nameUrdu: "وظیفہ" },
      { name: "UrduPoint", url: "https://urdupoint.com/islamic/", icon: "📕", nameUrdu: "اسلامی" },
    ],
  },
  {
    id: "news", name: "News Hub", nameUrdu: "خبروں کا مرکز", icon: "📰", color: "#1565c0",
    apps: [
      { name: "Google News", url: "https://news.google.com", icon: "📰" },
      { name: "BBC Urdu", url: "https://bbc.com/urdu", icon: "📺", nameUrdu: "بی بی سی" },
      { name: "Geo News", url: "https://geo.tv", icon: "🌍", nameUrdu: "جیو" },
      { name: "ARY News", url: "https://arynews.tv", icon: "📡", nameUrdu: "اے آر وائی" },
      { name: "Dawn News", url: "https://dawn.com", icon: "🌅", nameUrdu: "ڈان" },
      { name: "Jang", url: "https://jang.com.pk", icon: "📄", nameUrdu: "جنگ" },
      { name: "Express", url: "https://express.pk", icon: "⚡", nameUrdu: "ایکسپریس" },
      { name: "The News", url: "https://thenews.com.pk", icon: "📋" },
      { name: "Samaa TV", url: "https://samaa.tv", icon: "📻", nameUrdu: "سما" },
      { name: "Dunya News", url: "https://dunyanews.tv", icon: "🌐", nameUrdu: "دنیا" },
      { name: "Al Jazeera", url: "https://aljazeera.net", icon: "🌙", nameUrdu: "الجزیرہ" },
      { name: "Reuters", url: "https://reuters.com", icon: "📊" },
      { name: "AP News", url: "https://apnews.com", icon: "🗞️" },
      { name: "CNN", url: "https://cnn.com", icon: "📡" },
      { name: "BBC", url: "https://bbc.com", icon: "🎙️" },
      { name: "VOA Urdu", url: "https://urdu.voanews.com", icon: "🔊", nameUrdu: "وی او اے" },
      { name: "Radio Pak", url: "https://radio.gov.pk", icon: "📻", nameUrdu: "ریڈیو" },
      { name: "PTV", url: "https://ptv.com.pk", icon: "📺", nameUrdu: "پی ٹی وی" },
      { name: "Nawaiwaqt", url: "https://nawaiwaqt.com.pk", icon: "📰", nameUrdu: "نوائے وقت" },
      { name: "92 News", url: "https://92newshd.tv", icon: "📡", nameUrdu: "92 نیوز" },
    ],
  },
  {
    id: "ai", name: "A.I Hub", nameUrdu: "مصنوعی ذہانت", icon: "🤖", color: "#6a1b9a",
    apps: [
      { name: "ChatGPT", url: "https://chat.openai.com", icon: "🤖" },
      { name: "Gemini", url: "https://gemini.google.com", icon: "✨" },
      { name: "Claude", url: "https://claude.ai", icon: "🧠" },
      { name: "Copilot", url: "https://copilot.microsoft.com", icon: "💡" },
      { name: "Perplexity", url: "https://perplexity.ai", icon: "🔮" },
      { name: "Midjourney", url: "https://midjourney.com", icon: "🎨" },
      { name: "DALL-E", url: "https://labs.openai.com", icon: "🖼️" },
      { name: "Stable Diff", url: "https://stablediffusionweb.com", icon: "🌀" },
      { name: "Runway ML", url: "https://runwayml.com", icon: "🎬" },
      { name: "ElevenLabs", url: "https://elevenlabs.io", icon: "🎵" },
      { name: "HuggingFace", url: "https://huggingface.co", icon: "🤗" },
      { name: "DeepL", url: "https://deepl.com", icon: "🌍" },
      { name: "Grammarly", url: "https://grammarly.com", icon: "✏️" },
      { name: "Bing AI", url: "https://bing.com/chat", icon: "🔍" },
      { name: "Pi AI", url: "https://pi.ai", icon: "🥧" },
      { name: "You.com", url: "https://you.com", icon: "🎯" },
      { name: "Poe", url: "https://poe.com", icon: "💬" },
      { name: "Character AI", url: "https://character.ai", icon: "🎭" },
      { name: "Notion AI", url: "https://notion.so", icon: "📝" },
      { name: "Canva AI", url: "https://canva.com", icon: "🖌️" },
    ],
  },
  {
    id: "social", name: "Social Media", nameUrdu: "سوشل میڈیا", icon: "👥", color: "#1565c0",
    apps: [
      { name: "WhatsApp", url: "https://web.whatsapp.com", icon: "💬", nameUrdu: "واٹس ایپ" },
      { name: "Facebook", url: "https://facebook.com", icon: "👤", nameUrdu: "فیس بک" },
      { name: "Instagram", url: "https://instagram.com", icon: "📸" },
      { name: "Twitter/X", url: "https://x.com", icon: "🐦" },
      { name: "YouTube", url: "https://youtube.com", icon: "▶️", nameUrdu: "یوٹیوب" },
      { name: "TikTok", url: "https://tiktok.com", icon: "🎵" },
      { name: "Telegram", url: "https://web.telegram.org", icon: "✈️", nameUrdu: "ٹیلیگرام" },
      { name: "LinkedIn", url: "https://linkedin.com", icon: "💼" },
      { name: "Pinterest", url: "https://pinterest.com", icon: "📌" },
      { name: "Snapchat", url: "https://snapchat.com", icon: "👻" },
      { name: "Reddit", url: "https://reddit.com", icon: "🔴" },
      { name: "Discord", url: "https://discord.com", icon: "🎮" },
      { name: "Tumblr", url: "https://tumblr.com", icon: "📓" },
      { name: "Twitch", url: "https://twitch.tv", icon: "🎯" },
      { name: "VK", url: "https://vk.com", icon: "🌐" },
      { name: "Viber", url: "https://viber.com", icon: "📞", nameUrdu: "وائبر" },
      { name: "Signal", url: "https://signal.org", icon: "🔒" },
      { name: "IMO", url: "https://imo.im", icon: "💭" },
      { name: "WeChat", url: "https://web.wechat.com", icon: "💚" },
      { name: "Skype", url: "https://web.skype.com", icon: "📱" },
    ],
  },
  {
    id: "general", name: "General Hub", nameUrdu: "عمومی مرکز", icon: "🔲", color: "#e65100",
    apps: [
      { name: "Google", url: "https://google.com", icon: "🔍", nameUrdu: "گوگل" },
      { name: "Gmail", url: "https://gmail.com", icon: "📧", nameUrdu: "جی میل" },
      { name: "Drive", url: "https://drive.google.com", icon: "☁️" },
      { name: "Maps", url: "https://maps.google.com", icon: "🗺️", nameUrdu: "نقشہ" },
      { name: "Wikipedia", url: "https://wikipedia.org", icon: "📚", nameUrdu: "وکی" },
      { name: "Amazon", url: "https://amazon.com", icon: "🛍️" },
      { name: "Daraz", url: "https://daraz.pk", icon: "🛒", nameUrdu: "دراز" },
      { name: "OLX", url: "https://olx.com.pk", icon: "🏷️" },
      { name: "GitHub", url: "https://github.com", icon: "💻" },
      { name: "Translate", url: "https://translate.google.com", icon: "🌐", nameUrdu: "ترجمہ" },
      { name: "Weather", url: "https://weather.com", icon: "⛅", nameUrdu: "موسم" },
      { name: "Docs", url: "https://docs.google.com", icon: "📝" },
      { name: "Sheets", url: "https://sheets.google.com", icon: "📊" },
      { name: "Calendar", url: "https://calendar.google.com", icon: "📅" },
      { name: "Zoom", url: "https://zoom.us", icon: "📹", nameUrdu: "زوم" },
      { name: "MS Office", url: "https://office.com", icon: "📄" },
      { name: "Dropbox", url: "https://dropbox.com", icon: "📦" },
      { name: "OneDrive", url: "https://onedrive.live.com", icon: "☁️" },
      { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "❓" },
      { name: "UrduPoint", url: "https://urdupoint.com", icon: "🇵🇰", nameUrdu: "اردو پوائنٹ" },
    ],
  },
];

const PAKISTAN_HEROES = [
  { name: "Quaid-e-Azam", nameUrdu: "قائد اعظم", role: "Founder of Pakistan", roleUrdu: "بانی پاکستان", emoji: "🦅" },
  { name: "Dr Allama Iqbal", nameUrdu: "علامہ اقبال", role: "National Poet", roleUrdu: "قومی شاعر", emoji: "✍️" },
  { name: "Dr AQ Khan", nameUrdu: "ڈاکٹر عبدالقدیر", role: "Nuclear Pioneer", roleUrdu: "ایٹمی علوم", emoji: "⚛️" },
] as const;

const MEDIA_APPS: AppEntry[] = [
  { name: "YouTube", icon: "▶️", url: "https://youtube.com", nameUrdu: "یوٹیوب" },
  { name: "Spotify", icon: "🎵", url: "https://open.spotify.com" },
  { name: "SoundCloud", icon: "🔊", url: "https://soundcloud.com" },
  { name: "Netflix", icon: "🎬", url: "https://netflix.com", nameUrdu: "نیٹ فلکس" },
  { name: "Dailymotion", icon: "📹", url: "https://dailymotion.com" },
  { name: "Vimeo", icon: "🎥", url: "https://vimeo.com" },
  { name: "TikTok", icon: "🎵", url: "https://tiktok.com" },
  { name: "Twitch", icon: "🎮", url: "https://twitch.tv" },
  { name: "Apple Music", icon: "🍎", url: "https://music.apple.com" },
  { name: "Deezer", icon: "🎶", url: "https://deezer.com" },
  { name: "Plex", icon: "📽️", url: "https://plex.tv" },
  { name: "Mixcloud", icon: "🎧", url: "https://mixcloud.com" },
];

type FallbackApp = {
  _id: string; name: string; nameUrdu: string;
  url: string; icon: string; row: number; position: number; isActive: boolean;
};

const FALLBACK_APPS: FallbackApp[] = [
  { _id: "f1", name: "SMART News", nameUrdu: "سمارٹ نیوز", url: "https://news.google.com", icon: "📡", row: 2, position: 0, isActive: true },
  { _id: "f2", name: "YouTube", nameUrdu: "یوٹیوب", url: "https://youtube.com", icon: "▶️", row: 2, position: 1, isActive: true },
  { _id: "f3", name: "WhatsApp", nameUrdu: "واٹس ایپ", url: "https://web.whatsapp.com", icon: "💬", row: 2, position: 2, isActive: true },
  { _id: "f4", name: "Facebook", nameUrdu: "فیس بک", url: "https://facebook.com", icon: "👤", row: 2, position: 3, isActive: true },
  { _id: "f5", name: "Play Store", nameUrdu: "پلے اسٹور", url: "https://play.google.com", icon: "🛒", row: 2, position: 4, isActive: true },
];

const NAV_TABS: { id: TabId; label: string; labelUrdu: string; icon: string; isLive?: boolean }[] = [
  { id: "home",   label: "Home",    labelUrdu: "ہوم",     icon: "🏠" },
  { id: "browser",label: "Browser", labelUrdu: "براؤزر",  icon: "🌐" },
  { id: "islamic",label: "Islamic", labelUrdu: "اسلامی",  icon: "📖" },
  { id: "news",   label: "News",    labelUrdu: "خبریں",   icon: "📰", isLive: true },
  { id: "themes", label: "Themes",  labelUrdu: "تھیمز",   icon: "🎨" },
  { id: "media",  label: "Media",   labelUrdu: "میڈیا",   icon: "▶️" },
  { id: "notes",  label: "Notes",   labelUrdu: "نوٹس",    icon: "📝" },
];

// ─── AppIcon component ────────────────────────────────────────────────────────

type AppIconProps = {
  icon: string; name: string; nameUrdu?: string;
  url: string; theme: Theme; size?: "small" | "normal" | "large";
  onPress?: () => void;
};

function AppIcon({ icon, name, nameUrdu, url, theme, size = "normal", onPress }: AppIconProps) {
  const handleClick = useCallback(() => {
    if (onPress) { onPress(); return; }
    window.open(url, "_blank", "noopener,noreferrer");
  }, [onPress, url]);

  const dim = size === "large" ? "w-14 h-14 text-2xl" : size === "small" ? "w-10 h-10 text-lg" : "w-12 h-12 text-xl";
  const wrap = size === "large" ? "w-16" : size === "small" ? "w-12" : "w-14";

  return (
    <button onClick={handleClick} className={`flex flex-col items-center gap-0.5 cursor-pointer ${wrap}`}>
      <div
        className={`${dim} rounded-2xl flex items-center justify-center transition-all active:scale-90`}
        style={{
          background: theme.iconBg,
          border: `1.5px solid ${theme.accentColor}50`,
          boxShadow: `${theme.glowColor}, inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)`,
        }}
      >
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-center leading-tight w-full truncate" style={{ color: theme.textColor }}>{name}</span>
      {nameUrdu && (
        <span className="text-[8px] text-center leading-tight" style={{ color: theme.accentColor, fontFamily: "'Noto Nastaliq Urdu', serif" }}>{nameUrdu}</span>
      )}
    </button>
  );
}

// ─── GlowOrb ESB Logo ─────────────────────────────────────────────────────────

function EsbOrb({ theme, onClick }: { theme: Theme; onClick: () => void }) {
  return (
    <button onClick={onClick} className="cursor-pointer relative w-11 h-11 flex items-center justify-center" style={{ flexShrink: 0 }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(from 0deg, ${theme.accentColor}, transparent, ${theme.accentColor})` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black"
        style={{
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, ${theme.iconBg} 50%, rgba(0,0,0,0.3) 100%)`,
          border: `1px solid ${theme.accentColor}80`,
          boxShadow: `${theme.glowColor}, inset 0 2px 4px rgba(255,255,255,0.3)`,
          color: theme.textColor,
        }}
      >
        ESB
      </div>
    </button>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────


function AdminPanel({ theme, onClose }: { theme: Theme; onClose: () => void }) {
  const { user, isLoading } = useAuth();
  const authed = user?.roles?.includes("admin") ?? false;
  const [activeSection, setActiveSection] = useState<"stats" | "content" | "security" | "logos">("stats");
  const { data } = useAppData();
  const tickers = data?.tickers;
  const customApps = data?.customApps;

  const bg = theme.gradient;
  const card = theme.cardBg;
  const accent = theme.accentColor;
  const text = theme.textColor;
  const urdu = "'Noto Nastaliq Urdu', serif";

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
        <div className="text-4xl">🔐</div>
        <div className="text-center">
          <h2 className="text-xl font-black" style={{ color: text }}>Admin Panel</h2>
          <p className="text-sm mt-1" style={{ color: accent, fontFamily: urdu }}>ایڈمن پینل</p>
        </div>
        <div className="w-full max-w-xs">
          <p className="text-sm text-center mb-4" style={{ color: text }}>{isLoading ? "Checking your account…" : user ? "Your account needs the admin role assigned in Netlify Identity." : "Sign in with an administrator account."}</p>
          <Link to="/auth" className="block w-full mt-3 py-3 rounded-xl font-bold text-sm text-center" style={{ background: accent, color: "#000" }}>Account | لاگ ان</Link>
        </div>
        <button onClick={onClose} className="text-xs cursor-pointer" style={{ color: `${text}80` }}>← Back | واپس</button>
      </div>
    );
  }

  const stats = [
    { icon: "🔖", label: "Bookmarks Saved", labelUrdu: "محفوظ بک مارکس", value: 0 },
    { icon: "⬇️", label: "Downloads", labelUrdu: "ڈاؤنلوڈز", value: 0 },
    { icon: "🎨", label: "Total Themes", labelUrdu: "کل تھیمز", value: THEMES.length },
    { icon: "📱", label: "App Slots", labelUrdu: "ایپ سلاٹس", value: 10 },
    { icon: "📢", label: "Ticker Strips", labelUrdu: "ٹکریاں", value: tickers?.length ?? 7 },
    { icon: "🌐", label: "Custom Apps", labelUrdu: "کسٹم ایپس", value: customApps?.length ?? 5 },
  ];

  const sections: { id: typeof activeSection; label: string; icon: string }[] = [
    { id: "stats", label: "Stats", icon: "📊" },
    { id: "content", label: "Content", icon: "➕" },
    { id: "logos", label: "Logo & Pics", icon: "🖼️" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${accent}30` }}>
        <div>
          <h2 className="text-base font-black" style={{ color: text }}>⚙️ Admin Panel</h2>
          <p className="text-[10px]" style={{ color: accent, fontFamily: urdu }}>ایڈمن پینل</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] px-2 py-1 rounded-full" style={{ background: card, color: accent }}>v2.0</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer" style={{ background: card }}>
            <X size={14} style={{ color: text }} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 overflow-x-auto">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
            style={{
              background: activeSection === s.id ? accent : card,
              color: activeSection === s.id ? "#000" : text,
              border: `1px solid ${accent}30`,
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {activeSection === "stats" && (
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: accent }}>Browser Stats | براؤزر اعداد و شمار</p>
            <div className="space-y-2">
              {stats.map(stat => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: card, border: `1px solid ${accent}20` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{stat.icon}</span>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: text }}>{stat.label}</div>
                      <div className="text-[10px]" style={{ color: accent, fontFamily: urdu }}>{stat.labelUrdu}</div>
                    </div>
                  </div>
                  <span className="text-lg font-black" style={{ color: accent }}>{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-xl" style={{ background: card, border: `1px solid ${accent}20` }}>
              <div className="flex items-center gap-2">
                <span className="text-sm">ℹ️</span>
                <div>
                  <div className="text-xs font-bold" style={{ color: text }}>EvEr SmArT BrOwSeR v2.0</div>
                  <div className="text-[10px]" style={{ color: `${text}80` }}>SWO.EvESmArTBrOwSeR/drirfan</div>
                  <div className="text-[10px]" style={{ color: accent, fontFamily: urdu }}>پاکستان کا بہترین ڈیجیٹل براؤزر</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "content" && (
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: accent }}>Add Content | مواد شامل کریں</p>
            <p className="text-[11px] mb-3 p-3 rounded-xl" style={{ background: card, color: text, border: `1px solid ${accent}20` }}>
              Add any audio, video, picture, media channel, website, email, or social outlet below. Once added, it auto-integrates into the app permanently.
            </p>
            {([
              { type: "🌐", label: "Website / URL" },
              { type: "📺", label: "Media Channel" },
              { type: "📧", label: "Email / Newsletter" },
              { type: "📱", label: "Social Media Outlet" },
              { type: "🎵", label: "Audio / Music" },
              { type: "🎬", label: "Video / Channel" },
              { type: "🖼️", label: "Image / Picture" },
            ] as const).map(item => (
              <div key={item.label} className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span>{item.type}</span>
                  <span className="text-xs font-semibold" style={{ color: text }}>{item.label}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                    placeholder={`Enter ${item.label.toLowerCase()}...`}
                    style={{ background: card, color: text, border: `1px solid ${accent}30` }}
                  />
                  <button className="px-3 py-2 rounded-xl text-xs font-bold cursor-pointer" style={{ background: accent, color: "#000" }}>
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "logos" && (
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: accent }}>Logo & Pictures | لوگو اور تصاویر</p>
            <div className="space-y-3">
              {[
                { label: "App Logo", icon: "🔲" },
                { label: "Home Wallpaper", icon: "🖼️" },
                { label: "Background Pattern", icon: "🎨" },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl flex items-center justify-between" style={{ background: card, border: `1px solid ${accent}20` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: text }}>{item.label}</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer" style={{ background: accent, color: "#000" }}>
                    Upload
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "security" && (
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: accent }}>Security | سیکیورٹی</p>
            <div className="space-y-2">
              <div className="p-3 rounded-xl" style={{ background: card, border: `1px solid ${accent}20` }}>
                <p className="text-xs font-semibold mb-2" style={{ color: text }}>Change Admin Password</p>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none mb-2"
                  placeholder="New password..."
                  style={{ background: "rgba(0,0,0,0.2)", color: text, border: `1px solid ${accent}30` }}
                />
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none mb-2"
                  placeholder="Confirm new password..."
                  style={{ background: "rgba(0,0,0,0.2)", color: text, border: `1px solid ${accent}30` }}
                />
                <button className="w-full py-2 rounded-xl text-xs font-bold cursor-pointer" style={{ background: accent, color: "#000" }}>
                  Update Password
                </button>
              </div>
              <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: card, border: `1px solid ${accent}20` }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: text }}>Privacy Mode</p>
                  <p className="text-[10px]" style={{ color: `${text}70` }}>Hide browsing history</p>
                </div>
                <div className="w-10 h-5 rounded-full cursor-pointer" style={{ background: accent }}>
                  <div className="w-5 h-5 rounded-full bg-white translate-x-5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-3 pb-4">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
          style={{ background: "rgba(255,50,50,0.2)", color: "#ff5252", border: "1px solid rgba(255,82,82,0.3)" }}
        >
          🚪 Logout | لاگ آؤٹ
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Index() {
  const [currentTheme, setCurrentTheme] = useState<string>("emerald");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHub, setActiveHub] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [browserUrl, setBrowserUrl] = useState("");
  const [browserNavigate, setBrowserNavigate] = useState("");
  const [browserHistory, setBrowserHistory] = useState<string[]>([]);
  const [browserHistoryIdx, setBrowserHistoryIdx] = useState(-1);

  const { user } = useAuth();
  const { data: appData, error: dataError } = useAppData();
  const tickers = appData?.tickers;
  const customApps = appData?.customApps;
  const saveTheme = useSaveTheme();

  const theme = getTheme(currentTheme);

  useEffect(() => { setCurrentTheme("emerald"); }, [user?.id]);
  useEffect(() => {
    if (!saveTheme.isPending && appData?.theme && THEMES.some(option => option.id === appData.theme)) setCurrentTheme(appData.theme);
  }, [appData?.theme, saveTheme.isPending]);
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleThemeChange = (id: string) => {
    setCurrentTheme(id);
    if (user) saveTheme.mutate(id, { onError: (error) => toast.error(error.message) });
  };

  const navigateBrowser = useCallback((url: string) => {
    const full = url.startsWith("http") ? url : `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    setBrowserNavigate(full);
    setBrowserUrl(full);
    setBrowserHistory(h => [...h.slice(0, browserHistoryIdx + 1), full]);
    setBrowserHistoryIdx(i => i + 1);
    setActiveTab("browser");
  }, [browserHistoryIdx]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigateBrowser(searchQuery);
    setSearchQuery("");
  };

  const handleAppOpen = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setActiveHub(null);
  };

  const browserBack = () => {
    if (browserHistoryIdx > 0) {
      const newIdx = browserHistoryIdx - 1;
      setBrowserHistoryIdx(newIdx);
      const url = browserHistory[newIdx];
      setBrowserNavigate(url);
      setBrowserUrl(url);
    }
  };

  const browserForward = () => {
    if (browserHistoryIdx < browserHistory.length - 1) {
      const newIdx = browserHistoryIdx + 1;
      setBrowserHistoryIdx(newIdx);
      const url = browserHistory[newIdx];
      setBrowserNavigate(url);
      setBrowserUrl(url);
    }
  };

  const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const tickerMsgs = tickers?.map(t => t.message) ?? [
    "All Systems Online", "Ads Blocked: 1247", "Network: Active",
    "Speed: Optimized", "Privacy: Maximum",
    "EvEr SmArT BrOwSeR - Pakistan's Smartest Digital Browser",
    "بسم اللہ الرحمٰن الرحیم",
  ];
  const allTicker = tickerMsgs.join("  ♦  ");

  type DisplayApp = { _id: string; name: string; nameUrdu?: string; url: string; icon: string; row: number };
  const quickApps: DisplayApp[] = (
    customApps && customApps.length > 0
      ? customApps.filter(a => a.row === 2).map(a => ({ ...a, _id: a._id as string }))
      : FALLBACK_APPS
  ).slice(0, 5);

  const acc = theme.accentColor;
  const txt = theme.textColor;
  const urduFont = "'Noto Nastaliq Urdu', serif";

  return (
    <div
      className="min-h-screen w-full flex flex-col relative overflow-hidden select-none"
      style={{ background: theme.gradient, fontFamily: "'Poppins', sans-serif", maxWidth: "480px", margin: "0 auto" }}
    >
      {/* Animated sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              background: acc,
              left: `${(i * 6.25) % 100}%`,
              top: `${(i * 11.7) % 85}%`,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
            transition={{ duration: 1.5 + (i % 4) * 0.8, delay: i * 0.25, repeat: Infinity }}
          />
        ))}
        {[0, 1, 2].map(i => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              width: "120px", height: "120px",
              background: acc,
              left: `${[10, 50, 80][i]}%`,
              top: `${[20, 60, 30][i]}%`,
              filter: "blur(40px)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 1.2 }}
          />
        ))}
      </div>

      {/* HEADER */}
      <div className="relative z-10 px-3 pt-2 pb-1">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <EsbOrb theme={theme} onClick={() => setDrawerOpen(true)} />
            <button
              onClick={() => setAdminOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: "rgba(128,90,255,0.25)", border: `1px solid rgba(160,120,255,0.4)` }}
              title="Admin Panel"
            >
              <span className="text-sm">⚙️</span>
            </button>
            <Link to="/auth" className="rounded-full px-3 py-1.5 text-[10px] font-semibold" style={{ background: theme.cardBg, color: theme.textColor }} title="Account and saved preferences">{user ? "Account" : "Sign in"}</Link>
          </div>
          <div className="text-right">
            <div className="text-xl font-black font-mono leading-none" style={{ color: txt, textShadow: `${theme.glowColor}` }}>
              {fmt(currentTime)}
            </div>
            <div className="text-[11px] font-medium" style={{ color: acc }}>{fmtDate(currentTime)}</div>
          </div>
        </div>

        {dataError && <p role="status" className="mb-2 text-[10px]" style={{ color: txt }}>Live content is temporarily unavailable. Built-in apps remain available.</p>}
        <motion.div
          className="text-center py-1.5 rounded-2xl mb-1.5"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: `1px solid ${acc}35`,
            boxShadow: `0 0 20px ${acc}15`,
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-base font-bold" style={{ color: acc, fontFamily: urduFont }}>
            بِسْمِ اللہِ الرَّحْمٰنِ الرَّحِیمِ°
          </div>
          <div className="text-[10px] leading-snug" style={{ color: txt }}>
            اللہ کے نام سے جو بڑا مہربان نہایت رحم والا
          </div>
          <div className="text-[9px] italic opacity-80" style={{ color: acc }}>
            {`"In the Name of ALLAH Almighty, The most Gracious, The most Merciful"`}
          </div>
        </motion.div>

        <div className="text-center mb-1.5">
          <motion.h1
            className="text-[22px] font-black tracking-wide leading-tight"
            style={{ color: txt, textShadow: `0 0 30px ${acc}, 0 0 60px ${acc}80` }}
            animate={{ textShadow: [`0 0 20px ${acc}`, `0 0 40px ${acc}`, `0 0 20px ${acc}`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            EvEr SmArT BrOwSeR
          </motion.h1>
          <div className="text-[11px] font-semibold tracking-widest" style={{ color: acc }}>
            ♦ Crystal Glass 4D Display ♦
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <button
            onClick={() => setVpnEnabled(v => !v)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all"
            style={{
              background: vpnEnabled ? "rgba(0,200,83,0.25)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${vpnEnabled ? "#00c853" : "rgba(255,255,255,0.25)"}`,
              color: vpnEnabled ? "#00e676" : txt,
            }}
          >
            🔄 VPN {vpnEnabled ? "On" : "Off"}
          </button>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff8a80" }}
          >
            🚫 Ads Blocked: 1,247
          </div>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
            style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${acc}25`, color: acc }}
          >
            <Shield size={10} /> Privacy: Max
          </div>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl mb-1"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: `1.5px solid ${acc}60`,
            boxShadow: `0 0 20px ${acc}25, inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
        >
          <Search size={15} style={{ color: acc, flexShrink: 0 }} />
          <input
            className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-50 min-w-0"
            placeholder="Search Google or enter URL..."
            style={{ color: txt }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} className="cursor-pointer flex-shrink-0">
            <ArrowRight size={15} style={{ color: acc }} />
          </button>
          <button onClick={() => setIsListening(l => !l)} className="cursor-pointer flex-shrink-0">
            <Mic size={15} style={{ color: isListening ? "#ff5252" : acc }} />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto relative z-10 pb-20 px-3">

        {/* HOME */}
        {activeTab === "home" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {PAKISTAN_HEROES.map(hero => (
                <motion.div
                  key={hero.name}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 flex flex-col items-center p-2 rounded-2xl text-center w-[92px]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: `1px solid ${acc}35`,
                    boxShadow: `0 0 15px ${acc}10`,
                  }}
                >
                  <div className="text-2xl mb-0.5">{hero.emoji}</div>
                  <div className="text-[9px] font-bold leading-tight" style={{ color: txt }}>{hero.name}</div>
                  <div className="text-[8px]" style={{ color: acc, fontFamily: urduFont }}>{hero.nameUrdu}</div>
                  <div className="text-[7px] opacity-70 mt-0.5" style={{ color: txt }}>{hero.role}</div>
                  <div className="text-[7px]" style={{ color: acc, fontFamily: urduFont }}>{hero.roleUrdu}</div>
                </motion.div>
              ))}
            </div>

            <div className="mb-3">
              <div className="text-center text-[11px] font-bold mb-2 tracking-widest" style={{ color: acc }}>
                ♦ SMART HUBS ♦
              </div>
              <div className="flex justify-between px-1">
                {SMART_HUBS.map(hub => (
                  <motion.button
                    key={hub.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveHub(hub.id)}
                    className="flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                      style={{
                        background: theme.iconBg,
                        border: `1.5px solid ${acc}50`,
                        boxShadow: `${theme.glowColor}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                      }}
                    >
                      {hub.icon}
                    </div>
                    <span className="text-[9px] font-semibold" style={{ color: txt }}>{hub.name.split(" ")[0]}</span>
                    <span className="text-[8px]" style={{ color: acc, fontFamily: urduFont }}>{hub.nameUrdu.split(" ")[0]}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="text-center text-[11px] font-bold mb-2 tracking-widest" style={{ color: acc }}>♦ QUICK ACCESS ♦</div>
              <div className="flex justify-between px-1">
                {quickApps.map(app => (
                  <AppIcon key={app._id} icon={app.icon} name={app.name} nameUrdu={app.nameUrdu} url={app.url} theme={theme} />
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="text-center text-[11px] font-bold mb-2 tracking-widest" style={{ color: acc }}>♦ CUSTOM ROW 3 ♦</div>
              <div className="flex justify-between px-1">
                {(["⭐", "❤️", "⚡", "🔥", "💎"] as const).map((icon, i) => (
                  <AppIcon
                    key={i} icon={icon} name={`Custom ${i + 1}`}
                    url="#" theme={theme}
                    onPress={() => { /* placeholder */ }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="text-center text-[11px] font-bold mb-2 tracking-widest" style={{ color: acc }}>♦ CUSTOM ROW 4 ♦</div>
              <div className="flex justify-between px-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} className="flex flex-col items-center gap-0.5 cursor-pointer w-14">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${theme.iconBg}80`, border: `1.5px dashed ${acc}60` }}
                    >
                      <Plus size={18} style={{ color: acc }} />
                    </div>
                    <span className="text-[9px] font-medium" style={{ color: txt }}>Add App</span>
                    <span className="text-[8px]" style={{ color: acc, fontFamily: urduFont }}>ایپ شامل</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <div className="text-center text-[11px] font-bold mb-2 tracking-widest" style={{ color: acc }}>♦ E.S HUB ♦</div>
              <div className="flex justify-between px-1">
                {[
                  { icon: "🔲", name: "E.S Hub", url: "#" },
                  { icon: "🌐", name: "Web Hub", url: "https://google.com" },
                  { icon: "📱", name: "App Hub", url: "https://play.google.com" },
                  { icon: "🔒", name: "Safe Hub", url: "https://google.com" },
                  { icon: "💡", name: "Tools Hub", url: "https://tools.google.com" },
                ].map(app => (
                  <AppIcon key={app.name} icon={app.icon} name={app.name} url={app.url} theme={theme} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* BROWSER */}
        {activeTab === "browser" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={browserBack}
                disabled={browserHistoryIdx <= 0}
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-30"
                style={{ background: theme.cardBg, border: `1px solid ${acc}30` }}
              >
                <ArrowLeft size={14} style={{ color: acc }} />
              </button>
              <button
                onClick={browserForward}
                disabled={browserHistoryIdx >= browserHistory.length - 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-30"
                style={{ background: theme.cardBg, border: `1px solid ${acc}30` }}
              >
                <ArrowRight size={14} style={{ color: acc }} />
              </button>
              <button
                onClick={() => browserNavigate && setBrowserNavigate(browserNavigate + " ")}
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background: theme.cardBg, border: `1px solid ${acc}30` }}
              >
                <RotateCcw size={13} style={{ color: acc }} />
              </button>
              <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: theme.cardBg, border: `1px solid ${acc}40` }}>
                <Lock size={11} style={{ color: acc, flexShrink: 0 }} />
                <input
                  className="flex-1 bg-transparent outline-none text-xs min-w-0"
                  style={{ color: txt }}
                  placeholder="Enter URL or search..."
                  value={browserUrl}
                  onChange={e => setBrowserUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") navigateBrowser(browserUrl); }}
                />
              </div>
              <button
                onClick={() => navigateBrowser(browserUrl)}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-black cursor-pointer"
                style={{ background: acc, color: "#000" }}
              >
                GO
              </button>
            </div>

            {browserNavigate ? (
              <iframe
                key={browserNavigate}
                src={browserNavigate}
                className="w-full rounded-2xl"
                style={{ height: "calc(100dvh - 280px)", border: `1.5px solid ${acc}40` }}
                title="Browser"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-56 gap-4">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Globe size={52} style={{ color: acc, filter: `drop-shadow(0 0 12px ${acc})` }} />
                </motion.div>
                <p className="text-sm font-semibold" style={{ color: txt }}>Enter a URL or search above</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Google", "YouTube", "WhatsApp", "ChatGPT"].map(s => (
                    <button
                      key={s}
                      onClick={() => navigateBrowser(`https://${s.toLowerCase()}.com`)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
                      style={{ background: theme.cardBg, color: acc, border: `1px solid ${acc}30` }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* THEMES */}
        {activeTab === "themes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black" style={{ color: txt }}>🎨 Select Theme</h2>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: theme.cardBg, color: acc }}>
                {THEMES.length} Themes
              </span>
            </div>
            <p role="status" className="mb-3 text-xs" style={{ color: txt }}>{user ? (saveTheme.isPending ? "Saving your theme…" : saveTheme.isError ? "Your theme was not saved. Select it again to retry." : "Theme changes are saved to your account.") : <Link to="/auth" className="underline">Sign in to save your theme across visits.</Link>}</p>
            <div className="grid grid-cols-2 gap-2.5">
              {THEMES.map(t => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleThemeChange(t.id)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    border: currentTheme === t.id ? `3px solid ${t.accentColor}` : "2px solid rgba(255,255,255,0.15)",
                    boxShadow: currentTheme === t.id ? `0 0 15px ${t.accentColor}60` : "none",
                  }}
                >
                  <div className="h-14" style={{ background: t.gradient }} />
                  <div className="px-2 py-1.5" style={{ background: "rgba(0,0,0,0.65)" }}>
                    <div className="text-[11px] font-bold text-white">{t.name}</div>
                    <div className="text-[9px]" style={{ color: t.accentColor, fontFamily: urduFont }}>{t.nameUrdu}</div>
                  </div>
                  {currentTheme === t.id && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background: t.accentColor, color: "#000" }}>
                      ✓
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* NOTES */}
        {activeTab === "notes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black" style={{ color: txt }}>📝 Notes | نوٹس</h2>
              <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: theme.cardBg, color: acc }}>{notes.length} chars</span>
            </div>
            <textarea
              className="w-full h-72 p-3 rounded-2xl text-sm outline-none resize-none leading-relaxed"
              placeholder="Write your notes here... | یہاں لکھیں..."
              style={{ background: "rgba(255,255,255,0.08)", color: txt, border: `1.5px solid ${acc}40` }}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer" style={{ background: theme.cardBg, color: acc, border: `1px solid ${acc}30` }}>
                📋 Copy
              </button>
              <button onClick={() => setNotes("")} className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer" style={{ background: "rgba(255,50,50,0.2)", color: "#ff8a80", border: "1px solid rgba(255,82,82,0.3)" }}>
                🗑️ Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* ISLAMIC TAB */}
        {activeTab === "islamic" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-base font-black mb-1 text-center" style={{ color: txt }}>🕌 Islamic Hub</h2>
            <p className="text-center text-xs mb-3" style={{ color: acc, fontFamily: urduFont }}>اسلامی مرکز</p>
            <div className="grid grid-cols-4 gap-3">
              {SMART_HUBS[0].apps.map(app => (
                <AppIcon key={app.name} icon={app.icon} name={app.name} nameUrdu={app.nameUrdu} url={app.url} theme={theme} />
              ))}
            </div>
          </motion.div>
        )}

        {/* NEWS TAB */}
        {activeTab === "news" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="text-base font-black" style={{ color: txt }}>📰 News Hub</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ background: "#ff1744", color: "#fff" }}>LIVE</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {SMART_HUBS[1].apps.map(app => (
                <AppIcon key={app.name} icon={app.icon} name={app.name} nameUrdu={app.nameUrdu} url={app.url} theme={theme} />
              ))}
            </div>
          </motion.div>
        )}

        {/* MEDIA TAB */}
        {activeTab === "media" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-base font-black mb-3 text-center" style={{ color: txt }}>🎬 Media | میڈیا</h2>
            <div className="grid grid-cols-4 gap-3">
              {MEDIA_APPS.map(app => (
                <AppIcon key={app.name} icon={app.icon} name={app.name} nameUrdu={app.nameUrdu} url={app.url} theme={theme} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ADMIN inline */}
        {activeTab === "admin" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AdminPanel theme={theme} onClose={() => setActiveTab("home")} />
          </motion.div>
        )}
      </div>

      {/* TICKER STRIPS */}
      <div className="relative z-10" style={{ borderTop: `1px solid ${acc}50` }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="overflow-hidden"
            style={{
              background: i % 2 === 0 ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.2)",
              borderTop: i > 0 ? `1px solid ${acc}20` : "none",
              paddingTop: "3px", paddingBottom: "3px",
            }}
          >
            <motion.div
              className="flex whitespace-nowrap text-[10px] font-semibold"
              style={{ color: i % 2 === 0 ? acc : txt }}
              animate={{ x: i % 2 === 0 ? [0, -3000] : [-3000, 0] }}
              transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "linear" as const }}
            >
              {Array.from({ length: 8 }).map((_, j) => (
                <span key={j} className="mx-3">♦ {allTicker}</span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div
        className="sticky bottom-0 w-full z-50 flex justify-around items-center py-1.5 px-1"
        style={{
          background: theme.bottomNavBg,
          borderTop: `2px solid ${acc}70`,
          backdropFilter: "blur(20px)",
        }}
      >
        {NAV_TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-0 cursor-pointer transition-all px-0.5 py-0.5 rounded-xl"
              style={{ minWidth: "40px", background: isActive ? `${acc}20` : "transparent" }}
            >
              <div
                className={`text-lg transition-all ${isActive ? "scale-125" : "opacity-60 scale-100"}`}
                style={{ filter: isActive ? `drop-shadow(0 0 6px ${acc})` : "none" }}
              >
                {tab.icon}
              </div>
              <div className="relative">
                {tab.isLive && (
                  <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
                <span
                  className={`text-[8px] font-bold block`}
                  style={{ color: isActive ? acc : `${txt}70` }}
                >
                  {tab.label}
                </span>
                <span
                  className="text-[7px] block text-center"
                  style={{ color: isActive ? `${acc}cc` : `${txt}50`, fontFamily: urduFont }}
                >
                  {tab.labelUrdu}
                </span>
              </div>
            </button>
          );
        })}
        <button
          onClick={() => setAdminOpen(true)}
          className="flex flex-col items-center gap-0 cursor-pointer px-0.5 py-0.5 rounded-xl"
          style={{ minWidth: "40px" }}
        >
          <div className="text-lg opacity-60">👤</div>
          <span className="text-[8px] font-bold" style={{ color: `${txt}70` }}>Admin</span>
          <span className="text-[7px]" style={{ color: `${txt}50`, fontFamily: urduFont }}>ایڈمن</span>
        </button>
      </div>

      {/* HUB OVERLAY */}
      <AnimatePresence>
        {activeHub && (() => {
          const hub = SMART_HUBS.find(h => h.id === activeHub);
          if (!hub) return null;
          return (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 top-0 z-50 overflow-y-auto"
              style={{ background: theme.gradient, maxWidth: "480px", margin: "0 auto" }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i} className="absolute w-1 h-1 rounded-full"
                    style={{ background: acc, left: `${(i * 12.5) % 100}%`, top: `${(i * 15) % 80}%` }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
                    transition={{ duration: 2 + i * 0.5, delay: i * 0.3, repeat: Infinity }}
                  />
                ))}
              </div>
              <div className="relative z-10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{hub.icon}</span>
                      <h2 className="text-xl font-black" style={{ color: txt }}>{hub.name}</h2>
                    </div>
                    <p className="text-sm ml-8" style={{ color: acc, fontFamily: urduFont }}>{hub.nameUrdu}</p>
                  </div>
                  <button
                    onClick={() => setActiveHub(null)}
                    className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)", border: `1px solid ${acc}40` }}
                  >
                    <X size={16} style={{ color: txt }} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3 pb-12">
                  {hub.apps.map(app => (
                    <AppIcon
                      key={app.name}
                      icon={app.icon} name={app.name} nameUrdu={app.nameUrdu}
                      url={app.url} theme={theme} size="large"
                      onPress={() => handleAppOpen(app.url)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ADMIN OVERLAY */}
      <AnimatePresence>
        {adminOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black cursor-pointer"
              onClick={() => setAdminOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl overflow-hidden"
              style={{
                background: theme.gradient,
                border: `1.5px solid ${acc}60`,
                maxWidth: "480px",
                margin: "0 auto",
                height: "88vh",
              }}
            >
              <AdminPanel theme={theme} onClose={() => setAdminOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SIDE DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black cursor-pointer"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 overflow-y-auto"
              style={{
                width: "min(280px, calc(100vw - 60px))",
                background: theme.gradient,
                borderRight: `2px solid ${acc}60`,
              }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-black" style={{ color: txt }}>📱 Device & Media</div>
                    <div className="text-[11px]" style={{ color: acc, fontFamily: urduFont }}>ڈیوائس اور میڈیا</div>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <X size={15} style={{ color: txt }} />
                  </button>
                </div>
                {[
                  { icon: "🖼️", name: "Gallery", nameUrdu: "گیلری", tab: null },
                  { icon: "▶️", name: "Media Player", nameUrdu: "میڈیا پلیئر", tab: "media" as TabId },
                  { icon: "📖", name: "Digital Quran", nameUrdu: "قرآن پاک", tab: "islamic" as TabId },
                  { icon: "🗺️", name: "Maps", nameUrdu: "نقشہ", tab: null, url: "https://maps.google.com" },
                  { icon: "⛅", name: "Weather", nameUrdu: "موسم", tab: null, url: "https://weather.com" },
                  { icon: "🔢", name: "Calculator", nameUrdu: "کیلکولیٹر", tab: null },
                  { icon: "📝", name: "Notes", nameUrdu: "نوٹس", tab: "notes" as TabId },
                  { icon: "☁️", name: "Cloud Drive", nameUrdu: "کلاؤڈ ڈرائیو", tab: null, url: "https://drive.google.com" },
                  { icon: "✅", name: "Task Planner", nameUrdu: "ٹاسک پلانر", tab: null },
                  { icon: "🛒", name: "Play Store", nameUrdu: "پلے اسٹور", tab: null, url: "https://play.google.com" },
                  { icon: "⚙️", name: "Admin Panel", nameUrdu: "ایڈمن پینل", tab: null, admin: true },
                ].map(item => (
                  <button
                    key={item.name}
                    className="w-full flex items-center justify-between p-3 rounded-2xl mb-1.5 cursor-pointer active:scale-98"
                    style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${acc}25` }}
                    onClick={() => {
                      if (item.tab) setActiveTab(item.tab);
                      else if ("admin" in item && item.admin) setAdminOpen(true);
                      else if ("url" in item && item.url) { navigateBrowser(item.url as string); }
                      setDrawerOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="text-xs font-semibold" style={{ color: txt }}>{item.name}</div>
                        <div className="text-[10px]" style={{ color: acc, fontFamily: urduFont }}>{item.nameUrdu}</div>
                      </div>
                    </div>
                    <ChevronRight size={13} style={{ color: `${acc}80` }} />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
