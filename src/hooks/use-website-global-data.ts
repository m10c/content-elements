import { useEffect, useState } from 'react';

import type {
  PreviewMessage,
  UseWebsitePageDataResult,
} from './use-website-page-data';

type UseWebsiteGlobalDataConfig = {
  /** The global's CMS page path, e.g. 'footer' or 'navigation'. */
  path: string;
  /** Server-fetched published data, passed from the site layout. */
  initialData?: Record<string, unknown> | null;
};

// Reads a global (footer, navigation, …): published `initialData` normally, and
// in preview the live edits from the message's `globals` map, keyed by `path`.
export default function useWebsiteGlobalData(
  config: UseWebsiteGlobalDataConfig,
): UseWebsitePageDataResult {
  const [previewData, setPreviewData] = useState<Record<
    string,
    unknown
  > | null>(null);

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
      const globalData = message.globals?.[config.path];
      if (globalData !== undefined) {
        setPreviewData(globalData as Record<string, unknown>);
      }
    }

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'm10c-cms-preview-ready' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, [isPreview, config.path]);

  return {
    data:
      isPreview && previewData !== null
        ? previewData
        : (config.initialData ?? {}),
    isPreview,
    isLoading: false,
  };
}
