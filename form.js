//constants
const currentUrl = window.location.href.split(/[?#]/)[0];

// elements
let exerciseTypeSelect = document.getElementsByClassName("exercise-type");
let removeRowButton = document.getElementsByClassName("fa-trash");
let copyRowButton = document.getElementsByClassName("bi-clipboard");

let addRowButton = document.getElementById("add-row");
let saveWorkoutButton = document.getElementById("submit");
let workoutListForm = document.getElementById("workout-list");
let navBar = document.getElementById("navbarToggleExternalContent");
let newRow = '<li><div class="form-row mb-1"><div class="col-1"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="height:30px;" class="svg-inline--fa fa-trash fa-w-14 fa-lg"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" class=""></path></svg><i class="sort-by-desc"></i><i class="sort-by-asc"></i></div><div class="col"><span class="ui-icon ui-icon-arrowthick-2-n-s"><input type="text" class="form-control" placeholder="Exercise name" name="name[]"></div><div class="col"><select id="selectbox" class="form-control exercise-type" name="type[]"><option value="" disabled selected>Choose type...</option><option value="none">General</option><option value="rep">Rep</option><option value="time">Time</option></select></div><div class="col"><input type="number" class="form-control d-none amount" placeholder="" name="amount[]"></div><div class="col"><input type="number" class="form-control d-none rest" placeholder="Rest Time" name="rest[]"></div></div><li>';

let names;
let types;
let amounts;
let rests;

addRowButton.addEventListener("click", addRow);
saveWorkoutButton.addEventListener("click", saveWorkout);
// actions
attachEventListeners();
populateForm();

// functions
function addMultipleListeners(elements, event, trigger) {
    Array.from(elements).forEach(function(element) {
        element.removeEventListener(event, trigger, true);
        element.addEventListener(event, trigger);
    });
}

function getFormElements() {
    names = document.getElementsByName('name[]');
    types = document.getElementsByName('type[]');
    amounts = document.getElementsByName('amount[]');
    rests = document.getElementsByName('rest[]');
}

function saveWorkout() {
    getFormElements();
    if (!validateForm()) {
        return;
    }

    console.log('here');

    let builtList = [];

    // need to do some validation here

    for(key = 0; key < names.length; key++)  {
        if (names[key].value != "" && types[key].value != "") {
            let exercise = { 
                name: names[key].value,
                type: types[key].value,
                amount: amounts[key].value,
                rest: rests[key].value
            };
            builtList.push(exercise);
        }
    }

    if (builtList.length > 0) {
        let obj = {
            list: builtList
        }

        let encoded = btoa(JSON.stringify(obj));

        window.location = currentUrl + "?workout=" + encoded;
    }
}

function validateForm() {
    let validated = [];

    for(key = 0; key < names.length; key++)  {
        validated.push(checkAndSetInvalid(names[key]));
        validated.push(checkAndSetInvalid(types[key]));

        switch(types[key].value) {
            case "rep":
                validated.push(checkAndSetInvalid(amounts[key]));
            break;
            case "time":
                validated.push(checkAndSetInvalid(amounts[key]));
                validated.push(checkAndSetInvalid(rests[key]));
            break;
        }
    }

    if (validated.includes(false)) {
        alert('Please ensure all fields are filled out correctly');
        return false;
    }

    return true;
}

function checkAndSetInvalid(element) {
    element.removeEventListener('change', checkValidation);
    element.classList.remove("invalid");
    if (element.value == "") {
        element.classList.add("invalid");
        element.addEventListener('change', checkValidation);
        element.add
        return false;
    }

    return true;
}

function checkValidation() {
    checkAndSetInvalid(this);
}

function attachEventListeners() {
    addMultipleListeners(exerciseTypeSelect, "change", initSelectType);
    addMultipleListeners(removeRowButton, "click", deleteRow);
    addMultipleListeners(copyRowButton, "click", copyRow);
}

function addRow() {
    workoutListForm.insertAdjacentHTML('beforeend', newRow);
    attachEventListeners();
}

function copyRow() {
    let parent = this.closest("li");
    var clone = parent.cloneNode(true);
    //need to add a way to copy select box values
    parent.after(clone);
    attachEventListeners();
}

function initSelectType() {
    selectType(this);
}

function selectType(obj) {
    let parent = obj.closest(".col");
    let amountSibling = parent.nextElementSibling;
    let amount = amountSibling.querySelector(".amount");
    let restTimeSibling = amountSibling.nextElementSibling;
    let restTime = restTimeSibling.querySelector(".rest");

    switch(obj.value) {
        case "rep":
            amount.classList.remove("d-none");
            amount.placeholder = "Reps";
            restTime.classList.add("d-none");
            restTime.value = "";
          break;
        case "time":
            amount.classList.remove("d-none");
            amount.placeholder = "Active time";
            restTime.classList.remove("d-none");
          break;
        default:
            amount.classList.add("d-none");
            restTime.classList.add("d-none");
            amount.value = "";
            restTime.value = "";
          break;
    }
}

function populateForm() {
    if (workoutJsonList.length > 0) {
        workoutListForm.innerHTML = "";
        let i = 0;
        Array.from(workoutJsonList).forEach(function(list) {
            populateRow(list, i);
            i++;
        });
        Array.from(exerciseTypeSelect).forEach(function(list) {
            selectType(list);
        });
        attachEventListeners();
        exerciseNext.innerText = "First:" + workoutJsonList[0].name;
    } else {
        navBar.classList.add("show");
        counterDiv.innerText = "Create workout";
        container.removeEventListener("click", stepThroughWorkout);
    }
}

function populateRow(list, index) {
    let newPopulatedRow = '<li><div class="form-row mb-1"><div class="col-1"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="height:30px;" class="svg-inline--fa fa-trash fa-w-14 fa-lg"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" class=""></path></svg><i class="sort-by-desc"></i><i class="sort-by-asc"></i></div><div class="col"><span class="ui-icon ui-icon-arrowthick-2-n-s"><input type="text" class="form-control" placeholder="Exercise name" name="name[]" value="' + list.name + '"></div><div class="col"><select id="selectbox-' + index + '" class="form-control exercise-type" name="type[]"><option value="" disabled selected>Choose type...</option><option value="none">General</option><option value="rep">Rep</option><option value="time">Time</option></select></div><div class="col"><input type="number" class="form-control amount" placeholder="" name="amount[]" value="' + list.amount + '"></div><div class="col"><input type="number" class="form-control rest" placeholder="Rest Time" name="rest[]"  value="' + list.rest + '"></div></div><li>'
    workoutListForm.insertAdjacentHTML('beforeend', newPopulatedRow);
    let selectBox = document.getElementById("selectbox-" + index);
    selectBox.value = list.type;
    $( function() {
        $( "#workout-list" ).sortable();
        $( "#workout-list" ).disableSelection();
    } );
}

function deleteRow() {
    let parent = this.closest("li");
    parent.remove();
}

// jquery
$( function() {
    $( "#workout-list" ).sortable();
    $( "#workout-list" ).disableSelection();
} );