import { Handle, Position } from '@xyflow/react';
import React, { type ReactNode } from 'react';

const HandleX = ({ children }: { children: ReactNode }) => (
  <>
    <Handle
      className="bg-zinc-200! dark:bg-gray-950! border-zinc-400 dark:border-zinc-700 border-2 w-3.5 h-10 left-[1px]! rounded-md"
      type="target"
      position={Position.Left}
    />
    {children}
    <Handle
      className="bg-zinc-200! dark:bg-gray-950! border-zinc-400 dark:border-zinc-700 border-2 w-5 h-5 right-[1px]! rounded-full"
      type="source"
      position={Position.Right}
    />
  </>
);

const HandleY = ({ children }: { children: ReactNode }) => (
  <>
    <Handle
      className="bg-zinc-200! dark:bg-gray-950! border-zinc-400 dark:border-zinc-700 border-2 w-10 h-3.5 top-[1px]! rounded-md"
      type="target"
      position={Position.Top}
    />
    {children}
    <Handle
      className="bg-zinc-200! dark:bg-gray-950! border-zinc-400 dark:border-zinc-700 border-2 w-5 h-5 rounded-full"
      type="source"
      position={Position.Bottom}
    />
  </>
);

export { HandleY, HandleX };
