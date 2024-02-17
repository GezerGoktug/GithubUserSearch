//! DOM ACCESS
const search = document.getElementById("search-input");
const button = document.getElementById("search-button");
const main = document.getElementsByClassName("user-container")[0];
const apiUrl = "https://api.github.com/users/";
//! DOM ACCESS
//! Burada kullanıcının bilgileri alındıktan sonra aynı kullanıcının reposu için bir istek daha yollanır.
//! Eğer repo bulunursa bu repolardan 3 tanesi(3 tane ya da daha fazla ise) carda eklenir.
//! Eğer yoksa hata verir.
//? Kullanılan Api: Github Api
const getRepos = async (user) => {
  const repos =
    document.getElementsByClassName("user-repos")[0].firstElementChild;
  try {
    const response = await fetch(apiUrl + user + "/repos");
    const data = await response.json();
    let result = "";
    data.slice(0, 3).forEach((repo) => {
      const { name, html_url } = repo;
      result += `
            <li><i class="fa-solid fa-book"></i><a target="_blank" href="${html_url}">${name}</a></li>
            `;
    });
    repos.innerHTML = result;
  } catch (error) {
    repos.innerHTML = `
        <h1>Repo not defined</h1>
        `;
    console.log("error", error);
  }
};
//! Inputtan alınan valueya göre apiye istek gönderir.
//! Eğer kullanıcı yoksa kullanıcı bulunamadı yazısı görünür.
//! Eğer kullanıcıyı bulursa kullanıcın bilgilerini gösteren bir card gelir.
//! Hemen sonrasında kullanıcının reposu  için aynı apiye bir istek daha yollanır.
//? Kullanılan Api : Github Api
const getUser = async (user) => {
  try {
    const response = await fetch(apiUrl + user);
    const data = await response.json();
    const { avatar_url, name, login, bio, followers, following, public_repos } =
      data;
    if (login == undefined) {
      main.innerHTML = "<h1>User not defined</h1>";
      return;
    }
    const userName = name || login;
    const userBio = bio ? `<p class="user-bio">${bio}</p>` : "";
    main.innerHTML = `
    <div class="card">
        <div class="avatar">
            <img src="${avatar_url}" alt="${name}">
        </div>
        <div class="user-info">
            <h2 class="user-name">${userName}</h2>
            <p class="user-login">@${login}</p>
            ${userBio}
            <div class="user-info-card-container">
                <div class="user-info-card">
                    <div class="user-info-card-icon">
                        <i class="fa-solid fa-users"></i>
                        <span>${followers}</span>
                    </div>
                    <div class="user-info-card-title">Followers</div>
                </div>
                <div class="user-info-card">
                    <div class="user-info-card-icon">
                        <i class="fa-solid fa-user"></i>
                        <span>${following}</span>
                    </div>
                    <div class="user-info-card-title">Following</div>
                </div>
                <div class="user-info-card">
                    <div class="user-info-card-icon">
                        <i class="fa-solid fa-bookmark"></i>
                        <span>${public_repos}</span>
                    </div>
                    <div class="user-info-card-title">Repository</div>
                </div>
            </div>
            <div class="user-repos">
                <ul></ul>
            </div>
        </div>
        </div>
    </div>
    `;
    getRepos(user);
  } 
  catch (error) {
    main.innerHTML = `<h1>${error}</h1>`;
    console.log("error", error);
  }
};
//! Enter tuşuna basıldığında girilen kullanıcıyı arar.
const querry = (e) => {
  if (e.keyCode == "13") {
    getUser(search.value);
  }
};
search.addEventListener("keypress", querry);
//! Arama butonuna tıklanıldığında girilen kullanıcıyı arar.
button.addEventListener("click", () => {
  getUser(search.value);
});
