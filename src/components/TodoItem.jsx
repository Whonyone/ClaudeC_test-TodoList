import { PRIORITY_LABEL, PRIORITY_COLOR } from '../constants/todo';
import styles from '../pages/TodoPage.module.css';

export default function TodoItem({ todo, onToggle, onDeleteRequest }) {
  return (
    <li className={`${styles.item} ${todo.completed ? styles.itemDone : ''}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(todo)}
        aria-label={todo.completed ? '완료 취소' : '완료'}
      >
        {todo.completed ? '✓' : ''}
      </button>
      <div className={styles.itemBody}>
        <span className={styles.itemTitle}>{todo.title}</span>
        {todo.detail && <span className={styles.itemDetail}>{todo.detail}</span>}
        <div className={styles.itemMeta}>
          {todo.category && (
            <span className={styles.categoryBadge}>{todo.category}</span>
          )}
          <span
            className={styles.priority}
            style={{ color: PRIORITY_COLOR[todo.priority] }}
          >
            {PRIORITY_LABEL[todo.priority]}
          </span>
          {todo.duedate && (
            <span className={styles.due}>
              {todo.duedate} {todo.duetime}
            </span>
          )}
        </div>
      </div>
      <button
        className={styles.deleteBtn}
        onClick={() => onDeleteRequest(todo)}
        aria-label="삭제"
      >
        ✕
      </button>
    </li>
  );
}
