import { render, html, page } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
    <section id="login">
          <div class="form">
            <img class="border" src="./images/border.png" alt="" />
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

export const loginPage = async () => {
  render(template(), document.querySelector('#main-element'));
}

const onSubmit = async (e) => {
  e.preventDefault();

  try {
    let formData = Object.fromEntries(new FormData(e.currentTarget));

    let email = formData.email;
    let password = formData.password;

    if (email === '' || password === '') {
      throw new Error('All fields are required');
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

    localStorage.setItem('userId', data._id);
    localStorage.setItem('accessToken', data.accessToken);

    page.redirect('/');
  }
  catch (err) {
    alert(err.message);
  }
}