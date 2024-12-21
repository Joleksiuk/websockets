export function createChatroom(baseUrl, jwt, name) {
  const payload = JSON.stringify({
    name: name,
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const response = http.post(`${baseUrl}/chatrooms`, payload, { headers });

  check(response, {
    "Chatroom created successfully": (r) => r.status === 201,
  });

  return response.json();
}

export function addUserToChatroom(baseUrl, jwt, chatroomId, userId) {
  const payload = JSON.stringify({
    userId: userId,
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const response = http.post(
    `${baseUrl}/chatrooms/${chatroomId}/users`,
    payload,
    { headers }
  );

  check(response, {
    "User added to chatroom successfully": (r) => r.status === 200,
  });

  return response.json();
}

export function sendMessageToChatroom(baseUrl, jwt, chatroomId, message) {
  const payload = JSON.stringify({
    message: message,
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const response = http.post(
    `${baseUrl}/chatrooms/${chatroomId}/messages`,
    payload,
    { headers }
  );

  check(response, {
    "Message sent successfully": (r) => r.status === 201,
  });

  return response.json();
}

export function joinChatroom(baseUrl, jwt, chatroomId) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const response = http.get(`${baseUrl}/chatrooms/${chatroomId}`, { headers });

  check(response, {
    "Joined chatroom successfully": (r) => r.status === 200,
  });

  return response.json();
}
