import React from 'react';

type Props = {
  tables: string[];
};

export default function Sidebar({ tables }: Props) {
  return (
    <button className="flex flex-col min-w-[200px] items-center border-r p-2 h-full overflow-y-auto overflow-x-hidden">
      {tables.map((table) => (
        <div
          key={table}
          className="border-b hover:bg-blue-200 w-full py-2"
        >
          {table}
        </div>
      ))}
    </button>
  );
}
