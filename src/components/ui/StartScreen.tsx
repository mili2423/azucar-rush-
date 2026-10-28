'use client';

import React from 'react';
import { GameProgress } from '@/types/game';
import { Play, BookOpen, Info, Star, Trophy, Sparkles, ShoppingBag, Volume2, VolumeX, ChefHat } from 'lucide-react';

interface StartScreenProps {
  progress: GameProgress;
  onPlay: () => void;
  onOpenTutorial: () => void;
  onOpenHowToPlay: () => void;
  onOpenCredits: () => void;
  onOpenShop: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  progress,
  onPlay,
  onOpenTutorial,
  onOpenHowToPlay,
  onOpenCredits,
  onOpenShop,
  isMuted,
  onToggleMute,
}) => {
  const totalStars = Object.values(progress.starsPerLevel).reduce((acc, s) => acc + s, 0);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-x-hidden select-none py-3 sm:py-5 px-4 sm:px-6"
      style={{
        background: 'linear-gradient(145deg, #fff1f2 0%, #fdf4ff 22%, #eff6ff 48%, #f0fdf4 72%, #fefce8 100%)',
      }}
    >
      {/* ============================================================== */}
      {/* 1. DECORACIONES DE FONDO                                        */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-16 -left-16 w-[280px] h-[280px] sm:w-[520px] sm:h-[520px] rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, #f472b6 0%, #ec4899 50%, transparent 75%)' }}
        />
        <div
          className="absolute -top-12 -right-12 w-[260px] h-[260px] sm:w-[480px] sm:h-[480px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #c084fc 0%, #a855f7 50%, transparent 75%)' }}
        />
        <div
          className="absolute -bottom-16 -left-12 w-[260px] h-[260px] sm:w-[450px] sm:h-[450px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, #0284c7 50%, transparent 75%)' }}
        />
        <div
          className="absolute -bottom-12 -right-12 w-[270px] h-[270px] sm:w-[460px] sm:h-[460px] rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, #fde047 0%, #f59e0b 50%, transparent 75%)' }}
        />

        {/* Golosinas flotantes sutiles */}
        <div className="hidden sm:block absolute top-[12%] left-[7%] text-4xl sm:text-5xl opacity-80 drop-shadow-md animate-bounce" style={{ animationDuration: '4s' }}>🧁</div>
        <div className="hidden sm:block absolute top-[16%] right-[8%] text-4xl sm:text-5xl opacity-85 drop-shadow-md animate-bounce" style={{ animationDuration: '5s' }}>🍩</div>
        <div className="hidden md:block absolute top-[52%] left-[5%] text-3xl sm:text-4xl opacity-75 drop-shadow-md">🍬</div>
        <div className="hidden md:block absolute top-[50%] right-[6%] text-3xl sm:text-4xl opacity-80 drop-shadow-md">🍓</div>
        <div className="hidden lg:block absolute bottom-[18%] left-[9%] text-3xl opacity-75 drop-shadow-md">🍪</div>
      </div>

      {/* ============================================================== */}
      {/* 2. HEADER SUPERIOR                                              */}
      {/* ============================================================== */}
      <header className="relative w-full max-w-5xl flex items-center justify-between z-20 px-2 sm:px-4 shrink-0">
        {/* Esquina superior izquierda: ÍCONO DEL GORRO DE CHEF (rosa-violeta) */}
        <div
          className="flex items-center gap-2 p-1 transition-transform hover:scale-105 active:scale-95 cursor-default"
          title="Pastelería Azúcar Rush"
        >
          <div
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl border-2 sm:border-[2.5px] border-white shadow-md flex items-center justify-center transition-transform hover:rotate-6"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #9333ea 100%)',
              boxShadow: '0 6px 16px rgba(219,39,119,0.35)',
            }}
          >
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Esquina superior derecha: Botón de Audio */}
        <button
          onClick={onToggleMute}
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white/90 border-2 border-amber-300 shadow-md transition-all hover:bg-amber-50 hover:scale-105 active:scale-95"
          title={isMuted ? 'Activar Sonido' : 'Silenciar'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-stone-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-amber-600" />
          )}
        </button>
      </header>

      {/* ============================================================== */}
      {/* 3. HERO CENTRAL                                                 */}
      {/* ============================================================== */}
      <main className="relative flex flex-col items-center text-center w-full max-w-md sm:max-w-lg z-10 px-2 sm:px-4 my-auto py-2">

        {/* Centro: LOGO DE LA TÉCNICA (logoNav.jpg) con marco redondeado, borde blanco, sombra suave y estrella */}
        <div className="relative mb-3 sm:mb-4 group cursor-default">
          <div
            className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-[28px] sm:rounded-[34px] border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center transition-transform hover:rotate-3 hover:scale-105 bg-blue-900"
            style={{
              boxShadow: '0 12px 28px rgba(30, 58, 138, 0.35)',
            }}
          >
            <img
              src="./img/logoNav.jpg"
              alt="Instituto Técnico La Falda - ITLF"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-2.5 -right-2.5 text-2xl sm:text-3xl animate-spin-slow pointer-events-none select-none">
            ✨
          </div>
        </div>

        {/* Título fluido con tipografía de alto impacto y efecto 3D */}
        <div className="mb-2 sm:mb-3">
          <h1
            className="font-black tracking-tight leading-none"
            style={{
              fontSize: 'clamp(3.5rem, 11vw, 6.5rem)',
              background: 'linear-gradient(180deg, #f43f5e 0%, #e11d48 45%, #be123c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 3.5px 0 #451a03) drop-shadow(0 8px 14px rgba(69,26,3,0.35))',
            }}
          >
            Azúcar
          </h1>
          <h1
            className="font-black tracking-tight leading-none -mt-1 sm:-mt-2"
            style={{
              fontSize: 'clamp(3.5rem, 11vw, 6.5rem)',
              background: 'linear-gradient(180deg, #fde047 0%, #f59e0b 50%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 3.5px 0 #451a03) drop-shadow(0 8px 14px rgba(69,26,3,0.35))',
            }}
          >
            Rush
          </h1>
        </div>

        {/* Subtítulo proporcionalmente agrandado */}
        <p className="text-sm sm:text-base font-extrabold text-amber-950/85 mb-3 sm:mb-5 max-w-sm sm:max-w-md leading-snug px-2">
          Hornea a toda velocidad, decora con estilo golosinero y deslumbra al pueblo entero.
        </p>

        {/* Badge de progreso si ya avanzó */}
        {(progress.unlockedLevel > 1 || totalStars > 0) && (
          <div className="flex items-center gap-3 sm:gap-4 bg-white/95 border-2 border-amber-300 px-4 sm:px-5 py-2 rounded-2xl shadow-lg mb-3 sm:mb-4 animate-scale-in">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-purple-900">
              <Trophy className="w-4 h-4 text-purple-600" />
              <span>Día {progress.unlockedLevel} / 5</span>
            </div>
            <div className="h-4 w-0.5 bg-amber-200" />
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{totalStars} Estrellas</span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* BOTONERA AGRANDADA CON ESPACIADO PROPORCIONAL                 */}
        {/* ============================================================ */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5 w-full max-w-xs sm:max-w-sm">

          {/* Botón ¡JUGAR AHORA! */}
          <button
            onClick={onPlay}
            className="relative group w-full py-4 sm:py-4.5 px-6 rounded-3xl font-black text-xl sm:text-2xl text-white transition-all overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 40%, #d946ef 100%)',
              border: '3.5px solid #fef08a',
              boxShadow: '0 6px 0 #831843, 0 12px 24px rgba(219,39,119,0.4)',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(4px)';
              e.currentTarget.style.boxShadow = '0 2px 0 #831843, 0 6px 12px rgba(219,39,119,0.4)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 0 #831843, 0 12px 24px rgba(219,39,119,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 0 #831843, 0 12px 24px rgba(219,39,119,0.4)';
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 rounded-t-2xl pointer-events-none" />
            <div className="relative flex items-center justify-center gap-3 drop-shadow-md">
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
              </span>
              <span className="tracking-wide">
                {progress.unlockedLevel > 1 ? `Continuar Día ${progress.unlockedLevel}` : '¡JUGAR AHORA!'}
              </span>
            </div>
          </button>

          {/* Tutorial + Tienda de Mejoras */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <button
              onClick={onOpenTutorial}
              className="flex items-center justify-center gap-2 py-3 sm:py-3.5 px-3 rounded-2xl font-black text-xs sm:text-sm bg-purple-50 hover:bg-purple-100/90 active:bg-purple-200 border-2 border-purple-300 text-purple-900 shadow-sm transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-600 shrink-0" />
              <span className="truncate">Tutorial</span>
            </button>

            <button
              onClick={onOpenShop}
              className="flex items-center justify-center gap-2 py-3 sm:py-3.5 px-3 rounded-2xl font-black text-xs sm:text-sm bg-amber-50 hover:bg-amber-100/90 active:bg-amber-200 border-2 border-amber-300 text-amber-900 shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 shrink-0" />
              <span className="truncate">Mejoras</span>
            </button>
          </div>

          {/* Cómo Jugar & Recetas */}
          <button
            onClick={onOpenHowToPlay}
            className="flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-sky-50 hover:bg-sky-100/90 active:bg-sky-200 border-2 border-sky-300 text-sky-900 shadow-sm transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-sky-600 shrink-0" />
            <span>Cómo Jugar &amp; Recetas</span>
          </button>

          {/* Créditos del Proyecto */}
          <button
            onClick={onOpenCredits}
            className="flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm text-stone-600 hover:text-pink-600 hover:bg-pink-50/70 active:bg-pink-100 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>Créditos del Proyecto</span>
          </button>
        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. FOOTER                                                       */}
      {/* ============================================================== */}
      <footer className="relative flex flex-col items-center gap-1 text-center pb-2 z-20 px-4 shrink-0">
        <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-700 bg-white/80 backdrop-blur-md px-3 sm:px-4 py-1 rounded-full border border-pink-200 shadow-2xs">
          <span>Proyecto realizado en</span>
          <span className="text-pink-700 font-black">Instituto Técnico La Falda (ITLF)</span>
        </div>
      </footer>
    </div>
  );
};
