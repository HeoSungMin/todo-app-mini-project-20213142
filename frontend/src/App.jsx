// import { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [todos, setTodos] = useState([]);
//   const [input, setInput] = useState('');

//   // 백엔드 API 주소 (로컬 테스트용)
//   const API_URL = 'http://localhost:5000/api/todos';

//   // 1. [GET] 목록 불러오기
//   const fetchTodos = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setTodos(res.data);
//     } catch (err) {
//       console.error("데이터 로딩 실패:", err);
//     }
//   };

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   // 2. [POST] 할 일 추가하기
//   const addTodo = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     try {
//       await axios.post(API_URL, { title: input });
//       setInput(''); // 입력창 비우기
//       fetchTodos(); // 목록 새로고침
//     } catch (err) {
//       console.error("추가 실패:", err);
//     }
//   };

//   // 3. [PUT] 완료 상태 토글 (체크박스)
//   const toggleTodo = async (id, completed) => {
//     try {
//       await axios.put(`${API_URL}/${id}`, { completed: !completed });
//       fetchTodos();
//     } catch (err) {
//       console.error("수정 실패:", err);
//     }
//   };

//   // 4. [DELETE] 할 일 삭제하기
//   const deleteTodo = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchTodos();
//     } catch (err) {
//       console.error("삭제 실패:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
//         <h1 className="text-3xl font-black mb-8 text-center text-indigo-600 tracking-tight">
//           MY TODO LIST
//         </h1>
        
//         {/* 입력 폼 */}
//         <form onSubmit={addTodo} className="flex gap-2 mb-8">
//           <input
//             type="text"
//             className="flex-1 border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="오늘 할 일은?"
//           />
//           <button className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all">
//             추가
//           </button>
//         </form>

//         {/* 할 일 목록 */}
//         <ul className="space-y-3">
//           {todos.map((todo) => (
//             <li 
//               key={todo._id} 
//               className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all"
//             >
//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   className="w-5 h-5 cursor-pointer accent-indigo-600"
//                   checked={todo.completed}
//                   onChange={() => toggleTodo(todo._id, todo.completed)}
//                 />
//                 <span className={`text-lg font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
//                   {todo.title}
//                 </span>
//               </div>
//               <button 
//                 onClick={() => deleteTodo(todo._id)}
//                 className="text-rose-400 hover:text-rose-600 font-bold p-2 transition-colors"
//               >
//                 삭제
//               </button>
//             </li>
//           ))}
//         </ul>

//         {/* 데이터가 없을 때 메시지 */}
//         {todos.length === 0 && (
//           <div className="text-center py-10">
//             <p className="text-slate-400 font-medium">할 일이 없네요. 푹 쉬세요! ☕</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // 1. 변수명을 더 직관적으로 (todos -> myList)
  const [myList, setMyList] = useState([]);
  const [text, setText] = useState('');
  const url = 'http://localhost:5000/api/todos';

  // 2. 화살표 함수 대신 일반 function 키워드 사용 (초보자가 많이 씀)
  function loadData() {
    axios.get(url)
      .then((response) => {
        setMyList(response.data);
        console.log("데이터를 성공적으로 가져왔습니다!"); // 로그 남기기
      })
      .catch((error) => {
        alert("서버 연결에 문제가 있어요!"); // 사용자 알림 추가
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  // 3. 기능을 하나하나 풀어서 작성
  const handleAdd = async (event) => {
    event.preventDefault();
    if (text === "") return;
    
    await axios.post(url, { title: text });
    setText(""); 
    loadData();
  };

  const handleDelete = async (targetId) => {
    // 4. 삭제 전 확인창 띄우기 (학생들이 자주 넣는 기능)
    if (window.confirm("진짜로 이 할 일을 지울까요?")) {
      await axios.delete(url + "/" + targetId);
      loadData();
    }
  };

  const handleCheck = async (targetId, currentStatus) => {
    await axios.put(url + "/" + targetId, { completed: !currentStatus });
    loadData();
  };

  return (
    <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh', padding: '40px' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#4f46e5', fontWeight: '800' }}>나의 과제 투두리스트</h1>
        
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 적어주세요"
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }}>
            입력
          </button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {myList.map((item) => (
            <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <div>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleCheck(item._id, item.completed)}
                  style={{ marginRight: '10px' }}
                />
                <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#94a3b8' : '#1e293b' }}>
                  {item.title}
                </span>
              </div>
              <button onClick={() => handleDelete(item._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
