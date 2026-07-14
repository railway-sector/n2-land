import { use, useEffect, useRef, useState } from "react";
import {
  thousands_separators,
  queryDefinitionExpression,
  pieChartData,
  fieldStatistic,
  useDateFields,
  toAsofdate,
  makeQuery,
  PieChartRenderType,
} from "../query";
import "../index.css";
import {
  barangay_f,
  municipality_f,
  primaryLabelColor,
  str_status_f,
  str_status_q,
  valueLabelColor,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { lotLayer, occupancyLayer, structureLayer } from "../layers";
import { useQuery } from "@tanstack/react-query";
import type { ChartResponse } from "../interfaceKeys";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import ChartPieSeriesRender from "chart-pie-series-render";
import { MyContext } from "../contexts/MyContext";
import ChartPieSeries from "chart-pie-series";

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//
const ChartStructure = () => {
  const { municipality, barangay } = use(MyContext);

  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  //--- Initial date to display
  const { data: dateList } = useDateFields(lotLayer); // Use lotLayer
  const latestDate = toAsofdate(dateList?.latestdate);

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
  const chartID = "structure-chart";

  //--- Generate Chart data
  const qV = [municipality, barangay];
  const qF = [municipality_f, barangay_f];
  const queryc_struc = makeQuery(qV, qF, `${str_status_f} >= 1`);

  const { data, isLoading } = useQuery<ChartResponse | any>({
    queryKey: [municipality, barangay, str_status_f, structureLayer],
    queryFn: async () => {
      queryDefinitionExpression({
        queryExpression: queryc_struc.queryExpression(),
        featureLayer: [structureLayer, occupancyLayer],
      });

      //--- Pie chart data
      const chartData = await pieChartData({
        piechart: new ChartPieSeries(),
        qChart: queryc_struc,
        layer: structureLayer,
        statusList: str_status_q,
        statusField: str_status_f,
        statisticField: str_status_f,
        statisticType: "count",
      });

      const totaln = await fieldStatistic({
        qChart: queryc_struc.queryExpression(),
        layer: structureLayer,
        statisticField: str_status_f,
        statisticType: "count",
      });

      return {
        chartData: chartData[0] ?? [],
        totaln: totaln ?? 0,
      };
    },
    staleTime: Infinity,
  });

  //--- Call chart data
  const chartData = data?.chartData ?? [];
  const totaln = data?.totaln ?? 0;

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root });

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
    PieChartRenderType({
      render: new ChartPieSeriesRender(),
      chart,
      pieSeries: pieSeries,
      legend,
      root,
      qChart: queryc_struc,
      q2Expression: undefined,
      status_field: str_status_f,
      view: arcgisScene?.view,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      seriesScale: new_pieSeriesScale,
      innerLabel: "STRUCTURES",
      innerLabelFontSize: new_pieInnerLabelFontSize,
      innerValueFontSize: new_pieInnerValueFontSize,
      layer: structureLayer,
      statusArray: str_status_q,
      bkg_color_switch: false,
      seriesFillHash: undefined,
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
          style={{ paddingTop: "2px", opacity: isLoading ? 0 : 1 }}
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
              opacity: isLoading ? 0 : 1,
            }}
          >
            {thousands_separators(totaln)}
          </dd>
        </dl>
      </div>

      <div
        style={{
          color: "gray",
          fontSize: `${new_asofDateSize}px`,
          float: "right",
          marginRight: "5px",
        }}
      >
        {latestDate ? `As of ${latestDate}` : `As of `}
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
          opacity: isLoading ? 0 : 1,
        }}
      ></div>
    </>
  );
}; // End of lotChartgs

export default ChartStructure;
