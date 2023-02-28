/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { compose, graphql, withApollo } from "react-apollo";
import logo from "../../assets/MP Logo no com.png";
import {
  createStyles,
  makeStyles,
  ThemeProvider,
  createTheme,
} from "@material-ui/core/styles";
import logo1 from "../../assets/MP Logo no com.png";

import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@material-ui/core";

import { updateSurveyEntries } from "../../graphql/mutations";
import { useLocation } from "react-router-dom";
import gql from "graphql-tag";

import { useState } from "react";
import { Button } from "aws-amplify-react";
import { getQuestionnaire, getSurveyEntries } from "../../graphql/queries";

const styles = {
  paperContainer: {
    backgroundRepeat: "no-repeat",
    backgroundImage: `url('https://basis.net/wp-content/uploads/2021/10/house_plant_home.jpeg')`,
    backgroundSize: "cover",
    minHeight: "100vh",
  },
};

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      maxWidth: 345,
    },
    media: {
      // object-fit is not supported by IE 11.
      objectFit: "cover",
    },
    table: {
      minWidth: 700,
    },
    progress: {
      margin: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(2),
      marginTop: 100,
    },
    custom: {
      margin: theme.spacing(3),
      textAlign: "center",
    },
    cont: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 100,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    logo: {
      maxWidth: 170,
      paddingTop: "15px",
      paddingBottom: "15px",
      paddingLeft: "10px",
    },
    loadCenter: {
      display: "flex",
      marginTop: "16rem",
      justifyContent: "center",
      alignItems: "center",
    },
    progressBar: {
      with: "20%",
    },
    text: {
      marginTop: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    img: {
      width: 100,
      height: 100,
    },
    textcolor: {
      // color: "#fafafa",
      // fontWeight: 800,
    },
  })
);
const theme = createTheme();

theme.typography.h3 = {
  fontSize: "1.2rem",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
    textAlign: "center",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

const shortSurvey = (props) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [isPostingResponse, setIsPostingResponse] = useState(false);

  const classes = useStyles();
  const {
    data: { loading, error, getSurveyEntries },
  } = props.getSurveyEntries;

  const [value, setValue] = useState(params?.get("rating"));

  // if (getSurveyEntries === null) {
  //   window.location.reload();
  // }
  const handleUpdateSurveyEntries = () => {
    props.onUpdateSurveyEntries({
      id: props?.match?.params?.surveyyEntryID,
      ratingRes: value,
    });
  };

  const handleSubmit = async (event) => {
    setIsPostingResponse(true);
    handleUpdateSurveyEntries();
    setIsPostingResponse(false);
    props.history.push(
      `/shortSurveyComplete/${getSurveyEntries?.questionnaireId} `
    );
  };

  const handleClick = (index) => {
    setValue(index + 1);
    handleSubmit();
  };

  if (isPostingResponse) {
    return (
      <div style={styles.paperContainer}>
        <AppBar position="sticky" style={{ backgroundColor: "#fff" }}>
          <Toolbar>
            <img src={logo1} alt="logo" className={classes.logo} />
          </Toolbar>
        </AppBar>
        <div className={classes.loadCenter}>
          <CircularProgress className={classes.progress} />
          <Typography variant="h5" component="h3">
            Posting Responses.Please wait...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.paperContainer}>
      <AppBar position="sticky" style={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <img src={logo} alt="logo" className={classes.logo} />
        </Toolbar>
      </AppBar>

      <div className={classes.cont}>
        <Typography component="legend" variant="h5">
          Rate our service?
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                left: "0px",
                top: "15%",
                fontSize: "13px",
              }}
            >
              Not at all likely
            </Box>
            <Box
              sx={{
                position: "absolute",
                right: "0px",
                top: "15%",
                fontSize: "13px",
              }}
            >
              Extremely likely
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "4px",
                mt: "40px",
              }}
            >
              {[...Array(10)].map((_, index) => (
                <Box
                  key={index + 1}
                  sx={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      value >= index + 1 ? "#bb1e1e" : "transparent",
                    boxShadow: "0px 2px 6px #ccc",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor:
                        value >= index + 1 ? "transparent" : "#bb1e1e",
                      "& ~ ": {
                        backgroundColor:
                          value >= index + 1 ? "#bb1e1e" : "#eee",
                      },
                    },
                  }}
                  onClick={() => handleClick(index)}
                >
                  {index + 1}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};
const SurveyQuestionComplite = compose(
  graphql(gql(updateSurveyEntries), {
    props: (props) => ({
      onUpdateSurveyEntries: (ip) => {
        props
          .mutate({
            variables: {
              input: ip,
            },
          })
          .then((data) => {
            //console.log(data)
          });
      },
    }),
  }),
  graphql(gql(getSurveyEntries), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: { id: props?.match?.params?.surveyyEntryID },
    }),
    props: (props) => {
      return {
        getSurveyEntries: props ? props : [],
      };
    },
  })
)(shortSurvey);

export default withApollo(SurveyQuestionComplite);
