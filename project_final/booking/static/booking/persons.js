// Elements in the page
const page_alert = document.getElementById('page_alert');
const inputs_search = document.querySelectorAll('#search-clients input');
const search_btn = document.getElementById('search_btn');
const results_list = document.querySelector('#results-clients ul');

// Elements in the modal
const modal_edit = document.getElementById('edit_client');
const delete_client_btn = document.getElementById('delete_client_btn');
const modal_alert = document.getElementById('modal_alert');
const close_btn = document.getElementById('close_btn');
const save_updates_btn = document.getElementById('save_client_updates_btn');


// Disabled the autocomplete on the text inputs
for (const input of inputs_search) {
    input.setAttribute('autocomplete', 'off');
}


// Create a dict with all inputs'data
const inputs_iterator = (inputs) => {
    let dict = {};
    for (const input of inputs) {
        // if input type='text' or textarea
        if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea') {
            Object.defineProperty(dict, input.name, {
                value: input.value,
                enumerable: true
            })
        }
        // if input is checkbox
        if (input.type === 'checkbox') {
            Object.defineProperty(dict, input.name, {
                value: input.checked,
                enumerable: true
            })
        }
    }
    return dict;
}

// Get the matching clients
const fetch_criteria = async (data) => {
    const matching_clients = await fetch('/easy_client/search', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(resp => {
        if (resp.status === 204) {
            return null;
        }
        return resp.json()
    });
    return matching_clients;
}

// Edit client MODAL
const fillUp_Modal = async (client_id) => {
    const details = await fetch(`/easy_client/${client_id}`)
    .then(resp => resp.json());
    for (const [key, value] of Object.entries(details)) {
        // select the right modal input by his name attribute
        const input_target = document.querySelector(`#edit_client *[name=${key}]`)
        if (input_target.type === 'text' || input_target.tagName.toLowerCase() === 'textarea') {
            input_target.value = value;
        }
        if (input_target.type === 'checkbox') {
            input_target.checked = value;
        }
    }
    save_updates_btn.setAttribute('data-client_id', client_id);
    delete_client_btn.setAttribute('data-client_id', client_id);
}

// Display matching clients in the list
const display_matchers = (matching_clients) => {
    // reset the list
    results_list.innerHTML = '';

    if (matching_clients === null ) {
        const list_item = document.createElement('li');
        list_item.innerHTML = '<h4>NO MATCHING CLIENT - Try to enter lighter criteria </h4>';
        results_list.appendChild(list_item);
        return;
    }
    for (const client of matching_clients) {
        const list_item = document.createElement('li');
        list_item.innerText = `${client['fields']['first_name']} ${client['fields']['last_name']}`;
        list_item.setAttribute('class', 'clickable');
        list_item.setAttribute('data-bs-toggle',"modal");
        list_item.setAttribute('data-bs-target',"#edit_client");
        list_item.addEventListener('click',() => {
            fillUp_Modal(client['pk']);
        });
        results_list.appendChild(list_item);
    }
}

search_btn.addEventListener('click', async () => {
    // 1 - build the data (containing the criteria) to send to API
    const data = inputs_iterator(inputs_search);

    // 2 - Get the matching clients
    const matching_clients = await fetch_criteria(data);
    
    // 3 - Display the matching clients
    display_matchers(matching_clients);
})

// Handle the MODAL "Save Changes" button
save_updates_btn.addEventListener('click', (event) => {
    // 1 - Get all the data
    const inputs_edit = document.getElementsByClassName('edit_client_inputs');
    const fields = inputs_iterator(inputs_edit);
    // add the client id which has been set ad a dataset in the "Save change" button
    let client_details = {
        'fields': fields
    }
    Object.defineProperty(client_details, 'id', {
        value: event.target.dataset.client_id,
        enumerable: true
    })
    // 2 - Save the new details of the client.
    fetch('/client_update_api', {
        method: 'POST',
        body: JSON.stringify(client_details)
    })
    .then(resp => {
        if (resp.status === 200) {
            modal_alert.innerText = 'Client udpade is a success.';
            modal_alert.setAttribute('class', 'alert alert-success');
            setTimeout(() => {
                modal_alert.setAttribute('class', 'd-none');
                close_btn.click();
            }, 2000);
            search_btn.click()
        }
        else {
            throw new Error("The client has NOT been updated!");
        }

    })
    .catch(error => window.alert(error.message));
})

// Handle the Modal "Delete" btn
delete_client_btn.addEventListener('click', event => {
    const confirmation = window.confirm("Are you sure to delete this client?");
    if (!confirmation) {
        return;
    }
    const client_id = event.target.dataset.client_id;
    fetch(`/client_delete_api/${client_id}`)
    .then(resp => {
        if (resp.status === 200) {
            search_btn.click();
            page_alert.innerText = 'Client deleted';
            page_alert.setAttribute('class', 'alert alert-success');
            setTimeout(() => {
                page_alert.setAttribute('class', 'd-none');
            }, 2000);
        }
        else {
            throw new Error("The client has NOT been deleted!");
        }
    })
})


// FEATURE FOR THE FUTUR: add a possibility to search clients by their last booking date