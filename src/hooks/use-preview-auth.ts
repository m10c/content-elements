import { useCallback, useEffect, useState } from 'react';

import { PREVIEW_MESSAGE } from '../constants';

type UsePreviewAuthConfig = {
  /** Exact origin of the admin app embedding the preview. */
  adminOrigin: string;
};

type UsePreviewAuthResult = {
  token: string | null;
  requestToken: () => void;
};

export default function usePreviewAuth({
  adminOrigin,
}: UsePreviewAuthConfig): UsePreviewAuthResult {
  const [token, setToken] = useState<string | null>(null);

  const requestToken = useCallback(() => {
    if (typeof window === 'undefined' || window.parent === window) return;
    window.parent.postMessage(
      { type: PREVIEW_MESSAGE.tokenRequest },
      adminOrigin,
    );
  }, [adminOrigin]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleMessage(event: MessageEvent) {
      if (event.origin !== adminOrigin || event.source !== window.parent) {
        return;
      }
      if (event.data?.type !== PREVIEW_MESSAGE.auth) return;
      setToken(typeof event.data.token === 'string' ? event.data.token : null);
    }

    window.addEventListener('message', handleMessage);
    requestToken();
    return () => window.removeEventListener('message', handleMessage);
  }, [adminOrigin, requestToken]);

  return { token, requestToken };
}
