import http from "k6/http";
import { check, hmac } from "k6";

export function registerUser(baseUrl, username, password, role = "user") {
  const payload = JSON.stringify({
    username: username,
    password: password,
    role: role,
  });

  const headers = {
    "Content-Type": "application/json",
  };

  const response = http.post(`${baseUrl}/users`, payload, { headers });

  check(response, {
    "User registered successfully": (r) => r.status === 201,
  });

  return response;
}

export function loginUser(baseUrl, username, password) {
  const payload = JSON.stringify({
    username: username,
    password: password,
  });

  const headers = {
    "Content-Type": "application/json",
  };

  const response = http.post(`${baseUrl}/login`, payload, { headers });
  console.log(`Attempting login with username: ${username}`);
  console.log(`Response status: ${response.status}`);
  // check(response, {
  //   "Login successful": (r) => r.status === 200,
  // });

  const loginData = response.json();
  return {
    username: loginData.username,
    userId: loginData.userId,
    jwt: loginData.jwt,
  };
}

export function generateRandomIpAddress() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}
