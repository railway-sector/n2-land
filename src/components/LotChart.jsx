import { use, useEffect, useRef, useState } from "react";
import { handedOverLotLayer, lotLayer } from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import {
  dateUpdate,
  generateAffectedAreaForPie,
  generateHandedOverArea,
  generateHandedOverLotsNumber,
  generateLotData,
  generateLotNumber,
  generateTotalAffectedArea,
  highlightLot,
  highlightRemove,
  thousands_separators,
  zoomToLayer,
} from "../Query";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-checkbox";
import {
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
  CalciteCheckbox,
} from "@esri/calcite-components-react";
import {
  barangayField,
  cutoff_days,
  lotStatusField,
  municipalityField,
  primaryLabelColor,
  querySuperUrgent,
  statusLotLabel,
  statusLotQuery,
  updatedDateCategoryNames,
  valueLabelColor,
} from "../uniqueValues";

import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import { MyContext } from "../App";

// Dispose function
function maybeDisposeRoot(divId) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

///*** Others */
/// Draw chart
const LotChart = () => {
  const arcgisScene = document.querySelector("arcgis-scene");
  const { municipals, barangays } = use(MyContext);

  const municipal = municipals;
  const barangay = barangays;

  // 0. Updated date
  const [asOfDate, setAsOfDate] = useState(null);
  const [daysPass, setDaysPass] = useState(false);
  useEffect(() => {
    dateUpdate(updatedDateCategoryNames[0]).then((response) => {
      setAsOfDate(response[0][0]);
      setDaysPass(response[0][1] >= cutoff_days ? true : false);
    });
  }, []);

  // Add zoomToLayer in App component, not LotChart component
  useEffect(() => {
    zoomToLayer(lotLayer, arcgisScene);
  }, [municipal, barangay]);

  // 1. Land Acquisition
  const pieSeriesRef = useRef({});
  const legendRef = useRef({});
  const chartRef = useRef({});
  const [lotData, setLotData] = useState([]);

  const chartID = "pie-two";

  const [lotNumber, setLotNumber] = useState([]);
  // Affected Area for Pie Chart
  const [affectAreaPie, setAffectAreaPie] = useState([]);
  const [totalAffectedArea, setTotalAffectedArea] = useState();

  // Super urgent control items
  const superurgent_items = ["OFF", "ON"];
  const [superUrgentSelected, setSuperUrgentSelected] = useState(
    superurgent_items[0]
  );

  // Handed Over // //testestest
  const [handedOverNumber, setHandedOverNumber] = useState([]);
  const [handedOverArea, setHandedOverArea] = useState();
  const [handedOverCheckBox, setHandedOverCheckBox] = useState(false);

  // Query
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const querySuperUrgentMunicipality =
    querySuperUrgent + " AND " + queryMunicipality;
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const querySuperUrgentMunicipalBarangay =
    querySuperUrgentMunicipality + " AND " + queryBarangay;

  if (superUrgentSelected === superurgent_items[0]) {
    if (!municipal) {
      lotLayer.definitionExpression = "1=1";
      handedOverLotLayer.definitionExpression = "1=1";
    } else if (municipal && !barangay) {
      lotLayer.definitionExpression = queryMunicipality;
      handedOverLotLayer.definitionExpression = queryMunicipality;
    } else if (municipal && barangay) {
      lotLayer.definitionExpression = queryMunicipalBarangay;
      handedOverLotLayer.definitionExpression = queryMunicipalBarangay;
    }
  } else if (superUrgentSelected === superurgent_items[1]) {
    if (!municipal) {
      lotLayer.definitionExpression = querySuperUrgent;
      handedOverLotLayer.definitionExpression = querySuperUrgent;
    } else if (municipal && !barangay) {
      lotLayer.definitionExpression = querySuperUrgentMunicipality;
      handedOverLotLayer.definitionExpression = querySuperUrgentMunicipality;
    } else if (municipal && barangay) {
      lotLayer.definitionExpression = querySuperUrgentMunicipalBarangay;
      handedOverLotLayer.definitionExpression =
        querySuperUrgentMunicipalBarangay;
    }
  }

  useEffect(() => {
    if (superUrgentSelected === superurgent_items[1]) {
      zoomToLayer(lotLayer, arcgisScene);
      highlightLot(lotLayer, arcgisScene);
    } else {
      highlightRemove(lotLayer);
    }
  }, [superUrgentSelected]);

  useEffect(() => {
    if (handedOverCheckBox === true) {
      handedOverLotLayer.visible = true;
    } else {
      handedOverLotLayer.visible = false;
    }
  }, [handedOverCheckBox]);

  useEffect(() => {
    generateLotData(superUrgentSelected, municipal, barangay).then((result) => {
      setLotData(result);
    });

    // Lot number
    generateLotNumber().then((response) => {
      setLotNumber(response);
    });

    // total affected areas for pie chart
    generateAffectedAreaForPie(municipal, barangay).then((response) => {
      setAffectAreaPie(response);
    });

    // total affected area for
    generateTotalAffectedArea(municipal, barangay).then((response) => {
      setTotalAffectedArea(response);
    });

    // Handed Over
    generateHandedOverLotsNumber(superUrgentSelected, municipal, barangay).then(
      (response) => {
        setHandedOverNumber(response);
      }
    );

    generateHandedOverArea(municipal, barangay).then((response) => {
      setHandedOverArea(response);
    });
  }, [superUrgentSelected, municipal, barangay]);

  // useLayoutEffect runs synchronously. If this is used with React.lazy,
  // Every time calcite action is fired, the chart is fired, too.
  // To avoid, use useEffect instead of useLayoutEffect

  // 1. Pie Chart for Land Acquisition
  useEffect(() => {
    // Dispose previously created root element
    maybeDisposeRoot(chartID);

    var root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    // Create chart
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        centerY: am5.percent(25), //-10
        y: am5.percent(25), // space between pie chart and total lots
        layout: root.verticalLayout,
      })
    );
    chartRef.current = chart;
    // /// //
    // Create series
    var pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        legendLabelText:
          '{category}[/] ([#C9CC3F; bold]{valuePercentTotal.formatNumber("#.")}%[/]) ',
        // legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45), // outer radius
        innerRadius: am5.percent(28),
        scale: 1.7,
      })
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // values inside a donut
    let inner_label = pieSeries.children.push(
      am5.Label.new(root, {
        text: "[#ffffff]{valueSum}[/]\n[fontSize: 0.45em; #d3d3d3; verticalAlign: super]PRIVATE LOTS[/]",
        fontSize: "1.3em",
        centerX: am5.percent(50),
        centerY: am5.percent(40),
        populateText: true,
        oversizedBehavior: "fit",
        textAlign: "center",
      })
    );

    pieSeries.onPrivate("width", (width) => {
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
    pieSeries.slices.template.events.on("click", (ev) => {
      var Selected = ev.target.dataItem?.dataContext;
      var Category = Selected.category;
      const find = statusLotQuery.find((emp) => emp.category === Category);
      const statusSelected = find?.value;

      var highlightSelect;

      var query = lotLayer.createQuery();

      arcgisScene?.whenLayerView(lotLayer).then((layerView) => {
        //chartLayerView = layerView;

        lotLayer.queryFeatures(query).then(function (results) {
          const RESULT_LENGTH = results.features;
          const ROW_N = RESULT_LENGTH.length;

          let objID = [];
          for (var i = 0; i < ROW_N; i++) {
            var obj = results.features[i].attributes.OBJECTID;
            objID.push(obj);
          }

          var queryExt = new Query({
            objectIds: objID,
          });

          lotLayer.queryExtent(queryExt).then(function (result) {
            if (result.extent) {
              arcgisScene?.goTo(result.extent);
            }
          });

          if (highlightSelect) {
            highlightSelect.remove();
          }
          highlightSelect = layerView.highlight(objID);

          arcgisScene?.view.on("click", function () {
            layerView.filter = new FeatureFilter({
              where: undefined,
            });
            highlightSelect.remove();
          });
        }); // End of queryFeatures

        layerView.filter = new FeatureFilter({
          where: lotStatusField + " = " + statusSelected,
        });
      }); // End of view.whenLayerView
    });

    pieSeries.data.setAll(lotData);

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
    // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        scale: 1.03,
      })
    );
    legendRef.current = legend;
    legend.data.setAll(pieSeries.dataItems);

    // Change the size of legend markers
    legend.markers.template.setAll({
      width: 18,
      height: 18,
    });

    // Change the marker shape
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10,
    });

    // Responsive legend
    // https://www.amcharts.com/docs/v5/tutorials/pie-chart-with-a-legend-with-dynamically-sized-labels/
    // This aligns Legend to Left
    chart.onPrivate("width", function (width) {
      const boxWidth = 270; //props.style.width;
      var availableSpace = Math.max(
        width - chart.height() - boxWidth,
        boxWidth
      );
      //var availableSpace = (boxWidth - valueLabelsWidth) * 0.7
      legend.labels.template.setAll({
        width: availableSpace,
        maxWidth: availableSpace,
      });
    });

    // To align legend items: valueLabels right, labels to left
    // 1. fix width of valueLabels
    // 2. dynamically change width of labels by screen size

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

    legend.valueLabels.template.adapters.add("text", (text, target) => {
      const category = target.dataItem?.dataContext.category;
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
                affectAreaPie?.find((emp) => emp.category === category)?.value
              ) +
              " m2" +
              ")"
          : category === statusLotLabel[1]
          ? "{value}[/]" +
            " (" +
            thousands_separators(
              affectAreaPie?.find((emp) => emp.category === category)?.value
            ) +
            " m2" +
            ")"
          : category === statusLotLabel[2]
          ? "{value}[/]" +
            " (" +
            thousands_separators(
              affectAreaPie?.find((emp) => emp.category === category)?.value
            ) +
            " m2" +
            ")"
          : category === statusLotLabel[3]
          ? "{value}[/]" +
            " (" +
            thousands_separators(
              affectAreaPie?.find((emp) => emp.category === category)?.value
            ) +
            " m2" +
            ")"
          : category === statusLotLabel[4]
          ? "{value}[/]" +
            " (" +
            thousands_separators(
              affectAreaPie?.find((emp) => emp.category === category)?.value
            ) +
            " m2" +
            ")"
          : category === statusLotLabel[5]
          ? "{value}[/]" +
            " (" +
            thousands_separators(
              affectAreaPie?.find((emp) => emp.category === category)?.value
            ) +
            " m2" +
            ")"
          : category === statusLotLabel[6]
          ? "{value}[/]" +
            " (" +
            thousands_separators(
              affectAreaPie?.find((emp) => emp.category === category)?.value
            ) +
            " m2" +
            ")"
          : "{value}";
      }

      return text;
    });

    legend.itemContainers.template.setAll({
      // set space between legend items
      paddingTop: 3,
      paddingBottom: 1,
    });

    pieSeries.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartID, lotData, affectAreaPie]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(lotData);
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
          marginBottom: "10px",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/Land_logo.png"
          alt="Land Logo"
          height={"13%"}
          width={"13%"}
          style={{ paddingTop: "5px", paddingLeft: "5px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt style={{ color: primaryLabelColor, fontSize: "1.1rem" }}>
            Total Lots
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: "1.9rem",
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {thousands_separators(lotNumber[0])}
          </dd>
        </dl>
        <dl style={{ alignItems: "center" }}>
          <dt style={{ color: primaryLabelColor, fontSize: "1.1rem" }}>
            Total Affected Area
          </dt>
          {/* #d3d3d3 */}
          <dd
            style={{
              color: valueLabelColor,
              fontSize: "1.9rem",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              fontWeight: "bold",
            }}
          >
            {totalAffectedArea &&
              thousands_separators(totalAffectedArea.toFixed(0))}
            <label style={{ fontWeight: "normal", fontSize: "1.3rem" }}>
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
            fontSize: "17px",
            color: primaryLabelColor,
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: "10px",
          }}
        >
          Super Urgent Lot:{" "}
        </div>
        <CalciteSegmentedControl
          style={{
            marginRight: "auto",
          }}
          scale="m"
          onCalciteSegmentedControlChange={(event) =>
            setSuperUrgentSelected(event.target.selectedItem.id)
          }
        >
          {superUrgentSelected &&
            superurgent_items.map((priority, index) => {
              return (
                <CalciteSegmentedControlItem
                  {...(superUrgentSelected === priority
                    ? { checked: true }
                    : {})}
                  key={index}
                  value={priority}
                  id={priority}
                >
                  {priority}
                </CalciteSegmentedControlItem>
              );
            })}
        </CalciteSegmentedControl>
      </div>

      <div
        style={{
          color: daysPass === true ? "red" : "gray",
          fontSize: "0.8rem",
          float: "right",
          marginRight: "5px",
          marginTop: "5px",
        }}
      >
        {!asOfDate ? "" : "As of " + asOfDate}
      </div>

      {/* Lot Chart */}
      <div
        id={chartID}
        style={{
          height: "60vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginBottom: "3%",
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
          <CalciteCheckbox
            name="handover-checkbox"
            label="VIEW"
            scale="l"
            onCalciteCheckboxChange={(event) =>
              setHandedOverCheckBox(handedOverCheckBox === false ? true : false)
            }
          ></CalciteCheckbox>
        </div>
        <dl style={{ alignItems: "center" }}>
          <dt style={{ color: primaryLabelColor, fontSize: "1.1rem" }}>
            Total Handed-Over
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: "1.7rem",
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {handedOverNumber[0]}% ({thousands_separators(handedOverNumber[1])})
          </dd>
        </dl>
        <dl style={{ alignItems: "center" }}>
          <dt style={{ color: primaryLabelColor, fontSize: "1.1rem" }}>
            Handed-Over Area
          </dt>
          {/* #d3d3d3 */}
          <dd
            style={{
              color: valueLabelColor,
              fontSize: "1.7rem",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
              fontWeight: "bold",
            }}
          >
            {handedOverArea && thousands_separators(handedOverArea.toFixed(0))}
            <label style={{ fontWeight: "normal", fontSize: "1.3rem" }}>
              {" "}
              m
            </label>
            <label style={{ verticalAlign: "super", fontSize: "0.6rem" }}>
              2
            </label>
          </dd>
        </dl>
      </div>
      {municipals}
    </>
  );
}; // End of lotChartgs

export default LotChart;
