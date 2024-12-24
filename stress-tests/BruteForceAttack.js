import { check } from "k6";
import { loginUser } from "./AuthService.js";
import { baseUrl } from "./TestConstants.js";

export const options = {
  vus: 11,
  iterations: 11,
};

export default function () {
  const username = `user${__VU}${Math.random().toString(36).substring(2, 7)}`;
  const password = `pass_${__VU}${Math.random().toString(36).substring(2, 7)}`;

  const response = loginUser(baseUrl, username, password);

  check(response, {
    "Brute force attack blocked": (r) => r.status === 429,
    "Login unsuccessful": (r) => r.status === 401,
  });
}
