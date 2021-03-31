const edit_section = document.getElementById("edit_section");

/* get all the data on tables from data of <table> as JSON */
const tables_data = JSON.parse(document.querySelector("#existing-tables > table").dataset.tables_data);

///// Get elements and function to manage editing reference
var other_references = [];
/* select the reference input */
const ref_input = document.querySelector("#edit_section input[name='reference']");
ref_input.setAttribute("autocomplete", "off");
/* select the alert p */
const ref_alert = document.getElementById("reference-alert");
/* select the submit btn */
const edit_submit_btn = edit_section.querySelector("input[value='Update table']");
/* add the Onchange event */
ref_input.addEventListener('input', event => {
    ref_input.style.background = "white";
    ref_alert.style.opacity = "0";
    /* ref_alert.setAttribute("class", "d-none"); */
    for (otherRef of other_references) {
        if (ref_input.value === otherRef) {
            ref_input.style.background = "#F8D7DA";
            ref_alert.innerText = `${otherRef} is already used on an existing table.`;
            ref_alert.style.opacity = "1";
            /* ref_alert.removeAttribute("class", "d-none"); */
            break;
        }
    }
});


/* Handle cliking on Edit table button */
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
        /* Update the model title */
        document.getElementById('edit_section_label').innerText = `Edit Table ${edited_table_data.reference}`;
    });
}; 




/* AJOUTER UN CHECK DE LA REFERENCE (QUI DOIT ETRE UNIQUE) LORS DE L EDIT D'une TABLE */