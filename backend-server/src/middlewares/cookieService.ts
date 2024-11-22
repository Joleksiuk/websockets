import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { signedCookies } from "cookie-parser"; // For signed cookie validation

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
  cookieSecret: string,
  cookieKey: string
): string | null {
  const cookiesHeader = request.headers.cookie || "";

  console.log("Cookies header: ", cookiesHeader);
  const cookies = signedCookies(
    Object.fromEntries(
      cookiesHeader.split("; ").map((cookieStr) => {
        const [key, value] = cookieStr.split("=");
        return [key, value];
      })
    ),
    cookieSecret
  );

  let jwt = cookies[cookieKey];

  if (!jwt && request.url) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    jwt = url.searchParams.get(cookieKey);
  }

  return jwt || null;
}
