import { render, html, page } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  let hasAccessToken = localStorage.getItem('accessToken') !== null;

  return html`
        <a id="logo" href="/"
          ><img id="logo-img" src="./images/logo2.png" alt="logo"/>
        </a>
        <nav>
          <div>
            <a href="/dashboard">Solutions</a>
          </div>
          ${hasAccessToken
      ?
      html`<div class="user">
            <a href="/create">Add Solution</a>
            <a href="/logout">Logout</a>
          </div>`
      :
      html`<div class="guest">
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          </div>
          </nav>`
    }`;
}

export const navigationPage = async (ctx, next) => {
  render(template(), document.querySelector('#header-element'));

  next();
}
