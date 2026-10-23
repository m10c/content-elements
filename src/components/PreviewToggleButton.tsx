'use client';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button } from '@mui/material';

type Props = {
  isPreviewVisible: boolean;
  onClick: () => void;
};

export default function PreviewToggleButton({
  isPreviewVisible,
  onClick,
}: Props) {
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={isPreviewVisible ? <VisibilityOff /> : <Visibility />}
      onClick={onClick}
      sx={{ whiteSpace: 'nowrap', bgcolor: 'background.paper' }}
    >
      {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
    </Button>
  );
}
