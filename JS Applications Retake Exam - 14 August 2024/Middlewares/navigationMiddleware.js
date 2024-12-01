import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  let hasUserLoggedIn = localStorage.getItem('accessToken') !== null;

  return html`
     <!-- Navigation -->
     <a id="logo" href="/"
          ><img id="logo-img" src="./images/show_logo.png" alt="logo" />
        </a>
        <nav>
          <div>
            <a href="/dashboard">TV Shows</a>
            <a href="/search">Search</a>
          </div>

          <!-- Logged-in users -->
           ${hasUserLoggedIn
      ?
      html`<div class="user">
            <a href="/create">Add Show</a>
            <a href="/logout">Logout</a>
          </div>`
      :
      html`<!-- Guest users -->
          <div class="guest">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>`
    }
        </nav>`;
}

export const navigationPage = async (ctx,next) => {
  render(template(), document.querySelector('#site-header'));

  next();
}