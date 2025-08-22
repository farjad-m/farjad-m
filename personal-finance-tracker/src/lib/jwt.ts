import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

function getAccessSecret(): Uint8Array {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error("JWT_SECRET is not set");
	return encoder.encode(secret);
}

function getRefreshSecret(): Uint8Array {
	const secret = process.env.JWT_REFRESH_SECRET;
	if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");
	return encoder.encode(secret);
}

export type JwtPayload = { sub: string; email: string };

export async function signAccessToken(payload: JwtPayload): Promise<string> {
	return new SignJWT(payload as unknown as Record<string, unknown>)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("15m")
		.sign(getAccessSecret());
}

export async function signRefreshToken(payload: JwtPayload): Promise<string> {
	return new SignJWT(payload as unknown as Record<string, unknown>)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("30d")
		.sign(getRefreshSecret());
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
	const { payload } = await jwtVerify(token, getAccessSecret());
	return payload as unknown as JwtPayload;
}

export async function verifyRefreshToken(token: string): Promise<JwtPayload> {
	const { payload } = await jwtVerify(token, getRefreshSecret());
	return payload as unknown as JwtPayload;
}