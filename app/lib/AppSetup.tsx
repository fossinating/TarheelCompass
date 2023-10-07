'use client';

import * as React from 'react';
import { updateUserData, useDispatch } from './redux';

export const AppSetup = (props: React.PropsWithChildren) => {

    const dispatch = useDispatch();

    // Things in here will be called once, after the providers for everything have been set up
    React.useEffect(() => {
        dispatch(updateUserData())
    }, [])
    
    return (<>{props.children}</>);
}