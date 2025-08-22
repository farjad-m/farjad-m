import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getAuthFromRequest } from "../../../lib/auth";
import { z } from "zod";

const CreateAccountSchema = z.object({
	name: z.string().min(1),
	type: z.enum(["cash", "checking", "credit", "savings"]),
	currency: z.string().min(3).max(3),
});

export async function GET(req: Request) {
	const auth = await getAuthFromRequest(req);
	if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const accounts = await prisma.account.findMany({ where: { userId: auth.userId } });
	return NextResponse.json({ accounts });
}

export async function POST(req: Request) {
	const auth = await getAuthFromRequest(req);
	if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	try {
		const json = await req.json();
		const { name, type, currency } = CreateAccountSchema.parse(json);
		const account = await prisma.account.create({ data: { name, type, currency, userId: auth.userId } });
		return NextResponse.json({ account }, { status: 201 });
	} catch (_) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}
}