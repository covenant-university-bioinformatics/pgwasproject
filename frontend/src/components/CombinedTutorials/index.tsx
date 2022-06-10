import React from "react";
import classes from "./index.module.scss";
import { ReactComponent as RunningAnalysisImage } from "../../resources/images/running_analysis.svg";
import { ReactComponent as ErrorImage } from "../../resources/images/errors.svg";

type Props = {};

const CombinedTutorials: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.Tutorial}>
      {/*<div className={classes.container}>*/}
      <div className={classes.header}>
        <div className={classes.container}>
          <h1>
            Tutorial on running a combined workflow analysis on SysBiol PGWAS{" "}
          </h1>
          <div className={classes.files}>
            <h3>Download Test File</h3>
            <p>
              <a
                rel="noreferrer"
                target="_blank"
                href="https://drive.google.com/file/d/1Sw_iseHNFG7gLVd3Fvt0yvFNEXChn6Qk/view?usp=sharing"
              >
                Brain volume
              </a>{" "}
              - This data includes summary statistics for Genome-wide
              meta-analysis of brain volume and identifies genomic loci and
              genes shared with intelligence from Jansen, Nagel et al., 2020.
            </p>
          </div>
        </div>
      </div>
      <div className={classes.register}>
        <h2 className={classes.heading}>
          Instructions on how to register on the application
        </h2>
        <div className={classes.container}>
          <p>Please check the individual tools tutorials page</p>
        </div>
      </div>
      <div className={classes.analysis}>
        <h2 className={classes.heading}>Running an analysis</h2>
        <div className={classes.container}>
          <div className={classes.image}>
            <RunningAnalysisImage className={classes.SVGIcon} />
          </div>
          <ul>
            <li>
              Please note that all analysis are executed with databases in
              genomic build hg19/GRcH37. Ensure your files are in the build
              version before continuing. You can also use the Liftover tool to
              convert your files.
            </li>
            <li>
              To run the combined workflow, either click on the workflow link on
              the navigation panel, or the red button 'Run workflow' button on
              the banner or 'click to start' link on the Executing workflow
              analysis section.
            </li>
            <li>
              Please spend a couple of minutes reading about the inner workings
              of the custom pipeline.
            </li>
            <li>
              On the sidebar navigation panel, click on create new job to view
              the form for starting a new job
            </li>
            <li>Fill in the job name.</li>
            <li>If you are not logged in, fill in your email</li>
            <li>
              Upload the files you want to use for the analysis (important! -
              please ensure your filename doesn't have illegal characters like
              spaces, braces etc!). Please it must also be a text file.
            </li>
            <li>
              In the next section, fill in the correct column number for the
              uploaded file. The column names in the uploaded file, should be
              the column numbers filled in the text boxes (This is very
              important because if incorrect numbers are selected, the analysis
              will be incorrect) The column numbers should start from one.
            </li>
            <li>
              Click on the drop down arrow to see the form for other sections.
            </li>
            <li>Enter or select other appropriate parameters.</li>
            <li>Submit a job by clicking on 'Execute Analysis'</li>
          </ul>
        </div>
      </div>

      <div className={classes.results}>
        <h2 className={classes.heading}>Viewing the results</h2>
        <div className={classes.result_list}>
          {/*<div className={classes.liftover}>*/}
          {/*<h3>Combined Workflow</h3>*/}
          <ul>
            <li>
              After clicking on the Execute Analysis button, you will be
              navigated to a result list if you are logged in and a result view
              if you are not logged in. That page will automatically reload
              until the job is complete.
            </li>
            <li>
              If you are not logged in, you will be navigated directly to the
              result view page. If it is a short job, please keep the link to
              this page. If it is a long job, an email will be sent to you. If
              you want us to save the jobs, please sign in.
            </li>
            <li>
              Please note the combined workflow service takes at least two hours
              and a couple of minutes to complete a job.
            </li>
            <li>
              You will see the status of the job, and some tables with
              information about your jobs.
            </li>
            <li>
              When the job is completed, scroll down to view the results. Use
              the download buttons to obtain results of your analysis.
            </li>
            <li>
              Please note: The combined workflow service can only run 1
              concurrent jobs per time due to limited cpu resources, these can
              cause other people's jobs to be queued for long if someone is
              running an analysis on a big file.
            </li>
          </ul>
          {/*</div>*/}
        </div>
      </div>

      <div className={classes.errors}>
        <h2 className={classes.heading}>Errors, Issues, Complaints</h2>
        <div className={classes.container}>
          <div className={classes.image}>
            <ErrorImage className={classes.SVGIcon} />
          </div>
          <ul>
            <li>
              If the Job fails, you will see some error information from the
              tool about what happened. Please send a snapshot to the email
              below on the errors. (Apologies, you might get a long text of
              errors information for now. We do this because the application is
              still in development and testing stage and full error information
              will be useful in debugging the application. This will be changed
              to a shorter message later).
            </li>
            <li>
              If you come across any others errors, bugs, or you have some
              complaints, please kindly document it, (text and snapshots) and
              email it to the email below. Also there is room for improvement in
              the application, please kindly send your comments to the email
              below.
            </li>
            <li>
              Email: dare.falola@covenantuniversity.edu.ng,
              yagoub.adam@covenantuniversity.edu.ng
            </li>
          </ul>
        </div>
      </div>
      {/*</div>*/}
    </div>
  );
};

export default CombinedTutorials;
