import { page, render, html } from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';


let baseUrl = 'http://localhost:3030';


function template(data) {
  return html`
     <section id="edit">
          <div class="form form-item">
            <h2>Edit Your Item</h2>
            <form class="edit-form" @submit=${(e) => onSubmit(e, data._id)}>
              <input type="text" name="item" id="item" placeholder="Item" value=${data.item} />
              <input
                type="text"
                name="imageUrl"
                id="item-image"
                placeholder="Your item Image URL"
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
                type="text"
                name="availability"
                id="availability"
                placeholder="Availability Information"
                value=${data.availability}
              />
              <input
                type="text"
                name="type"
                id="type"
                placeholder="Item Type"
                value=${data.type}
              />
              <textarea
                id="description"
                name="description"
                placeholder="More About The Item"
                rows="10"
                cols="50"
              >${data.description}</textarea>
              <button type="submit">Edit</button>
            </form>
          </div>
        </section>`;
}

export const editPage = async (ctx) => {
  try {
    console.log(ctx);

    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/cyberpunk/${id}`);
    if (!response.ok) {
      throw new Error(response.status);
    }
    let data = await response.json();

    render(template(data), document.querySelector('#main-element'));
  }
  catch (error) {
    displayMessageError(error.message);
  }
}

const onSubmit = async (e, id) => {
  e.preventDefault();

  try {
    let formData = Object.fromEntries(new FormData(e.currentTarget));
    console.log(formData);

    let { item, imageUrl, price, availability, type, description } = formData;

    if (item === '' || imageUrl === '' || price === '' || availability === '' || type === '' || description === '') {
      throw new Error("All fields are required!");
    }

    let accessToken = localStorage.getItem('accessToken');
    let response = await fetch(`${baseUrl}/data/cyberpunk/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ item, imageUrl, price, availability, type, description }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': accessToken
      }
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    page.redirect(`/market/${id}`);
  }
  catch (error) {
    displayMessageError(error.message);
  }
}
