"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const mutation = useMutation({
		mutationFn: async () => {
			await axios.post("/api/auth/login", { email, password });
		},
	});
	return (
		<div className="max-w-md mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">Log in</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					mutation.mutate();
				}}
				className="space-y-4"
			>
				<input className="w-full border px-3 py-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="w-full border px-3 py-2 rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button className="w-full bg-black text-white py-2 rounded" disabled={mutation.isPending}>
					{mutation.isPending ? "Signing in..." : "Sign in"}
				</button>
				{mutation.isError && <p className="text-red-600">Login failed</p>}
			</form>
			<p className="text-sm mt-4">
				No account? <Link href="/register" className="underline">Register</Link>
			</p>
		</div>
	);
}