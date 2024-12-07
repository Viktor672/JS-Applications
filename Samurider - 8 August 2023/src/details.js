import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  let hasUserLoggedIn = localStorage.getItem('accessToken') !== null;
  let userId = localStorage.getItem('userId');
  let isOwner = data._ownerId === userId;

  return html`
   <section id="details">
          <div id="details-wrapper">
            <img id="details-img" src=${data.imageUrl} alt=${data._id} />
            <p id="details-title">${data.model}</p>
            <div id="info-wrapper">
              <div id="details-description">
                <p class="year">Year: ${data.year}</p>
                <p class="mileage">Mileage: ${data.mileage}</p>
                <p class="contact">Contact Number: ${data.contact}</p>
                   <p id = "motorcycle-description">${data.about}</p>
              </div>
               <!--Edit and Delete are only for creator-->
          <div id="action-buttons">
            ${isOwner && hasUserLoggedIn
      ?
      html`<a href="/dashboard/edit/${data._id}" id="edit-btn">Edit</a>
            <a href="/dashboard/delete/${data._id}" id="delete-btn">Delete</a>`
      :
      ''
    }
          </div>
            </div>
        </div>
      </section>
  `;
}

export const detailsPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let userId = localStorage.getItem('userId');

    let response = await fetch(`${baseUrl}/data/motorcycles/${id}`);

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