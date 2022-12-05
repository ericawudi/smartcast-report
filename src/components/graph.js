import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ArgumentAxis,
  BarSeries,
  Title,
  ValueAxis,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";

import { EventTracker, Animation } from "@devexpress/dx-react-chart";

function BarChartGraph({ data, duration }) {
  const [chartData, setData] = React.useState([]);
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    setData(data);
    setTitle("SMARTCAST VOTING REPORT" + duration);
  }, [data, duration]);

  return (
    <Paper>
      <Chart data={chartData}>
        <ArgumentAxis />
        <ValueAxis />
        <BarSeries valueField="votes" argumentField="participant_name" />
        <Title text={title} />
        <EventTracker />
        <Tooltip />
        <Animation />
      </Chart>
    </Paper>
  );
}

export default BarChartGraph;
