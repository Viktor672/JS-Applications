import { render, html, page } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  return html`
    <h2>Solutions</h2>
    <section id="solutions">
    ${data.length > 0
      ?
      html`${data.map((curEl) => html`<div class="solution">
            <img src=${curEl.imageUrl} alt=${curEl._id} />
            <div class="solution-info">
              <h3 class="type">${curEl.type}</h3>
              <p class="description">
                ${curEl.description}
              </p>
              <a @click=${(e) => onClick(e, curEl._id)} class="details-btn" href="#">Learn More</a>
            </div>
          </div>`)}`
      :
      html`<h2 id="no-solution">No Solutions Added.</h2>`
    }
    </section>
    `}

export const dashboardPage = async () => {
  let response = await fetch(`${baseUrl}/data/solutions?sortBy=_createdOn%20desc`);

  if (!response.ok) {
    console.log(response.status);
  }

  let data = await response.json();
  render(template(data), document.querySelector('#main-element'));
}

function onClick(e, id) {
  e.preventDefault();

  page.redirect(`/dashboard/${id}`);
}