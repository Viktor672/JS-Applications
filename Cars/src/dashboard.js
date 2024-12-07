import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  return html`
     <!-- Dashboard page -->
     <h3 class="heading">Our Cars</h3>
        <section id="dashboard">
          <!-- Display a div with information about every post (if any)-->
        ${data.length>0
      ?
      html`${data.map((curEl) => html`<div class="car">
            <img src=${curEl.imageUrl} alt=${curEl._id} />
            <h3 class="model">${curEl.model}</h3>
            <div class="specs">
              <p class="price">${curEl.price}</p>
              <p class="weight">${curEl.weight}</p>
              <p class="top-speed">${curEl.speed}</p>
            </div>
            <a class="details-btn" href="/dashboard/${curEl._id}">More Info</a>
          </div> 
        </section>`)}`
      :
      html`<h3 class="nothing">Nothing to see yet</h3>`
    }
    `;
}

export const dashboardPage = async () => {
  try {
    let response = await fetch(`${baseUrl}/data/cars?sortBy=_createdOn%20desc`);

    if (!response.ok) {
      throw new Error(response.status);
    }
    let data = await response.json();
    console.log(data);
    render(template(data), document.querySelector('#main-element'));
  }
  catch (err) {
    alert(err.message);
  }
}