import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  return html`
     <!-- Dashboard page -->
      ${data.length > 0
      ?
      html`<h2>Available Motorcycles</h2>
        <section id="dashboard">
          ${data.map((curEl) => html`<div class="motorcycle">
            <img src=${curEl.imageUrl} alt=${curEl._id} />
            <h3 class="model">${curEl.model}</h3>
            <p class="year">${curEl.year}</p>
            <p class="mileage">${curEl.mileage}</p>
            <p class="contact">${curEl.contact}</p>
            <a class="details-btn" href="/dashboard/${curEl._id}">More Info</a>
          </div>
        </section>`)}`
      :
      html`<h2 class="no-avaliable">No avaliable motorcycles yet.</h2>`
    }
    `;
}

export const dashboardPage = async () => {
  try {
    let response = await fetch(`${baseUrl}/data/motorcycles?sortBy=_createdOn%20desc`);

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