function register() {
  let formEl = document.querySelector('form');
  let userData = JSON.parse(sessionStorage.getItem('dataUser'));

  for (const curEl of document.querySelectorAll('a')) {
    curEl.classList.remove('active');
    document.querySelector('#register').classList.add('active');
  }

  if (userData !== null && userData.accessToken) {
    document.getElementById('guest').style.display = 'none';
    document.getElementById('user').style.display = 'inline-block';
  }
  else {
    document.getElementById('guest').style.display = 'inline-block';
    document.getElementById('user').style.display = 'none';
  }


  formEl.addEventListener('submit', onCheck)


  function onCheck(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    onRegister([...formData.entries()].reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {}));
  }
  async function onRegister(info) {


    let url = 'http://localhost:3030/users/register'
    let body = {
      email: info.email,
      password: info.password,
    }
    try {
      if (info.email == '' || info.password == '' || info.rePass == '') {
        throw new Error('All fields are required!');
      }

      if (info.password !== info.rePass) {
        throw new Error('Passwords don\'t match');

      }

      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }

      })

      let data = await response.json()

      if (response.ok == false) {
        let error = await response.json();
        throw new Error(error.message);
      }

      sessionStorage.setItem("dataUser", JSON.stringify({
        email: data.email,
        accessToken: data.accessToken,
        id: data._id

      }))
      window.location = 'index.html'

    } catch (e) {
      document.querySelector('p.notification').textContent = e.message
      formEl.reset()
    }
  }
}

register();
