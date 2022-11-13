import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { invoke } from '@tauri-apps/api';
import { Response } from './App';
import { t } from '@tauri-apps/api/event-2a9960e7';

type Props = {};

type Row = {
  [key: string]: any;
};

export default function Query({}: Props) {
  const [query, setQuery] = useState('');
  const [height, setHeight] = useState(window.innerHeight / 2);

  const [result, setResult] = useState(['']);

  useEffect(() => {
    const handle = () => {
      setHeight(Math.max(window.innerHeight / 2, 300));
    };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  });

  const execute = () => {
    invoke('sql', { query }).then((rsp) => {
      let msg = (rsp as Response).message;
      let data: { [key: string]: number[] }[] = JSON.parse(msg);
      let x = Object.entries(data[0]).map((e) => ({
        key: e[0],
        value: e[1].map((elm) => String.fromCharCode(elm)).join(''),
      }));
      setResult([JSON.stringify(x)]);
    });
  };

  const onChange = (query: string) => setQuery(query);

  //   return <div>Query</div>;
  return (
    <div className="flex flex-col h-full">
      <CodeMirror
        value={query}
        height={`${height}px`}
        onChange={onChange}
      />
      <button onClick={execute}>Execute</button>
      <div className="bg-blue-50 grow">
        {result.map((row) => (
          <div key={row}>{JSON.stringify(row)}</div>
        ))}
      </div>
    </div>
  );
}
