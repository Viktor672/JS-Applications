const baseUrl = 'http://localhost:3030/data/recipes';

const recipes = {
    getAll(filter) {
        const searchParams = new URLSearchParams();

        if (filter.search) {
            searchParams.set('where', `name LIKE "${filter.search}"`);
        }

        return fetch(`${baseUrl}?${searchParams.toString()}`)
            .then(res => res.json())
            .then(data => Object.values(data));
    },
    getRecent() {
        const query = new URLSearchParams({
            sortBy: '_createdOn desc',
            pageSize: 3,
        });

        return fetch(`${baseUrl}?${query.toString()}`)
            .then(res => res.json())
            .then(data => Object.values(data));
    },
    getOne(id) {
        return fetch(`${baseUrl}/${id}`)
            .then(res => res.json());
    },
    update(id, data) {
        const accessToken = localStorage.getItem('accessToken');

        return fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': accessToken,
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
    },
    create(data) {
        const accessToken = localStorage.getItem('accessToken');

        return fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': accessToken,
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
    },
    delete(id) {
        const accessToken = localStorage.getItem('accessToken');
        
        return fetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Authorization': accessToken,
            }
        });
    }
}

export default recipes;
