import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
      <!-- Create Page (Only for logged-in users) -->
      <section id="create">
          <div class="form">
            <h2>Add Fact</h2>
            <form @submit=${onSubmit} class="create-form">
              <input
                type="text"
                name="category"
                id="category"
                placeholder="Category"
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
              rows="10"
              cols="50"
            ></textarea>
            <textarea
              id="additional-info"
              name="additional-info"
              placeholder="Additional Info"
              rows="10"
              cols="50"
            ></textarea>
              <button type="submit">Add Fact</button>
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

    let { 'additional-info': moreInfo, category, description, 'image-url': imageUrl } = formData;

    if (moreInfo === '' || category === '' || description === '' || imageUrl === '') {
      alert('All fields are required!');
      return;
    }

    let response = await fetch(`${baseUrl}/data/facts`, {
      method: 'POST',
      body: JSON.stringify({ category, imageUrl, description, moreInfo }),
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