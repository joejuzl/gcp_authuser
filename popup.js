let button = document.getElementById('myButton');
let input = document.getElementById('myInput');
let output = document.getElementById('mySpan');
chrome.storage.sync.get('authuser', function (data) {
    output.innerText = data.authuser
});
button.onclick = () => {
    value = input.value;
    chrome.storage.sync.set({authuser: value}, function () {
        output.innerText = value;
    });
};

