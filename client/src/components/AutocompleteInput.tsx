import { ChangeEvent, useRef, useState } from 'react';
import { Popup } from './Popup';

type Props = {
  completeWith: string[];
  defaultValue?: string;
  required?: boolean;
};

export function AutocompleteInput({
  defaultValue,
  required,
  completeWith,
}: Props): JSX.Element {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] =
    useState<string[]>(completeWith);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setInputValue(value);
    filterOptions(value);
  }

  function filterOptions(value: string): void {
    const regex = new RegExp(`([${value}])`, 'g');
    const sortable = completeWith.map((string) => {
      return {
        string,
        matches: string.match(regex),
      };
    });

    const filtered = sortable.filter((node) => {
      if (!node.matches) return false;
      return node.matches.length >= value.length;
    }) as { string: string; matches: RegExpMatchArray }[];
    filtered.sort((a, b) => b.matches.length - a.matches.length);
    setFilteredOptions(filtered.map((node) => node.string));
  }

  function handleComplete(string: string): void {
    setInputValue(string);
    setAutocompleteOpen(false);
  }

  return (
    <>
      <input
        onFocus={() => setAutocompleteOpen(true)}
        ref={inputRef}
        required={required}
        name="pokemon"
        className="border-2 rounded px-2"
        style={{
          fontFamily: 'Quicksand, sans-serif',
          fontWeight: 'normal',
        }}
        value={inputValue}
        onChange={handleChange}
      />

      <Popup
        onClose={() => setAutocompleteOpen(false)}
        positionTo={inputRef.current}
        isOpen={autocompleteOpen}>
        <ul className="bg-white border border-gray-400 p-2 max-h-96 w-36 overflow-scroll">
          {filteredOptions.map((string) => (
            <li key={string} onClick={() => handleComplete(string)}>
              {string}
            </li>
          ))}
        </ul>
      </Popup>
    </>
  );
}
