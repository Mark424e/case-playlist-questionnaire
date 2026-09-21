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
  Clock,
  Disc,
} from 'lucide-react';

const PLATFORMS = ['Spotify', 'YouTube'];

const SONG_COUNT_OPTIONS = [
  { count: '20 sange', time: '~30 minutter' },
  { count: '50 sange', time: '~1 time' },
  { count: '100+ sange', time: '~2 timer' },
];

const SITUATIONER = [
  'Gaming 🎮',
  'Fitness 💪',
  'Studying 📚',
  'Afslapning 😴',
  'Sammenkomst 🤲',
  'Kørsel 🚗',
  'Madlavning 🍳',
  'Arbejde 👷',
  'Rengøring 🧹',
];

const GENRER = [
  'Pop',
  'Indiepop',
  'Hyperpop',
  'K-Pop',
  'Electronic / EDM',
  'Bass House',
  'Dance House',
  'Drum & Bass',
  'Hip Hop / Rap',
  'Trap',
  'R&B / Soul',
  'Lofi',
  'Rock',
  'Indie / Alt Rock',
  'Post-Punk',
];

export default function InteractiveQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form State
  const [userName, setUserName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedSituation, setSelectedSituation] = useState('');
  const [customSituation, setCustomSituation] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [customGenre, setCustomGenre] = useState('');
  const [songCount, setSongCount] = useState('');
  
  // Song Inputs (Max 3)
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
    if (currentStep < 6) {
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

    const selectedOption = SONG_COUNT_OPTIONS.find((opt) => opt.count === songCount);

    const playlistData = {
      'Navn': userName,
      'Platform': selectedPlatform,
      'Valgt Situation': finalSituation,
      'Foretrukne Genrer': allGenres.length > 0 ? allGenres.join(', ') : 'Ingen specificeret',
      'Minimum Sange': songCount ? `${songCount} (Est. tid: ${selectedOption?.time})` : 'Ingen angivet',
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
      console.error('Anmodning mislykkedes:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setDirection(-1);
    setUserName('');
    setSelectedPlatform('');
    setSelectedSituation('');
    setCustomSituation('');
    setSelectedGenres([]);
    setCustomGenre('');
    setSongCount('');
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
    if (currentStep === 1) return selectedPlatform !== '';
    if (currentStep === 2) return selectedSituation !== '' || customSituation.trim() !== '';
    if (currentStep === 3) return selectedGenres.length > 0 || customGenre.trim() !== '';
    if (currentStep === 4) return songCount !== '';
    if (currentStep === 5) return true; // Valgfrit trin
    if (currentStep === 6) return true;
    return false;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
      {/* Header med Progress Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Skræddersy Din Playlist</h2>
        </div>
        {status !== 'success' && (
          <span className="text-xs text-slate-400 font-medium">Trin {currentStep + 1} af 7</span>
        )}
      </div>

      {status !== 'success' && (
        <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="bg-emerald-500 h-full"
            initial={{ width: '14%' }}
            animate={{ width: `${((currentStep + 1) / 7) * 100}%` }}
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
          <h3 className="text-xl font-bold text-white">Mange tak, {userName}!</h3>
          <p className="text-slate-300">
            Dine playlist-ønsker er blevet sendt direkte til min Discord DM. 😊
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
          <div className="relative min-h-85">
            <AnimatePresence custom={direction} mode="wait">
              {/* SLIDE 1: NAVN */}
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
                    1. Who u is? 🤔
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

              {/* SLIDE 2: PLATFORM */}
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
                    2. Bruger du Spotify eller YouTube Music? 🎶
                  </label>
                  <p className="text-xs text-slate-400">Vælg din foretrukne tjeneste:</p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {PLATFORMS.map((platform) => (
                      <motion.button
                        key={platform}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`p-6 text-center rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${
                          selectedPlatform === platform
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-600/10'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Disc className="w-8 h-8 text-emerald-400" />
                        <span className="text-base">{platform}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SLIDE 3: SITUATION */}
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
                  <label className="block text-base font-semibold text-slate-200">
                    3. Hvad skal playlisten bruges til? 🤔
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
                      Eller skriv et specifikt scenarie:
                    </label>
                    <input
                      type="text"
                      value={customSituation}
                      onChange={(e) => {
                        setCustomSituation(e.target.value);
                        setSelectedSituation('');
                      }}
                      placeholder="F.eks. Når jeg er sent oppe kl. lort om natten type shi-..."
                      className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </motion.div>
              )}

              {/* SLIDE 4: GENRER */}
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
                      4. Vælg genre:
                    </label>
                    <span className="text-xs text-slate-400">
                      Valgt: {selectedGenres.length + (customGenre.trim() ? 1 : 0)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-42.5 overflow-y-auto pr-1">
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
                      Eller tilføj din egen genre (Du må også beskrive genren, hvis du ikke kender navnet)
                    </label>
                    <input
                      type="text"
                      value={customGenre}
                      onChange={(e) => setCustomGenre(e.target.value)}
                      placeholder="F.eks. Phonk, Liquid DnB, EDM Musik der har en nostalgisk lyd til sig..."
                      className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </motion.div>
              )}

              {/* SLIDE 5: ANTAL SANGE & ESTIMERET TID */}
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
                    5. Hvor mange sange skal playlisten minimum indeholde? 🤔
                  </label>
                  <p className="text-xs text-slate-400">
                    Vælg det ønskede antal sange. Vær obs på at det tager længere tid, hvis du vælger flere sange.
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {SONG_COUNT_OPTIONS.map((option) => (
                      <motion.button
                        key={option.count}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSongCount(option.count)}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          songCount === option.count
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-600/10'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-lg font-bold">
                          {option.count}
                          {option.count === '100+ sange' && '*'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" /> {option.time}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {songCount === '100+ sange' && (
                    <p className="text-[11px] text-amber-400/90 italic pt-2">
                      * Hvis du vælger 100+ sange, skylder du mig VBucks eller VP. 😇 (PS. issa joke).
                    </p>
                  )}
                </motion.div>
              )}

              {/* SLIDE 6: VALGFRIE SANGE OG ARTISTER */}
              {currentStep === 5 && (
                <motion.div
                  key="step6"
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
                      6. Tilføj inspirationssange (Valgfrit)
                    </label>
                    <span className="text-xs text-emerald-400 font-medium">Maks 3 sange</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Har du nogle specifikke sange eller artister, du vil have playlisten skal læne sig op ad?
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

              {/* SLIDE 7: OPSUMMERING & SEND */}
              {currentStep === 6 && (
                <motion.div
                  key="step7"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <label className="block text-base font-semibold text-slate-200">
                    7. Er du klar til at sende?
                  </label>
                  <p className="text-xs text-slate-400">
                    Her er en opsummering af dine indtastede ønsker:
                  </p>

                  <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl space-y-2 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400 font-semibold">Navn:</span> {userName}
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Platform:</span> {selectedPlatform}
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
                      <span className="text-slate-400 font-semibold">Sange & Est. Tid:</span> {songCount} (
                      {SONG_COUNT_OPTIONS.find((opt) => opt.count === songCount)?.time})
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

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || loading}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 text-sm font-medium hover:bg-slate-800 disabled:opacity-0 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Tilbage
            </button>

            {currentStep === 5 && (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-medium transition flex items-center gap-1.5"
              >
                Spring over <SkipForward className="w-4 h-4" />
              </button>
            )}

            {currentStep < 6 ? (
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