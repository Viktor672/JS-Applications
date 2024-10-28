function loadRepos() {
   let url = 'https://api.github.com/users/testnakov/repos';
   let divEl = document.querySelector('#res');
   let httpRequest = new XMLHttpRequest();
   httpRequest.addEventListener('readystatechange', e => {
      if (httpRequest.status == 200 && httpRequest.readyState == 4) {
         divEl.textContent = httpRequest.responseText;
      }
   });
   httpRequest.open('GET', url);
   httpRequest.send();
}