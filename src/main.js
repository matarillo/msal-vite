import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";

import { auth } from "./auth";

console.log(import.meta.env.VITE_AUTH_CLIENTID);

document.querySelector("#app").innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="logout" type="button">Logout</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`;

document
  .querySelector("#logout")
  .addEventListener("click", () => auth.logout());

await auth.init();
if (auth.idToken() == null) {
  await auth.login();
}
console.log(auth.idToken());
