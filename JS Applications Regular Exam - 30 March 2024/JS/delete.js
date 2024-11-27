import { page, render, html } from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';

let baseUrl = 'http://localhost:3030';


export const deletePage = async (ctx) => {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            console.log(ctx);
            let id = ctx.params.id;
            let accessToken = localStorage.getItem('accessToken');

            let response = await fetch(`${baseUrl}/data/cyberpunk/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-Authorization': accessToken
                }
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            page.redirect(`/market`);
        }
        catch (error) {
            displayMessageError(error.message);
        }
    }
}

