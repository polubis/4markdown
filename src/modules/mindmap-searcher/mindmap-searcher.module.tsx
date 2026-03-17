import React from "react";
import { BiSearch } from "react-icons/bi";
import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import { Input } from "design-system/input";
import { c } from "design-system/c";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { readyMindmapPreviewSelector } from "store/mindmap-preview/selectors";
import type { MindmapPreviewNode } from "store/mindmap-preview/models";
import { navigate } from "gatsby";
import { useLocation } from "@reach/router";

const SEARCH_QUERY_PARAM_KEY = "mindmapSearch";
const MINDMAP_NODE_ID_PARAM_KEY = "mindmapNodeId";
const MAX_RESULTS_COUNT = 100;

type MindmapSearchResult = {
  id: string;
  name: string;
  description: string | null;
  path: string;
  type: MindmapPreviewNode["type"];
};

type SearchWorkerMessage = {
  query: string;
  results: MindmapSearchResult[];
};

const normalize = (value: string): string => value.trim().toLowerCase();

const readQueryParam = (param: string): string => {
  if (typeof window === "undefined") return "";

  const params = new URLSearchParams(window.location.search);
  return params.get(param) ?? "";
};

const toSearchResult = (node: MindmapPreviewNode): MindmapSearchResult => ({
  id: node.id,
  name: node.data.name,
  description: node.data.description ?? null,
  path: node.data.path,
  type: node.type,
});

const buildSearchWorker = (): Worker | null => {
  if (typeof window === "undefined" || typeof Worker === "undefined")
    return null;

  const workerCode = `
    self.onmessage = function (event) {
      var query = event.data.query || "";
      var normalizedQuery = query.trim().toLowerCase();
      var source = event.data.source || [];
      var maxResultsCount = event.data.maxResultsCount || 100;

      if (normalizedQuery.length === 0) {
        self.postMessage({
          query: query,
          results: source.slice(0, maxResultsCount),
        });
        return;
      }

      var filtered = source.filter(function (item) {
        var name = (item.name || "").toLowerCase();
        var description = (item.description || "").toLowerCase();
        var path = (item.path || "").toLowerCase();
        return (
          name.includes(normalizedQuery) ||
          description.includes(normalizedQuery) ||
          path.includes(normalizedQuery)
        );
      });

      self.postMessage({
        query: query,
        results: filtered.slice(0, maxResultsCount),
      });
    };
  `;

  const workerBlob = new Blob([workerCode], {
    type: "application/javascript",
  });
  const workerUrl = URL.createObjectURL(workerBlob);
  const worker = new Worker(workerUrl);
  URL.revokeObjectURL(workerUrl);
  return worker;
};

const MindmapSearcherContent = ({ onClose }: { onClose(): void }) => {
  const location = useLocation();
  const mindmap = useMindmapPreviewState((state) =>
    readyMindmapPreviewSelector(state.mindmap),
  );

  const [query, setQuery] = React.useState(() =>
    readQueryParam(SEARCH_QUERY_PARAM_KEY),
  );
  const [results, setResults] = React.useState<MindmapSearchResult[]>([]);
  const source = React.useMemo(
    () => mindmap.nodes.map((node) => toSearchResult(node)),
    [mindmap.nodes],
  );
  const workerRef = React.useRef<Worker | null>(null);
  const activeQueryRef = React.useRef(query);

  const replaceQueryParams = React.useCallback(
    (entries: Record<string, string | null>): void => {
      const params = new URLSearchParams(location.search);

      Object.entries(entries).forEach(([key, value]) => {
        if (value === null || value.length === 0) {
          params.delete(key);
          return;
        }

        params.set(key, value);
      });

      const nextSearch = params.toString();
      const currentSearch = location.search.replace(/^\?/, "");
      if (nextSearch === currentSearch) return;

      const nextUrl = `${location.pathname}${nextSearch.length > 0 ? `?${nextSearch}` : ``}`;
      void navigate(nextUrl, { replace: true });
    },
    [location.pathname, location.search],
  );

  React.useEffect(() => {
    activeQueryRef.current = query;
  }, [query]);

  React.useEffect(() => {
    replaceQueryParams({
      [SEARCH_QUERY_PARAM_KEY]: query.trim().length > 0 ? query : null,
    });
  }, [query, replaceQueryParams]);

  React.useEffect(() => {
    const worker = buildSearchWorker();
    workerRef.current = worker;

    if (!worker) return;

    const listener = (event: MessageEvent<SearchWorkerMessage>) => {
      if (event.data.query !== activeQueryRef.current) return;
      setResults(event.data.results);
    };

    worker.addEventListener("message", listener);

    return () => {
      worker.removeEventListener("message", listener);
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const worker = workerRef.current;

    if (!worker) {
      const normalizedQuery = normalize(query);

      if (normalizedQuery.length === 0) {
        setResults(source.slice(0, MAX_RESULTS_COUNT));
        return;
      }

      setResults(
        source
          .filter((item) => {
            const name = item.name.toLowerCase();
            const description = (item.description ?? "").toLowerCase();
            const path = item.path.toLowerCase();
            return (
              name.includes(normalizedQuery) ||
              description.includes(normalizedQuery) ||
              path.includes(normalizedQuery)
            );
          })
          .slice(0, MAX_RESULTS_COUNT),
      );
      return;
    }

    worker.postMessage({
      query,
      source,
      maxResultsCount: MAX_RESULTS_COUNT,
    });
  }, [query, source]);

  const handleSelect = React.useCallback(
    (resultId: string) => {
      replaceQueryParams({
        [MINDMAP_NODE_ID_PARAM_KEY]: resultId,
      });
      onClose();
    },
    [onClose, replaceQueryParams],
  );

  return (
    <Modal2 onClose={onClose}>
      <Modal2.Header
        title="Search Mindmap Nodes"
        closeButtonTitle="Close search"
      />
      <Modal2.Body>
        <Input
          aria-label="Search mindmap nodes"
          name="mindmap-node-search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search by name, description or path…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul className="mt-4 flex flex-col gap-2 list-none p-0 m-0">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                className={c(
                  "w-full flex flex-col items-start text-left rounded-lg px-4 py-3 border-2",
                  "bg-zinc-200 dark:bg-zinc-800/80 hover:bg-zinc-300 dark:hover:bg-zinc-700/80",
                  "border-zinc-300 dark:border-zinc-800",
                  "focus-visible:outline focus-visible:outline-2.5 focus-visible:outline-black dark:focus-visible:outline-white",
                )}
                onClick={() => handleSelect(result.id)}
              >
                <span className="font-semibold">{result.name}</span>
                {result.description && (
                  <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mt-1">
                    {result.description}
                  </span>
                )}
                <span className="text-sm mt-1">{result.path}</span>
              </button>
            </li>
          ))}
        </ul>
        {results.length === 0 && (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
            No nodes found for this query.
          </p>
        )}
      </Modal2.Body>
    </Modal2>
  );
};

const MindmapSearcherModule = ({ className }: { className?: string }) => {
  const searchModal = useSimpleFeature();

  return (
    <>
      <Button
        className={className}
        i={1}
        s={2}
        title="Open mindmap search"
        aria-label="Open mindmap search"
        onClick={searchModal.on}
      >
        <BiSearch aria-hidden="true" />
      </Button>
      {searchModal.isOn && <MindmapSearcherContent onClose={searchModal.off} />}
    </>
  );
};

export { MindmapSearcherModule, MINDMAP_NODE_ID_PARAM_KEY };
