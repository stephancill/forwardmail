const emailElements = document.querySelectorAll(".email")

emailElements.forEach(e => {
    e.onclick = function() {
        document.execCommand("copy");
    }
    e.addEventListener("copy", function(event) {
        console.log("hello")
          event.preventDefault();
          if (event.clipboardData) {
            event.clipboardData.setData("text/plain", e.querySelector("span").textContent);
            console.log(event.clipboardData.getData("text"))
          }
        });
})

