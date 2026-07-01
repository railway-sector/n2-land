/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */
import {
  dateTable,
  lotDefaultSymbol,
  lotLayer,
  lotLayerRendererUniqueValueInfos,
} from "./layers";
import {
  affectedAreaField,
  cpField,
  lotHandedOverField,
  lotHandedOverAreaField,
  lotStatusField,
} from "./uniqueValues";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type { QueryClient } from "@tanstack/react-query";
import { dateDisplayKeys, type DisplayDates } from "./interfaceKeys";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import type { statisticsType } from "./uniqueValues";

//---------------------------------------------------------//
//                 Add Layers to Map                      //
//---------------------------------------------------------//
export function addLayersToMap(map: any, layersList: any[]) {
  layersList.forEach((layer: any) => {
    map.add(layer);
  });
}

//--- Update asOfDate and/or daysPass
// This only updates either 'asOfDate' or 'daysPass'
export function updateDisplayDates(
  queryClient: QueryClient,
  fieldToUpdate: "asOfDate" | "daysPass",
  value: string,
) {
  queryClient.setQueryData<DisplayDates>(
    dateDisplayKeys.selected,
    (oldData: any) => ({
      ...oldData, // Retains whichever field is NOT being updated
      [fieldToUpdate]: value,
    }),
  );
}

//---------------------------------------------------------//
//                Get Initial Dates                        //
//---------------------------------------------------------//
export async function getSortDates(layer: any) {
  const all_fields: string[] = [];
  layer?.fields.map((field: any) => {
    all_fields.push(field.name);
  });

  const date_fields = all_fields.filter(
    (field: any) => field.startsWith("x") && !isNaN(field.slice(1)),
  );

  // Re-order date fields in ascending order
  date_fields.sort((a: any, b: any) => {
    const a_date: any = new Date(
      Number(a.slice(1, 5)),
      Number(a.slice(5, 7)) - 1,
      Number(a.slice(7, 9)),
    );
    const b_date: any = new Date(
      Number(b.slice(1, 5)),
      Number(b.slice(5, 7)) - 1,
      Number(b.slice(7, 9)),
    );
    return a_date - b_date;
  });

  return date_fields;
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
            // layer.visible = true;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
        // featureLayer.visible = true;
      }
    }
  }
}

//---------------------------------------------//
//           Lot Pie chart                     //
//---------------------------------------------//
// 'piechart' = constant declared from class ChartPieSeries in layers.ts
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

//---------------------------------------------//
//           Lot (handed over area)            //
//---------------------------------------------//
export async function generateHandedOverAreaData() {
  const total_affected_area = new StatisticDefinition({
    onStatisticField: affectedAreaField,
    outStatisticFieldName: "total_affected_area",
    statisticType: "sum",
  });

  const total_handedover_area = new StatisticDefinition({
    onStatisticField: lotHandedOverAreaField,
    outStatisticFieldName: "total_handedover_area",
    statisticType: "sum",
  });

  const query = lotLayer.createQuery();
  query.where = `${cpField} IS NOT NULL`;
  query.outStatistics = [total_affected_area, total_handedover_area];
  query.orderByFields = [cpField];
  query.groupByFieldsForStatistics = [cpField];

  const response = await lotLayer.queryFeatures(query);
  const stats = response.features;
  const data = stats.map((result: any) => {
    const attributes = result.attributes;
    const affected = attributes.total_affected_area;
    const handedOver = attributes.total_handedover_area;
    return Object.assign({
      category: attributes.CP,
      value: ((handedOver / affected) * 100).toFixed(0),
    });
  });
  return data;
}

//----------------------------------------//
//------ Symbology of lot layer ----------//
//----------------------------------------//
export function updateLotSymbology(new_date_field: any) {
  try {
    const lotLayerRenderer = new UniqueValueRenderer({
      field: new_date_field,
      defaultSymbol: lotDefaultSymbol, // autocasts as new SimpleFillSymbol()
      uniqueValueInfos: lotLayerRendererUniqueValueInfos,
    });
    lotLayer.renderer = lotLayerRenderer;
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

//----------------------------------------//
//------        Date and Month       -----//
//----------------------------------------//
export function lastDateOfMonth(date: Date) {
  const old_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const year = old_date.getFullYear();
  const month = old_date.getMonth() + 1;
  const day = old_date.getDate();
  const final_date = `${year}-${month}-${day}`;

  return final_date;
}

// Updat date

export async function dateUpdate(category: any) {
  const query = dateTable.createQuery();
  query.where = `project = 'N2' AND category = '${category}'`;
  const response = await dateTable.queryFeatures(query);
  const dates = response.features.map((result: any) => {
    // get today and date recorded in the table
    const today = new Date();
    const date = new Date(result.attributes.date);

    // Calculate the number of days passed since the last update
    const time_passed = today.getTime() - date.getTime();
    const days_passed = Math.round(time_passed / (1000 * 3600 * 24));

    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", {
      month: "long",
    });
    const day = date.getDate();
    const as_of_date = year < 1990 ? "" : `${month} ${day}, ${year}`;
    return [as_of_date, days_passed, date];
  });
  return dates;
}

export const dateFormat = (inputDate: any, format: any) => {
  //parse the input date
  const date = new Date(inputDate);

  //extract the parts of the date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //replace the month
  format = format.replace("MM", month.toString().padStart(2, "0"));

  //replace the year
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  }

  //replace the day
  format = format.replace("dd", day.toString().padStart(2, "0"));

  return format;
};

//----------------------------------------------//
//                 Others                       //
//----------------------------------------------//
// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  } else {
    return 0;
  }
}
// Zoom to Layer
// const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
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

let highlight: any;
export function highlightLot(layer: any, view: any) {
  view?.whenLayerView(layer).then((urgentLayerView: any) => {
    const query = layer.createQuery();
    layer.queryFeatures(query).then((results: any) => {
      const length = results.features.length;
      const objID = [];
      for (let i = 0; i < length; i++) {
        const obj = results.features[i].attributes.OBJECTID;
        objID.push(obj);
      }

      if (highlight) {
        highlight.remove();
      }
      highlight = urgentLayerView.highlight(objID);
    });
  });
}

export function highlightHandedOverLot(layer: any, view: any) {
  view?.whenLayerView(layer).then((urgentLayerView: any) => {
    const query = layer.createQuery();
    query.where = `${lotHandedOverField} = 1 AND ${lotStatusField} <> 8`;
    layer.queryFeatures(query).then((results: any) => {
      const length = results.features.length;
      const objID = [];
      for (let i = 0; i < length; i++) {
        const obj = results.features[i].attributes.OBJECTID;
        objID.push(obj);
      }

      if (highlight) {
        highlight.remove();
      }
      highlight = urgentLayerView.highlight(objID);
    });
  });
}

export function highlightRemove() {
  if (highlight) {
    highlight.remove();
  }
}
