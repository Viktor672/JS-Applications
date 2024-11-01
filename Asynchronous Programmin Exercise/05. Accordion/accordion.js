function solution() {
    function createAccordion(element) {
        let mainDivEl = document.createElement('div');
        mainDivEl.classList.add('accordion');

        fetch(`http://localhost:3030/jsonstore/advanced/articles/details/${element._id}`)
            .then(res => res.json())
            .then(info => {
                let headDivEl = document.createElement('div');
                headDivEl.classList.add('head');

                let spanEl = document.createElement('span');
                spanEl.textContent = element.title;

                let buttonEl = document.createElement('button');
                buttonEl.classList.add('button');
                buttonEl.setAttribute('id', element._id);
                buttonEl.textContent = 'More';

                let extraDivEl = document.createElement('div');
                extraDivEl.classList.add('extra');
                extraDivEl.style.display='none';

                let pEl = document.createElement('p');
                pEl.textContent = info.content;

                buttonEl.addEventListener('click', e => {
                    if (extraDivEl.style.display === 'none') {
                        extraDivEl.style.display = 'block';
                        buttonEl.textContent = 'Less';
                    }
                    else {
                        extraDivEl.style.display = 'none';
                        buttonEl.textContent = 'More';
                    }
                });

                headDivEl.appendChild(spanEl);
                headDivEl.appendChild(buttonEl);

                extraDivEl.appendChild(pEl);

                mainDivEl.appendChild(headDivEl);
                mainDivEl.appendChild(extraDivEl);

            });

        return mainDivEl;
    }

    let mainSectionEl = document.querySelector('#main');
    mainSectionEl.textContent = '';
    fetch('http://localhost:3030/jsonstore/advanced/articles/list')
        .then(response => response.json())
        .then(data => {
            for (const curEl of data) {
                let curAccordion = createAccordion(curEl);
                mainSectionEl.appendChild(curAccordion);
            }
        });
}

solution();