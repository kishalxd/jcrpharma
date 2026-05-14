import React from "react";
import { Helmet } from "react-helmet-async";

function Candidates() {
  return (
    <>
      <Helmet>
        <title>Pharma Careers UK | JCR Pharma Candidates</title>
        <meta
          name="description"
          content="Find pharmaceutical career opportunities in the UK. JCR Pharma helps candidates connect with leading life sciences employers."
        />
      </Helmet>

      <div className="candidates-page">
        <h1>For Candidates</h1>

        <p>
          We support professionals looking to advance their careers in the pharmaceutical industry.
        </p>

        <h2>Popular Roles</h2>
        <ul>
          <li>Clinical Research Associate</li>
          <li>Biostatistician</li>
          <li>Clinical Data Manager</li>
          <li>Statistical Programmer</li>
          <li>Bioinformatician</li>
        </ul>

        <h2>How We Help</h2>
        <p>
          We match candidates with roles that fit their skills, experience, and long-term goals.
        </p>
      </div>
    </>
  );
}

export default Candidates;
