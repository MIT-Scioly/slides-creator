import Slides from './components/Slides';
import CsvLoader from './components/csvLoader';
import {useState} from "react";
import csv from './2019-nats-divc-results.csv';
import './App.css';

function App() {
  const [csvData, setCsvData] = useState(null);
  return (
    <div className="App">
      <p>Instructions</p>
      <ol>
        <li>Upload a csv file with format similar to <a href={csv}>this</a>.</li>
        <li>Click "Load all events" to load the csv file.</li>
        <li>Click "Sign in with Google" to authenticate.</li>
        <li>Either enter an existing presentation ID, or create a new presentation.</li>
        <li>Click "Generate Slides from CSV" to generate slides.</li>
      </ol>
      <CsvLoader setCsvData={setCsvData}/>
      <p>{csvData ? "Data loaded" : "No data yet"}</p>
      <Slides csvData={csvData}/>
    </div>
  );
}

export default App;
