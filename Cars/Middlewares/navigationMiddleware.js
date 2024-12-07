import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  let hasUserLoggedIn = localStorage.getItem('accessToken') !== null;

  let userDivEl = html`
  <div class="user">
            <a href="/create">Add Your Car</a>
            <a href="/logout">Logout</a>
          </div>

  `;

  let guestDivEl = html`
   <div class="guest">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
        </nav>
  `;
  return html`
   <!-- Navigation -->
   <a id="logo" href="/"><img id="logo-car" src="./images/car-logo.png" alt="img"/></a>
        <nav>
          <div>
            <a href="/dashboard">Our Cars</a>
            <a href="/search">Search</a>
          </div>  
         ${hasUserLoggedIn
      ?
      userDivEl
      :
      guestDivEl
    }
`;
}

export const navigationPage = async (ctx, next) => {
  render(template(), document.querySelector('#site-section'));

  next();
}