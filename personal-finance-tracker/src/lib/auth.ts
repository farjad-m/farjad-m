import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";

export type AuthContext = {
	userId: string;
	email: string;
};

export async function getAuthFromRequest(req: Request): Promise<AuthContext | null> {
	try {
		const auth = req.headers.get("authorization");
		if (auth && auth.startsWith("Bearer ")) {
			const token = auth.substring("Bearer ".length);
			const payload = await verifyAccessToken(token);
			return { userId: payload.sub, email: payload.email };
		}
		const cookieStore = await cookies();
		const token = cookieStore.get("access_token")?.value;
		if (token) {
			const payload = await verifyAccessToken(token);
			return { userId: payload.sub, email: payload.email };
		}
		return null;
	} catch (_) {
		return null;
	}
}