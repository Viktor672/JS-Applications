import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data, totalApplications, hasUserApplied) => {
  let userId = localStorage.getItem('userId');
  let isOwner = data._ownerId === userId;
  let isUserLoggedIn = localStorage.getItem('accessToken') !== null;
  return html`
        <!-- Details page -->
        <section id="details">
            <div id="details-wrapper">
              <img id="details-img" src=${data.imageUrl} alt=${data._id} />
              <p id="details-title">${data.title}</p>
              <p id="details-category">
                Category: <span id="categories">${data.category}</span>
              </p>
              <p id="details-salary">
                Salary: <span id="salary-number">${data.salary}</span>
              </p>
              <div id="info-wrapper">
                <div id="details-description">
                  <h4>Description</h4>
                  <span>${data.description}</span>
                </div>
                <div id="details-requirements">
                  <h4>Requirements</h4>
                  <span>${data.requirements}</span>
                </div>
              </div>
              <p>Applications: <strong id="applications">${totalApplications}</strong></p>

              <!--Edit and Delete are only for creator-->
              <div id="action-buttons">
              ${isOwner
      ?
      html`<a href="/dashboard/edit/${data._id}" id="edit-btn">Edit</a>
                  <a href="/dashboard/delete/${data._id}" id="delete-btn">Delete</a>`
      :
      ''
    }
                <!--Bonus - Only for logged-in users ( not authors )-->
      ${(() => {
      if (!hasUserApplied) {
        if (!isOwner && isUserLoggedIn) {
          return html`<a @click=${(e) => applicationHandler(e, data, data._id)} href="/dashboard/${data._id}" id="apply-btn">Apply</a>`
        }
        return '';
      }
    })()}
              </div>
            </div>
          </section>
      `;
}

let totalApplications;
let hasUserApplied;

export const detailsPage = async (ctx) => {
  let id = ctx.params.id;

  try {
    let response = await fetch(`${baseUrl}/data/offers/${id}`);

    if (!response.ok) {
      throw new Error(response.status);
    }

    let data = await response.json();
    console.log(data);

   await updateData(id);
    render(template(data, totalApplications, hasUserApplied), document.querySelector('#main-element'));
  }
  catch (err) {
    alert(err.message);
  }
}

const applicationHandler = async (e, data, id) => {
  e.preventDefault();

  try {
    let response = await fetch(`${baseUrl}/data/applications`, {
      method: 'POST',
      body: JSON.stringify({ offerId: id }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('accessToken')
      }
    });

    if (!response.ok) {
      throw new Error(response.status);
    }


    await updateData(id);
    render(template(data, totalApplications, hasUserApplied), document.querySelector('#main-element'));
  }
  catch (err) {
    alert(err.message);
  }
}


const fetchData = async (url) => {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    alert(err.message);
  }
};

const getTotalApplications = async (id) => {
  let url = `${baseUrl}/data/applications?where=offerId%3D%22${id}%22&distinct=_ownerId&count`;
  return await fetchData(url);
}

const checkIfUserApplied = async (id, userId) => {
  let url = `${baseUrl}/data/applications?where=offerId%3D%22${id}%22%20and%20_ownerId%3D%22${userId}%22&count`;
  return await fetchData(url);
}

const updateData = async (id)=>{
  totalApplications = await getTotalApplications(id);
  hasUserApplied = await checkIfUserApplied(id, localStorage.getItem('userId'));
}