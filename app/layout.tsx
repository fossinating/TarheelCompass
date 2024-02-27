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
        <title>Tarheel Commpass</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4b9cd3" />
        <meta name="apple-mobile-web-app-title" content="Tarheel Compass" />
        <meta name="application-name" content="Tarheel Compass" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
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