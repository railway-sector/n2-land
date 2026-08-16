/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useRef, useState, useEffect, memo, use } from "react";
import {
  thousands_separators,
  queryDefinitionExpression,
  fieldStatistic,
  useDateFields,
  toAsofdate,
} from "../query";
import {
  barangay_f,
  municipality_f,
  nlo_status_f,
  nlo_status_q,
  primaryLabelColor,
  valueLabelColor,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { lotLayer, nloLayer } from "../layers";
import { useQuery } from "@tanstack/react-query";
import type { ChartResponse } from "../interfaceKeys";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import ChartPieSeriesRender from "chart-pie-series-render";
import { FilterContext } from "../contexts/FilterContext";
import ChartPieSeries from "chart-pie-series";
import QueryExpressionLayers from "query-layers-expression";

//--------------------------//
//     useNloData     //
//--------------------------//
function useNloData(
  municipality: string,
  barangay: string,
  statusField: string,
  baseFilter: any,
) {
  return useQuery<ChartResponse | any>({
    queryKey: [municipality, barangay, statusField, nloLayer],
    queryFn: async () => {
      const q1 = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${nlo_status_f} >= 1`,
      });

      queryDefinitionExpression({
        queryExpression: q1.queryExpression(),
        featureLayer: [nloLayer],
      });

      const baseArgs = {
        layer: nloLayer,
        statisticField: "OBJECTID",
        statisticType: "count" as const,
      };

      const [chartData, totalNumber] = await Promise.all([
        new ChartPieSeries({
          ...baseArgs,
          where: q1.queryExpression(),
          statusList: nlo_status_q,
          statusField: nlo_status_f,
        }).pieSeries(),

        fieldStatistic({
          ...baseArgs,
          where: new QueryExpressionLayers({ ...baseFilter }).queryExpression(),
        }),
      ]);

      return { chartData, totalNumber, q1 };
    },
    staleTime: Infinity,
  });
}

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//
const ChartNlo = memo(() => {
  const { municipality, barangay } = use(FilterContext);

  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  //--- As of date
  //--- Initial date to display
  const { data: dateList } = useDateFields(lotLayer); // use lotLayer
  const latestDate = toAsofdate(dateList?.latestdate);

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
  const chartID = "nlo-chart";

  //--- Base filter
  const baseFilter = {
    qFields: [municipality_f, barangay_f],
    qValues: [municipality, barangay],
  };

  //--- Fetch data
  const { data, isLoading } = useNloData(
    municipality,
    barangay,
    nlo_status_f,
    baseFilter,
  );

  //--- Call chart data
  const chartData = data?.chartData || [];
  const totalNumber = data?.totalNumber || 0;

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    root.setThemes([]);
    const chart = chartSetter({ root: root, y: -10 });

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
    legend.setAll({ marginBottom: 30 });
    legend.data.setAll(pieSeries.dataItems);

    // Render chart
    new ChartPieSeriesRender({
      chart,
      pieSeries: pieSeries,
      legend,
      root,
      qChart: data?.q1,
      q2Expression: undefined,
      status_field: nlo_status_f,
      view: arcgisScene?.view,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      seriesScale: new_pieSeriesScale,
      innerLabel: "HOUSEHOLDS",
      innerLabelFontSize: new_pieInnerLabelFontSize,
      innerValueFontSize: new_pieInnerValueFontSize,
      layer: nloLayer,
      statusArray: nlo_status_q,
      bkg_color_switch: false,
      seriesFillHash: undefined,
    }).chartDataRenderer();

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
          style={{
            paddingTop: "5px",
            paddingLeft: "5px",
            opacity: isLoading ? 0 : 1,
          }}
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
          color: "gray",
          fontSize: `${new_asofDateSize}px`,
          float: "right",
          marginRight: "5px",
        }}
      >
        {latestDate ? `As of ${latestDate}` : `As of `}
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
