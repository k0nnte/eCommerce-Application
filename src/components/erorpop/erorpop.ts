import createComponent from '../components';
import './erorpop.scss';

const CLASS = {
  main: ['wrap_erpop'],
  pop: ['err_pop'],
  text: ['text_error'],
  btn: ['btn_continue'],
};

const TEXTBTN = 'Continue';

export default function createErrorPopup(textIn: string): HTMLElement {
  const wrapper = createComponent('div', CLASS.main, {});
  const pop = createComponent('div', CLASS.pop, {});
  const text = createComponent('p', CLASS.text, {});
  const btn = createComponent('button', CLASS.btn, {});

  btn.textContent = TEXTBTN;
  text.innerText = textIn;
  pop.append(text, btn);
  wrapper.append(pop);
  document.body.append(wrapper);
  document.body.classList.add('block');
  pop.classList.add('visible');

  btn.addEventListener('click', () => {
    pop.classList.remove('visible');
    pop.classList.add('hidden');
    pop.addEventListener('animationend', () => {
      if (!pop.classList.contains('visible')) {
        document.body.classList.remove('block');
        document.body.removeChild(wrapper);
      }
    });
  });

  return wrapper;
}
