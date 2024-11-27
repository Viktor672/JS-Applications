import { page, render, html } from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';


let baseUrl = 'http://localhost:3030';

export let template = (onSubmit) => {
    return html`
       <section id="login">
          <div class="form">
            <h2>Login</h2>
            <form class="login-form" @submit=${onSubmit}>
              <input type="text" name="email" id="email" placeholder="email" />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
              />
              <button type="submit">login</button>
              <p class="message">
                Not registered? <a href="/register">Create an account</a>
              </p>
            </form>
          </div>
        </section>

    `;
}

export const loginPage = () => {
    render(template(onSubmit), document.querySelector('#main-element'));
}

const onSubmit = async (e) => {
    e.preventDefault();

    try {
        let formData = Object.fromEntries(new FormData(e.currentTarget));   //possible error
        let email = formData.email;
        let password = formData.password;

        if (email === '' || password === '') {
            throw new Error('All fields are required!');
        }

        let response = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        let data = await response.json();

        console.log(data);

        localStorage.setItem('userId', data._id);
        localStorage.setItem('accessToken', data.accessToken);
        page.redirect('/');
    }
    catch (error) {
        alert(error.message);
        displayMessageError(error.message);
    }
}
