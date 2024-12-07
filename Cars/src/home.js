import {page,render,html} from '../lib/bible.js';

let baseUrl='http://localhost:3030';

const template=()=>{
    return html`
        <!-- Home page -->
        <section id="hero">
          <h1>
            Accelerate Your Passion Unleash the Thrill of Sport Cars Together!
          </h1>
        </section>
    `;
}

export const homePage = async()=>{
    render(template(),document.querySelector('#main-element'));
}
