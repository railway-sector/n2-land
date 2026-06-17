import * as am5 from "@amcharts/amcharts5";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import { thousands_separators } from "./Query";

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

function affected_area_label(affectAreaPie: any, category: any) {
  return (
    "{value}[/]" +
    " (" +
    thousands_separators(
      affectAreaPie.find((emp: any) => emp.category === category)?.value,
    ) +
    " m2" +
    ")"
  );
}

export function affectedAreaValue(
  legend: any,
  affectAreaPie: any,
  statusLotLabel: any,
) {
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
        ? affected_area_label(affectAreaPie, category)
        : category === statusLotLabel[1]
          ? affected_area_label(affectAreaPie, category)
          : category === statusLotLabel[2]
            ? affected_area_label(affectAreaPie, category)
            : category === statusLotLabel[3]
              ? affected_area_label(affectAreaPie, category)
              : category === statusLotLabel[4]
                ? affected_area_label(affectAreaPie, category)
                : category === statusLotLabel[5]
                  ? affected_area_label(affectAreaPie, category)
                  : category === statusLotLabel[6]
                    ? affected_area_label(affectAreaPie, category)
                    : category === statusLotLabel[7]
                      ? affected_area_label(affectAreaPie, category)
                      : "{value}";
    }

    return text;
  });
}

type layerViewQueryProps = {
  layer?: any;
  qExpression?: any;
  view: any;
  qChart?: any;
};

export const highlightFilterLayerView = async ({
  layer,
  // qExpression,
  view,
  qChart,
}: layerViewQueryProps) => {
  const query = layer.createQuery();
  query.where = qChart.queryExpression();
  let highlightSelect: any;

  const layerView = await view?.whenLayerView(layer);
  const results = await layer?.queryObjectIds(query);

  const queryExt = new Query({ objectIds: results });
  const qExtResult = await layer?.queryExtent(queryExt);
  if (qExtResult?.extent) {
    view?.goTo(qExtResult.extent);
  }

  highlightSelect && highlightSelect.remove();
  highlightSelect = layerView.highlight(results);

  layerView.filter = new FeatureFilter({ where: qChart.queryExpression() });
  view?.on("click", () => {
    layerView.filter = new FeatureFilter({
      where: undefined,
    });
    //-- Reset q/q2Expression; else, statusLA is not cleared.
    qChart.qExpression = undefined;
    qChart.q2Expression = undefined;
    highlightSelect && highlightSelect.remove();
  });
};

interface chartType {
  chart: any;
  pieSeries: any;
  legend: any;
  root: any;
  qChart: any;
  q1Value?: any;
  q1Field?: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  q2Expression?: any;
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
  qChart,
  q2Expression,
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
    const isStringOrNumber = typeof statusSelected === "number";
    const queryField = isStringOrNumber
      ? `${status_field} = ${statusSelected}`
      : `${status_field} = '${statusSelected}'`;

    qChart.qExpression = queryField;
    qChart.q2Expression = q2Expression;

    highlightFilterLayerView({
      layer: layer,
      // qExpression: qChart.queryExpression(),
      view: arcgisScene?.view,
      qChart: qChart,
    });
  });

  pieSeries.data.setAll(data);

  // Disabling labels and ticksll
  pieSeries.labels.template.setAll({
    visible: false,
    scale: 0,
  });

  // pieSeries.labels.template.set('visible', true);
  pieSeries.ticks.template.setAll({
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
  });

  legend.valueLabels.template.setAll({
    textAlign: "right",
    fill: am5.color("#ffffff"),
  });

  legend.itemContainers.template.setAll({
    paddingTop: 3,
    paddingBottom: 1,
  });

  pieSeries.appear(1000, 100);
}
