function loadRepos() {
	let username = document.querySelector('#username').value;
	let url = `https://api.github.com/users/${username}/repos`;
	let ulEl = document.querySelector('#repos');

	fetch(url)
		.then(response => response.json())
		.then(repos => {
			ulEl.innerHTML = '';
			for (const curRepo of repos) {
				let aEl = document.createElement('a');
				aEl.href = curRepo.html_url;
				aEl.textContent = curRepo.full_name;
				let liEl = document.createElement('li');
				liEl.appendChild(aEl);
				ulEl.appendChild(liEl);
			}
		})
		.catch(error => {
			ulEl.innerHTML = '<p>An error occured</p>';
		});
}