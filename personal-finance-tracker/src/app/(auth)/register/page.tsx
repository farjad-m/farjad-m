"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [locale, setLocale] = useState("en-US");
	const [baseCurrency, setBaseCurrency] = useState("USD");
	const [tz, setTz] = useState("UTC");
	const mutation = useMutation({
		mutationFn: async () => {
			await axios.post("/api/auth/register", { email, password, locale, baseCurrency, tz });
		},
	});
	return (
		<div className="max-w-md mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">Create account</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					mutation.mutate();
				}}
				className="space-y-4"
			>
				<input className="w-full border px-3 py-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="w-full border px-3 py-2 rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<div className="grid grid-cols-3 gap-2">
					<input className="border px-3 py-2 rounded" placeholder="Locale" value={locale} onChange={(e) => setLocale(e.target.value)} />
					<input className="border px-3 py-2 rounded" placeholder="Currency" value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} />
					<input className="border px-3 py-2 rounded" placeholder="Timezone" value={tz} onChange={(e) => setTz(e.target.value)} />
				</div>
				<button className="w-full bg-black text-white py-2 rounded" disabled={mutation.isPending}>
					{mutation.isPending ? "Creating..." : "Create account"}
				</button>
				{mutation.isError && <p className="text-red-600">Registration failed</p>}
			</form>
			<p className="text-sm mt-4">
				Have an account? <Link href="/login" className="underline">Log in</Link>
			</p>
		</div>
	);
}