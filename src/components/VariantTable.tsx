'use client';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import {
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
import type { FieldProp, FormObject } from 'react-typed-form';

import type { DimensionSwitcher } from '../hooks/use-dimension-switcher';
import type { DimensionOption, VariantBase } from '../types';
import DimensionSelect from './DimensionSelect';
import VariantField, { type VariantFieldProps } from './VariantField';

type Props<T extends Record<string, unknown>> = {
  form: FormObject<T>;
  children: ReactNode;
  switcher?: DimensionSwitcher<VariantBase, Record<string, unknown>>;
  options?: readonly DimensionOption[];
  onSwitchGuard?: (action: () => void) => void;
  dimensionField?: string;
  dimensionLabel?: string;
};

const lastUpdated = (detail: { updatedAt?: string } | null) =>
  detail?.updatedAt
    ? format(parseISO(detail.updatedAt), 'dd MMM yyyy, HH:mm')
    : '-';

export default function VariantTable<T extends Record<string, unknown>>({
  form,
  children,
  switcher,
  options: optionsProp,
  onSwitchGuard,
  dimensionField = 'locale',
  dimensionLabel = 'Language',
}: Props<T>) {
  const fields = Children.toArray(children)
    .filter(
      (child): child is ReactElement<VariantFieldProps> =>
        isValidElement(child) && child.type === VariantField,
    )
    .map((child) => child.props);

  const options = switcher?.options ?? optionsProp ?? [];

  const showReference = switcher?.showReference ?? false;
  const referenceWidth = showReference ? '50%' : 'auto';
  const referenceRecord =
    (switcher?.referenceDetail as Record<string, unknown> | null) ?? null;
  const isLoadingDetail = switcher?.isLoadingDetail ?? false;
  const currentDetail =
    (switcher?.currentDetail as { updatedAt?: string } | null) ?? null;

  const handleTranslate = async (names: string[]) => {
    if (!switcher) return;
    const translations = await switcher.translate(names);
    if (!translations) return;
    Object.entries(translations).forEach(([name, translated]) => {
      form.getField(name as keyof T).handleValueChange(translated as T[keyof T]);
    });
  };

  const translatableNames = fields
    .filter((field) => field.translatable)
    .map((field) => field.name);
  const hasAnyValue = translatableNames.some((name) =>
    Boolean(form.getField(name as keyof T).value),
  );

  const dimensionFormField = form.getField(
    dimensionField as keyof T,
  ) as FieldProp<string>;
  const dimensionValue = switcher ? switcher.value : dimensionFormField.value ?? '';
  const onDimensionChange = (next: string) => {
    if (!switcher) {
      dimensionFormField.handleValueChange(next);
    } else if (onSwitchGuard) {
      onSwitchGuard(() => switcher.setValue(next));
    } else {
      switcher.setValue(next);
    }
  };

  if (switcher && isLoadingDetail && !switcher.currentDetail) {
    return (
      <Card sx={{ maxWidth: 'xl', mx: 'auto' }}>
        <CardContent>
          <Stack alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={24} />
          </Stack>
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
                    Reference Locale
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={switcher?.toggleReference}
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
                {switcher?.shouldShowReferenceToggle && !showReference && (
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
                          Show reference locale
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
                {dimensionLabel}
              </TableCell>
              {showReference && (
                <TableCell sx={{ width: '50%' }}>
                  <DimensionSelect
                    value={switcher?.reference ?? ''}
                    onChange={(next) => switcher?.setReference(next)}
                    options={options}
                    placeholder="Select language"
                    getChips={switcher?.getChips}
                  />
                </TableCell>
              )}
              <TableCell sx={{ width: referenceWidth }}>
                <Stack spacing={1}>
                  <DimensionSelect
                    value={dimensionValue}
                    onChange={onDimensionChange}
                    options={options}
                    getChips={switcher?.getChips}
                  />
                  {switcher?.canTranslate && translatableNames.length > 0 && (
                    <Button
                      variant="contained"
                      onClick={() => handleTranslate([])}
                      disabled={switcher.translatingField !== null}
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

            {switcher && (
              <TableRow>
                <TableCell sx={{ minWidth: 120, width: 120 }}>
                  Last Updated
                </TableCell>
                {showReference && (
                  <TableCell sx={{ width: '50%' }}>
                    <Typography variant="body2">
                      {lastUpdated(
                        switcher.referenceDetail as { updatedAt?: string } | null,
                      )}
                    </Typography>
                  </TableCell>
                )}
                <TableCell sx={{ width: referenceWidth }}>
                  <Typography variant="body2">
                    {lastUpdated(currentDetail)}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {fields.map((field) => {
              const showFieldTranslate =
                (switcher?.canTranslate ?? false) && field.translatable;
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
                    {isLoadingDetail ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Stack spacing={1}>
                        {field.children(formField)}
                        {showFieldTranslate && (
                          <Button
                            variant="outlined"
                            onClick={() => handleTranslate([field.name])}
                            disabled={switcher?.translatingField !== null}
                            sx={{ alignSelf: 'flex-start' }}
                          >
                            {formField.value
                              ? 'Retranslate with AI'
                              : 'Translate with AI'}
                          </Button>
                        )}
                      </Stack>
                    )}
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
