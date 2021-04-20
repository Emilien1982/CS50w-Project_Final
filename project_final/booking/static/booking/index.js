const capacity_select1 = document.getElementById('capacity-select1');
const get_first_btn = document.getElementById('get-first');

const capacity_select2 = document.getElementById('capacity-select2');
const time2s = document.querySelectorAll('[name="time2"]');
const date_select2 = document.getElementById('date-select2');
const check_date_btn = document.getElementById('check-date');

const search_results = document.getElementById('search-results');

/* Get FREE bookings */
const get_bookings = async (capacity) => {
    const bookings = await fetch('booking_api', {
        method: 'POST',
        body: JSON.stringify({
            'area-ext': true,
            'area-mai': true,
            'area-up': true,
            'table-low': true,
            'table-std': true,
            'table-high': true,
            'capacity': capacity,
            'disabled-access': false,
            'time-lunch': true,
            'time-dinner': true
        })
    })
    .then(resp => resp.json() )
    return bookings;
}


/* Handle search for the first free booking */
const get_first = (bookings) => {
    const today = new Date;
    const year = today.toLocaleDateString('en-US', { year: 'numeric'});
    const month = today.toLocaleDateString('en-US', { month: '2-digit'});
    const day = today.toLocaleDateString('en-US', { day: '2-digit'});
    const date = `${year}-${month}-${day}`;

    // Check if the first bookings are in the future. booking_api returns all the availability from today lunch,
    // which has no sense if the search is made in the after noon or at 22:00!
    for (const booking of bookings) {
        let time = '';
        // if the available booking is today, check the time
        if (booking['date'] === date) {
            const hours = today.getHours();
            if (hours >= 20) {
                // its too late for today, go to the next booking available
                continue;
            }
            if (hours >= 12 && booking['dinner'].length > 0) {
                // if the lunch is over and there is bnooking availble for dinner
                time = 'dinner';
            } 
            if (hours < 12 ) {
                // if the lunch is not done yet, look for lunch first, then for dinner
                if (booking['lunch'].length > 0){
                    time = 'lunch';
                }
                else if (booking['dinner'].length > 0){
                    time = 'dinner';
                }
            }
        } else {
            // The booking available is not today: no need to look at the time of search (hours)
            if (booking['lunch'].length > 0) {
                time = 'lunch';
            }
            else if (booking['dinner'].length > 0) {
                time = 'dinner';
            }
        }
        if (time !== '') {
            // if a available booking exist, return his date and time
            return {
                'date': booking['date'],
                'time': time
            };
        }
    }
}


get_first_btn.addEventListener('click', async() => {
    search_results.setAttribute('class','d-none');

    const free_bookings = await get_bookings(capacity_select1.value);

    const booking = get_first(free_bookings);
    if (booking !== undefined) {
        search_results.innerHTML = `
        <div class="alert alert-success text-center" role="alert">
            <h3>There is a free ${capacity_select1.value} persons table <span class="fw-bolder">on ${booking.date} for ${booking.time}</span>
            <br>
            Give us a call to book it.</h3>
        </div>`
    } else {
        search_results.innerHTML = `
        <div class="alert alert-dark text-center" role="alert">
            <h3> Sorry, all ${capacity_select1.value} persons tables are booked for the next 31 days.</h3>
        </div>`
    }
    search_results.removeAttribute('class');
})


/* Handle search for a specific date */
check_date_btn.addEventListener('click', async () => {
    // Hidden the results alert
    search_results.setAttribute('class','d-none');

    // Get all FREE bookings from the booking_api (it returns the free bookings for the next 31 days)
    const free_bookings = await get_bookings(capacity_select2.value);

    // Get the seleted time
    time_selected = '';
    for (const time of time2s) {
        if (time.checked) {
            time_selected = time.value;
        }
    }

    // Iterate over the free_bookings to check if the date, time and if there is 1 (or more) free table
    // Update booking_possible if possible
    let booking_possible = false;
    for (const booking of free_bookings) {
        if (booking.date === date_select2.value) {
            if (booking[time_selected].length > 0) {
                booking_possible = true;
            }
        }
    }
    // Display the results regarding booking_possible.
    if (booking_possible) {
        search_results.innerHTML = `
        <div class="alert alert-success text-center" role="alert">
            <h3>There is a free ${capacity_select2.value} persons table on your date and time.
            <br>
            Give us a call to book it.</h3>
        </div>`
    } else {
        search_results.innerHTML = `
        <div class="alert alert-dark text-center" role="alert">
            <h3> Sorry, all ${capacity_select2.value} persons tables are booked on your date and time.</h3>
        </div>`
    }
    search_results.removeAttribute('class');
})

