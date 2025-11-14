import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import AuthProvider from '@/context/AuthProvider';
import '@/i18n/config';
import 'cesium/Build/Cesium/Widgets/widgets.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
