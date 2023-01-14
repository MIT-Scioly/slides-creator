import Slides from './components/Slides';
import CsvLoader from './components/csvLoader';
import {useState} from "react";

function App() {
  const [csvData, setCsvData] = useState(null);
  return (
    <div className="App">
        <CsvLoader setCsvData={setCsvData}/>
        <Slides csvData={csvData}/>
    </div>
  );
}

export default App;
