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
declare function usePreviewSender(config: UsePreviewSenderConfig): UsePreviewSenderResult;

type UseWebsitePageDataConfig = {
    path: string;
    /** Server-fetched published data; the SSR source outside preview. */
    initialData?: Record<string, unknown> | null;
    /** Client fetcher, used only when `initialData` is absent. */
    fetchData?: () => Promise<Record<string, unknown>>;
};
type UseWebsitePageDataResult = {
    data: Record<string, unknown>;
    isPreview: boolean;
    isLoading: boolean;
};
declare function useWebsitePageData(config: UseWebsitePageDataConfig): UseWebsitePageDataResult;

type UseWebsiteGlobalDataConfig = {
    /** The global's CMS page path, e.g. 'footer' or 'navigation'. */
    path: string;
    /** Server-fetched published data, passed from the site layout. */
    initialData?: Record<string, unknown> | null;
};
declare function useWebsiteGlobalData(config: UseWebsiteGlobalDataConfig): UseWebsitePageDataResult;

export { usePreviewSender, useWebsiteGlobalData, useWebsitePageData };
