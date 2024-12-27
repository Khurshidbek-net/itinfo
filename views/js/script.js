
async function getAuthors() {
  
  let accessToken = localStorage.getItem("accessToken");
  const accessTokenExpTime = getTokenExpTime(accessToken);

  console.log(accessTokenExpTime);

  if(accessTokenExpTime){
    const currentTime = new Date();

    if(accessTokenExpTime > currentTime){
      console.log("Token is not expired")
    }else{
      console.log("Token expired");
      accessToken = await refreshToken();
      console.log("New accessToken: " + accessToken);
    }
  }


  fetch("http://45.138.158.154:4000/api/author",{
    method: "GET",
    headers:{
      Authorization: `Bearer ${accessToken}`,
      "Content-Type":"application/json"
    },
    mode: "cors"
  }).then((response) =>{
    if(response.ok){
      return response.json();
    }else{
      console.log("Request failed with status: ", response.status);
    }
  }).then((author) =>{
    displayAuthors(author.authors);
  })
  .catch((error) =>{
    console.error("Error:", error)
  });
}

function displayAuthors(authors){
  const authorList = document.getElementById("author-list");
  authors.forEach(author => {
    const listItem = document.createElement("li")
    listItem.innerHTML = `
      ${author.first_name} ${author.last_name} ${author.email}
    `
    authorList.appendChild(listItem);
  });
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
    const response = await fetch("http://45.138.158.154:4000/api/author/refresh", {
      method: "POST",
      headers: {"Content-Type":"application/json"}
    });

    const data = await response.json();
    console.log(data)
    if(data.message && data.message == "jwt expired"){
      console.log("Refresh expired");
      window.location.href = "/login";
    }

    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;

  } catch (error) {
    console.log("Refresh token error: " + error);
    window.location.href = "/login";  
  }
}


async function checkLoggedIn() {
  const token = localStorage.getItem("accessToken");
  const btn = document.getElementById("btn");
  
  if (token == "undefined") {
    btn.classList.add("disabled");
  }
}