// get elements in the criteria area
const alert = document.getElementById('alert-message');
const dates_list = document.getElementById('dates-list');
const select_input = document.querySelector("form select");
const checkbox_inputs = document.querySelectorAll("form input[type='checkbox']");

// get elements in the modal area
const details_date = document.getElementById('details_date');
const details_capacity = document.getElementById('details_capacity');
const details_time = document.getElementById('details_time');
const details_tables = document.getElementById('details_tables');
const details_phone = document.getElementById('details_phone');
const details_first = document.getElementById('details_first');
const details_last = document.getElementById('details_last');
const details_note = document.getElementById('details_note');
const book_btn = document.getElementById('book_btn');

// get the choose lunch or dinner btn ready (to be duplicate in the date list)
const lunch_btn = document.createElement('div');
lunch_btn.innerHTML = '<button type="button" class="btn btn-sm btn-primary choose_date" data-time="lunch" data-bs-toggle="modal" data-bs-target="#booking_details">Lunch</button>';
const dinner_btn = document.createElement('div');
dinner_btn.innerHTML = '<button type="button" class="btn btn-sm btn-primary choose_date" data-time="dinner" data-bs-toggle="modal" data-bs-target="#booking_details">Dinner</button>';


//// Display the availables date
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
        const month_date = new Intl.DateTimeFormat('en-US', {month: "2-digit", day: "numeric"}).format(Date.parse(date_item.date));
        const month = new Intl.DateTimeFormat('en-US', {month: "long"}).format(Date.parse(date_item.date));
        /// prepare a dict to store date data as dataset in the <tr> of the date_item
        const date_data = {
            "day": day,
            "month_date": month_date,
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

        /* <td>${date_item.lunch? lunch_btn :" - "}</td>
            <td>${date_item.dinner? " ✔️ ":" - "}</td>
            <td><button type="button" class="btn btn-sm btn-primary choose_date" data-bs-toggle="modal" data-bs-target="#booking_details">Choose this date</button></td> */

        dates_list.appendChild(date_row);
    }
    /// AJOUTER UN EVENT LISTENER SUR CHAQUE BTN "CHOOSE THIS DATE"
}

//// ill up the booking details form
const fillUp_details = (time, date_data) => {
    details_date.innerHTML = `${date_data.day}  ${date_data.month_date}`;
    details_capacity.innerHTML = `${select_input.value}`;
    document.getElementById('details_time').innerHTML = time;
    const tables = date_data.tables;
    for (const table of tables) {
        const table_entry = document.createElement('tr');
        table_entry.innerHTML = `
            <td>
                <input class="form-check-input me-1" type="radio" name="table" id="table-${table.id}" value="${table.id}">
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
        const choose_btns = document.getElementsByClassName('choose_date');
        for (const btn of choose_btns) {
            btn.addEventListener('click', event => {
                const time = event.target.dataset.time;
                const row_element = event.target.parentElement.parentElement.parentElement;
                const date_data = JSON.parse(row_element.dataset.date_data);
                fillUp_details(time, date_data);
            })
        }
    })
    ;
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



//console.log(checkbox_inputs);

// AJOUTER UN EVENT POUR FETCH DES LA FIN DU CHARGEMENT


// JEUDI CREER LE FETCHAGE DU BOOKING EN JS ET SUR API