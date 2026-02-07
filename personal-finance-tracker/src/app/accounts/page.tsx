"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Account = { id: string; name: string; type: string; currency: string };

export default function AccountsPage() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["accounts"],
		queryFn: async () => {
			const res = await axios.get("/api/accounts");
			return res.data.accounts as Account[];
		},
	});
	const [name, setName] = useState("");
	const [type, setType] = useState("checking");
	const [currency, setCurrency] = useState("USD");
	const create = useMutation({
		mutationFn: async () => {
			await axios.post("/api/accounts", { name, type, currency });
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
	});
	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Accounts</h1>
			<div className="space-y-2">
				{data?.map((a) => (
					<div key={a.id} className="border rounded px-3 py-2 flex justify-between">
						<span>{a.name}</span>
						<span className="text-sm text-gray-600 uppercase">{a.type} · {a.currency}</span>
					</div>
				))}
				{!data?.length && <p className="text-gray-500">No accounts yet.</p>}
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					create.mutate();
				}}
				className="grid grid-cols-4 gap-2"
			>
				<input className="border px-2 py-2 rounded col-span-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
				<select className="border px-2 py-2 rounded" value={type} onChange={(e) => setType(e.target.value)}>
					<option value="cash">cash</option>
					<option value="checking">checking</option>
					<option value="credit">credit</option>
					<option value="savings">savings</option>
				</select>
				<input className="border px-2 py-2 rounded" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
				<button className="col-span-4 bg-black text-white py-2 rounded" disabled={create.isPending}>
					{create.isPending ? "Creating..." : "Create"}
				</button>
			</form>
		</div>
	);
}