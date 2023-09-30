import './Layout.css';
import * as React from 'react';
import { Providers } from './lib/Providers';
import App from './app';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  

  return (
    <html lang="en">
      <head>
        <title>Course Manager</title>
      </head>
      <body>
        <Providers>
          <App>{children}</App>
        </Providers>
      </body>
    </html>
  );
}