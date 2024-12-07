import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data, onSubmit) => {
  return html`
      <!-- Edit Page (Only for logged-in users) -->
      <section id="edit">
            <h2>Edit Motorcycle</h2>
            <div class="form">
              <h2>Edit Motorcycle</h2>
              <form @submit=${onSubmit} class="edit-form">
                <input
                  type="text"
                  name="model"
                  id="model"
                  placeholder="Model"
                  value=${data.model}
                />
                <input
                  type="text"
                  name="imageUrl"
                  id="moto-image"
                  placeholder="Moto Image"
                  value=${data.imageUrl}
                />
                <input
                type="number"
                name="year"
                id="year"
                placeholder="Year"
                value=${data.year}
              />
              <input
              type="number"
              name="mileage"
              id="mileage"
              placeholder="mileage"
              value=${data.mileage}
            />
            <input
              type="number"
              name="contact"
              id="contact"
              placeholder="contact"
              value=${data.contact}
            />
              <textarea
                id="about"
                name="about"
                placeholder="about"
                rows="10"
                cols="50"
              >${data.about}</textarea>
                <button type="submit">Edit Motorcycle</button>
              </form>
          </div>
        </section>
     `;
}

export const editPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/motorcycles/${id}`);

    if (!response.ok) {
      alert(response.status);
      return;
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

    let { about, contact, imageUrl, mileage, model, year } = formData;

    if (about === '' || contact === '' || imageUrl === '' || mileage === '' || model === '' || year === '') {
      alert('All fields are required!');
      return;
    }

    let response = await fetch(`${baseUrl}/data/motorcycles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ model, imageUrl, year, mileage, contact, about }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('accessToken')
      }
    });

    if (!response.ok) {
      alert(response.status);
      return;
    }

    page.redirect(`/dashboard/${id}`);
  }
  catch (err) {
    alert(err.message);
  }
}