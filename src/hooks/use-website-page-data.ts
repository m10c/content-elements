import { useEffect, useState } from 'react';

import type { UseWebsitePageDataResult } from '../types';
import usePreviewReceiver from './use-preview-receiver';

type UseWebsitePageDataConfig = {
  path: string;
  /** Server-fetched published data; the SSR source outside preview. */
  initialData?: Record<string, unknown> | null;
  /** Client fetcher, used only when `initialData` is absent. */
  fetchData?: () => Promise<Record<string, unknown>>;
};

export default function useWebsitePageData(
  config: UseWebsitePageDataConfig,
): UseWebsitePageDataResult {
  const [apiData, setApiData] = useState<Record<string, unknown>>(
    config.initialData ?? {},
  );
  const [isLoading, setIsLoading] = useState(false);

  const [isPreview] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      new URLSearchParams(window.location.search).has('preview') ||
      window.self !== window.top
    );
  });

  const previewData = usePreviewReceiver({
    pagePath: config.path,
    enabled: isPreview,
  });

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
