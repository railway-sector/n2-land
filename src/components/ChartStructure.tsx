import { memo, use, useEffect, useMemo, useRef, useState } from "react";
import {
  thousands_separators,
  queryDefinitionExpression,
  fieldStatistic,
  useDateFields,
  toAsofdate,
  getStructuresWithinLots,
} from "../query";
import "../index.css";
import {
  barangay_f,
  municipality_f,
  str_status_f,
  str_status_q,
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
import { FilterContext } from "../contexts/FilterContext";
import ChartPieSeries from "chart-pie-series";
import QueryExpressionLayers from "query-layers-expression";
import Query from "@arcgis/core/rest/support/Query";
import * as XLSX from "xlsx";
import StatBlock from "./statBlock";

//--------------------------//
//     useStructureData     //
//--------------------------//
function useStructureData(
  municipality: string,
  barangay: string,
  statusField: string,
  baseFilter: any,
) {
  return useQuery<ChartResponse | any>({
    queryKey: [municipality, barangay, statusField, structureLayer],
    queryFn: async () => {
      const q1 = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${statusField} >= 1`,
      });

      queryDefinitionExpression({
        queryExpression: q1.queryExpression(),
        featureLayer: [structureLayer, occupancyLayer],
      });

      const baseArgs = {
        layer: structureLayer,
        statisticField: "OBJECTID",
        statisticType: "count" as const,
      };

      const [chartData, totalNumber] = await Promise.all([
        new ChartPieSeries({
          ...baseArgs,
          where: q1.queryExpression(),
          statusList: str_status_q,
          statusField: statusField,
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
const ChartStructure = memo(() => {
  const { municipality, barangay } = use(FilterContext);

  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  //--- Initial date to display
  const { data: dateList } = useDateFields(lotLayer); // Use lotLayer
  const latestDate = toAsofdate(dateList?.latestdate);

  //--- Chart parameters
  const new_fontSize = chartPanelwidth / 30;
  const new_valueSize = chartPanelwidth / 19;
  const new_imageSize = chartPanelwidth * 0.03;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const new_optimized_font = chartPanelwidth * 0.038;
  const new_pieSeriesScale = 220;
  const new_pieInnerValueFontSize = "1.0rem";
  const new_pieInnerLabelFontSize = "0.45em";

  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartID = "structure-chart";

  //--- Base filter
  const baseFilter = useMemo(
    () => ({
      qFields: [municipality_f, barangay_f],
      qValues: [municipality, barangay],
    }),
    [municipality, barangay],
  );

  //--- Fetch data
  const { data, isLoading } = useStructureData(
    municipality,
    barangay,
    str_status_f,
    baseFilter,
  );

  //--- Call chart data
  const chartData = data?.chartData || [];
  const totalNumber = data?.totalNumber || 0;

  //------------------------------------//
  //       Optimized Structures         //
  //------------------------------------//
  // Optimized structures represent ones fall
  // completely within optimized lots (statusLA = 8)
  const highlightRef = useRef<any>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const exportArr = useRef<any>(null);
  const [hasExportData, setHasExportData] = useState<boolean>(false);

  const handleClick = async (ev: any) => {
    setChecked(ev.target.checked);

    if (ev.target.checked) {
      const qe = new QueryExpressionLayers({ ...baseFilter }).queryExpression();

      //--- Extract ObjectIds within optimized lots
      const arr: any = await getStructuresWithinLots(qe);
      if (arr.length === 0) return;

      const structureIds = arr.map((f: any) => f.strucObjectId);
      exportArr.current = arr.map(
        ({ municipality, optimizedLotID, optimizedStructureID }: any) => ({
          municipality,
          optimizedLotID,
          optimizedStructureID,
        }),
      );

      exportArr.current.sort((a: any, b: any) => {
        const muniCompare = a.municipality.localeCompare(b.municipality);
        if (muniCompare !== 0) return muniCompare;
        return a.optimizedLotID.localeCompare(b.optimizedLotID);
      });

      setHasExportData(exportArr.current.length > 0);

      //--- Query extent
      const qExtent = new Query({ objectIds: structureIds });
      const result = await structureLayer.queryExtent(qExtent);

      result.extent &&
        arcgisScene?.goTo({ target: result.extent }).catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });

      //--- Highlight
      const lv = await arcgisScene?.whenLayerView(structureLayer);
      highlightRef.current?.remove();
      highlightRef.current = lv.highlight(structureIds);

      structureLayer.visible = true;
    }

    if (!ev.target.checked) {
      highlightRef.current?.remove();
      highlightRef.current = null;
      setHasExportData(false);
    }
  };

  //--- Export Optimized structures to excel
  const handleExport = () => {
    if (!checked || !exportArr.current) return;

    const ws = XLSX.utils.json_to_sheet(exportArr.current);
    const wb = XLSX.utils.book_new();
    const fn = "N2_Optimized_Structures.xlsx";
    XLSX.utils.book_append_sheet(wb, ws, "OptimizedStructures");
    XLSX.writeFile(wb, fn);
  };

  useEffect(() => {
    //--- Uncheck checkbox and remove highlight
    setChecked(false);
    highlightRef.current?.remove();
    highlightRef.current = null;

    const root = rootSetter({ chartID: chartID });
    root.setThemes([]);
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
    new ChartPieSeriesRender({
      chart,
      pieSeries: pieSeries,
      legend,
      root,
      qChart: data?.q1,
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
    }).chartDataRenderer();

    if (!pieSeriesRef.current) return;
    pieSeriesRef.current?.data.setAll(chartData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);

    return () => {
      root.dispose();
    };
  }, [chartData]);

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
          maxHeight: "30%",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/House_Logo.svg"
          alt="Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "2px", opacity: isLoading ? 0 : 1 }}
        />
        <StatBlock
          label="TOTAL STRUCTURES"
          value={thousands_separators(totalNumber)}
          fontSize={new_fontSize}
          valueSize={new_valueSize}
          isLoading={isLoading}
          labelMarginRight="25px"
        />
      </div>

      {/* As of date*/}
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

      {/* Optimized Structures*/}
      <div
        style={{
          display: "flex",
          width: "100%",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "8%",
        }}
      >
        <calcite-checkbox
          name="handover-checkbox"
          label="VIEW"
          scale="l"
          style={{ marginLeft: "1.5rem" }}
          checked={checked}
          oncalciteCheckboxChange={handleClick}
        ></calcite-checkbox>
        <span style={{ fontSize: `${new_optimized_font}px` }}>
          Optimized Structures:
        </span>
        <calcite-button
          onClick={handleExport}
          disabled={!checked || !hasExportData}
          slot="trigger"
          scale="s"
          appearance="solid"
          icon-start="file-excel"
          style={{ "--calcite-button-background-color": "#0079C1" }}
        >
          <span
            style={{
              color: "black",
              fontSize: `${new_optimized_font * 0.8}px`,
            }}
          >
            Export to Excel
          </span>
        </calcite-button>
      </div>

      {/* Structure Chart */}
      <div
        id={chartID}
        style={{
          height: "60vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          opacity: isLoading ? 0 : 1,
        }}
      ></div>
    </div>
  );
}); // End of lotChartgs

export default ChartStructure;
