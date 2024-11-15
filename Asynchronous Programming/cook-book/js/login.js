function login(){
    let formEl = document.querySelector('main form');
    let url = 'http://localhost:3030/users/login';
    
formEl.addEventListener('submit',async (e)=>{
    e.preventDefault();
    let formData=Object.fromEntries(new FormData(e.currentTarget));
    let email=formData.email;
    let password=formData.password;
try{
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

    if(data.email==='undefined') return alert(data.message);
    console.log(data);
    
    localStorage.setItem('token',data.accessToken);
    localStorage.setItem('email',data.email);
    location.href = 'index.html';
}
catch(error){
    alert(error.message);
}
});
}

login();