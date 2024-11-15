function create() {
    let formEl = document.querySelector('main form');
    let url = 'http://localhost:3030/data/recipes';

    formEl.addEventListener('submit', async (e) => {
        e.preventDefault();

        let formData = Object.fromEntries(new FormData(e.currentTarget));
        formData.ingredients = formData.ingredients.split('\n');
        formData.steps = formData.steps.split('\n');
        let token = localStorage.getItem('token');

        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        });
        let data = response.json();
        location.href = 'index.html';

    });



}


create();