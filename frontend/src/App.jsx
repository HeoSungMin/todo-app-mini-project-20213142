import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // 데이터 저장소 (상태 관리)
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // API 주소 설정
  const apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/todos' 
    : '/api/todos';

  // 1. 서버에서 데이터 가져오기 (Read)
  function fetchTodos() {
    axios.get(apiUrl)
      .then(function(response) {
        setTodos(response.data);
      })
      .catch(function(error) {
        console.log("데이터를 가져오는데 실패했어요:", error);
      });
  }

  // 화면이 처음 켜질 때 실행
  useEffect(function() {
    fetchTodos();
  }, []);

  // 2. 새로운 할 일 만들기 (Create)
  function addTodo(event) {
    event.preventDefault(); // 페이지 새로고침 방지

    if (input === '') {
      alert("할 일을 입력해주세요!");
      return;
    }

    const newTodo = { title: input };

    axios.post(apiUrl, newTodo)
      .then(function() {
        setInput(''); // 입력칸 비우기
        fetchTodos(); // 목록 새로고침
      });
  }

  // 3. 할 일 완료 체크하기 (Update)
  function toggleTodo(todo) {
    const updatedData = { completed: !todo.completed };

    axios.put(apiUrl + "/" + todo._id, updatedData)
      .then(function() {
        fetchTodos(); // 목록 새로고침
      });
  }

  // 4. 할 일 삭제하기 (Delete)
  function deleteTodo(id) {
    axios.delete(apiUrl + "/" + id)
      .then(function() {
        fetchTodos(); // 목록 새로고침
      });
  }

  // 화면에 보여질 HTML 부분
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-10">
      
      <h1 className="text-4xl font-black text-blue-600 mb-8">
        Heo Seung Min's Todo
      </h1>

      {/* 입력창 부분 */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mb-6">
        <form onSubmit={addTodo} className="flex gap-2">
          <input
            type="text"
            placeholder="오늘 뭐 할까?"
            className="flex-grow border-2 border-gray-200 p-3 rounded-lg focus:border-blue-400 outline-none"
            value={input}
            onChange={function(e) { setInput(e.target.value); }}
          />
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600">
            추가
          </button>
        </form>
      </div>

      {/* 리스트 부분 */}
      <div className="w-full max-w-md">
        {todos.map(function(todo) {
          return (
            <div key={todo._id} className="bg-white p-4 rounded-lg shadow-sm mb-3 flex justify-between items-center border-l-8 border-blue-400">
              
              {/* 할 일 텍스트 (클릭하면 완료 표시) */}
              <span 
                onClick={function() { toggleTodo(todo); }}
                className={todo.completed ? "line-through text-gray-400 cursor-pointer" : "text-gray-800 font-medium cursor-pointer"}
              >
                {todo.title}
              </span>

              {/* 삭제 버튼 */}
              <button 
                onClick={function() { deleteTodo(todo._id); }}
                className="bg-red-100 text-red-500 px-3 py-1 rounded-md hover:bg-red-200 transition"
              >
                삭제
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default App;