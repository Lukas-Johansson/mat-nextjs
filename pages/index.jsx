import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from 'swr';

import Layout, { siteTitle } from '../components/layout';
import Maybe from '../components/maybe';
import checkLogin from '../lib/utils/checklogin';
import storage from '../lib/utils/storage';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'glossary']))
    }
  };
}

export default function Home() {
  const { data: currentUser } = useSWR('user', storage);
  const isLoggedIn = checkLogin(currentUser);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: -400 },
    show: { opacity: 1, y: 0 }
  };

  const { t } = useTranslation('glossary');
  return (
    <Layout home>
      <Head>
        <title>{`${siteTitle} - ${t('common:index')}`}</title>
      </Head>
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="d-flex h-100 flex-column justify-content-center">
        <Maybe test={isLoggedIn}>
          <Link href="/meals">
            <motion.div variants={item} className="bg-meal meal pointer">
              <div className="container pt-5 pt-md-1">
                <h1 className="heroH1">{t('glossary:meal_plural')}</h1>
              </div>
      
            </motion.div>
          </Link>
          <Link href="/dishes">
            <motion.div variants={item} className="bg-dish dish pointer">
              <div className="container">
                <h1 className="heroH1">{t('glossary:dish_plural')}</h1>
              </div>
  
            </motion.div>
          </Link>
          <Link href="/profile">
            <motion.div variants={item} className="bg-profile profile pointer">
              <div className="container">
                <h1 className="heroH1">
                  {currentUser && currentUser.family
                    ? t('common:ourpage')
                    : t('common:mypage')}
                </h1>
              </div>
      
            </motion.div>
          </Link>
        </Maybe>
        <Maybe test={!isLoggedIn}>
          <motion.div variants={item} className="bg-meal meal">
            <div className="container py-5">
              <h1 className="heroH1-nolink pt-2">{t('glossary:meal_plural')}</h1>
              <p className="lead">{t('glossary:aboutmeals')}</p>
            </div>
          
          </motion.div>
          <motion.div variants={item} className="bg-dish dish">
            <div className="container py-5">
              <h1 className="heroH1-nolink">{t('glossary:dish_plural')}</h1>
              <p className="lead">{t('glossary:aboutdishes')}</p>
            </div>
         
          </motion.div>
          <Link href="/about">
            <motion.div variants={item} className="bg-about about pointer">
              <div className="container py-5 mb-md-3">
                <h1 className="heroH1">{t('common:about')}</h1>
                <p className="lead">
                  {t('glossary:aboutintro', {
                    brand: 'Måltidsmatloggen',
                    who: t('glossary:you')
                  })}
                </p>
              </div>
            </motion.div>
          </Link>
        </Maybe>
      </motion.main>
    </Layout>
  );
}
