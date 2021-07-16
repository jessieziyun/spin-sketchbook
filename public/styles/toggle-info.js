const button = document.getElementById('info-button'); 

button.onclick = function() {
    const div = document.getElementById('info');
    const solid = document.getElementById('solid');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
        solid.style.display = 'none';
        button.innerHTML = "i"
    }
    else {
        div.style.display = 'block';
        solid.style.display = 'block';
        button.innerHTML = "&times;"
    }
};