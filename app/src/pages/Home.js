import React from "react";
import { Helmet } from "react-helmet-async";

function Home() {
  return (
    <>
      <Helmet>
        <title>Pharma Recruitment UK | JCR Pharma</title>
        <meta
          name="description"
          content="JCR Pharma is a specialist pharmaceutical recruitment agency in the UK, connecting top talent with leading life science employers."
        />
      </Helmet>

      <div className="home-page">
        <section className="hero">
          <h1>Welcome to JCR Pharma</h1>
          <p>
            Specialist pharmaceutical recruitment connecting top talent with
            leading UK life science companies.
          </p>
        </section>

        <section className="services">
          <h2>What We Do</h2>
          <ul>
            <li>Pharmaceutical Recruitment</li>
            <li>Life Sciences Hiring Solutions</li>
            <li>Permanent & Contract Roles</li>
            <li>Employer Talent Matching</li>
          </ul>
        </section>

        <section className="cta">
          <h2>Looking for a Job or Talent?</h2>
          <p>
            Explore opportunities or hire skilled professionals in the pharmaceutical industry.
          </p>
        </section>
      </div>
    </>
  );
}

export default Home;
