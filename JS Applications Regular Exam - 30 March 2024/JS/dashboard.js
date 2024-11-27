import { page, render, html } from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  return html`
     <h3 class="heading">Market</h3>
        <section id="dashboard">
          ${data.length > 0 ?
      //here
      html`          
        ${data.map(curEl => html`
             <div class="item">
             <img src=${curEl.imageUrl} alt=${curEl._id} />
             <h3 class="model">${curEl.item}</h3>
             <div class="item-info">
             <p class="price">Price: €${curEl.price}</p>
             <p class="availability">
             ${curEl.availability}
             </p>
             <p class="type">Type: ${curEl.type}</p>
             </div>
             <a @click=${(e) => onClick(e, curEl._id)} class="details-btn" href="#">Uncover More</a>
             </div>`)}`
      :
      html`<h3 class="empty">No Items Yet</h3>`
    }
      </section>`;
}

export const dashboardPage = async () => {
  try {
    let response = await fetch(`${baseUrl}/data/cyberpunk?sortBy=_createdOn%20desc`);
    if (!response.ok) {
      throw new Error(response.status);
    }
    let data = await response.json();
    render(template(data), document.querySelector('#main-element'));
  }
  catch (error) {
    displayMessageError(error.message);
  }
}

const onClick = async (e, id) => {
  e.preventDefault();

  page.redirect(`/market/${id}`);
}
