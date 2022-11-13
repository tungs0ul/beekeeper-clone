import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { Response } from './App';

type Props = {
  setTables: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Connection({ setTables }: Props) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const connect = () => {
    invoke('connect', { url }).then((rsp: any) => {
      if (rsp.status === 500) {
        setError(`${(rsp as Response).message}`);
      } else {
        let json: { tablename: number[] }[] = JSON.parse(rsp.message);
        let tables = json.map((e) =>
          e.tablename.map((elm) => String.fromCharCode(elm)).join('')
        );
        setTables(tables);
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
