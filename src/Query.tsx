import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { invoke } from '@tauri-apps/api';
import { Response } from './App';

type Props = {};

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
      let data: { [key: string]: any }[] = JSON.parse(
        (rsp as Response).message
      );
      setResult(
        data.map((row) => {
          let result = JSON.stringify(Object.values(row));
          return result;
        })
      );
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
