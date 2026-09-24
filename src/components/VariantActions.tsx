'use client';

import { Button, Stack, Typography } from '@mui/material';
import React from 'react';

import ConfirmDialog from './ConfirmDialog';
import PublishVariantDialog from './PublishVariantDialog';

export type DialogRenderProps = {
  open: boolean;
  onClose: () => void;
};

type Props = {
  entityLabel: string;
  isSaving: boolean;
  isPublished: boolean;
  isNewVariant: boolean;
  isLastVariant: boolean;
  onSave: () => void;
  onPublish: (publishAt: string) => Promise<boolean>;
  onUnpublish: () => Promise<boolean>;
  onDelete: () => Promise<boolean>;
  dimensionLabel?: string;
  deleteLastWarning?: React.ReactNode;
  note?: string;
  publishInfoMessage?: string;
  publishNotificationNote?: string;
  renderPublishDialog?: (props: DialogRenderProps) => React.ReactNode;
};

export default function VariantActions({
  entityLabel,
  isSaving,
  isPublished,
  isNewVariant,
  isLastVariant,
  onSave,
  onPublish,
  onUnpublish,
  onDelete,
  dimensionLabel,
  deleteLastWarning,
  note = 'Applies only to the language currently selected',
  publishInfoMessage,
  publishNotificationNote,
  renderPublishDialog,
}: Props) {
  const [confirm, setConfirm] = React.useState<'unpublish' | 'delete' | null>(
    null,
  );
  const [isPublishOpen, setIsPublishOpen] = React.useState(false);

  const handleConfirm = async () => {
    const success =
      confirm === 'delete' ? await onDelete() : await onUnpublish();
    if (success) setConfirm(null);
  };

  const closePublish = () => setIsPublishOpen(false);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        <Button variant="contained" onClick={onSave} disabled={isSaving}>
          Save Changes
        </Button>
        {!isNewVariant && (
          <Stack alignItems="flex-end" spacing={1}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color={isPublished ? 'warning' : 'success'}
                onClick={() =>
                  isPublished ? setConfirm('unpublish') : setIsPublishOpen(true)
                }
              >
                {isPublished ? 'Unpublish' : 'Publish...'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirm('delete')}
              >
                Delete
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {note}
            </Typography>
          </Stack>
        )}
      </Stack>

      <ConfirmDialog
        open={confirm !== null}
        title={
          confirm === 'delete'
            ? `Delete ${entityLabel}`
            : `Unpublish ${entityLabel}`
        }
        confirmColor={confirm === 'delete' ? 'error' : 'warning'}
        description={
          confirm === 'delete' ? (
            <Stack spacing={1}>
              <Typography variant="body2">
                Are you sure you want to delete this localisation?
              </Typography>
              {isLastVariant && deleteLastWarning}
            </Stack>
          ) : (
            'Are you sure you want to unpublish this localisation?'
          )
        }
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
      />

      {renderPublishDialog ? (
        renderPublishDialog({ open: isPublishOpen, onClose: closePublish })
      ) : (
        <PublishVariantDialog
          open={isPublishOpen}
          onClose={closePublish}
          entityLabel={entityLabel}
          dimensionLabel={dimensionLabel}
          onPublish={onPublish}
          infoMessage={publishInfoMessage}
          notificationNote={publishNotificationNote}
        />
      )}
    </>
  );
}
