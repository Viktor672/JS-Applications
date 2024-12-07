import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
      <section id="create">
          <div class="form form-auto">
            <h2>Share Your Car</h2>
            <form @submit=${onSubmit} class="create-form">
              <input type="text" name="model" id="model" placeholder="Model"/>
              <input
                type="text"
                name="imageUrl"
                id="car-image"
                placeholder="Your Car Image URL"
              />
              <input
                type="text"
                name="price"
                id="price"
                placeholder="Price in Euro"
              />
              <input
                type="number"
                name="weight"
                id="weight"
                placeholder="Weight in Kg"
              />
              <input
                type="text"
                name="speed"
                id="speed"
                placeholder="Top Speed in Kmh"
              />
              <textarea
                id="about"
                name="about"
                placeholder="More About The Car"
                rows="10"
                cols="50"
              ></textarea>
              <button type="submit">Add</button>
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

    let { model, imageUrl, price, weight, speed, about } = formData;

    if (model === '' || imageUrl === '' || price === '' || weight === '' || speed === '' || about === '') {
      throw new Error('All fields are required!');
    }

    let response = await fetch(`${baseUrl}/data/cars`, {
      method: 'POST',
      body: JSON.stringify({ model, imageUrl, price, weight, speed, about }),
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