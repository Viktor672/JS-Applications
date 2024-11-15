function cookBook() {
    let url = 'http://localhost:3030/data/recipes';
    let mainEl = document.querySelector('body main');

    let logoutAEl = document.querySelector('#logoutBtn');
    window.addEventListener('load',e=>{
        logoutAEl.addEventListener('click', async (e) => {
            let response = await fetch('http://localhost:3030/users/logout', {
                method: 'GET',
                headers: {
                    'X-Authorization': localStorage.getItem('token')
                }
            });
            localStorage.removeItem('email');
                localStorage.removeItem('token');
                location.reload();  
        });
    });


    let userEl = document.querySelector('#user');
    let guestEl = document.querySelector('#guest');

    let email = localStorage.getItem('email');

    if (email && email !==  'undefined') {
        userEl.style.display = 'block';
        guestEl.style.display = 'none';
    }
    else {
        userEl.style.display = 'none';
        guestEl.style.display = 'block';
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            mainEl.innerHTML = '';
            for (const curEl of data) {
                mainEl.appendChild(createArticle(curEl));
            }
        })
        .catch(error => console.log(error));

    function createArticle(data) {
        let h2El = document.createElement('h2');
        h2El.textContent = data.name;
        let titleDivEl = document.createElement('div');
        titleDivEl.classList.add('title');

        titleDivEl.appendChild(h2El);

        let imgEl = document.createElement('img');
        imgEl.src = data.img;
        let smallDivEl = document.createElement('div');
        smallDivEl.classList.add('small');

        smallDivEl.appendChild(imgEl);

        let previewArticleEl = document.createElement('article');
        previewArticleEl.classList.add('preview');

        previewArticleEl.appendChild(titleDivEl);
        previewArticleEl.appendChild(smallDivEl);

        previewArticleEl.addEventListener('click', async (e) => {
            let res = await fetch(`${url}/${data._id}`);
            let info = await res.json();
            mainEl.innerHTML = '';
            console.log(info);

            mainEl.appendChild(createArticleIngredients(info));

            let returnButtonEl=document.createElement('button');
            returnButtonEl.classList.add('returnBtn');
            returnButtonEl.textContent='Return';
            mainEl.appendChild(returnButtonEl);

            returnButtonEl.addEventListener('click',e=>{
                location.reload();
            });
        });

        return previewArticleEl;
    }

    function createArticleIngredients(info) {
        let mainArticleEl = document.createElement('div');
        let h2El = document.createElement('h2');
        h2El.textContent = info.name;
        let bandDivEl = document.createElement('div');
        bandDivEl.classList.add('band');
        let thumbDivEl = document.createElement('div');
        thumbDivEl.classList.add('thumb');
        let imgEl = document.createElement('img');
        imgEl.src = info.img;

        thumbDivEl.appendChild(imgEl);

        let ingredientEls = document.createElement('div');
        ingredientEls.classList.add('ingredients');
        let h3El = document.createElement('h3');
        h3El.textContent = 'Ingredients:'
        let ulEl = document.createElement('ul');

        for (const curIngredient of info.ingredients) {
            let liEl = document.createElement('li');
            liEl.textContent = curIngredient;

            ulEl.appendChild(liEl);
        }

        ingredientEls.appendChild(h3El);
        ingredientEls.appendChild(ulEl);

        bandDivEl.appendChild(thumbDivEl);
        bandDivEl.appendChild(ingredientEls);

        let descriptionDivEl = document.createElement('div');
        descriptionDivEl.classList.add('description');
        let preparationh3El = document.createElement('h3');
        preparationh3El.textContent = 'Preparation:';
        let pEl = document.createElement('p');
        pEl.textContent = 'Wait more!!!';

        descriptionDivEl.appendChild(preparationh3El);

        for (const curStep of info.steps) {
            let pEl = document.createElement('p');
            pEl.textContent = curStep;

            descriptionDivEl.appendChild(pEl);
        }

        mainArticleEl.appendChild(h2El);
        mainArticleEl.appendChild(bandDivEl);
        mainArticleEl.appendChild(descriptionDivEl);

        return mainArticleEl;
    }


}






cookBook();

