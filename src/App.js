import logo from './HnR-Logo.png';
import './App.css';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import CircularProgress from '@material-ui/core/CircularProgress';
const Plot = createPlotlyComponent(Plotly);
// const API = "https://emotional-intelligenze.herokuapp.com/api/analyze"
const API = "http://127.0.0.1:5000/api/analyze"
const test = require('./test.json')

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'omit', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function App() {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const onSubmit = async () => {
    let res = null;
    setLoading(true)
    try {
      res = await postData(API, { url })
      console.log(res)
      setData(res)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Grid container direction="column" spacing={6}>
        <Grid item>
          <div>Please enter the URL of the video you wish to analyze</div>
          <TextField label="URL" variant="outlined" onChange={e => setUrl(e.target.value)}></TextField>
          <Button variant="contained" color="primary"  onClick={() => onSubmit()}>Analyze</Button>
        </Grid>
        {
          loading ? <div><CircularProgress /></div>: null
        }
        <Grid item>
          { data && 
              Object.values(test).map(figure => {
                const jsonFormattedString = figure.replace(/\\/g, "");
                const final = JSON.parse(jsonFormattedString)
                return (
                  <Grid item>
                    <Plot data={final.data} layout={final.layout} />
                  </Grid>
                )
              })
          }
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
