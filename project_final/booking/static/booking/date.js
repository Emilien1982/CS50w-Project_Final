
const date_end_input = document.getElementById("date_end");


//// Manage the display of the second date input regarding the period radios
const period_radios = document.getElementsByClassName("period_radio");
const date_label = document.getElementById("date_label");

for (const radio of period_radios) {
    radio.addEventListener('input', event => {
        if (event.target.value === 'no') {
            document.getElementById('date_end_row').style.opacity = '0';
            date_end_input.setAttribute("disabled", "");
            date_label.innerHTML = 'Date';
        } else if (event.target.value === 'yes') {
            document.getElementById('date_end_row').style.opacity = '1';
            date_end_input.removeAttribute("disabled", "");
            date_label.innerHTML = 'From';
        }
    })
}

//// Manage the second date input minimum regarding the first date value.
const date_start_input = document.getElementById("date")
date_start_input.addEventListener('input', event => {
    const start = event.target.value;
    // set the min of end date
    date_end_input.min = start;
    // set the value of end date if it 's before the start.
    if (Date.parse(start) > Date.parse(date_end_input.value)) {
        date_end_input.value = start;
    }
})