document.getElementById("app").innerHTML = `
<h1>Hello Counter!</h1>
<div>
 <p>Counter: <span>0<span></p>
 <button id="mainButton">Increment!</button>
</div>
`;
let counter = document.querySelector("span");
let counterState = Number(counter.innerText);
const increaseButton = document.getElementById("mainButton");

increaseButton.addEventListener("click", () => {
  counter.innerText = counterState += 1;
});
