function fisherGame() {
    let catchesDivEl = document.getElementById('catches');
    let formEl = document.querySelector("#addForm")
    let addButtonEl = document.querySelector('.add')
    let loadButtonEl = document.querySelector('.load');
    loadButtonEl.addEventListener('click', loadCatches)
    let dataUser = null;
    dataUser = JSON.parse(sessionStorage.getItem('dataUser'))
    catchesDivEl.innerHTML = '';
    if (dataUser !== null) {
        document.getElementById('user').style.display = "inline-block"
        document.getElementById('guest').style.display = "none"
        document.querySelector("p.email span").textContent = dataUser.email
        addButtonEl.disabled = false
        loadCatches()
    } else {
        addButtonEl.disabled = true
        document.getElementById('user').style.display = 'none'
        document.getElementById('guest').style.display = "inline-block"
    }
    async function loadCatches() {
        let url = `http://localhost:3030/data/catches`
        let response = await fetch(url)
        let data = await response.json()
        document.getElementById('catches').replaceChildren(...data.map(createInfo));
    }
    document.querySelector('#main').addEventListener('click', onButtons)
    function onButtons(e) {
        if (e.target.nodeName != 'BUTTON') {
            return;
        }
        let currentBtn = e.target.textContent
        let id = e.target.parentElement.getAttribute('data-id');
        let currentEl = e.target.parentElement
        if (currentBtn === "Delete") {
            onDelete(id)
        } else if (currentBtn === 'Update') {
            onUpdate(id, currentEl)
        }
    }
    async function onDelete(id) {
        let url = `http://localhost:3030/data/catches/${id}`

        try {
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': dataUser.accessToken
                },
            })
            await response.json()
            loadCatches()
        } catch (e) {
            alert(e.message)
        }
    }
    async function onUpdate(id, currentEl) {
        let [angler, weight, species, location, bait, captureTime] = currentEl.querySelectorAll('input')
        let url = `http://localhost:3030/data/catches/${id}`
        let body = JSON.stringify({
            angler: angler.value,
            weight: Number(weight.value),
            species: species.value,
            location: location.value,
            bait: bait.value,
            captureTime: Number(captureTime.value)
        })
        try {
            let response = await fetch(url, {
                method: 'PUT',
                body,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': dataUser.accessToken
                }
            })
            let data = await response.json()
            if (!response.ok) throw new Error(data.message)
            loadCatches()
        } catch (e) {
            alert(e.message)
        }
    }
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        onAdd([...formData.entries()].reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}))
        e.target.reset()
    });

    async function onAdd(body) {
        // console.log(body)

        let url = `http://localhost:3030/data/catches`

        try {
            if (Object.values(body).some(x => x === "")) return alert("All fields are required!")

            let response = await fetch(url, {

                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': dataUser.accessToken,
                }
            })
            let data = await response.json()
            console.log(data)
            if (!response.ok) throw new Error(data.message)
            loadCatches()
        } catch (e) {
            alert(e.message)

        }

    }
    function createInfo(user) {
        let div = document.createElement('div');
        div.classList.add('catch');
        div.setAttribute('data-id', user._id);

        div.innerHTML = `
    <label>Angler</label>
    <input type="text" class="angler" value="${user.angler}">
    <label>Weight</label>
    <input type="text" class="weight" value='${user.weight}'>
    <label>Species</label>
    <input type="text" class="species" value="${user.species}">
    <label>Location</label>
    <input type="text" class="location" value="${user.location}">
    <label>Bait</label>
    <input type="text" class="bait" value="${user.bait}">
    <label>Capture Time</label>
    <input type="number" class="captureTime" value="${user.captureTime}">
    <button class="update" data-id="${user._id}">Update</button>
    <button class="delete" data-id="${user._id}">Delete</button>
    `;

        let hasPermission = dataUser && dataUser.id == user._ownerId;

        if (!hasPermission) {
            Array.from(div.children)
                .filter((x) => x.nodeName == 'INPUT' || 'BUTTON')
                .map((x) => (x.disabled = true));
        }
        return div;
    }
    document.getElementById('logout').addEventListener('click', async (e) => {
        let url = `http://localhost:3030/users/logout`
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'X-Authorization': dataUser.accessToken,
            },
        })
        let data = await response.json();
        sessionStorage.clear();
        window.location = '/src/index.html'
    });
}

fisherGame();
