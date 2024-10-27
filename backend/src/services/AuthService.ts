import { isStringEmpty } from "@utils/StringUtils";

export async function login(email: string, password: string) {
  if (isStringEmpty(email) || isStringEmpty(password)) {
    return console.log("Email and password are required");
  }
  return console.log("login");
}
