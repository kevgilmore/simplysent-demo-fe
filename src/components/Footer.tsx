import React from 'react';
export function Footer() {
  return <footer className="mt-12 py-6 text-center text-gray-600 border-t border-gray-200">
      <p>
      We hope you enjoy our demo. The real app will be launching <b>soon</b> to the App Store. <br></br> For more details visit {' '}
        <a href="https://simplysent.co" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium">
          simplysent.co
        </a>
      </p>
    </footer>;
}