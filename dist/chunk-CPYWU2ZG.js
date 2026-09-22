// src/hooks/use-preview-sender.ts
import { useCallback, useEffect, useRef } from "react";
function usePreviewSender(config) {
  const iframeRef = useRef(null);
  const contentRef = useRef(config.content);
  contentRef.current = config.content;
  const globalsRef = useRef(config.globals);
  globalsRef.current = config.globals;
  const sendContent = useCallback(
    (content, globals) => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow || !config.previewUrl) return;
      iframe.contentWindow.postMessage(
        {
          type: "m10c-cms-preview",
          content,
          pagePath: config.pagePath,
          globals
        },
        config.previewUrl
      );
    },
    [config.pagePath, config.previewUrl]
  );
  useEffect(() => {
    function handleMessage(event) {
      if (event.data?.type === "m10c-cms-preview-ready") {
        sendContent(contentRef.current, globalsRef.current);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sendContent]);
  useEffect(() => {
    sendContent(config.content, config.globals);
  }, [config.content, config.globals, sendContent]);
  return { iframeRef };
}

// src/hooks/use-website-global-data.ts
import { useEffect as useEffect2, useState } from "react";
function useWebsiteGlobalData(config) {
  const [previewData, setPreviewData] = useState(null);
  const [isPreview] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("preview") || window.self !== window.top;
  });
  useEffect2(() => {
    if (!isPreview) return;
    function handleMessage(event) {
      const message = event.data;
      if (message?.type !== "m10c-cms-preview") return;
      const globalData = message.globals?.[config.path];
      if (globalData !== void 0) {
        setPreviewData(globalData);
      }
    }
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "m10c-cms-preview-ready" }, "*");
    return () => window.removeEventListener("message", handleMessage);
  }, [isPreview, config.path]);
  return {
    data: isPreview && previewData !== null ? previewData : config.initialData ?? {},
    isPreview,
    isLoading: false
  };
}

// src/hooks/use-website-page-data.ts
import { useEffect as useEffect3, useState as useState2 } from "react";
function useWebsitePageData(config) {
  const [apiData, setApiData] = useState2(
    config.initialData ?? {}
  );
  const [previewData, setPreviewData] = useState2(null);
  const [isLoading, setIsLoading] = useState2(false);
  const [isPreview] = useState2(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("preview") || window.self !== window.top;
  });
  useEffect3(() => {
    if (!isPreview) return;
    function handleMessage(event) {
      const message = event.data;
      if (message?.type !== "m10c-cms-preview") return;
      if (message.pagePath === config.path) {
        setPreviewData(message.content);
      }
    }
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "m10c-cms-preview-ready" }, "*");
    return () => window.removeEventListener("message", handleMessage);
  }, [isPreview, config.path]);
  useEffect3(() => {
    if (isPreview || config.initialData || !config.fetchData) return;
    setIsLoading(true);
    config.fetchData().then((result) => {
      setApiData(result);
      setIsLoading(false);
    });
  }, [isPreview, config.initialData, config.fetchData, config.path]);
  return {
    // Fall back to published data until this page's own edits arrive.
    data: isPreview ? previewData ?? apiData : apiData,
    isPreview,
    isLoading
  };
}

export {
  usePreviewSender,
  useWebsiteGlobalData,
  useWebsitePageData
};
//# sourceMappingURL=chunk-CPYWU2ZG.js.map