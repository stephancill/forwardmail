const emailElements = document.querySelectorAll(".email")

function showTooltip(el, message) {
  $(el).tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show')
  
  setTimeout(function() {
    $(el).tooltip('hide')
    $(el).tooltip('dispose')
  }, 1000)
}

emailElements.forEach(e => {
    e.onclick = function() {
        document.execCommand("copy")
    }
    e.addEventListener("copy", function(event) {
      event.preventDefault()
      if (event.clipboardData) {
        var span =  e.querySelector("span")
        event.clipboardData.setData("text/plain", span.textContent)
        console.log(event.clipboardData.getData("text"))
        showTooltip(span, "Copied")
      }
    })
})

function prepareEditModal({formURL, value}) {
  console.log("hello")
  const form = document.getElementById("edit-alias-form")
  const csrfField = document.querySelector("#edit-alias-form #csrf-token")
  const textInput = document.getElementById("edit-alias-name-input")
  form.setAttribute("action", formURL)
  csrfField.value = getCookie("csrftoken")  
  textInput.value = value
}

