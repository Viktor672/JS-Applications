function calendar() {
    function convertMonthToNumber(month) {
        let monthObj = {
            Jan: 1,
            Feb: 2,
            Mar: 3,
            Apr: 4,
            May: 5,
            Jun: 6,
            Jul: 7,
            Aug: 8,
            Sept: 9,
            Oct: 10,
            Nov: 11,
            Dec: 12
        }

        return monthObj[month]
    }


    let yearSectionEls = document.querySelector('#years');
    let monthEls = document.querySelectorAll('.monthCalendar');
    let dayElS = document.querySelectorAll('.daysCalendar');
    let yearEls = document.querySelectorAll('.yearsCalendar td.day');
    for (const curEl of monthEls) {
        curEl.style.display = 'none';
    }

    for (const curEl of dayElS) {
        curEl.style.display = 'none';
    }

    for (const curEl of yearEls) {
        curEl.addEventListener('click', e => {
            let curYearEl = curEl.querySelector('.date');
            let curYearSectionEl = document.querySelector(`#year-${curYearEl.textContent}`);
            curYearSectionEl.style.display = 'block';
            yearSectionEls.style.display = 'none';

            let captionEl = curYearSectionEl.querySelector('.calendar caption');
            captionEl.addEventListener('click', e => {
                curYearSectionEl.style.display = 'none';
                yearSectionEls.style.display = 'block';
            });
            console.log(curYearSectionEl);

            let tdDivEl = curYearSectionEl.querySelectorAll('td.day');

            for (const curMonthEl of tdDivEl) {
                curMonthEl.addEventListener('click', e => {

                    let month = curMonthEl.querySelector('.date').textContent;
                    let monthNumber = convertMonthToNumber(month);
                    let monthSectionEl = document.querySelector(`#month-${curYearEl.textContent}-${monthNumber}`);

                    monthSectionEl.style.display = 'block';
                    curYearSectionEl.style.display = 'none';

                    let captionEl = monthSectionEl.querySelector('.calendar caption');

                    captionEl.addEventListener('click', e => {
                        monthSectionEl.style.display = 'none';
                        curYearSectionEl.style.display = 'block';
                    });
                });
            }
        });
    }
}


calendar();