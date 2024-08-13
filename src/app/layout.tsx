import * as React from 'react';
import App from './app';
import './Layout.css';
import { AppSetup } from './lib/AppSetup';
import { Providers } from './lib/Providers';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  

  return (
    <html lang="en">
      <head>
        <title>Tarheel Compass</title>
      </head>
      <body>
        <Providers>
          <AppSetup>
            <App>{children}</App>
          </AppSetup>
        </Providers>
      </body>
    </html>
  );
}