

const onSignup = async () => {

  const payload = {

    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value

  }

  console.log(payload)

try {
  let url = "https://setcal-backend.onrender.com/user/singup";

    let responce = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let res = await responce.json();
    console.log('res',res)
 //   document.getElementById("from").reset()
    // console.log(res)

    alert(res)
    if(res == "singup successful"){
    window.location.href="./Login.html"
    }
} catch (error) {
  console.log(error.message)
}
 
}