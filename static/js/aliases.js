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
        showTooltip(span, "Copied")
      }
    })
})

function prepareEditModal({formURL, value}) {
  const form = document.getElementById("edit-alias-form")
  const csrfField = document.querySelector("#edit-alias-form #csrf-token")
  const textInput = document.getElementById("edit-alias-name-input")
  form.setAttribute("action", formURL)
  csrfField.value = getCookie("csrftoken")  
  textInput.value = value
}

function onSearchInputChange() {
  // Declare variables
  var input, filter, table, tr, tds, td, i, j, txtValue;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("alias-table");
  tr = table.querySelectorAll("tbody tr");

  // Loop through all table rows, and hide those who don't match the search query
  Array.from(tr).forEach(row => {
    if (Array.from(row.querySelectorAll(".value")).some(e => {
      let value = e.textContent || e.innerText
      return value.toUpperCase().indexOf(filter) > -1
    })) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  })
}

function toggleSearch() {
  $("#search-button").toggle()
  $("#search").toggle()
  $("#search-input").focus()
  $("#search-reset").toggle()
}
