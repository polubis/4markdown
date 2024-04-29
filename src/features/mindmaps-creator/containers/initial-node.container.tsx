import React from 'react';
import { type NodeProps } from 'reactflow';
import { useMindmapsCreatorCtx } from '../providers/mindmaps-creator.provider';
import { Tabs } from 'design-system/tabs';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Button } from 'design-system/button';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';

const InitialNodeContainer = (props: NodeProps) => {
  const [type, setType] = React.useState<`internal` | `external`>(`internal`);
  const siteMetadataStore = siteMetadataStoreSelectors.useReady();

  const { setNodes, setOperation } = useMindmapsCreatorCtx();

  const cancel = (): void => {
    setNodes((nodes) => nodes.filter((node) => node.id !== props.id));
  };

  const confirm: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    setOperation(`node-added`);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id ? { ...node, type: `internal` } : node,
      ),
    );
    setOperation(`idle`, 3000);
  };

  return (
    <form
      className="bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-4 rounded-md border max-w-[280px]"
      onSubmit={confirm}
    >
      <h6 className="text-xl mb-4">Add Node</h6>
      <section>
        <Tabs className="mb-5">
          <Tabs.Item
            type="button"
            active={type === `internal`}
            onClick={() => setType(`internal`)}
          >
            Internal
          </Tabs.Item>
          <Tabs.Item
            type="button"
            active={type === `external`}
            onClick={() => setType(`external`)}
          >
            External
          </Tabs.Item>
        </Tabs>
        {type === `internal` && (
          <>
            <Field
              className="mb-2"
              label="Source*"
              hint={
                <>
                  Select <strong>{siteMetadataStore.appName}</strong> document
                  or mindmap
                </>
              }
            >
              <Input placeholder="Type to search" />
            </Field>
          </>
        )}
      </section>
      <footer className="mt-8 flex space-x-2 justify-end">
        <Button
          type="button"
          i={1}
          s={2}
          auto
          title="Cancel node creation"
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button type="submit" i={2} s={2} auto title="Confirm node creation">
          Confirm
        </Button>
      </footer>
    </form>
  );
};

export { InitialNodeContainer };
