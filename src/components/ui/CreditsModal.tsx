'use client';

import React from 'react';
import { CandyModal, CandyButton, CandyCard } from '@/components/ui/design-system';
import { Palette, Code2, Volume2, Sparkles, Award } from 'lucide-react';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  const NOMBRE_INSTITUTO = 'Instituto Técnico La Falda (ITLF)';

  return (
    <CandyModal
      isOpen
      onClose={onClose}
      title="Azúcar Rush"
      subtitle="Pastelería en primera persona — Proyecto educativo del ITLF"
      icon={<div className="text-3xl animate-bounce">🧁</div>}
      maxWidth="md"
      footer={
        <CandyButton variant="primary" size="md" fullWidth onClick={onClose}>
          Cerrar Créditos
        </CandyButton>
      }
    >
      <div className="space-y-4">
        {/* ============================================================ */}
        {/* CRÉDITO PRINCIPAL DEL PROYECTO (Milagros Jaime-2026-7mo)     */}
        {/* ============================================================ */}
        <div
          className="relative overflow-hidden rounded-2xl p-4 sm:p-5 text-center border-2 border-pink-300 shadow-md transition-transform hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #fdf4ff 50%, #eff6ff 100%)',
          }}
        >
          <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 rounded-b-full pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[11px] font-black uppercase tracking-wider mb-1.5 border border-pink-200">
            <Award className="w-3.5 h-3.5 text-pink-600" />
            <span>Desarrollo &amp; Creación</span>
          </div>

          <div
            className="text-2xl sm:text-3xl font-black text-[#451a03] tracking-tight drop-shadow-xs"
            style={{
              textShadow: '0 2px 0 #fbcfe8',
            }}
          >
            Milagros Jaime-2026-7mo
          </div>

          <p className="text-xs font-bold text-amber-950/70 mt-1">
            Proyecto Final Azúcar Rush — Especialidad Informática
          </p>
        </div>

        {/* ============================================================ */}
        {/* SECCIÓN DEL INSTITUTO TÉCNICO LA FALDA                       */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-md transition-transform hover:scale-[1.02]"
            title={NOMBRE_INSTITUTO}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/60 bg-blue-900 shrink-0 flex items-center justify-center">
              <img
                src="./img/logoNav.jpg"
                alt={NOMBRE_INSTITUTO}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">
                Proyecto realizado en
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                {NOMBRE_INSTITUTO}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TARJETAS TÉCNICAS E INFORMATIVAS                            */}
        {/* ============================================================ */}
        <CandyCard variant="cream" className="p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <Palette className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-xs text-[#451a03]">Concepto &amp; Jugabilidad:</div>
              <div className="text-xs text-stone-600 mt-0.5 leading-snug">
                Pastelería interactiva en primera persona combinando rapidez de gestión y recetas de pastelería en un entorno 3D pastel.
              </div>
            </div>
          </div>

          <div className="h-px bg-pink-100" />

          <div className="flex items-start gap-2.5">
            <Code2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-xs text-[#451a03]">Tecnologías &amp; Motor 3D:</div>
              <div className="text-xs text-stone-600 mt-0.5 leading-snug">
                Next.js 14, React 18, Three.js, React Three Fiber, Electron y Tailwind CSS.
              </div>
            </div>
          </div>

          <div className="h-px bg-pink-100" />

          <div className="flex items-start gap-2.5">
            <Volume2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-xs text-[#451a03]">Efectos de Sonido &amp; Música:</div>
              <div className="text-xs text-stone-600 mt-0.5 leading-snug">
                Sintetizador Web Audio API procedural y retro-campana en tiempo real.
              </div>
            </div>
          </div>
        </CandyCard>
      </div>
    </CandyModal>
  );
};
