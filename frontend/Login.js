

const onLogin = async () => {

    const payload = {
  
    //  name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
  
    }
  
    console.log(payload)
  
  try {
    let url = "https://happy-hare-capris.cyclic.app/user/login";
  
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
      // alert(res)

      Swal.fire(
        res
      )

      if(res.msg=="login succes"){
        console.log(res.token)
        // alert("login success")
        
        Swal.fire(
          'login success'
        )
        
          window.location.href="./meetform.html"
        
          
      }
    //  
  
  } catch (error) {
    console.log(error.message)
  }
   
  }