/* Page elements */
const lunch_btns = document.getElementsByClassName('lunch');
const dinner_btns = document.getElementsByClassName('dinner');
const booking_conflits = document.getElementById('booking-conflits');


/* Modal elements */
const modal_title = document.querySelector('#detailsModal h5');
const modal_list = document.querySelector('#detailsModal tbody');


/* Handle click on 'delete' btn */
const handle_delete = event => {
    // handle_delete can come from clicking the delete button or the <span> in the button.
    // So to get the table row, it's necessary to 'bubble up' elements from the event.target until the row is reached 
    let booking_row = event.target.parentElement.parentElement;
    while (booking_row.tagName.toLowerCase() !== 'tr') {
        booking_row = booking_row.parentElement;
    }
    const booking_id = booking_row.dataset.booking_id;
    const confirm = window.confirm("Are you sure to delete this booking?");
    if (confirm) {
        fetch(`/booking_delete/${booking_id}`)
        .then(resp =>{
            if (resp.status !== 200) {
                throw new Error("Booking has NOT been deleted");
            }
            else {
                booking_row.remove();
            }
        })
        .catch(error => window.alert(error.message))
    }
}


/* Handle click on 'honored' btn */
const handle_honored = event => {
        // handle_honored can come from clicking the honored button or the <span> in the button.
        // So to get the table row, it's necessary to 'bubble up' elements from the event.target until the row is reached 
        let booking_row = event.target.parentElement.parentElement;
        while (booking_row.tagName.toLowerCase() !== 'tr') {
            booking_row = booking_row.parentElement;
        }
        const booking_id = booking_row.dataset.booking_id;
        fetch(`/booking_honored/${booking_id}`)
        .then(resp =>{
            if (resp.status !== 200) {
                throw new Error("Booking 'honored' has NOT been toggled");
            }
            else {
                if (booking_row.hasAttribute('class')){
                    booking_row.removeAttribute('class');
                } else {
                    booking_row.setAttribute('class', 'text-decoration-line-through text-secondary');
                }
            }
        })
        .catch(error => window.alert(error.message))
}


/* Set the listener for the modal btns */
const set_modal_listeners = () => {
    // Delete btns
    const delete_btns = document.getElementsByClassName('delete_booking');
    for (const btn of delete_btns) {
        btn.addEventListener('click', handle_delete);
    }
    // Honored btns
    const honored_btns = document.getElementsByClassName('honored_booking');
    for (const btn of honored_btns) {
        btn.addEventListener('click', handle_honored);
    }
}


// Fetch the data then fill up the modal
const fillUp_modal = async (date, time) => {
    // Display date and time in the modal title
    const date_obj = new Date(date);
    const date_format = {
        weekday: "long",
        month: "short",
        day: "2-digit"
    }
    modal_title.innerText = `${date_obj.toLocaleDateString('en-US', date_format)}   ---   ${time}`;
    // Make sure the list is empty before filling it up
    modal_list.innerHTML = ''
    // Get all the bookings for the seleted date and time
    const data = {
        'date': date,
        'time': time
    }
    const bookings = await fetch('/get_booking', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    // Fill up the list
    for (const booking of bookings) {
        const new_row = document.createElement('tr');
        new_row.setAttribute('data-booking_id', `${booking.id}`);

        new_row.innerHTML = `
        <td>
        <button type="button" class="btn btn-sm btn-danger delete_booking">Del<span class='optional-data'>ete</span></button>
        </td>
        `
        if (booking.is_wanted_table) {
            new_row.innerHTML += `<td> 🔒 </td>`;
        } else {
            new_row.innerHTML += `<td> - </td>`;
        }
        new_row.innerHTML += `
        <td>${booking.table_reference}</td>
        <td>${booking.client_name}</td>
        <td>${booking.client_tel}</td>
        <td class="optional-data">${booking.creator_short_name}</td>
        <td class="optional-data">${booking.note}</td>
        <td>
        <button type="button" class="btn btn-sm btn-primary honored_booking">Hon<span class='optional-data'>ored</span></button>
        </td>
        `;
        // Set line-throuh if the booking has been honored already
        if (booking.honored) {
            new_row.setAttribute('class', 'text-decoration-line-through text-secondary');
        }
        modal_list.appendChild(new_row);
    }
    set_modal_listeners();
} 


/* Set the listener on the lunch and dinner btns */
for (const btn of lunch_btns) {
    btn.addEventListener('click', event => {
        const date = event.target.dataset.date;
        fillUp_modal(date, 'lunch');
    })
}
for (const btn of dinner_btns) {
    btn.addEventListener('click', event => {
        const date = event.target.dataset.date;
        fillUp_modal(date, 'dinner');
    })
}

/* Get all booking conflits: made on closing times */
const get_conflits = async () => {
    booking_conflits.innerHTML = '<h2>Bookings on closed time:</h2>';
    const conflits = await fetch('booking_conflits'
    )
    .then(resp => resp.json())
    if (conflits.length > 0) {
        const tab = document.createElement('table');
        tab.setAttribute('class', 'table table-danger');
        tab.innerHTML += `<thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Table</th>
                                <th>Client</th>
                                <th>Phone</th>
                            </tr>
                        </thead>`;
        const tbody = document.createElement('tbody');
        tab.appendChild(tbody);
        for (const conflit of conflits) {
            const booking = conflit['booking'];
            const client = conflit['client'];
            const table = conflit['table']
                    tbody.innerHTML +=
                        `<tr>
                            <td>${booking.booking_date}</td>
                            <td>${booking.booking_time}</td>
                            <td>${table}</td>
                            <td>${client.name}</td>
                            <td>${client.phone}</td>
                        </tr>`;
                }
        booking_conflits.appendChild(tab);
        booking_conflits.removeAttribute('class');
    }
}

/* Get clonflits when Content is loaded and after a booking is deleted */
document.addEventListener('DOMContentLoaded', get_conflits);

const delete_btns = document.getElementsByClassName('delete_booking');
    for (const btn of delete_btns) {
        btn.addEventListener('click', get_conflits);
    }
