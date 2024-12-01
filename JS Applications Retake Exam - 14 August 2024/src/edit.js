import { page, render, html } from '../lib/bible.js';

let baseUrl = 'http://localhost:3030';

const template = (data) => {
  return html`
     <section id="edit">
          <div class="form">
            <h2>Edit Show</h2>
            <form @submit=${(e)=>onSubmit(e,data._id)} class="edit-form">
              <input
                type="text"
                name="title"
                id="title"
                placeholder="TV Show title"
                value=${data.title}
              />
              <input
                type="text"
                name="image-url"
                id="image-url"
                placeholder="Image URL"
                value=${data.imageUrl}
              />
              <input
              type="text"
              name="genre"
              id="genre"
              placeholder="Genre"
              value=${data.genre}
            />
            <input
            type="text"
            name="country"
            id="country"
            placeholder="Country"
            value=${data.country}
          />
              <textarea
                id="details"
                name="details"
                placeholder="Details"
                rows="2"
                cols="10"
              >${data.details}</textarea>
              <button type="submit">Edit Show</button>
            </form>
          </div>
        </section>`;
}

export const editPage = async (ctx) => {
  try {
    let id = ctx.params.id;
    let response = await fetch(`${baseUrl}/data/shows/${id}`);

    if (!response.ok) {
      throw new Error(response.status);
    }

    let data = await response.json();

    render(template(data), document.querySelector('#main-element'));
  }
  catch (err) {
    alert(err.message);
  }
}

const onSubmit = async (e,id) => {
e.preventDefault();

try{
let formData=Object.fromEntries(new FormData(e.currentTarget));

let {title,'image-url':imageUrl,genre,country,details} = formData;

if(title==='' || imageUrl==='' || genre==='' || country==='' || details===''){
  throw new Error('All fields are required!');
}

let response=await fetch(`${baseUrl}/data/shows/${id}`,{
method:'PUT',
body:JSON.stringify({title,imageUrl,genre,country,details}),
headers:{
  'Content-Type':'application/json',
  'X-Authorization':localStorage.getItem('accessToken')
}
});

if(!response.ok){
  throw new Error(response.status);
}

page.redirect(`/dashboard/${id}`);
}
catch(err){
alert(err.message);
}
}