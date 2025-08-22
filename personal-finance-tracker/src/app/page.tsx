import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Personal Finance Tracker</h1>
      <p className="text-gray-600">Budgeting, spending analysis, and planning.</p>
      <div className="flex gap-4">
        <Link href="/login" className="underline">Log in</Link>
        <Link href="/register" className="underline">Register</Link>
      </div>
      <div>
        <Link href="/accounts" className="inline-block bg-black text-white px-4 py-2 rounded">Go to Accounts</Link>
      </div>
    </main>
  );
}
