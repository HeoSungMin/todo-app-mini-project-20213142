import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]); // 초기값은 반드시 빈 배열 []
  const [input, setInput] = useState('');

const url = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/todos' 
  : '/api/todos';

  // 2. 데이터 불러오기 함수
  const fetchTodos = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // [핵심] 서버 응답이 배열인지 확인 후 저장 (에러 방지)
      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error("데이터 형식이 배열이 아닙니다:", data);
        setTodos([]); // 형식이 틀리면 빈 배열로 초기화하여 에러 방지
      }
    } catch (err) {
      console.error("서버 연결 실패:", err);
      alert("서버와 연결할 수 없습니다!");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 3. 할 일 추가 함수
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input }),
      });
      
      if (response.ok) {
        setInput('');
        fetchTodos(); // 추가 후 목록 새로고침
      }
    } catch (err) {
      console.error("추가 실패:", err);
    }
  };

  return (
    <div className="App">
      <h1>나의 과제 투두리스트</h1>
      <form onSubmit={addTodo}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="할 일을 입력하세요"
        />
        <button type="submit">입력</button>
      </form>

      <ul>
        {/* [핵심] 안전하게 데이터 렌더링 */}
        {Array.isArray(todos) && todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo._id || todo.id}>
              {todo.title}
            </li>
          ))
        ) : (
          <p>할 일이 없거나 데이터를 불러오는 중입니다...</p>
        )}
      </ul>
    </div>
  );
}

export default App;