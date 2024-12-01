import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
    return html`
    <!--BONUS Search page -->
    <section id="search">
        <div class="form">
            <h2>Search</h2>
            <form class="search-form" @submit=${onSubmit}>
                <input
                    type="text"
                    name="search"
                    id="search-input"
                />
                <button class="button-list">Search</button>
            </form>
        </div>
        <h4>Results:</h4>
        <div class="search-result"> 
        </div>
    </section>`;
}


export const searchPage = () => {
    render(template(), document.querySelector('#main-element'));
}


const onSubmit = async (e) => {
    e.preventDefault();

    let searchResultDivEl=document.querySelector('.search-result');
    let formData=Object.fromEntries(new FormData(e.currentTarget));
    console.log(formData);
    let query=formData.search;

    if(formData.search==='') {
        throw new Error('All fields are required!');
    }

    try{
    let response=await fetch(`${baseUrl}/data/shows?where=title%20LIKE%20%22${query}%22`);

    if(!response.ok){
        throw new Error(response.status);
    }

    let data=await response.json();

    let searchTemplate=html`
    ${data.length === 0
  ? html`<p class="no-result">There is no TV show with this title</p>`
  : data.map(curEl => html`
      <div class="show">
          <img src=${curEl.imageUrl} alt=${curEl._id} />
          <div class="show-details">
              <h3 class="title">${curEl.title}</h3>
              <p class="genre">Genre: ${curEl.genre}</p>
              <p class="country-of-origin">Country of Origin: ${curEl.country}</p>
              <a class="details-btn" href="/dashboard/${curEl._id}">Details</a>
          </div>
      </div>
  `)}
  `;

  if(data){
    render(searchTemplate,searchResultDivEl);
  }
    }
    catch(err){
        alert(err.message);
    }
}
