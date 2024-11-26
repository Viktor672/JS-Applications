import page from "//unpkg.com/page/page.mjs";

import recipes from "../api/recipes.js";

export default function deletePage(ctx) {
    recipes.delete(ctx.params.recipeId)
        .then(() => {
            ctx.showNotification('Successfully deleted recipe!');

            page.redirect('/catalog');
        });
}
