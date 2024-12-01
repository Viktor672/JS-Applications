import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  let userId = localStorage.getItem('userId');
  let isOwner = data._ownerId === userId;

  return html`
     <section id="details">
          <div id="details-wrapper">
            <img id="details-img" src=${data.imageUrl} alt=${data._id} />
            <div id="details-text">
              <p id="details-title">${data.title}</p>
              <div id="info-wrapper">
                <div id="description">
                  <p id="details-description">
                    ${data.details}
                  </p>
                </div>
              </div>
          

              <!--Edit and Delete are only for creator-->
              ${isOwner
      ?
      html`<div id="action-buttons">
                <a href="/dashboard/edit/${data._id}" id="edit-btn">Edit</a>
                <a href="/dashboard/delete/${data._id}" id="delete-btn">Delete</a>
              </div>
            </div>
          </div>`
      :
      ''
    }
        </section>`;
}

export const detailsPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/shows/${id}`);

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