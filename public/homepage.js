window.addEventListener('click', ()=> {
    makeAlert();
});
document.getElementById('test-btn').addEventListener('click', ()=> {
    makeAlert();
});

function makeAlert() {
    console.log("Connected");
    alert("Clicked");
}