import React from "react";
import { Helmet } from "react-helmet-async";

function Employers() {
  return (
    <>
      <Helmet>
        <title>Hire Pharma Talent UK | JCR Pharma Employers</title>
        <meta
          name="description"
          content="Hire top pharmaceutical and life sciences professionals in the UK. JCR Pharma helps employers find skilled clinical and biometrics talent."
        />
      </Helmet>

      <div className="employers-page">
        <h1>For Employers</h1>

        <p>
          We help pharmaceutical and biotech companies hire top talent quickly and efficiently.
        </p>

        <h2>We Support Hiring For</h2>
        <ul>
          <li>Clinical Trials & Research Teams</li>
          <li>Biostatistics & Biometrics Teams</li>
          <li>Data Management & Programming</li>
          <li>Pharmaceutical Development Roles</li>
        </ul>

        <h2>Why Work With Us</h2>
        <p>
          We provide access to a highly specialised talent pool within life sciences
          and deliver tailored recruitment solutions.
        </p>
      </div>
    </>
  );
}

export default Employers;
