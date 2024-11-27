import { page, render, html } from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';
let baseUrl = 'http://localhost:3030';



const template = (onSubmit) => {
  return html`
       <section id="create">
          <div class="form form-item">
            <h2>Share Your item</h2>
            <form class="create-form" @submit=${onSubmit}>
              <input type="text" name="item" id="item" placeholder="Item" />
              <input
                type="text"
                name="imageUrl"
                id="item-image"
                placeholder="Your item Image URL"
              />
              <input
                type="text"
                name="price"
                id="price"
                placeholder="Price in Euro"
              />
              <input
                type="text"
                name="availability"
                id="availability"
                placeholder="Availability Information"
              />
              <input
                type="text"
                name="type"
                id="type"
                placeholder="Item Type"
              />
              <textarea
                id="description"
                name="description"
                placeholder="More About The Item"
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
  render(template(onSubmit), document.querySelector('#main-element'));
}

const onSubmit = async (e) => {
  e.preventDefault();

  try {
    let formData = Object.fromEntries(new FormData(e.currentTarget));
    let { item, imageUrl, price, availability, type, description } = formData;

    if (item === "" || imageUrl === "" || price === "" || availability === "" || type === "" || description === "") {
      throw new Error("All fields are required!");
    }

    let accessToken = localStorage.getItem('accessToken');

    let response = await fetch(`${baseUrl}/data/cyberpunk`, {
      method: 'POST',
      body: JSON.stringify({ item, imageUrl, price, availability, type, description }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': accessToken
      }
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    page.redirect('/market');
  }
  catch (error) {
    displayMessageError(error.message);
  }
}
