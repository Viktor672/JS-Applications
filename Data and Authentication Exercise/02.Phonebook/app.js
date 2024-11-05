function attachEvents() {
    let ulEl = document.querySelector('#phonebook');
    ulEl.innerHTML = '';
    let loadButtonEl = document.querySelector('#btnLoad');

    let nameEl = document.querySelector('#person');
    let phoneNumberEl = document.querySelector('#phone');
    let createButtonEl = document.querySelector('#btnCreate');

    loadButtonEl.addEventListener('click', async (e) => {
        let response = await fetch('http://localhost:3030/jsonstore/phonebook');
        let data = await response.json();
        for (const curEl of Object.values(data)) {
            let liEl = document.createElement('li');
            liEl.textContent = `${curEl.person}: ${curEl.phone}`;
            let id = curEl._id;
            let deleteButtonEl = document.createElement('button');
            deleteButtonEl.textContent = 'Delete';
            liEl.appendChild(deleteButtonEl);
            ulEl.appendChild(liEl);

            deleteButtonEl.addEventListener('click', async (e) => {
                let res = await fetch(`http://localhost:3030/jsonstore/phonebook/${id}`, {
                    method: 'DELETE'
                });
                let info = await res.json();
                liEl.remove();
            });
        }
    });

    createButtonEl.addEventListener('click', async () => {
        let response = await fetch('http://localhost:3030/jsonstore/phonebook', {
            method: 'POST',
            body: JSON.stringify({
                person: nameEl.value,
                phone: phoneNumberEl.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = response.json();
        nameEl.value = '';
        phoneNumberEl.value = '';
    });
}

attachEvents();