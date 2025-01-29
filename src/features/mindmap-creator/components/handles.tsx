import { Handle, Position } from '@xyflow/react';
import React, { type ReactNode } from 'react';

const HandleX = ({ children }: { children: ReactNode }) => (
  <>
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-2.5 h-8 !left-[1px] rounded-md"
      type="target"
      position={Position.Left}
    />
    {children}
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 !right-[1px] rounded-full"
      type="source"
      position={Position.Right}
    />
  </>
);

const HandleY = ({ children }: { children: ReactNode }) => (
  <>
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-8 h-2.5 !top-[1px] rounded-md"
      type="target"
      position={Position.Top}
    />
    {children}
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 rounded-full"
      type="source"
      position={Position.Bottom}
    />
  </>
);

export { HandleY, HandleX };
