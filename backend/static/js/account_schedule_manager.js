let active_schedule_id = null;
let schedules = null;

function apply_user_data(data) {
    schedules = {}
    for (const schedule_id in data["schedules"]) {
        schedules[schedule_id] = new Schedule(data["schedules"][schedule_id])
    }

    active_schedule_id = data["active_schedule_id"]
}

async function startup() {
    get_user_data().then(function(){
        // schedule check
        if (Object.keys(schedules).length === 0){
            let local_schedules = window.localStorage.getItem("schedules");
            if (local_schedules !== null) {
                if (confirm("Would you like to migrate your existing schedules to your account?")) {
                    $.ajax({
                        url: "/api/user",
                        method: "POST",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify({
                            "action": "migrate",
                            "schedules": local_schedules,
                            "active_schedule_id": active_schedule_id ? active_schedule_id : (window.localStorage.getItem("active_schedule") ? window.localStorage.getItem("active_schedule") : Object.keys(schedules)[0])
                        }),
                        success: function (data) {
                            apply_user_data(data)
                        },
                        error: function (data) {
                            console.error("Failed to migrate user schedule data!")
                            console.log(data)
                        }
                    })
                } else {
                    create_new_schedule().then(function() {
                        loadSchedule(get_active_schedule())
                    })
                }
            } else {
                create_new_schedule().then(function() {
                    loadSchedule(get_active_schedule())
                })
            }
        }
        else {
            loadSchedule(get_active_schedule())
        }
    })
}

function get_user_data(){
    return $.ajax({
        url: "/api/user",
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            apply_user_data(data)
            console.log("applied user data")
        },
        error: function(data) {
            console.error("Failed to load user data!")
            console.log(data)
        }
    })
}

function Schedule (data) {
    this.id = data["id"]
    this.displayName = data["displayName"]
    this.classNumbers = data["classNumbers"]
    this.term = 2229

    this.addClass = function(class_number) {
        $.ajax({
            url: "/api/user/schedule",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "schedule_id": this.id,
                "action": "add_class",
                "class_number": class_number
            }),
            success: function (data) {
                apply_user_data(data)
            },
            error: function (data) {
                console.error("Failed to add class to schedule")
                console.log(data)
            }
        })
    }

    this.removeClass = function(class_number) {
        $.ajax({
            url: "/api/user/schedule",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "schedule_id": this.id,
                "action": "remove_class",
                "class_number": class_number
            }),
            success: function (data) {
                apply_user_data(data)
            },
            error: function (data) {
                console.error("Failed to remove class from schedule")
                console.log(data)
            }
        })
    }
    this.setDisplayName = function(name) {
        $.ajax({
            url: "/api/user/schedule",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "schedule_id": this.id,
                "action": "set_display_name",
                "displayName": name
            }),
            success: function (data) {
                apply_user_data(data)
            },
            error: function (data) {
                console.error("Failed to change schedule display name")
                console.log(data)
            }
        })
    }
}

function get_active_schedule(){
    if (schedules === null) {
        console.error("There are no schedules cached")
        get_user_data()
        return
    }
    if (!active_schedule_id) {
        active_schedule_id = Object.keys(schedules)[0]
        set_active_schedule(active_schedule_id)
    }
    return schedules[active_schedule_id]
}


function set_active_schedule(active_schedule){
    console.log("active schedule:" + active_schedule)

    $.ajax({
        url: "/api/user",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: {
            "action": "update_active_schedule",
            "schedule_id": active_schedule
        },
        success: function (data) {
            schedules = JSON.parse(data["schedules"])
            active_schedule_id = data["active_schedule_id"]
        },
        error: function (data) {
            console.error("Failed to update user schedule data!")
            console.log(data)
        }
    })
}

function create_new_schedule() {
    return $.ajax({
        url: "/api/user",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: {
            "action": "createSchedule"
        },
        success: function (data) {
            apply_user_data(data)
        },
        error: function (data) {
            console.error("Failed to create a new schedule")
            console.log(data)
        }
    })
}