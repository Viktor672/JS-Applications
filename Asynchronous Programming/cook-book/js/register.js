function register(){
    let formEl = document.querySelector('main form');
    let url = 'http://localhost:3030/users/register';

    formEl.addEventListener('submit',async (e)=>{
        e.preventDefault();
        let formData=Object.fromEntries(new FormData(e.currentTarget));
        let email=formData.email;
        let password=formData.password;

        let response=await fetch(url,{
            method:'POST',
            body:JSON.stringify({
                email:email,
                password:password
            }),
            headers:{
                'Content-Type':'application/json'
            }
        });
        let data=await response.json();
        if (data.code >= 400) {
            return alert(data.message);
        }
        localStorage.setItem('email',email);
        localStorage.setItem('token',data.accessToken);
        location.href = 'index.html';
    });

    

}


register();

// async function logout() {
//     const response = await fetch('http://localhost:3030/users/logout', {
//         method: 'get',
//         headers: {
//             'X-Authorization': sessionStorage.getItem('authToken')
//         },
//     });
//     if (response.status == 200) {
//         sessionStorage.removeItem('authToken');
//         window.location.pathname = 'index.html';
//     } else {
//         console.error(await response.json());
//     }
// }