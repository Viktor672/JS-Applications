import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

export const deletePage = async (ctx) => {
    let id = ctx.params.id;

    if (confirm('Are you sure you want to delete this offer')) {
        try {
            let response = await fetch(`${baseUrl}/data/offers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': localStorage.getItem('accessToken')
                }
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            page.redirect('/dashboard');
        }
        catch (err) {
            alert(err.message);
        }
    }
}
