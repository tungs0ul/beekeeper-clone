import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { invoke } from '@tauri-apps/api';

type Props = {};

export default function Query({}: Props) {
  const [query, setQuery] = useState('');
  const [height, setHeight] = useState(window.innerHeight / 2);

  const [result, setResult] = useState('');

  useEffect(() => {
    const handle = () => {
      setHeight(Math.max(window.innerHeight / 2, 300));
    };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  });

  const execute = () => {
    setResult('');
    invoke('sql', { query }).then((rsp) => {
      setResult(JSON.stringify(rsp));
    });
  };

  //   return <div>Query</div>;
  return (
    <div className="flex flex-col h-full">
      <CodeMirror
        value={query}
        height={`${height}px`}
        //   extensions={[javascript({ jsx: true })]}
        //   onChange={onChange}
      />
      <button onClick={execute}>Execute</button>
      <div className="bg-blue-50 grow">{result}</div>
    </div>
  );
}
