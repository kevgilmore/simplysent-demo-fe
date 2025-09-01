import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
export function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.4
  }} className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium flex items-center mb-8">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-500 mb-8">Last Updated: June 1, 2023</p>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            At SimplySent, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website or use our AI Gift Finder
            service.
          </p>
          <p className="text-gray-700 mb-4">
            Please read this privacy policy carefully. If you do not agree with
            the terms of this privacy policy, please do not access the site.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            We collect information that you voluntarily provide to us when you
            use our AI Gift Finder, subscribe to our newsletter, or contact us.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Personal Data:</strong> When using our AI Gift Finder, we
            may ask for information about gift recipients, such as their age,
            interests, and preferences. This information is used solely to
            provide personalized gift recommendations.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Usage Data:</strong> We may also collect information on how
            the website is accessed and used. This usage data may include
            information such as your computer's IP address, browser type,
            browser version, the pages of our website that you visit, the time
            and date of your visit, the time spent on those pages, and other
            diagnostic data.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
            <li>Provide, operate, and maintain our website</li>
            <li>Generate personalized gift recommendations</li>
            <li>Improve, personalize, and expand our website and services</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you about updates, promotions, and news</li>
            <li>Send you emails and newsletters if you've subscribed</li>
            <li>Find and prevent fraud</li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to track activity
            on our website and store certain information. Cookies are files with
            a small amount of data which may include an anonymous unique
            identifier.
          </p>
          <p className="text-gray-700 mb-4">
            You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent. However, if you do not accept cookies,
            you may not be able to use some portions of our website.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Third-Party Disclosure
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your personally
            identifiable information to outside parties except as described
            below:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
            <li>
              <strong>Service Providers:</strong> We may share your information
              with third-party vendors, service providers, and other third
              parties who perform services on our behalf.
            </li>
            <li>
              <strong>Business Transfers:</strong> If SimplySent is involved in
              a merger, acquisition, or sale of assets, your information may be
              transferred as part of that transaction.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-700 mb-4">
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
            <li>
              The right to access the personal information we hold about you
            </li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your personal information</li>
            <li>
              The right to restrict or object to processing of your personal
              information
            </li>
            <li>The right to data portability</li>
          </ul>
          <p className="text-gray-700 mb-4">
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:hello@simplysent.co" className="text-purple-600 hover:text-purple-800">
              hello@simplysent.co
            </a>
            .
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date at the top of this page.
          </p>
          <p className="text-gray-700 mb-4">
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at{' '}
            <a href="mailto:hello@simplysent.co" className="text-purple-600 hover:text-purple-800">
              hello@simplysent.co
            </a>
            .
          </p>
        </div>
      </div>
    </motion.div>;
}