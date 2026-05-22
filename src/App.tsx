import React, { useState, useEffect } from 'react';

import GameBoard from './components/GameBoard';

import Dice from './components/Dice';

import { RUNES, Rune } from './constants/runes';

import { GameStage, GameState, PlayerColor } from './types';

import { motion, AnimatePresence } from 'motion/react';

import { Bird } from 'lucide-react';

import { WORLD_QUOTES } from './constants/quotes';
import { div } from 'motion/react-m';



const SHUFFLED_OUTER = [...RUNES].sort(() => 0.5 - Math.random());

const SHUFFLED_INNER = [...RUNES].sort(() => 0.5 - Math.random());

const MIDDLE_PAIRS = Array.from({ length: 12 }, (_, i) => [

  RUNES[i % 12],

  RUNES[(i + 7) % 12],

]);


const INTRO_SLIDES = [
  {
    title: "Привет, читатель!",
    text: [
    "Поздравляю тебя! Ты нашел пасхалку, и я безумно этому рад! Сейчас объясню, что это вообще такое.",
    "Я - someonenowhere, фикрайтер по фандому 'Импровизаторы' и профессиональный эскапист, который любит убегать от реальности.",
    "А теперь, видимо, еще и кодер. Как так вышло?",
    "Мне всегда было катастрофически мало контента по любимому пейрингу. И я решил однажды, что хочу попробовать внести свою лепту в разнообразие артов, фанфиков и прочих атрибутов импрофандома."
    ]
  },
  {
    title: "Зимородок",
    text: [
      "Есть ли у меня опыт в писательстве? Разве только огромная начитанность в рамках фандома и за его пределами.",
      "И много лет я писал работы в стол. Но однажды решился показать свои тексты, и ни на секунду об этом не пожалел.",
      "Ваш фидбек, комментарии и сообщения делают меня невероятно счастливым, и я бесконечно благодарен каждому, кто нашел время почитать мои фантазии.",
      "И теперь я взялся за свой первый макси. Но просто писать текст мне оказалось недостаточно. И я полез изучать JavaScript и Python.",
      "Потому что мне всегда недоставало интерактива в работах. И я решил создать вот такой бонус."
    ]
  },
  {
    title: "Кругоявь",
    text: [
      "Это - визуализация настолки, которая пришла мне в голову после пересмотра 'Тейбл Тайм' и чтения народных сказок вдогонку.",
      "Игра состоит из двух раундов. В первом два игрока по очереди закрывают поля на кольцах Нави и Прави (внешнее и внутреннее кольца), а во втором бросают комбинации рун на среднем кольце Яви, перемещая фишки с внешнего и внутреннего колец, выстраивая таким образом 'координаты' для перемещения в параллельную реальность.",
      "Повторюсь: я - новичок, и онлайн-версия игры вышла маленькой, кринжовенькой и не без багов.",
      "НО ОНА ВЫШЛА! И я невероятно этим горжусь.",
      "Я хочу продолжать делать работу 'Зимородок' интерактивной и насыщенной дополнительным контентов, поэтому буду безумно рад любым вашим идеям, критике и просто словам поддержки.",
      "Приятного чтения и игры!",
      "someonenowhere"
    ]
  }
];

export default function App() {

// Начальное состояние для контроля слайдов (0 — первый слайд, 3 — игра началась)
  const [introStep, setIntroStep] = useState<number>(0);
  const [outerRunes, setOuterRunes] = useState<Rune[]>(() => [...RUNES].sort(() => 0.5 - Math.random()));
  const [innerRunes, setInnerRunes] = useState<Rune[]>(() => [...RUNES].sort(() => 0.5 - Math.random()));

// ... (остальные стейты игры)

// Обновленная функция перезапуска (перезапускает саму игру, но сохраняет introStep = 3)
  const resetGame = () => {

    setState({

      stage: GameStage.Setup,

      playerColor: null,

      turn: 'black',

      outerChips: Array(12).fill(null),

      innerChips: Array(12).fill(null),

      middleChips: Array(12).fill(null),

      lastRoll: { player: [], ai: [] },

      isRolling: false,

      message: 'Добро пожаловать в Древние Руны. Выберите свой путь.',

      failedRolls: { black: 0, white: 0 }

    });
    setEndQuote('');

    setOuterRunes([...RUNES].sort(() => 0.5 - Math.random()));

    setInnerRunes([...RUNES].sort(() => 0.5 - Math.random()));
// introStep НЕ сбрасывается обратно в 0, чтобы слайды не появлялись повторно!
};
  const [state, setState] = useState<GameState>({

    stage: GameStage.Setup,

    playerColor: null,

    turn: 'black',

    outerChips: Array(12).fill(null),

    innerChips: Array(12).fill(null),

    middleChips: Array(12).fill(null),

    lastRoll: { player: [], ai: [] },

    isRolling: false,

    message: '',

    failedRolls: { black: 0, white: 0 }

  });



  const [endQuote, setEndQuote] = useState<string>('');



  const aiColor: PlayerColor | null = state.playerColor === 'black' ? 'white' : 'black';



  const selectColor = (color: PlayerColor) => {

    setState(prev => ({

      ...prev,

      playerColor: color,

      stage: GameStage.Round1,

      message: 'Раунд 1: Бросайте кости, чтобы занять руны!'

    }));

  };



  const rollDiceRound1 = () => {

    if (state.isRolling) return;

    setState(prev => ({ ...prev, isRolling: true }));



    setTimeout(() => {

      let playerRune: Rune, aiRune: Rune;

      const getValidRoll = (color: PlayerColor) => {

        const ring = color === 'black' ? state.outerChips : state.innerChips;

        const ringRunes = color === 'black' ? SHUFFLED_OUTER : SHUFFLED_INNER;

        const available = RUNES.filter(r => {

          const index = ringRunes.findIndex(br => br.id === r.id);

          return ring[index] === null;

        });

        return available[Math.floor(Math.random() * available.length)];

      };



      playerRune = getValidRoll(state.playerColor!);

      aiRune = getValidRoll(aiColor!);



      const newOuter = [...state.outerChips];

      const newInner = [...state.innerChips];



      const pIndex = (state.playerColor === 'black' ? SHUFFLED_OUTER : SHUFFLED_INNER).findIndex(r => r.id === playerRune.id);

      if (state.playerColor === 'black') newOuter[pIndex] = 'black';

      else newInner[pIndex] = 'white';



      const aIndex = (aiColor === 'black' ? SHUFFLED_OUTER : SHUFFLED_INNER).findIndex(r => r.id === aiRune.id);

      if (aiColor === 'black') newOuter[aIndex] = 'black';

      else newInner[aIndex] = 'white';



      const isRound1Finished = newOuter.every(c => c !== null) && newInner.every(c => c !== null);



      setState(prev => ({

        ...prev,

        isRolling: false,

        outerChips: newOuter,

        innerChips: newInner,

        lastRoll: { player: [playerRune], ai: [aiRune] },

        stage: isRound1Finished ? GameStage.Round2 : GameStage.Round1,

        message: isRound1Finished ? 'Раунд 2: Собирайте пары на среднем кольце!' : 'Руна занята. Бросайте снова.',

        turn: 'black'

      }));

    }, 800);

  };



  const rollDiceRound2 = () => {

    if (state.isRolling || state.stage !== GameStage.Round2) return;

    setState(prev => ({ ...prev, isRolling: true }));



    setTimeout(() => {

      const r1 = RUNES[Math.floor(Math.random() * 12)];

      const r2 = RUNES[Math.floor(Math.random() * 12)];

      const currentPlayer = state.turn;

      

      let middleIndex = MIDDLE_PAIRS.findIndex(pair => 

        (pair[0].id === r1.id && pair[1].id === r2.id) || 

        (pair[0].id === r2.id && pair[1].id === r1.id)

      );



      const nextOuter = [...state.outerChips];

      const nextInner = [...state.innerChips];

      const nextMiddle = [...state.middleChips];

      let finalRoll = [r1, r2];

      let finalMiddleIndex = middleIndex;

      const currentFailed = state.failedRolls[currentPlayer];



      if ((middleIndex === -1 || nextMiddle[middleIndex] !== null) && currentFailed >= 3) {

        const availableIndices = nextMiddle.map((c, i) => c === null ? i : -1).filter(i => i !== -1);

        if (availableIndices.length > 0) {

          finalMiddleIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

          finalRoll = MIDDLE_PAIRS[finalMiddleIndex];

        }

      }



      let newMessage = `${currentPlayer === state.playerColor ? 'Вы' : 'Птица'} : ${finalRoll[0].char}${finalRoll[1].char}. `;

      let success = false;



      if (finalMiddleIndex !== -1 && nextMiddle[finalMiddleIndex] === null) {

        const myRing = currentPlayer === 'black' ? nextOuter : nextInner;

        let nearestIdx = -1;

        let minDist = 13;

        for (let i = 0; i < 12; i++) {

          if (myRing[i] === currentPlayer) {

            const dist = Math.min(Math.abs(i - finalMiddleIndex), 12 - Math.abs(i - finalMiddleIndex));

            if (dist < minDist) {

              minDist = dist;

              nearestIdx = i;

            }

          }

        }



        if (nearestIdx !== -1) {

          myRing[nearestIdx] = null;

          nextMiddle[finalMiddleIndex] = currentPlayer;

          newMessage += `Успех! Фишка перемещена.`;

          success = true;

        } else {

          newMessage += `Нет фишек для перемещения.`;

        }

      } else {

        newMessage += `Нет подходящей пары. Ход переходит.`;

      }



      const isFinished = nextMiddle.every(c => c !== null);

      if (isFinished) {

        setEndQuote(WORLD_QUOTES[Math.floor(Math.random() * WORLD_QUOTES.length)]);

      }



      setState(prev => ({

        ...prev,

        isRolling: false,

        outerChips: nextOuter,

        innerChips: nextInner,

        middleChips: nextMiddle,

        failedRolls: {

          ...prev.failedRolls,

          [currentPlayer]: success ? prev.failedRolls[currentPlayer] : prev.failedRolls[currentPlayer] + 1

        },

        lastRoll: { 

          player: currentPlayer === state.playerColor ? finalRoll : prev.lastRoll.player,

          ai: currentPlayer === aiColor ? finalRoll : prev.lastRoll.ai

        },

        turn: currentPlayer === 'black' ? 'white' : 'black',

        message: newMessage,

        stage: isFinished ? GameStage.Finished : GameStage.Round2

      }));

    }, 800);

  };



  useEffect(() => {

    if (state.stage === GameStage.Round2 && state.turn === aiColor && !state.isRolling) {

      const timer = setTimeout(() => rollDiceRound2(), 1500);

      return () => clearTimeout(timer);

    }

  }, [state.stage, state.turn, state.isRolling]);



  return (

    <div className="min-h-screen bg-[#1a0a05] flex flex-col items-center justify-center font-serif text-stone-200 p-4">

      {/* Слайды Вступления */}

      <AnimatePresence>

        {introStep < 3 && (

          <motion.div

            initial={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{ duration: 0.8 }}

            onClick={() => setIntroStep(prev => prev + 1)}

            className="fixed inset-0 z-[200] bg-[#120603] flex flex-col items-center justify-center p-6 md:p-12 text-center cursor-pointer select-none overflow-hidden"
          >
            {/* Огибающие магические орбиты на заднем фоне */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
             
              <div className="w-[600px] h-[600px] border border-amber-500/35 rounded-full animate-[spin_120s_linear_infinite]" />
             
              <div className="absolute w-[400px] h-[400px] border border-amber-600/20 rounded-full animate-[spin_80s_linear_infinite_reverse]" />
           
            </div>


            <div className="max-w-2xl w-full flex flex-col items-center relative z-10 min-h-[450px] justify-between py-8">
             
              <div className="w-full flex-1 flex flex-col justify-center items-center">
              
                <AnimatePresence mode="wait">
                 
                  <motion.div
                 
                    key={introStep}
                   
                    initial={{ opacity: 0, y: 30 }}
                  
                    animate={{ opacity: 1, y: 0 }}
                  
                    exit={{ opacity: 0, y: -30 }}
                  
                    transition={{ duration: 0.8, ease: "easeOut" }}
                 
                    className="flex flex-col items-center"
                 
                  >
                 
                    <h2 className="text-3xl md:text-5xl font-bold text-[#d4af37] tracking-[0.2em] uppercase font-serif mb-8 drop-shadow-[0_0_12px_rgba(212,175,55,0.3)]">
                  
                    {INTRO_SLIDES[introStep].title}
                 
                    </h2>


                    <div className="space-y-4 md:space-y-6 max-w-xl text-stone-300 font-serif leading-relaxed text-base md:text-lg italic opacity-90">
 
  {INTRO_SLIDES[introStep].text.map((sentence, idx) => (
                    
                        <p key={idx}>{sentence}</p>
                  
                      ))}

                    </div>

                  </motion.div>

                </AnimatePresence>

              </div>


              <div className="mt-8 flex flex-col items-center gap-4">

                {/* Пагинация (точки) */}

                <div className="flex gap-2">

                  {INTRO_SLIDES.map((_, idx) => (

                    <div

                      key={idx}

                      className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === introStep ? 'bg-[#d4af37] scale-125' : 'bg-stone-700'}`}
                   
                    />

                  ))}

                </div>


                {/* Мерцающая подсказка к действию */}

                <motion.span

                  animate={{ opacity: [0.3, 1, 0.3] }}

                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}

                  className="text-amber-500/40 text-xs tracking-widest uppercase font-sans mt-2"

                >

                  Кликните в любом месте экрана для продолжения

                </motion.span>

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>


      {/* Основной заголовок игры */}

      <header className="mb-6 text-center">

        {/* ... */}

      </header>

      <header className="mb-6 text-center">

        <h1 className="text-4xl font-extrabold tracking-widest uppercase text-[#d4af37] drop-shadow-lg">

          Кругоявь

        </h1>

        <div className="h-6 mt-2">

          <AnimatePresence mode="wait">

             <motion.p key={state.message} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-stone-400 italic text-base">

                {state.message}

             </motion.p>

          </AnimatePresence>

        </div>

      </header>



      <AnimatePresence>

        {state.stage === GameStage.Finished && (

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }} className="fixed inset-0 z-[100] bg-amber-500/30 backdrop-blur-sm pointer-events-none" />

        )}

        {state.stage === GameStage.Finished && (

          <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.5 }} className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-8 text-center bg-[#1a0a05]/95 overflow-y-auto">

            <div className="max-w-sm w-full flex flex-col items-center">

              <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="mb-8 opacity-40 text-amber-500"><Bird size={80} strokeWidth={1} /></motion.div>

              <motion.h2 initial={{ letterSpacing: "0.1em", opacity: 0 }} animate={{ letterSpacing: "0.4em", opacity: 1 }} transition={{ duration: 2, delay: 2 }} className="text-4xl font-bold text-amber-500 mb-8 uppercase font-serif drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Прыжок в параллельную Вселенную завершен</motion.h2>


              <div className="relative p-8 border-y border-amber-600/30">

                <p className="text-xl md:text-2xl text-stone-200 italic leading-relaxed font-serif">"{endQuote}"</p>

              </div>

              <button onClick={() => window.location.reload()} className="mt-12 px-10 py-4 bg-amber-800/20 hover:bg-amber-700/40 text-amber-500 rounded-full font-bold uppercase tracking-widest border border-amber-600/50 transition-all active:scale-95 cursor-pointer">Начать заново</button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">

        <aside className="hidden lg:flex flex-col gap-4 w-48 text-right">

          <div className="p-4 bg-stone-900/40 rounded-2xl border-r-2 border-white/10">

            <h3 className="text-stone-500 uppercase text-[10px] tracking-widest mb-4">Птица (Белые)</h3>

            <div className="flex flex-wrap gap-2 justify-end">

              {Array.from({ length: 12 - (state.innerChips.filter(c => c === 'white').length + state.middleChips.filter(c => c === 'white').length) }).map((_, i) => (

                <div key={i} className="w-4 h-4 rounded-full bg-stone-200 shadow-sm opacity-50" />

              ))}

            </div>

            <p className="mt-4 text-2xl font-bold text-stone-300">{12 - (state.innerChips.filter(c => c === 'white').length + state.middleChips.filter(c => c === 'white').length)}</p>

            <span className="text-[10px] text-stone-600 uppercase tracking-tighter">Осталось фишек</span>

          </div>

        </aside>



        <main className="flex flex-col gap-8 items-center">

          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">

             <div className="flex flex-col gap-6 w-64 items-center order-2 lg:order-1">

                {state.stage === GameStage.Setup && (

                  <div className="flex flex-col items-center gap-4 bg-stone-900/50 p-6 rounded-2xl border border-stone-800">

                    <span className="text-xs tracking-widest uppercase text-stone-500">Выберите цвет</span>

                    <div className="flex gap-4">

                      <button onClick={() => selectColor('black')} className="w-12 h-12 rounded-full bg-stone-900 border-2 border-stone-600 hover:scale-110 transition-transform shadow-xl cursor-pointer" />

                      <button onClick={() => selectColor('white')} className="w-12 h-12 rounded-full bg-stone-100 border-2 border-stone-400 hover:scale-110 transition-transform shadow-xl cursor-pointer" />

                    </div>

                  </div>

                )}

                {(state.stage === GameStage.Round1 || state.stage === GameStage.Round2) && (

                  <div className="flex flex-col gap-4 w-full">

                    <div onClick={() => !state.isRolling && state.turn === state.playerColor && (state.stage === GameStage.Round1 ? rollDiceRound1() : rollDiceRound2())} className={`bg-stone-900/30 p-4 rounded-xl border border-stone-800 transition-all ${!state.isRolling && state.turn === state.playerColor ? 'cursor-pointer hover:bg-stone-800/50 hover:border-stone-700' : ''}`}>

                      <div className="flex justify-center gap-2">

                        <Dice label="Игрок" rune={state.lastRoll.player[0] || null} rolling={state.isRolling && (state.stage === GameStage.Round1 || state.turn === state.playerColor)} />

                        {state.stage === GameStage.Round2 && state.lastRoll.player[1] && <Dice label="" rune={state.lastRoll.player[1]} rolling={state.isRolling && state.turn === state.playerColor} />}

                      </div>

                    </div>

                    <div className="bg-stone-900/30 p-4 rounded-xl border border-stone-800 opacity-80">

                      <div className="flex justify-center gap-2">

                        <Dice label="Птица" rune={state.lastRoll.ai[0] || null} rolling={state.isRolling && (state.stage === GameStage.Round1 || state.turn === aiColor)} />

                        {state.stage === GameStage.Round2 && state.lastRoll.ai[1] && <Dice label="" rune={state.lastRoll.ai[1]} rolling={state.isRolling && state.turn === aiColor} />}

                      </div>

                    </div>

                    <button disabled={state.isRolling || (state.stage === GameStage.Round2 && state.turn !== state.playerColor) || state.stage === GameStage.Finished} onClick={state.stage === GameStage.Round1 ? rollDiceRound1 : rollDiceRound2} className="w-full py-3 bg-[#8b4513] hover:bg-[#a0522d] disabled:bg-stone-800 disabled:text-stone-600 rounded-lg font-bold uppercase tracking-widest text-[#d4af37] shadow-lg border-b-4 border-[#3e1a0d] active:border-b-0 active:translate-y-1 transition-all">

                      {state.stage === GameStage.Round1 ? 'Бросок' : (state.turn === state.playerColor ? 'Ваш ход' : 'Птица думает')}

                    </button>

                  </div>

                )}

              </div>

              <GameBoard outerChips={state.outerChips} innerChips={state.innerChips} middleChips={state.middleChips} outerRunes={SHUFFLED_OUTER} innerRunes={SHUFFLED_INNER} middlePairs={MIDDLE_PAIRS} isFinished={state.stage === GameStage.Finished} />

          </div>

        </main>



        <aside className="hidden lg:flex flex-col gap-4 w-48 text-left">

          <div className="p-4 bg-stone-900/40 rounded-2xl border-l-2 border-[#d4af37]/20">

            <h3 className="text-stone-500 uppercase text-[10px] tracking-widest mb-4">Игрок (Черные)</h3>

            <div className="flex flex-wrap gap-2 justify-start">

              {Array.from({ length: 12 - (state.outerChips.filter(c => c === 'black').length + state.middleChips.filter(c => c === 'black').length) }).map((_, i) => (

                <div key={i} className="w-4 h-4 rounded-full bg-stone-900 shadow-sm border border-stone-800 opacity-50" />

              ))}

            </div>

            <p className="mt-4 text-2xl font-bold text-[#d4af37]">{12 - (state.outerChips.filter(c => c === 'black').length + state.middleChips.filter(c => c === 'black').length)}</p>

            <span className="text-[10px] text-stone-600 uppercase tracking-tighter">Осталось фишек</span>

          </div>

        </aside>

      </div>



      <footer className="mt-8 text-stone-700 text-[15px] tracking-widest uppercase flex gap-4 opacity-50">

        <span>Раунд 1: Сбор карты</span>

        <span>Раунд 2: Комбинации</span>

      </footer>

    </div>

  );

}
