import { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════
interface ExerciseRecord {
  name: string;
  setsCompleted: number;
  setsTotal: number;
  reps: string;
  notes?: string[];
}
interface WorkoutRecord {
  id: string;
  date: string;
  dayId: number;
  dayName: string;
  duration: number;
  completed: boolean;
  exercises: ExerciseRecord[];
  totalSets: number;
  completedSets: number;
}
interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  description: string;
  muscles: string;
  isTime?: boolean;
  duration?: number;
}
interface ExerciseGroup {
  name: string;
  icon: string;
  exercises: Exercise[];
}
interface WorkoutDay {
  id: number;
  label: string;
  subtitle: string;
  color: string;
  accent: string;
  icon: string;
  groups: ExerciseGroup[];
}

// ═══════════════════════════════════════════════════════
// DATA — scheda dal PDF
// ═══════════════════════════════════════════════════════
const days: WorkoutDay[] = [
  {
    id: 1,
    label: 'Lunedì',
    subtitle: 'Schiena · Lombari · Glutei',
    color: '#f9a8d4',
    accent: '#ec4899',
    icon: '🌸',
    groups: [
      {
        name: 'Riscaldamento',
        icon: '🌿',
        exercises: [
          {
            name: 'Marcia sul posto + braccia circolari',
            sets: 1,
            reps: '2 min',
            rest: 0,
            isTime: true,
            duration: 120,
            description: 'Scalda articolazioni e frequenza cardiaca.',
            muscles: 'Corpo intero',
          },
          {
            name: 'Rotazioni busto, anche, spalle',
            sets: 1,
            reps: '2 min',
            rest: 0,
            isTime: true,
            duration: 120,
            description: 'Mobilizza la colonna lentamente.',
            muscles: 'Mobilità',
          },
          {
            name: 'Cat-Cow a quattro zampe',
            sets: 1,
            reps: '1 min',
            rest: 0,
            isTime: true,
            duration: 60,
            description: 'Fletti ed estendi la schiena in modo dolce.',
            muscles: 'Colonna',
          },
          {
            name: 'Squat bodyweight lento',
            sets: 1,
            reps: '10',
            rest: 0,
            description: 'Lento e controllato, attiva gambe e glutei.',
            muscles: 'Gambe, glutei',
          },
          {
            name: 'Superman a terra',
            sets: 1,
            reps: '10',
            rest: 0,
            description:
              'Braccia avanti, solleva petto e gambe insieme — pre-attiva i lombari.',
            muscles: 'Lombari, glutei',
          },
        ],
      },
      {
        name: 'Schiena & Lombari',
        icon: '💪',
        exercises: [
          {
            name: 'Superman con peso',
            sets: 3,
            reps: '12',
            rest: 45,
            description:
              'A pancia in giù, manubrio leggero in mano. Solleva petto, braccia e gambe contemporaneamente, tieni 2 sec, abbassa lento. Contrai i glutei.',
            muscles:
              'Erettori spinali, gluteo grande, ischiocrurali, trapezio inferiore',
          },
          {
            name: 'Bird-Dog con manubrio',
            sets: 3,
            reps: '10/lato',
            rest: 40,
            description:
              'A quattro zampe, schiena piatta. Allunga il braccio con il manubrio mentre estendi la gamba opposta. Tieni 2 sec. Non ruotare il bacino.',
            muscles:
              'Multifido, erettori spinali, gluteo medio, deltoide posteriore',
          },
          {
            name: 'Rematore un braccio (appoggio)',
            sets: 3,
            reps: '12/lato',
            rest: 45,
            description:
              'In piedi, busto inclinato 45°, mano libera al muro. Tira il manubrio verso il fianco, gomito vicino al corpo. Abbassa lentamente.',
            muscles: 'Gran dorsale, romboide, trapezio medio, bicipite',
          },
          {
            name: 'Good Morning con manubri',
            sets: 3,
            reps: '12',
            rest: 45,
            description:
              'In piedi, manubri sulle spalle o al petto. Schiena dritta, abbassa il busto in avanti dalle anche fino quasi parallela al pavimento. Risali contraendo glutei e lombari.',
            muscles: 'Erettori spinali, gluteo grande, ischiocrurali',
          },
        ],
      },
      {
        name: 'Glutei — Fase 1 (Settimane 1–3)',
        icon: '🍑',
        exercises: [
          {
            name: 'Ponte glutei con peso',
            sets: 4,
            reps: '15',
            rest: 45,
            description:
              'Sdraiata, ginocchia piegate, manubrio sulle anche. Spingi i talloni e solleva il bacino, tieni 2 sec in alto, abbassa senza toccare terra.',
            muscles: 'Gluteo grande, gluteo medio, ischiocrurali',
          },
          {
            name: 'Ponte monopodalico',
            sets: 3,
            reps: '10/lato',
            rest: 45,
            description:
              'Come il ponte ma con un piede sollevato. Spingi dal tallone rimasto a terra. Bacino parallelo al pavimento.',
            muscles: 'Gluteo grande, gluteo medio, ischiocrurali, core',
          },
          {
            name: 'Donkey kick con manubrio',
            sets: 3,
            reps: '15/lato',
            rest: 40,
            description:
              'A quattro zampe, manubrio leggero dietro il ginocchio piegato a 90°. Spingi il tallone verso il soffitto. Non inarcare la schiena.',
            muscles: 'Gluteo grande, gluteo medio, ischiocrurali',
          },
          {
            name: 'Fire hydrant',
            sets: 3,
            reps: '12/lato',
            rest: 40,
            description:
              "A quattro zampe, apri la gamba lateralmente all'altezza dell'anca. Puoi aggiungere cavigliera. Torna lentamente.",
            muscles: 'Gluteo medio, gluteo minimo, piriforme',
          },
        ],
      },
      {
        name: 'Stretching',
        icon: '🧘',
        exercises: [
          {
            name: 'Piccione a terra',
            sets: 1,
            reps: '45s/lato',
            rest: 0,
            isTime: true,
            duration: 45,
            description: 'Stiramento piriforme e gluteo.',
            muscles: 'Gluteo, piriforme',
          },
          {
            name: "Child's pose",
            sets: 1,
            reps: '1 min',
            rest: 0,
            isTime: true,
            duration: 60,
            description: 'Stiramento lombari e dorsali.',
            muscles: 'Lombari, dorsali',
          },
          {
            name: 'Affondo basso con busto dritto',
            sets: 1,
            reps: '40s/lato',
            rest: 0,
            isTime: true,
            duration: 40,
            description: "Stiramento flessori dell'anca.",
            muscles: 'Flessori anca',
          },
          {
            name: 'Torsione colonna a terra',
            sets: 1,
            reps: '30s/lato',
            rest: 0,
            isTime: true,
            duration: 30,
            description: 'Ginocchia al petto, ruota da un lato.',
            muscles: 'Colonna, obliqui',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Mercoledì',
    subtitle: 'Spalle · Braccia · Core',
    color: '#c4b5fd',
    accent: '#8b5cf6',
    icon: '💜',
    groups: [
      {
        name: 'Riscaldamento',
        icon: '🌿',
        exercises: [
          {
            name: 'Hula-hoop',
            sets: 1,
            reps: '3 min',
            rest: 0,
            isTime: true,
            duration: 180,
            description:
              'Scalda il core, le anche e la vita. Ottimo anche per la densità ossea del bacino.',
            muscles: 'Core, anche, vita',
          },
          {
            name: 'Cerchi con le braccia',
            sets: 1,
            reps: '2 min',
            rest: 0,
            isTime: true,
            duration: 120,
            description:
              "Avanti poi all'indietro, 1 minuto per senso. Mobilizza le spalle.",
            muscles: 'Spalle',
          },
          {
            name: 'Aperture laterali (senza peso, pausa in cima)',
            sets: 1,
            reps: '12',
            rest: 0,
            description: 'Attiva i deltoidi prima del lavoro principale.',
            muscles: 'Deltoidi',
          },
        ],
      },
      {
        name: 'Spalle & Braccia',
        icon: '💫',
        exercises: [
          {
            name: 'Shoulder Press (lento)',
            sets: 3,
            reps: '12',
            rest: 50,
            description:
              "In piedi o seduta. Manubri all'altezza delle orecchie, gomiti a 90°. Spingi verso l'alto, abbassa in 3 secondi. Core contratto.",
            muscles:
              'Deltoide anteriore e laterale, trapezio superiore, tricipite',
          },
          {
            name: 'Alzate laterali',
            sets: 3,
            reps: '12',
            rest: 45,
            description:
              'Apri le braccia lateralmente fino alle spalle, gomiti leggermente piegati, pollice leggermente più basso del mignolo. Abbassa in 3 secondi lenti.',
            muscles: 'Deltoide laterale, sopraspinato, trapezio medio',
          },
          {
            name: 'Alzate frontali alternate',
            sets: 3,
            reps: '10/braccio',
            rest: 40,
            description:
              "Solleva un braccio alla volta davanti a te fino all'altezza delle spalle. Abbassa prima di alzare l'altro. Busto fermo.",
            muscles: 'Deltoide anteriore, gran pettorale (fascio clavicolare)',
          },
          {
            name: 'Curl bicipiti',
            sets: 3,
            reps: '12',
            rest: 45,
            description:
              'Palme in avanti, piega i gomiti verso le spalle. Tieni 1 sec in cima, abbassa in 3 sec. Non dondolare il busto.',
            muscles: 'Bicipite brachiale, brachiale, brachioradiale',
          },
          {
            name: 'Tricipiti overhead',
            sets: 3,
            reps: '12',
            rest: 45,
            description:
              'Manubrio con entrambe le mani sopra la testa. Piega i gomiti abbassando il peso dietro la testa. Gomiti vicini alle orecchie e fermi.',
            muscles: 'Tricipite brachiale (tutti e tre i capi)',
          },
        ],
      },
      {
        name: 'Core (in piedi o a quattro zampe)',
        icon: '✨',
        exercises: [
          {
            name: 'Vacuum addominale',
            sets: 3,
            reps: '8 × 10 sec',
            rest: 20,
            isTime: true,
            duration: 10,
            description:
              "Espira completamente, poi tira l'ombelico verso la colonna. Tieni 10 secondi. Non è visibile — si sente dentro.",
            muscles: "Trasverso dell'addome, diaframma, pavimento pelvico",
          },
          {
            name: 'Hula-hoop attivo',
            sets: 2,
            reps: '1 min',
            rest: 30,
            isTime: true,
            duration: 60,
            description:
              'Core contratto, ginocchia leggermente piegate. Alterna il senso ogni 30 secondi.',
            muscles: 'Obliqui, trasverso, erettori spinali, glutei',
          },
          {
            name: 'Pallof press (con manubrio)',
            sets: 3,
            reps: '10/lato',
            rest: 40,
            description:
              'In piedi, manubrio al petto con entrambe le mani. Estendi le braccia in avanti lentamente (il core resiste alla rotazione), tieni 2 sec, ritira. Poi gira 180° e ripeti.',
            muscles:
              'Obliqui (anti-rotazione), trasverso, deltoide, gran pettorale',
          },
          {
            name: 'Squat isometrico al muro',
            sets: 3,
            reps: '30–40 sec',
            rest: 45,
            isTime: true,
            duration: 35,
            description:
              'Schiena al muro, cosce parallele al pavimento. Alza e abbassa lentamente i talloni alternando mentre tieni la posizione.',
            muscles: 'Quadricipite, gluteo grande, core, gastrocnemio',
          },
          {
            name: 'Stir the pot (in piedi)',
            sets: 3,
            reps: '8 cerchi/senso',
            rest: 40,
            description:
              'Manubrio davanti con braccia semi-tese. Disegna cerchi ampi come se mescolassi una pentola. Il busto deve restare completamente fermo.',
            muscles: 'Obliqui, trasverso, deltoide, gran pettorale',
          },
        ],
      },
      {
        name: 'Stretching',
        icon: '🧘',
        exercises: [
          {
            name: 'Stiramento tricipiti',
            sets: 1,
            reps: '40s/lato',
            rest: 0,
            isTime: true,
            duration: 40,
            description:
              "Gomito dietro la testa, spingi dolcemente con l'altra mano.",
            muscles: 'Tricipite',
          },
          {
            name: 'Apertura del petto',
            sets: 1,
            reps: '1 min',
            rest: 0,
            isTime: true,
            duration: 60,
            description:
              'Braccia intrecciate dietro la schiena, spingi il petto in fuori.',
            muscles: 'Petto, spalle',
          },
          {
            name: 'Stiramento laterale',
            sets: 1,
            reps: '30s/lato',
            rest: 0,
            isTime: true,
            duration: 30,
            description: 'Braccio sopra la testa, inclinati lateralmente.',
            muscles: 'Obliqui, dorsale',
          },
          {
            name: 'Torsione del busto seduta',
            sets: 1,
            reps: '30s/lato',
            rest: 0,
            isTime: true,
            duration: 30,
            description: 'Seduta, ruota lentamente il busto da un lato.',
            muscles: 'Colonna, obliqui',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    label: 'Venerdì',
    subtitle: 'Gambe · Glutei (carico)',
    color: '#6ee7b7',
    accent: '#059669',
    icon: '🌿',
    groups: [
      {
        name: 'Riscaldamento',
        icon: '🌿',
        exercises: [
          {
            name: 'Salto corda / marcia veloce',
            sets: 1,
            reps: '3 min',
            rest: 0,
            isTime: true,
            duration: 180,
            description: 'Stimola la densità ossea di tibia e femore.',
            muscles: 'Corpo intero',
          },
          {
            name: 'Leg swing avanti/indietro',
            sets: 1,
            reps: '10/lato',
            rest: 0,
            description: "Mobilizza l'anca.",
            muscles: 'Anca',
          },
          {
            name: 'Squat bodyweight lento (3 sec giù)',
            sets: 1,
            reps: '10',
            rest: 0,
            description: '3 secondi in discesa, 1 su.',
            muscles: 'Gambe, glutei',
          },
          {
            name: 'Affondi senza peso',
            sets: 1,
            reps: '8/lato',
            rest: 0,
            description: 'Scalda anca, ginocchio e caviglia.',
            muscles: 'Gambe, anca',
          },
          {
            name: 'Rotazioni delle anche',
            sets: 1,
            reps: '1 min',
            rest: 0,
            isTime: true,
            duration: 60,
            description: 'In cerchio, ampio e lento.',
            muscles: 'Anca, mobilità',
          },
        ],
      },
      {
        name: 'Gambe',
        icon: '🦵',
        exercises: [
          {
            name: 'Goblet Squat',
            sets: 4,
            reps: '12',
            rest: 50,
            description:
              'Manubrio verticale davanti al petto. Piedi larghi, punte leggermente aperte. Scendi con cosce parallele, petto alto, core contratto. Risali spingendo i talloni.',
            muscles: 'Quadricipite, gluteo grande, adduttori, erettori spinali',
          },
          {
            name: 'Affondi con manubri',
            sets: 3,
            reps: '10/lato',
            rest: 50,
            description:
              'Passo lungo in avanti, abbassa il ginocchio posteriore verso il pavimento. Busto dritto, ginocchio anteriore non supera la punta del piede.',
            muscles: 'Quadricipite, gluteo grande, ischiocrurali, gastrocnemio',
          },
          {
            name: 'Stacco rumeno',
            sets: 3,
            reps: '12',
            rest: 50,
            description:
              'Manubri davanti alle cosce. Piega leggermente le ginocchia, abbassa il busto scivolando i manubri lungo le gambe fino a sentire lo stiramento degli ischiocrurali. Schiena sempre piatta.',
            muscles: 'Ischiocrurali, gluteo grande, erettori spinali',
          },
          {
            name: 'Calf raise',
            sets: 3,
            reps: '20',
            rest: 30,
            description:
              "Manubrio in una mano, l'altra al muro. Spingi sulle punte il più in alto possibile, tieni 1 sec. Per aumentare il range, esegui su un gradino.",
            muscles: 'Gastrocnemio, soleo, tibiale posteriore',
          },
        ],
      },
      {
        name: 'Glutei — Fase 2 (Settimane 4–6)',
        icon: '🍑',
        exercises: [
          {
            name: 'Hip Thrust pesante',
            sets: 4,
            reps: '12',
            rest: 50,
            description:
              'Spalle sul divano/bordo, manubri pesanti sulle anche (usa un asciugamano). Spingi i fianchi verso il soffitto, tieni 2 sec. Abbassa senza toccare terra.',
            muscles:
              'Gluteo grande (massima attivazione), gluteo medio, ischiocrurali',
          },
          {
            name: 'Squat Sumo pesante',
            sets: 3,
            reps: '15',
            rest: 50,
            description:
              "Piedi molto larghi, punte a 45°. Manubrio pesante davanti. Scendi con bacino indietro, ginocchia nella direzione delle punte. Risali spingendo l'interno coscia verso l'esterno.",
            muscles: 'Gluteo grande, gluteo medio, adduttori, quadricipite',
          },
          {
            name: 'Reverse Lunge gluteo',
            sets: 3,
            reps: '12/lato',
            rest: 50,
            description:
              'Passo INDIETRO, abbassa il ginocchio posteriore verso il pavimento inclinando il busto in avanti di 20–30°. Questo aumenta il lavoro del gluteo. Risali spingendo dal tallone del piede davanti.',
            muscles: 'Gluteo grande (enfasi alta), quadricipite, ischiocrurali',
          },
          {
            name: 'Donkey kick + pausa',
            sets: 3,
            reps: '12/lato',
            rest: 45,
            description:
              'A quattro zampe, manubrio leggero dietro il ginocchio. Spingi il tallone verso il soffitto. In cima: PAUSA 2 sec stringendo forte il gluteo. Abbassa in 3 secondi. Il tempo sotto tensione è la chiave della fase 2.',
            muscles: 'Gluteo grande (isolamento massimo), gluteo medio',
          },
        ],
      },
      {
        name: 'Stretching',
        icon: '🧘',
        exercises: [
          {
            name: 'Stiramento quadricipiti in piedi',
            sets: 1,
            reps: '40s/lato',
            rest: 0,
            isTime: true,
            duration: 40,
            description: 'Tallone al gluteo, appoggiati al muro.',
            muscles: 'Quadricipite',
          },
          {
            name: 'Stiramento ischiocrurali seduta',
            sets: 1,
            reps: '45s/lato',
            rest: 0,
            isTime: true,
            duration: 45,
            description: 'Gamba tesa a terra, busto in avanti.',
            muscles: 'Ischiocrurali',
          },
          {
            name: 'Piccione / figura 4 per il gluteo',
            sets: 1,
            reps: '1 min/lato',
            rest: 0,
            isTime: true,
            duration: 60,
            description: 'Massimo stiramento del gluteo.',
            muscles: 'Gluteo, piriforme',
          },
          {
            name: 'Stiramento polpacci al muro',
            sets: 1,
            reps: '30s/lato',
            rest: 0,
            isTime: true,
            duration: 30,
            description: 'Piede piatto e tallone a terra contro il muro.',
            muscles: 'Gastrocnemio, soleo',
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// INDEXEDDB
// ═══════════════════════════════════════════════════════
const DB_NAME = 'workoutTrackerDB';
const DB_VER = 1;
const STORE = 'workouts';

function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = (e) => {
      (e.target as IDBOpenDBRequest).result.createObjectStore(STORE, {
        keyPath: 'id',
      });
    };
    req.onsuccess = (e) => res((e.target as IDBOpenDBRequest).result);
    req.onerror = () => rej(req.error);
  });
}
async function dbGetAll(): Promise<WorkoutRecord[]> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => res(req.result || []);
    req.onerror = () => rej(req.error);
  });
}
async function dbPut(w: WorkoutRecord): Promise<void> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(w);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
async function dbDelete(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
async function dbPutMany(records: WorkoutRecord[]): Promise<void> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    records.forEach((r) => tx.objectStore(STORE).put(r));
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
const fmt = (s: number): string => {
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

function playBeep(type: 'rest' | 'exercise') {
  try {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const freqs = type === 'rest' ? [523, 659, 784] : [784, 659];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator(),
        g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      osc.frequency.value = f;
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  } catch {}
}

// WakeLock
let wakeLock: any = null;
async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    wakeLock = await (navigator as any).wakeLock.request('screen');
  } catch {}
}
function releaseWakeLock() {
  wakeLock?.release().catch(() => {});
  wakeLock = null;
}

// Timer state in localStorage (for background persistence)
const TS_KEY = 'restTimerState';
function saveTs(endTs: number, total: number) {
  localStorage.setItem(TS_KEY, JSON.stringify({ endTs, total }));
}
function clearTs() {
  localStorage.removeItem(TS_KEY);
}
function getTs(): { endTs: number; total: number } | null {
  try {
    const r = localStorage.getItem(TS_KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}

// Stopwatch state
const SW_KEY = 'stopwatchState';
function saveSw(startTs: number) {
  localStorage.setItem(SW_KEY, JSON.stringify({ startTs }));
}
function clearSw() {
  localStorage.removeItem(SW_KEY);
}
function getSw(): { startTs: number } | null {
  try {
    const r = localStorage.getItem(SW_KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════
const palette = {
  bg: '#fdf6f0',
  surface: '#ffffff',
  border: '#f0e8e0',
  text: '#3d2c2c',
  muted: '#9a8080',
  pink: '#ec4899',
  purple: '#8b5cf6',
  green: '#059669',
  coral: '#f97316',
  yellow: '#f59e0b',
};

// ═══════════════════════════════════════════════════════
// REST TIMER MODAL
// ═══════════════════════════════════════════════════════
function RestTimerModal({
  seconds,
  color,
  onClose,
}: {
  seconds: number;
  color: string;
  onClose: () => void;
}) {
  const calcRem = () => {
    const s = getTs();
    if (s && s.total === seconds)
      return Math.max(0, Math.ceil((s.endTs - Date.now()) / 1000));
    return seconds;
  };
  const [time, setTime] = useState<number>(calcRem);
  const [running, setRunning] = useState(false);
  const notified = useRef(false);
  const iv = useRef<any>(null);

  useEffect(() => {
    requestWakeLock();
    const s = getTs();
    if (s && s.total === seconds && s.endTs > Date.now()) {
      setRunning(true);
    } else {
      const endTs = Date.now() + seconds * 1000;
      saveTs(endTs, seconds);
      setRunning(true);
    }
    return () => releaseWakeLock();
  }, []);

  useEffect(() => {
    if (!running) {
      clearInterval(iv.current);
      return;
    }
    iv.current = setInterval(() => {
      const s = getTs();
      if (!s) {
        setRunning(false);
        return;
      }
      const rem = Math.ceil((s.endTs - Date.now()) / 1000);
      if (rem <= 0) {
        setTime(0);
        setRunning(false);
        clearTs();
        if (!notified.current) {
          notified.current = true;
          playBeep('rest');
        }
      } else setTime(rem);
    }, 250);
    return () => clearInterval(iv.current);
  }, [running]);

  const pause = () => {
    clearTs();
    setRunning(false);
  };
  const resume = () => {
    const t = time <= 0 ? seconds : time;
    if (time <= 0) setTime(seconds);
    saveTs(Date.now() + t * 1000, seconds);
    notified.current = false;
    setRunning(true);
  };
  const reset = () => {
    clearTs();
    setRunning(false);
    notified.current = false;
    setTime(seconds);
  };

  const pct = (time / seconds) * 100;
  const C = 2 * Math.PI * 52;
  const done = time === 0;
  const col = done ? palette.green : time <= 10 ? '#ef4444' : color;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: palette.surface,
          borderRadius: 28,
          padding: '32px 28px',
          textAlign: 'center',
          minWidth: 270,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: `1px solid ${palette.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            margin: '0 0 18px',
            fontSize: 13,
            fontWeight: 700,
            color: palette.muted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          ⏱ Recupero
        </p>
        <svg width="136" height="136" viewBox="0 0 136 136">
          <circle
            cx="68"
            cy="68"
            r="52"
            fill="none"
            stroke="#f0e8e0"
            strokeWidth="7"
          />
          <circle
            cx="68"
            cy="68"
            r="52"
            fill="none"
            stroke={col}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct / 100)}
            transform="rotate(-90 68 68)"
            style={{
              transition: 'stroke-dashoffset 0.25s linear, stroke 0.3s',
            }}
          />
          <text
            x="68"
            y="74"
            textAnchor="middle"
            fill={palette.text}
            fontSize="26"
            fontWeight="800"
            fontFamily="system-ui"
          >
            {fmt(time)}
          </text>
        </svg>
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            marginTop: 18,
          }}
        >
          {running ? (
            <button style={btnStyle('#f97316')} onClick={pause}>
              ⏸ Pausa
            </button>
          ) : (
            <button style={btnStyle(col)} onClick={resume}>
              {done ? '🔄 Nuovo' : '▶️ Riprendi'}
            </button>
          )}
          <button style={btnStyle('#9a8080')} onClick={reset}>
            ↺
          </button>
          <button style={btnStyle('#e5e7eb', palette.text)} onClick={onClose}>
            ✕
          </button>
        </div>
        {done && (
          <p
            style={{
              color: palette.green,
              fontWeight: 700,
              marginTop: 14,
              fontSize: 13,
            }}
          >
            ✅ Recupero completato!
          </p>
        )}
        {running && !done && (
          <p style={{ fontSize: 10, color: palette.muted, marginTop: 10 }}>
            Lo schermo resterà acceso durante il recupero
          </p>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg: string, color = '#fff'): React.CSSProperties {
  return {
    padding: '9px 18px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    background: bg,
    color,
    fontSize: 12,
    fontWeight: 700,
    transition: 'opacity 0.15s',
  };
}

// ═══════════════════════════════════════════════════════
// EXERCISE TIMER (in-card)
// ═══════════════════════════════════════════════════════
function ExTimer({ duration, color }: { duration: number; color: string }) {
  const [time, setTime] = useState(duration);
  const [running, setRunning] = useState(false);
  const notified = useRef(false);
  const iv = useRef<any>(null);
  const startTs = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      requestWakeLock();
      startTs.current = Date.now();
      iv.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTs.current!) / 1000);
        const rem = Math.max(0, duration - elapsed);
        setTime(rem);
        if (rem === 0 && !notified.current) {
          notified.current = true;
          playBeep('exercise');
          setRunning(false);
        }
      }, 250);
    } else {
      clearInterval(iv.current);
      releaseWakeLock();
    }
    return () => clearInterval(iv.current);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setTime(duration);
    notified.current = false;
  };
  const pct = (time / duration) * 100;

  return (
    <div
      style={{
        margin: '10px 0 4px',
        background: '#f9f5f2',
        borderRadius: 12,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: `1px solid ${palette.border}`,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          background: palette.border,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 2,
            transition: 'width 1s linear',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 14,
          color: palette.text,
          minWidth: 48,
        }}
      >
        {fmt(time)}
      </span>
      {!running ? (
        <button
          style={{ ...btnStyle(color), padding: '5px 12px', fontSize: 11 }}
          onClick={() => setRunning(true)}
        >
          ▶
        </button>
      ) : (
        <button
          style={{ ...btnStyle('#f97316'), padding: '5px 12px', fontSize: 11 }}
          onClick={() => setRunning(false)}
        >
          ⏸
        </button>
      )}
      <button
        style={{
          ...btnStyle('#e5e7eb', palette.text),
          padding: '5px 10px',
          fontSize: 11,
        }}
        onClick={reset}
      >
        ↺
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SET NOTE INPUT
// ═══════════════════════════════════════════════════════
function NoteInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || '');
  if (!editing)
    return (
      <button
        onClick={() => setEditing(true)}
        style={{
          fontSize: 10,
          padding: '2px 6px',
          borderRadius: 6,
          border: `1px solid ${palette.border}`,
          background: 'transparent',
          cursor: 'pointer',
          color: value ? palette.coral : palette.muted,
          fontStyle: value ? 'normal' : 'italic',
        }}
      >
        {value || 'note'}
      </button>
    );
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="kg · note"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onChange(val);
            setEditing(false);
          }
        }}
        style={{
          width: 70,
          padding: '2px 6px',
          borderRadius: 6,
          border: `1px solid ${palette.border}`,
          fontSize: 10,
          outline: 'none',
          fontFamily: 'monospace',
        }}
        autoFocus
      />
      <button
        style={{ ...btnStyle(palette.green), padding: '2px 8px', fontSize: 10 }}
        onClick={() => {
          onChange(val);
          setEditing(false);
        }}
      >
        ✓
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EXERCISE CARD
// ═══════════════════════════════════════════════════════
function ExCard({
  ex,
  color,
  done,
  onSet,
  notes,
  onNote,
}: {
  ex: Exercise;
  color: string;
  done: number;
  onSet: (i: number) => void;
  notes: string[];
  onNote: (i: number, v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showRest, setShowRest] = useState(false);
  return (
    <>
      {showRest && (
        <RestTimerModal
          seconds={ex.rest || 60}
          color={color}
          onClose={() => setShowRest(false)}
        />
      )}
      <div
        style={{
          background: palette.surface,
          borderRadius: 16,
          padding: 14,
          border: `1px solid ${palette.border}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: '0 0 3px',
                fontSize: 14,
                fontWeight: 700,
                color: palette.text,
              }}
            >
              {ex.name}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: palette.muted }}>
              {ex.sets}×{ex.reps}
              {ex.rest > 0 ? ` · rec ${ex.rest}s` : ''}
            </p>
          </div>
          <button
            onClick={() => setOpen(!open)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: `1px solid ${color}40`,
              background: `${color}15`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
            }}
          >
            {open ? '▲' : 'ℹ'}
          </button>
        </div>

        {open && (
          <div
            style={{
              margin: '10px 0 6px',
              padding: '10px 12px',
              background: '#fdf6f0',
              borderRadius: 10,
              border: `1px solid ${palette.border}`,
            }}
          >
            <p
              style={{
                margin: '0 0 6px',
                fontSize: 12,
                lineHeight: 1.7,
                color: '#5a4040',
              }}
            >
              {ex.description}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: palette.muted,
                fontStyle: 'italic',
              }}
            >
              🎯 {ex.muscles}
            </p>
          </div>
        )}

        {ex.isTime && ex.duration && (
          <ExTimer duration={ex.duration} color={color} />
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 7,
            alignItems: 'flex-end',
            marginTop: 12,
          }}
        >
          {Array.from({ length: ex.sets }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <button
                onClick={() => onSet(i)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  border: `2px solid ${done > i ? color : palette.border}`,
                  background: done > i ? `${color}20` : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: done > i ? 16 : 11,
                  color: done > i ? color : palette.muted,
                  transition: 'all 0.18s',
                  fontWeight: 700,
                }}
              >
                {done > i ? '✓' : i + 1}
              </button>
              <NoteInput
                value={notes?.[i] || ''}
                onChange={(v) => onNote(i, v)}
              />
            </div>
          ))}
          {ex.rest > 0 && (
            <button
              onClick={() => setShowRest(true)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: `1px solid ${color}40`,
                background: `${color}12`,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                color,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginLeft: 'auto',
              }}
            >
              ⏱ Rec
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// WORKOUT SESSION
// ═══════════════════════════════════════════════════════
function WorkoutSession({
  day,
  onFinish,
}: {
  day: WorkoutDay;
  onFinish: (r: WorkoutRecord) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const swIv = useRef<any>(null);

  const initSets = () => day.groups.map((g) => g.exercises.map(() => 0));
  const initNotes = () =>
    day.groups.map((g) => g.exercises.map((ex) => Array(ex.sets).fill('')));
  const [completedSets, setCompletedSets] = useState<number[][]>(initSets);
  const [notes, setNotes] = useState<string[][][]>(initNotes);

  // Persistent stopwatch
  useEffect(() => {
    const s = getSw();
    if (s) {
      const el = Math.floor((Date.now() - s.startTs) / 1000);
      setElapsed(el);
      setSwRunning(true);
    }
    return () => {
      clearInterval(swIv.current);
    };
  }, []);

  useEffect(() => {
    if (swRunning) {
      const s = getSw();
      if (!s) saveSw(Date.now() - elapsed * 1000);
      swIv.current = setInterval(() => {
        const st = getSw();
        if (st) setElapsed(Math.floor((Date.now() - st.startTs) / 1000));
      }, 1000);
      requestWakeLock();
    } else {
      clearInterval(swIv.current);
      releaseWakeLock();
    }
    return () => clearInterval(swIv.current);
  }, [swRunning]);

  const startSw = () => {
    saveSw(Date.now() - elapsed * 1000);
    setSwRunning(true);
  };
  const pauseSw = () => {
    clearSw();
    setSwRunning(false);
  };
  const resetSw = () => {
    clearSw();
    setSwRunning(false);
    setElapsed(0);
  };

  const totalSets = day.groups.reduce(
    (s, g) => s + g.exercises.reduce((s2, e) => s2 + e.sets, 0),
    0
  );
  const doneSets = completedSets.reduce(
    (s, g) => s + g.reduce((s2, v) => s2 + v, 0),
    0
  );
  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  const handleSet = (gIdx: number, eIdx: number, sIdx: number) => {
    setCompletedSets((prev) => {
      const n = prev.map((g) => [...g]);
      n[gIdx][eIdx] = n[gIdx][eIdx] >= sIdx + 1 ? sIdx : sIdx + 1;
      return n;
    });
  };
  const handleNote = (
    gIdx: number,
    eIdx: number,
    sIdx: number,
    val: string
  ) => {
    setNotes((prev) => {
      const n = prev.map((g) => g.map((e) => [...e]));
      n[gIdx][eIdx][sIdx] = val;
      return n;
    });
  };

  const handleFinish = () => {
    clearSw();
    setSwRunning(false);
    const exercises: ExerciseRecord[] = [];
    day.groups.forEach((g, gi) =>
      g.exercises.forEach((ex, ei) => {
        exercises.push({
          name: ex.name,
          setsCompleted: completedSets[gi][ei],
          setsTotal: ex.sets,
          reps: ex.reps,
          notes: notes[gi][ei].filter(Boolean),
        });
      })
    );
    const r: WorkoutRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      dayId: day.id,
      dayName: day.label,
      duration: elapsed,
      completed: true,
      exercises,
      totalSets,
      completedSets: doneSets,
    };
    onFinish(r);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Timer card */}
      <div
        style={{
          background: palette.surface,
          borderRadius: 20,
          padding: 18,
          border: `1px solid ${palette.border}`,
          boxShadow: `0 4px 20px ${day.color}30`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 2px',
                fontSize: 10,
                color: palette.muted,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Durata sessione
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 36,
                fontWeight: 800,
                color: day.accent,
                fontFamily: 'monospace',
              }}
            >
              {fmt(elapsed)}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'flex-end',
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              {swRunning ? (
                <button style={btnStyle('#f97316')} onClick={pauseSw}>
                  ⏸
                </button>
              ) : (
                <button style={btnStyle(day.accent)} onClick={startSw}>
                  ▶
                </button>
              )}
              <button
                style={btnStyle('#e5e7eb', palette.text)}
                onClick={resetSw}
              >
                ↺
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 90,
                  height: 5,
                  borderRadius: 3,
                  background: palette.border,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: day.accent,
                    borderRadius: 3,
                    transition: 'width 0.4s',
                  }}
                />
              </div>
              <span
                style={{ fontSize: 11, color: palette.muted, fontWeight: 700 }}
              >
                {pct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {day.groups.map((g, gi) => (
        <div key={g.name}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>{g.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: day.accent }}>
              {g.name}
            </span>
            <div style={{ flex: 1, height: 1, background: `${day.color}40` }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {g.exercises.map((ex, ei) => (
              <ExCard
                key={ex.name}
                ex={ex}
                color={day.accent}
                done={completedSets[gi][ei]}
                onSet={(si) => handleSet(gi, ei, si)}
                notes={notes[gi][ei]}
                onNote={(si, v) => handleNote(gi, ei, si, v)}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        style={{
          width: '100%',
          padding: 16,
          borderRadius: 16,
          border: 'none',
          cursor: 'pointer',
          background: `linear-gradient(135deg,${day.accent},${day.color})`,
          color: '#fff',
          fontSize: 15,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 8,
          boxShadow: `0 4px 16px ${day.color}60`,
        }}
        onClick={handleFinish}
      >
        ✅ Completa — {doneSets}/{totalSets} serie
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// HEATMAP
// ═══════════════════════════════════════════════════════
function Heatmap({ history }: { history: WorkoutRecord[] }) {
  const today = new Date();
  const weeks = 14;
  const days2: Date[] = [];
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days2.push(d);
  }
  const countMap: Record<string, number> = {};
  history.forEach((w) => {
    const k = new Date(w.date).toISOString().slice(0, 10);
    countMap[k] = (countMap[k] || 0) + 1;
  });
  const colors = ['#f0e8e0', '#fce7f3', '#fbcfe8', '#f9a8d4', '#ec4899'];
  const col = (c: number) => colors[Math.min(c, 4)];
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {days2.map((d, i) => {
        const k = d.toISOString().slice(0, 10);
        const c = countMap[k] || 0;
        const isToday = k === today.toISOString().slice(0, 10);
        return (
          <div
            key={i}
            title={`${k}: ${c}`}
            style={{
              width: 13,
              height: 13,
              borderRadius: 3,
              background: col(c),
              border: isToday ? '2px solid #ec4899' : 'none',
              transition: 'background 0.2s',
            }}
          />
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
function Dashboard({
  history,
  onBack,
  onRefresh,
}: {
  history: WorkoutRecord[];
  onBack: () => void;
  onRefresh: () => void;
}) {
  const [filter, setFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [importMsg, setImportMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const cutoff =
    filter === 'all'
      ? null
      : new Date(
          Date.now() -
            ({ d7: 7, d30: 30, d90: 90, year: 365 } as any)[filter] * 864e5
        );
  const filtered = cutoff
    ? history.filter((w) => new Date(w.date) >= cutoff)
    : history;

  const totalW = filtered.length;
  const totalSets = filtered.reduce((s, w) => s + w.completedSets, 0);
  const totalDur = filtered.reduce((s, w) => s + w.duration, 0);
  const avgDur = totalW > 0 ? Math.round(totalDur / totalW) : 0;

  const sorted = [
    ...new Set(history.map((w) => new Date(w.date).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 0;
  const now = new Date();
  for (const d of sorted) {
    if (Math.floor((now.getTime() - new Date(d).getTime()) / 864e5) === streak)
      streak++;
    else break;
  }

  const weeklyData: { label: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const ws = new Date(now);
    ws.setDate(ws.getDate() - ws.getDay() - i * 7);
    const we = new Date(ws);
    we.setDate(we.getDate() + 7);
    const count = history.filter((w) => {
      const d = new Date(w.date);
      return d >= ws && d < we;
    }).length;
    weeklyData.push({ label: `${ws.getDate()}/${ws.getMonth() + 1}`, count });
  }
  const maxW = Math.max(...weeklyData.map((d) => d.count), 1);

  const dayCounts: Record<number, number> = {};
  filtered.forEach((w) => {
    dayCounts[w.dayId] = (dayCounts[w.dayId] || 0) + 1;
  });

  const exFreq: Record<string, number> = {};
  filtered.forEach((w) =>
    w.exercises?.forEach((ex) => {
      exFreq[ex.name] = (exFreq[ex.name] || 0) + ex.setsCompleted;
    })
  );
  const topEx = Object.entries(exFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleExport = () => {
    const data = JSON.stringify(
      { exportDate: new Date().toISOString(), workouts: history },
      null,
      2
    );
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        const workouts: WorkoutRecord[] = Array.isArray(parsed)
          ? parsed
          : parsed.workouts;
        if (!Array.isArray(workouts)) {
          setImportMsg({ ok: false, text: '❌ File non valido' });
          return;
        }
        const ids = new Set(history.map((w) => w.id));
        const newOnes = workouts.filter((w) => !ids.has(w.id));
        await dbPutMany(newOnes);
        setImportMsg({
          ok: true,
          text: `✅ Importati ${newOnes.length} allenamenti`,
        });
        onRefresh();
      } catch {
        setImportMsg({ ok: false, text: '❌ Errore parsing' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo allenamento?')) return;
    await dbDelete(id);
    onRefresh();
  };

  const statCards = [
    { label: 'Streak', value: `${streak}gg`, color: palette.pink, icon: '🔥' },
    {
      label: 'Sessioni',
      value: String(totalW),
      color: palette.purple,
      icon: '🏋️',
    },
    {
      label: 'Serie',
      value: String(totalSets),
      color: palette.green,
      icon: '💪',
    },
    { label: 'Media', value: fmt(avgDur), color: palette.coral, icon: '⏱' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        paddingBottom: 60,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 900,
            color: palette.text,
          }}
        >
          📊 Statistiche
        </h2>
        <button style={btnStyle('#e5e7eb', palette.text)} onClick={onBack}>
          ← Indietro
        </button>
      </div>

      {/* Heatmap */}
      <div
        style={{
          background: palette.surface,
          borderRadius: 16,
          padding: 16,
          border: `1px solid ${palette.border}`,
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 11,
            fontWeight: 700,
            color: palette.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          📅 Ultime 14 settimane
        </p>
        <Heatmap history={history} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 10,
          }}
        >
          {['nessuno', '1', '2', '3+'].map((l, i) => (
            <div
              key={l}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: ['#f0e8e0', '#fce7f3', '#fbcfe8', '#ec4899'][i],
                }}
              />
              <span style={{ fontSize: 9, color: palette.muted }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[
          ['all', 'Tutto'],
          ['d7', '7gg'],
          ['d30', '30gg'],
          ['d90', '90gg'],
          ['year', 'Anno'],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: `1px solid ${
                filter === k ? palette.pink : palette.border
              }`,
              background: filter === k ? '#fce7f3' : 'transparent',
              fontSize: 11,
              fontWeight: 700,
              color: filter === k ? palette.pink : palette.muted,
              cursor: 'pointer',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {statCards.map((c) => (
          <div
            key={c.label}
            style={{
              background: palette.surface,
              borderRadius: 14,
              padding: '14px 16px',
              border: `1px solid ${palette.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
              }}
            >
              <span>{c.icon}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: palette.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {c.label}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 900,
                color: c.color,
                fontFamily: 'monospace',
              }}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Weekly bar chart */}
      {history.length > 0 && (
        <div
          style={{
            background: palette.surface,
            borderRadius: 16,
            padding: 16,
            border: `1px solid ${palette.border}`,
          }}
        >
          <p
            style={{
              margin: '0 0 14px',
              fontSize: 11,
              fontWeight: 700,
              color: palette.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            📈 Sessioni per settimana
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 4,
              height: 80,
            }}
          >
            {weeklyData.map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    background:
                      i === weeklyData.length - 1 ? palette.pink : '#fce7f3',
                    borderRadius: '4px 4px 0 0',
                    height:
                      d.count > 0
                        ? `${Math.round((d.count / maxW) * 64) + 8}px`
                        : '4px',
                    transition: 'height 0.4s',
                  }}
                />
                <span style={{ fontSize: 8, color: palette.muted }}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day distribution */}
      {Object.keys(dayCounts).length > 0 && (
        <div
          style={{
            background: palette.surface,
            borderRadius: 16,
            padding: 16,
            border: `1px solid ${palette.border}`,
          }}
        >
          <p
            style={{
              margin: '0 0 12px',
              fontSize: 11,
              fontWeight: 700,
              color: palette.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            📊 Distribuzione giorni
          </p>
          {Object.entries(dayCounts).map(([id, count]) => {
            const d = days.find((d) => d.id === parseInt(id));
            const pct2 = Math.round((count / totalW) * 100);
            return (
              <div key={id} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: d?.accent || palette.muted,
                    }}
                  >
                    {d?.icon} {d?.label}
                  </span>
                  <span style={{ fontSize: 11, color: palette.muted }}>
                    {count}× · {pct2}%
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: palette.border,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct2}%`,
                      background: d?.accent || palette.pink,
                      borderRadius: 2,
                      transition: 'width 0.4s',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top exercises */}
      {topEx.length > 0 && (
        <div
          style={{
            background: palette.surface,
            borderRadius: 16,
            padding: 16,
            border: `1px solid ${palette.border}`,
          }}
        >
          <p
            style={{
              margin: '0 0 12px',
              fontSize: 11,
              fontWeight: 700,
              color: palette.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            🏆 Top Esercizi
          </p>
          {topEx.map(([name, sets], idx) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 15, minWidth: 24 }}>
                {['🥇', '🥈', '🥉', '4.', '5.'][idx]}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: '0 0 2px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: palette.text,
                  }}
                >
                  {name}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: palette.muted }}>
                  {sets} serie completate
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        style={{
          ...btnStyle(palette.border, palette.text),
          width: '100%',
          padding: 12,
          justifyContent: 'center',
          borderRadius: 14,
          fontSize: 12,
        }}
      >
        📋 {showHistory ? 'Nascondi' : 'Mostra'} storico allenamenti{' '}
        {showHistory ? '▲' : '▼'}
      </button>

      {showHistory && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history
            .slice()
            .reverse()
            .map((w) => {
              const d2 = days.find((d) => d.id === w.dayId);
              const d = new Date(w.date);
              return (
                <div
                  key={w.id}
                  style={{
                    background: palette.surface,
                    borderRadius: 14,
                    padding: 12,
                    border: `1px solid ${d2?.color || palette.border}40`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: '0 0 2px',
                          fontSize: 13,
                          fontWeight: 700,
                          color: d2?.accent || palette.pink,
                        }}
                      >
                        {d2?.icon} {w.dayName}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 10,
                          color: palette.muted,
                        }}
                      >
                        {d.toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        ·{' '}
                        {d.toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(w.id)}
                      style={{
                        ...btnStyle('#fee2e2', '#ef4444'),
                        padding: '4px 8px',
                        fontSize: 11,
                      }}
                    >
                      🗑
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      fontSize: 11,
                      color: palette.muted,
                      marginTop: 8,
                    }}
                  >
                    <span>⏱ {fmt(w.duration)}</span>
                    {w.completedSets > 0 && (
                      <span>💪 {w.completedSets} serie</span>
                    )}
                  </div>
                  {w.exercises?.some((e) => e.notes && e.notes.length > 0) && (
                    <div
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: `1px solid ${palette.border}`,
                      }}
                    >
                      {w.exercises
                        .filter((e) => e.notes && e.notes.length > 0)
                        .map((e) => (
                          <p
                            key={e.name}
                            style={{
                              margin: '2px 0',
                              fontSize: 10,
                              color: palette.muted,
                            }}
                          >
                            <b style={{ color: palette.text }}>{e.name}:</b>{' '}
                            {e.notes!.join(' · ')}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          {history.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                color: palette.muted,
                padding: 20,
                fontSize: 12,
              }}
            >
              Nessun allenamento ancora 🌸
            </p>
          )}
        </div>
      )}

      {/* Data management */}
      <div
        style={{
          background: palette.surface,
          borderRadius: 16,
          padding: 16,
          border: `1px solid ${palette.border}`,
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 11,
            fontWeight: 700,
            color: palette.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          💾 Gestione Dati
        </p>
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 11,
            color: palette.muted,
            lineHeight: 1.6,
          }}
        >
          Esporta il backup JSON e salvalo su iCloud o Files per non perderlo.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            style={{ ...btnStyle('#d1fae5', '#065f46'), padding: '9px 16px' }}
            onClick={handleExport}
          >
            ⬇️ Esporta JSON
          </button>
          <button
            style={{ ...btnStyle('#e0e7ff', '#3730a3'), padding: '9px 16px' }}
            onClick={() => fileRef.current?.click()}
          >
            ⬆️ Importa JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
        {importMsg && (
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 12,
              fontWeight: 600,
              color: importMsg.ok ? palette.green : '#ef4444',
            }}
          >
            {importMsg.text}
          </p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState<'home' | 'session' | 'dashboard'>('home');
  const [activeDay, setActiveDay] = useState(0);
  const [history, setHistory] = useState<WorkoutRecord[]>([]);

  const loadHistory = useCallback(async () => {
    const all = await dbGetAll();
    all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setHistory(all);
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFinish = async (r: WorkoutRecord) => {
    await dbPut(r);
    await loadHistory();
    setView('home');
  };

  const lastWorkout = history.length > 0 ? history[history.length - 1] : null;
  const lastDay = lastWorkout
    ? days.find((d) => d.id === lastWorkout.dayId)
    : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: palette.bg,
        fontFamily: "-apple-system,'SF Pro Display',system-ui,sans-serif",
        color: palette.text,
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle,#fce7f380 0%,transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -60,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle,#e0e7ff60 0%,transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '30%',
            width: 300,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse,#d1fae540 0%,transparent 70%)',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 480,
          margin: '0 auto',
          padding: '24px 16px 90px',
        }}
      >
        {view === 'dashboard' && (
          <Dashboard
            history={history}
            onBack={() => setView('home')}
            onRefresh={loadHistory}
          />
        )}

        {view === 'session' && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 900,
                  color: days[activeDay].accent,
                }}
              >
                {days[activeDay].icon} {days[activeDay].label}
              </h2>
              <button
                style={btnStyle('#e5e7eb', palette.text)}
                onClick={() => {
                  clearSw();
                  setView('home');
                }}
              >
                ← Indietro
              </button>
            </div>
            <WorkoutSession day={days[activeDay]} onFinish={handleFinish} />
          </>
        )}

        {view === 'home' && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🌸</div>
              <h1
                style={{
                  margin: '0 0 4px',
                  fontSize: 28,
                  fontWeight: 900,
                  background: `linear-gradient(135deg,${palette.pink},${palette.purple})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Il mio allenamento
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: palette.muted,
                  letterSpacing: '0.06em',
                }}
              >
                3 GIORNI · CASA · MANUBRI
              </p>
            </div>

            {/* Last workout shortcut */}
            {lastWorkout && lastDay && (
              <div
                onClick={() => {
                  setActiveDay(days.indexOf(lastDay));
                  setView('session');
                }}
                style={{
                  background: palette.surface,
                  borderRadius: 16,
                  padding: 14,
                  border: `1px solid ${lastDay.color}`,
                  marginBottom: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: `0 2px 12px ${lastDay.color}40`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>⚡️</span>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        color: lastDay.accent,
                      }}
                    >
                      Ripeti ultima sessione
                    </p>
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontSize: 11,
                        color: palette.muted,
                      }}
                    >
                      {lastDay.label} ·{' '}
                      {new Date(lastWorkout.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
                <span style={{ color: lastDay.accent, fontSize: 18 }}>›</span>
              </div>
            )}

            {/* Day cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {days.map((d, i) => {
                const count = history.filter((w) => w.dayId === d.id).length;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveDay(i);
                      setView('session');
                    }}
                    style={{
                      background: palette.surface,
                      borderRadius: 18,
                      padding: '18px 20px',
                      border: `1px solid ${d.color}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      boxShadow: `0 2px 12px ${d.color}30`,
                      transition: 'transform 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 36 }}>{d.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: '0 0 2px',
                          fontSize: 17,
                          fontWeight: 800,
                          color: palette.text,
                        }}
                      >
                        {d.label}
                      </p>
                      <p
                        style={{
                          margin: '0 0 4px',
                          fontSize: 12,
                          color: palette.muted,
                        }}
                      >
                        {d.subtitle}
                      </p>
                      {count > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            color: d.accent,
                            fontWeight: 700,
                            background: `${d.color}30`,
                            padding: '2px 8px',
                            borderRadius: 20,
                          }}
                        >
                          ✓ {count} sessioni completate
                        </span>
                      )}
                    </div>
                    <span style={{ color: d.accent, fontSize: 22 }}>›</span>
                  </button>
                );
              })}
            </div>

            {/* Quick stats */}
            {history.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <div
                  style={{
                    flex: 1,
                    background: palette.surface,
                    borderRadius: 14,
                    padding: '10px 14px',
                    border: `1px solid ${palette.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>🔥</span>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: palette.pink,
                    }}
                  >
                    {history.length}
                  </span>
                  <span style={{ fontSize: 10, color: palette.muted }}>
                    sessioni
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: palette.surface,
                    borderRadius: 14,
                    padding: '10px 14px',
                    border: `1px solid ${palette.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>⏱</span>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: palette.coral,
                    }}
                  >
                    {fmt(history.reduce((s, w) => s + w.duration, 0))}
                  </span>
                  <span style={{ fontSize: 10, color: palette.muted }}>
                    totale
                  </span>
                </div>
              </div>
            )}

            {/* Progressione glutei reminder */}
            <div
              style={{
                marginTop: 14,
                background: `linear-gradient(135deg,#fce7f3,#e0e7ff)`,
                borderRadius: 16,
                padding: 14,
                border: `1px solid ${palette.border}`,
              }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: 12,
                  fontWeight: 800,
                  color: palette.text,
                }}
              >
                📋 Piano progressione glutei (9 settimane)
              </p>
              {[
                {
                  fase: 'Fase 1 (sett. 1–3)',
                  desc: 'Attivazione — impara il gesto, pesi leggeri',
                  color: palette.pink,
                },
                {
                  fase: 'Fase 2 (sett. 4–6)',
                  desc: 'Carico — aumenta il peso ogni settimana',
                  color: palette.purple,
                },
                {
                  fase: 'Fase 3 (sett. 7–9)',
                  desc: 'Intensità — pausa 2s in cima, 3s in discesa',
                  color: palette.green,
                },
              ].map((f) => (
                <div
                  key={f.fase}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: f.color,
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <span
                      style={{ fontSize: 11, fontWeight: 700, color: f.color }}
                    >
                      {f.fase}
                    </span>
                    <span style={{ fontSize: 11, color: palette.muted }}>
                      {' '}
                      · {f.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(253,246,240,0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${palette.border}`,
          display: 'flex',
          justifyContent: 'center',
          gap: 60,
          padding: '8px 0 16px',
        }}
      >
        <button
          onClick={() => setView('home')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 16px',
            color: view === 'home' ? palette.pink : palette.muted,
            fontWeight: view === 'home' ? 700 : 400,
          }}
        >
          <span style={{ fontSize: 22 }}>🏠</span>
          <span style={{ fontSize: 10 }}>Home</span>
        </button>
        <button
          onClick={() => setView('dashboard')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 16px',
            color: view === 'dashboard' ? palette.pink : palette.muted,
            fontWeight: view === 'dashboard' ? 700 : 400,
          }}
        >
          <span style={{ fontSize: 22 }}>📊</span>
          <span style={{ fontSize: 10 }}>Stats</span>
        </button>
      </div>
    </div>
  );
}
