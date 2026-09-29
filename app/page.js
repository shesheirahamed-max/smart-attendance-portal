import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-6">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 text-center border border-zinc-200 dark:border-zinc-700">
        
        {/* Project Title */}
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-3">
          WorkLedger App
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
          Centralized Worker Management and Ledger System
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            href="/owner/dashboard"
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition shadow-md"
          >
            Owner Dashboard
          </Link>

          <Link
            href="/worker/dashboard"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg transition shadow-md"
          >
            Worker Dashboard
          </Link>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <Link
              href="/login"
              className="py-3 px-4 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 font-medium transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="py-3 px-4 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 font-medium transition"
            >
              Register
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}