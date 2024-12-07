import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data,onSubmit) => {
  return html`
     <!-- Edit Page (Only for logged-in users) -->
     <section id="edit">
          <div class="form">
            <h2>Edit tattoo</h2>
            <form @submit=${onSubmit} class="edit-form">
              <input
                type="text"
                name="type"
                id="type"
                placeholder="Tattoo Type"
                value=${data.type}
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
                cols="10"
              >${data.description}</textarea>
              <select id="user-type" name="user-type" .value=${data.userType}>
                <option value="" disabled selected>Select your role</option>
                <option value="Tattoo Artist">Tattoo Artist</option>
                <option value="Tattoo Enthusiast">Tattoo Enthusiast</option>
                <option value="First Time in Tattoo">
                  First Time in Tattoo
                </option>
                <option value="Tattoo Collector">Tattoo Collector</option>
              </select>
              <button type="submit">Edit</button>
            </form>
          </div>
        </section>
     `;
}

export const editPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/tattoos/${id}`);

    if (!response.ok) {
      alert(response.status);
      return;
    }

    let data = await response.json();

    render(template(data,onSubmit.bind(ctx)), document.querySelector('#main-element'));
  }
  catch (err) {
    alert(err.message);
  }
}

async function onSubmit(e) {
  e.preventDefault();

  try {
let id=this.params.id;

    let formData = Object.fromEntries(new FormData(e.currentTarget));

    let { description, 'image-url': imageUrl, type, 'user-type': userType } = formData;

    if (type === '' || imageUrl === '' || description === '' || userType === '') {
      alert('All fields are required!');
      return;
    }

    let response = await fetch(`${baseUrl}/data/tattoos/${id}`, {
      method: 'PUT',
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

    page.redirect(`/dashboard/${id}`);
  }
  catch (err) {
    alert(err.message);
  }
}