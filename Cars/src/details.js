import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  let isUserLoggedIn = localStorage.getItem('accessToken') !== null;
  let userId = localStorage.getItem('userId');
  let isOwner = userId === data._ownerId;
  return html`
   <section id="details">
          <div id="details-wrapper">
            <img id="details-img" src=${data.imageUrl} alt=${data._id} />
            <p id="details-title">${data.model}</p>
            <div id="info-wrapper">
              <div id="details-description">
                <p class="price">${data.price}</p>
                <p class="weight">${data.weight}</p>
                <p class="top-speed">${data.speed}</p>
                <p id="car-description">
                  ${data.about}
              </p>
              </div>
              <!--Edit and Delete are only for creator-->
              ${isOwner && isUserLoggedIn
      ?
      html`<div id="action-buttons">
                <a href="/dashboard/edit/${data._id}" id="edit-btn">Edit</a>
                <a href="/dashboard/delete/${data._id}" id="delete-btn">Delete</a>
              </div>`
      :
      ''
    }
            </div>
          </div>
        </section>
  `;
}

export const detailsPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/cars/${id}`);

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