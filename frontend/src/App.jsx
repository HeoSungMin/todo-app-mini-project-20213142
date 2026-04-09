import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/todos' 
    : '/api/todos';

  function fetchTodos() {
    axios.get(apiUrl)
      .then(function(response) {
        setTodos(response.data);
      })
      .catch(function(error) {
        console.log("목록을 가져오는데 실패했어요:", error);
      });
  }

  useEffect(function() {
    fetchTodos();
  }, []);

  function addTodo(event) {
    event.preventDefault();
    if (input === '') return;

    axios.post(apiUrl, { title: input })
      .then(function() {
        setInput('');
        fetchTodos();
      });
  }

  function toggleTodo(todo) {
    const updatedData = { completed: !todo.completed };

    axios.put(apiUrl + "/" + todo._id, updatedData)
      .then(function() {
        fetchTodos();
      });
  }

  function deleteTodo(id) {
    axios.delete(apiUrl + "/" + id)
      .then(function() {
        fetchTodos();
      });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-10">
      
      <h1 className="text-4xl font-black text-blue-600 mb-8">
        Heo sung min's Todo List
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-6">
        <form onSubmit={addTodo} className="flex gap-2">
          <input
            type="text"
            className="flex-grow border-2 p-2 rounded-lg outline-none focus:border-blue-400"
            value={input}
            onChange={function(e) { setInput(e.target.value); }}
            placeholder="할 일을 적어주세요"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">
            추가
          </button>
        </form>
      </div>

      <div className="w-full max-w-md space-y-3">
        {todos.map(function(todo) {
          return (
            <div key={todo._id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-100">
              
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 cursor-pointer"
                  checked={todo.completed} 
                  onChange={function() { toggleTodo(todo); }} 
                />
                
                <span className={todo.completed ? "line-through text-gray-400" : "text-gray-800"}>
                  {todo.title}
                </span>
              </div>

              <button 
                onClick={function() { deleteTodo(todo._id); }}
                className="text-red-400 hover:text-red-600 text-sm font-bold"
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