import type { ReactNode } from 'react';
import type { FieldProp } from 'react-typed-form';

export type VariantFieldProps = {
  name: string;
  label: string;
  translatable?: boolean;
  reference?: (value: unknown) => ReactNode;
  children: (field: FieldProp<string>) => ReactNode;
};

export default function VariantField(props: VariantFieldProps): null {
  void props;
  return null;
}
