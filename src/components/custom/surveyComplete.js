import React from "react";
import { compose, graphql, withApollo } from "react-apollo";
import logo from "../../assets/MP Logo no com.png";
import {
  createStyles,
  makeStyles,
  ThemeProvider,
  createTheme,
} from "@material-ui/core/styles";
import { getQuestionnaire } from "../../graphql/queries";
import { Typography, Box, AppBar, Toolbar } from "@material-ui/core";

import gql from "graphql-tag";

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
    button: {
      margin: theme.spacing(2),
    },
    logo: {
      maxWidth: 170,
      paddingTop: "15px",
      paddingBottom: "15px",
      paddingLeft: "10px",
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

const SurveyComplete = (props) => {
  const classes = useStyles();

  const {
    data: { loading, error, getQuestionnaire },
  } = props.getQuestionnaire;
  const text = getQuestionnaire?.endMsg;
  const linkify = (text) => {
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text?.replace(urlRegex, function (url) {
      return (
        '<a href="' + url + '" target="_blank" rel="noreferrer">' + url + "</a>"
      );
    });
  };
  return (
    <div style={styles.paperContainer}>
      <AppBar position="sticky" style={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <img src={logo} alt="logo" className={classes.logo} />
        </Toolbar>
      </AppBar>
      <div className={classes.text}>
        <Box
          sx={{ width: "300", height: "300", padding: "5px 40px" }}
          alignItems="center"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png"
              className={classes.img}
              alt="success"
            />
          </div>

          <ThemeProvider theme={theme}>
            <Typography variant="h3" className={classes.textcolor}>
              {/* Thank you for completing our survey. If you have requested a
              follow up,someone will be in touch with you soon. */}
              <a dangerouslySetInnerHTML={{ __html: linkify(text) }} />
            </Typography>
          </ThemeProvider>
        </Box>
      </div>
    </div>
  );
};
const SurveyQuestionComplite = compose(
  graphql(gql(getQuestionnaire), {
    options: (props) => ({
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables: { id: props.match.params.questionnaireID },
    }),
    props: (props) => {
      return {
        getQuestionnaire: props ? props : [],
      };
    },
  })
)(SurveyComplete);

export default withApollo(SurveyQuestionComplite);
