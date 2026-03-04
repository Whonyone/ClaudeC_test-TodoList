import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTodos, createTodo, toggleTodo, deleteTodo } from '../api/todoApi';
import { PRIORITY_ORDER } from '../constants/todo';
import TodoItem from '../components/TodoItem';
import styles from './TodoPage.module.css';

const BUILTIN_TABS = ['전체', '우선순위'];

const EMPTY_FORM = {
  title: '',
  detail: '',
  duedate: '',
  duetime: '',
  priority: 'medium',
  category: '',
};

export default function TodoPage() {
  const { user, logoutUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadTodos = useCallback(async () => {
    try {
      const data = await getTodos({ userId: user.id });
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 브라우저 탭 복귀 시 자동 갱신
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadTodos();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [loadTodos]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) return;
    setSubmitting(true);
    try {
      await createTodo({ ...form, title: trimmedTitle, userId: user.id });
      setForm(EMPTY_FORM);
      setShowForm(false);
      await loadTodos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await toggleTodo(todo.id, !todo.completed);
      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRequest = (todo) => {
    setPendingDelete(todo);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTodo(pendingDelete.id);
      setPendingDelete(null);
      await loadTodos();
    } catch (err) {
      setError(err.message);
      setPendingDelete(null);
    }
  };

  const userCategories = Array.from(new Set(todos.map((t) => t.category).filter(Boolean)));
  const categories = [...BUILTIN_TABS, ...userCategories];

  const getFilteredTodos = () => {
    const byDate = (arr) =>
      [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const byPriority = (arr) =>
      [...arr].sort(
        (a, b) =>
          (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1) ||
          new Date(b.createdAt) - new Date(a.createdAt)
      );

    if (selectedCategory === '전체') return byDate(todos);
    if (selectedCategory === '우선순위') return byPriority(todos);
    return byDate(todos.filter((t) => t.category === selectedCategory));
  };

  const filteredTodos = getFilteredTodos();
  const pending = filteredTodos.filter((t) => !t.completed);
  const completed = filteredTodos.filter((t) => t.completed);

  return (
    <div className={styles.page}>
      {pendingDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p className={styles.confirmText}>
              <strong>'{pendingDelete.title}'</strong>을 삭제합니다.
            </p>
            <div className={styles.confirmRow}>
              <button className={styles.confirmDeleteBtn} onClick={handleDeleteConfirm}>
                삭제
              </button>
              <button className={styles.confirmCancelBtn} onClick={() => setPendingDelete(null)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <h1 className={styles.headerTitle}>내 할 일</h1>
        <div className={styles.headerRight}>
          <span className={styles.username}>{user.username}</span>
          <button className={styles.logoutBtn} onClick={logoutUser}>
            로그아웃
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {error && (
          <div className={styles.error}>
            <span>{error}</span>
            <button className={styles.errorClose} onClick={() => setError('')} aria-label="닫기">
              ×
            </button>
          </div>
        )}

        <div className={styles.addSection}>
          {showForm ? (
            <form onSubmit={handleCreate} className={styles.form}>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="할 일 제목 *"
                required
                autoFocus
                className={styles.input}
              />
              <input
                name="detail"
                value={form.detail}
                onChange={handleChange}
                placeholder="상세 내용"
                className={styles.input}
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="카테고리 (예: 업무, 개인, 건강)"
                className={styles.input}
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {userCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <div className={styles.formRow}>
                <input
                  name="duedate"
                  type="date"
                  value={form.duedate}
                  onChange={handleChange}
                  className={styles.input}
                />
                <input
                  name="duetime"
                  type="time"
                  value={form.duetime}
                  onChange={handleChange}
                  className={styles.input}
                />
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="high">높음</option>
                  <option value="medium">보통</option>
                  <option value="low">낮음</option>
                </select>
              </div>
              <div className={styles.formRow}>
                <button type="submit" className={styles.primaryBtn} disabled={submitting}>
                  {submitting ? '추가 중...' : '추가'}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <button className={styles.addBtn} onClick={() => setShowForm(true)}>
              + 새 할 일 추가
            </button>
          )}
        </div>

        {!loading && (
          <div className={styles.categoryTabs}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.categoryTabActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className={styles.empty}>불러오는 중...</p>
        ) : (
          <>
            <section>
              <h2 className={styles.sectionTitle}>
                진행 중 <span className={styles.count}>{pending.length}</span>
              </h2>
              {pending.length === 0 ? (
                <p className={styles.empty}>완료할 할 일이 없습니다.</p>
              ) : (
                <ul className={styles.list}>
                  {pending.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggle}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  ))}
                </ul>
              )}
            </section>

            {completed.length > 0 && (
              <section>
                <h2 className={styles.sectionTitle}>
                  완료 <span className={styles.count}>{completed.length}</span>
                </h2>
                <ul className={styles.list}>
                  {completed.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggle}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
