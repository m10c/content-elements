import { useCallback, useEffect, useRef } from 'react';

import { PREVIEW_MESSAGE } from '../constants';
import type { PreviewAuthMessage, PreviewMessage } from '../types';

type UsePreviewSenderConfig = {
  /** The full preview URL to load in the iframe */
  previewUrl: string;
  /** The current form content to send to the preview */
  content: Record<string, unknown>;
  /** The current page path */
  pagePath?: string;
  /** Global content (footer, navigation, …) keyed by page path. */
  globals?: Record<string, unknown>;
  /** Answers the preview's token requests so it can call authed APIs. */
  getToken?: () => Promise<string | null>;
};

type UsePreviewSenderResult = {
  /** Ref to attach to the iframe element */
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
};

const getOrigin = (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

export default function usePreviewSender(
  config: UsePreviewSenderConfig,
): UsePreviewSenderResult {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const contentRef = useRef(config.content);
  contentRef.current = config.content;
  const globalsRef = useRef(config.globals);
  globalsRef.current = config.globals;
  const getTokenRef = useRef(config.getToken);
  getTokenRef.current = config.getToken;

  const previewOrigin = getOrigin(config.previewUrl);

  const post = useCallback(
    (message: PreviewMessage | PreviewAuthMessage) => {
      const target = iframeRef.current?.contentWindow;
      if (!target || !previewOrigin) return;
      target.postMessage(message, previewOrigin);
    },
    [previewOrigin],
  );

  const sendContent = useCallback(
    (
      content: Record<string, unknown>,
      globals: Record<string, unknown> | undefined,
    ) =>
      post({
        type: PREVIEW_MESSAGE.content,
        content,
        pagePath: config.pagePath,
        globals,
      }),
    [post, config.pagePath],
  );

  useEffect(() => {
    async function handleMessage(event: MessageEvent) {
      if (
        event.origin !== previewOrigin ||
        event.source !== iframeRef.current?.contentWindow
      ) {
        return;
      }
      if (event.data?.type === PREVIEW_MESSAGE.ready) {
        sendContent(contentRef.current, globalsRef.current);
      }
      if (event.data?.type === PREVIEW_MESSAGE.tokenRequest) {
        const getToken = getTokenRef.current;
        if (!getToken) return;
        post({ type: PREVIEW_MESSAGE.auth, token: await getToken() });
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [previewOrigin, post, sendContent]);

  useEffect(() => {
    sendContent(config.content, config.globals);
  }, [config.content, config.globals, sendContent]);

  return { iframeRef };
}
