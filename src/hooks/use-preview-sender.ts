import { useCallback, useEffect, useRef } from 'react';

type UsePreviewSenderConfig = {
  /** The full preview URL to load in the iframe */
  previewUrl: string;
  /** The current page path */
  pagePath: string;
  /** The current form content to send to the preview */
  content: Record<string, unknown>;
  /** Global content (footer, navigation, …) keyed by page path. */
  globals?: Record<string, unknown>;
};

type UsePreviewSenderResult = {
  /** Ref to attach to the iframe element */
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
};

export default function usePreviewSender(
  config: UsePreviewSenderConfig,
): UsePreviewSenderResult {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const contentRef = useRef(config.content);
  contentRef.current = config.content;
  const globalsRef = useRef(config.globals);
  globalsRef.current = config.globals;

  const sendContent = useCallback(
    (
      content: Record<string, unknown>,
      globals: Record<string, unknown> | undefined,
    ) => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow || !config.previewUrl) return;

      iframe.contentWindow.postMessage(
        {
          type: 'm10c-cms-preview',
          content,
          pagePath: config.pagePath,
          globals,
        },
        config.previewUrl,
      );
    },
    [config.pagePath, config.previewUrl],
  );

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'm10c-cms-preview-ready') {
        sendContent(contentRef.current, globalsRef.current);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendContent]);

  useEffect(() => {
    sendContent(config.content, config.globals);
  }, [config.content, config.globals, sendContent]);

  return { iframeRef };
}
