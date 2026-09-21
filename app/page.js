import InteractiveQuiz from '@/components/InteractiveQuiz';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-teal-200">
          Marks Playlist Questionnaire
        </h1>
        <p className="mt-3 text-slate-400 text-base sm:text-md">
          You need playlist? I got playlist 💊😏
        </p>
      </div>

      <InteractiveQuiz />
    </main>
  );
}