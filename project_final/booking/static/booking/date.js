
const date_end_input = document.getElementById("date_end");
const date_booking_conflits = document.getElementById("date-booking-conflits");

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
    // both start and end weekday are re-evalued on every change of each date input
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


///// Check if existing bookings existing on the date to delete, alert the user and delete it
const handle_delete_special_date = async (event) => {
    /// 1- Check if there is bookings on the special date to delete
    const times = event.target.dataset.times;
    let conflit_bookings = []
    
    if (times.includes("lunch")) {
        const lunch_conflits = await fetch('get_booking', {
            method: 'POST',
            body: JSON.stringify({
                'date': event.target.dataset.date,
                'time': 'lunch'
            })
        }).then(resp => resp.json())
        for (const conflit of lunch_conflits) {
            conflit_bookings.push(conflit);
        }
    }
    if (times.includes("dinner")) {
        const dinner_conflits = await fetch('get_booking', {
            method: 'POST',
            body: JSON.stringify({
                'date': event.target.dataset.date,
                'time': 'dinner'
            })
        }).then(resp => resp.json())
        for (const conflit of dinner_conflits) {
            conflit_bookings.push(conflit);
        }
    }
    //console.log(conflit_bookings);
    /// 2 - If there is 1 or more bookings - ask the user to confirm deletion of the special date
    let user_confirm = true;
    if (conflit_bookings.length !== 0) {
            user_confirm = window.confirm(`There is ${conflit_bookings.length} booking(s) on the date you want to delete. Do you really want to delete alls?`);
    }
    /// 3 - If confirmation: delete the date and display the eventual conflit_bookings
    const date_id = event.target.dataset.date_id;
    const date_row = event.target.parentElement.parentElement;
    if (user_confirm) {
        fetch(`date_detete/${date_id}`)
        .then(resp => {
            if (resp.status === 200) {
                date_row.remove();
                // diplay conflits
                for (const conflit of conflit_bookings) {
                    date_booking_conflits.innerHTML += 
                    `<p>${conflit.booking_date}   ${conflit.booking_time}  -  ${conflit.table_reference}  -  ${conflit.client_name}: ${conflit.client_tel}</p>
`;
                    date_booking_conflits.removeAttribute('class');
                }
            }
        })
    }
} 

/////  Manage the delete button of every existing dates
const delete_btns = document.getElementsByClassName("date_delete");
for (const delete_btn of delete_btns) {
    delete_btn.addEventListener('click', handle_delete_special_date)
}
