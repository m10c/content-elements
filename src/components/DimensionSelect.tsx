'use client';

import { Chip, MenuItem, Stack, TextField, Typography } from '@mui/material';

import type { DimensionChip, DimensionOption } from '../types';

type Props = {
  value: string;
  options: readonly DimensionOption[];
  onChange: (value: string) => void;
  getChips?: (value: string) => DimensionChip[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function DimensionSelect({
  value,
  options,
  onChange,
  getChips,
  label,
  placeholder,
  disabled,
}: Props) {
  const renderOption = (optionValue: string) => {
    const option = options.find((candidate) => candidate.value === optionValue);
    if (!option) {
      return (
        <Typography variant="body2" color="text.secondary">
          {placeholder}
        </Typography>
      );
    }
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <span>{option.label}</span>
        {getChips?.(option.value).map((chip) => (
          <Chip
            key={chip.label}
            size="small"
            label={chip.label}
            color={chip.color}
          />
        ))}
      </Stack>
    );
  };

  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      SelectProps={{
        displayEmpty: Boolean(placeholder),
        renderValue: (selected) => renderOption(String(selected)),
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {renderOption(option.value)}
        </MenuItem>
      ))}
    </TextField>
  );
}
