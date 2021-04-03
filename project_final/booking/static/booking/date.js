
//// Manage the background of the date list rows regarding the date state (Open/close)
const td_states = document.querySelectorAll("#date-list td[class='date_state']");
for (const td_state of td_states) {
    let bg_color = "#c7ffea";
    if (td_state.innerText == 'Close') {
        bg_color = '#ffdfdf'
    }
    const td_state_row = td_state.parentElement;
    const row_cells = td_state_row.children;
    

    for (const cell of row_cells) {
        console.log(cell);
        cell.style.background = bg_color;
    }
}


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

//// Manage the weekday displayed next to the date inputs
    // both start and end weekday are re-evalued on evry change of each date input
const date_inputs = document.querySelectorAll('input[type="date"]');
for (input of date_inputs) {
    input.addEventListener('input', () => {
        for (const inputy of date_inputs) {
            const new_date = new Date(inputy.value);
            const day_num = new_date.getDay();
            const day_string = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day_num];
            // the place to diplay the weekday is just next to the date input
            inputy.nextElementSibling.innerText = day_string;
        }
    })
}

/////  Manage the delete button of every existing dates
const delete_btns = document.getElementsByClassName("date_delete");
for (const delete_btn of delete_btns) {
    delete_btn.addEventListener('click', () => {
        const date_id = delete_btn.dataset.date_id;
        fetch(`date_detete/${date_id}`)
        .then(delete_btn.parentElement.parentElement.remove())
    })
}