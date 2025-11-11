import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
export function TermsOfServicePage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -20,
            }}
            transition={{
                duration: 0.4,
            }}
            className="max-w-4xl mx-auto py-8 px-4"
        >
            <Link
                to="/"
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center mb-8"
            >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Home
            </Link>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Terms of Service
                </h1>
                <p className="text-gray-500 mb-8">Last Updated: June 1, 2023</p>
                <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">
                        Please read these Terms of Service ("Terms", "Terms of
                        Service") carefully before using the SimplySent website
                        and AI Gift Finder service operated by SimplySent ("us",
                        "we", or "our").
                    </p>
                    <p className="text-gray-700 mb-4">
                        Your access to and use of the Service is conditioned on
                        your acceptance of and compliance with these Terms.
                        These Terms apply to all visitors, users, and others who
                        access or use the Service.
                    </p>
                    <p className="text-gray-700 mb-6">
                        By accessing or using the Service you agree to be bound
                        by these Terms. If you disagree with any part of the
                        terms, you may not access the Service.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Use of Service
                    </h2>
                    <p className="text-gray-700 mb-4">
                        SimplySent provides an AI-powered gift recommendation
                        service. Our service is designed to help users find
                        appropriate gifts based on information provided about
                        the recipient and occasion.
                    </p>
                    <p className="text-gray-700 mb-4">
                        You agree to use the Service only for lawful purposes
                        and in accordance with these Terms. You agree not to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                        <li>
                            Use the Service in any way that violates any
                            applicable national or international law or
                            regulation
                        </li>
                        <li>
                            Use the Service for the purpose of exploiting,
                            harming, or attempting to exploit or harm minors
                        </li>
                        <li>
                            Attempt to gain unauthorized access to our servers
                            or any part of the Service
                        </li>
                        <li>
                            Interfere with or disrupt the Service or servers or
                            networks connected to the Service
                        </li>
                        <li>
                            Collect or track the personal information of others
                        </li>
                        <li>
                            Impersonate or attempt to impersonate SimplySent, a
                            SimplySent employee, another user, or any other
                            person or entity
                        </li>
                        <li>
                            Engage in any other conduct that restricts or
                            inhibits anyone's use or enjoyment of the Service
                        </li>
                    </ul>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Affiliate Disclosure
                    </h2>
                    <p className="text-gray-700 mb-4">
                        SimplySent is a participant in the Amazon Services LLC
                        Associates Program, an affiliate advertising program
                        designed to provide a means for sites to earn
                        advertising fees by advertising and linking to
                        Amazon.com.
                    </p>
                    <p className="text-gray-700 mb-4">
                        As an Amazon Associate, we earn from qualifying
                        purchases. This means that when you click on links to
                        products on Amazon from our website and make a purchase,
                        we receive a small commission at no additional cost to
                        you.
                    </p>
                    <p className="text-gray-700 mb-4">
                        We only recommend products that we believe will be of
                        value to our users. However, we cannot guarantee that
                        all products will meet your expectations or needs.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Intellectual Property
                    </h2>
                    <p className="text-gray-700 mb-4">
                        The Service and its original content, features, and
                        functionality are and will remain the exclusive property
                        of SimplySent and its licensors. The Service is
                        protected by copyright, trademark, and other laws of
                        both the United States and foreign countries.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Our trademarks and trade dress may not be used in
                        connection with any product or service without the prior
                        written consent of SimplySent.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Limitation of Liability
                    </h2>
                    <p className="text-gray-700 mb-4">
                        In no event shall SimplySent, nor its directors,
                        employees, partners, agents, suppliers, or affiliates,
                        be liable for any indirect, incidental, special,
                        consequential or punitive damages, including without
                        limitation, loss of profits, data, use, goodwill, or
                        other intangible losses, resulting from:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                        <li>
                            Your access to or use of or inability to access or
                            use the Service
                        </li>
                        <li>
                            Any conduct or content of any third party on the
                            Service
                        </li>
                        <li>Any content obtained from the Service</li>
                        <li>
                            Unauthorized access, use or alteration of your
                            transmissions or content
                        </li>
                        <li>
                            The quality, appropriateness, or satisfaction with
                            products purchased based on our recommendations
                        </li>
                    </ul>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Disclaimer
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Your use of the Service is at your sole risk. The
                        Service is provided on an "AS IS" and "AS AVAILABLE"
                        basis. The Service is provided without warranties of any
                        kind, whether express or implied, including, but not
                        limited to, implied warranties of merchantability,
                        fitness for a particular purpose, non-infringement, or
                        course of performance.
                    </p>
                    <p className="text-gray-700 mb-4">
                        SimplySent does not warrant that the Service will be
                        uninterrupted, timely, secure, or error-free, or that
                        any defects will be corrected. We do not warrant that
                        the results that may be obtained from the use of the
                        Service will be accurate or reliable.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Changes
                    </h2>
                    <p className="text-gray-700 mb-4">
                        We reserve the right, at our sole discretion, to modify
                        or replace these Terms at any time. If a revision is
                        material, we will try to provide at least 30 days'
                        notice prior to any new terms taking effect. What
                        constitutes a material change will be determined at our
                        sole discretion.
                    </p>
                    <p className="text-gray-700 mb-4">
                        By continuing to access or use our Service after those
                        revisions become effective, you agree to be bound by the
                        revised terms. If you do not agree to the new terms,
                        please stop using the Service.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Governing Law
                    </h2>
                    <p className="text-gray-700 mb-4">
                        These Terms shall be governed and construed in
                        accordance with the laws of the United Kingdom, without
                        regard to its conflict of law provisions.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Our failure to enforce any right or provision of these
                        Terms will not be considered a waiver of those rights.
                        If any provision of these Terms is held to be invalid or
                        unenforceable by a court, the remaining provisions of
                        these Terms will remain in effect.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Contact Us
                    </h2>
                    <p className="text-gray-700 mb-4">
                        If you have any questions about these Terms, please
                        contact us at{" "}
                        <a
                            href="mailto:hello@simplysent.co"
                            className="text-purple-600 hover:text-purple-800"
                        >
                            hello@simplysent.co
                        </a>
                        .
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
