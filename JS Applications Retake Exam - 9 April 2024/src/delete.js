import { render, html, page } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';


export const deletePage = async (ctx) => {
let id=ctx.params.id;
    if (confirm('Are you sure you want to delete this solution?')) {
        try {
            let response = await fetch(`${baseUrl}/data/solutions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json',
                    'X-Authorization': localStorage.getItem('accessToken')
                }
            });

            if (!response.ok) {
                console.log(response.status);
            }

            page.redirect('/dashboard');
        }
        catch (err) {
            alert(err.message);
        }
    }
}