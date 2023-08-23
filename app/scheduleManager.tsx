import { OperationVariables, QueryOptions, QueryResult, useQuery } from "@apollo/client";
import { createContext, ReactElement, useEffect, useState } from "react";
import { gql } from "../src/__generated__";
import { GetCachedClassesQuery, GetClassesQuery } from "../src/__generated__/graphql";
import { SectionData } from "./Common";

export type CachedClass = { __typename?: 'Class', classNumber: number, classSection: string, combinedSectionId?: string | null, component?: string | null, enrollmentCap?: number | null, enrollmentTotal?: number | null, equivalents?: string | null, hours: number, instructionType?: string | null, meetingDates?: string | null, term: string, waitlistCap?: number | null, waitlistTotal?: number | null, course: { __typename?: 'Course', code: string, credits: string, description?: string | null, title: string, attrs: Array<{ __typename?: 'CourseAttribute', label: string, value: string }> }, schedules: Array<{ __typename?: 'ClassSchedule', days: string, endTime: number, startTime: number, location: string, instructors: Array<{ __typename?: 'Instructor', instructorType: string, name: string }> }> }
enum CacheState {
    Loading = 1,
    Cached,
    Live,
}
//let [savedClasses, setSavedClasses] = useState<Map<number, {data: GetCachedCoursesQuery, ref_ids: Array<string>}>>(new Map);

export class Schedule {
    id: string;
    name: string;
    term: string;
    class_numbers: Array<number>;
    setClassNumbers: Function;

    constructor(id: string, name: string, term: string, class_numbers: Array<number>) {
        this.id = id;
        this.name = name;
        this.term = term;
        [this.class_numbers, this.setClassNumbers] = useState(class_numbers);
    }

    addClass(class_data: {class_number: number}): void {
        this.setClassNumbers([ ...this.class_numbers, class_data.class_number]);
        localStorage.setItem("class_numbers", JSON.stringify(this.class_numbers));
    }
    removeClass(class_data: {class_number: number}): void {
        this.setClassNumbers(this.class_numbers.filter(e => e !== class_data.class_number));
        localStorage.setItem("class_numbers", JSON.stringify(this.class_numbers));
    }

    checkClass(class_data: {class_number: number}): boolean {
        return this.class_numbers.indexOf(class_data.class_number) > -1;
    }

    hasConflicts(class_data: {class_number: number, schedule: Schedule}): boolean {
        if (this.checkClass(class_data)) {
            return false;
        }

        // delaying a schedule condenser until later bc lets be honest it isnt actually going to check anything
        /*if (this.condensed_schedules.length < 5) { // build compressed schedule if not already 
            this.condensed_schedules = []
            for (let i = 0; i < 5; i++) {
                this.condensed_schedules.push([]);
            }
            for (let class_i = 0; class_i < this.class_numbers.length; class_i++) {
                for (let sched_i = 0; sched_i < this.class_numbers[class_i]; sched_i++) {
                    const days = ["M", "Tu", "W", "Th", "F"]
                    for (let day_i = 0; day_i < days.length; day_i++) {
                        //if ()
                    }
                }
            }
        } else {
            
        }*/

        for (let class_i = 0; class_i < this.class_numbers.length; class_i++) {
            for (let sched_i = 0; sched_i < this.class_numbers[class_i]; sched_i++) {
                const days = ["M", "Tu", "W", "Th", "F"]
                for (let day_i = 0; day_i < days.length; day_i++) {
                    if (days[day_i]) {

                    }
                }
            }
        }

        return true;
    }
}

class ScheduleBlock {
    startTime: number;
    endTime: number;

    constructor(startTime: number, endTime: number) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class ClassID {
    term: string;
    number: number;

    constructor(term: string, number: number) {
        this.term = term;
        this.number = number;
    }
}

class StateObject<T> {
    value: T | undefined;
    set: Function;

    constructor(defaultState: T | undefined) {
        [this.value, this.set] = useState(defaultState);
    }
}

const ScheduleManagerContext = createContext<ScheduleManager | null>(null);

export function ScheduleProvider(props: {children: ReactElement}) {
    let [status, setStatus] = useState<CacheState>(CacheState.Loading);
    let cachedClasses: Map<ClassID, StateObject<CachedClass>> = new Map;
    let [schedules, setSchedules] = useState<Array<Schedule>>();
    let refreshCache = false;
    // on change in schedule, request any new classes from the server

    useEffect(() => {
        // load schedules(lists of classes) from localstorage
        if (localStorage.getItem("schedules") != null) {
            setSchedules(JSON.parse(localStorage.getItem("schedules") as string));
            // load class cache from localstorage
            if (localStorage.getItem("classes") != null) {
                cachedClasses = new Map;
                JSON.parse(localStorage.getItem("classes") as string).forEach((element: CachedClass) => {
                    cachedClasses.set(new ClassID(element.term, element.classNumber), new StateObject<CachedClass>(element));
                })
            }
        }

        setStatus(CacheState.Cached);

        // simultaneously request schedules from server if user logged in (don't have that figured out yet lmaooooo)
    }, [])

    let classRequests: Array<GetCachedClassesQuery | undefined> = [];

    useEffect(() => {
        // request any new classes from the server
        let new_cache: Map<ClassID, StateObject<CachedClass>> = new Map;
        let classesToRequest: Map<string, Array<number>> = new Map; 

        function queueRequest(term: string, class_number: number) {
            if (classesToRequest.has(term)) { // if list has been generated for target semester, add it only if it isn't already there
                if (classesToRequest.get(term)?.includes(class_number)) {
                    classesToRequest.get(term)?.push(class_number);
                }
            } else { // if list has not been generated for target semester, create list with only the class number
                classesToRequest.set(term, [class_number]);
            }
        }

        if (schedules != undefined) {
            schedules.forEach(schedule => {
                schedule.class_numbers.forEach(element => {
                    let class_id = new ClassID(schedule.term, element) // make the class ID
                    if (!new_cache.has(class_id)){ // if not already in the new cache, take steps towards adding it to the cache
                        if (cachedClasses.has(class_id)) { // if in the old cache, just transfer it over
                            new_cache.set(class_id, cachedClasses.get(class_id) as StateObject<CachedClass>);
                            if (refreshCache) { // if told to refresh cache, request anyways
                                queueRequest(schedule.term, element);
                            }
                        } else { // if not in the old cache, mark it down to be requested
                            new_cache.set(class_id, new StateObject<CachedClass>(undefined));
                            setStatus(CacheState.Loading);
                            queueRequest(schedule.term, element);
                        }
                    }
                });
            });
            
            // after reviewing the whole schedule bullshit, go through the lists for each term and make sure to request a cached version of it

            classesToRequest.forEach((element: Array<number>, term: string) => {
                let query = gql(`
                    query GetCachedClasses($term: String!, $numbers: [Int!]) {
                        classes(term: $term, classNumbers: $numbers) {
                            classNumber,
                            classSection,
                            combinedSectionId,
                            component,
                            course {
                                attrs {
                                    label,
                                    value
                                },
                                code,
                                credits,
                                description,
                                title
                            },
                            enrollmentCap,
                            enrollmentTotal,
                            equivalents,
                            hours,
                            instructionType,
                            meetingDates,
                            schedules {
                                days,
                                endTime,
                                startTime,
                                location,
                                instructors {
                                    instructorType,
                                    name
                                }
                            },
                            term,
                            waitlistCap,
                            waitlistTotal
                        }
                    }`)
                    const {loading, data, error} = useQuery(query, {variables: {term: term, numbers: element}});
                    classRequests.push(data);
            });
        }
    }, [schedules, schedules?.map(({class_numbers}) => class_numbers)])

    useEffect(() => {
        let done = true;
        classRequests.forEach(request => {
            if (request && request.classes){
                request.classes.forEach(class_obj => {
                    cachedClasses.get(new ClassID(class_obj.term, class_obj.classNumber))?.set(class_obj);
                })
            } else {
                done = false;
            }
        });
        if (done) {
            setStatus(CacheState.Live);
        }
    }, classRequests);



    return (
        <>
            <ScheduleManagerContext.Provider value={new ScheduleManager(status, cachedClasses, schedules)}>
                {props.children}
            </ScheduleManagerContext.Provider>
        </>
    );
}

export class ScheduleManager {
    status: CacheState;
    cachedClasses: Map<ClassID, StateObject<CachedClass>>;
    schedules: Array<Schedule> | undefined;

    constructor(status: CacheState, cachedClasses: Map<ClassID, StateObject<CachedClass>>, schedules: Array<Schedule> | undefined) {
        this.status = status;
        this.cachedClasses = cachedClasses;
        this.schedules = schedules;
    }
}