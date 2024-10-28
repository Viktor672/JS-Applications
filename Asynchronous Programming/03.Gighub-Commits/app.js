function loadCommits() {
    let username = document.querySelector('#username').value;
    let repo = document.querySelector('#repo').value;
    let url = `https://api.github.com/repos/${username}/${repo}/commits`;
    let ulEl = document.querySelector('#commits');
    ulEl.innerHTML = '';

    if (username === '' || repo === '') return;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            for (const curRepo of data) {
                let liEl = document.createElement('li');
                liEl.textContent = `${curRepo.commit.author.name}: ${curRepo.commit.message}`;
                ulEl.appendChild(liEl);
            }
        })
        .catch(error => {
            let liEl = document.createElement('li');
            liEl.textContent = `Error: ${error.message} (Not Found)`;
            ulEl.appendChild(liEl);
        });
}
