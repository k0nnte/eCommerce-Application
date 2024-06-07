import { ERROR, CLASS_NAME } from './constants';

describe('Constants', () => {
  describe('ERROR', () => {
    test('should contain the correct error messages', () => {
      expect(ERROR).toEqual({
        NAME: 'Please enter only Latin letters',
        EMAIL: 'Please enter a valid e-mail address (e.g. "example@email.com")',
        PASSWORD:
          'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
        EMPTY: 'Please enter at least one character',
        DATE_OF_BIRTH:
          'Please make sure the date format is accurate and that your age falls within the range of 13 to 130 years old',
        COUNTRY: 'Please select country',
        POSTAL_CODE:
          'Please enter a valid postal code (format: "00000" or "00000-0000")',
        ERROR: 'Please enter the required information',
      });
    });
  });

  describe('CLASS_NAME', () => {
    test('should contain the correct class name for error messages', () => {
      expect(CLASS_NAME.ERROR_MESSAGE).toBe('error-msg');
    });
  });
});
