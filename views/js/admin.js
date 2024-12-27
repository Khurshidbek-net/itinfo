async function getAdmins() {
  let accessToken = localStorage.getItem("adminAccessToken");

  if(accessToken == "undefined"){
    window.alert("You are not logged in. Login first");
    window.location.href = "/admin_login";
  }

  const accessTokenExpTime = getTokenExpTime(accessToken);


  if(accessTokenExpTime){
    const currentTime = new Date();

    if(accessTokenExpTime > currentTime){
      console.log("Token is not expired")
    }else{
      console.log("Token expired");
      accessToken = await refreshToken();
    }
  }

  try {
    const response = await fetch("http://45.138.158.154:4000/api/admin",{
      method: "GET",
      headers:{
        Authorization: `Bearer ${accessToken}`,
        "Content-Type":"application/json"
      },
      mode: "cors"
    });

    if (!response.ok) {       
      throw new Error("Failed to fetch authors.");
    }
    const payloadBase64Url = accessToken.split(".")[1]; 

    const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payloadJson = atob(payloadBase64); 
    const payload = JSON.parse(payloadJson); 

    if(!payload.is_creator){
      window.alert("Unauthorized access. You are not allowed to view this content.");
      window.location.href = "./admin_login"
    }

    const data = await response.json();
    const cardsContainer = document.getElementById("admin-cards");

    for(const admin of data.admins) {
      const card = document.createElement("div");
      card.className = "col-md-4";

      card.innerHTML = `
        <div class="card" style="width: 18rem;">
          <img src="https://st.depositphotos.com/1537427/3571/v/450/depositphotos_35717211-stock-illustration-vector-user-icon.jpg" class="card-img-top" alt="Author Image">
          <div class="card-body">
            <h5 class="card-title">${admin.name}</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Email: ${admin.email || 'N/A'}</li>
            <li class="list-group-item">Phone: ${admin.phone || 'General'}</li>
          </ul>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Active: ${admin.is_active ? '<i class="bi bi-check-circle-fill" style="color: green"></i>' : '<i class="bi bi-x-circle-fill" style="color: crimson;"></i>'} </li>
            <li class="list-group-item">Creator: ${admin.is_creator ? '<i class="bi bi-check-circle-fill" style="color: green"></i>' : '<i class="bi bi-x-circle-fill" style="color: crimson"></i>'}</li>
          </ul>
        </div>
      `;
      cardsContainer.appendChild(card);
    };
  } catch (error) {
    console.log("Admin: ", error)
  }
}


async function loginAdmin() {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://45.138.158.154:4000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();

      localStorage.setItem("adminAccessToken", data.accessToken);
      // form.style.display = "none";
      // const welcome = document.getElementById("welcome").style.display = "block";
      console.log("Login successful and token saved!");
      window.location.href = "./admin"

    } catch (error) {
      console.error("Admin login:", error.message);
    }

  })
}


function getTokenExpTime(token){
  const decodecToken = JSON.parse(atob(token.split(".")[1]));
  if(decodecToken.exp){
    return new Date(decodecToken.exp * 1000);
  }
  return null;
}

async function refreshToken() {
  try {
    const response = await fetch("http://45.138.158.154:4000/api/admin/refresh",{
      method: "POST",
      headers: {"Content-Type":"application/json"}
    });

    const data = await response.json();

    if(data.message && data.message == "jwt expired"){
      console.log("Refresh expired");
      window.location.href = "/admin_login";
    }

    localStorage.setItem("adminAccessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log("Refresh token error: " + error);
    window.location.href = "/admin_login";  
  }
}


async function createAdmin() {
  const form = document.getElementById("register");

  form.addEventListener("submit", async(e) =>{

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const is_creator = document.getElementById("is_creator").checked;

    try {
      const response = await fetch("http://45.138.158.154:4000/api/admin/register",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({name, email, phone, password, is_creator})
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Register failed: ${errorDetails}`);
      }

      window.alert("Admin created successfully");
      window.location.href = "/";
    } catch (error) {
      console.log("Error occured while creating a new admin: " + error.message);
    }

  })
}