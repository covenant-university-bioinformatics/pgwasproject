import React from "react";
import classes from "./index.module.scss";
type Props = {};

const ComingSoon: React.FC<Props> = (props) => {
  return (
    <div className={classes.SceneContainer}>
      <div className={classes.scene}>
        <div className={classes.cube}>
          <div
            className={[classes.cube__face, classes["cube__face--front"]].join(
              " "
            )}
          >
            Work in progress
          </div>
          <div
            className={[classes.cube__face, classes["cube__face--back"]].join(
              " "
            )}
          >
            Coming Soon...
          </div>
          <div
            className={[classes.cube__face, classes["cube__face--right"]].join(
              " "
            )}
          >
            <div className={classes.Logo}>
              Sysbiol<span>PGWAS</span>
            </div>
          </div>
          <div
            className={[classes.cube__face, classes["cube__face--left"]].join(
              " "
            )}
          >
            <div className={classes.Logo}>
              Sysbiol<span>PGWAS</span>
            </div>
          </div>
          <div
            className={[classes.cube__face, classes["cube__face--top"]].join(
              " "
            )}
          >
            &nbsp;
          </div>
          <div
            className={[classes.cube__face, classes["cube__face--bottom"]].join(
              " "
            )}
          >
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
