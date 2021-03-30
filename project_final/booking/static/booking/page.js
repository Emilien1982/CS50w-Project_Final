const edit_section = document.getElementById("edit_section");

/* Handle cliking on Edit table button */
const edit_btns = document.getElementsByClassName("edit-table");
for (const edit_btn of edit_btns) {
        edit_btn.addEventListener('click', event => {
            const table_id = event.target.dataset.table_id;
            const edit_form_inputs = edit_section.querySelectorAll("input");
            const edit_form_selects = edit_section.querySelectorAll("select");
            
            /* get all the data on tables from data of <table> as JSON */
            const tables_data = JSON.parse(document.querySelector("#existing-tables > table").dataset.tables_data);
            /* extract the data of the edited table */
            let edited_table_data = {};
            for (const table of tables_data) {
                if (table["id"] == table_id) {
                    edited_table_data = table;
                }
            }

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
                        input.value = value;
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
