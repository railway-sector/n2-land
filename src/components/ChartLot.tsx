import { use, useEffect, useMemo, useRef, useState } from "react";
import { handedOverLotLayer, lotLayer } from "../layers";
import {
  highlightLot,
  highlightRemove,
  thousands_separators,
  zoomToLayer,
  queryDefinitionExpression,
  fieldStatistic,
  useDateFields,
  toAsofdate,
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
  lot_urgent_q,
  lot_status_q,
  lot_urgent_switch,
  municipality_f,
  barangay_f,
  labelColor,
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
import { TimesliderContext } from "../contexts/TimesliderContext";
import { FilterContext } from "../contexts/FilterContext";
import QueryExpressionLayers from "query-layers-expression";
import StatBlock from "./statBlock";

//--------------------------//
//      useLotData          //
//--------------------------//

function useLotData(
  municipality: string,
  barangay: string,
  statusField: string,
  hoaField: string,
  afaField: string,
  hoField: string,
  baseFilter: any,
  urgentQuery: any,
  lot_status_q2: any,
) {
  return useQuery<ChartResponse | any>({
    queryKey: [
      municipality,
      barangay,
      statusField,
      hoaField,
      afaField,
      hoField,
      urgentQuery,
    ],
    queryFn: async () => {
      const q1 = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: undefined,
        q2Expression: urgentQuery,
      });
      const q2 = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${statusField} <> 8`,
        q2Expression: urgentQuery,
      });
      const q3 = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${statusField} >= 1`,
        q2Expression: urgentQuery,
      });

      queryDefinitionExpression({
        queryExpression: q1.queryExpression(),
        featureLayer: [lotLayer, handedOverLotLayer],
      });

      //--- Independent queries: run in parallel instead of sequentially
      const sharedArgs = { where: q1.queryExpression(), layer: lotLayer };

      const [
        chartData,
        totalNumber,
        affectedArea,
        handedOverArea,
        handedOverNumber,
        affectedAreaStatus,
      ] = await Promise.all([
        new ChartPieSeries({
          ...sharedArgs,
          statusList: lot_status_q2,
          statusField: statusField,
          statisticField: statusField,
          statisticType: "count",
        }).pieSeries(),

        //--- Total number of lots (public + private)
        fieldStatistic({
          ...sharedArgs,
          statisticField: lot_id_f,
          statisticType: "count",
        }),

        //--- Total affected area (m2)
        fieldStatistic({
          ...sharedArgs,
          statisticField: afaField,
          statisticType: "sum",
        }),

        //--- Total handed-over area (m2)
        fieldStatistic({
          ...sharedArgs,
          statisticType: "sum",
          statisticField: hoaField,
        }),

        //--- Total number of handed-over
        fieldStatistic({
          where: q2.queryExpression(),
          layer: lotLayer,
          statisticField: hoField,
          statisticType: "sum",
        }),

        //--- Affected are for each status
        new ChartPieSeries({
          where: q3.queryExpression(),
          layer: lotLayer,
          statusList: lot_status_q2,
          statusField: statusField,
          statisticField: afaField,
          statisticType: "sum",
        }).pieSeries(),
      ]);

      //--- Handed-Over percent
      const handedOverPercent = Number(
        ((handedOverNumber / totalNumber) * 100).toFixed(0),
      );

      return {
        chartData,
        totalNumber,
        affectedArea,
        handedOverArea,
        handedOverNumber,
        affectedAreaStatus,
        handedOverPercent,
        query: q1,
      };
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

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
  } = use(TimesliderContext);
  const { municipality, barangay } = use(FilterContext);
  const arcgisScene = document.querySelector("arcgis-scene") as any;

  //--- Declare useState
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [handedOverCheckBox, setHandedOverCheckBox] = useState<any>(false);
  const [urgentType, setUrgentType] = useState<any>(lot_urgent_switch[0]);

  const lot_status_q2 = lot_status_q.map((item) =>
    item.value === 6 ? { ...item, category: "With CNO" } : item,
  );

  //--- Initial date to display
  const { data: dateList } = useDateFields(lotLayer);
  const latestDate = toAsofdate(dateList?.latestdate);

  //--- Base filter
  const baseFilter = useMemo(
    () => ({
      qFields: [municipality_f, barangay_f],
      qValues: [municipality, barangay],
    }),
    [municipality, barangay],
  );

  const urgent_qe = urgentType === "OFF" ? undefined : lot_urgent_q;

  //--- Fetch data
  const { data, isLoading } = useLotData(
    municipality,
    barangay,
    timesliderOn ? newStatusField : lot_status_f,
    timesliderOn ? newHoaField : lot_hoa_f,
    timesliderOn ? newAfaField : lot_aa_f,
    timesliderOn ? newHoField : lot_ho_f,
    baseFilter,
    urgent_qe,
    lot_status_q2,
  );

  //--- Call chart data
  const chartData = useMemo(() => data?.chartData ?? [], [data]);
  const totalNumber = data?.totalNumber || 0;
  const affectedArea = data?.affectedArea || 0;
  const handedOverArea = data?.handedOverArea || 0;
  const handedOverNumber = data?.handedOverNumber || 0;
  const affectedAreaStatus = data?.affectedAreaStatus || [];
  const handedOverPercent = data?.handedOverPercent || 0;

  const fontSize = chartPanelwidth / 30;
  const valueSize = chartPanelwidth / 19;
  const sementedListSize = chartPanelwidth * 0.55;
  const asofDateSize = chartPanelwidth * 0.03;
  const seriesScale = 220;
  const innerValueFontSize = "1.1rem";
  const innerLabelFontSize = "0.45em";

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

  //--- Signature of the filters that should trigger a re-zoom.
  //  Set once from the true first render — NOT reset inside the
  //  effect — so React 18 StrictMode's dev-only double effect
  //  invoke (mount -> cleanup -> mount) sees "nothing changed"
  //  on both passes and correctly skips the zoom both times.
  //  A zoom only fires once one of these values genuinely
  //  changes on a later, real render.
  const zoomFiltersRef = useRef(`${municipality}-${barangay}-${timesliderOn}`);

  //---  Pie Chart Renderer
  useEffect(() => {
    const currentZoomFilters = `${municipality}-${barangay}-${timesliderOn}`;

    if (currentZoomFilters !== zoomFiltersRef.current) {
      zoomFiltersRef.current = currentZoomFilters;
      if (!timesliderOn) zoomToLayer(lotLayer, arcgisScene?.view);
    }

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
    new ChartPieSeriesRender({
      chart,
      pieSeries,
      legend,
      root,
      qChart: data?.query,
      q2Expression: urgent_qe,
      status_field: timesliderOn ? newStatusField : lot_status_f,
      view: arcgisScene?.view,
      updateChartPanelwidth: setChartPanelwidth,
      data: chartData,
      seriesScale,
      innerLabel: "PRIVATE LOTS",
      innerLabelFontSize,
      innerValueFontSize,
      layer: lotLayer,
      statusArray: lot_status_q2,
      bkg_color_switch: false,
      seriesFillHash: undefined,
    }).chartDataRenderer();

    affectedAreaValue(
      legend,
      affectedAreaStatus,
      lot_status_q2.map((f: any) => f.category),
    );

    if (!pieSeriesRef.current) return;
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);

    // Dispose root
    return () => {
      root.dispose();
    };
  }, [chartData]);

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "3px",
          marginLeft: "35px",
          justifyContent: "center",
          gap: "65px",
          marginBottom: "5px",
        }}
      >
        <StatBlock
          label="TOTAL LOTS"
          value={thousands_separators(totalNumber)}
          fontSize={fontSize}
          valueSize={valueSize}
          isLoading={isLoading}
        />
        <StatBlock
          label="TOTAL AFFECTED AREA"
          value={affectedArea && thousands_separators(affectedArea.toFixed(0))}
          fontSize={fontSize}
          valueSize={valueSize}
          isLoading={isLoading}
          unit
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "2%" }}>
        <div
          style={{
            marginLeft: "15px",
            fontSize: `${fontSize}px`,
            color: labelColor,
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: "10px",
          }}
        >
          SUPER URGENT LOT:{" "}
        </div>
        <calcite-segmented-control
          scale="s"
          width="full"
          style={{ width: `${sementedListSize}px`, marginBottom: "auto" }}
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
          fontSize: `${asofDateSize}px`,
          float: "right",
          marginRight: "1%",
          marginTop: "1.5%",
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
          marginBottom: "1%",
          opacity: isLoading ? 0 : 1,
        }}
      ></div>

      {/* Handed-Over */}
      <div
        style={{
          display: "flex",
          marginLeft: "3%",
          marginRight: "5%",
          justifyContent: "space-between",
          marginTop: "3%",
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
            style={{ marginLeft: "1.5rem" }}
            oncalciteCheckboxChange={() =>
              setHandedOverCheckBox(!handedOverCheckBox)
            }
          ></calcite-checkbox>
        </div>
        <StatBlock
          label="TOTAL HANDED-OVER"
          value={`${handedOverPercent}% (${thousands_separators(handedOverNumber)})`}
          fontSize={fontSize}
          valueSize={valueSize}
          isLoading={isLoading}
        />
        <StatBlock
          label="HANDED-OVER AREA"
          value={
            handedOverArea && thousands_separators(handedOverArea.toFixed(0))
          }
          fontSize={fontSize}
          valueSize={valueSize}
          isLoading={isLoading}
          unit
        />
      </div>
    </>
  );
};

export default ChartLot;
