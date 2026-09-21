'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Send,
  Loader2,
  RefreshCw,
  Music,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  SkipForward,
  User,
} from 'lucide-react';

const SITUATIONER = [
  'Fitness 💪',
  'Studie 🤓',
  'Afslapning 😴',
  'Fest & Sammenkomst 🕺',
  'Roadtrip & Kørsel 🚗',
  'Gaming 🎮',
];

const GENRER = [
  'Pop',
  'EDM',
  'Hip Hop',
  'R&B',
  'Singer-songwriter',
  'Alt Rock',
  'Hyperpop',
  'Indiepop',
  'Folk Pop',
  'Bass House',
  'Dance House',
  'Drum & Bass',
  'Trap',
  'Lofi',
  'Phonk',
];

export default function InteractiveQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [userName, setUserName] = useState('');
  const [selectedSituation, setSelectedSituation] = useState('');
  const [customSituation, setCustomSituation] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [customGenre, setCustomGenre] = useState('');
  
  const [songs, setSongs] = useState([{ title: '', artist: '' }]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSongChange = (index, field, value) => {
    const updated = [...songs];
    updated[index][field] = value;
    setSongs(updated);
  };

  const addSongInput = () => {
    if (songs.length < 3) {
      setSongs([...songs, { title: '', artist: '' }]);
    }
  };

  const removeSongInput = (index) => {
    if (songs.length > 1) {
      setSongs(songs.filter((_, i) => i !== index));
    } else {
      setSongs([{ title: '', artist: '' }]);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);

    const validSongs = songs
      .filter((s) => s.title.trim() !== '' || s.artist.trim() !== '')
      .map((s) => `${s.title.trim() || 'Ukendt titel'} af ${s.artist.trim() || 'Ukendt artist'}`);

    const finalSituation = customSituation.trim() !== '' ? customSituation : selectedSituation;

    let allGenres = [...selectedGenres];
    if (customGenre.trim() !== '') {
      allGenres.push(customGenre.trim());
    }

    const playlistData = {
      'Navn': userName,
      'Valgt Situation': finalSituation,
      'Foretrukne Genrer': allGenres.length > 0 ? allGenres.join(', ') : 'Ingen specificeret',
      'Inspirationssange': validSongs.length > 0 ? validSongs.join(' | ') : 'Ingen angivet (Sprunget over)',
    };

    try {
      const response = await fetch('/api/discord-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections: playlistData }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Anmodning fejlede:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setDirection(-1);
    setUserName('');
    setSelectedSituation('');
    setCustomSituation('');
    setSelectedGenres([]);
    setCustomGenre('');
    setSongs([{ title: '', artist: '' }]);
    setStatus(null);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const canGoNext = () => {
    if (currentStep === 0) return userName.trim().length > 0;
    if (currentStep === 1) return selectedSituation !== '' || customSituation.trim() !== '';
    if (currentStep === 2) return selectedGenres.length > 0 || customGenre.trim() !== '';
    if (currentStep === 3) return true;
    if (currentStep === 4) return true;
    return false;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Skræddersy Din Playlist</h2>
        </div>
        {status !== 'success' && (
          <span className="text-xs text-slate-400 font-medium">Trin {currentStep + 1} af 5</span>
        )}
      </div>

      {status !== 'success' && (
        <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="bg-emerald-500 h-full"
            initial={{ width: '20%' }}
            animate={{ width: `${((currentStep + 1) / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 space-y-4"
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Tak, {userName}!</h3>
          <p className="text-slate-300">
            Dine playlist-ønsker er blevet leveret direkte til min Discord DM.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm transition"
          >
            <RefreshCw className="w-4 h-4" /> Start forfra
          </button>
        </motion.div>
      ) : (
        <div>
          <div className="relative min-h-[340px]">
            <AnimatePresence custom={direction} mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <label className="block text-base font-semibold text-slate-200">
                    1. Hvem er du?
                  </label>
                  <p className="text-xs text-slate-400">
                    Indtast dit navn, så jeg ved, hvem playlisten skal laves til.
                  </p>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="F.eks. Ravn eller Regitze..."
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <label className="block text-base font-semibold text-slate-200">
                    2. Hvad er anledningen?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SITUATIONER.map((sit) => (
                      <motion.button
                        key={sit}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedSituation(sit);
                          setCustomSituation('');
                        }}
                        className={`p-3 text-left text-xs sm:text-sm rounded-xl border transition-all ${
                          selectedSituation === sit && customSituation === ''
                            ? 'bg-emerald-600 border-emerald-400 text-white font-medium shadow-md shadow-emerald-600/20'
                            : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {sit}
                      </motion.button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Eller skriv din egen:
                    </label>
                    <input
                      type="text"
                      value={customSituation}
                      onChange={(e) => {
                        setCustomSituation(e.target.value);
                        setSelectedSituation('');
                      }}
                      placeholder="F.eks. Madlavning, Bryllup..."
                      className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <label className="block text-base font-semibold text-slate-200">
                      3. Vælg genrer:
                    </label>
                    <span className="text-xs text-slate-400">
                      Valgt: {selectedGenres.length + (customGenre.trim() ? 1 : 0)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[170px] overflow-y-auto pr-1">
                    {GENRER.map((genre) => {
                      const isSelected = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handleGenreToggle(genre)}
                          className={`p-2.5 text-left text-xs rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-semibold'
                              : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {genre}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Eller beskriv lyden:
                    </label>
                    <input
                      type="text"
                      value={customGenre}
                      onChange={(e) => setCustomGenre(e.target.value)}
                      placeholder="F.eks. Phonk, Darkwave, Math Rock..."
                      className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <label className="block text-base font-semibold text-slate-200">
                      4. Tilføj inspirationssange (Valgfrit)
                    </label>
                    <span className="text-xs text-emerald-400 font-medium">Maks 3 sange</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Har du nogle specifikke sange, du vil have playlisten skal læne sig op ad?
                  </p>

                  <div className="space-y-3">
                    {songs.map((song, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <input
                            type="text"
                            placeholder="Sangtitel"
                            value={song.title}
                            onChange={(e) => handleSongChange(index, 'title', e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                          <input
                            type="text"
                            placeholder="Artist / Kunstner"
                            value={song.artist}
                            onChange={(e) => handleSongChange(index, 'artist', e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        {songs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSongInput(index)}
                            className="p-2 text-slate-400 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {songs.length < 3 && (
                    <button
                      type="button"
                      onClick={addSongInput}
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium pt-1"
                    >
                      <Plus className="w-4 h-4" /> Tilføj endnu en sang ({songs.length}/3)
                    </button>
                  )}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step5"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <label className="block text-base font-semibold text-slate-200">
                    5. Klar?
                  </label>
                  <p className="text-xs text-slate-400">
                    Her er en opsummering af dine indtastede ønsker:
                  </p>

                  <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl space-y-2 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400 font-semibold">Navn:</span> {userName}
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Situation:</span>{' '}
                      {customSituation.trim() !== '' ? customSituation : selectedSituation}
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Genrer:</span>{' '}
                      {[...selectedGenres, customGenre.trim()].filter(Boolean).join(', ')}
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Inspirationssange:</span>{' '}
                      {songs.filter((s) => s.title || s.artist).length > 0
                        ? songs
                            .filter((s) => s.title || s.artist)
                            .map((s) => `${s.title || '?'} (${s.artist || '?'})`)
                            .join(', ')
                        : 'Ingen angivet'}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {status === 'error' && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              Kunne ikke sende til Discord.
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || loading}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 text-sm font-medium hover:bg-slate-800 disabled:opacity-0 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Tilbage
            </button>

            {currentStep === 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-medium transition flex items-center gap-1.5"
              >
                Spring over <SkipForward className="w-4 h-4" />
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canGoNext()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                Næste <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sender til Discord...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Min Playlist
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}