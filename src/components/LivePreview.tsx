'use client';

import usePreviewSender from '../hooks/use-preview-sender';
import PreviewIframe from './PreviewIframe';

type Props = {
  previewUrl: string;
  src: string;
  content: Record<string, unknown>;
  renderWidth: number;
  pagePath?: string;
  globals?: Record<string, unknown>;
  getToken?: () => Promise<string | null>;
  title?: string;
};

export default function LivePreview({
  previewUrl,
  src,
  content,
  renderWidth,
  pagePath,
  globals,
  getToken,
  title,
}: Props) {
  const { iframeRef } = usePreviewSender({
    previewUrl,
    content,
    pagePath,
    globals,
    getToken,
  });

  return (
    <PreviewIframe
      iframeRef={iframeRef}
      src={src}
      renderWidth={renderWidth}
      title={title}
    />
  );
}
