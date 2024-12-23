import {page,render,html} from '../lib/bible.js';

let baseUrl='http://localhost:3030';

const template=()=>{
    return html`
      <!-- Home page -->
      <section id="home">
          <h1>Welcome to our website, where curiosity meets enjoyment!
             Discover fascinating fun facts that engage and entertain everyone,
              inviting you to participate in the joy of learning something new together.</h1>
              <img id="logo-img" src="./images/logo.png" alt=""/>
        </section>
    `;
}

export const homePage = async()=>{
    render(template(),document.querySelector('#main-element'));
}
