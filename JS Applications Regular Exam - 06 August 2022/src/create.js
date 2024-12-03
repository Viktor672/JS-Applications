import {page,render,html} from '../lib/bible.js';

let baseUrl='http://localhost:3030';

const template = () => {
  return html`
  <!-- Create Page (Only for logged-in users) -->
  <section id="create">
          <div class="form">
            <h2>Create Offer</h2>
            <form @submit=${onSubmit} class="create-form">
              <input
                type="text"
                name="title"
                id="job-title"
                placeholder="Title"
              />
              <input
                type="text"
                name="imageUrl"
                id="job-logo"
                placeholder="Company logo url"
              />
              <input
                type="text"
                name="category"
                id="job-category"
                placeholder="Category"
              />
              <textarea
                id="job-description"
                name="description"
                placeholder="Description"
                rows="4"
                cols="50"
              ></textarea>
              <textarea
                id="job-requirements"
                name="requirements"
                placeholder="Requirements"
                rows="4"
                cols="50"
              ></textarea>
              <input
                type="text"
                name="salary"
                id="job-salary"
                placeholder="Salary"
              />

              <button type="submit">post</button>
            </form>
          </div>
        </section>
  `;
}

export const createPage = async() => {
render(template(), document.querySelector('#main-element'));
}

const onSubmit = async(e) => {
    e.preventDefault();

    let formData=Object.fromEntries(new FormData(e.currentTarget));
console.log(formData);

    let {title,imageUrl,category,description,requirements,salary} = formData;

    if(title==='' || imageUrl==='' || category==='' || description==='' || requirements==='' || salary===''){
      throw new Error('All fields are required!');
    }
    
    try{
    let response=await fetch(`${baseUrl}/data/offers`,{
      method:'POST',
      body:JSON.stringify({title,imageUrl,category,description,requirements,salary}),
      headers:{
        'Content-Type':'application/json',
        'X-Authorization':localStorage.getItem('accessToken')
      }
    });

    if(!response.ok){
      throw new Error(response.status);
    }

    page.redirect('/dashboard');
    }
    catch(err){
      alert(err.message);
    }
}