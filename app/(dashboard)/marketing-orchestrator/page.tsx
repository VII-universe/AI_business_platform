'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Wand2, Sparkles, Copy, Check, Download, X,
  RefreshCw, Mail, Monitor, Users, MessageSquare,
  Camera, Heart, MessageCircle, Repeat2, ThumbsUp,
  MoreHorizontal, Maximize2, Eye, ArrowRight,
  Zap, Award, Smile, Briefcase, Globe, Send,
  AlignLeft, Star, Plus, Image, ChevronDown,
  Palette, CheckCircle2, Clock, PenLine, Layers,
  Share2, Bookmark, BarChart2, ArrowUpRight,
  CalendarDays, LayoutGrid, TrendingUp,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════ */

type AssetTypeId = 'linkedin' | 'instagram' | 'facebook' | 'email' | 'twitter' | 'google'
type ToneId = 'professional' | 'playful' | 'luxurious' | 'urgent'
type EditorTab = 'copy' | 'visual' | 'export'

interface GeneratedAsset {
  id: string
  type: AssetTypeId
  platform: string
  headline: string
  copy: string
  subCopy: string
  hashtags: string
  cta: string
  bgStyle: string
  reach: number
  clicks: number
  ctr: number
}

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════ */

function uid() { return Math.random().toString(36).slice(2, 9) }
function rng(min: number, max: number) { return Math.floor(Math.random() * (max - min) + min) }

const ASSET_TYPES: {
  id: AssetTypeId; label: string; icon: typeof Users; shortLabel: string; desc: string
}[] = [
  { id: 'linkedin', label: 'LinkedIn Post', shortLabel: 'LinkedIn', icon: Users, desc: 'Professional B2B content' },
  { id: 'instagram', label: 'Instagram Story', shortLabel: 'Story', icon: Camera, desc: 'Vertical visual content' },
  { id: 'facebook', label: 'Facebook Ad', shortLabel: 'Facebook', icon: Globe, desc: 'Paid social ad unit' },
  { id: 'email', label: 'Email Newsletter', shortLabel: 'Email', icon: Mail, desc: 'Subscriber campaign' },
  { id: 'twitter', label: 'X / Twitter Post', shortLabel: 'X Post', icon: MessageSquare, desc: 'Short-form engagement' },
  { id: 'google', label: 'Google Display', shortLabel: 'Display', icon: Monitor, desc: 'Banner ad creative' },
]

const TONES: { id: ToneId; label: string; icon: typeof Briefcase; desc: string }[] = [
  { id: 'professional', label: 'Professional', icon: Briefcase, desc: 'Authoritative & clear' },
  { id: 'playful', label: 'Playful', icon: Smile, desc: 'Fun & approachable' },
  { id: 'luxurious', label: 'Luxurious', icon: Award, desc: 'Premium & exclusive' },
  { id: 'urgent', label: 'Urgent', icon: Zap, desc: 'Time-sensitive & direct' },
]

const BG_OPTIONS: { id: string; label: string; style: string }[] = [
  { id: 'brand', label: 'Brand', style: 'linear-gradient(135deg, var(--acc) 0%, #1e1b4b 100%)' },
  { id: 'skyline', label: 'Skyline', style: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { id: 'gold', label: 'Gold', style: 'linear-gradient(135deg, #b8901a 0%, #2c1810 60%, #c4961f 100%)' },
  { id: 'minimal', label: 'Minimal', style: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' },
  { id: 'aurora', label: 'Aurora', style: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 50%, #10b981 100%)' },
  { id: 'energy', label: 'Energy', style: 'linear-gradient(135deg, #f97316 0%, #dc2626 60%, #7c3aed 100%)' },
]

const REFINE_OPTIONS: { label: string; icon: typeof Zap }[] = [
  { label: 'Make it punchier', icon: Zap },
  { label: 'More professional', icon: Briefcase },
  { label: 'Make it shorter', icon: AlignLeft },
  { label: 'Add storytelling', icon: PenLine },
  { label: 'More persuasive', icon: TrendingUp },
  { label: 'Add urgency', icon: Star },
]

/* ═══════════════════════════════════════════════════════════════════
   MOCK CONTENT GENERATOR
═══════════════════════════════════════════════════════════════════ */

function buildAssets(types: AssetTypeId[], tone: ToneId): GeneratedAsset[] {
  const t = {
    professional: { adj: "Premier", cta: "Discover More", opener: "We are proud to introduce" },
    playful: { adj: 'Exciting', cta: "Let's Explore!", opener: 'Big news is here!' },
    luxurious: { adj: 'Exclusive', cta: 'Reserve Your Viewing', opener: 'Elevate your world.' },
    urgent: { adj: 'Limited-Time', cta: 'Act Now →', opener: "Do not miss out." },
  }[tone]

  const content: Record<AssetTypeId, { headline: string; copy: string; sub: string; hashtags: string }> = {
    linkedin: {
      headline: `${t.adj} Real Estate Services — Now in Prague`,
      copy: `${t.opener} Our ${t.adj.toLowerCase()} real estate service has officially launched in Prague, one of Europe's most dynamic property markets.\n\nWe combine cutting-edge AI valuation tools with decades of local expertise to help you find, buy, or invest in property with complete confidence.\n\nWhether you are looking for a luxury apartment in Vinohrady or a commercial space in the city center — we're here to guide every step of the journey.`,
      sub: '1st · 312 impressions · 4.2% engagement rate',
      hashtags: '#RealEstate #Prague #PropertyInvestment #LuxuryLiving #AIRealEstate',
    },
    instagram: {
      headline: 'Prague\'s Finest ✨',
      copy: `${t.adj} homes in the heart of Prague.\nDiscover a new standard of living.`,
      sub: 'Swipe up to explore →',
      hashtags: '#PragueLiving #LuxuryRealEstate #HomeGoals #PragueApartments #DreamHome',
    },
    facebook: {
      headline: 'Find Your Dream Home in Prague',
      copy: `${t.opener} the city's most ${t.adj.toLowerCase()} real estate service. AI-powered property search. Expert guidance. Zero compromise on quality.`,
      sub: 'aiplatform.io · Real Estate',
      hashtags: '',
    },
    email: {
      headline: `You are Invited: ${t.adj} Prague Real Estate`,
      copy: `We have been working behind the scenes to build something special — and today, we're finally ready to share it with you.\n\nOur new service combines AI-driven market analysis with personalized concierge support to make your Prague property journey seamless from day one.\n\nAs one of our valued subscribers, you get exclusive early access.`,
      sub: 'Exclusive preview for subscribers only',
      hashtags: '',
    },
    twitter: {
      headline: 'Prague\'s property market just changed.',
      copy: `We are launching our ${t.adj.toLowerCase()} real estate service in Prague 🏙️\n\nAI-powered. Expert-backed. Built for people who do not settle for less.\n\n${t.cta}`,
      sub: '',
      hashtags: '#Prague #RealEstate #PropTech',
    },
    google: {
      headline: `${t.adj} Prague Properties`,
      copy: `AI-powered real estate search. Expert results, guaranteed.`,
      sub: 'aiplatform.io/prague',
      hashtags: '',
    },
  }

  return types.map(type => ({
    id: uid(),
    type,
    platform: ASSET_TYPES.find(a => a.id === type)!.label,
    headline: content[type].headline,
    copy: content[type].copy,
    subCopy: content[type].sub,
    hashtags: content[type].hashtags,
    cta: t.cta,
    bgStyle: BG_OPTIONS[0].style,
    reach: rng(800, 8000),
    clicks: rng(80, 800),
    ctr: rng(2, 14),
  }))
}

/* ═══════════════════════════════════════════════════════════════════
   PLATFORM CARD COMPONENTS
═══════════════════════════════════════════════════════════════════ */

function LinkedInCard({ asset, onClick }: { asset: GeneratedAsset; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="glass overflow-hidden cursor-pointer group hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 relative">
      {/* LinkedIn chrome */}
      <div className="bg-[#f3f2ef] dark:bg-[#1b1f23] px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[#0A66C2] font-black text-sm tracking-tight">in</span>
          <span className="text-gray-400 text-[10px] font-medium">LinkedIn</span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>
      {/* Post header */}
      <div className="bg-white dark:bg-[#1b1f23] px-4 pt-3 pb-2 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
          style={{ background: 'var(--acc)' }}>AI</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">AI Business Platform</p>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Marketing AI · Now · 🌐</p>
        </div>
        <button className="flex-shrink-0 text-[#0A66C2] border border-[#0A66C2] text-[11px] px-3 py-1 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          + Follow
        </button>
      </div>
      {/* Copy */}
      <div className="bg-white dark:bg-[#1b1f23] px-4 pb-3">
        <p className="text-[13px] text-gray-700 dark:text-slate-300 leading-relaxed line-clamp-3">
          {asset.copy.split('\n')[0]}
        </p>
        <span className="text-[#0A66C2] text-[11px] font-semibold">…see more</span>
      </div>
      {/* Hero image */}
      <div className="relative h-44 overflow-hidden flex items-center justify-center" style={{ background: asset.bgStyle }}>
        <div className="text-center px-6">
          <p className="text-white text-base font-bold leading-snug" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>
            {asset.headline}
          </p>
          <div className="inline-flex mt-3 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm text-white text-[11px] font-semibold">
            {asset.cta} →
          </div>
        </div>
      </div>
      {/* Engagement */}
      <div className="bg-white dark:bg-[#1b1f23] px-4 py-2">
        <div className="flex justify-between text-[11px] text-gray-400 pb-2">
          <span>👍 {rng(80, 400)} · 💬 {rng(8, 60)} comments</span>
          <span>{rng(200, 900)} views</span>
        </div>
        <div className="flex border-t border-black/[0.05] dark:border-white/[0.05] pt-2 gap-0.5">
          {([['👍', 'Like'], ['💬', 'Comment'], ['↺', 'Repost'], ['✉', 'Send']] as const).map(([emoji, label]) => (
            <button key={label} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors text-[11px] text-gray-500 dark:text-slate-400 font-medium">
              <span>{emoji}</span> {label}
            </button>
          ))}
        </div>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 dark:bg-black/20 backdrop-blur-[1px]">
        <div className="glass px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-white shadow-xl flex items-center gap-2.5">
          <Maximize2 className="w-4 h-4" /> Open Editor
        </div>
      </div>
    </div>
  )
}

function InstagramCard({ asset, onClick }: { asset: GeneratedAsset; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="glass overflow-hidden cursor-pointer group hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 relative">
      {/* Story container — tall aspect */}
      <div className="relative flex flex-col" style={{ minHeight: '440px', background: asset.bgStyle }}>
        {/* Progress bar */}
        <div className="flex gap-1 px-3 pt-3">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-0.5 flex-1 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
        {/* Story header */}
        <div className="flex items-center gap-2.5 px-3 pt-2.5">
          <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-white/20">
            <span className="text-white text-[10px] font-bold">AI</span>
          </div>
          <div>
            <p className="text-white text-[12px] font-bold leading-tight">ai_platform</p>
            <p className="text-white/70 text-[9px]">3m ago</p>
          </div>
          <MoreHorizontal className="w-4 h-4 text-white/70 ml-auto" />
          <X className="w-4 h-4 text-white/70" />
        </div>
        {/* Story content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8">
          <p className="text-white/80 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
            Now Available
          </p>
          <p className="text-white text-2xl font-black leading-tight" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>
            {asset.headline}
          </p>
          <p className="text-white/80 text-sm mt-3 leading-relaxed">
            {asset.copy.split('\n')[0]}
          </p>
          <div className="mt-6 px-6 py-2.5 rounded-full text-[12px] font-bold text-white border-2 border-white/60 bg-white/15 backdrop-blur-sm">
            {asset.cta}
          </div>
        </div>
        {/* Hashtags */}
        <div className="px-4 pb-4 text-center">
          <p className="text-white/60 text-[10px] font-medium line-clamp-1">{asset.hashtags}</p>
        </div>
        {/* Swipe up */}
        <div className="flex flex-col items-center pb-5">
          <div className="w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-white/70 -rotate-90" />
          </div>
          <p className="text-white/60 text-[9px] mt-1 font-medium uppercase tracking-widest">Swipe up</p>
        </div>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 backdrop-blur-[1px]">
        <div className="glass px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-white shadow-xl flex items-center gap-2.5">
          <Maximize2 className="w-4 h-4" /> Open Editor
        </div>
      </div>
    </div>
  )
}

function FacebookCard({ asset, onClick }: { asset: GeneratedAsset; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="glass overflow-hidden cursor-pointer group hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 relative">
      {/* FB chrome */}
      <div className="bg-white dark:bg-[#242526] px-4 py-2.5 border-b border-black/[0.07] dark:border-white/[0.07] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[#1877F2] font-black text-base">f</span>
          <span className="text-gray-400 dark:text-slate-500 text-[10px] font-medium">Sponsored</span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>
      {/* Ad image */}
      <div className="relative h-52 overflow-hidden flex items-center justify-center" style={{ background: asset.bgStyle }}>
        <div className="text-center px-8">
          <div className="inline-block px-2 py-0.5 rounded bg-white/20 text-white text-[9px] uppercase tracking-wider font-bold mb-3">Real Estate</div>
          <p className="text-white text-xl font-black leading-tight" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>
            {asset.headline}
          </p>
        </div>
      </div>
      {/* Ad copy */}
      <div className="bg-white dark:bg-[#242526] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-400 dark:text-slate-500 uppercase tracking-wide font-semibold">{asset.subCopy}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 leading-tight">{asset.headline}</p>
          <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">{asset.copy.split('\n')[0]}</p>
        </div>
        <button className="flex-shrink-0 px-4 py-2 rounded-lg text-white text-sm font-bold transition-all shadow-sm"
          style={{ background: 'var(--acc)' }}>
          {asset.cta}
        </button>
      </div>
      {/* Reactions */}
      <div className="bg-white dark:bg-[#242526] px-4 pb-3 border-t border-black/[0.05] dark:border-white/[0.05]">
        <div className="flex justify-between text-[11px] text-gray-400 py-2">
          <span>👍❤️ {rng(100, 600)}</span>
          <span>{rng(10, 80)} comments · {rng(5, 40)} shares</span>
        </div>
        <div className="flex gap-0.5 border-t border-black/[0.05] dark:border-white/[0.05] pt-2">
          {([['👍', 'Like'], ['💬', 'Comment'], ['↷', 'Share']] as const).map(([emoji, label]) => (
            <button key={label} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors text-[12px] text-gray-500 dark:text-slate-400 font-medium">
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 dark:bg-black/20 backdrop-blur-[1px]">
        <div className="glass px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-white shadow-xl flex items-center gap-2.5">
          <Maximize2 className="w-4 h-4" /> Open Editor
        </div>
      </div>
    </div>
  )
}

function EmailCard({ asset, onClick }: { asset: GeneratedAsset; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="glass overflow-hidden cursor-pointer group hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 relative">
      {/* Email client chrome */}
      <div className="bg-gray-50 dark:bg-slate-800/80 px-4 py-2.5 border-b border-black/[0.08] dark:border-white/[0.07]">
        <div className="flex items-center gap-2 mb-1.5">
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
          <div className="flex-1 mx-3 h-5 rounded-md bg-white dark:bg-slate-700 flex items-center px-2">
            <span className="text-[10px] text-gray-400 font-mono truncate">{asset.subCopy}</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-slate-500">
          <span className="font-semibold text-gray-600 dark:text-slate-300">From:</span> marketing@aiplatform.io
        </div>
        <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
          <span className="font-semibold text-gray-600 dark:text-slate-300">Subject:</span>{' '}
          <span className="text-gray-700 dark:text-slate-200 font-medium">{asset.headline}</span>
        </div>
      </div>
      {/* Email header banner */}
      <div className="h-20 flex items-center justify-center" style={{ background: asset.bgStyle }}>
        <p className="text-white text-sm font-black tracking-tight" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>
          AI Platform
        </p>
      </div>
      {/* Email body */}
      <div className="bg-white dark:bg-slate-800/40 px-5 py-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{asset.headline}</h3>
        <p className="text-[12px] text-gray-600 dark:text-slate-300 leading-relaxed mt-2 line-clamp-4">
          {asset.copy}
        </p>
        <button className="mt-4 w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-md"
          style={{ background: 'var(--acc)' }}>
          {asset.cta}
        </button>
        <p className="text-center text-[10px] text-gray-300 dark:text-slate-600 mt-3">
          Unsubscribe · Manage Preferences · Privacy Policy
        </p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 dark:bg-black/20 backdrop-blur-[1px]">
        <div className="glass px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-white shadow-xl flex items-center gap-2.5">
          <Maximize2 className="w-4 h-4" /> Open Editor
        </div>
      </div>
    </div>
  )
}

function TwitterCard({ asset, onClick }: { asset: GeneratedAsset; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="glass overflow-hidden cursor-pointer group hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 relative">
      {/* X chrome */}
      <div className="bg-white dark:bg-[#15202b] px-4 py-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--acc)' }}>AI</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900 dark:text-white">AI Platform</span>
              <span className="text-[10px] px-1 rounded-sm font-bold text-white" style={{ background: 'var(--acc)' }}>✓</span>
              <span className="text-gray-400 text-[12px]">@aiplatform · 2m</span>
            </div>
            <p className="text-[13px] text-gray-800 dark:text-slate-200 mt-1.5 leading-relaxed whitespace-pre-line">
              {asset.copy}
            </p>
            {asset.hashtags && (
              <p className="text-[12px] mt-1.5 font-medium" style={{ color: 'var(--acc)' }}>
                {asset.hashtags}
              </p>
            )}
          </div>
        </div>
        {/* Media preview */}
        <div className="ml-13 mt-3 ml-[52px] h-32 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: asset.bgStyle }}>
          <p className="text-white text-sm font-bold text-center px-4" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>
            {asset.headline}
          </p>
        </div>
        {/* Engagement */}
        <div className="mt-3 ml-[52px] flex gap-5 text-gray-400 dark:text-slate-500">
          {([
            [MessageCircle, rng(10, 60)],
            [Repeat2, rng(20, 120)],
            [Heart, rng(50, 500)],
            [BarChart2, rng(500, 5000)],
          ] as [typeof MessageCircle, number][]).map(([Icon, count], i) => (
            <button key={i} className="flex items-center gap-1.5 hover:text-violet-500 dark:hover:text-violet-400 transition-colors text-[12px]">
              <Icon className="w-3.5 h-3.5" />
              <span>{count > 999 ? (count / 1000).toFixed(1) + 'K' : count}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 dark:bg-black/20 backdrop-blur-[1px]">
        <div className="glass px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-white shadow-xl flex items-center gap-2.5">
          <Maximize2 className="w-4 h-4" /> Open Editor
        </div>
      </div>
    </div>
  )
}

function GoogleDisplayCard({ asset, onClick }: { asset: GeneratedAsset; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="glass overflow-hidden cursor-pointer group hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 relative col-span-2">
      <div className="flex" style={{ minHeight: '140px' }}>
        {/* Image side */}
        <div className="w-2/5 flex-shrink-0 flex items-center justify-center relative overflow-hidden"
          style={{ background: asset.bgStyle }}>
          <p className="text-white text-lg font-black text-center px-4" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>
            {asset.headline}
          </p>
        </div>
        {/* Copy side */}
        <div className="flex-1 bg-white dark:bg-slate-800/60 px-6 py-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-400">
                Ad
              </span>
              <span className="text-[11px] text-gray-400 font-mono">{asset.subCopy}</span>
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white leading-tight">{asset.headline}</p>
            <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1">{asset.copy}</p>
          </div>
          <button className="self-start mt-3 px-5 py-2 rounded-xl text-white text-sm font-bold shadow-sm transition-all hover:opacity-90"
            style={{ background: 'var(--acc)' }}>
            {asset.cta}
          </button>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 dark:bg-black/20 backdrop-blur-[1px]">
        <div className="glass px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-white shadow-xl flex items-center gap-2.5">
          <Maximize2 className="w-4 h-4" /> Open Editor
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════════════════════════════ */

function SkeletonCard({ type }: { type: AssetTypeId }) {
  const isStory = type === 'instagram'
  const isDisplay = type === 'google'
  const imgH = isStory ? 'h-[360px]' : isDisplay ? 'h-[96px]' : 'h-[180px]'
  return (
    <div className={`glass overflow-hidden animate-pulse ${isDisplay ? 'col-span-2' : ''}`}>
      {isDisplay ? (
        <div className="flex h-[140px]">
          <div className="w-2/5 bg-gray-200 dark:bg-slate-700" />
          <div className="flex-1 p-5 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3" />
            <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full w-full" />
            <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full w-4/5" />
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-xl w-24 mt-2" />
          </div>
        </div>
      ) : (
        <>
          <div className={`${imgH} bg-gray-200 dark:bg-slate-700 relative overflow-hidden`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite]"
              style={{ background: 'linear-gradient(90deg, transparent, var(--acc-light, rgba(124,58,237,0.08)), transparent)' }} />
          </div>
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full w-full" />
            <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full w-5/6" />
            {!isStory && (
              <div className="flex gap-2 pt-2">
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-xl flex-1" />
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-xl w-16" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ASSET CARD DISPATCHER
═══════════════════════════════════════════════════════════════════ */

function AssetCard({ asset, onClick }: { asset: GeneratedAsset; onClick: () => void }) {
  switch (asset.type) {
    case 'linkedin': return <LinkedInCard asset={asset} onClick={onClick} />
    case 'instagram': return <InstagramCard asset={asset} onClick={onClick} />
    case 'facebook': return <FacebookCard asset={asset} onClick={onClick} />
    case 'email': return <EmailCard asset={asset} onClick={onClick} />
    case 'twitter': return <TwitterCard asset={asset} onClick={onClick} />
    case 'google': return <GoogleDisplayCard asset={asset} onClick={onClick} />
  }
}

/* ═══════════════════════════════════════════════════════════════════
   EDITOR PANEL (full-screen overlay)
═══════════════════════════════════════════════════════════════════ */

function EditorPanel({
  asset, onClose, onUpdate,
}: {
  asset: GeneratedAsset
  onClose: () => void
  onUpdate: (updated: GeneratedAsset) => void
}) {
  const [local, setLocal] = useState<GeneratedAsset>(asset)
  const [tab, setTab] = useState<EditorTab>('copy')
  const [refining, setRefining] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [exportMsg, setExportMsg] = useState<string | null>(null)

  function update(patch: Partial<GeneratedAsset>) {
    const updated = { ...local, ...patch }
    setLocal(updated)
    onUpdate(updated)
  }

  async function handleRefine(option: string) {
    setRefining(option)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))
    const refined: Record<string, string> = {
      'Make it punchier': local.copy.replace(/\. /g, '! ').slice(0, 200) + ' This is your moment.',
      'More professional': `We are pleased to present our latest initiative in Prague. ${local.copy.split('\n')[0]}`,
      'Make it shorter': local.copy.split('\n')[0].slice(0, 120) + '...',
      'Add storytelling': `Picture this: You walk into the perfect Prague apartment... ${local.copy.split('\n')[0]}`,
      'More persuasive': `Imagine owning a piece of Prague's most coveted real estate. ${local.copy.split('\n')[0]} Act before someone else does.`,
      'Add urgency': `⚡ Limited availability. ${local.copy.split('\n')[0]} Spots are filling fast — do not wait.`,
    }
    update({ copy: refined[option] ?? local.copy })
    setRefining(null)
  }

  async function handleCopy() {
    const text = `${local.headline}\n\n${local.copy}\n\n${local.hashtags}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExport(type: string) {
    setExportMsg(type === 'kanban' ? 'Sent to Content Calendar ✓' : `Downloading ${type.toUpperCase()}…`)
    setTimeout(() => setExportMsg(null), 2500)
  }

  const EDITOR_TABS: { id: EditorTab; label: string }[] = [
    { id: 'copy', label: 'AI Copywriter' },
    { id: 'visual', label: 'Visual Design' },
    { id: 'export', label: 'Export Hub' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Editor panel — slides in from right */}
      <div className="relative ml-auto w-full max-w-5xl h-full flex bg-white dark:bg-[#0d0c1d] shadow-2xl overflow-hidden">

        {/* LEFT — Preview */}
        <div className="w-[42%] flex-shrink-0 flex flex-col border-r border-black/[0.07] dark:border-white/[0.07] bg-gray-50 dark:bg-[#080714] overflow-y-auto">
          <div className="p-5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500">Preview</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{local.platform}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Live</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-start justify-center p-6">
            <div className="w-full max-w-[340px]">
              <AssetCard asset={local} onClick={() => {}} />
            </div>
          </div>
          {/* Stats */}
          <div className="p-5 border-t border-black/[0.06] dark:border-white/[0.06] flex-shrink-0">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500 mb-3">AI Performance Forecast</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Est. Reach', value: local.reach.toLocaleString('en-US'), icon: Eye },
                { label: 'Est. Clicks', value: local.clicks.toLocaleString('en-US'), icon: ArrowUpRight },
                { label: 'Est. CTR', value: `${local.ctr}%`, icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="glass p-3 text-center">
                  <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: 'var(--acc)' }} />
                  <p className="text-base font-black text-gray-900 dark:text-white leading-none">{value}</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-6 pb-4 border-b border-black/[0.07] dark:border-white/[0.07] flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Asset Editor</h2>
              <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">{local.platform}</p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 px-7 pt-4 flex-shrink-0">
            {EDITOR_TABS.map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  tab === id
                    ? 'text-white shadow-md'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
                style={tab === id ? { background: 'var(--acc)' } : {}}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-7 py-5">

            {/* ── Copy Tab ──────────────────────────────────── */}
            {tab === 'copy' && (
              <div className="space-y-5">
                {/* Headline */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500 block mb-2">Headline</label>
                  <input
                    value={local.headline}
                    onChange={e => update({ headline: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/80 dark:bg-white/[0.05] text-gray-900 dark:text-white text-base font-bold focus:outline-none focus:border-violet-400 transition-colors backdrop-blur-sm"
                  />
                </div>

                {/* Copy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500">Copy</label>
                    <span className="text-[10px] text-gray-300 dark:text-slate-600 font-mono">{local.copy.length} chars</span>
                  </div>
                  <textarea
                    value={local.copy}
                    onChange={e => update({ copy: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/80 dark:bg-white/[0.05] text-gray-800 dark:text-slate-200 text-sm leading-relaxed focus:outline-none focus:border-violet-400 transition-colors resize-none backdrop-blur-sm"
                  />
                </div>

                {/* CTA */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500 block mb-2">Call to Action</label>
                  <input
                    value={local.cta}
                    onChange={e => update({ cta: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/80 dark:bg-white/[0.05] text-gray-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-violet-400 transition-colors backdrop-blur-sm"
                  />
                </div>

                {/* Hashtags */}
                {local.hashtags && (
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500 block mb-2">Hashtags</label>
                    <input
                      value={local.hashtags}
                      onChange={e => update({ hashtags: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/80 dark:bg-white/[0.05] text-sm focus:outline-none focus:border-violet-400 transition-colors backdrop-blur-sm"
                      style={{ color: 'var(--acc)' }}
                    />
                  </div>
                )}

                {/* Refine buttons */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--acc)' }} />
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500">AI Refine</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {REFINE_OPTIONS.map(({ label, icon: Icon }) => (
                      <button key={label} onClick={() => handleRefine(label)} disabled={!!refining}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-sm font-semibold text-left transition-all cursor-pointer ${
                          refining === label
                            ? 'text-white border-transparent shadow-md'
                            : 'border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] text-gray-700 dark:text-slate-200 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10'
                        }`}
                        style={refining === label ? { background: 'var(--acc)' } : {}}>
                        {refining === label
                          ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-white flex-shrink-0" />
                          : <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: refining ? 'inherit' : 'var(--acc)' }} />}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Visual Tab ────────────────────────────────── */}
            {tab === 'visual' && (
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500 block mb-3">Background Style</label>
                  <div className="grid grid-cols-3 gap-3">
                    {BG_OPTIONS.map(bg => (
                      <button key={bg.id} onClick={() => update({ bgStyle: bg.style })}
                        className={`relative rounded-2xl overflow-hidden aspect-video transition-all cursor-pointer ${
                          local.bgStyle === bg.style ? 'ring-2 ring-offset-2 scale-[1.03]' : 'hover:scale-[1.02] opacity-80 hover:opacity-100'
                        }`}
                        style={{ '--tw-ring-color': 'var(--acc)' } as React.CSSProperties}>
                        <div className="absolute inset-0" style={{ background: bg.style }} />
                        <div className="absolute inset-0 flex items-end p-2">
                          <span className="text-white text-[10px] font-bold drop-shadow-md">{bg.label}</span>
                        </div>
                        {local.bgStyle === bg.style && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <Check className="w-3 h-3" style={{ color: 'var(--acc)' }} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500 block mb-3">Brand Colors (from Brand Kit)</label>
                  <div className="flex items-center gap-3 p-4 rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02]">
                    <div className="w-8 h-8 rounded-xl shadow-sm" style={{ background: 'var(--acc)' }} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Accent Color</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 font-mono">Synced from Brand Kit</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500 block mb-3">Typography (from Brand Kit)</label>
                  <div className="flex items-center gap-3 p-4 rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02]">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                      <span className="text-base font-black text-gray-700 dark:text-white" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>Aa</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Poppins · Inter</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">Heading · Body</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Export Tab ────────────────────────────────── */}
            {tab === 'export' && (
              <div className="space-y-4">
                {exportMsg && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{exportMsg}</p>
                  </div>
                )}

                <p className="text-sm text-gray-500 dark:text-slate-400">Export or publish your asset to any channel.</p>

                {[
                  {
                    label: 'Download High-Res PNG',
                    desc: '2400×2400px, transparent background, print-ready',
                    icon: Download,
                    action: () => handleExport('png'),
                    primary: true,
                  },
                  {
                    label: 'Download as JPG',
                    desc: '2400×2400px, 95% quality, web-optimized',
                    icon: Image,
                    action: () => handleExport('jpg'),
                    primary: false,
                  },
                  {
                    label: 'Copy to Clipboard',
                    desc: 'Copy all text content with formatting intact',
                    icon: copied ? Check : Copy,
                    action: handleCopy,
                    primary: false,
                  },
                  {
                    label: 'Send to Content Calendar',
                    desc: 'Add to your internal Kanban board for scheduling',
                    icon: CalendarDays,
                    action: () => handleExport('kanban'),
                    primary: false,
                  },
                ].map(({ label, desc, icon: Icon, action, primary }) => (
                  <button key={label} onClick={action}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer group ${
                      primary
                        ? 'text-white border-transparent shadow-lg hover:shadow-xl hover:scale-[1.01]'
                        : 'border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] text-gray-700 dark:text-slate-200 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 hover:scale-[1.01]'
                    }`}
                    style={primary ? { background: 'var(--acc)', boxShadow: '0 8px 24px var(--acc-glow, rgba(124,58,237,0.3))' } : {}}>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                      primary ? 'bg-white/20' : 'bg-black/[0.04] dark:bg-white/[0.05] group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30'
                    }`}>
                      <Icon className={`w-5 h-5 ${primary ? 'text-white' : ''}`}
                        style={!primary ? { color: 'var(--acc)' } : {}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${primary ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{label}</p>
                      <p className={`text-xs mt-0.5 ${primary ? 'text-white/70' : 'text-gray-400 dark:text-slate-500'}`}>{desc}</p>
                    </div>
                    <ArrowRight className={`w-4 h-4 flex-shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${primary ? 'text-white' : ''}`}
                      style={!primary ? { color: 'var(--acc)' } : {}} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════════════════════ */

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
        style={{ background: 'linear-gradient(135deg, var(--acc), #1e1b4b)' }}>
        <Wand2 className="w-9 h-9 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>
        Your campaign assets will appear here
      </h3>
      <p className="text-gray-400 dark:text-slate-500 text-base max-w-sm leading-relaxed">
        Describe your campaign goal, choose your platforms and tone, then hit <strong className="text-gray-700 dark:text-slate-200">Generate Assets</strong> to bring it to life.
      </p>
      <button onClick={onGenerate}
        className="mt-8 flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-white text-sm font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        style={{ background: 'var(--acc)', boxShadow: '0 8px 24px var(--acc-glow, rgba(124,58,237,0.3))' }}>
        <Sparkles className="w-4 h-4" /> Generate Your First Assets
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */

export default function MarketingOrchestratorPage() {
  const [campaignGoal, setCampaignGoal] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<AssetTypeId[]>(['linkedin', 'instagram', 'facebook'])
  const [tone, setTone] = useState<ToneId>('professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [assets, setAssets] = useState<GeneratedAsset[]>([])
  const [skeletonTypes, setSkeletonTypes] = useState<AssetTypeId[]>([])
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function toggleType(id: AssetTypeId) {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  async function handleGenerate() {
    if (selectedTypes.length === 0) return
    setAssets([])
    setSkeletonTypes(selectedTypes)
    setIsGenerating(true)

    await new Promise(r => setTimeout(r, 2200 + Math.random() * 600))

    const generated = buildAssets(selectedTypes, tone)
    setIsGenerating(false)
    setSkeletonTypes([])
    setAssets(generated)
  }

  function handleUpdateAsset(updated: GeneratedAsset) {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a))
    setSelectedAsset(updated)
  }

  const hasContent = isGenerating || assets.length > 0

  return (
    <div className="flex flex-col min-h-screen">
      {/* shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* Editor overlay */}
      {selectedAsset && (
        <EditorPanel
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onUpdate={handleUpdateAsset}
        />
      )}

      {/* ── STICKY HEADER ────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 glass border-b border-black/[0.06] dark:border-white/[0.06] px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--acc), #1e1b4b)' }}>
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight"
              style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>
              Marketing Orchestrator
            </h1>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">AI-generated on-brand assets · {assets.length} assets ready</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {assets.length > 0 && (
            <button
              onClick={() => { setAssets([]); setSelectedTypes(['linkedin', 'instagram', 'facebook']); setCampaignGoal('') }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.05] text-gray-500 dark:text-slate-400 text-sm font-medium hover:bg-black/[0.03] dark:hover:bg-white/[0.08] transition-all cursor-pointer">
              <RefreshCw className="w-4 h-4" /> New Campaign
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedTypes.length === 0}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-white text-sm font-bold shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--acc)', boxShadow: '0 4px 20px var(--acc-glow, rgba(124,58,237,0.3))' }}>
            {isGenerating
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</>
              : <><Sparkles className="w-4 h-4" /> Generate Assets</>}
          </button>
        </div>
      </div>

      {/* ── MAIN BODY ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* ══ LEFT: CONTROL CENTER (fixed width) ══════════════════ */}
        <div className="lg:w-[360px] flex-shrink-0 border-r border-black/[0.06] dark:border-white/[0.04] overflow-y-auto p-6 space-y-5">

          {/* Campaign Goal */}
          <div className="glass p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'var(--acc-light, rgba(124,58,237,0.12))' }}>
                <PenLine className="w-3.5 h-3.5" style={{ color: 'var(--acc)' }} />
              </div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Campaign Goal</h2>
            </div>
            <textarea
              ref={textareaRef}
              value={campaignGoal}
              onChange={e => {
                setCampaignGoal(e.target.value)
                const t = e.target
                t.style.height = 'auto'
                t.style.height = Math.min(t.scrollHeight, 180) + 'px'
              }}
              placeholder="Describe your campaign… e.g., 'Launch our premium real estate service in Prague targeting high-net-worth buyers aged 35–55.'"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/70 dark:bg-white/[0.05] text-gray-800 dark:text-slate-200 text-sm leading-relaxed focus:outline-none focus:border-violet-400 transition-colors resize-none placeholder:text-gray-300 dark:placeholder:text-slate-600 backdrop-blur-sm"
            />
          </div>

          {/* Asset Type Selectors */}
          <div className="glass p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'var(--acc-light, rgba(124,58,237,0.12))' }}>
                <Layers className="w-3.5 h-3.5" style={{ color: 'var(--acc)' }} />
              </div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Asset Types</h2>
              <span className="ml-auto text-[10px] font-bold text-gray-400 dark:text-slate-500">
                {selectedTypes.length} selected
              </span>
            </div>
            <div className="space-y-2">
              {ASSET_TYPES.map(({ id, label, icon: Icon, desc }) => {
                const active = selectedTypes.includes(id)
                return (
                  <button key={id} onClick={() => toggleType(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      active
                        ? 'border-transparent text-white shadow-md'
                        : 'border-black/[0.07] dark:border-white/[0.07] bg-white/40 dark:bg-white/[0.02] text-gray-600 dark:text-slate-300 hover:border-black/15 dark:hover:border-white/15 hover:bg-white/60 dark:hover:bg-white/[0.05]'
                    }`}
                    style={active ? { background: 'var(--acc)', boxShadow: '0 4px 16px var(--acc-glow, rgba(124,58,237,0.25))' } : {}}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      active ? 'bg-white/20' : 'bg-black/[0.04] dark:bg-white/[0.05]'
                    }`}>
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : ''}`}
                        style={!active ? { color: 'var(--acc)' } : {}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-bold ${active ? 'text-white' : 'text-gray-800 dark:text-slate-100'}`}>{label}</p>
                      <p className={`text-[11px] mt-0.5 ${active ? 'text-white/70' : 'text-gray-400 dark:text-slate-500'}`}>{desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      active ? 'bg-white border-white' : 'border-gray-300 dark:border-slate-600'
                    }`}>
                      {active && <Check className="w-3 h-3" style={{ color: 'var(--acc)' }} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tone Selector */}
          <div className="glass p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'var(--acc-light, rgba(124,58,237,0.12))' }}>
                <Star className="w-3.5 h-3.5" style={{ color: 'var(--acc)' }} />
              </div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Tone & Vibe</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(({ id, label, icon: Icon, desc }) => {
                const active = tone === id
                return (
                  <button key={id} onClick={() => setTone(id)}
                    className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                      active
                        ? 'border-transparent text-white shadow-md'
                        : 'border-black/[0.07] dark:border-white/[0.07] bg-white/40 dark:bg-white/[0.02] text-gray-600 dark:text-slate-300 hover:border-black/15 dark:hover:border-white/15'
                    }`}
                    style={active ? { background: 'var(--acc)', boxShadow: '0 4px 16px var(--acc-glow, rgba(124,58,237,0.25))' } : {}}>
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`}
                      style={!active ? { color: 'var(--acc)' } : {}} />
                    <div>
                      <p className={`text-[12px] font-bold ${active ? 'text-white' : 'text-gray-800 dark:text-slate-100'}`}>{label}</p>
                      <p className={`text-[10px] mt-0.5 leading-tight ${active ? 'text-white/70' : 'text-gray-400 dark:text-slate-500'}`}>{desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Brand Sync Badge */}
          <div className="glass p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'var(--acc-light, rgba(124,58,237,0.12))' }}>
                <Palette className="w-3.5 h-3.5" style={{ color: 'var(--acc)' }} />
              </div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Brand Kit Sync</h2>
              <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Synced</span>
              </div>
            </div>
            {/* Color swatches */}
            <div className="flex items-center gap-2 mb-3">
              {[
                { style: { background: 'var(--acc)' }, label: 'Primary' },
                { style: { background: 'var(--acc-h, #6D28D9)' }, label: 'Hover' },
                { style: { background: 'var(--acc-light, rgba(124,58,237,0.2))' }, label: 'Light' },
                { style: { background: '#1e1b4b' }, label: 'Dark' },
                { style: { background: '#ffffff', border: '1px solid #e2e8f0' }, label: 'White' },
              ].map(({ style, label }) => (
                <div key={label} className="group relative">
                  <div className="w-7 h-7 rounded-lg shadow-sm cursor-default" style={style} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded-lg bg-gray-900 text-white text-[9px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {label}
                  </div>
                </div>
              ))}
            </div>
            {/* Font */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-sm font-black text-gray-700 dark:text-white" style={{ fontFamily: 'var(--font-poppins, sans-serif)' }}>Aa</span>
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-800 dark:text-slate-100">Poppins · Inter</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">Heading · Body font</p>
              </div>
            </div>
          </div>

          {/* Generate button (sticky bottom) */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedTypes.length === 0}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white text-sm font-bold shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            style={{ background: 'var(--acc)', boxShadow: '0 8px 24px var(--acc-glow, rgba(124,58,237,0.35))' }}>
            {isGenerating
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating {selectedTypes.length} assets…</>
              : <><Wand2 className="w-4 h-4" /> Generate {selectedTypes.length} Asset{selectedTypes.length !== 1 ? 's' : ''}</>}
          </button>
        </div>

        {/* ══ RIGHT: ASSET GRID ════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto bg-black/[0.01] dark:bg-white/[0.005]">
          {!hasContent ? (
            <EmptyState onGenerate={handleGenerate} />
          ) : (
            <div className="p-6">
              {/* Generation status bar */}
              {isGenerating && (
                <div className="mb-5 flex items-center gap-3 px-5 py-3 rounded-2xl glass border-l-4"
                  style={{ borderLeftColor: 'var(--acc)' }}>
                  <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: 'var(--acc)' }} />
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">AI is generating your assets…</p>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                      Applying Brand Kit · Writing copy · Rendering {selectedTypes.length} platform{selectedTypes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: 'var(--acc)',
                          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-2 gap-5 auto-rows-auto">
                {isGenerating
                  ? skeletonTypes.map((type, i) => <SkeletonCard key={i} type={type} />)
                  : assets.map(asset => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onClick={() => setSelectedAsset(asset)}
                    />
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
