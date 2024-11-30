import { render, html, page } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
     <section id="create">
          <div class="form">
            <img class="border" src="./images/border.png" alt="" />
            <h2>Add Solution</h2>
            <form @submit=${onSubmit} class="create-form">
              <input
                type="text"
                name="type"
                id="type"
                placeholder="Solution Type"
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
                id="more-info"
                name="more-info"
                placeholder="more Info"
                rows="2"
                cols="10"
              ></textarea>
              <button type="submit">Add Solution</button>
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
    console.log(formData);
    
    let { type, 'image-url':imageUrl, description, 'more-info':learnMore } = formData;

    if (type === '' || imageUrl === '' || description === '' || learnMore === '') {
      throw new Error('All fields are required');
    }

    let response = await fetch(`${baseUrl}/data/solutions`, {
      method: 'POST',
      body: JSON.stringify({ type, imageUrl, description, learnMore }),
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