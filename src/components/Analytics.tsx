import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function Analytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    // Initialize GA4
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);
  }, [measurementId]);

  return null;
} 