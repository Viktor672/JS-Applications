import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  return html`
     <!-- Dashboard page -->
     <h2>Collection</h2>
     ${data.length>0
      ?
      html`<section id="tattoos">
          ${data.map((curEl) => html`<div class="tattoo">
            <img src=${curEl.imageUrl} alt=${curEl._id} />
            <div class="tattoo-info">
              <h3 class="type">${curEl.type}</h3>
              <span>Uploaded by </span>
              <p class="user-type">${curEl.userType}</p>
              <a class="details-btn" href="/dashboard/${curEl._id}">Learn More</a>
            </div>
          </div>
        </section>`)}`
      :
      html`<h2 id="no-tattoo">Collection is empty, be the first to contribute</h2>`
    }
    `;
}

export const dashboardPage = async () => {
  try {
    let response = await fetch(`${baseUrl}/data/tattoos?sortBy=_createdOn%20desc`);

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