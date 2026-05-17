import React from 'react';

import { Rune } from '../constants/runes';

import { motion, AnimatePresence } from 'motion/react';



interface DiceProps {

  rune: Rune | null;

  rolling: boolean;

  label: string;

}



export default function Dice({ rune, rolling, label }: DiceProps) {

  return (

    <div className="flex flex-col items-center gap-2">

      <span className="text-stone-500 uppercase text-[10px] tracking-widest font-mono">{label}</span>

      <div className="relative w-16 h-16 bg-stone-100 rounded-xl shadow-lg flex items-center justify-center border-b-4 border-stone-300 overflow-hidden">

        <AnimatePresence mode="wait">

          {rolling ? (

            <motion.div key="rolling" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="text-stone-300 text-3xl font-serif select-none">ᚠᚢᚦ</motion.div>

          ) : (

            <motion.div key={rune?.id || 'empty'} initial={{ y: 20, opacity: 0, rotate: -15 }} animate={{ y: 0, opacity: 1, rotate: 0 }} className="text-stone-800 text-4xl font-serif select-none">{rune?.char || '?'}</motion.div>

          )}

        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 h-1 bg-stone-200" />

        <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-stone-300" />

        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-stone-300" />

      </div>

    </div>

  );

}
