import {page,render,html} from '../lib/bible.js';

let baseUrl='http://localhost:3030';

const template = () => {
   return html`
     <section id="home">
          <img
            src="./images/pngkey.com-hunting-png-6697165-removebg-preview.png"
            alt="home"
          />
          <h2>Searching for a job?</h2>
          <h3>The right place for a new career start!</h3>
        </section>
        `;
}

export const homePage = async() => {
  render(template(), document.querySelector('#main-element'));
}
