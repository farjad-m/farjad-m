import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken } from "../../../../lib/jwt";

export async function POST() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("refresh_token")?.value;
		if (!token) return NextResponse.json({ error: "No refresh token" }, { status: 401 });
		const payload = await verifyRefreshToken(token);
		const access = await signAccessToken({ sub: payload.sub, email: payload.email });
		const res = NextResponse.json({ ok: true });
		res.cookies.set("access_token", access, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 15 });
		return res;
	} catch (_) {
		return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
	}
}