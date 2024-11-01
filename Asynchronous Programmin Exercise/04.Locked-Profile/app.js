async function lockedProfile() {
    function createUserCard(name, email, age, index) {
        let divProfileEl = document.createElement('div');
        divProfileEl.classList.add('profile');

        let imgEl = document.createElement('img');
        imgEl.src = './iconProfile2.png';
        imgEl.classList.add('userIcon');

        let lockedlabelEl = document.createElement('label');
        lockedlabelEl.textContent = 'Lock';

        let lockedRadioInputEl = document.createElement('input');
        lockedRadioInputEl.type = 'radio';
        lockedRadioInputEl.name = `user${index}locked`;
        lockedRadioInputEl.value = 'lock';
        lockedRadioInputEl.setAttribute('checked', true);

        let unlockedLabelEl = document.createElement('label');
        unlockedLabelEl.textContent = 'Unlocked';

        let unlockedRadioInputEl = document.createElement('input');
        unlockedRadioInputEl.type = 'radio';
        unlockedRadioInputEl.name = `user${index}locked`;
        unlockedRadioInputEl.value = 'unlock';

        let brEl = document.createElement('br');
        let hrEl = document.createElement('hr');

        let usernameLabelEl = document.createElement('label');
        usernameLabelEl.textContent = 'Username';

        let usernameInputEl = document.createElement('input');
        usernameInputEl.type = 'text';
        usernameInputEl.name = `user${index}Username`;
        usernameInputEl.value = name;
        usernameInputEl.disabled = true;
        usernameInputEl.setAttribute('readonly', true);

        let usernameDivEl = document.createElement('div');
        usernameDivEl.classList.add(`user${index}Username`);
        usernameDivEl.style.display = 'none';

        let emailLabel = document.createElement('label');
        emailLabel.textContent = 'Email:';

        let emailInputEl = document.createElement('input');
        emailInputEl.type = 'email';
        emailInputEl.name = `user${index}Email`;
        emailInputEl.value = email;
        emailInputEl.disabled = true;
        emailInputEl.setAttribute('readonly', true);

        let ageLabelEl = document.createElement('label');
        ageLabelEl.textContent = 'Age:';

        let ageInputEl = document.createElement('input');
        ageInputEl.type = 'number';
        ageInputEl.name = `user${index}Age`;
        ageInputEl.value = age;
        ageInputEl.disabled = true;
        ageInputEl.setAttribute('readonly', true);

        usernameDivEl.appendChild(hrEl);
        usernameDivEl.appendChild(emailLabel);
        usernameDivEl.appendChild(emailInputEl);
        usernameDivEl.appendChild(ageLabelEl);
        usernameDivEl.appendChild(ageInputEl);

        let showMoreButtonEl = document.createElement('button');
        showMoreButtonEl.textContent = 'Show more';

        divProfileEl.appendChild(imgEl);
        divProfileEl.appendChild(lockedlabelEl);
        divProfileEl.appendChild(lockedRadioInputEl);
        divProfileEl.appendChild(unlockedLabelEl);
        divProfileEl.appendChild(unlockedRadioInputEl);
        divProfileEl.appendChild(brEl);
        divProfileEl.appendChild(hrEl);
        divProfileEl.appendChild(usernameLabelEl);
        divProfileEl.appendChild(usernameInputEl);
        divProfileEl.appendChild(usernameDivEl);
        divProfileEl.appendChild(showMoreButtonEl);

        showMoreButtonEl.addEventListener('click', e => {
            if (unlockedRadioInputEl.checked === true) {
                if (usernameDivEl.style.display === 'none') {
                    usernameDivEl.style.display = 'block';
                }
                else if (usernameDivEl.style.display === 'block') {
                    usernameDivEl.style.display = 'none';
                }
            }
        });

        return divProfileEl;
    }

    let mainEl = document.querySelector('#main');
    mainEl.textContent = '';
    let response = await fetch('http://localhost:3030/jsonstore/advanced/profiles');
    let data = await response.json();
    let count = 0;

    for (const key in data) {
        count++;
        let userCard = createUserCard(data[key].username, data[key].email, data[key].age, count);
        mainEl.appendChild(userCard);
    }
}