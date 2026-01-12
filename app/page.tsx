export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Aris Club
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl">
            Welcome to the official Aris Club website
          </p>
          <button className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
