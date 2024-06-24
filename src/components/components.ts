import * as typeComp from './typeComponents';

export default function createComponent(
  element: typeComp.ElementName,
  classes: string[],
  object: typeComp.objAtribute,
): HTMLElement {
  const elem = document.createElement(element);
  for (let i = 0; i < classes.length; i += 1) {
    elem.classList.add(classes[i]);
  }
  const entries = Object.entries(object);
  entries.forEach(([key, value]) => {
    if (typeof key === 'string' && typeof value === 'string') {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}
