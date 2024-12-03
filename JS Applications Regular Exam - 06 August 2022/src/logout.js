import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';


export const logoutPage = async () => {
    try {
        let response = await fetch(`${baseUrl}/users/logout`, {
            method: 'GET',
            headers: {
                'X-Authorization': localStorage.getItem('accessToken')
            }
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        localStorage.clear();

        page.redirect('/dashboard');
    }
    catch (err) {
        alert(err.message);
    }
}

