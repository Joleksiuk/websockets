import jwt from "jsonwebtoken";
import { COOKIET_JWT_KEY, JWT_SECRET } from "../config";
import { signedCookies } from "cookie-parser";

export const isValidToken = (token: string | undefined): boolean => {
  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
};

export function extractJwtFromRequest(
  request: any,
  cookieSecret: string
): string | null {
  const cookiesHeader = request.headers.cookie || "";

  const cookies = signedCookies(
    Object.fromEntries(
      cookiesHeader.split("; ").map((cookie) => {
        const [key, value] = cookie.split("=");
        return [key, decodeURIComponent(value)];
      })
    ),
    cookieSecret
  );
  let jwt = cookies.access_token;

  if (!jwt && request.url) {
    const url = new URL(request.url, `http://localhost:8082`);
    jwt = url.searchParams.get(COOKIET_JWT_KEY);
  }

  return jwt || null;
}
