// Global page variable
const border_style_default = '1px solid #ced4da';
const border_style_alert = '1px solid red';

// get elements in the criteria area
const alert = document.getElementById('alert-message');
const dates_list = document.getElementById('dates-list');
const select_input = document.querySelector("form select");
const checkbox_inputs = document.querySelectorAll("form input[type='checkbox']");

// get elements in the modal area
const details_date = document.getElementById('details_date');
const details_capacity = document.getElementById('details_capacity');
const details_time = document.getElementById('details_time');
const details_choose_table = document.querySelector('#details_choose_table table');
const details_tables = document.getElementById('details_tables');
const details_locked_table = document.getElementById('details_locked_table');
const details_alert = document.getElementById('details_alert');
const details_phone = document.getElementById('details_phone');
const details_foreign_num = document.getElementById('details_foreign_num');
const details_first = document.getElementById('details_first');
const details_last = document.getElementById('details_last');
const details_note = document.getElementById('details_note');
const details_booker = document.getElementById('details_booker');
const book_btn = document.getElementById('book_btn');
const success_popUp = document.getElementById('successfull_pop-up');
// LE TOKEN EST IL UTILISER ????
const csrf_token = document.querySelector('input[name="csrfmiddlewaretoken"]');

// get the choose lunch or dinner btn ready (to be duplicate in the date list)
const lunch_btn = document.createElement('div');
lunch_btn.innerHTML = '<button type="button" class="btn btn-sm btn-primary choose_date" data-time="lunch" data-bs-toggle="modal" data-bs-target="#booking_details">Lunch</button>';
const dinner_btn = document.createElement('div');
dinner_btn.innerHTML = '<button type="button" class="btn btn-sm btn-primary choose_date" data-time="dinner" data-bs-toggle="modal" data-bs-target="#booking_details">Dinner</button>';


//// Display the availables dates
const display_dates = (dates) => {
    current_month = ""
    // set the heading row
    dates_list.innerHTML = `
    <tr>
        <td></td>
        <td colspan="2">Date</td>
        <td>Lunch</td>
        <td>Dinner</td>
    </tr>`;
    // set every date in a new row
    for (const date_item of dates) {
        const day = new Intl.DateTimeFormat('en-US', { weekday: 'short'}).format(Date.parse(date_item.date));
        const month_date = new Intl.DateTimeFormat('en-US', {month: "2-digit", day: "2-digit"}).format(Date.parse(date_item.date));
        const month = new Intl.DateTimeFormat('en-US', {month: "long"}).format(Date.parse(date_item.date));
        const year = new Intl.DateTimeFormat('en-US', {year: "numeric"}).format(Date.parse(date_item.date));
        /// prepare a dict to store date data as dataset in the <tr> of the date_item
        const date_data = {
            "day": day,
            "month_date": month_date,
            "year": year,
            "tables": date_item.tables
        }
        /// Set the "month row heading" before the first possible_date of each month
        if (month !== current_month) {
            current_month = month;
            dates_list.innerHTML += `
            <tr>
                <td class="text-start"><h3>${current_month}</h3></td>
                <td colspan="4"></td>
            </tr>`;
        }
        /// Set the possible date details
        const date_row = document.createElement('tr');
        date_row.setAttribute('data-date_data', JSON.stringify(date_data))
        date_row.innerHTML +=`
            <td></td>
            <td>${day}</td>
            <td>${month_date}</td>`;
        ////////// display lunch btn if booking possible
        const lunch_cell = document.createElement('td');
        if (date_item.lunch) {
            lunch_cell.appendChild(lunch_btn.cloneNode(true));
        } else {
            lunch_cell.innerText = " - ";
        }
        date_row.appendChild(lunch_cell);
        ////////// display diner btn if booking possible
        const dinner_cell = document.createElement('td');
        if (date_item.dinner) {
            dinner_cell.appendChild(dinner_btn.cloneNode(true));
        } else {
            dinner_cell.innerText = " - ";
        }
        date_row.appendChild(dinner_cell);
        dates_list.appendChild(date_row);
    }
}

//// ill up the booking details form
const fillUp_details = (time, date_data) => {
    details_date.insertAdjacentText('beforebegin', `${date_data.day} `);
    details_date.innerHTML = `${date_data.month_date}`;
    details_date.setAttribute('data-year', date_data.year);
    details_capacity.innerHTML = `${select_input.value}`;
    document.getElementById('details_time').innerHTML = time;
    details_tables.innerHTML = '';
    const tables = date_data.tables;
    for (const table of tables) {
        const table_entry = document.createElement('tr');
        table_entry.innerHTML = `
            <td>
                <input class="form-check-input me-1" type="radio" name="table" id="table-${table.id}" value="${table.id}" required>
                <label for="table-${table.id}">${table.reference}</label>
            </td>
            <td>
                ${table.capacity} pers.
            </td>
            <td>
                ${table.area}
            </td>
            <td>
                ${table.form_type}
            </td>
            <td>
                ${table.is_for_disabled? ' ♿︎ ':' - '}
            </td>`;
        
        /// make the whole row clickage to check the radio input
        for (const cell of table_entry.getElementsByTagName('td')) {
            cell.addEventListener('click', (event) => {
                const input_of_the_row = event.target.parentElement.getElementsByTagName('input')[0];
                input_of_the_row.checked = true;
            })
        }
        details_tables.appendChild(table_entry);
    }
}

//// Fetch criteria and display the results on the page
const fetch_n_display = (criteria) => {
    fetch('/booking_api', {
        method: 'POST',
        body: JSON.stringify(criteria)
    })
    .then((response) => response.json())
    .then((response) => display_dates(response))
    .then(() => {
        /// set event listener on all luch and dinner btn
        const choose_btns = document.getElementsByClassName('choose_date');
        for (const btn of choose_btns) {
            btn.addEventListener('click', event => {
                const time = event.target.dataset.time;
                const row_element = event.target.parentElement.parentElement.parentElement;
                const date_data = JSON.parse(row_element.dataset.date_data);
                fillUp_details(time, date_data);
            })
        }
    });
}

//// Handle any change on the form inputs
const handle_inputs_onChange = () => {
    let search_criteria = {};
    // store all the criteria in the variable search_criteria
    search_criteria[select_input.name] = select_input.value;
    for (const checkbox of checkbox_inputs) {
        search_criteria[checkbox.name] = checkbox.checked;
        //checkbox.checked returns true or false
    }

    // check if there is minimum criteria And if ok => fetch data 
    if (!search_criteria['time-lunch'] && !search_criteria['time-dinner']) {
        // if 0 time checked
        alert.innerText = "At least 1 of Lunch or Dinner must be checked";
        alert.style.opacity = "1";
    } else if (!search_criteria['area-ext'] && !search_criteria['area-mai'] && !search_criteria['area-up']) {
        // if 0 area checked
        alert.innerText = "At least 1 of area must be checked";
        alert.style.opacity = "1";
    } else if (!search_criteria['table-low'] && !search_criteria['table-std'] && !search_criteria['table-high']) {
        // if 0 table-type checked
        alert.innerText = "At least 1 of table type must be checked";
        alert.style.opacity = "1";
    } else {
        alert.style.opacity = "0";
        fetch_n_display(search_criteria);
    }
}

//// Set eventListener on every criteria fields
select_input.addEventListener('input', handle_inputs_onChange);
for (const checkbox of checkbox_inputs) {
    checkbox.addEventListener('input', handle_inputs_onChange);
}

//// Check and fetch client data
const handle_client_data = async () => {
    const client_phone = details_phone.value;
    const client_first = details_first.value;
    let client_data = {};
    if (client_phone !== '' && client_first !== '') {
        client_data = {
        "phone": client_phone,
        "is_foreign_num": details_foreign_num.checked,
        "first": client_first,
        "last": details_last.value
        }
    } else {
        window.alert("Client phone and first name can't be empty.");
        details_phone.style.border = details_phone.value === ''? border_style_alert : border_style_default;
        details_first.style.border = details_first.value === ''? border_style_alert : border_style_default;
        return;
    }


    const client_id = await fetch('/client_api', {
        method: 'POST',
        body: JSON.stringify(client_data)
    })
    .then(resp => resp.json());
    return client_id;
}

//// Create a booking
const create_booking = (client_id) => {
    console.log( client_id);
    let table_id = '';
    for (const table_input of document.getElementsByName('table')) {
        if (table_input.checked) { table_id = table_input.value }
    }
    const date = details_date.innerText;
    const year = details_date.dataset.year;
    const time = details_time.innerText;
    const booker_short = details_booker.value;
    let booker_id = ''
    if (booker_short) {
        booker_id = document.querySelector(`option[value=${booker_short}]`).dataset.staff_id;
    }
    if (client_id !== '' && table_id !== '' && date !== '' && time !== '' && booker_id !== '') {
        // the date is only month/day. So it needs to be rebuild with year to have nice Date obj
        const booking_all_details = {
            "client_id": Number(client_id),
            "table_id": Number(table_id),
            "table_locked": details_locked_table.checked,
            "date": [Number(year), Number(date.slice(0,2)), Number(date.slice(-2))],
            "time": time,
            "booker_id": Number(booker_id),
            "note": details_note.value
        }
        console.log('LOCKED VALUE :', details_locked_table.checked);
        console.log('LOCKED OBJ :', Boolean(details_locked_table.checked));
        
        fetch('/booking_save_api', {
            method: 'POST',
            body: JSON.stringify(booking_all_details)
        })
        .then(() => success_popUp.removeAttribute('class','d-none'))
        .then(() => {
            setTimeout(() => {
                document.location.reload()
            }, 10000)
        })
        .catch(error => window.alert(error.message));
    }
    else {
        window.alert("You must choose a table and type your short name");
        if (table_id === undefined ) {
            details_choose_table.setAttribute('class', 'table table-striped table-danger');
        }
        details_booker.style.border = booker_id === ''? border_style_alert : border_style_default;
        return;
    }
}

//// Set click listener on Book btn
book_btn.addEventListener('click', async () => {
    // 1 get or create the client
    let client_id = await handle_client_data();
    
    // 2 create the booking
     create_booking(client_id);
})

//console.log(checkbox_inputs);

//// Set a DOMLoaded listener to fetch available tables with the default criteria
window.addEventListener("DOMContentLoaded", handle_inputs_onChange);

//// Set input listener to turn border back to normal when typing in field whise turned red after emplty submission try
const border_defaulter = (event) => {
    if (event.target.value !== '') {
        event.target.style.border = border_style_default;
    }
}
details_phone.addEventListener('input', border_defaulter);
details_first.addEventListener('input', border_defaulter);
details_choose_table.addEventListener('input', () => {
    details_choose_table.setAttribute('class', 'table table-striped');
});
details_booker.addEventListener('input', border_defaulter);

// JEUDI CREER LE FETCHAGE DU BOOKING EN JS ET SUR API