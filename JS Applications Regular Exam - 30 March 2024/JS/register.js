import { page, render, html } from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';


let baseUrl = 'http://localhost:3030';


const template = (onSubmit) => {
  return html`
     <section id="register">
          <div class="form">
            <h2>Register</h2>
            <form class="register-form" @submit=${onSubmit}>
              <input
                type="text"
                name="email"
                id="register-email"
                placeholder="email"
              />
              <input
                type="password"
                name="password"
                id="register-password"
                placeholder="password"
              />
              <input
                type="password"
                name="re-password"
                id="repeat-password"
                placeholder="repeat password"
              />
              <button type="submit">register</button>
              <p class="message">Already registered? <a href="/login">Login</a></p>
            </form>
          </div>
        </section>

    `;
}

export const registerPage = async () => {
  render(template(onSubmit), document.querySelector('#main-element'));
}

const onSubmit = async (e) => {
  e.preventDefault();

  try {
    let formData = Object.fromEntries(new FormData(e.currentTarget));   //possible error
    let email = formData.email;
    let password = formData.password;
    let repeatedPassword = formData["re-password"];

    if (email === '' || password === '' || repeatedPassword === '') {
      throw new Error('All fields are required!');
    }

    if (password !== repeatedPassword) {
      throw new Error("Passwords don't match");
    }
    //equal passwords
    let response = await fetch(`${baseUrl}/users/register`, {
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



    localStorage.setItem('userId', data._id);
    localStorage.setItem('accessToken', data.accessToken);
    page.redirect('/');
  }
  catch (error) {
    alert(error.message);
    displayMessageError(error.message);
  }
}
