import { useEffect, useRef, useState } from "react";
import {
  thousands_separators,
  queryDefinitionExpression,
  dateUpdate,
  pieChartData,
} from "../query";
import "../index.css";
import {
  primaryLabelColor,
  statusStructureQuery,
  structureStatusField,
  updatedDateCategoryNames,
  valueLabelColor,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import {
  occupancyLayer,
  piechart_struc,
  queryc_struc,
  structureLayer,
} from "../layers";
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

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//
const ChartStructure = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  //--- 0. As of date
  const { data: newAsOfDate } = useQuery<DisplayDates | any>({
    queryKey: [dateDisplayKeys.selected, updatedDateCategoryNames[0]],
    queryFn: () => dateUpdate(updatedDateCategoryNames[1]),
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
  const new_imageSize = chartPanelwidth * 0.03;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieSeriesScale = 220;
  const new_pieInnerValueFontSize = "1.0rem";
  const new_pieInnerLabelFontSize = "0.45em";

  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "structure-chart";

  //--- 2. Streamlined Data Fetching with useQuery
  const { data } = useQuery<ChartResponse | any>({
    queryKey: [municipality, barangay, structureStatusField, structureLayer],
    queryFn: async () => {
      queryc_struc.qValues = [municipality, barangay];
      queryc_struc.qExpression = `${structureStatusField} >= 1`;

      queryDefinitionExpression({
        queryExpression: queryc_struc.queryExpression(),
        featureLayer: [structureLayer, occupancyLayer],
      });

      //--- Pie chart data
      const chartData = await pieChartData({
        piechart: piechart_struc,
        qChart: queryc_struc,
        layer: structureLayer,
        statusList: statusStructureQuery,
        statusField: structureStatusField,
        statisticField: structureStatusField,
        statisticType: "count",
      });

      return {
        chartData: chartData[0] || [],
        totalNumber: chartData[1],
      };
    },
    staleTime: Infinity,
  });

  //--- Call chart data
  const chartData = data?.chartData || [];
  const totalNumber = data?.totalNumber || 0;

  console.log(chartData);

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root });
    chartRef.current = chart;

    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendLabelText: "{category}",
      legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
      radius: 40,
      innerRadius: 28,
      // scale: 0.5,
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
      qChart: queryc_struc,
      status_field: structureStatusField,
      arcgisScene: arcgisScene,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      pieSeriesScale: new_pieSeriesScale,
      pieInnerLabel: "STRUCTURES",
      pieInnerLabelFontSize: new_pieInnerLabelFontSize,
      pieInnerValueFontSize: new_pieInnerValueFontSize,
      layer: structureLayer,
      statusArray: statusStructureQuery,
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
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/House_Logo.svg"
          alt="Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "2px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              marginRight: "25px",
            }}
          >
            TOTAL STRUCTURES
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
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

      {/* Structure Chart */}
      <div
        id={chartID}
        style={{
          height: "63vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          // marginBottom: "5%",
          marginTop: "11%",
        }}
      ></div>
    </>
  );
}; // End of lotChartgs

export default ChartStructure;
