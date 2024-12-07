import {page,render,html} from '../lib/bible.js';

let baseUrl='http://localhost:3030';

const template=()=>{
    return html`
       <section id="home">
          <h1>
            Welcome to <span>Samurider</span> moto market, your premier destination for Japanese motorcycles.</h1>
          <img
            src="./images/motorcycle.png"
            alt="home"
          />

        </section>

    `;
}

export const homePage = async()=>{
    render(template(),document.querySelector('#main-element'));
}
