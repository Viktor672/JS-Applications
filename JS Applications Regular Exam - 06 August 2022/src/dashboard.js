import {page,render,html} from '../lib/bible.js';

let baseUrl='http://localhost:3030';

const template = (data) => {
    return html`
       <!-- Dashboard page -->
       <section id="dashboard">
          <h2>Job Offers</h2>

          <!-- Display a div with information about every post (if any)-->
          ${data.length>0
          ?
            html`${data.map(curEl=>html`<div class="offer">
            <img src=${curEl.imageUrl} alt=${curEl._id} />
            <p>
              <strong>Title: </strong><span class="title">${curEl.title}</span>
            </p>
            <p><strong>Salary:</strong><span class="salary">${curEl.salary}</span></p>
            <a class="details-btn" href="/dashboard/${curEl._id}">Details</a>
          </div>`)}`
          :
          html`<h2>No offers yet.</h2>`
          }
        </section>
    `;
}

export const dashboardPage = async() => {
  try{
  let response=await fetch(`${baseUrl}/data/offers?sortBy=_createdOn%20desc`);

  if(!response.ok){
    throw new Error(response.status);
  }

let data=await response.json(); 
console.log(data);

  render(template(data), document.querySelector('#main-element'));
  }
  catch(err){
    alert(err.message);
  }
}
