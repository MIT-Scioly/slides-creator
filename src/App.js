
import {useState} from "react";
import * as dfd from "danfojs";
import Slides from './components/Slides';


function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const changeHandler = (event) => {
    // console.log(event.target.files[0])
    setFile(event.target.files[0]);

  };

  const onUploadHandler = () => {
    dfd.readCSV(file).then((df) => {
      setData(df);
    })
  }
  const getTop10 = (df, event_name, top_num) => {
    if (df === null) {
      console.log("No data");
      return;
    }
    const p_df = df.loc({
      rows: df[event_name]
        .le(top_num)
    })
      .loc({columns: ["Team", event_name]})
      .sortValues(event_name)

    return p_df["Team"].values
  }

  function getEvents(df) {
    if (df === null) {
      console.log("No data");
      return;
    }
    const events = df.drop({columns: ["Team", "Team Penalties", "Total"]}).columns;
    return events;
  }

  function getAllEvents(df) {
    if (df === null) {
      console.log("No data");
      return;
    }
    const events = getEvents(df);
    const res = events.map((event) =>
      ({'Event': event, 'Rankings': getTop10(df, event, 10)})
    )
    console.log(res)
    return res
  }

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={changeHandler}

        />
        <button onClick={onUploadHandler}>Upload</button>
        <button onClick={() => getTop10(data, "Detector Building", 10)}>Top 10</button>
        <button onClick={() => getEvents(data)}>Events</button>
        <button onClick={() => getAllEvents(data)}>All Events</button>
        <Slides/>
      </header>
    </div>
  );
}

export default App;
