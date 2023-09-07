'use client'

/* Core */
import { Provider } from 'react-redux'

/* Instruments */
import { reduxStore } from '@/lib/redux'
import { SessionProvider } from 'next-auth/react'
import { ScheduleProvider } from '../scheduleManager'
import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ThemeProvider, useTheme } from '@emotion/react'
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import { useState, useEffect } from 'react'

export const Providers = (props: React.PropsWithChildren) => {

    const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  
    useEffect(() => {
      async function init() {
        const cache = new InMemoryCache();
        let newPersistor = new CachePersistor({
          cache,
          storage: new LocalStorageWrapper(window.localStorage),
          debug: true,
          trigger: 'write',
        });
        await newPersistor.restore();
        setClient(
          new ApolloClient({
  
            uri: 'http://api.tarheelcompass.com/graphql',
            cache,
          }),
        );
      }
  
      init().catch(console.error);
    }, []);
    
  const theme = useTheme();

    if (!client) {
      return <h2>Initializing app...</h2>;
    }
  return (
    <Provider store={reduxStore}>
        <ScheduleProvider>
            <SessionProvider>
                <ApolloProvider client={client}>
                    <ThemeProvider theme={theme}>
                        {props.children}
                    </ThemeProvider>
                </ApolloProvider>
            </SessionProvider>
        </ScheduleProvider>
    </Provider>
  )
}