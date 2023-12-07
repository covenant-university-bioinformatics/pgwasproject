import React from "react";
import Hero from "../../components/Hero";
import classes from "./index.module.scss";
// import MainArea from "../../components/MainArea";
import IndividualTools from "../../components/IndividualTools";
import CombinedTools from "../../components/CombinedTools";
type Props = {};

const Home: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.Home}>
      <Hero />
      {/*<MainArea />*/}
      <IndividualTools />
      <CombinedTools />
      <div
        style={{
          padding: "2rem 0",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div className={classes.container}>
          <h1
            style={{
              marginBottom: "1rem",
            }}
          >
            Citation
          </h1>
          <p>
            If you use this application in your research, please cite the
            following paper:
          </p>

          <p
            style={{
              textAlign: "justify",
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            Falola, O., Adam, Y., Ajayi, O., Kumuthini, J., Adewale, S., Mosaku,
            A., ... & Adebiyi, E. (2023). SysBiolPGWAS: simplifying post-GWAS
            analysis through the use of computational technologies and
            integration of diverse omics datasets. Bioinformatics, 39(1),
            btac791.
          </p>

          <p>
            <b>
              <a
                href="https://academic.oup.com/bioinformatics/article/39/1/btac791/6883906"
                target="_blank"
                rel="noopener noreferrer"
              >
                Oxford Bioinformatics Publication Link
              </a>
            </b>
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
