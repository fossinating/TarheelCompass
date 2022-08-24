function Schedule (data) {
    this.id = data["id"]
    this.displayName = data["displayName"]
    this.classNumbers = data["classNumbers"]

    this.addClass = function(class_number) {
        this.classNumbers.push(class_number)
        save_schedule(this)
    }
    this.removeClass = function(class_number) {
        const index = this.classes.indexOf(class_number);
        if (index > -1) { // only splice array when item is found
          this.classNumbers.splice(index, 1); // 2nd parameter means remove one item only
        }
        save_schedule(this)
    }
    this.setDisplayName = function(name) {
        this.name = name
        save_schedule(this)
    }

}

function startup() {
    loadSchedule(get_active_schedule())
}


function get_active_schedule(){
    let active_schedule_id = window.localStorage.getItem("active_schedule");
    const schedules = get_schedules();
    if (!active_schedule_id) {
        active_schedule_id = Object.keys(schedules)[0]
        set_active_schedule(active_schedule_id)
    }
    return schedules[active_schedule_id]
}


function get_schedules(){
    let schedules_data = window.localStorage.getItem("schedules");
    let schedules = {}
    if (!schedules_data){
        const schedule = create_new_schedule();
        schedules = {
            [schedule.id] : schedule
        }
        save_schedules(schedules)
    } else {
        schedules_data = JSON.parse(schedules_data)
        for (const schedule_id in schedules_data) {
            schedules[schedule_id] = new Schedule(schedules_data[schedule_id])
        }
    }

    return schedules
}


// saves only one schedule, not modifying the others
function save_schedule(schedule){
    let schedules = get_schedules()
    schedules[schedule.id] = schedule
    save_schedules(schedules)
}

function save_schedules(schedules){
    window.localStorage.setItem("schedules", JSON.stringify(schedules));
}


function set_active_schedule(active_schedule){
    window.localStorage.setItem("active_schedule", active_schedule)
}


function create_new_schedule(){
    const id = window.crypto.randomUUID();
    return new Schedule ({
        "id": id,
        "displayName": "New Schedule",
        "classNumbers": []
    })
}