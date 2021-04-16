/* Page elements */
const lunch_btns = document.getElementsByClassName('lunch');
const dinner_btns = document.getElementsByClassName('dinner');


/* Modal elements */
const modal_title = document.querySelector('#detailsModal h5');
const modal_list = document.querySelector('#detailsModal tbody');


/* Handle click on 'delete' btn */
const handle_delete = event => {
    const booking_row = event.target.parentElement.parentElement;
    const booking_id = event.target.dataset.booking_id;
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
        const booking_row = event.target.parentElement.parentElement;
        const booking_id = event.target.dataset.booking_id;
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

        new_row.innerHTML = `
        <td>
        <button type="button" class="btn btn-sm btn-danger delete_booking" data-booking_id="${booking.id}">Delete</button>
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
        <td>${booking.creator_short_name}</td>
        <td>${booking.note}</td>
        <td>
        <button type="button" class="btn btn-sm btn-primary honored_booking" data-booking_id="${booking.id}">Honored</button>
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