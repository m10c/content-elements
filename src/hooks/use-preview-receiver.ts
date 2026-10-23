import { useEffect, useState } from 'react';

import { PREVIEW_MESSAGE } from '../constants';
import type { PreviewMessage } from '../types';

type UsePreviewReceiverConfig = {
  pagePath: string;
  enabled?: boolean;
  /** Origins allowed to send content. Any origin is accepted when left out. */
  allowedOrigins?: readonly string[];
};

export default function usePreviewReceiver<T = Record<string, unknown>>({
  pagePath,
  enabled = true,
  allowedOrigins,
}: UsePreviewReceiverConfig): T | null {
  const [content, setContent] = useState<T | null>(null);
  // Compared by value, so an inline array doesn't resubscribe and ask the CMS
  // for content again on every render
  const originsKey = allowedOrigins?.join(' ');

  useEffect(() => {
    if (!enabled) return;
    const origins = originsKey?.split(' ');

    function handleMessage(event: MessageEvent) {
      if (origins && !origins.includes(event.origin)) return;
      const message = event.data as PreviewMessage;
      if (message?.type !== PREVIEW_MESSAGE.content) return;
      // Ignore edits aimed at another page/global so this page keeps its data.
      if (message.pagePath === pagePath) {
        setContent(message.content as T);
      }
    }

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: PREVIEW_MESSAGE.ready }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, [enabled, pagePath, originsKey]);

  return content;
}
