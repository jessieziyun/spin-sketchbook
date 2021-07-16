var button = document.getElementById('info-button'); 

button.onclick = function() {
    var div = document.getElementById('info');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
        button.innerHTML = "i"
    }
    else {
        div.style.display = 'block';
        button.innerHTML = "&times;"
    }
};