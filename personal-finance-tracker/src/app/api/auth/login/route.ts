import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { verifyPassword } from "../../../../lib/crypto";
import { signAccessToken, signRefreshToken } from "../../../../lib/jwt";

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
	try {
		const json = await req.json();
		const { email, password } = LoginSchema.parse(json);
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		const ok = await verifyPassword(password, user.passwordHash);
		if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

		const access = await signAccessToken({ sub: user.id, email: user.email });
		const refresh = await signRefreshToken({ sub: user.id, email: user.email });
		const res = NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 200 });
		res.cookies.set("refresh_token", refresh, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
		res.cookies.set("access_token", access, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 15 });
		return res;
	} catch (_) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}
}