export default interface FieldConfig {
  label: string;
  fieldType: 'input' | 'select';
  inputType?: string;
  placeholder?: string;
  id: string;
  validationFunction: (field: HTMLInputElement | HTMLSelectElement) => void;
  options?: { value: string; label: string }[];
}
