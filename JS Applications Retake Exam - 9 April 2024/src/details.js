import { render, html, page } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data, hasUserLikedSolution, likesCount) => {
  let isOwner = data._ownerId === localStorage.getItem('userId');
  let isLoggedIn=localStorage.getItem('accessToken')!==null;

  return html`
       <section id="details">
          <div id="details-wrapper">
            <img
              id="details-img"
              src=${data.imageUrl}
              alt=${data._id}
            />
            <div>
              <p id="details-type">${data.type}</p>
              <div id="info-wrapper">
                <div id="details-description">
                  <p id="description">
                  ${data.description}
                  </p>
                  <p id="more-info">
                 ${data.learnMore}
                  </p>
                </div>
              </div>
              <h3>Like Solution:<span id="like">${likesCount}</span></h3>

              ${isOwner
      ?
      html`<div id="action-buttons">
                <a @click=${(e) => onClickEdit(e, data._id)} href="#" id="edit-btn">Edit</a>
                <a @click=${(e) => onClickDelete(e, data._id)} href="#" id="delete-btn">Delete</a>
                </div>`
      :
      ''
    }
                <!--Bonus - Only for logged-in users ( not authors )-->
                ${!isOwner && isLoggedIn && !hasUserLikedSolution
                ?
                html`
                <div id="action-buttons">
                <a @click=${(e) => onClick(e, data._id)} href="#" id="like-btn">Like</a>
                </div>`
              :
              ''
            }
            </div>
          </div>
        </section>`;
}

export const detailsPage = async (ctx) => {
  let id = ctx.params.id;
  let hasUserLikedSolution = await checkIfUserLikedSolution(id) === 1;
  let likesCount = await getLikesCount(id);

  let response = await fetch(`${baseUrl}/data/solutions/${id}`);

  if (!response.ok) {
    throw new Error(response.status);
  }

  let data = await response.json();

  render(template(data, hasUserLikedSolution, likesCount), document.querySelector('#main-element'));
}

const onClickEdit = (e, id) => {
  e.preventDefault();

  page.redirect(`/dashboard/edit/${id}`);
}

const onClickDelete = (e, id) => {
  e.preventDefault();

  page.redirect(`/dashboard/delete/${id}`);
}

const checkIfUserLikedSolution = async (id) => {
  try {
    let userId = localStorage.getItem('userId');
    let response = await fetch(`${baseUrl}/data/likes?where=solutionId%3D%22${id}%22%20and%20_ownerId%3D%22${userId}%22&count`);

    if (!response.ok) {
      throw new Error(response.status);
    }

    let data = await response.json();

    return data;
  }
  catch (err) {
    alert(err.message);
  }
}

const getLikesCount = async (id) => {
  try {
    let response = await fetch(`${baseUrl}/data/likes?where=solutionId%3D%22${id}%22&distinct=_ownerId&count`);

    if (!response.ok) {
      throw new Error(response.status);
    }

    let data = await response.json();

    return data;
  }
  catch (err) {
    alert(err.message);
  }
}

const onClick = async (e, id) => {
  e.preventDefault();

  try {
    let response = await fetch(`${baseUrl}/data/likes`, {
      method: 'POST',
      body: JSON.stringify({ solutionId:id }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('accessToken')
      }
    });

    if (!response.ok) {
      throw new Error(response.status);
    }

    page(`/dashboard/${id}`);
  }
  catch (err) {
    alert(err.message);
  }
}

