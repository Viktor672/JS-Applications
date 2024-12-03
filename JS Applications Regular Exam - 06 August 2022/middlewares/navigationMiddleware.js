import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  let hasUserLoggedIn = localStorage.getItem('accessToken') !== null;

 return html`
    <!-- Navigation -->
    <a id="logo" href="/"><img id="logo-img" src="./images/logo.jpg" alt=""/></a>

        <nav>
          <div>
            <a href="/dashboard">Dashboard</a>
          </div>

          <!-- Logged-in users -->
           ${hasUserLoggedIn
           ?
          html`<div class="user">
            <a href="/create">Create Offer</a>
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
  render(template(), document.querySelector('#site-section'));

  next();
}
