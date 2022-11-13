import { useState } from 'react';
import { invoke } from '@tauri-apps/api';

type Props = {
  setTables: React.Dispatch<React.SetStateAction<string[]>>;
};

type Response = {
  status: number;
  message: string;
};
export default function Connection({ setTables }: Props) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const connect = () => {
    invoke('connect', { url }).then((rsp) => {
      if ((rsp as Response).status === 500) {
        setError((rsp as Response).message);
      } else {
        let tables: { tablename: string }[] = JSON.parse(
          (rsp as Response).message
        );
        setTables(tables.map((table) => table.tablename));
      }
    });
  };

  return (
    <div className="p-4 h-screen grid place-items-center">
      <div className="w-full gap-4 grid">
        <div className="text-red-500 text-center">{error}</div>
        <div className="flex gap-2 w-full items-center">
          Url:
          <input
            type="text"
            className="border grow border-blue-300 px-3 py-2"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={connect}
            className="p-2 border px-3 border-green-300 bg-green-200 rounded hover:bg-green-100"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
