import { page, render, html } from '../lib/bible.js';


let headerEl = document.querySelector("#site-header");

const template = () => {
    let hasAccessToken = localStorage.getItem('accessToken');

    let userNavigation = html`
        <div class="user">
            <a href="/create">Sell</a>
            <a href="/logout">Logout</a>
        </div>
    `;

    let guestNavigation = html`
        <div class="guest">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        </div>
    `;

    return html`
        <a id="logo" href="/"><img id="logo" src="/images/logo.png" alt="img" /></a>
        <nav>
            <div>
                <a href="/market">Market</a>
            </div>

            ${hasAccessToken ? userNavigation : guestNavigation}
        </nav>
    `;
}

export const renderNavigation = (ctx, next) => {
    render(template(), headerEl);

    next();
}

