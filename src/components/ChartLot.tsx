import { use, useEffect, useRef, useState } from "react";
import { handedOverLotLayer, lotLayer } from "../layers";
import {
  highlightLot,
  highlightRemove,
  thousands_separators,
  zoomToLayer,
  queryDefinitionExpression,
  pieChartData,
  fieldStatistic,
  useDateFields,
  toAsofdate,
  makeQuery,
  PieChartRenderType,
} from "../query";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-checkbox";
import {
  lot_aa_f,
  lot_hoa_f,
  lot_ho_f,
  lot_id_f,
  lot_status_f,
  primaryLabelColor,
  lot_urgent_q,
  lot_status_q,
  lot_urgent_switch,
  valueLabelColor,
  municipality_f,
  barangay_f,
} from "../uniqueValues";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import { affectedAreaValue } from "../chartSetter";
import { useQuery } from "@tanstack/react-query";
import type { ChartResponse } from "../interfaceKeys";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import ChartPieSeriesRender from "chart-pie-series-render";
import ChartPieSeries from "chart-pie-series";
import { MyContext } from "../contexts/MyContext";

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//
const ChartLot = () => {
  const {
    asofdate,
    timesliderOn,
    newStatusField,
    newHoaField,
    newAfaField,
    newHoField,
    municipality,
    barangay,
  } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene");

  //--- Declare useState
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [handedOverCheckBox, setHandedOverCheckBox] = useState<any>(false);
  const [urgentType, setUrgentType] = useState<any>(lot_urgent_switch[0]);

  //--- Initial date to display
  const { data: dateList } = useDateFields(lotLayer);
  const latestDate = toAsofdate(dateList?.latestdate);

  //--- New status field by timeslider state
  const stats_field = timesliderOn ? newStatusField : lot_status_f;

  //--- Common qValues and qFields for QueryExpressionLayers class
  const qV = [municipality, barangay];
  const qF = [municipality_f, barangay_f];
  const urgent_qe = urgentType === "OFF" ? undefined : lot_urgent_q;

  const queryc_lot = makeQuery(qV, qF, undefined, urgent_qe);
  const queryc_lot2 = makeQuery(qV, qF, `${stats_field} <> 8`, urgent_qe);
  const queryc_lot3 = makeQuery(qV, qF, `${stats_field} >= 1`, urgent_qe);

  //--- 2. Streamlined Data Fetching with useQuery
  const { data, isLoading } = useQuery<ChartResponse | any>({
    queryKey: [
      urgentType,
      municipality,
      barangay,
      newStatusField,
      lot_status_f,
      lotLayer,
      timesliderOn,
    ],
    queryFn: async () => {
      queryDefinitionExpression({
        queryExpression: queryc_lot.queryExpression(),
        featureLayer: [lotLayer, handedOverLotLayer],
      });

      //--- Independent queries: run in parallel instead of sequentially
      const [
        chartData,
        totaln,
        total_affected_area,
        total_ho_area,
        total_ho_lot,
        affected_area_pie,
      ] = await Promise.all([
        //--- Chart data
        pieChartData({
          piechart: new ChartPieSeries(),
          qChart: queryc_lot,
          layer: lotLayer,
          statusList: lot_status_q,
          statusField: stats_field,
          statisticField: stats_field,
          statisticType: "count",
        }),

        //--- Total number of lots (public + private)
        fieldStatistic({
          qChart: queryc_lot.queryExpression(),
          layer: lotLayer,
          statisticField: lot_id_f,
          statisticType: "count",
        }),

        //--- Total affected area (m2)
        fieldStatistic({
          qChart: queryc_lot.queryExpression(),
          layer: lotLayer,
          statisticField: timesliderOn ? newAfaField : lot_aa_f,
          statisticType: "sum",
        }),

        //--- Total handed-over area (m2)
        fieldStatistic({
          qChart: queryc_lot.queryExpression(),
          layer: lotLayer,
          statisticField: timesliderOn ? newHoaField : lot_hoa_f,
          statisticType: "sum",
        }),

        //--- Total number of handed-over
        fieldStatistic({
          qChart: queryc_lot2.queryExpression(),
          layer: lotLayer,
          statisticField: timesliderOn ? newHoField : lot_ho_f,
          statisticType: "sum",
        }),

        //--- Affected are for each status
        pieChartData({
          piechart: new ChartPieSeries(),
          qChart: queryc_lot3,
          layer: lotLayer,
          statusList: lot_status_q,
          statusField: stats_field,
          statisticField: timesliderOn ? newAfaField : lot_aa_f,
          statisticType: "sum",
        }),
      ]);

      //--- Handed-Over percent
      const handedover_percent = Number(
        ((total_ho_lot / totaln) * 100).toFixed(0),
      );

      if (!timesliderOn) {
        zoomToLayer(lotLayer, arcgisScene);
      }

      return {
        chartData: chartData[0] || [],
        totaln: totaln,
        total_aa: total_affected_area,
        total_hoa: total_ho_area,
        total_ho: total_ho_lot,
        aa_pie: affected_area_pie[0] || [],
        total_hop: handedover_percent,
      };
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  //--- Call chart data
  const chartData = data?.chartData || [];
  const totaln = data?.totaln || 0;
  const total_aa = data?.total_aa || 0;
  const total_ho = data?.total_ho || 0;
  const total_hop = data?.total_hop || 0;
  const total_hoa = data?.total_hoa || 0;
  const aa_pie = data?.aa_pie || [];

  const new_fontSize = chartPanelwidth / 22.3;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.025;
  const new_sementedListSize = chartPanelwidth * 0.55;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieSeriesScale = 220;
  const new_pieInnerValueFontSize = "1.1rem";
  const new_pieInnerLabelFontSize = "0.45em";

  const pieSeriesRef = useRef<any>(null);
  const legendRef = useRef<any>(null);
  const chartID = "pie-two";

  useEffect(() => {
    urgentType === lot_urgent_switch[1]
      ? highlightLot(lotLayer, arcgisScene)
      : highlightRemove();
  }, [urgentType]);

  useEffect(() => {
    handedOverLotLayer.visible = handedOverCheckBox;
  }, [handedOverCheckBox]);

  //---  Pie Chart Renderer
  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root, y: 10 });

    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendLabelText:
        '{category}[/] ([#C9CC3F; bold]{valuePercentTotal.formatNumber("#.")}%[/]) ',
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
      scale: 1.0,
    });
    legendRef.current = legend;
    legend.setAll({ marginBottom: 10 });
    legend.data.setAll(pieSeries.dataItems);

    //--- Render Chart
    PieChartRenderType({
      render: new ChartPieSeriesRender(),
      chart,
      pieSeries: pieSeries,
      legend,
      root,
      qChart: queryc_lot,
      q2Expression: urgent_qe,
      status_field: stats_field,
      view: arcgisScene?.view,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      seriesScale: new_pieSeriesScale,
      innerLabel: "PRIVATE LOTS",
      innerLabelFontSize: new_pieInnerLabelFontSize,
      innerValueFontSize: new_pieInnerValueFontSize,
      layer: lotLayer,
      statusArray: lot_status_q,
      bkg_color_switch: false,
      seriesFillHash: undefined,
    });
    affectedAreaValue(
      legend,
      aa_pie,
      lot_status_q.map((f: any) => f.category),
    );

    // Dispose root
    return () => {
      root.dispose();
    };
  }, [chartID, chartData, aa_pie]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
        }}
      >
        <img
          src="https://eijigorilla.github.io/Symbols/Land_Acquisition/Land_Logo2.png"
          alt="Land Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "5px", paddingLeft: "5px" }}
        />
        <dl
          style={{
            alignItems: "center",
          }}
        >
          <dt
            style={{ color: primaryLabelColor, fontSize: `${new_fontSize}px` }}
          >
            Total Lots
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
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{ color: primaryLabelColor, fontSize: `${new_fontSize}px` }}
          >
            Total Affected Area
          </dt>
          {/* #d3d3d3 */}
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              fontWeight: "bold",
              opacity: isLoading ? 0 : 1,
            }}
          >
            {total_aa && thousands_separators(total_aa.toFixed(0))}
            <label
              style={{ fontWeight: "normal", fontSize: `${new_fontSize}px` }}
            >
              {" "}
              m
            </label>
            <label style={{ verticalAlign: "super", fontSize: "0.6rem" }}>
              2
            </label>
          </dd>
        </dl>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            marginLeft: "15px",
            fontSize: `${new_fontSize}px`,
            color: primaryLabelColor,
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: "10px",
          }}
        >
          Super Urgent Lot:{" "}
        </div>
        <calcite-segmented-control
          scale="s"
          width="full"
          style={{
            width: `${new_sementedListSize}px`,
            // marginRight: "80px",
            // marginTop: "auto",
            marginBottom: "auto",
          }}
          oncalciteSegmentedControlChange={(event: any) =>
            setUrgentType(event.target.selectedItem.id)
          }
        >
          {urgentType &&
            lot_urgent_switch.map((priority, index) => {
              return (
                <calcite-segmented-control-item
                  {...(urgentType === priority ? { checked: true } : {})}
                  key={index}
                  value={priority}
                  id={priority}
                >
                  {priority}
                </calcite-segmented-control-item>
              );
            })}
        </calcite-segmented-control>
      </div>

      <div
        style={{
          color: "gray",
          fontSize: `${new_asofDateSize}px`,
          float: "right",
          marginRight: "5px",
          marginTop: "5px",
          opacity: isLoading ? 0 : 1,
        }}
      >
        {asofdate ? `As of ${asofdate}` : `As of ${latestDate}`}
      </div>

      {/* Lot Chart */}
      <div
        id={chartID}
        style={{
          width: "100%",
          height: "57vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginTop: "2%",
          marginBottom: "1%",
          opacity: isLoading ? 0 : 1,
        }}
      ></div>

      {/* Handed-Over */}
      <div
        style={{
          display: "flex",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <div
          style={{
            backgroundColor: "green",
            height: "0",
            marginTop: "13px",
            marginRight: "-10px",
          }}
        >
          <calcite-checkbox
            name="handover-checkbox"
            label="VIEW"
            scale="l"
            oncalciteCheckboxChange={() =>
              setHandedOverCheckBox(handedOverCheckBox === false ? true : false)
            }
          ></calcite-checkbox>
        </div>
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{ color: primaryLabelColor, fontSize: `${new_fontSize}px` }}
          >
            Total Handed-Over
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
            {total_hop}% ({thousands_separators(total_ho)})
          </dd>
        </dl>
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{ color: primaryLabelColor, fontSize: `${new_fontSize}px` }}
          >
            Handed-Over Area
          </dt>
          {/* #d3d3d3 */}
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              fontWeight: "bold",
              opacity: isLoading ? 0 : 1,
            }}
          >
            {total_hoa && thousands_separators(total_hoa.toFixed(0))}
            <label
              style={{ fontWeight: "normal", fontSize: `${new_fontSize}px` }}
            >
              {" "}
              m
            </label>
            <label style={{ verticalAlign: "super", fontSize: "0.6rem" }}>
              2
            </label>
          </dd>
        </dl>
      </div>
    </>
  );
}; // End of lotChartgs

export default ChartLot;
