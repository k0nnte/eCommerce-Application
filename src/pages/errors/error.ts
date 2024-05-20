import createComponent from '../../components/components'; // eslint-disable-line import/extensions
import './errors.scss';
import img from '../../../public/files/404.png';

const CLASS = {
  wrapper: ['wrapper_errorlog'],
  top: ['wrapper_top'],
  bot: ['wrapper_bot'],
  messageError: ['messageError'],
  four: ['four'],
  smallFour: ['smallFour'],
  image: ['img_error'],
  imgWrapper: ['wraps_img'],
  text_err: ['text_err'],
  btnMain: ['btn_main'],
};

const TEXT_ERR = '404 Not Found';
const FULL_TEXT = `oops!  The page you requested was not found!`;
const TEXT_BTN = `Back To Home`;

export default class ErrorPage {
  wrapper: HTMLElement;

  top_wrapper: HTMLElement;

  bot_wrapper: HTMLElement;

  messageError: HTMLElement;

  four: HTMLElement;

  smallFour: HTMLElement;

  image: HTMLElement;

  img_wrapper: HTMLElement;

  text_err: HTMLElement;

  btnMain: HTMLElement;

  constructor() {
    this.wrapper = createComponent('div', CLASS.wrapper, {});
    this.messageError = createComponent('div', CLASS.messageError, {});
    this.four = createComponent('p', CLASS.four, {});
    this.smallFour = createComponent('p', CLASS.smallFour, {});
    this.top_wrapper = createComponent('div', CLASS.top, {});
    this.bot_wrapper = createComponent('div', CLASS.bot, {});
    this.image = createComponent('img', CLASS.image, {
      src: img,
      alt: TEXT_ERR,
    });
    this.img_wrapper = createComponent('div', CLASS.imgWrapper, {});
    this.text_err = createComponent('p', CLASS.text_err, {});
    this.btnMain = createComponent('button', CLASS.btnMain, {});
    this.init();
  }

  init() {
    this.four.innerText = TEXT_ERR;
    this.smallFour.innerText = TEXT_ERR;
    this.messageError.append(this.four, this.smallFour);
    this.top_wrapper.append(this.messageError);
    this.text_err.innerText = FULL_TEXT;
    this.initBtn();
    this.img_wrapper.append(this.image, this.text_err, this.btnMain);
    this.bot_wrapper.append(this.img_wrapper);
    this.wrapper.append(this.top_wrapper, this.bot_wrapper);
  }

  initBtn() {
    this.btnMain.innerText = TEXT_BTN;
    this.btnMain.addEventListener('click', () => {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }

  getWrap() {
    return this.wrapper;
  }
}
