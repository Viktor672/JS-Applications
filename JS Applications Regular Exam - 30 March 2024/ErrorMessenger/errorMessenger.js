let errorBoxDivEl = document.querySelector('#errorBox');
let msgSpanEl = document.querySelector('.msg');

export const displayMessageError = async (msg) => {
    msgSpanEl.textContent = msg;
    errorBoxDivEl.style.display = 'block';

    setTimeout(() => {
        msgSpanEl.textContent = '';
        errorBoxDivEl.style.display = '';
    }, 4000);
}