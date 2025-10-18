import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import PageTransition from './PageTransition';

const HomePage = lazy(() => import('../pages/HomePage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const JoinPage = lazy(() => import('../pages/JoinPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));

function MainLayout({ siteData, apiUrl }) {
  return (
    <>
      <Navigation />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage data={siteData.home} />} />
          <Route path="/projects" element={<ProjectsPage projects={siteData.projects} />} />
          <Route path="/about" element={<AboutPage data={siteData.about} />} />
          <Route path="/contact" element={<ContactPage data={siteData.contact} apiUrl={apiUrl} />} />
          <Route path="/join" element={<JoinPage data={siteData.join} apiUrl={apiUrl} />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </PageTransition>
      <Footer contact={siteData.contact} />
    </>
  );
}

export default MainLayout;

