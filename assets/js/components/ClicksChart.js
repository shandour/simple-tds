import React, { useEffect, useState, useRef } from "react";
import CanvasJSReact from "../canvas-react-js/canvasjs.react";

import { axios } from "../axios";
import { getStatsPerHour } from "./utils";
import { ErrorDiv } from "./FormComponents";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const baseOptions = {
  animationEnabled: true,
  zoomEnabled: true,
  title: {
    text: "Click statistics over the last 24 hours"
  },
  axisX: {
    title: "Hours",
    xValueFormatString: "HHHH"
  },
  axisY: {
    title: "Number of clicks"
  },
  data: [
    {
      xValueFormatString: "YYYY-MM-DD HH TT",
      type: "spline",
      dataPoints: []
    }
  ]
};

export default ({ link }) => {
  const chart = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [options, setOptions] = useState(baseOptions);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await axios.get(`links/${link}/stats/`);
      const optionsWithData = JSON.parse(JSON.stringify(baseOptions));
      optionsWithData.data[0].dataPoints = getStatsPerHour(
        resp.data.hourlyStats || []
      );
      setOptions(optionsWithData);
    } catch (e) {
      setError(
        "Network error. Check your Internet connection and try reloading the page."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (chart.current) {
      chart.current.scrollIntoView();
    }
  }, [chart.current]);

  if (loading) return null;

  return (
    <div>
      {!error ? (
        <div ref={chart}>
          <CanvasJSChart options={options} />
        </div>
      ) : (
        <ErrorDiv>{error}</ErrorDiv>
      )}
    </div>
  );
};
