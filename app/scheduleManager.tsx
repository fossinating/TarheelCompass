import { ReactElement } from "react";

class ScheduleBlock {
    startTime: number;
    endTime: number;

    constructor(startTime: number, endTime: number) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

export function ScheduleProvider(props: {children: ReactElement}) {
    


    return (
        <>
            {props.children}
        </>
    );
}