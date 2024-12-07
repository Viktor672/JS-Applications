import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
      <!-- Create Page (Only for logged-in users) -->
      <section id="create">
          <div class="form">
            <img class="border" src="./images/border.png" alt="">
            <h2>Add Character</h2>
            <form @submit=${onSubmit} class="create-form">
              <input
                type="text"
                name="category"
                id="category"
                placeholder="Character Type"
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
            <textarea
              id="additional-info"
              name="additional-info"
              placeholder="Additional Info"
              rows="2"
              cols="10"
            ></textarea>
              <button type="submit">Add Character</button>
            </form>
            <img class="border" src="./images/border.png" alt="">
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

    let { category, 'image-url': imageUrl, description, 'additional-info': moreInfo } = formData;

    if (category === '' || imageUrl === '' || description === '' || moreInfo === '') {
      alert('All fields are required!');
      return;
    }

    let response = await fetch(`${baseUrl}/data/characters`, {
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