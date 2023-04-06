import internal from "stream";

export class SectionData {
    course_code: string;
    section_code: string;
    title: string;
    description: string;
    schedules: Schedule[];
    class_number: number;
    component: string;
    term: string;
    credits: number;
    instruction_type: string;
    enrollment_cap: number;
    enrollment_total: number;
    waitlist_cap: number;
    waitlist_total: number;
    min_enrollment: number;
    attributes: {[key: string]: string};
    last_updated_at: Date;
    last_updated_from: string;

    constructor(
        course_code: string, section_code: string, title: string, description: string, schedules: Schedule[], class_number: number, component: string, term: string, 
        credits: number, instruction_type: string, enrollment_cap: number, enrollment_total: number, waitlist_cap: number, waitlist_total: number, min_enrollment: number, 
        attributes: {[key: string]: string}, last_updated_at: Date, last_updated_from: string) {
        this.course_code = course_code;
        this.section_code = section_code;
        this.title = title;
        this.description = description;
        this.schedules = schedules;
        this.class_number = class_number;
        this.component = component;
        this.term = term;
        this.credits = credits;
        this.instruction_type = instruction_type;
        this.enrollment_cap = enrollment_cap;
        this.enrollment_total = enrollment_total;
        this.waitlist_cap = waitlist_cap;
        this.waitlist_total = waitlist_total;
        this.min_enrollment = min_enrollment;
        this.attributes = attributes;
        //equivalents = Column(Text)
        this.last_updated_at = last_updated_at;
        this.last_updated_from = last_updated_from;
    }
}

export class Schedule {
    instructors: string[];
    days: string;
    time: string;
    location: string;

    constructor(instructors: string[], days: string, time: string, term: string, location: string) {
        this.instructors = instructors;
        this.days = days;
        this.time = time;
        this.location = location;
    }
}