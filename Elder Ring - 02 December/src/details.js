import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data, totalLikes, hasUserLiked, likeHandler) => {
  let userId = localStorage.getItem('userId');
  let isOwner = data._ownerId === userId;
  let isUserLoggedIn = localStorage.getItem('accessToken') !== null;
  return html`
      <!-- Details page -->
      <section id="details">
          <div id="details-wrapper">
            <img id="details-img" src=${data.imageUrl} alt=${data._id} />
            <div>
            <p id="details-category">${data.category}</p>
            <div id="info-wrapper">
              <div id="details-description">
                <p id="description">${data.description}</p>
                   <p id ="more-info">${data.moreInfo}</p>
              </div>
            </div>
              <h3>Is This Useful:<span id="likes">${totalLikes}</span></h3>
              <div id="action-buttons">
               <!--Edit and Delete are only for creator-->
               ${isOwner && isUserLoggedIn
      ?
      html` <a href="/dashboard/edit/${data._id}" id="edit-btn">Edit</a>
            <a href="/dashboard/delete/${data._id}" id="delete-btn">Delete</a>`
      :
      ''
    }
             <!--Bonus - Only for logged-in users ( not authors )-->
             ${!isOwner && !hasUserLiked && isUserLoggedIn
      ?
      html`<a @click=${likeHandler}  href="/dashboard/${data._id}" id="like-btn">Like</a>`
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

      let response = await fetch(`${baseUrl}/data/characters/${id}`);

      if (!response.ok) {
        alert(response.status);
        return;
      }

      let data = await response.json();
    console.log(data);
    
      let totalLikes = await getTotalLikes(id);
      let hasUserLiked = await checkIfUserLiked(id, userId);
      render(template(data, totalLikes, hasUserLiked, likeHandler.bind(ctx)), document.querySelector('#main-element'));


    }
    catch (err) {
      alert(err.message);
    }
  }

  async function likeHandler(e) {
    try{
    let id = this.params.id;

    let response = await fetch(`${baseUrl}/data/useful`, {
      method: 'POST',
      body: JSON.stringify({ characterId: id }),
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('accessToken')
      }
    });

    if (!response.ok) {
      alert(response.status);
      return;
    }
  }
  catch(err){
    alert(err.message);
    return;
  }
  }

  async function fetchData(url) {
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Authorization': localStorage.getItem('accessToken')
        }
      });

      if (!response.ok) {
        alert(response.status);
        return;
      }

      return await response.json();
    }
    catch (err) {
      alert(err.message);
    }
  }


  async function getTotalLikes(id) {
    let url = `${baseUrl}/data/useful?where=characterId%3D%22${id}%22&distinct=_ownerId&count`;
    return await fetchData(url);
  }

  async function checkIfUserLiked(id, userId) {
    let url = `${baseUrl}/data/useful?where=characterId%3D%22${id}%22%20and%20_ownerId%3D%22${userId}%22&count`;
    return await fetchData(url);
  }
