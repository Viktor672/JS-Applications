import {page,render,html} from '../lib/bible.js';

let baseUrl='http://localhost:3030';

const template=(data)=>{
    return html`
    <h2>Users Recommendations</h2>
        <section id="shows">
          ${data.length>0
          ?
          html`${data.map((curEl)=>html`<div class="show">
            <img src=${curEl.imageUrl} alt=${curEl._id} />
            <div class="show-info">
              <h3 class="title">${curEl.title}</h3>
              <p class="genre">${curEl.genre}</p>
              <p class="country-of-origin">${curEl.country}</p>
              <a @click=${(e)=>onClick(e,curEl._id)} class="details-btn" href="#">Details</a>
            </div>
          </div>`)}`
          :
          html`<h2 id="no-show">No shows Added.</h2>`
          }
        </section>
        `;
}

export const dashboardPage = async()=>{
try{
let response=await fetch(`${baseUrl}/data/shows?sortBy=_createdOn%20desc`);

if(!response.ok){
  throw new Error(response.status);
}

let data=await response.json();
console.log(data);


render(template(data),document.querySelector('#main-element'));
}
catch(err){
  alert(err.message);
}

}

const onClick = async (e,id) => {
    e.preventDefault();

    page.redirect(`/dashboard/${id}`);
}