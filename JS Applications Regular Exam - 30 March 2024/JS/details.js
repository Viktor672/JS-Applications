import { page, render, html } from '../../lib/bible.js';
import { displayMessageError } from '../ErrorMessenger/errorMessenger.js';

let baseUrl = 'http://localhost:3030';


const template = (data) => {
  let userId = localStorage.getItem('userId');
  let isOwner = data._ownerId === userId;


  //possible ERROR!!!!!
  return html`
       <section id="details">
          <div id="details-wrapper">
            <div>
              <img id="details-img" src=${data.imageUrl} alt=${data._id} />
              <p id="details-title">${data.item}</p>
            </div>
            <div id="info-wrapper">
              <div id="details-description">
                <p class="details-price">Price: ${data.price}</p>
                <p class="details-availability">
                ${data.availability}
                </p>                                                
                <p class="type">Type: ${data.type}</p>
                <p id="item-description">
                ${data.description}
                </p>
                <div id="action-buttons">
                ${isOwner ?
      html`<a href="" @click=${(e) => editButton(e, data._id)} id="edit-btn">Edit</a>
        <a href="" @click=${(e) => deleteButton(e, data._id)} id="delete-btn">Delete</a>`
      : ''
    }
      </div>
                </div>
</section>`;
}

export const detailsPage = async (ctx) => {
  try {

    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/cyberpunk/${id}`);

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

const editButton = async (e, id) => {
  e.preventDefault();

  page.redirect(`/market/edit/${id}`);
}

const deleteButton = async (e, id) => {
  e.preventDefault();

  page.redirect(`/market/delete/${id}`);
}
