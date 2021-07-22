//constants
const currentUrl = window.location.href.split(/[?#]/)[0];

// elements
let exerciseTypeSelect = document.getElementsByClassName("exercise-type");
let addRowButton = document.getElementById("add-row");
let saveWorkoutButton = document.getElementById("submit");
let workoutListForm = document.getElementById("workout-list");
let navBar = document.getElementById("navbarToggleExternalContent");
let newRow = '<div class="form-row mb-1"><div class="col"><input type="text" class="form-control" placeholder="Exercise name" name="name[]"></div><div class="col"><select id="selectbox" class="form-control exercise-type" name="type[]"><option selected>Choose type...</option><option value="none">General</option><option value="rep">Rep</option><option value="time">Time</option></select></div><div class="col"><input type="number" class="form-control d-none amount" placeholder="" name="amount[]"></div><div class="col"><input type="number" class="form-control d-none rest" placeholder="Rest Time" name="rest[]"></div></div>';

addRowButton.addEventListener("click", duplicateRow);
saveWorkoutButton.addEventListener("click", saveWorkout);
// actions
addMultipleListeners(exerciseTypeSelect, "change", initSelectType);
populateForm();

// functions
function addMultipleListeners(elements, event, trigger) {
    Array.from(elements).forEach(function(element) {
        element.removeEventListener(event, trigger, true);
        element.addEventListener(event, trigger);
    });
}

function saveWorkout() {
    let names = document.getElementsByName('name[]');
    let types = document.getElementsByName('type[]');
    let amounts = document.getElementsByName('amount[]');
    let rests = document.getElementsByName('rest[]');

    let builtList = [];

    for(key = 0; key < names.length; key++)  {
        let exercise = { 
            name: names[key].value,
            type: types[key].value,
            amount: amounts[key].value,
            rest: rests[key].value
        };
        builtList.push(exercise);
    }

    let obj = {
        list: builtList
    }

    let encoded = btoa(JSON.stringify(obj));

    window.location = currentUrl + "?workout=" + encoded;
}

function duplicateRow() {
    workoutListForm.insertAdjacentHTML('beforeend', newRow);
    addMultipleListeners(exerciseTypeSelect, "change", initSelectType);
}

function initSelectType() {
    selectType(this);
}

function selectType(obj) {
    let element = document.getElementById("selectbox");
    let parent = obj.closest(".col");
    let amountSibling = parent.nextElementSibling;
    let amount = amountSibling.querySelector(".amount");
    let restTimeSibling = amountSibling.nextElementSibling;
    let restTime = restTimeSibling.querySelector(".rest");

    switch(obj.value) {
        case "none":
            amount.classList.add("d-none");
            restTime.classList.add("d-none");
            amount.value = "";
            restTime.value = "";
          break;
        case "rep":
            amount.classList.remove("d-none");
            amount.placeholder = "Reps";
            restTime.classList.add("d-none");
            restTime.value = "";
          break;
        default:
            amount.classList.remove("d-none");
            amount.placeholder = "Active time";
            restTime.classList.remove("d-none");
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
        addMultipleListeners(exerciseTypeSelect, "change", initSelectType);
    } else {
        navBar.classList.add("show");
        counterDiv.innerText = "Create workout";
        container.removeEventListener("click", stepThroughWorkout);
    }
}

function populateRow(list, index) {
    let newPopulatedRow = '<div class="form-row mb-1"><div class="col"><input type="text" class="form-control" placeholder="Exercise name" name="name[]" value="' + list.name + '"></div><div class="col"><select id="selectbox-' + index + '" class="form-control exercise-type" name="type[]"><option selected>Choose type...</option><option value="none">General</option><option value="rep">Rep</option><option value="time">Time</option></select></div><div class="col"><input type="number" class="form-control amount" placeholder="" name="amount[]" value="' + list.amount + '"></div><div class="col"><input type="number" class="form-control rest" placeholder="Rest Time" name="rest[]"  value="' + list.rest + '"></div></div>'
    workoutListForm.insertAdjacentHTML('beforeend', newPopulatedRow);
    let selectBox = document.getElementById("selectbox-" + index);
    selectBox.value = list.type;
}
