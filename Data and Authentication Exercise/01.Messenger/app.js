function attachEvents() {
    let textareaEl = document.querySelector('#messages');
    let nameEl = document.querySelector('input[name="author"]');
    let contentEl = document.querySelector('input[name="content"]');
    let submitButtonEl = document.querySelector('#submit');
    let refreshButtonEl = document.querySelector('#refresh');

    textareaEl.textContent = '';

    submitButtonEl.addEventListener('click', e => {
        fetch('http://localhost:3030/jsonstore/messenger', {
            method: 'POST',
            body: JSON.stringify({
                author: nameEl.value,
                content: contentEl.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => data);
    });

    refreshButtonEl.addEventListener('click', e => {
        fetch('http://localhost:3030/jsonstore/messenger')
            .then(response => response.json())
            .then(data => {
                let arr = [];
                for (const curEl of Object.values(data)) {
                    arr.push(`${curEl.author}: ${curEl.content}`);
                }
                textareaEl.textContent = arr.join('\n');
            });
    });
}

attachEvents();