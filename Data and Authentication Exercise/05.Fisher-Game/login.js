function login() {
  document.querySelector('#home').classList.remove('active');
  document.querySelectorAll('#guest a')[0].classList.add('active');
  document.querySelector('form button').addEventListener('click', submitData);
  let userData = JSON.parse(sessionStorage.getItem('dataUser'));
  if (userData !== null && userData.accessToken) {
    document.getElementById('guest').style.display = 'none';
    document.getElementById('user').style.display = 'inline-block';
  } else {
    document.getElementById('guest').style.display = 'inline-block';
    document.getElementById('user').style.display = 'none';
  }
  async function submitData(e) {
    e.preventDefault();
    let formEl = document.querySelector('form');
    let formData = new FormData(formEl);
    let { email, password } = Object.fromEntries(formData.entries());
    let notificationEl = document.querySelector('.notification');
    try {
      if (email == '' || password == '') {
        throw new Error('All fields are required!');
      }
      let res = await fetch('http://localhost:3030/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok == false) {
        let error = await res.json();
        throw new Error(error.message);
      }
      let data = await res.json();
      let userData = {
        email: data.email,
        id: data._id,
        accessToken: data.accessToken,
      };
      sessionStorage.setItem('dataUser', JSON.stringify(userData));
      window.location = 'index.html';
    } catch (err) {
      notificationEl.textContent = err.message;
    }
  }
}

login();
