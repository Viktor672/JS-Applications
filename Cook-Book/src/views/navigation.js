import { html, render } from 'https://unpkg.com/lit-html';
import { classMap } from 'https://unpkg.com/lit-html/directives/class-map.js';

const headerSection = document.querySelector('.site-header');

const template = (isAuthenticated, pathname) => html`
    <h1>My Cookbook</h1>
    <nav>
        <a href="/" class=${classMap({ active: pathname === '/' })}>Home</a>
        <a href="/catalog" class=${classMap({ active: pathname === '/catalog' })}>Catalog</a>
        ${isAuthenticated
        ? html`
                <a href="/create" class=${classMap({ active: pathname === '/create' })}>Create Recipe</a>
                <a href="/logout">Logout</a>
            `
        : html`
                <a href="/login" class=${classMap({ active: pathname === '/login' })}>Login</a>
                <a href="/register" class=${classMap({ active: pathname === '/register' })}>Register</a>
            `
    }
    </nav >
`;

export function renderNavigation(ctx, next) {
    render(template(ctx.isAuthenticated, ctx.pathname), headerSection);

    next();
}
