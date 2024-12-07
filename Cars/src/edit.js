import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data, onSubmit) => {
  return html`
      <!-- Edit Page (Only for logged-in users) -->
      <section id="edit">
          <div class="form form-auto">
            <h2>Edit Your Car</h2>
            <form @submit=${onSubmit} class="edit-form">
              <input type="text" name="model" id="model" placeholder="Model" value=${data.model} />
              <input
                type="text"
                name="imageUrl"
                id="car-image"
                placeholder="Your Car Image URL"
                value=${data.imageUrl}
              />
              <input
                type="text"
                name="price"
                id="price"
                placeholder="Price in Euro"
                value=${data.price}
              />
              <input
                type="number"
                name="weight"
                id="weight"
                placeholder="Weight in Kg"
                value=${data.weight}
              />
              <input
                type="text"
                name="speed"
                id="speed"
                placeholder="Top Speed in Kmh"
                value=${data.speed}
              />
              <textarea
                id="about"
                name="about"
                placeholder="More About The Car"
                rows="10"
                cols="50"
              >${data.about}</textarea>
              <button type="submit">Edit</button>
            </form>
          </div>
        </section>
     `;
}

export const editPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/cars/${id}`);

    if (!response.ok) {
      throw new Error(response.status);
    }

    let data = await response.json();


    render(template(data, onSubmit.bind(ctx)), document.querySelector('#main-element'));
  }
  catch (err) {
    alert(err.message);
  }
}

async function onSubmit(e) {
  e.preventDefault();

  try {
    let id = this.params.id;

    let formData = Object.fromEntries(new FormData(e.currentTarget));
    console.log(formData);

    let { model, imageUrl, price, weight, speed, about } = formData;

    if (model === '' || imageUrl === '' || price === '' || weight === '' || speed === '' || about === '') {
      throw new Error('All fields are required!');
    }

    let response = await fetch(`${baseUrl}/data/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ model, imageUrl, price, weight, speed, about }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('accessToken')
      }
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    page.redirect(`/dashboard/${id}`);
  }
  catch (err) {
    alert(err.message);
  }
}