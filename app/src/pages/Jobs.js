import React from "react";
import { Helmet } from "react-helmet-async";

function Jobs() {
  return (
    <>
      <Helmet>
        <title>Pharma Jobs UK | JCR Pharma Vacancies</title>
        <meta
          name="description"
          content="Browse pharmaceutical and life sciences job opportunities in the UK, including clinical research, biometrics, and data science roles."
        />
      </Helmet>

      <div className="jobs-page">
        <h1>Latest Pharmaceutical Jobs</h1>

        <p>
          Explore the latest opportunities in the pharmaceutical and life sciences industry.
        </p>

        <ul>
          <li>Clinical Research Associate (CRA)</li>
          <li>Biostatistician</li>
          <li>Clinical Data Manager</li>
          <li>Statistical Programmer</li>
          <li>Data Scientist (Life Sciences)</li>
        </ul>

        <p>
          New roles are updated regularly. Check back for the latest opportunities.
        </p>
      </div>
    </>
  );
}

export default Jobs;
