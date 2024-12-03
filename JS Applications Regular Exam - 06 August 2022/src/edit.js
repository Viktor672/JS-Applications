import {page,render,html} from '../lib/bible.js';

let baseUrl='http://localhost:3030';

const template = (data) => {
    return html`
        <!-- Edit Page (Only for logged-in users) -->
        <section id="edit">
          <div class="form">
            <h2>Edit Offer</h2>
            <form @submit=${(e)=>onSubmit(e,data._id)} class="edit-form">
              <input
                type="text"
                name="title"
                id="job-title"
                placeholder="Title"
                value=${data.title}
              />
              <input
                type="text"
                name="imageUrl"
                id="job-logo"
                placeholder="Company logo url"
                value=${data.imageUrl}
              />
              <input
                type="text"
                name="category"
                id="job-category"
                placeholder="Category"
                value=${data.category}
              />
              <textarea
                id="job-description"
                name="description"
                placeholder="Description"
                rows="4"
                cols="50"
              >${data.description}</textarea>
              <textarea
                id="job-requirements"
                name="requirements"
                placeholder="Requirements"
                rows="4"
                cols="50"
              >${data.requirements}</textarea>
              <input
                type="text"
                name="salary"
                id="job-salary"
                placeholder="Salary"
                value=${data.salary}
              />

              <button type="submit">post</button>
            </form>
          </div>
        </section>
    `;
}

export const editPage = async(ctx) => {
let id=ctx.params.id;

try{
  let response=await fetch(`${baseUrl}/data/offers/${id}`);

  if(!response.ok){
    throw new Error(response.status);
  }

  let data=await response.json();
  render(template(data), document.querySelector('#main-element'));
}
catch(err){
  alert(err.message);
}
}


const onSubmit = async(e,id) => {
    e.preventDefault();

    let formData=Object.fromEntries(new FormData(e.currentTarget));

    console.log(formData);
  
    let {title,imageUrl,category,description,requirements,salary} = formData;

    if(title==='' || imageUrl==='' || category==='' || description==='' || requirements==='' || salary===''){
      throw new Error('All fields are required!');
    }

    try{
    let response=await fetch(`${baseUrl}/data/offers/${id}`,{
      method:'PUT',
      body:JSON.stringify({title,imageUrl,category,description,requirements,salary}),
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