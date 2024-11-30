import { render, html, page } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  return html`
     <section id="edit">
          <div class="form">
              <img class="border" src="/images/border.png" alt="" />
              <h2>Edit Solution</h2>
              <form @submit=${(e) => onSubmit(e, data._id)} class="edit-form">
                  <input type="text" name="type" id="type" placeholder="Solution Type" value=${data.type} />
                  <input type="text" name="image-url" id="image-url" placeholder="Image URL" value=${data.imageUrl} />
                  <textarea id="description" name="description" placeholder="Description" rows="2" cols="10">${data.description}</textarea>
                  <textarea id="more-info" name="more-info" placeholder="more Info" rows="2" cols="10">${data.learnMore}</textarea>
                  <button type="submit">Edit</button>
              </form>
          </div>
      </section>
  `;
}

export const editPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/solutions/${id}`);

    if (!response.ok) {
      console.log(response.status);
    }

    let data = await response.json();
    console.log(data);
    
    render(template(data), document.querySelector('#main-element'));
  }
  catch (err) {
    alert(err.message);
  }
}

const onSubmit = async (e, id) => {
  e.preventDefault();

  try {
    let formData = new FormData(e.currentTarget);

    let type = formData.get('type');
    let imageUrl = formData.get('image-url');
    let description = formData.get('description');
    let learnMore = formData.get('more-info');

    if (type === '' || imageUrl === '' || description === '' || learnMore === '') {
      throw new Error('All fields are required');
    }

    let response = await fetch(`${baseUrl}/data/solutions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ type, imageUrl, description, learnMore }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('accessToken')
      }
    });

    if (!response.ok) {
      console.log(response.status);
    }

    page.redirect(`/dashboard/${id}`);
  }
  catch (err) {
    alert(err.message);
  }
}
