import createComponent from '../components';
import './modal.scss';

const CLASS = {
  main: ['wrap_modal'],
  modal: ['modal'],
  text: ['text_modal'],
  btn: ['btn_continue'],
};

const TEXTBTN = 'Continue';

export default function createModal(textIn: string): HTMLElement {
  const wrapper = createComponent('div', CLASS.main, {});
  const modal = createComponent('div', CLASS.modal, {});
  const text = createComponent('p', CLASS.text, {});
  const btn = createComponent('button', CLASS.btn, {});

  btn.textContent = TEXTBTN;
  text.innerText = textIn;
  modal.append(text, btn);
  wrapper.append(modal);
  document.body.append(wrapper);
  document.body.classList.add('block');
  modal.classList.add('visible');

  btn.addEventListener('click', () => {
    document.body.classList.remove('block');
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    wrapper.classList.remove('visible');
    wrapper.classList.add('hidden');
    modal.addEventListener('animationend', () => {
      if (!modal.classList.contains('visible')) {
        document.body.classList.remove('block');
        document.body.removeChild(wrapper);
      }
    });
  });

  return wrapper;
}
