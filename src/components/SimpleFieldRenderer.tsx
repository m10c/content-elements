import { InputAdornment, Stack, Typography } from '@mui/material';
import { FieldRadioGroup, FieldSwitch, FieldText } from '@m10c/mui-kit';
import React from 'react';
import { FieldProp } from 'react-typed-form';

import type {
  BlockFieldRenderer,
  BlockFieldRenderers,
  SimpleField,
} from '../types';
import fieldLabel from '../utils/field-label';
import FieldError from './FieldError';
import FieldNote from './FieldNote';

function fieldHint(fieldDef: SimpleField) {
  if (fieldDef.hint) return fieldDef.hint;
  return fieldDef.dimensions
    ? `Recommended size ${fieldDef.dimensions}px`
    : undefined;
}

type SimpleFieldRendererProps = {
  fieldKey: string;
  fieldDef: SimpleField;
  value: unknown;
  renderers?: BlockFieldRenderers;
  /** Overrides the rendered label (used to suffix a list item's index). */
  labelOverride?: string;
  error?: string;
  onChange: (value: unknown) => void;
};

export default function SimpleFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  labelOverride,
  error,
  onChange,
}: SimpleFieldRendererProps) {
  const label = labelOverride ?? fieldLabel(fieldDef, fieldKey);

  if (fieldDef.kind === 'note') {
    return <FieldNote fieldDef={fieldDef} label={label} />;
  }

  const stringValue = typeof value === 'string' ? value : null;
  const isOn = value === true;

  const customRenderer: BlockFieldRenderer | undefined =
    renderers?.[fieldDef.kind];
  if (customRenderer) {
    return (
      <>
        {customRenderer({
          name: fieldKey,
          label,
          value: stringValue,
          features: fieldDef.features,
          hint: fieldHint(fieldDef),
          prefix: fieldDef.prefix,
          error,
          values: stringValues(value),
          maxItems: fieldDef.maxItems,
          checked: isOn,
          onChange,
          onChangeValues: onChange,
          onChangeChecked: onChange,
        })}
      </>
    );
  }

  if (fieldDef.kind === 'boolean') {
    return (
      <FieldWrap fieldDef={fieldDef} error={error}>
        <FieldSwitch
          field={{
            name: fieldKey,
            label,
            value: isOn,
            handleValueChange: onChange,
          }}
        />
      </FieldWrap>
    );
  }

  if (fieldDef.kind === 'select') {
    return (
      <FieldWrap fieldDef={fieldDef} label={label} error={error}>
        <FieldRadioGroup
          field={{
            name: fieldKey,
            label,
            value: stringValue ?? '',
            handleValueChange: onChange,
          }}
          options={(fieldDef.options ?? []).map((option) => ({
            value: option,
            label: option,
          }))}
        />
      </FieldWrap>
    );
  }

  // Uploading belongs to the consuming app, so an images field draws nothing
  // of its own until a renderer is given for it.
  if (fieldDef.kind === 'images') {
    return <FieldWrap fieldDef={fieldDef} label={label} error={error} />;
  }

  const fieldProp: FieldProp<string | null> = {
    name: fieldKey,
    label,
    value: stringValue,
    handleValueChange: onChange,
    errorList: error === undefined ? undefined : [error],
  };

  const multiline =
    fieldDef.kind === 'textarea' ||
    fieldDef.kind === 'markdown' ||
    fieldDef.kind === 'richtext';

  return (
    <FieldWrap fieldDef={fieldDef} label={label}>
      <FieldText
        field={fieldProp}
        hiddenLabel
        multiline={multiline}
        minRows={multiline ? 2 : undefined}
        InputProps={
          fieldDef.prefix
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    {fieldDef.prefix}
                  </InputAdornment>
                ),
              }
            : undefined
        }
        inputProps={
          fieldDef.maxLength ? { maxLength: fieldDef.maxLength } : undefined
        }
      />
    </FieldWrap>
  );
}

type FieldWrapProps = {
  fieldDef: SimpleField;
  /** Left out by a field that labels itself, e.g. a `boolean`. */
  label?: string;
  error?: string;
  children?: React.ReactNode;
};

/** A field's label and hint, above whatever draws its value. */
function FieldWrap({ fieldDef, label, error, children }: FieldWrapProps) {
  return (
    <Stack spacing={1}>
      <Stack spacing={0.5}>
        {label && <Typography variant="subtitle2">{label}</Typography>}
        {fieldHint(fieldDef) && (
          <Typography variant="body2" color="text.secondary">
            {fieldHint(fieldDef)}
          </Typography>
        )}
      </Stack>
      {children}
      {error && <FieldError error={error} />}
    </Stack>
  );
}

/** The strings held by a field with several values, e.g. uploaded images. */
function stringValues(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}
