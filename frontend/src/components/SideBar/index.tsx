import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import {
  HomeSharp,
  LabelImportant,
  LabelSharp,
  ArrowRightSharp,
  ArrowDropDownSharp,
} from "@material-ui/icons";
import ListItem from "@material-ui/core/ListItem";
import classes from "./index.module.scss";
import { Collapse, List, ListItemIcon, ListItemText } from "@material-ui/core";

type Props = {};

const SideBar: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const links = [
    { title: "Home", linkTo: "/", icon: <HomeSharp /> },
    { title: "Liftover", linkTo: "/liftover", icon: <LabelSharp /> },
    {
      title: "LD Structure",
      linkTo: "/ld_structure",
      icon: <LabelSharp />,
    },
    { title: "Imputation", linkTo: "/imputation", icon: <LabelSharp /> },
    {
      title: "Finemapping",
      linkTo: "/bayes_finemap",
      icon: <LabelSharp />,
      steps: [
        {
          title: "SuSie",
          linkTo: "/bayes_finemap/susie",
          icon: <LabelImportant />,
        },
        {
          title: "FineMap",
          linkTo: "/bayes_finemap/finemap",
          icon: <LabelImportant />,
        },
        {
          title: "Paintor",
          linkTo: "/bayes_finemap/paintor",
          icon: <LabelImportant />,
        },
      ],
    },
    { title: "Annotation", linkTo: "/annotation", icon: <LabelSharp /> },
    {
      title: "Deleteriousness",
      linkTo: "/deleteriousness",
      icon: <LabelSharp />,
    },
    { title: "Regulation", linkTo: "/regulation", icon: <LabelSharp /> },
  ];

  const renderItems = () => {
    return links.map((link, i) => {
      return (
        <Fragment key={link.title}>
          {link.steps ? (
            <ListItem button onClick={handleClick}>
              {/*<NavLink key={i} className={classes.link} to={link.linkTo}>*/}
              <ListItemIcon>{link.icon}</ListItemIcon>
              {/*</NavLink>*/}
              <ListItemText className={classes.text} secondary={"(bayesian)"}>
                {/*<NavLink*/}
                {/*  activeClassName={classes.selected}*/}
                {/*  exact*/}
                {/*  className={classes.link}*/}
                {/*  to={link.linkTo}*/}
                {/*>*/}
                {link.title}
                {/*</NavLink>*/}
              </ListItemText>
              {open ? <ArrowDropDownSharp /> : <ArrowRightSharp />}
            </ListItem>
          ) : (
            <ListItem button>
              {/*<NavLink key={i} className={classes.link} to={link.linkTo}>*/}
              <ListItemIcon className={classes.icon}>{link.icon}</ListItemIcon>
              {/*</NavLink>*/}
              <ListItemText
                className={classes.text}
                secondary={link.title === "Imputation" ? "(statistics)" : ""}
              >
                <NavLink
                  activeClassName={classes.selected}
                  exact
                  className={classes.link}
                  to={link.linkTo}
                >
                  {link.title}
                </NavLink>
              </ListItemText>
            </ListItem>
          )}
          {link.steps ? (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {link.steps.map((step, i) => (
                  <NavLink
                    key={`${step.title.replace(/\s/g, "")}${i}`}
                    className={classes.link}
                    to={step.linkTo}
                  >
                    <ListItem button className={classes.nested}>
                      <ListItemIcon>{step.icon}</ListItemIcon>
                      <ListItemText primary={step.title} />
                    </ListItem>
                  </NavLink>
                ))}
              </List>
            </Collapse>
          ) : null}
        </Fragment>
      );
    });
  };

  return <div className={classes.sidebar_link}>{renderItems()}</div>;
};

export default withRouter(SideBar);
