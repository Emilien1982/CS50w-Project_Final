const edit_section = document.getElementById("edit_section");

///// Handle cliking on Edit table button
const edit_btns = document.getElementsByClassName("edit-staff");

for (const edit_btn of edit_btns) {
    edit_btn.addEventListener('click', event => {
        const staff_row = event.target.parentElement.parentElement;
        const edited_staff_id = staff_row.dataset.staff_id;
        
        /* set the staff id the edit form */
        edit_section.querySelector("input[name='staff_id']").value = edited_staff_id;

        /* Catch the existing data on the staff */
        const staff_position = staff_row.dataset.staff_position;
        const staff_is_active = staff_row.dataset.staff_is_active;
        const staff_firstName = staff_row.querySelector("span[class='staff_first_name']").innerText;
        const staff_lastName = staff_row.querySelector("span[class='staff_last_name']").innerText;
        const staff_shortName = staff_row.querySelector("td[class='staff_short_name']").innerText;

        /* fill up the edit form */
        edit_section.querySelector('input[name="first_name"]').value = staff_firstName;
        edit_section.querySelector('input[name="last_name"]').value = staff_lastName;
        edit_section.querySelector('input[name="short_name"]').value = staff_shortName;
        edit_section.querySelector('select[name="position"]').value = staff_position;
        if (staff_is_active == 'False') {
            // by default the is_active checkbox is checked, just need to uncheck it if unactive
            edit_section.querySelector('input[name="is_active"]').removeAttribute("checked");
        }

        /* Update the modal title */
        document.getElementById('edit_section_label').innerText = `Edit ${staff_firstName} ${staff_lastName}`;
    });
}; 


////// Handle cliking on Delete button
const delete_btns = document.getElementsByClassName("delete-staff");
const delete_confirm_btn = document.getElementById("delete_confirm_btn");
const delete_message = document.getElementById("delete_message");

for (const delete_btn of delete_btns) {
    delete_btn.addEventListener('click', (event) => {
        // set up the message of the delete confirmation modal
        const staff_row = event.target.parentElement.parentElement;
        const staff_firstName = staff_row.querySelector("span[class='staff_first_name']").innerText;
        const staff_lastName = staff_row.querySelector("span[class='staff_last_name']").innerText;
        delete_message.innerHTML = `Are you sure, you want do delete ${staff_firstName} ${staff_lastName}?`;
        // pass the staff id to the confirm button for an easy "pass through" data
        const staff_id = staff_row.dataset.staff_id;
        delete_confirm_btn.setAttribute("data-staff_id", staff_id);
    });
};

// After confirmation, delete the staff in the database then the staff row in the staff list on the screen
delete_confirm_btn.addEventListener('click', event => {
    const delete_staff_id = event.target.dataset.staff_id;
    fetch(`/staff_delete/${delete_staff_id}`)
    .then(() => document.querySelector(`tr[data-staff_id="${delete_staff_id}"]`).remove());
});
