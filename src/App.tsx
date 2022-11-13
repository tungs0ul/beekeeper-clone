import { useState } from 'react';
import Connection from './Connection';
import Sidebar from './Sidebar';
import Query from './Query';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [pages, setPages] = useState({
    query: [],
  });
  const [page, setPage] = useState('query');
  if (!tables.length) {
    return <Connection setTables={setTables} />;
  }

  return (
    <div className="flex bg-[#EFF5F5] h-screen overflow-hidden">
      <Sidebar tables={tables} />
      <div className="grow flex flex-col bg-gray-200">
        <div className="flex gap-2 bg-white">
          {Object.keys(pages).map((key) => (
            <button
              key={key}
              className="border border-blue-300 px-2 bg-yellow-50"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="grow">
          {page === 'query' ? <Query /> : <></>}
        </div>
      </div>
    </div>
  );
}

export default App;
