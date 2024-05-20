import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

export default function NumbersDistributionChart({
  numbersDist,
  title
}: {
  numbersDist: number[];
  title: string,
}): JSX.Element {
  const series = [
    {
      name: title,
      data: numbersDist,
    },
  ];

  const options: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    chart: {
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "min",
        "0.1",
        "0.2",
        "0.3",
        "0.4",
        "0.5",
        "0.6",
        "0.7",
        "0.8",
        "0.9",
        "max",
      ],
    },
    yaxis: {
      title: {
        text: title,
      },
    },
    theme: {
      mode: "dark",
    },
  };

  return (
    <ReactApexChart options={options} series={series} type="bar" height={150} />
  );
}
