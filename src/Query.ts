/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */
import { dateTable, lotLayer } from "./layers";
import {
  cp_f,
  lot_ho_f,
  lot_status_f,
  lot_symbol,
  lot_uniqueV,
} from "./uniqueValues";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import { useQuery } from "@tanstack/react-query";
import { datefieldKeys } from "./interfaceKeys";
import type { DateFieldsType } from "./interfaceKeys";
import QueryExpressionLayers from "query-layers-expression";
import type { statisticsType } from "./interfaceKeys";

//---------------------------------------------------------//
//                 Add Layers to Map                      //
//---------------------------------------------------------//
export function addLayersToMap(map: any, layersList: any[]) {
  layersList.forEach((layer: any) => {
    map.add(layer);
  });
}

//---------------------------------------------------------//
//    Definition Expression using queryExpression          //
//---------------------------------------------------------//
interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer,
}: queryDefinitionExpressionType) {
  if (queryExpression) {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
      }
    }
  }
}

//---------------------------------------------//
//           Lot Pie chart                     //
//---------------------------------------------//

//--- Chart Data Generation helper function
// `pieChartData` function helps to assign parameter names to class `ChartPieSeries`
interface pieChartDataType {
  piechart: any;
  qChart: any;
  layer: any;
  statusList: any;
  statusField: any;
  statisticField: any;
  statisticType: "sum" | "count";
}

export async function pieChartData({
  piechart,
  qChart,
  layer,
  statusList,
  statusField,
  statisticField,
  statisticType,
}: pieChartDataType) {
  piechart.qChart = qChart.queryExpression();
  piechart.layer = layer;
  piechart.statusList = statusList;
  piechart.statusField = statusField;
  piechart.statisticField = statisticField;
  piechart.statisticType = statisticType;

  return await piechart.chartDataPieSeries();
}

//--- Separate calculation
interface fieldStatisticType {
  qChart: any;
  layer: any;
  statisticField: any;
  statisticType: statisticsType;
}

export async function fieldStatistic({
  qChart,
  layer,
  statisticField,
  statisticType,
}: fieldStatisticType) {
  const statsCollect = new StatisticDefinition({
    onStatisticField: statisticField,
    outStatisticFieldName: "statsCollect",
    statisticType: statisticType,
  });

  //--- Query
  const query = new Query();
  query.outStatistics = [statsCollect];
  query.where = qChart;

  return layer?.queryFeatures(query).then((response: any) => {
    return response.features[0].attributes.statsCollect;
  });
}

//--- Chart Render helper function
// `pieChartRender` function helps to assign parameter names to class `ChartPieSeriesRender`
interface PieChartRenderType {
  render: any | null; // the first instance of new ChartPieSeriesRender
  chart: any; // amChart
  pieSeries: any;
  legend: any;
  root: any;
  qChart: any;
  q2Expression?: any;
  status_field: any;
  view: any;
  updateChartPanelwidth: any;
  data: any;
  seriesScale: any;
  innerLabel?: any;
  innerLabelFontSize?: any;
  innerValueFontSize?: any;
  layer: FeatureLayer | any;
  statusArray: StatusQueryItem[];
  bkg_color_switch?: boolean;
  seriesFillHash?: boolean;
}

interface StatusQueryItem {
  category: string;
  value: number | string;
  color: string;
}

export async function PieChartRenderType({
  render,
  chart,
  pieSeries,
  legend,
  root,
  qChart,
  q2Expression,
  status_field,
  view,
  updateChartPanelwidth,
  data,
  seriesScale,
  innerLabel,
  innerLabelFontSize,
  innerValueFontSize,
  layer,
  statusArray,
  bkg_color_switch,
  seriesFillHash,
}: PieChartRenderType) {
  render.chart = chart;
  render.pieSeries = pieSeries;
  render.legend = legend;
  render.root = root;
  render.qChart = qChart;
  render.q2Expression = q2Expression;
  render.status_field = status_field;
  render.view = view;
  render.updateChartPanelwidth = updateChartPanelwidth;
  render.data = data;
  render.seriesScale = seriesScale;
  render.innerLabel = innerLabel;
  render.innerLabelFontSize = innerLabelFontSize;
  render.innerValueFontSize = innerValueFontSize;
  render.layer = layer;
  render.statusArray = statusArray;
  render.bkg_color_switch = bkg_color_switch;
  render.seriesFillHash = seriesFillHash;

  return await render.chartDataRenderer();
}

//--- Returns query expression
export const makeQuery = (
  qValues: string[],
  qFields: string[],
  qExpression?: string,
  q2Expression?: string,
) => {
  const q = new QueryExpressionLayers();
  q.qValues = qValues;
  q.qFields = qFields;
  if (qExpression) q.qExpression = qExpression;
  if (q2Expression) q.q2Expression = q2Expression;
  return q;
};

//---------------------------------------------//
//           Lot (handed over area)            //
//---------------------------------------------//
interface HandedOverArea {
  aa_field: any;
  hoa_field: any;
  cp_list: any;
  layer: any;
}
export async function handedOverAreaByContractp({
  aa_field,
  hoa_field,
  cp_list,
  layer,
}: HandedOverArea) {
  return await Promise.all(
    cp_list.map(async (cp: any) => {
      const aa = new StatisticDefinition({
        onStatisticField: aa_field,
        outStatisticFieldName: "aa",
        statisticType: "sum",
      });

      const hoa = new StatisticDefinition({
        onStatisticField: hoa_field,
        outStatisticFieldName: "hoa",
        statisticType: "sum",
      });

      const query = layer.createQuery();
      query.where = `CP = '${cp}' AND ${cp_f} IS NOT NULL`;
      query.outStatistics = [aa, hoa];

      const response = await layer?.queryFeatures(query);
      const attributes = response.features[0].attributes;
      const perc = ((attributes.hoa / attributes.aa) * 100).toFixed(0);

      return {
        category: cp,
        value: perc ?? 0,
      };
    }),
  );
}

//--------------------------------------------//
//  Change symbology of lot layer             //
//--------------------------------------------//
export function updateLotSymbology(new_date_field: any) {
  try {
    const lotLayerRenderer = new UniqueValueRenderer({
      field: new_date_field,
      defaultSymbol: lot_symbol, // autocasts as new SimpleFillSymbol()
      uniqueValueInfos: lot_uniqueV,
    });
    lotLayer.renderer = lotLayerRenderer;
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

//---------------------------------------------------------//
//                Get & Sort date fields                   //
//---------------------------------------------------------//
function parseDateField(field: string): Date {
  return new Date(
    Number(field.slice(1, 5)),
    Number(field.slice(5, 7)) - 1,
    Number(field.slice(7, 9)),
  );
}

export async function getSortDates(layer: any) {
  //--- Get raw date fields (x202402013,.....)
  const xdates = (layer?.fields ?? [])
    .map((field: any) => field.name)
    .filter(
      (name: string) => name.startsWith("x") && !isNaN(Number(name.slice(1))),
    )
    .sort(
      (a: string, b: string) =>
        parseDateField(a).getTime() - parseDateField(b).getTime(),
    );
  return xdates;
}

export function toDateList(xdates: any) {
  //--- Conver xdates to a list of dates in date format
  const dateList: Date[] =
    xdates.map((date: string) => {
      const yyyy = Number(date.slice(1, 5));
      const mm = Number(date.slice(5, 7)) - 1;
      const dd = Number(date.slice(7, 9));
      return new Date(yyyy, mm, dd);
    }) ?? [];

  return dateList;
}

//---------------------------------------------------------//
//                Get as-of-date                           //
//---------------------------------------------------------//
export function yearMonthDay(date: Date) {
  return {
    year: date?.getFullYear() ?? 0,
    month: date?.getMonth() + 1,
    day: date?.getDate(),
  };
}

export function toAsofdate(date: Date) {
  //--- Return displayed date: (as of date)
  const { year, day } = yearMonthDay(date);
  const cmonth = date?.toLocaleString("en-US", { month: "long" });
  return `${cmonth} ${day}, ${year}`;
}

export async function dateUpdate(category: string) {
  //--- Only executed during an initial render
  const query = dateTable.createQuery();
  query.where = `project = 'N2' AND category = '${category}'`;

  const { features } = await dateTable.queryFeatures(query);
  return features.map(({ attributes }: any) => {
    const date = new Date(attributes.date);
    const asofdate = toAsofdate(date);

    return asofdate;
  });
}

export function xDateFieldsToDate(xdate: any) {
  //--- Convert a single xDate to a date in date format
  const yyyy = Number(xdate.slice(1, 5));
  const desired_mm = Number(xdate.slice(5, 7));
  const dd = Number(xdate.slice(7, 9));
  const mm = desired_mm - 1;
  const final = new Date(yyyy, mm, dd);

  return final;
}

//--- UseQuery to get a list of time-slider dates & latest date
export function useDateFields(lotLayer: any) {
  return useQuery<DateFieldsType>({
    queryKey: [datefieldKeys.selected, lotLayer],
    queryFn: async () => {
      const response = await getSortDates(lotLayer);
      return {
        dateFields: response,
        latestdate: xDateFieldsToDate(response.at(-1)),
      };
    },
    staleTime: Infinity,
  });
}

//----------------------------------------------//
//                 Others                       //
//----------------------------------------------//
//--- Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  } else {
    return 0;
  }
}

//--- Zoom to Layer (test later)
export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

//--- Zoom to fullExtet
export function zoomToFullExtent(layer: any, view: any) {
  layer.fullExtent &&
    view?.goTo(layer.fullExtent).catch((error: any) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });
}

//--- Highlight lot
let highlight: any;
export async function highlightLot(layer: any, view: any) {
  const query = layer.createQuery();

  const layerView = await view?.whenLayerView(layer);
  const results = await layer?.queryObjectIds(query);

  if (highlight) {
    highlight.remove();
  }
  highlight = layerView.highlight(results);
}

//--- Highlight handed-over lot
export async function highlightHandedOverLot(layer: any, view: any) {
  const query = layer.createQuery();
  query.where = `${lot_ho_f} = 1 AND ${lot_status_f} <> 8`;

  const layerView = view?.whenLayerView(layer);
  const results = await layer?.queryObjectIds(query);

  if (highlight) {
    highlight.remove();
  }
  highlight = layerView.highlight(results);
}

//--- Remove highlight
export function highlightRemove() {
  if (highlight) {
    highlight.remove();
  }
}
