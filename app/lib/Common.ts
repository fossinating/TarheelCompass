import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectDefaultTerm, selectTerms } from "./redux";

export class SectionData {
    course_code: string;
    section_code: string;
    title: string;
    description: string;
    schedules: ClassSchedule[];
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
        course_code: string, section_code: string, title: string, description: string, schedules: ClassSchedule[], class_number: number, component: string, term: string, 
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

export class ClassSchedule {
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

export interface TermData {
  id: string;
  name: string;
  default?: boolean;
}

export function useTerms(): [TermData[]|undefined, string|undefined, Dispatch<SetStateAction<string|undefined>>] {

    const terms = useSelector(selectTerms);
    const defaultTerm = useSelector(selectDefaultTerm);
    const [term, setTerm] = useState<string | undefined>(defaultTerm);

    useEffect(() => {
      if (term === undefined) {
        setTerm(defaultTerm)
      }
    },[defaultTerm])

    return [terms, term, setTerm];
}

export function titleCase(str: string) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}