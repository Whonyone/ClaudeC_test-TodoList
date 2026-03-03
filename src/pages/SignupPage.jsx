import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/authApi';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (form.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await signup({ username: form.username, password: form.password });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>회원가입</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username">아이디</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="4자 이상 입력하세요"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirm">비밀번호 확인</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className={styles.link}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
