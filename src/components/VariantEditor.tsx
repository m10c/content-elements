'use client';

import TranslateIcon from '@mui/icons-material/Translate';
import { Button, CircularProgress, Stack } from '@mui/material';
import React from 'react';

import type { VariantEditorState } from '../hooks/use-variant-editor';
import type { VariantBase, VariantDetailBase } from '../types';
import ConfirmDialog from './ConfirmDialog';
import DimensionSelect from './DimensionSelect';
import ManageLanguagesButton from './ManageLanguagesButton';
import ManageVariantsDialog from './ManageVariantsDialog';
import UnsavedChangesDialog from './UnsavedChangesDialog';
import VariantActions, { type DialogRenderProps } from './VariantActions';
import VariantCardEditor from './VariantCardEditor';

export type VariantEditorTranslateConfig = {
  fields: string[];
  hasContent: boolean;
  translateLabel?: string;
  retranslateLabel?: string;
};

type Props<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
> = {
  editor: VariantEditorState<V, D, T>;
  children: React.ReactNode;
  title?: string;
  description?: string;
  dimensionLabel?: string;
  action?: React.ReactNode;
  preview?: React.ReactNode;
  translate?: VariantEditorTranslateConfig;
  supportsPublish?: boolean;
  deleteLastWarning?: React.ReactNode;
  publishInfoMessage?: string;
  publishNotificationNote?: string;
  renderPublishDialog?: (props: DialogRenderProps) => React.ReactNode;
  renderManageDialog?: (props: DialogRenderProps) => React.ReactNode;
};

export default function VariantEditor<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
>({
  editor,
  children,
  title = 'Localisation',
  description = 'Fields that vary by language.',
  dimensionLabel = 'Language',
  action,
  preview,
  translate,
  supportsPublish = true,
  deleteLastWarning,
  publishInfoMessage,
  publishNotificationNote,
  renderPublishDialog,
  renderManageDialog,
}: Props<V, D, T>) {
  const { entity, switcher, form, guard, actions } = editor;
  const [isManageOpen, setIsManageOpen] = React.useState(false);
  const [isRetranslateConfirmOpen, setIsRetranslateConfirmOpen] =
    React.useState(false);

  const currentLabel = switcher.options.find(
    (option) => option.value === switcher.value,
  )?.label;

  const closeManage = () => setIsManageOpen(false);

  const runTranslate = async () => {
    if (!translate) return;
    await editor.applyTranslation(translate.fields);
    setIsRetranslateConfirmOpen(false);
  };

  const translateButton = translate &&
    switcher.canTranslate &&
    !switcher.isDefault && (
      <Button
        variant="contained"
        startIcon={
          switcher.translatingField ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <TranslateIcon />
          )
        }
        disabled={switcher.translatingField !== null}
        onClick={() =>
          translate.hasContent
            ? setIsRetranslateConfirmOpen(true)
            : runTranslate()
        }
        sx={{ alignSelf: 'flex-start' }}
      >
        {translate.hasContent
          ? (translate.retranslateLabel ?? 'Retranslate all with AI')
          : (translate.translateLabel ?? 'Copy and translate all with AI')}
      </Button>
    );

  return (
    <>
      <VariantCardEditor
        title={title}
        description={description}
        action={action}
        preview={preview}
        dimensionSelect={
          <Stack direction="row" spacing={2} alignItems="center">
            <DimensionSelect
              label={dimensionLabel}
              value={switcher.value}
              options={switcher.options}
              onChange={editor.switchTo}
              getChips={switcher.getChips}
            />
            {editor.variants.length > 0 && (
              <ManageLanguagesButton onClick={() => setIsManageOpen(true)} />
            )}
          </Stack>
        }
        toolbar={translateButton}
        footer={
          <VariantActions
            entityLabel={entity.entityLabel}
            dimensionLabel={currentLabel}
            isSaving={form.isLoading}
            isPublished={editor.isPublished}
            isNewVariant={editor.isNewVariant}
            isLastVariant={editor.isLastVariant}
            onSave={editor.save}
            onPublish={actions.publish}
            onUnpublish={actions.unpublish}
            onDelete={editor.remove}
            deleteLastWarning={deleteLastWarning}
            publishInfoMessage={publishInfoMessage}
            publishNotificationNote={publishNotificationNote}
            renderPublishDialog={renderPublishDialog}
          />
        }
      >
        {switcher.isLoadingDetail ? (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={24} />
          </Stack>
        ) : (
          children
        )}
      </VariantCardEditor>

      {renderManageDialog ? (
        renderManageDialog({ open: isManageOpen, onClose: closeManage })
      ) : (
        <ManageVariantsDialog
          open={isManageOpen}
          onClose={closeManage}
          entityLabel={entity.entityLabel}
          variants={editor.variants}
          getValue={editor.getValue}
          options={switcher.options}
          onPublish={actions.bulkPublish}
          onUnpublish={actions.bulkUnpublish}
          onDelete={actions.bulkDelete}
          supportsPublish={supportsPublish}
          publishInfoMessage={publishInfoMessage}
          publishNotificationNote={publishNotificationNote}
        />
      )}

      <ConfirmDialog
        open={isRetranslateConfirmOpen}
        title="Retranslate all with AI"
        description="This will overwrite any changes made in this language."
        confirmText="Retranslate"
        confirmColor="warning"
        onClose={() => setIsRetranslateConfirmOpen(false)}
        onConfirm={runTranslate}
      />

      <UnsavedChangesDialog
        open={guard.hasPending}
        onClose={guard.dismissPending}
        onSave={() => guard.handlePending(true)}
        onContinueWithoutSaving={() => guard.handlePending(false)}
      />
    </>
  );
}
