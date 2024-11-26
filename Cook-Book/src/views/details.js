import { html, render } from 'https://unpkg.com/lit-html';

import recipes from "../api/recipes.js";

const mainSection = document.querySelector('body main');

const template = ({ article, isOwner }) => html`
    <article>
        <h2>${article.name}</h2>
        <div class="band">
            <div class="thumb">
                <img src="${article.img}">
            </div>
            <div class="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                    ${article.ingredients.map(i => html`<li>${i}</li>`)}
                </ul>
            </div>
        </div>
        <div class="description">
            <h3>Preparation:</h3>
            ${article.steps.map(step => html`<p>${step}</p>`)}
        </div>
        ${isOwner
        ? html`
            <div style="text-align: center; padding-bottom: 20px;">
                <a href="/catalog/${article._id}/edit">Edit</a>
                <a href="/catalog/${article._id}/delete">Delete</a>
            </div>
        `
        : ''
    }
    </article>
`;

export default async function detailsPage(ctx) {
    const { recipeId } = ctx.params;

    const article = await recipes.getOne(recipeId);

    const userId = localStorage.getItem('_id');
    const isOwner = article._ownerId === userId;

    render(template({
        article,
        isOwner,
    }), mainSection);
}
