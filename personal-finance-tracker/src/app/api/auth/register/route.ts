import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { hashPassword } from "../../../../lib/crypto";
import { signAccessToken, signRefreshToken } from "../../../../lib/jwt";

const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	locale: z.string().default("en-US"),
	baseCurrency: z.string().default("USD"),
	tz: z.string().default("UTC"),
});

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const { email, password, locale, baseCurrency, tz } = RegisterSchema.parse(json);
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) return NextResponse.json({ error: "Email in use" }, { status: 409 });

		const passwordHash = await hashPassword(password);
		const user = await prisma.user.create({
			data: { email, passwordHash, locale, baseCurrency, tz },
		});

		const access = await signAccessToken({ sub: user.id, email: user.email });
		const refresh = await signRefreshToken({ sub: user.id, email: user.email });

		const res = NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 });
		res.cookies.set("refresh_token", refresh, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
		res.cookies.set("access_token", access, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 15 });
		return res;
	} catch {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}
}