import { page } from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';


let baseUrl = 'http://localhost:3030';


export const logoutPage = async () => {
    try {
        let accessToken = localStorage.getItem('accessToken');
        let response = await fetch(`${baseUrl}/users/logout`, {
            method: 'GET',
            headers: {
                'X-Authorization': accessToken
            }
        });

        if (!response.ok) {
            throw new Error(response.status);
        }
        localStorage.clear();
        page.redirect('/');
    }
    catch (error) {
        displayMessageError(error.message);
    }
}
