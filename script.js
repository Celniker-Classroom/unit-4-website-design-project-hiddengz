// JavaScript for index.html
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.hidden').forEach(function(el) {
    el.style.display = 'none';
  });
});

// settings tab
if (document.getElementById('settingsModal')) {
  var modal = document.getElementById("settingsModal");
  var btn = document.getElementById("settingsBtn");
  var span = document.getElementsByClassName("close")[0];

  btn.onclick = function() {
    modal.style.display = "block";
  }

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

// dark mode stuffs
if (document.getElementById('toggleMode')) {
  var toggleBtn = document.getElementById("toggleMode");
  toggleBtn.onclick = function() {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
      toggleBtn.textContent = "Enable Dark Mode";
    } else {
      toggleBtn.textContent = "Enable Light Mode";
    }
  }
}

// cool code button
if (document.getElementById('unlock-btn-modal')) {
  document.getElementById('unlock-btn-modal').addEventListener('click', function() {
    var code = prompt("Enter the code:");
    if (code === "1347") {
      document.querySelectorAll('.hidden').forEach(function(el) {
        el.classList.remove('hidden');
        el.style.display = '';
      });
      this.style.display = 'none';
    } else if (code === "1234") {
      alert("wow 1234 how original. ill give you a hint, its not 1234");
    } else if (code === "1111") {
      alert("wow 1111 how original. ill give you a hint, its not 1111");
    } else if (code === "TDX") {
      alert("TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX. its not TDX");
    } else if (code === "tdx") {
      alert("TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX TDX. its not TDX");
    } else if (code === "hi") {
      alert("hi");
    } else {
      alert("Wrong code! Try again.");
    }
  });
}

// Flappy Bird button
if (document.getElementById('clickMeBtn')) {
  document.getElementById('clickMeBtn').addEventListener('click', function() {
    alert('the first number in the code is 1');
  });
}
