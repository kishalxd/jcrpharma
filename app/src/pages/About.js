import React from "react";
import { Helmet } from "react-helmet-async";

function About() {
  return (
    <>
      <Helmet>
        <title>About JCR Pharma UK | Pharmaceutical Recruitment Specialists</title>
        <meta
          name="description"
          content="Learn about JCR Pharma, a UK-based pharmaceutical recruitment agency specialising in life sciences hiring across clinical, biometrics, and data roles."
        />
      </Helmet>

      <div className="about-page">
        <h1>About JCR Pharma</h1>

        <p>
          JCR Pharma is a specialist pharmaceutical recruitment agency based in the UK,
          supporting companies and candidates across the life sciences sector.
        </p>

        <h2>Our Mission</h2>
        <p>
          We aim to connect top-tier scientific and clinical talent with leading
          pharmaceutical and biotech organisations.
        </p>

        <h2>What We Specialise In</h2>
        <ul>
          <li>Clinical Research & Development</li>
          <li>Biostatistics & Biometrics</li>
          <li>Clinical Data Management</li>
          <li>Pharmaceutical & Life Sciences Roles</li>
        </ul>

        <h2>Our Approach</h2>
        <p>
          We focus on long-term partnerships, not transactions, ensuring the right
          fit for both employers and candidates.
        </p>
      </div>
    </>
  );
}

export default About;
