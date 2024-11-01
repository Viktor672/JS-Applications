function attachEvents() {
    let loadButtonEl = document.querySelector('#btnLoadPosts');
    let postsSelectEl = document.querySelector('#posts');
    let viewButtonEl = document.querySelector('#btnViewPost');
    let postH1El = document.querySelector('#post-title');
    let postPEl = document.querySelector('#post-body');
    let ulEl = document.querySelector('#post-comments');
    let obj = {};

    postH1El.innerHTML = '';
    postPEl.innerHTML = '';
    ulEl.innerHTML = '';    
    
    loadButtonEl.addEventListener('click', async (e) => {
        let response = await fetch('http://localhost:3030/jsonstore/blog/posts');
        let data = await response.json();
        let dataValues = Object.values(data);
    
        for (const curObj of dataValues) {
            let optionEl = document.createElement('option');
            optionEl.value = curObj.id;
            optionEl.textContent = curObj.title;
            obj[curObj.title] = { body: curObj.body, id: curObj.id };
            postsSelectEl.appendChild(optionEl);
        }
    });

    viewButtonEl.addEventListener('click', async (e) => {
        let response = await fetch('http://localhost:3030/jsonstore/blog/comments');
        let data = await response.json();
        let dataValues = Object.values(data);

        let selectedPostTitle = postsSelectEl.selectedOptions[0].textContent;
        let body = obj[selectedPostTitle].body;
        let id = obj[selectedPostTitle].id;

        let filteredDataValues = dataValues.filter(curObj => curObj.postId === id);

        postH1El.textContent = selectedPostTitle;
        postPEl.textContent = body;

        for (const curObj of filteredDataValues) {
            let liEl = document.createElement('li');
            liEl.textContent = curObj.text;
            ulEl.appendChild(liEl);
        }
    });
}

attachEvents();
