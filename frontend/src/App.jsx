import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // Vercel 배포 환경을 고려한 API 주소 (상대 경로 사용)
 const apiUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/todos' 
  : '/api/todos';

  // 1. 목록 불러오기 (GET)
  const fetchTodos = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTodos(response.data);
    } catch (err) {
      console.error("불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. 할 일 추가 (POST)
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await axios.post(apiUrl, { title: input });
      setInput('');
      fetchTodos();
    } catch (err) {
      console.error("추가 실패:", err);
    }
  };

  // 3. 완료 상태 토글 (PUT)
  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { completed: !completed });
      fetchTodos();
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  // 4. 할 일 삭제 (DELETE)
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          My Todo List
        </h1>
        
        <form onSubmit={addTodo} className="flex mb-4">
          <input
            type="text"
            className="flex-grow border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="할 일을 입력하세요..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition"
          >
            추가
          </button>
        </form>

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li 
              key={todo._id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <div 
                className={`flex-grow cursor-pointer ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                onClick={() => toggleTodo(todo._id, todo.completed)}
              >
                {todo.title}
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="ml-2 text-red-500 hover:text-red-700 font-bold"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
        
        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">할 일이 없습니다!</p>
        )}
      </div>
    </div>
  );
}

export default App;