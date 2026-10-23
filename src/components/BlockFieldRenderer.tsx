import React from 'react';

import type {
  BlockErrors,
  BlockFieldPreviews,
  BlockFieldRenderers,
  BlockTypeField,
} from '../types';
import type { ListCardIcons } from './BlocksField';
import ListFieldRenderer from './ListFieldRenderer';
import SimpleFieldRenderer from './SimpleFieldRenderer';

type BlockFieldRendererProps = {
  fieldKey: string;
  fieldDef: BlockTypeField;
  value: unknown;
  renderers?: BlockFieldRenderers;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  errors?: BlockErrors;
  errorPath: string;
  headerSlot?: React.ReactNode;
  onChange: (value: unknown) => void;
};

export default function BlockFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  headerSlot,
  onChange,
}: BlockFieldRendererProps) {
  if (fieldDef.kind === 'list') {
    return (
      <ListFieldRenderer
        fieldDef={fieldDef}
        value={Array.isArray(value) ? value : []}
        renderers={renderers}
        previews={previews}
        icons={icons}
        errors={errors}
        errorPath={errorPath}
        headerSlot={headerSlot}
        onChange={onChange}
      />
    );
  }
  return (
    <SimpleFieldRenderer
      fieldKey={fieldKey}
      fieldDef={fieldDef}
      value={value}
      renderers={renderers}
      error={errors?.[errorPath]}
      onChange={onChange}
    />
  );
}
