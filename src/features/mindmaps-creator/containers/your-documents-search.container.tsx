import type { DocumentDto } from 'api-4markdown-contracts';
import { Input, type InputProps } from 'design-system/input';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiSearch, BiX } from 'react-icons/bi';
import { docsStoreSelectors } from 'store/docs/docs.store';

interface YourDocumentsSearchContainerProps {
  onSelect(doc: DocumentDto): void;
  onChange(value: string): void;
}

const YourDocumentsSearchContainer = ({
  onSelect,
  onChange,
}: YourDocumentsSearchContainerProps) => {
  const [text, setText] = React.useState(``);
  const trimmedText = React.useMemo(() => text.trim(), [text]);
  const docsStore = docsStoreSelectors.useOk();
  const menu = useToggle();
  const blurTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredDocs: DocumentDto[] = React.useMemo(() => {
    const transformedText = trimmedText.toLowerCase();

    if (transformedText.length === 0) {
      return docsStore.docs;
    }

    return docsStore.docs.filter((document) =>
      document.name.toLowerCase().includes(transformedText),
    );
  }, [trimmedText, docsStore.docs]);

  const select = (doc: DocumentDto): void => {
    setText(doc.name);
    onSelect(doc);
  };

  const clearBlurTimeout = (): void => {
    const timeout = blurTimeout.current;
    timeout && clearTimeout(timeout);
  };

  const closeMenu = (): void => {
    clearBlurTimeout();
    blurTimeout.current = setTimeout(menu.close, 250);
  };

  const changeAndClose: InputProps['onChange'] = (e) => {
    const trimmedValue = e.target.value.trim();

    if (trimmedValue.length > 0) {
      menu.open();
    }

    setText(e.target.value);
    onChange(e.target.value);
  };

  const clearSearch = (): void => {
    setText(``);
    onChange(``);
  };

  React.useEffect(() => {
    return () => {
      clearBlurTimeout();
    };
  }, []);

  return (
    <div className="relative">
      <Input
        placeholder="Type to search"
        rightIcon={
          text ? (
            <button onClick={clearSearch} title="Clear documents search">
              <BiX size={20} />
            </button>
          ) : (
            <BiSearch />
          )
        }
        value={text}
        onFocus={menu.open}
        onBlur={closeMenu}
        onChange={changeAndClose}
      />

      {menu.opened && (
        <ul className="mt-1 absolute bg-gray-300 dark:bg-slate-800 shadow-md rounded-md left-0 right-0 overflow-hidden">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc, idx) => (
              <li
                tabIndex={idx}
                className="px-3 text-sm py-2 font-semibold cursor-pointer hover:bg-gray-400/70 bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-900/50"
                key={doc.id}
                onClick={() => {
                  select(doc);
                }}
              >
                {doc.name}
              </li>
            ))
          ) : (
            <li className="text-sm text-center px-3 py-2 bg-gray-300 dark:bg-slate-800">
              No documents
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export { YourDocumentsSearchContainer };
