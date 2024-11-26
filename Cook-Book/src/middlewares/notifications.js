import { html, render } from 'https://unpkg.com/lit-html';
import { classMap } from 'https://unpkg.com/lit-html/directives/class-map.js';


const parentElement = document.querySelector('section.site-notifications');

const template = (text, show, closeHandler) => html`
    <div class=${classMap({ toast: true, show })} role="alert" aria-live="assertive" aria-atomic="true" style="position: absolute; top: 50px; right:50px;">
        <div class="toast-header">
            <img src="..." class="rounded me-2" alt="...">
            <strong class="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            <button @click=${closeHandler} type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${text}
        </div>
    </div>
`;

export const notifications = (ctx, next) => {
    ctx.showNotification = (text) => {
        render(template(text, true, closeClickHandler), parentElement)

        setTimeout(() => {
            render(template(text, false, closeClickHandler), parentElement)
        }, 5000);
    }

    next();
}

function closeClickHandler(e) {
    render(template('', false), parentElement)
}
