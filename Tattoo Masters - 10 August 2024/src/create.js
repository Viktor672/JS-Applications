import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
      <!-- Create Page (Only for logged-in users) -->
      <section id="create">
          <div class="form">
            <h2>Add tattoo</h2>
            <form @submit=${onSubmit} class="create-form">
              <input
                type="text"
                name="type"
                id="type"
                placeholder="Tattoo Type"
              />
              <input
                type="text"
                name="image-url"
                id="image-url"
                placeholder="Image URL"
              />
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                rows="2"
                cols="10"
              ></textarea>
              <select id="user-type" name="user-type">
                <option value="" disabled selected>Select your role</option>
                <option value="Tattoo Artist">Tattoo Artist</option>
                <option value="Tattoo Enthusiast">Tattoo Enthusiast</option>
                <option value="First Time in Tattoo">
                  First Time in Tattoo
                </option>
                <option value="Tattoo Collector">Tattoo Collector</option>
              </select>
              <button type="submit">Add tattoo</button>
            </form>
          </div>
        </section>
    `;
}

export const createPage = async () => {
  render(template(), document.querySelector('#main-element'));
}

async function onSubmit(e) {
  e.preventDefault();

  try {
    let formData = Object.fromEntries(new FormData(e.currentTarget));
    console.log(formData);

    let { description, 'image-url': imageUrl, type, 'user-type': userType } = formData;

    if (type === '' || imageUrl === '' || description === '' || userType === '') {
      alert('All fields are required!');
      return;
    }

    let response = await fetch(`${baseUrl}/data/tattoos`, {
      method: 'POST',
      body: JSON.stringify({ type, imageUrl, description, userType }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('accessToken')
      }
    });

    if (!response.ok) {
      alert(response.status);
      return;
    }

    page.redirect('/dashboard');
  }
  catch (err) {
    alert(err.message);
  }
}