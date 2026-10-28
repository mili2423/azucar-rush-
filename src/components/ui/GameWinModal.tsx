'use client';

import React, { useEffect, useRef } from 'react';
import { Trophy, Sparkles, Home, Star, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CandyButton, CandyCard, CandyBadge } from '@/components/ui/design-system';
import { sounds } from '@/utils/audio';

interface GameWinModalProps {
  totalCoins: number;
  totalStars: number;
  onReturnHome: () => void;
}

export const GameWinModal: React.FC<GameWinModalProps> = ({
  totalCoins,
  totalStars,
  onReturnHome,
}) => {
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    sounds.playLevelWon();

    const burst = () => {
      try {
        confetti({
          particleCount: 50,
          spread: 85,
          origin: { y: 0.5, x: Math.random() },
          colors: ['#ec4899', '#f43f5e', '#fbbf24', '#a855f7', '#38bdf8', '#10b981'],
        });
      } catch (e) {}
    };

    // 3 ráfagas controladas (en vez de setInterval infinito)
    burst();
    const t1 = setTimeout(burst, 800);
    const t2 = setTimeout(burst, 1600);
    timeoutsRef.current.push(t1, t2);

    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-slate-950/65 backdrop-blur-md">
      <CandyCard
        variant="cream"
        className="relative flex flex-col items-center max-w-lg w-full p-8 sm:p-10 text-center shadow-2xl border-4 border-pink-300 animate-scale-in"
      >
        {/* Decoración superior gloss */}
        <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-pink-400 via-amber-300 to-purple-400 rounded-b-full pointer-events-none" />

        {/* Trofeo de Oro Grande */}
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
              boxShadow: '0 12px 30px rgba(245,158,11,0.45)',
            }}
          >
            <Trophy className="w-13 h-13 text-white drop-shadow-md" />
          </div>
          <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
        </div>

        {/* Insignia de Consagración */}
        <CandyBadge variant="accent" size="md" className="mb-2">
          ¡Apertura Histórica Completada!
        </CandyBadge>

        <h2 className="text-3xl sm:text-4xl font-black text-[#451a03] mb-2 tracking-tight">
          ¡Leyenda de Azúcar Rush!
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mb-6 font-semibold leading-relaxed max-w-sm">
          Has superado todos los pedidos, dominado el horno y cautivado a todo el pueblo. La Gran Apertura es un éxito inolvidable.
        </p>

        {/* Resumen Final de Logros */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6 text-left">
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-800 mb-1">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Ganancias Totales</span>
            </div>
            <div className="text-xl font-black text-[#451a03]">${totalCoins.toLocaleString()}</div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-purple-800 mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Estrellas</span>
            </div>
            <div className="text-xl font-black text-[#451a03]">{totalStars} / 15</div>
          </div>
        </div>

        {/* Botón de Regreso Triunfal */}
        <CandyButton
          variant="primary"
          size="lg"
          fullWidth
          icon={<Home className="w-5 h-5 mr-1" />}
          onClick={onReturnHome}
        >
          Volver al Menú Principal
        </CandyButton>
      </CandyCard>
    </div>
  );
};
