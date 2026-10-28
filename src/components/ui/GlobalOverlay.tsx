'use client';

import React from 'react';

interface GlobalOverlayProps {
  /** Opcional: callback si se clickea el logo o si se quiere ocultar el logo de la esquina en alguna vista específica */
  hideLogo?: boolean;
}

export const GlobalOverlay: React.FC<GlobalOverlayProps> = ({ hideLogo = false }) => {
  return (
    <>
      {/* 1. LOGO DE LA TÉCNICA (logoNav.jpg) EN ESQUINA REUTILIZABLE (40-48 px) */}
      {!hideLogo && (
        <div
          className="fixed top-3 left-3 sm:top-3.5 sm:left-3.5 z-40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-default pointer-events-auto"
          title="Instituto Técnico La Falda (ITLF) - Azúcar Rush"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden border-[1.5px] border-white shadow-md bg-blue-900 flex items-center justify-center">
            <img
              src="./img/logoNav.jpg"
              alt="Logo ITLF"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* 2. COPYRIGHT CENTRADO ABAJO EN TODAS LAS PANTALLAS */}
      <div className="fixed bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none text-center px-4 w-full max-w-lg">
        <span
          className="text-[12px] sm:text-[13px] font-bold text-amber-950/70 tracking-wide inline-block"
          style={{
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.95), 0 0 6px rgba(255, 255, 255, 0.85)',
          }}
        >
          © Milagros Jaime-2026-7mo
        </span>
      </div>
    </>
  );
};

