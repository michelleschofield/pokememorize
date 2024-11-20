/**
 * Capitalize the first character in a string
 * @param word a string
 * @returns a new string with the first character capitalized
 * @returns an empty string if provided string is empty
 */
export function capitalizeWord(word: string): string {
  if (word.length <= 1) return word.toLocaleLowerCase();
  return word[0].toLocaleUpperCase() + word.slice(1);
}
