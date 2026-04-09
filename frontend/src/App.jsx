import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [myList, setMyList] = useState([]);
  const [text, setText] = useState('');
const url = '//_/backend/api/todos';

  function loadData() {
    axios.get(url)
      .then((response) => {
        setMyList(response.data);
      })
      .catch((error) => {
        alert("연결 실패!");
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    if (text === "") return;
    await axios.post(url, { title: text });
    setText("");
    loadData();
  };

  const handleDelete = async (targetId) => {
    if (window.confirm("진짜 지울까요?")) {
      await axios.delete(url + "/" + targetId);
      loadData();
    }
  };

  const handleCheck = async (targetId, currentStatus) => {
    await axios.put(url + "/" + targetId, { completed: !currentStatus });
    loadData();
  };

  return (
    <div className="bg-slate-200 min-h-screen p-10"> {/* 전체 배경색과 패딩 */}
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg"> {/* 카드 컨테이너 */}
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">나의 과제 투두리스트</h1>
        
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 적어주세요"
          />
          <button 
            type="submit" 
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            입력
          </button>
        </form>

        <ul className="space-y-3">
          {myList.map((item) => (
            <li key={item._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-indigo-600"
                  checked={item.completed}
                  onChange={() => handleCheck(item._id, item.completed)}
                />
                <span className={`text-lg ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.title}
                </span>
              </div>
              <button 
                onClick={() => handleDelete(item._id)} 
                className="text-red-500 hover:text-red-700 font-medium"
              >
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