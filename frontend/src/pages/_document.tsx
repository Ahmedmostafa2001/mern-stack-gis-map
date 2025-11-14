// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://cesium.com/downloads/cesiumjs/releases/1.134/Build/Cesium/Widgets/widgets.css"
        />
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  );
}
