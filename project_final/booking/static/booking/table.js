const edit_section = document.getElementById("edit_section");

///// get all the data on tables from data of <table> as JSON
const tables_data = JSON.parse(document.querySelector("#existing-tables > table").dataset.tables_data);

//// function that check the inputed reference in real time. Used with the create form and the edit form
const reference_checker = (input, alert, submit, forbidden_references) => {
    submit.removeAttribute("disabled", "");
    input.style.background = "white";
    alert.style.opacity = "0";
    for (reference of forbidden_references) {
        if (input.value === reference) {
            submit.setAttribute("disabled", "");
            input.style.background = "#F8D7DA";
            alert.innerText = `${reference} is already used on an existing table.`;
            alert.style.opacity = "1";
            break;
        }
    }
}


////// Get elements and eventListener to manage CREATING table - reference checker
let all_references = [];
for (const table_data of tables_data) {
    all_references.push(table_data.reference);
}
const create_ref_input = document.querySelector("#create-table input[name='reference']");
create_ref_input.setAttribute("autocomplete", "off");
const create_ref_alert = document.getElementById("create-reference-alert");
const create_submit_btn = document.querySelector("input[value='Create table']");
create_ref_input.addEventListener('input', () => {
    reference_checker(create_ref_input, create_ref_alert, create_submit_btn, all_references)
});


///// Get elements and eventListener to manage EDITING reference
var other_references = [];
const edit_ref_input = document.querySelector("#edit_section input[name='reference']");
edit_ref_input.setAttribute("autocomplete", "off");
const edit_ref_alert = document.getElementById("reference-alert");
const edit_submit_btn = edit_section.querySelector("input[value='Update table']");
edit_ref_input.addEventListener('input', () => {
    reference_checker(edit_ref_input, edit_ref_alert, edit_submit_btn, other_references)
});


///// Handle cliking on Edit table button
const edit_btns = document.getElementsByClassName("edit-table");

for (const edit_btn of edit_btns) {
    edit_btn.addEventListener('click', event => {
        const edited_table_id = event.target.dataset.table_id;
        const edit_form_inputs = edit_section.querySelectorAll("input");
        const edit_form_selects = edit_section.querySelectorAll("select");
        
        /* extract the data of the edited table and
        the references of other tables for the editing reference input checker */
        let edited_table_data = {};
        let other_references_temp = [];
        for (const table of tables_data) {
            if (table["id"] == edited_table_id) {
                edited_table_data = table;
            } else {
                other_references_temp.push(table["reference"]);
            }
        }
        
        /* set up the global varaible other_references */
        other_references = other_references_temp;

        /* set the action action of the edit form */
        edit_section.querySelector("form").setAttribute("action", `/table/${edited_table_id}`)

        /* fill up the edit form */
        for (const [key, value] of Object.entries(edited_table_data)) {
            for (input of edit_form_inputs) {
                if (input.name === key) {
                    if (input.type === "checkbox")
                        if (value) {
                            input.setAttribute("checked", "");
                        } else {
                            input.removeAttribute("checked", "");
                        }
                    else {
                        // checkboxes dont have to set a value (it fools the editing request values instead)
                        input.value = value;
                    }
                }
            }
            for (select of edit_form_selects) {
                if (select.name === key) {
                    select.value = value;
                }
            }
        }
        /* Update the modal title */
        document.getElementById('edit_section_label').innerText = `Edit Table ${edited_table_data.reference}`;
    });
}; 


////// Handle cliking on Delete button
const delete_btns = document.getElementsByClassName("delete-table");
const delete_confirm_btn = document.getElementById("delete_confirm_btn");
const delete_message = document.getElementById("delete_message");

for (const delete_btn of delete_btns) {
    delete_btn.addEventListener('click', () => {
        const table_ref = delete_btn.dataset.table_ref;
        delete_message.innerHTML = `Are you sure, you want do delete table ${table_ref}?`;
        const table_id = delete_btn.dataset.table_id;
        delete_confirm_btn.setAttribute("data-table_id", table_id);
    });
};


delete_confirm_btn.addEventListener('click', event => {
    const delete_table_id = event.target.dataset.table_id;
    fetch(`/table_delete/${delete_table_id}`)
    .then(() => document.location.reload())
});
