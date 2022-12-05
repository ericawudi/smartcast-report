import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";

import { ValueScale, Animation } from "@devexpress/dx-react-chart";

import { sales as data } from "./graph-data";

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: data[2017],
    };
  }

  render() {
    const { data: chartData } = this.state;

    return (
      <Paper>
        <Chart data={chartData}>
          <ValueScale name="sale" />
          <ValueScale name="total" />

          <ArgumentAxis />
          <ValueAxis scaleName="sale" showGrid={false} showLine showTicks />
          <ValueAxis
            scaleName="total"
            position="right"
            showGrid={false}
            showLine
            showTicks
          />

          <BarSeries
            name="Units Sold"
            valueField="sale"
            argumentField="month"
            scaleName="sale"
          />

          <Animation />
          <Legend />
        </Chart>
      </Paper>
    );
  }
}
