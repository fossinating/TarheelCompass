'use client';

import { useSession } from 'next-auth/react';
import * as React from 'react';
import { updateTerms, updateUserData, useDispatch } from './redux';

export const AppSetup = (props: React.PropsWithChildren) => {

    const { data: session, status } = useSession();

    const dispatch = useDispatch();

    // Things in here will be called once, after the providers for everything have been set up
    React.useEffect(() => {
        console.log("Status: ", status);
        if (status === "authenticated") {
            dispatch(updateUserData());
        }
    }, [status])
    
    React.useEffect(() => {
        dispatch(updateTerms())
    }, [])
    
    return (<>{props.children}</>);
}