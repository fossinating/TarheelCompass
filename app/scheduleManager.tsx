import { useSession } from "next-auth/react";
import { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadData, ReduxDispatch, updateSchedules } from "./lib/redux";

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