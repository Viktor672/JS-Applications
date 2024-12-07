import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
       <!-- Register Page (Only for Guest users) -->
       <section id="register">
          <div class="form">
            <h2>Register</h2>
            <form @submit=${onSubmit} class="register-form">
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
  render(template(), document.querySelector('#main-element'));
}

async function onSubmit(e) {
  e.preventDefault();

  try {
    let formData = Object.fromEntries(new FormData(e.currentTarget));
   console.log(formData);
   
    let { email, password, 're-password': rePassword } = formData;

    if (email === '' || password === '' || rePassword === '') {
      alert('No empty fields are allowed!');
      return;
    }

    if (password != rePassword) {
      alert('Passwords must match!');
      return;
    }

    let response = await fetch(`${baseUrl}/users/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      alert(response.status);
      return;
    }

    let data = await response.json();
    console.log(data);
    localStorage.setItem('userId', data._id);
    localStorage.setItem('accessToken', data.accessToken);

    page.redirect('/');
  }
  catch (err) {
    alert(err.message);
  }
}