import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import {
  HomeSharp,
  LabelSharp,
  ArrowRightSharp,
  ArrowDropDownSharp,
  ChevronLeft,
} from "@material-ui/icons";
import ListItem from "@material-ui/core/ListItem";
import classes from "./index.module.scss";
import {
  Collapse,
  Divider,
  Hidden,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";

type Props = {};

const SideBar: React.FC<Props> = (props) => {
  const { setMini } = useActions();
  const { miniSidebar } = useTypedSelector((state) => state.ui);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const links: {
    title: string;
    linkTo: string;
    icon: any;
    steps?: { title: string; linkTo: string; icon: any }[];
  }[] = [
    // { title: "Home", linkTo: "/tools", icon: <HomeSharp /> },
    { title: "Liftover", linkTo: "/tools/liftover", icon: <LabelSharp /> },
    {
      title: "LD Structure",
      linkTo: "/tools/ldstructure",
      icon: <LabelSharp />,
    },
    { title: "Imputation", linkTo: "/tools/imputation", icon: <LabelSharp /> },
    // {
    //   title: "Finemapping",
    //   linkTo: "/tools/bayes_finemap",
    //   icon: <LabelSharp />,
    //   steps: [
    //     {
    //       title: "SuSie",
    //       linkTo: "/tools/bayes_susie",
    //       icon: <LabelImportant />,
    //     },
    //     {
    //       title: "FineMap",
    //       linkTo: "/tools/bayes_finemap",
    //       icon: <LabelImportant />,
    //     },
    //     {
    //       title: "Paintor",
    //       linkTo: "/tools/bayes_paintor",
    //       icon: <LabelImportant />,
    //     },
    //   ],
    // },
    // { title: "SuSie", linkTo: "/tools/bayes_susie", icon: <LabelSharp /> },
    {
      title: "Bayes FineMap",
      linkTo: "/tools/bayes_finemap",
      icon: <LabelSharp />,
    },
    { title: "ZScore", linkTo: "/tools/zscore", icon: <LabelSharp /> },
    { title: "Annotation", linkTo: "/tools/annotation", icon: <LabelSharp /> },
    {
      title: "Deleteriousness",
      linkTo: "/tools/deleteriousness",
      icon: <LabelSharp />,
    },
    { title: "EQTL(SMR/HEIDI)", linkTo: "/tools/eqtl", icon: <LabelSharp /> },
    {
      title: "EQTL Plot(SMR/HEIDI)",
      linkTo: "/tools/eqtlplot",
      icon: <LabelSharp />,
    },
    { title: "EQTL-Coloc", linkTo: "/tools/eqtlcoloc", icon: <LabelSharp /> },
    {
      title: "Gene-Based Analysis",
      linkTo: "/tools/genebased",
      icon: <LabelSharp />,
    },
    {
      title: "Pathway-Based Analysis",
      linkTo: "/tools/pathwaybased",
      icon: <LabelSharp />,
    },
    {
      title: "Regulation",
      linkTo: "/tools/regulationhaplor",
      icon: <LabelSharp />,
    },
  ];

  const renderItems = () => {
    return links.map((link, i) => {
      return (
        <Fragment key={link.title}>
          {link.steps ? (
            <ListItem
              onClick={() => {
                handleClick();
              }}
              button
              className={classes.list}
            >
              <Hidden mdDown>
                <ListItemIcon>{link.icon}</ListItemIcon>
              </Hidden>
              <ListItemText className={classes.text} secondary={"(bayesian)"}>
                {link.title}
              </ListItemText>
              {open ? <ArrowDropDownSharp /> : <ArrowRightSharp />}
            </ListItem>
          ) : (
            <ListItem
              onClick={() => {
                if (miniSidebar) {
                  setMini(false);
                }
              }}
              button
              className={classes.list}
            >
              <Hidden mdDown implementation={"css"}>
                <ListItemIcon className={classes.icon}>
                  {link.icon}
                </ListItemIcon>
              </Hidden>
              <ListItemText
                className={classes.text}
                secondary={link.title === "Imputation" ? "(statistics)" : ""}
              >
                <NavLink
                  activeClassName={classes.selected}
                  // exact
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
                    activeClassName={classes.selected}
                    key={`${step.title.replace(/\s/g, "")}${i}`}
                    className={classes.link}
                    to={step.linkTo}
                  >
                    <ListItem
                      onClick={() => {
                        if (miniSidebar) {
                          setMini(false);
                        }
                      }}
                      button
                      className={classes.nested}
                    >
                      <Hidden mdDown>
                        <ListItemIcon>{step.icon}</ListItemIcon>
                      </Hidden>
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

  return (
    <div className={classes.sidebar_link}>
      <div className={classes.drawerHeader}>
        <IconButton
          onClick={() => {
            setMini(!miniSidebar);
          }}
        >
          {/*{miniSidebar ? <ChevronRight /> : <ChevronLeft />}*/}
          {miniSidebar ? <ChevronLeft /> : null}
        </IconButton>
      </div>
      <Divider />
      <ListItem
        onClick={() => {
          if (miniSidebar) {
            setMini(false);
          }
        }}
        button
        className={classes.list}
      >
        <Hidden mdDown implementation={"css"}>
          <ListItemIcon className={classes.icon}>
            <HomeSharp />
          </ListItemIcon>
        </Hidden>
        <ListItemText className={classes.text}>
          <NavLink
            activeClassName={classes.selected}
            exact
            className={classes.link}
            to={"/tools"}
          >
            Tools Home
          </NavLink>
        </ListItemText>
      </ListItem>
      {renderItems()}
    </div>
  );
};

export default withRouter(SideBar);
