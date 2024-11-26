import page from "//unpkg.com/page/page.mjs";
import { html, render } from 'https://unpkg.com/lit-html';

import recipes from "../api/recipes.js";

const mainSection = document.querySelector('body main');

const template = (recipes = [], onSearch, isLoading = false) => html`
    <section id="catalog-section">
        <form @submit=${onSearch} style="display: flex; justify-content: center;">
            <div>
                <input type="text" name="search" style="position: unset;" />
                <input type="submit" value="Search" style="display: inline;" ?disabled=${isLoading} />
            </div>
        </form>

        ${isLoading
            ? html`<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
            : ''
        }
        
        ${recipes.map(recipe => html`
            <article @click=${() => recipeClickHandler(recipe._id)} class="preview">
                <div class="title">
                    <h2>${recipe.name}</h2>
                </div>
                <div class="small">
                    <img src=${recipe.img} alt=${recipe.name} />
                </div>
            </article>
        `)}
    </section>
`;

export default function catalogPage(ctx) {
    const searchParams = new URLSearchParams(ctx.querystring);

    // const filter = Object.fromEntries(searchParams.entries());
    const filter = {
        search: searchParams.get('search'),
    };

    render(template([], searchSubmitHandler, true), mainSection);

    recipes.getAll(filter)
        .then(recipes => {
            render(template(recipes, searchSubmitHandler), mainSection);
        })
        .catch(err => alert(err.message));
}

async function recipeClickHandler(recipeId) {
    page.redirect(`/catalog/${recipeId}`)
}

function searchSubmitHandler(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = formData.get('search');

    page.redirect(`/catalog?search=${search}`);
};



