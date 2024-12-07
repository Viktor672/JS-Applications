import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data,onSubmit) => {
  return html`
      <!-- Edit Page (Only for logged-in users) -->
      <section id="edit">
          <div class="form">
            <img class="border" src="./images/border.png" alt="">
            <h2>Edit Character</h2>
            <form @submit=${onSubmit} class="edit-form">
              <input
              type="text"
              name="category"
              id="category"
              placeholder="Character Type"
              value=${data.category}
            />
            <input
              type="text"
              name="image-url"
              id="image-url"
              placeholder="Image URL"
              value=${data.imageUrl}
            />
            <textarea
            id="description"
            name="description"
            placeholder="Description"
            rows="2"
            cols="10">
           ${data.description}
          </textarea>
          <textarea
            id="additional-info"
            name="additional-info"
            placeholder="Additional Info"
            rows="2"
            cols="10">
          ${data.moreInfo}
          </textarea>
              <button type="submit">Edit</button>
            </form>
            <img class="border" src="./images/border.png" alt="">
          </div>
        </section>
        
     `;
}

export const editPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/characters/${id}`);

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

    let { category, 'image-url': imageUrl, description, 'additional-info': moreInfo } = formData;

    if (category === '' || imageUrl === '' || description === '' || moreInfo === '') {
      alert('All fields are required!');
      return;
    }

    let response = await fetch(`${baseUrl}/data/characters/${id}`, {
      method: 'PUT',
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

    page.redirect(`/dashboard/${id}`);
  }
  catch (err) {
    alert(err.message);
  }
}