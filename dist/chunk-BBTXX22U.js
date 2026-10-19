// src/constants/preview-device-widths.ts
var PREVIEW_DEVICE_WIDTHS = {
  desktop: 1280,
  tablet: 768,
  mobile: 375
};
var preview_device_widths_default = PREVIEW_DEVICE_WIDTHS;

// src/constants/preview-message.ts
var PREVIEW_MESSAGE = {
  content: "m10c-cms-preview",
  ready: "m10c-cms-preview-ready"
};
var preview_message_default = PREVIEW_MESSAGE;

// src/hooks/use-preview-sender.ts
import { useCallback, useEffect, useRef } from "react";
var getOrigin = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};
function usePreviewSender(config) {
  const iframeRef = useRef(null);
  const contentRef = useRef(config.content);
  contentRef.current = config.content;
  const globalsRef = useRef(config.globals);
  globalsRef.current = config.globals;
  const previewOrigin = getOrigin(config.previewUrl);
  const post = useCallback(
    (message) => {
      const target = iframeRef.current?.contentWindow;
      if (!target || !previewOrigin) return;
      target.postMessage(message, previewOrigin);
    },
    [previewOrigin]
  );
  const sendContent = useCallback(
    (content, globals) => post({
      type: preview_message_default.content,
      content,
      pagePath: config.pagePath,
      globals
    }),
    [post, config.pagePath]
  );
  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== previewOrigin || event.source !== iframeRef.current?.contentWindow) {
        return;
      }
      if (event.data?.type === preview_message_default.ready) {
        sendContent(contentRef.current, globalsRef.current);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [previewOrigin, sendContent]);
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
      if (message?.type !== preview_message_default.content) return;
      const globalData = message.globals?.[config.path];
      if (globalData !== void 0) {
        setPreviewData(globalData);
      }
    }
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: preview_message_default.ready }, "*");
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
      if (message?.type !== preview_message_default.content) return;
      if (message.pagePath === config.path) {
        setPreviewData(message.content);
      }
    }
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: preview_message_default.ready }, "*");
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
  preview_device_widths_default,
  preview_message_default,
  usePreviewSender,
  useWebsiteGlobalData,
  useWebsitePageData
};
//# sourceMappingURL=chunk-BBTXX22U.js.map