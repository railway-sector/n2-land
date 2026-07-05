import { useEffect, useRef, useState } from "react";
import {
  handedOverLotLayer,
  lotLayer,
  queryc_lot2,
  queryc_lot,
  queryc_lot3,
  piechart,
  piechartaa,
} from "../layers";
import {
  highlightLot,
  highlightRemove,
  thousands_separators,
  zoomToLayer,
  queryDefinitionExpression,
  pieChartData,
  fieldStatistic,
} from "../query";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-checkbox";
import {
  affectedAreaField,
  lotHandedOverAreaField,
  lotHandedOverField,
  lotIdField,
  lotStatusField,
  primaryLabelColor,
  querySuperUrgent,
  statusLotLabel,
  statusLotQuery,
  superurgent_items,
  valueLabelColor,
} from "../uniqueValues";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import { affectedAreaValue, chartRenderer } from "../chartRenderer";
import { useQuery } from "@tanstack/react-query";
import {
  timesliderFieldKeys,
  locationKeys,
  dateDisplayKeys,
  timesliderKeys,
} from "../interfaceKeys";
import type {
  SelectedLocation,
  TimesliderFieldsTypes,
  ChartResponse,
  DisplayDates,
  TimeSliderState,
} from "../interfaceKeys";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";

//--------------------------------------------//
//              Chart Component                //
//--------------------------------------------//
const ChartLot = () => {
  const arcgisScene = document.querySelector("arcgis-scene");

  //--- Declare useState
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [handedOverCheckBox, setHandedOverCheckBox] = useState<any>(false);
  const [superurgenttype, setSuperurgenttype] = useState<any>(
    superurgent_items[0],
  );

  //--- 0. As of date
  const { data: newAsOfDate } = useQuery<DisplayDates | any>({
    queryKey: dateDisplayKeys.selected,
    queryFn: async () => ({}),
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

  //--- Updated fields for timeslider
  const { data: newStates } = useQuery<TimesliderFieldsTypes | any>({
    queryKey: timesliderFieldKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const status_field = newStates?.statusdateField;
  const ho_field = newStates?.newHandedOverfield;
  const hoa_field = newStates?.newHandedoverAreafield;
  const aa_field = newStates?.newAffectedAreafield;

  //--- timeslider state
  const { data: time } = useQuery<TimeSliderState | any>({
    queryKey: timesliderKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const timesliderstate = time?.timesliderstate;

  //--- New status field by timeslider state
  const stats_field = timesliderstate ? status_field : lotStatusField;

  //--- 2. Streamlined Data Fetching with useQuery
  const { data, isLoading } = useQuery<ChartResponse | any>({
    queryKey: [
      municipality,
      barangay,
      superurgenttype,
      lotLayer,
      status_field,
      lotStatusField,
      timesliderstate, // Add dependecies so when these layers are changed, re-fetching happens.
    ],
    queryFn: async () => {
      const qSuperrugent_expression =
        superurgenttype === "OFF" ? undefined : querySuperUrgent;

      queryc_lot.qValues = [municipality, barangay];
      queryc_lot.q2Expression = qSuperrugent_expression;

      queryDefinitionExpression({
        queryExpression: queryc_lot.queryExpression(),
        featureLayer: [lotLayer, handedOverLotLayer],
      });

      //--- Pie chart data
      const chartData = await pieChartData({
        piechart: piechart,
        qChart: queryc_lot,
        layer: lotLayer,
        statusList: statusLotQuery,
        statusField: stats_field,
        statisticField: stats_field,
        statisticType: "count",
      });

      //--- total number of lots (public + private)
      const totaln = await fieldStatistic({
        qChart: queryc_lot.queryExpression(),
        layer: lotLayer,
        statisticField: lotIdField,
        statisticType: "count",
      });

      //-- Total affected area
      const total_affected_area = await fieldStatistic({
        qChart: queryc_lot.queryExpression(),
        layer: lotLayer,
        statisticField: timesliderstate ? aa_field : affectedAreaField,
        statisticType: "sum",
      });

      //--- Total handed-over area
      const total_ho_area = await fieldStatistic({
        qChart: queryc_lot.queryExpression(),
        layer: lotLayer,
        statisticField: timesliderstate ? hoa_field : lotHandedOverAreaField,
        statisticType: "sum",
      });

      //--- Total handed-over lots
      queryc_lot2.qValues = [municipality, barangay];
      queryc_lot2.qExpression = timesliderstate
        ? `${status_field} <> 8`
        : `${lotStatusField} <> 8`;
      queryc_lot2.q2Expression = qSuperrugent_expression;

      const total_ho_lot = await fieldStatistic({
        qChart: queryc_lot2.queryExpression(),
        layer: lotLayer,
        statisticField: timesliderstate ? ho_field : lotHandedOverField,
        statisticType: "sum",
      });

      //--- Affected area for each status
      queryc_lot3.qValues = [municipality, barangay];
      queryc_lot3.qExpression = timesliderstate
        ? `${status_field} >= 1`
        : `${lotStatusField} >= 1`;
      queryc_lot3.q2Expression = qSuperrugent_expression;

      const affected_area_pie = await pieChartData({
        piechart: piechartaa,
        qChart: queryc_lot3,
        layer: lotLayer,
        statusList: statusLotQuery,
        statusField: stats_field,
        statisticField: timesliderstate ? aa_field : affectedAreaField,
        statisticType: "sum",
      });

      //--- Handed-Over percent
      const handedover_percent = Number(
        ((total_ho_lot / totaln) * 100).toFixed(0),
      );

      if (!time?.timesliderstate) {
        zoomToLayer(lotLayer, arcgisScene);
      }

      return {
        chartData: chartData[0] ?? [],
        lotNumber: totaln,
        totalAffectedArea: total_affected_area,
        handedOverArea: total_ho_area,
        handedOverNumber: total_ho_lot,
        affectedAreaPie: affected_area_pie[0] ?? [],
        handedOverPercent: handedover_percent,
      };
    },
    // structuralSharing: false,
    // staleTime: Infinity, // for lot, turn if off. this always needs to be refetched.
    // Code below will stop rendering a chart during an initial loading.
    // This simply means enabling this useQuery when either municipality or barangay is true.
    // enabled: !!selectedLocation?.municipality || !!selectedLocation?.barangay,
  });
  //--- Call chart data
  const chartData = data?.chartData ?? [];
  const lotNumber = data?.lotNumber ?? 0;
  const totalAffectedArea = data?.totalAffectedArea ?? 0;
  const totalHandedOver = data?.handedOverNumber ?? 0;
  const totalHandedOverPercent = data?.handedOverPercent ?? 0;
  const totalHandedOverArea = data?.handedOverArea ?? 0;
  const affectedAreaStatus = data?.affectedAreaPie ?? [];

  //------------------------------------------------------------//
  //              Pie chart rendering declaration               //
  //------------------------------------------------------------//
  const new_fontSize = chartPanelwidth / 22.3;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.03;
  const new_sementedListSize = chartPanelwidth * 0.55;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieSeriesScale = 220;
  const new_pieInnerValueFontSize = "1.1rem";
  const new_pieInnerLabelFontSize = "0.45em";

  const pieSeriesRef = useRef<any>(null);
  const legendRef = useRef<any>(null);
  const chartRef = useRef<any>(null);

  // Define chart id
  const chartID = "pie-two";

  useEffect(() => {
    superurgenttype === superurgent_items[1]
      ? highlightLot(lotLayer, arcgisScene)
      : highlightRemove();
  }, [superurgenttype]);

  useEffect(() => {
    handedOverLotLayer.visible = handedOverCheckBox;
  }, [handedOverCheckBox]);

  //---  Pie Chart Renderer
  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root, y: 10 });
    chartRef.current = chart;

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

    // Render chart
    chartRenderer({
      chart: chart,
      pieSeries: pieSeries,
      legend: legend,
      root: root,
      qChart: queryc_lot,
      q2Expression: superurgenttype === "OFF" ? undefined : querySuperUrgent,
      status_field: stats_field,
      arcgisScene: arcgisScene,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      pieSeriesScale: new_pieSeriesScale,
      pieInnerLabel: "PRIVATE LOTS",
      pieInnerLabelFontSize: new_pieInnerLabelFontSize,
      pieInnerValueFontSize: new_pieInnerValueFontSize,
      layer: lotLayer,
      statusArray: statusLotQuery,
    });
    affectedAreaValue(legend, affectedAreaStatus, statusLotLabel);

    // Dispose root
    return () => {
      root.dispose();
    };
  }, [chartID, chartData, affectedAreaStatus]);

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
          marginBottom: "5px",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Land_logo.png"
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
            {thousands_separators(lotNumber)}
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
            {totalAffectedArea &&
              thousands_separators(totalAffectedArea.toFixed(0))}
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
            setSuperurgenttype(event.target.selectedItem.id)
          }
        >
          {superurgenttype &&
            superurgent_items.map((priority, index) => {
              return (
                <calcite-segmented-control-item
                  {...(superurgenttype === priority ? { checked: true } : {})}
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
          color: newAsOfDate?.daysPass === true ? "red" : "gray",
          fontSize: `${new_asofDateSize}px`,
          float: "right",
          marginRight: "5px",
          marginTop: "5px",
        }}
      >
        {!newAsOfDate?.asOfDate ? "" : "As of " + newAsOfDate?.asOfDate}
      </div>

      {/* Lot Chart */}
      <div
        id={chartID}
        style={{
          width: "100%",
          height: "57vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
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
          marginBottom: "10px",
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
            {totalHandedOverPercent}% ({thousands_separators(totalHandedOver)})
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
            {totalHandedOverArea &&
              thousands_separators(totalHandedOverArea.toFixed(0))}
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
