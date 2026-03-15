/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */

import {
  dateTable,
  handedOverLotLayer,
  lotDefaultSymbol,
  lotLayer,
  lotLayerRendererUniqueValueInfos,
  nloLayer,
  occupancyLayer,
  structureLayer,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
import {
  affectedAreaField,
  barangayField,
  cpField,
  handedOverLotField,
  lotHandedOverAreaField,
  lotHandedOverDateField,
  lotIdField,
  municipalityField,
  nloStatusField,
  querySuperUrgent,
  statusLotLabel,
  statusLotQuery,
  statusNloLabel,
  statusNloQuery,
  statusStructureLabel,
  statusStructureQuery,
  structurePteField,
  structureStatusField,
  superurgent_items,
} from "./uniqueValues";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";

// ****************************
//    Chart Parameters
// ****************************
// Dynamic chart size
export function responsiveChart(
  chart: any,
  pieSeries: any,
  legend: any,
  pieSeriesScale: any,
) {
  chart.onPrivate("width", (width: any) => {
    const availableSpace = width * 0.7; // original 0.7
    const new_fontSize = width / 29;
    const new_pieSeries_scale = width / pieSeriesScale;
    const new_legendMarkerSize = width * 0.045;

    legend.labels.template.setAll({
      width: availableSpace,
      maxWidth: availableSpace,
      fontSize: new_fontSize,
    });

    legend.valueLabels.template.setAll({
      fontSize: new_fontSize,
    });

    legend.markers.template.setAll({
      width: new_legendMarkerSize,
      height: new_legendMarkerSize,
    });

    pieSeries.animate({
      key: "scale",
      to: new_pieSeries_scale,
      duration: 100,
    });
  });
}

export function affectedAreaValue(legend: any, affectAreaPie: any) {
  legend.valueLabels.template.adapters.add("text", (text: any, target: any) => {
    const category = target.dataItem?.dataContext?.category;
    // if (target.dataItem && target.dataItem.get('valuePercentTotal') < 5) {
    //   return category === 'Paid'
    //     ? // eslint-disable-next-line no-useless-concat
    //       "{valuePercentTotal.formatNumber('#.')}% ({value})" + ' (' + testValue + ' sqm)'
    //     : "{valuePercentTotal.formatNumber('#.')}% ({value})";
    // }
    // "[#C9CC3F; fontSize: 12px;][bold]{valuePercentTotal.formatNumber('#.')}% ({value})[/]"
    if (target.dataItem) {
      return category === statusLotLabel[0]
        ? "{value}[/]" +
            " (" +
            thousands_separators(
              affectAreaPie.find((emp: any) => emp.category === category)
                ?.value,
            ) +
            " m2" +
            ")"
        : category === statusLotLabel[1]
          ? "{value}[/]" +
            " (" +
            thousands_separators(
              affectAreaPie?.find((emp: any) => emp.category === category)
                ?.value,
            ) +
            " m2" +
            ")"
          : category === statusLotLabel[2]
            ? "{value}[/]" +
              " (" +
              thousands_separators(
                affectAreaPie?.find((emp: any) => emp.category === category)
                  ?.value,
              ) +
              " m2" +
              ")"
            : category === statusLotLabel[3]
              ? "{value}[/]" +
                " (" +
                thousands_separators(
                  affectAreaPie?.find((emp: any) => emp.category === category)
                    ?.value,
                ) +
                " m2" +
                ")"
              : category === statusLotLabel[4]
                ? "{value}[/]" +
                  " (" +
                  thousands_separators(
                    affectAreaPie?.find((emp: any) => emp.category === category)
                      ?.value,
                  ) +
                  " m2" +
                  ")"
                : category === statusLotLabel[5]
                  ? "{value}[/]" +
                    " (" +
                    thousands_separators(
                      affectAreaPie?.find(
                        (emp: any) => emp.category === category,
                      )?.value,
                    ) +
                    " m2" +
                    ")"
                  : category === statusLotLabel[6]
                    ? "{value}[/]" +
                      " (" +
                      thousands_separators(
                        affectAreaPie?.find(
                          (emp: any) => emp.category === category,
                        )?.value,
                      ) +
                      " m2" +
                      ")"
                    : category === statusLotLabel[7]
                      ? "{value}[/]" +
                        " (" +
                        thousands_separators(
                          affectAreaPie?.find(
                            (emp: any) => emp.category === category,
                          )?.value,
                        ) +
                        " m2" +
                        ")"
                      : "{value}";
    }

    return text;
  });
}

interface chartType {
  chart: any;
  pieSeries: any;
  legend: any;
  root: any;
  municipals: any;
  status_field: any;
  arcgisScene: any;
  updateChartPanelwidth: any;
  data: any;
  pieSeriesScale: any;
  pieInnerLabel?: any;
  pieInnerLabelFontSize?: any;
  pieInnerValueFontSize?: any;
  layer: FeatureLayer;
  statusArray: any;
}
export function chartRenderer({
  chart,
  pieSeries,
  legend,
  root,
  municipals,
  status_field,
  arcgisScene,
  updateChartPanelwidth,
  data,
  pieSeriesScale,
  pieInnerLabel,
  pieInnerLabelFontSize,
  pieInnerValueFontSize,
  layer,
  statusArray,
}: chartType) {
  // values inside a donut
  let inner_label = pieSeries.children.push(
    am5.Label.new(root, {
      text: `[#ffffff]{valueSum}[/]\n[fontSize: ${pieInnerLabelFontSize}; #d3d3d3; verticalAlign: super]${pieInnerLabel}[/]`,
      // text: "[#ffffff]{valueSum}[/]\n[fontSize: 0.45em; #d3d3d3; verticalAlign: super]PRIVATE LOTS[/]",
      fontSize: `${pieInnerValueFontSize}`,
      centerX: am5.percent(50),
      centerY: am5.percent(40),
      populateText: true,
      oversizedBehavior: "fit",
      textAlign: "center",
    }),
  );

  pieSeries.onPrivate("width", (width: any) => {
    inner_label.set("maxWidth", width * 0.7);
  });

  // Set slice opacity and stroke color
  pieSeries.slices.template.setAll({
    toggleKey: "none",
    fillOpacity: 0.9,
    stroke: am5.color("#ffffff"),
    strokeWidth: 0.5,
    strokeOpacity: 1,
    templateField: "sliceSettings",
    tooltipText: '{category}: {valuePercentTotal.formatNumber("#.")}%',
  });

  // Disabling labels and ticksll
  pieSeries.labels.template.set("visible", false);
  pieSeries.ticks.template.set("visible", false);

  // EventDispatcher is disposed at SpriteEventDispatcher...
  // It looks like this error results from clicking events
  pieSeries.slices.template.events.on("click", (ev: any) => {
    const Selected: any = ev.target.dataItem?.dataContext;
    const Category = Selected.category;
    const find = statusArray.find((emp: any) => emp.category === Category);
    const statusSelected = find?.value;
    const qExpression = `Municipality = '${municipals}' AND ${status_field} = ${statusSelected}`;

    polygonViewQueryFeatureHighlight({
      polygonLayer: layer,
      qExpression: qExpression,
      view: arcgisScene?.view,
    });
  });

  pieSeries.data.setAll(data);

  // Disabling labels and ticksll
  pieSeries.labels.template.setAll({
    // fill: am5.color('#ffffff'),
    // fontSize: '0.5rem',
    visible: false,
    scale: 0,
    // oversizedBehavior: 'wrap',
    // maxWidth: 65,
    // text: "{category}: [#C9CC3F; fontSize: 10px;]{valuePercentTotal.formatNumber('#.')}%[/]",
  });

  // pieSeries.labels.template.set('visible', true);
  pieSeries.ticks.template.setAll({
    // fillOpacity: 0.9,
    // stroke: am5.color('#ffffff'),
    // strokeWidth: 0.3,
    // strokeOpacity: 1,
    visible: false,
    scale: 0,
  });

  // Legend
  // Change the size of legend markers
  legend.markers.template.setAll({
    width: 17,
    height: 17,
  });

  // Change the marker shape
  legend.markerRectangles.template.setAll({
    cornerRadiusTL: 10,
    cornerRadiusTR: 10,
    cornerRadiusBL: 10,
    cornerRadiusBR: 10,
  });

  responsiveChart(chart, pieSeries, legend, pieSeriesScale);
  chart.onPrivate("width", (width: any) => {
    updateChartPanelwidth(width);
  });

  // Change legend labelling properties
  // To have responsive font size, do not set font size
  legend.labels.template.setAll({
    oversizedBehavior: "truncate",
    fill: am5.color("#ffffff"),
    //textDecoration: "underline"
    //width: am5.percent(200)
    //fontWeight: "300"
  });

  legend.valueLabels.template.setAll({
    textAlign: "right",
    //width: valueLabelsWidth,
    fill: am5.color("#ffffff"),
    //fontSize: LEGEND_FONT_SIZE,
  });

  legend.itemContainers.template.setAll({
    // set space between legend items
    paddingTop: 3,
    paddingBottom: 1,
  });

  pieSeries.appear(1000, 100);
}

// ****************************
//    Dropdown Parameters
// ****************************

// Query function for lotLayer
export const queryDropdownTypes = (municipal: any, barangay: any) => {
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const querySuperUrgentMunicipality =
    querySuperUrgent + " AND " + queryMunicipality;
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const querySuperUrgentMunicipalBarangay =
    querySuperUrgentMunicipality + " AND " + queryBarangay;

  return [
    queryMunicipality,
    queryMunicipalBarangay,
    querySuperUrgentMunicipality,
    querySuperUrgentMunicipalBarangay,
  ];
};

interface queryLayerExpressionType {
  superurgenttype?: string;
  municipal: string;
  barangay: string;
  arcgisScene: any;
  timesliderstate: boolean;
}
export function queryLayersExpression({
  superurgenttype,
  municipal,
  barangay,
  arcgisScene,
  timesliderstate,
}: queryLayerExpressionType) {
  try {
    const typeExpression = queryDropdownTypes(municipal, barangay);

    if (superurgenttype === superurgent_items[0]) {
      if (!municipal) {
        lotLayer.definitionExpression = "1=1";
        handedOverLotLayer.definitionExpression = "1=1";
      } else if (municipal && !barangay) {
        lotLayer.definitionExpression = typeExpression[0];
        handedOverLotLayer.definitionExpression = typeExpression[0];
      } else if (municipal && barangay) {
        lotLayer.definitionExpression = typeExpression[1];
        handedOverLotLayer.definitionExpression = typeExpression[1];
      }
    } else if (superurgenttype === superurgent_items[1]) {
      if (!municipal) {
        lotLayer.definitionExpression = querySuperUrgent;
        handedOverLotLayer.definitionExpression = querySuperUrgent;
      } else if (municipal && !barangay) {
        lotLayer.definitionExpression = typeExpression[2];
        handedOverLotLayer.definitionExpression = typeExpression[2];
      } else if (municipal && barangay) {
        lotLayer.definitionExpression = typeExpression[3];
        handedOverLotLayer.definitionExpression = typeExpression[3];
      }

      // Structure and NLO
    } else if (!superurgenttype) {
      if (!municipal) {
        structureLayer.definitionExpression = "1=1";
        nloLayer.definitionExpression = "1=1";
        occupancyLayer.definitionExpression = "1=1";
      } else if (municipal && !barangay) {
        structureLayer.definitionExpression = typeExpression[0];
        nloLayer.definitionExpression = typeExpression[0];
        occupancyLayer.definitionExpression = typeExpression[0];
      } else if (municipal && barangay) {
        structureLayer.definitionExpression = typeExpression[1];
        nloLayer.definitionExpression = typeExpression[1];
        occupancyLayer.definitionExpression = typeExpression[1];
      }
    }

    if (!timesliderstate) {
      zoomToLayer(lotLayer, arcgisScene);
      zoomToLayer(structureLayer, arcgisScene);
    }
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

interface queryStatisticsType {
  superurgent?: any;
  municipal: any;
  barangay: any;
  queryField?: any;
}

export function queryStatisticsLayer({
  superurgent,
  municipal,
  barangay,
  queryField,
}: queryStatisticsType) {
  try {
    const typeExpression = queryDropdownTypes(municipal, barangay);

    let queryWhere: any;
    if (superurgent === superurgent_items[0]) {
      if (!municipal) {
        queryWhere = !queryField ? "1=1" : queryField;
      } else if (municipal && !barangay) {
        queryWhere = !queryField
          ? typeExpression[0]
          : queryField + " AND " + typeExpression[0];
      } else if (municipal && barangay) {
        queryWhere = !queryField
          ? typeExpression[1]
          : queryField + " AND " + typeExpression[1];
      }
    } else if (superurgent === superurgent_items[1]) {
      if (!municipal) {
        queryWhere = !queryField
          ? querySuperUrgent
          : queryField + " AND " + querySuperUrgent;
      } else if (municipal && !barangay) {
        queryWhere = !queryField
          ? typeExpression[2]
          : queryField + " AND " + typeExpression[2];
      } else if (municipal && barangay) {
        queryWhere = !queryField
          ? typeExpression[3]
          : queryField + " AND " + typeExpression[3];
      }

      // Structure and NLO
    } else if (!superurgent) {
      if (!municipal) {
        queryWhere = queryField;
      } else if (municipal && !barangay) {
        queryWhere = !queryField
          ? typeExpression[0]
          : queryField + " AND " + typeExpression[0];
      } else if (municipal && barangay) {
        queryWhere = !queryField
          ? typeExpression[1]
          : queryField + " AND " + typeExpression[1];
      }
    }
    return queryWhere;
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

// Change symbology of lot layer
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

// get last date of month
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
  const queryExpression =
    "project = 'N2'" + " AND " + "category = '" + category + "'";
  query.where = queryExpression; // "project = 'N2'" + ' AND ' + "category = 'Land Acquisition'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
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
  });
}

// Lot Status Query
export async function generateLotData(
  superurgent: any,
  municipal: any,
  barangay: any,
  statusdatefield: any,
) {
  try {
    // const queryField = `${statusdatefield} IS NOT NULL`;
    if (statusdatefield) {
      const total_count = new StatisticDefinition({
        onStatisticField: statusdatefield,
        outStatisticFieldName: "total_count",
        statisticType: "count",
      });

      const query = lotLayer.createQuery();
      query.outFields = [statusdatefield];
      query.outStatistics = [total_count];
      query.orderByFields = [statusdatefield];
      query.groupByFieldsForStatistics = [statusdatefield];
      query.where = queryStatisticsLayer({
        superurgent: superurgent,
        municipal: municipal,
        barangay: barangay,
        // queryField: queryField,
      });

      return lotLayer.queryFeatures(query).then((response: any) => {
        const stats = response.features;
        const data = stats.map((result: any) => {
          const attributes = result.attributes;
          const status_id = attributes[statusdatefield];
          const count = attributes.total_count;
          return Object.assign({
            category: statusLotLabel[status_id - 1],
            value: count,
          });
        });

        const data1: any = [];
        statusLotLabel.map((status: any, index: any) => {
          const find = data.find((emp: any) => emp.category === status);
          const value = find === undefined ? 0 : find?.value;
          const object = {
            category: status,
            value: value,
            sliceSettings: {
              fill: am5.color(statusLotQuery[index].color),
            },
          };
          data1.push(object);
        });

        return data1;
      });
    }
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

export async function generateLotNumber(
  superurgent: any,
  municipal: any,
  barangay: any,
  handedoverDatefield: any,
) {
  try {
    // const queryField = `${lotIdField} IS NOT NULL`;

    const onStatisticsFieldValue: string =
      "CASE WHEN " + handedoverDatefield + " >= 1 THEN 1 ELSE 0 END";

    const total_lot_number = new StatisticDefinition({
      onStatisticField: lotIdField,
      outStatisticFieldName: "total_lot_number",
      statisticType: "count",
    });

    const total_lot_pie = new StatisticDefinition({
      onStatisticField: onStatisticsFieldValue,
      outStatisticFieldName: "total_lot_pie",
      statisticType: "sum",
    });

    const query = lotLayer.createQuery();
    query.outFields = [lotIdField, handedoverDatefield];
    query.outStatistics = [total_lot_number, total_lot_pie];
    query.where = queryStatisticsLayer({
      superurgent: superurgent,
      municipal: municipal,
      barangay: barangay,
    });

    return lotLayer.queryFeatures(query).then((response: any) => {
      const stats = response.features[0].attributes;
      const totalLotNumber = stats.total_lot_number;
      const totalLotPie = stats.total_lot_pie;
      return [totalLotNumber, totalLotPie];
    });
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

// type layerInformationTypes = {
//   superurgent: any;
//   municipal: any;
//   barangay: any;
//   statusdatefield?: any;
// };

export async function generateTotalAffectedArea(
  superurgent: any,
  municipal: any,
  barangay: any,
  affectedAreafield: any,
) {
  try {
    // const queryField = `${affectedAreafield} IS NOT NULL`;

    const total_affected_area = new StatisticDefinition({
      onStatisticField: affectedAreafield,
      outStatisticFieldName: "total_affected_area",
      statisticType: "sum",
    });

    const query = lotLayer.createQuery();
    query.outFields = [affectedAreafield];
    query.outStatistics = [total_affected_area];
    query.where = queryStatisticsLayer({
      superurgent: superurgent,
      municipal: municipal,
      barangay: barangay,
    });

    return lotLayer.queryFeatures(query).then((response: any) => {
      const stats = response.features[0].attributes;
      const value = stats.total_affected_area;
      return value;
    });
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

export async function generateAffectedAreaForPie(
  superurgent: any,
  municipal: any,
  barangay: any,
  statusdatefield: any,
) {
  try {
    const statusQuery = `${statusdatefield} >= 1`;

    const total_affected_area = new StatisticDefinition({
      onStatisticField: affectedAreaField,
      outStatisticFieldName: "total_affected_area",
      statisticType: "sum",
    });

    const query = lotLayer.createQuery();
    query.outStatistics = [total_affected_area];
    query.orderByFields = [statusdatefield];
    query.groupByFieldsForStatistics = [statusdatefield];
    query.where = queryStatisticsLayer({
      superurgent: superurgent,
      municipal: municipal,
      barangay: barangay,
      queryField: statusQuery,
    });

    return lotLayer.queryFeatures(query).then((response: any) => {
      const stats = response.features;
      const data = stats.map((result: any) => {
        const attributes = result.attributes;
        const affected = attributes.total_affected_area;
        const status_id = attributes[statusdatefield];

        return Object.assign({
          category: statusLotLabel[status_id - 1],
          value: affected,
        });
      });

      const data1: any = [];
      statusLotLabel.map((status: any) => {
        const find = data.find((emp: any) => emp.category === status);
        const value1 = find === undefined ? 0 : (find?.value).toFixed(0);
        const object = {
          category: status,
          value: value1,
        };
        data1.push(object);
      });
      return data1;
    });
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

// Handed Over
export async function generateHandedOverLotsNumber(
  superurgent: any,
  municipal: any,
  barangay: any,
  dateforhandedover: any,
) {
  try {
    const onStatisticsFieldValue = `CASE WHEN ${lotHandedOverDateField} <= date '${dateforhandedover}' THEN 1 ELSE 0 END`;

    const total_handedover_lot = new StatisticDefinition({
      onStatisticField: onStatisticsFieldValue,
      outStatisticFieldName: "total_handedover_lot",
      statisticType: "sum",
    });

    const total_lot_N = new StatisticDefinition({
      onStatisticField: lotIdField,
      outStatisticFieldName: "total_lot_N",
      statisticType: "count",
    });

    const query = lotLayer.createQuery();
    query.outStatistics = [total_handedover_lot, total_lot_N];
    query.outFields = [lotIdField, lotHandedOverDateField];
    query.where = queryStatisticsLayer({
      superurgent: superurgent,
      municipal: municipal,
      barangay: barangay,
    });

    return lotLayer.queryFeatures(query).then((response: any) => {
      const stats = response.features[0].attributes;
      const handedover = stats.total_handedover_lot;
      const totaln = stats.total_lot_N;
      const percent = ((handedover / totaln) * 100).toFixed(0);

      return [percent, handedover];
    });
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

export async function generateHandedOverArea(
  superurgent: any,
  municipal: any,
  barangay: any,
  handedoverAreafield: any,
) {
  try {
    const handed_over_area = new StatisticDefinition({
      onStatisticField: handedoverAreafield,
      outStatisticFieldName: "handed_over_area",
      statisticType: "sum",
    });

    const query = lotLayer.createQuery();
    query.outStatistics = [handed_over_area];
    query.where = queryStatisticsLayer({
      superurgent: superurgent,
      municipal: municipal,
      barangay: barangay,
    });

    return lotLayer.queryFeatures(query).then((response: any) => {
      const stats = response.features[0].attributes;
      const value = stats.handed_over_area;
      return value;
    });
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

export async function generateHandedOverAreaData() {
  try {
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

    return lotLayer.queryFeatures(query).then((response: any) => {
      const stats = response.features;
      const data = stats.map((result: any) => {
        const attributes = result.attributes;
        const affected = attributes.total_affected_area;
        const handedOver = attributes.total_handedover_area;
        const cp = attributes.CP;

        const percent = ((handedOver / affected) * 100).toFixed(0);

        return Object.assign(
          {},
          {
            category: cp,
            value: percent,
          },
        );
      });

      return data;
    });
  } catch (error) {
    console.error("Error fetching data from FeatureServer:", error);
  }
}

// Structure
export async function generateStructureData(municipal: any, barangay: any) {
  const total_count = new StatisticDefinition({
    onStatisticField: structureStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  const query = structureLayer.createQuery();
  query.outFields = [structureStatusField, municipalityField, barangayField];
  query.outStatistics = [total_count];
  query.orderByFields = [structureStatusField];
  query.groupByFieldsForStatistics = [structureStatusField];

  query.where = queryStatisticsLayer({
    superurgent: undefined,
    municipal: municipal,
    barangay: barangay,
    queryField: undefined,
  });

  return structureLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const status_id = attributes.StatusStruc;
      const count = attributes.total_count;
      return Object.assign({
        category: statusStructureLabel[status_id - 1],
        value: count,
      });
    });

    const data1: any = [];
    statusStructureLabel.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      const object = {
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusStructureQuery[index].color),
        },
      };
      data1.push(object);
    });
    return data1;
  });
}

// For Permit-to-Enter
export async function generateStrucNumber(municipal: any, barangay: any) {
  const onStatisticsFieldValue: string =
    "CASE WHEN " + structureStatusField + " >= 1 THEN 1 ELSE 0 END";

  const onStatisticFieldValuePte: string =
    "CASE WHEN " + structurePteField + " = 1 THEN 1 ELSE 0 END";

  const total_pte_structure = new StatisticDefinition({
    onStatisticField: onStatisticFieldValuePte,
    outStatisticFieldName: "total_pte_structure",
    statisticType: "sum",
  });

  const total_struc_N = new StatisticDefinition({
    onStatisticField: onStatisticsFieldValue,
    outStatisticFieldName: "total_struc_N",
    statisticType: "sum",
  });

  const query = structureLayer.createQuery();
  query.where = queryStatisticsLayer({
    municipal: municipal,
    barangay: barangay,
  });

  query.outStatistics = [total_pte_structure, total_struc_N];
  return structureLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const pte = stats.total_pte_structure;
    const totaln = stats.total_struc_N;
    const percPTE = Number(((pte / totaln) * 100).toFixed(0));
    return [percPTE, pte, totaln];
  });
}

// Non-Land Owner
export async function generateNloData(municipal: any, barangay: any) {
  const total_count = new StatisticDefinition({
    onStatisticField: nloStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  const query = nloLayer.createQuery();
  query.outFields = [nloStatusField, municipalityField, barangayField];
  query.outStatistics = [total_count];
  query.orderByFields = [nloStatusField];
  query.groupByFieldsForStatistics = [nloStatusField];
  query.where = queryStatisticsLayer({
    municipal: municipal,
    barangay: barangay,
  });

  return nloLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const status_id = attributes.StatusRC;
      const count = attributes.total_count;
      return Object.assign({
        category: statusNloLabel[status_id - 1],
        value: count,
      });
    });

    const data1: any = [];
    statusNloLabel.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      const object = {
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusNloQuery[index].color),
        },
      };
      data1.push(object);
    });
    return data1;
  });
}

export async function generateNloNumber(municipal: any, barangay: any) {
  const onStatisticsFieldValue: string =
    "CASE WHEN " + nloStatusField + " >= 1 THEN 1 ELSE 0 END";

  const total_lbp = new StatisticDefinition({
    onStatisticField: onStatisticsFieldValue,
    outStatisticFieldName: "total_lbp",
    statisticType: "sum",
  });
  const query = nloLayer.createQuery();
  query.where = queryStatisticsLayer({
    municipal: municipal,
    barangay: barangay,
  });

  query.outStatistics = [total_lbp];
  return nloLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const totalnlo = stats.total_lbp;

    return totalnlo;
  });
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
    query.where = `${handedOverLotField} = 1`;
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

// Highlight selected utility feature in the Chart
export const highlightSelectedUtil = (
  featureLayer: any,
  qExpression: any,
  view: any,
) => {
  const query = featureLayer.createQuery();
  query.where = qExpression;
  let highlightSelect: any;

  view?.whenLayerView(featureLayer).then((layerView: any) => {
    featureLayer?.queryObjectIds(query).then((results: any) => {
      const objID = results;

      const queryExt = new Query({
        objectIds: objID,
      });

      try {
        featureLayer?.queryExtent(queryExt).then((result: any) => {
          if (result?.extent) {
            view?.goTo(result.extent);
          }
        });
      } catch (error) {
        console.error("Error querying extent for point layer:", error);
      }

      highlightSelect && highlightSelect.remove();
      highlightSelect = layerView.highlight(objID);
    });

    layerView.filter = new FeatureFilter({
      where: qExpression,
    });

    // For initial state, we need to add this
    view?.on("click", () => {
      layerView.filter = new FeatureFilter({
        where: undefined,
      });
      highlightSelect && highlightSelect.remove();
    });
  });
};

type layerViewQueryProps = {
  pointLayer1?: FeatureLayer;
  pointLayer2?: FeatureLayer;
  lineLayer1?: FeatureLayer;
  lineLayer2?: FeatureLayer;
  polygonLayer?: FeatureLayer;
  qExpression?: any;
  view: any;
};

export const polygonViewQueryFeatureHighlight = ({
  polygonLayer,
  qExpression,
  view,
}: layerViewQueryProps) => {
  highlightSelectedUtil(polygonLayer, qExpression, view);
};
