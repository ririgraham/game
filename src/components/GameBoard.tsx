import React from 'react';

import { Bird } from 'lucide-react';

import { motion } from 'motion/react';

import { Rune } from '../constants/runes';

import { PlayerColor } from '../types';



interface GameBoardProps {

  outerChips: (PlayerColor | null)[];

  innerChips: (PlayerColor | null)[];

  middleChips: (PlayerColor | null)[];

  outerRunes: Rune[];

  innerRunes: Rune[];

  middlePairs: Rune[][];

  isFinished?: boolean;

}



export default function GameBoard({ 

  outerChips, innerChips, middleChips, outerRunes, innerRunes, middlePairs, isFinished 

}: GameBoardProps) {

  const size = 500;

  const center = size / 2;

  const outerRadius = 230;

  const middleRadius = 155;

  const innerRadius = 90;

  const hubRadius = 40;



  return (

    <div className="relative flex items-center justify-center p-4 bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-800">

      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")', backgroundColor: '#3e1a0d' }} />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10 drop-shadow-2xl">

        <defs>

          <radialGradient id="mahogany-grad" cx="50%" cy="50%" r="50%">

            <stop offset="0%" stopColor="#7c3a27" /><stop offset="70%" stopColor="#4a1c0f" /><stop offset="100%" stopColor="#2d1109" />

          </radialGradient>

          <radialGradient id="amber-glow-grad" cx="50%" cy="50%" r="50%">

            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" /><stop offset="50%" stopColor="rgba(180, 83, 9, 0.4)" /><stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />

          </radialGradient>

          <filter id="gold-glow"><feGaussianBlur stdDeviation="1" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>

          <filter id="chip-shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.5" /></filter>

        </defs>



        {isFinished && <motion.circle initial={{ r: 0, opacity: 0 }} animate={{ r: size, opacity: 1 }} transition={{ duration: 3, ease: "easeOut" }} cx={center} cy={center} fill="url(#amber-glow-grad)" />}



        <motion.g animate={isFinished ? { scale: 1.05, filter: "brightness(0.6) contrast(1.2)" } : {}} transition={{ duration: 2 }}>

          <circle cx={center} cy={center} r={outerRadius + 12} fill="#1a0a05" stroke="#3e1a0d" strokeWidth="4" />

          <circle cx={center} cy={center} r={outerRadius} fill="url(#mahogany-grad)" stroke="#b8860b" strokeWidth="3" />

          {Array.from({ length: 12 }).map((_, i) => {

            const angle = (i * 30);

            const x2 = center + outerRadius * Math.cos((angle * Math.PI) / 180);

            const y2 = center + outerRadius * Math.sin((angle * Math.PI) / 180);

            const x1 = center + hubRadius * Math.cos((angle * Math.PI) / 180);

            const y1 = center + hubRadius * Math.sin((angle * Math.PI) / 180);

            return (

              <motion.g key={i} animate={isFinished ? { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20, rotate: (Math.random() - 0.5) * 5 } : {}} transition={{ duration: 2, ease: "easeInOut" }}>

                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isFinished ? "#f59e0b" : "rgba(212, 175, 55, 0.2)"} strokeWidth={isFinished ? "3" : "1"} />

              </motion.g>

            );

          })}

          <circle cx={center} cy={center} r={middleRadius} fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1.5" />

          <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1.5" />

          <circle cx={center} cy={center} r={hubRadius} fill="rgba(0,0,0,0.5)" stroke="#d4af37" strokeWidth="2" />

        </motion.g>



        {Array.from({ length: 12 }).map((_, i) => {

          const baseAngle = (i * 30) + 15;

          const outerR = (outerRadius + middleRadius) / 2;

          const ox = center + outerR * Math.cos((baseAngle * Math.PI) / 180);

          const oy = center + outerR * Math.sin((baseAngle * Math.PI) / 180);

          const midR = (middleRadius + innerRadius) / 2;

          const m1x = center + midR * Math.cos(((baseAngle - 8) * Math.PI) / 180);

          const m1y = center + midR * Math.sin(((baseAngle - 8) * Math.PI) / 180);

          const m2x = center + midR * Math.cos(((baseAngle + 8) * Math.PI) / 180);

          const m2y = center + midR * Math.sin(((baseAngle + 8) * Math.PI) / 180);

          const innerR = (innerRadius + hubRadius) / 2;

          const ix = center + innerR * Math.cos((baseAngle * Math.PI) / 180);

          const iy = center + innerR * Math.sin((baseAngle * Math.PI) / 180);



          return (

            <g key={i}>

              <text x={ox} y={oy} fill="#d4af37" fontSize="18" textAnchor="middle" dominantBaseline="middle" className="select-none font-serif font-bold" style={{ filter: 'url(#gold-glow)' }} transform={`rotate(${baseAngle + 90}, ${ox}, ${oy})`}>{outerRunes[i].char}</text>

              <text x={m1x} y={m1y} fill="#d4af37" fontSize="14" textAnchor="middle" dominantBaseline="middle" className="select-none font-serif opacity-90" transform={`rotate(${baseAngle + 90}, ${m1x}, ${m1y})`}>{middlePairs[i][0].char}</text>

              <text x={m2x} y={m2y} fill="#d4af37" fontSize="14" textAnchor="middle" dominantBaseline="middle" className="select-none font-serif opacity-90" transform={`rotate(${baseAngle + 90}, ${m2x}, ${m2y})`}>{middlePairs[i][1].char}</text>

              <text x={ix} y={iy} fill="#d4af37" fontSize="16" textAnchor="middle" dominantBaseline="middle" className="select-none font-serif font-bold opacity-90" transform={`rotate(${baseAngle + 90}, ${ix}, ${iy})`}>{innerRunes[i].char}</text>

              {outerChips[i] && <motion.circle layoutId={`chip-outer-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} cx={ox} cy={oy} r="15" fill={outerChips[i] === 'black' ? '#111' : '#f0f0f0'} stroke={outerChips[i] === 'black' ? '#333' : '#ccc'} strokeWidth="2" style={{ filter: 'url(#chip-shadow)' }} />}

              {innerChips[i] && <motion.circle layoutId={`chip-inner-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} cx={ix} cy={iy} r="12" fill={innerChips[i] === 'black' ? '#111' : '#f0f0f0'} stroke={innerChips[i] === 'black' ? '#333' : '#ccc'} strokeWidth="2" style={{ filter: 'url(#chip-shadow)' }} />}

              {middleChips[i] && <motion.circle layoutId={`chip-middle-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} cx={(m1x + m2x) / 2} cy={(m1y + m2y) / 2} r="18" fill={middleChips[i] === 'black' ? '#111' : '#f0f0f0'} stroke={middleChips[i] === 'black' ? '#333' : '#ccc'} strokeWidth="3" style={{ filter: 'url(#chip-shadow)' }} />}

            </g>

          );

        })}



        <circle cx={center} cy={center} r={hubRadius - 5} fill="#0d1b2a" />

        <foreignObject x={center - 25} y={center - 25} width="50" height="50">

          <div className="w-full h-full flex items-center justify-center text-blue-400"><Bird size={32} strokeWidth={1} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" /></div>

        </foreignObject>

      </svg>

    </div>

  );

}
