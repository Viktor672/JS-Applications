import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
      <section id="create">
          <div class="form">
            <h2>Add Show</h2>
            <form @submit=${onSubmit} class="create-form">
              <input
              type="text"
              name="title"
              id="title"
              placeholder="TV Show title"
            />
            <input
              type="text"
              name="image-url"
              id="image-url"
              placeholder="Image URL"
            />
            <input
            type="text"
            name="genre"
            id="genre"
            placeholder="Genre"
          />
          <input
          type="text"
          name="country"
          id="country"
          placeholder="Country"
        />
            <textarea
              id="details"
              name="details"
              placeholder="Details"
              rows="2"
              cols="10"
            ></textarea>
              <button type="submit">Add Show</button>
            </form>
          </div>
        </section>
    `;
}

export const createPage = async () => {
  render(template(), document.querySelector('#main-element'));
}

const onSubmit = async (e) => {
  e.preventDefault();

  try {
    let formData = Object.fromEntries(new FormData(e.currentTarget));

    let { title, 'image-url': imageUrl, genre, country, details } = formData;

    if (title === '' || imageUrl === '' || genre === '' || country === '' || details === '') {
      throw new Error('All fields are required!');
    }

    let response = await fetch(`${baseUrl}/data/shows`, {
      method: 'POST',
      body: JSON.stringify({ title, imageUrl, genre, country, details }),
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