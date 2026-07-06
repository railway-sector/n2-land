import * as am5 from "@amcharts/amcharts5";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import { thousands_separators } from "./query";

//-- Define interface
interface CommonTypes {
  pieSeries: any;
  statusArray: StatusQueryItem[];
  status_field: string;
  qChart: any;
  q2Expression?: string;
  layer: FeatureLayer;
  view: any; // arcgisScene?.view
}

//---- Pie Chart renderer
interface chartType extends CommonTypes {
  chart: any;
  legend: any;
  root: any;
  updateChartPanelwidth: any;
  data: any;
  seriesScale: any;
  innerLabel?: string | any;
  innerLabelFontSize?: string | any;
  innerValueFontSize?: string | any;
}

interface StatusQueryItem {
  category: string;
  value: number | string;
  color: string;
}

//---- Dynamic chart size
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

    //--- legend and pieSeries properties to be dynamically changed
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

//---- Label affected area for individual status
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
    if (target.dataItem) {
      return statusLotLabel.includes(category)
        ? affected_area_label(affectAreaPie, category)
        : "{value}";
    }

    return text;
  });
}

//--- Chart Renderer
export function chartRenderer({
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
}: chartType) {
  //--- Pie series property
  pieSeriesProperties(
    root,
    data,
    pieSeries,
    innerLabel,
    innerLabelFontSize,
    innerValueFontSize,
  );

  //--- Legend properties
  legendProperties(legend);

  //--- Click pie series
  clickSeries({
    pieSeries,
    statusArray,
    status_field,
    qChart,
    q2Expression,
    layer,
    view,
  });

  //--- Responseive chart
  responsiveChart(chart, pieSeries, legend, seriesScale);
  chart.onPrivate("width", (width: any) => {
    updateChartPanelwidth(width);
  });

  pieSeries.appear(1000, 100);
}

//--- Click event function
function clickSeries({
  pieSeries,
  statusArray,
  status_field,
  qChart,
  q2Expression,
  layer,
  view,
}: CommonTypes) {
  pieSeries.slices.template.events.on("click", (ev: any) => {
    const selected: any = ev.target.dataItem?.dataContext;
    const find = statusArray.find(
      (emp: any) => emp.category === selected.category,
    );
    const statusSelected = find?.value;
    const queryField =
      typeof statusSelected === "number"
        ? `${status_field} = ${statusSelected}`
        : `${status_field} = '${statusSelected}'`;

    qChart.qExpression = queryField;
    qChart.q2Expression = q2Expression ?? undefined;

    highlightFilterLayerView({
      layer,
      view,
      qChart,
    });
  });
}

//--- Pie series propertie function
function pieSeriesProperties(
  root: any,
  data: any,
  pieSeries: any,
  innerLabel: string,
  innerLabelFontX: any,
  innerValueFontX: any,
) {
  // values inside a donut
  let inner_label = pieSeries.children.push(
    am5.Label.new(root, {
      text: `[#ffffff]{valueSum}[/]\n[fontSize: ${innerLabelFontX}; #d3d3d3; verticalAlign: super]${innerLabel}[/]`,
      fontSize: `${innerValueFontX}`,
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
}

//--- Legend property function
function legendProperties(legend: any) {
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

  legend.markers.template.setAll({
    width: 17,
    height: 17,
  });

  legend.markerRectangles.template.setAll({
    cornerRadiusTL: 10,
    cornerRadiusTR: 10,
    cornerRadiusBL: 10,
    cornerRadiusBR: 10,
  });
}

//--- Layer view function
type layerViewQueryProps = {
  layer?: FeatureLayer | any;
  qExpression?: any;
  view: any;
  qChart?: any;
};

export const highlightFilterLayerView = async ({
  layer,
  view,
  qChart,
}: layerViewQueryProps) => {
  const query = layer?.createQuery();
  const qe = qChart.queryExpression();
  query.where = qe;
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

  layerView.filter = new FeatureFilter({ where: qe });
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
