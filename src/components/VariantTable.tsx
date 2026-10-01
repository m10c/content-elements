'use client';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link as MuiLink,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { FieldProp } from 'react-typed-form';

import type { VariantEditorState } from '../hooks/use-variant-editor';
import type { VariantBase, VariantDetailBase } from '../types';
import DimensionSelect from './DimensionSelect';
import VariantField, { type VariantFieldProps } from './VariantField';

type Props<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
> = {
  editor: VariantEditorState<V, D, T>;
  children: ReactNode;
};

const lastUpdated = (detail: VariantDetailBase | null) =>
  detail?.updatedAt
    ? format(parseISO(detail.updatedAt), 'dd MMM yyyy, HH:mm')
    : '-';

export default function VariantTable<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
>({ editor, children }: Props<V, D, T>) {
  const { form, switcher, dimension } = editor;
  const { showReference } = switcher;

  const fields = Children.toArray(children)
    .filter(
      (child): child is ReactElement<VariantFieldProps> =>
        isValidElement(child) && child.type === VariantField,
    )
    .map((child) => child.props);

  const referenceWidth = showReference ? '50%' : 'auto';
  const referenceRecord = switcher.referenceDetail as Record<
    string,
    unknown
  > | null;

  const translatableNames = fields
    .filter((field) => field.translatable)
    .map((field) => field.name);
  const hasAnyValue = translatableNames.some((name) =>
    Boolean(form.getField(name as keyof T).value),
  );

  if (switcher.isLoadingDetail || switcher.hasDetailError) {
    return (
      <Card sx={{ maxWidth: 'xl', mx: 'auto' }}>
        <CardContent>
          {switcher.hasDetailError ? (
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
            <Stack alignItems="center" sx={{ py: 4 }}>
              <CircularProgress size={24} />
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 'xl', mx: 'auto', position: 'relative' }}>
      <CardContent sx={{ p: 0, pb: 0 }}>
        <Table sx={{ '& td': { verticalAlign: 'top' } }}>
          <TableHead sx={{ position: 'relative' }}>
            <TableRow>
              <TableCell sx={{ minWidth: 120, width: 120 }}>Field</TableCell>
              {showReference && (
                <TableCell sx={{ width: '50%' }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    Reference {dimension.label}
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={switcher.toggleReference}
                      sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                      <Typography variant="body2" color="primary">
                        Hide
                      </Typography>
                    </MuiLink>
                  </Stack>
                </TableCell>
              )}
              <TableCell sx={{ width: referenceWidth }}>
                {switcher.shouldShowReferenceToggle && !showReference && (
                  <Box sx={{ position: 'absolute', right: 20, top: 8 }}>
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={switcher.toggleReference}
                      sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ViewColumnIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="primary">
                          Show reference {dimension.label.toLowerCase()}
                        </Typography>
                      </Stack>
                    </MuiLink>
                  </Box>
                )}
                Editor
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ minWidth: 120, width: 120 }}>
                {dimension.label}
              </TableCell>
              {showReference && (
                <TableCell sx={{ width: '50%' }}>
                  <DimensionSelect
                    value={switcher.reference ?? ''}
                    onChange={switcher.setReference}
                    options={dimension.options}
                    placeholder={`Select ${dimension.label.toLowerCase()}`}
                    getChips={switcher.getChips}
                  />
                </TableCell>
              )}
              <TableCell sx={{ width: referenceWidth }}>
                <Stack spacing={1}>
                  <DimensionSelect
                    value={switcher.value}
                    onChange={editor.switchTo}
                    options={dimension.options}
                    getChips={switcher.getChips}
                  />
                  {editor.canTranslate && translatableNames.length > 0 && (
                    <Button
                      variant="contained"
                      onClick={() => editor.applyTranslation(translatableNames)}
                      disabled={editor.isTranslating}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {hasAnyValue
                        ? 'Retranslate All Fields with AI'
                        : 'Translate All Fields with AI'}
                    </Button>
                  )}
                </Stack>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ minWidth: 120, width: 120 }}>
                Last Updated
              </TableCell>
              {showReference && (
                <TableCell sx={{ width: '50%' }}>
                  <Typography variant="body2">
                    {lastUpdated(switcher.referenceDetail)}
                  </Typography>
                </TableCell>
              )}
              <TableCell sx={{ width: referenceWidth }}>
                <Typography variant="body2">
                  {lastUpdated(switcher.currentDetail)}
                </Typography>
              </TableCell>
            </TableRow>

            {fields.map((field) => {
              const formField = form.getField(
                field.name as keyof T,
              ) as FieldProp<string>;
              const referenceValue = referenceRecord?.[field.name];
              return (
                <TableRow key={field.name} sx={{ '& td': { pt: 3 } }}>
                  <TableCell sx={{ minWidth: 120, width: 120 }}>
                    {field.label}
                  </TableCell>
                  {showReference && (
                    <TableCell sx={{ width: '50%' }}>
                      {field.reference ? (
                        field.reference(referenceValue)
                      ) : (
                        <Typography variant="body2">
                          {referenceValue == null ? '-' : String(referenceValue)}
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  <TableCell sx={{ width: referenceWidth }}>
                    <Stack spacing={1}>
                      {field.children(formField)}
                      {editor.canTranslate && field.translatable && (
                        <Button
                          variant="outlined"
                          onClick={() => editor.applyTranslation([field.name])}
                          disabled={editor.isTranslating}
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          {formField.value
                            ? 'Retranslate with AI'
                            : 'Translate with AI'}
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
