import {page,render,html} from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';

const template=()=> {
  return  html`
      <section id="hero">
        <img src="./images/home.png" alt="home" />
        <p>We know who you are, we will contact you</p>
      </section>
    `;
}

export const homePage=async()=> {
    render(template(),document.querySelector('#main-element'));
}