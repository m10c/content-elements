import { useEffect, useState } from 'react';

export type PreviewMessage = {
  type: 'm10c-cms-preview';
  content: Record<string, unknown>;
  pagePath: string;
  /** Global content (footer, navigation, …) keyed by page path. */
  globals?: Record<string, unknown>;
};

type UseWebsitePageDataConfig = {
  path: string;
  /** Server-fetched published data; the SSR source outside preview. */
  initialData?: Record<string, unknown> | null;
  /** Client fetcher, used only when `initialData` is absent. */
  fetchData?: () => Promise<Record<string, unknown>>;
};

export type UseWebsitePageDataResult = {
  data: Record<string, unknown>;
  isPreview: boolean;
  isLoading: boolean;
};

export default function useWebsitePageData(
  config: UseWebsitePageDataConfig,
): UseWebsitePageDataResult {
  const [apiData, setApiData] = useState<Record<string, unknown>>(
    config.initialData ?? {},
  );
  const [previewData, setPreviewData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isPreview] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      new URLSearchParams(window.location.search).has('preview') ||
      window.self !== window.top
    );
  });

  useEffect(() => {
    if (!isPreview) return;

    function handleMessage(event: MessageEvent) {
      const message = event.data as PreviewMessage;
      if (message?.type !== 'm10c-cms-preview') return;
      // Ignore edits aimed at another page/global so this page keeps its data.
      if (message.pagePath === config.path) {
        setPreviewData(message.content);
      }
    }

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'm10c-cms-preview-ready' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, [isPreview, config.path]);

  useEffect(() => {
    if (isPreview || config.initialData || !config.fetchData) return;

    setIsLoading(true);
    config.fetchData().then((result) => {
      setApiData(result);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, config.initialData, config.fetchData, config.path]);

  return {
    // Fall back to published data until this page's own edits arrive.
    data: isPreview ? (previewData ?? apiData) : apiData,
    isPreview,
    isLoading,
  };
}
