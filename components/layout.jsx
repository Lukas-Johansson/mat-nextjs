import Head from 'next/head';
import CookieConsent from 'react-cookie-consent';
import Footer from './footer';
import Header from './header';
import { useTranslation } from 'next-i18next';

export const siteTitle = 'Mat';

export default function Layout({ children }) {
    const { t } = useTranslation(['common']);

    return (
        <>
            <Head>
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-H5GZSB80BD"></script>
                <script async src="/javascript/ga.js"></script>
                <link
                    rel="preload"
                    href="https://use.typekit.net/yis5dme.css"
                    as="style"
                />
                <link
                    rel="preload"
                    href="/javascript/scrollhide.js"
                    as="script"
                />
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="Måltider" />
                <meta name="og:title" content={siteTitle} />
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://use.typekit.net/yis5dme.css"
                />
            </Head>
            <Header />
            {children}
            <Footer />
            <CookieConsent
                disableButtonStyles="true"
                buttonClasses="btn btn-consent d-flex align-items-center justify-content-center px-3 m-3"
                buttonText={t('common:cookie_consent')}
                contentClasses="pb-3">
                {t('common:cookie_text')}
            </CookieConsent>
            <script src="/javascript/scrollhide.js" defer />
        </>
    );
}
