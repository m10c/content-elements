'use client';

import { Box } from '@mui/material';
import React from 'react';

type Props = {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  src: string;
  renderWidth: number;
  title?: string;
};

export default function PreviewIframe({
  iframeRef,
  src,
  renderWidth,
  title = 'Preview',
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (!src) return null;

  const scale =
    containerWidth > 0 ? Math.min(1, containerWidth / renderWidth) : 0.5;

  return (
    <Box ref={containerRef} sx={{ flex: 1, overflow: 'hidden', p: 1.5, pt: 0 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: renderWidth,
          height: '100%',
          overflow: 'hidden',
          mx: 'auto',
        }}
      >
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          style={{
            width: renderWidth,
            height: `${Math.round(100 / scale)}%`,
            border: 'none',
            backgroundColor: 'white',
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            display: 'block',
            borderRadius: 8,
          }}
        />
      </Box>
    </Box>
  );
}
