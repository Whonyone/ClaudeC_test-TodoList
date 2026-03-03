const BASE_URL = '/users';

// 로그인: username + password 일치하는 유저 반환
export async function login({ username, password }) {
  const response = await fetch(
    `${BASE_URL}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );
  if (!response.ok) {
    throw new Error('로그인 요청에 실패했습니다.');
  }
  const users = await response.json();
  if (users.length === 0) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  }
  return users[0];
}

// 회원가입: username 중복 확인 후 신규 유저 생성
export async function signup({ username, password }) {
  const checkResponse = await fetch(
    `${BASE_URL}?username=${encodeURIComponent(username)}`
  );
  if (!checkResponse.ok) {
    throw new Error('회원가입 요청에 실패했습니다.');
  }
  const existing = await checkResponse.json();
  if (existing.length > 0) {
    throw new Error('이미 사용 중인 아이디입니다.');
  }

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      createdAt: new Date().toISOString(),
    }),
  });
  if (!response.ok) {
    throw new Error('회원가입에 실패했습니다.');
  }
  return response.json();
}
