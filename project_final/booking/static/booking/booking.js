

let search_criteria = {};

//// Get all inputs (and select) elements
const select_input = document.querySelector("form select");
const checkbox_inputs = document.querySelectorAll("form input[type='checkbox']");

//// Handle any change on the form inputs
const handle_inputs_onChange = () => {
    // store all the criteria in the variable search_criteria
    search_criteria[select_input.name] = select_input.value;

    for (const checkbox of checkbox_inputs) {
        search_criteria[checkbox.name] = checkbox.checked;
        //checkbox.checked returns true or false
    }

    // send the criteria to the booking API and display the results
    fetch('/booking_api', {
        method: 'POST',
        body: JSON.stringify(search_criteria)
    })
}

select_input.addEventListener('input', handle_inputs_onChange);
for (const checkbox of checkbox_inputs) {
    checkbox.addEventListener('input', handle_inputs_onChange);
}



//console.log(checkbox_inputs);

// AJOUTER UN EVENT POUR FETCH DES LA FIN DU CHARGEMENT