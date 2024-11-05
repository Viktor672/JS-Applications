function students() {
    let tbody = document.querySelector('tbody');
    let formEl = document.querySelector('#form');

    document.addEventListener('DOMContentLoaded', e => {
        e.preventDefault();
        fetch('http://localhost:3030/jsonstore/collections/students')
            .then(response => response.json())
            .then(data => {
                let dataValues = Object.values(data);
                for (const curEl of dataValues) {
                    let firstName = curEl.firstName;
                    let lastName = curEl.lastName;
                    let facultyNumber = curEl.facultyNumber;
                    let grade = curEl.grade;

                    let trEl = document.createElement('tr');

                    let firstNameTrEl = document.createElement('td');
                    let lastNameTrEl = document.createElement('td');
                    let facultyNumberTrEl = document.createElement('td');
                    let gradeTrEl = document.createElement('td');

                    firstNameTrEl.textContent = firstName;
                    lastNameTrEl.textContent = lastName;
                    facultyNumberTrEl.textContent = facultyNumber;
                    gradeTrEl.textContent = grade;

                    trEl.appendChild(firstNameTrEl);
                    trEl.appendChild(lastNameTrEl);
                    trEl.appendChild(facultyNumberTrEl);
                    trEl.appendChild(gradeTrEl);

                    tbody.appendChild(trEl);

                }
            });
    });

    formEl.addEventListener('submit', e => {
        e.preventDefault();
        let formData = Object.fromEntries(new FormData(e.currentTarget));
        let firstName = formData.firstName;
        let lastName = formData.lastName;
        let facultyNumber = formData.facultyNumber;
        let grade = formData.grade;

        if (firstName === '' || lastName === '' || facultyNumber === '' || grade === '') return;

        fetch('http://localhost:3030/jsonstore/collections/students', {
            method: 'POST',
            body: JSON.stringify({ firstName, lastName, facultyNumber, grade }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => data);
    });
}
students();