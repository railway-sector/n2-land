/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useRef, useState, useEffect, memo } from "react";
import * as am5 from "@amcharts/amcharts5";
import {
  thousands_separators,
  queryDefinitionExpression,
  dateUpdate,
  pieChartData,
  fieldStatistic,
} from "../query";
import {
  nloStatusField,
  primaryLabelColor,
  statusNloQuery,
  updatedDateCategoryNames,
  valueLabelColor,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { nloLayer, piechart_nlo, queryc_nlo } from "../layers";
import { chartRenderer } from "../chartRenderer";
import { useQuery } from "@tanstack/react-query";
import { locationKeys, dateDisplayKeys } from "../interfaceKeys";
import type {
  SelectedLocation,
  ChartResponse,
  DisplayDates,
} from "../interfaceKeys";
import {
  chartSetter,
  legendSetter,
  // maybeDisposeRoot,
  rootSetter,
  seriesSetter,
} from "../chartSetter";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//
const ChartNlo = memo(() => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  //--- 0. As of date
  const { data: newAsOfDate } = useQuery<DisplayDates | any>({
    queryKey: [dateDisplayKeys.selected, updatedDateCategoryNames[0]],
    queryFn: () => dateUpdate(updatedDateCategoryNames[2]),
    select: (response) => {
      return {
        asOfDate: response[0][0],
        daysPass: response[0][1],
      };
    },
    staleTime: Infinity,
  });

  //--- 1. Location state
  const { data: selectedLocation } = useQuery<SelectedLocation | any>({
    queryKey: locationKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const municipality = selectedLocation?.municipality;
  const barangay = selectedLocation?.barangay;

  //--- Chart parameters
  const new_fontSize = chartPanelwidth / 22.3;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.028;
  const new_pieSeriesScale = 280;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieInnerValueFontSize = "1.3rem";
  const new_pieInnerLabelFontSize = "0.7em";

  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "nlo-chart";

  //--- 2. Streamlined Data Fetching with useQuery
  const { data, isLoading } = useQuery<ChartResponse | any>({
    queryKey: [municipality, barangay, nloStatusField, nloLayer],
    queryFn: async () => {
      queryc_nlo.qValues = [municipality, barangay];
      queryc_nlo.qExpression = `${nloStatusField} >= 1`;

      queryDefinitionExpression({
        queryExpression: queryc_nlo.queryExpression(),
        featureLayer: [nloLayer],
      });

      //--- Pie chart data
      const chartData = await pieChartData({
        piechart: piechart_nlo,
        qChart: queryc_nlo,
        layer: nloLayer,
        statusList: statusNloQuery,
        statusField: nloStatusField,
        statisticField: nloStatusField,
        statisticType: "count",
      });

      const totaln = await fieldStatistic({
        qChart: queryc_nlo.queryExpression(),
        layer: nloLayer,
        statisticField: nloStatusField,
        statisticType: "count",
      });

      return {
        chartData: chartData[0] || [],
        totalNumber: totaln ?? 0,
      };
    },
    staleTime: Infinity,
  });

  //--- Call chart data
  const chartData = data?.chartData ?? [];
  const totalNumber = data?.totalNumber ?? 0;

  useEffect(() => {
    maybeDisposeRoot(chartID);
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root, y: -10 });
    chartRef.current = chart;

    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendLabelText: "{category}",
      legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
      radius: 45,
      innerRadius: 28,
      // scale: 1.7,
    });
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: 50,
      x: 50,
    });
    legendRef.current = legend;
    legend.data.setAll(pieSeries.dataItems);

    // Render chart
    chartRenderer({
      chart: chart,
      pieSeries: pieSeries,
      legend: legend,
      root: root,
      qChart: queryc_nlo,
      status_field: nloStatusField,
      view: arcgisScene?.view,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      seriesScale: new_pieSeriesScale,
      innerLabel: "HOUSEHOLDS",
      innerLabelFontSize: new_pieInnerLabelFontSize,
      innerValueFontSize: new_pieInnerValueFontSize,
      layer: nloLayer,
      statusArray: statusNloQuery,
    });

    return () => {
      root.dispose();
    };
  }, [chartID, chartData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          // marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/NLO_Logo.svg"
          alt="Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "5px", paddingLeft: "5px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              marginRight: "20px",
            }}
          >
            TOTAL HOUSEHOLDS
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              opacity: isLoading ? 0 : 1,
            }}
          >
            {thousands_separators(totalNumber)}
          </dd>
        </dl>
      </div>
      <div
        style={{
          color: newAsOfDate?.daysPass === true ? "red" : "gray",
          fontSize: `${new_asofDateSize}px`,
          float: "right",
          marginRight: "5px",
        }}
      >
        {!newAsOfDate?.asOfDate ? "" : "As of " + newAsOfDate?.asOfDate}
      </div>
      <div
        id={chartID}
        style={{
          height: "70vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          opacity: isLoading ? 0 : 1,
        }}
      ></div>
    </>
  );
}); // End of lotChartgs

export default ChartNlo;
