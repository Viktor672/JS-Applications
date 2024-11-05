function bookLibrary() {
    let tbodyEl=document.querySelector('tbody');
    tbodyEl.innerHTML='';
    let url = "http://localhost:3030/jsonstore/collections/books";
    let loadButtonEl = document.querySelector('#loadBooks');
    let formEl = document.querySelector('form');
    let titleEl = formEl.querySelector('input[name="title"]');
    let authorEl = formEl.querySelector('input[name="author"]');

    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!titleEl.value || !authorEl.value) return;
        let formData = Object.fromEntries(new FormData(e.currentTarget));
        console.log(formData);
        let title = formData.title;
        let author = formData.author;
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ title, author }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });

    function createTableRows(id, author, title) {
        let trEl = document.createElement('tr');

        let titleTdEl = document.createElement('td');
        let authorTdEl = document.createElement('td');

        titleTdEl.textContent = title;
        authorTdEl.textContent = author;

        let buttonTdEl = document.createElement('td');

        let editButtonEl = document.createElement('button');
        let removeButtonEl = document.createElement('button');

        editButtonEl.textContent = 'Edit';
        removeButtonEl.textContent = 'Remove';

        buttonTdEl.appendChild(editButtonEl);
        buttonTdEl.appendChild(removeButtonEl);

        trEl.appendChild(titleTdEl);
        trEl.appendChild(authorTdEl);
        trEl.appendChild(buttonTdEl);


        editButtonEl.addEventListener('click', async (e) => {
            titleEl.value = title;
            authorEl.value = author;

            let h3El = document.querySelector('h3');
            h3El.textContent = 'Edit FORM';

            let buttonInFormEl = document.querySelector('form button');
            buttonInFormEl.textContent = 'Save';

            buttonInFormEl.addEventListener('click', async (e) => {
                let res = await fetch(`${url}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ author: authorEl.value, title: titleEl.value }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }); 
            });
        });

        removeButtonEl.addEventListener('click', async (e) => {
            let res = await fetch(`${url}/${id}`, {
                method: 'DELETE'
            });

            trEl.remove();
        });

        return trEl;
    }

    loadButtonEl.addEventListener('click', async e => {
        e.preventDefault();
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);

        let dataTuples = Object.entries(data);

        for (const curEl of dataTuples) {
            let trEl = createTableRows(curEl[0], curEl[1].author, curEl[1].title);
            tbodyEl.appendChild(trEl);
        }
    });
}

bookLibrary();
