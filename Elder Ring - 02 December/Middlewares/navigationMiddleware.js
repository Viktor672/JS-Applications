import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  let hasUserLoggedIn = localStorage.getItem('accessToken') !== null;

  let userDivEl = html`
  <div class="user">
            <a href="/create">Add Character</a>
            <a href="/logout">Logout</a>
          </div>
  `;

  let guestDivEl = html`
  <div class="guest">
            <a href="/login">Login</a>
            <a href="/register">Register</a>        
          </div>
  `;
  return html`
   <!-- Navigation -->
   <a id="logo" href="/"><img id="logo-img" src="./images/logo.png" alt=""/></a>
        <nav>
          <div>
            <a href="/dashboard">Characters</a>
          </div>
      ${hasUserLoggedIn
      ?
      userDivEl
      :
      guestDivEl
    }          
        </nav>
  `;
}

export const navigationPage = async (ctx, next) => {
  render(template(), document.querySelector('#site-section'));

  next();
}