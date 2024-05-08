import createComponent from './components';
import { ElementName, objAtribute } from './typeComponents';

describe('createComponent', () => {
  it('type html', () => {
    const validElements: ElementName[] = ['div', 'a', 'button'];
    validElements.forEach((tag) => {
      const element = createComponent(tag, [], {});
      expect(element.tagName.toLocaleLowerCase()).toBe(tag);
    });
  });
  it('classes', () => {
    const classes = ['class1', 'class2'];
    const element = createComponent('div', classes, {});
    classes.forEach((cls) => {
      expect(element.classList.contains(cls)).toBe(true);
    });
  });
  it('atributes', () => {
    const attributes: objAtribute = {
      id: 'testone',
      type: 'testhree',
    };
    const element = createComponent('div', [], attributes);

    Object.entries(attributes).forEach(([key, value]) => {
      expect(element.getAttribute(key)).toBe(value);
    });
  });
});
