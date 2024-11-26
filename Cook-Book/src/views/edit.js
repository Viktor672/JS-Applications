import page from "//unpkg.com/page/page.mjs";
import { html, render } from 'https://unpkg.com/lit-html';

import recipes from "../api/recipes.js";

const mainSection = document.querySelector('body main');

const template = (onSubmit, recipe = {}) => html`
    <section>
        <h2>Edit Recipe</h2>
        <form @submit=${onSubmit}>
            <label>Name: <input type="text" name="name" value="${recipe.name}" placeholder="Recipe name"></label>
            <label>Image: <input type="text" name="img" value="${recipe.img}" placeholder="Image URL"></label>
            <label class="ml">Ingredients: <textarea name="ingredients"
                    placeholder="Enter ingredients on separate lines">${recipe.ingredients?.join('\n')}</textarea></label>
            <label class="ml">Preparation: <textarea name="steps"
                    placeholder="Enter preparation steps on separate lines">${recipe.steps?.join('\n')}</textarea></label>
            <input type="submit" value="Update Recipe">
        </form>
    </section>
`;

export default function editPage(ctx) {
    render(template(editSubmitHandler.bind(ctx)), mainSection);

    recipes.getOne(ctx.params.recipeId)
        .then(recipe => {
            render(template(editSubmitHandler.bind(ctx), recipe), mainSection);
        });
}

function editSubmitHandler(e) {
    e.preventDefault();
    const recipeId = this.params.recipeId;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    data.ingredients = data.ingredients.split('\n');
    data.steps = data.steps.split('\n');

    recipes.update(recipeId, data)
        .then(() => page.redirect(`/catalog/${recipeId}`));
}
