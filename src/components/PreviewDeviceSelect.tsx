'use client';

import { Devices, KeyboardArrowDown } from '@mui/icons-material';
import { FormControl, MenuItem, Select } from '@mui/material';

import type { PreviewDevice } from '../types';

const DEVICE_LABELS: Record<PreviewDevice, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

type Props = {
  value: PreviewDevice;
  onChange: (device: PreviewDevice) => void;
  labels?: Partial<Record<PreviewDevice, string>>;
};

export default function PreviewDeviceSelect({ value, onChange, labels }: Props) {
  return (
    <FormControl size="small">
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value as PreviewDevice)}
        startAdornment={
          <Devices sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
        }
        IconComponent={KeyboardArrowDown}
        sx={{ bgcolor: 'background.paper' }}
      >
        {(Object.keys(DEVICE_LABELS) as PreviewDevice[]).map((device) => (
          <MenuItem key={device} value={device}>
            {labels?.[device] ?? DEVICE_LABELS[device]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
