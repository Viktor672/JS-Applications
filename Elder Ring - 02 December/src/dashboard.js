import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  return html`
    <h2>Characters</h2>
        <section id="characters">
       ${data.length > 0
      ?
      html`${data.map((curEl) => html`
           <div class="character">
            <img src=${curEl.imageUrl} alt=${curEl._id} />
            <div class="hero-info">
              <h3 class="category">${curEl.category}</h3>
              <p class="description">${curEl.description}</p>
              <a class="details-btn" href="/dashboard/${curEl._id}">More Info</a>
            </div>
          </div>`)}
        </section>`
      :
      html`<h2> No added Heroes yet.</h2 >`
    }
    `;
}

export const dashboardPage = async () => {
  try {
    let response = await fetch(`${baseUrl}/data/characters?sortBy=_createdOn%20desc`);

    if (!response.ok) {
      alert(response.status);
      return;
    }

    let data = await response.json();
    console.log(data);
    
    render(template(data), document.querySelector('#main-element'));
  }
  catch (err) {
    alert(err.message);
  }

}