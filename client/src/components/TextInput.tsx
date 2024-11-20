import { ChangeEvent, FocusEventHandler } from 'react';

type Props = {
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  style?: React.CSSProperties;
  ref?: React.LegacyRef<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
};

export function TextInput({
  required,
  value,
  onChange,
  defaultValue,
  style,
  ref,
  onFocus,
  name,
  type,
  disabled,
}: Props): JSX.Element {
  return (
    <input
      disabled={disabled}
      type={type}
      onFocus={onFocus}
      ref={ref}
      defaultValue={defaultValue}
      required={required}
      name={name}
      className="border-2 rounded px-2 max-w-52"
      style={style}
      value={value}
      onChange={onChange}
    />
  );
}
