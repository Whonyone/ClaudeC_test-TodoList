const BASE_URL = '/todos';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// GET /todos - 목록 조회
// userId: 특정 유저의 todos만 조회
// sortByPriority: true이면 high → medium → low 순으로 정렬
export async function getTodos({ userId, sortByPriority = false } = {}) {
  const params = new URLSearchParams();
  if (userId != null) params.append('userId', userId);
  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('TODO 목록을 불러오는데 실패했습니다.');
  }
  const todos = await response.json();

  if (sortByPriority) {
    return todos.sort(
      (a, b) =>
        (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
    );
  }

  return todos;
}

// POST /todos - 새 TODO 생성
// priority: 'high' | 'medium' | 'low' (기본값: 'medium')
// category: 자유 문자열 (기본값: null)
export async function createTodo({
  userId,
  title,
  detail = '',
  duedate = null,
  duetime = null,
  priority = 'medium',
  category = null,
}) {
  const newTodo = {
    userId,
    title,
    detail,
    completed: false,
    createdAt: new Date().toISOString(),
    duedate,
    duetime,
    priority,
    category,
  };

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo),
  });

  if (!response.ok) {
    throw new Error('TODO 생성에 실패했습니다.');
  }
  return response.json();
}

// PUT /todos/:id - 완료 상태 토글
export async function toggleTodo(id, completed) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error('TODO 상태 변경에 실패했습니다.');
  }
  return response.json();
}

// DELETE /todos/:id - TODO 삭제
export async function deleteTodo(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('TODO 삭제에 실패했습니다.');
  }
}
