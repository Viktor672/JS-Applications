import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = () => {
  return html`
   <section id="search">
          <div class="form">
            <h4>Search</h4>
            <form @submit=${onSubmit} class="search-form">
              <input type="text" name="search" id="search-input" />
              <button class="button-list">Search</button>
            </form>
          </div>
          <div class="search-result"><h2 class="no-avaliable">No result.</h2></div>
        </section>
   `;
}


export const searchPage = () => {
  render(template(), document.querySelector('#main-element'));
}


const onSubmit = async (e) => {
  e.preventDefault();

  let searchResultDivEl = document.querySelector('.search-result');
  let formData = Object.fromEntries(new FormData(e.currentTarget));
  console.log(formData);
  let query = formData.search;

  if (query === '') {
    alert('All fields are required!');
    return;
  }

  try {
    let response = await fetch(`${baseUrl}/data/cars?where=model%20LIKE%20%22${query}%22`);

    if (!response.ok) {
      alert(response.status);
      return;
    }

    let data = await response.json();

    let searchTemplate = html`
    ${data.length !== 0
        ?
        html`${data.map((curEl) => html`
        <div class="car">
          <img src=${curEl.imageUrl} alt=${curEl._id}/>
              <h3 class="model">${curEl.model}</h3>
              <a class="details-btn" href="/dashboard/${curEl._id}">More Info</a>
              </div>`)}`
        :
        html`<h2 class="no-avaliable">No result.</h2>`
      }
  `;
    if (data) {
      render(searchTemplate, searchResultDivEl);
    }
  }
  catch (err) {
    alert(err.message);
  }
}
