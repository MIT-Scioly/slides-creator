import {useState} from "react";
import * as dfd from "danfojs";

export default function CsvLoader({setCsvData, excludeText}) {
  const [file, setFile] = useState(null);
  const changeHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const onUploadHandler = async () => {
    return await dfd.readCSV(file);
  }
  const getTop = (df, event_name, top_num) => {
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
    // return df.columns;
    if (excludeText) {
      return df.columns.filter((item) => !excludeText.split(",").includes(item));
    } else {
      return df.drop({columns: ["Team", "Team Penalties", "Total"]}).columns;
    }
    // scioly stuff: ["Team ID", "Group", "w/o SoM", "SoM Rank", "Correct Final Score"]
  }

  async function getAllEvents() {
    const df = await onUploadHandler()
    const events = getEvents(df);
    const res = events.map((event) =>
      ({'Event': event, 'Rankings': getTop(df, event, 6)})
    )
    res.push(res.shift()); // moves 'Overall' to the end
    setCsvData(res);
    return res;
  }

  return (
    <div>
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={changeHandler}
      />
      <button onClick={getAllEvents}>Load all events</button>
    </div>
  );
}