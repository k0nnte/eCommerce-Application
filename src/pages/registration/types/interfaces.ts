export default interface FieldConfig {
  label: string;
  fieldType: 'input' | 'select';
  inputType?: string;
  placeholder?: string;
  id: string;
  validationFunction: (field: HTMLInputElement | HTMLSelectElement) => void; // eslint-disable-line no-unused-vars
  options?: { value: string; label: string }[];
}
