'use client';

import TranslateIcon from '@mui/icons-material/Translate';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import React from 'react';

import type { VariantEditorState } from '../hooks/use-variant-editor';
import type { VariantBase, VariantDetailBase } from '../types';
import dimensionValue from '../utils/dimension-value';
import ConfirmDialog from './ConfirmDialog';
import DimensionSelect from './DimensionSelect';
import DimensionSubtitle from './DimensionSubtitle';
import ManageVariantsButton from './ManageVariantsButton';
import ManageVariantsDialog from './ManageVariantsDialog';
import UnsavedChangesDialog from './UnsavedChangesDialog';
import VariantActions, { type DialogRenderProps } from './VariantActions';

export type VariantEditorTranslateConfig = {
  fields: string[];
  hasContent: boolean;
  description?: string;
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
  translate?: VariantEditorTranslateConfig;
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
  translate,
  deleteLastWarning,
  publishInfoMessage,
  publishNotificationNote,
  renderPublishDialog,
  renderManageDialog,
}: Props<V, D, T>) {
  const { dimension, switcher, form, guard, actions } = editor;
  const [isManageOpen, setIsManageOpen] = React.useState(false);
  const [isRetranslateConfirmOpen, setIsRetranslateConfirmOpen] =
    React.useState(false);

  const currentLabel = switcher.getLabel(switcher.value);
  const sourceLabel = switcher.sourceVariant
    ? switcher.getLabel(dimensionValue(switcher.sourceVariant, dimension.key))
    : null;

  const closeManage = () => setIsManageOpen(false);

  const runTranslate = async () => {
    if (!translate) return;
    const success = await editor.applyTranslation(translate.fields);
    if (success) setIsRetranslateConfirmOpen(false);
  };

  const translateLabel =
    translate?.translateLabel ?? 'Copy & translate all with AI';
  const retranslateLabel =
    translate?.retranslateLabel ?? 'Retranslate all with AI';
  const translateIcon = editor.isTranslating ? (
    <CircularProgress size={16} color="inherit" />
  ) : (
    <TranslateIcon />
  );

  const translateControls =
    translate &&
    editor.canTranslate &&
    !switcher.isDefault &&
    (translate.hasContent ? (
      <Button
        variant="contained"
        size="small"
        startIcon={translateIcon}
        disabled={editor.isTranslating}
        onClick={() => setIsRetranslateConfirmOpen(true)}
        sx={{ alignSelf: 'flex-start' }}
      >
        {retranslateLabel}
      </Button>
    ) : (
      <Alert severity="info">
        <Stack spacing={1} alignItems="flex-start">
          <span>
            {translate.description ??
              `Copy and translate everything from the ${sourceLabel} version, then edit anything that needs changing.`}
          </span>
          <Button
            variant="contained"
            size="small"
            startIcon={translateIcon}
            disabled={editor.isTranslating}
            onClick={runTranslate}
          >
            {translateLabel}
          </Button>
        </Stack>
      </Alert>
    ));

  return (
    <>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DimensionSelect
              label={dimension.label}
              value={switcher.value}
              options={dimension.options}
              onChange={editor.switchTo}
              getChips={switcher.getChips}
            />
            {editor.variants.length > 0 && (
              <ManageVariantsButton
                label={`Manage All ${dimension.pluralLabel}`}
                onClick={() => setIsManageOpen(true)}
              />
            )}
          </Stack>
          {translateControls}
        </Stack>
        {switcher.isLoadingDetail ? (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={24} />
          </Stack>
        ) : switcher.hasDetailError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={switcher.reloadDetail}
              >
                Retry
              </Button>
            }
          >
            Failed to load this {editor.entityLabel}.
          </Alert>
        ) : (
          children
        )}
        {!switcher.hasDetailError && (
          <VariantActions
            entityLabel={editor.entityLabel}
            dimensionLabel={currentLabel}
            note={`Applies only to the ${dimension.label.toLowerCase()} currently selected`}
            isSaving={form.isLoading}
            isPublished={editor.isPublished}
            isNewVariant={editor.isNewVariant}
            isLastVariant={editor.isLastVariant}
            publishable={editor.publishable}
            onSave={editor.save}
            onPublish={actions.publish}
            onUnpublish={actions.unpublish}
            onDelete={editor.remove}
            deleteLastWarning={deleteLastWarning}
            publishInfoMessage={publishInfoMessage}
            publishNotificationNote={publishNotificationNote}
            renderPublishDialog={renderPublishDialog}
          />
        )}
      </Stack>

      {renderManageDialog ? (
        renderManageDialog({ open: isManageOpen, onClose: closeManage })
      ) : (
        <ManageVariantsDialog
          open={isManageOpen}
          onClose={closeManage}
          entityLabel={editor.entityLabel}
          dimension={dimension}
          variants={editor.variants}
          onPublish={actions.bulkPublish}
          onUnpublish={actions.bulkUnpublish}
          onDelete={editor.bulkDelete}
          publishable={editor.publishable}
          publishInfoMessage={publishInfoMessage}
          publishNotificationNote={publishNotificationNote}
        />
      )}

      <ConfirmDialog
        open={isRetranslateConfirmOpen}
        title={retranslateLabel}
        subtitle={<DimensionSubtitle label={currentLabel} />}
        description={`Are you sure you want to ${retranslateLabel.charAt(0).toLowerCase()}${retranslateLabel.slice(1)}?`}
        warning="We'll overwrite all the content you've edited on this page. This action can't be undone."
        confirmText="Confirm Retranslate"
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
