import { useRef, useState, useEffect, memo, use } from "react";
import { nloLayer, occupancyLayer } from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Query from "@arcgis/core/rest/support/Query";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import {
  dateUpdate,
  generateNloData,
  generateNloNumber,
  thousands_separators,
} from "../Query";
import {
  barangayField,
  cutoff_days,
  municipalityField,
  nloStatusField,
  primaryLabelColor,
  statusNloQuery,
  updatedDateCategoryNames,
  valueLabelColor,
} from "../uniqueValues";
import { MyContext } from "../App";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

/// Draw chart
const NloChart = memo(() => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const { municipals, barangays } = use(MyContext);

  const municipal = municipals;
  const barangay = barangays;

  // 0. Updated date
  const [asOfDate, setAsOfDate] = useState<undefined | any | unknown>(null);
  const [daysPass, setDaysPass] = useState<boolean>(false);

  useEffect(() => {
    dateUpdate(updatedDateCategoryNames[2]).then((response: any) => {
      setAsOfDate(response[0][0]);
      setDaysPass(response[0][1] >= cutoff_days ? true : false);
    });
  }, []);

  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [nloData, SetNloData] = useState([
    {
      category: String,
      value: Number,
      sliceSettings: {
        fill: am5.color("#00c5ff"),
      },
    },
  ]);
  // NLO
  const [nloNumber, setNloNumber] = useState(0);
  const chartID = "nlo-chart";

  // Query
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;

  if (municipal && !barangay) {
    nloLayer.definitionExpression = queryMunicipality;
    occupancyLayer.definitionExpression = queryMunicipality;
  } else if (barangay) {
    nloLayer.definitionExpression = queryMunicipalBarangay;
    occupancyLayer.definitionExpression = queryMunicipalBarangay;
  }

  useEffect(() => {
    generateNloData(municipal, barangay).then((result: any) => {
      SetNloData(result);
    });

    // NLO
    generateNloNumber().then((response: any) => {
      setNloNumber(response);
    });
  }, [municipal, barangay]);

  useEffect(() => {
    // Dispose previously created root element

    maybeDisposeRoot(chartID);

    var root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        paddingBottom: 50,
      })
    );
    chartRef.current = chart;

    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    var pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        //legendLabelText: "[{fill}]{category}[/]",
        legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45), // outer radius
        innerRadius: am5.percent(28),
        scale: 1.5,
      })
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // values inside a donut
    let inner_label = pieSeries.children.push(
      am5.Label.new(root, {
        text: "[#ffffff]{valueSum}[/]\n[fontSize: 0.6rem; #d3d3d3; verticalAlign: super]FAMILIES[/]",
        fontSize: "1.5rem",
        centerX: am5.percent(50),
        centerY: am5.percent(40),
        populateText: true,
        oversizedBehavior: "fit",
        textAlign: "center",
      })
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
    });

    // Disabling labels and ticksll
    pieSeries.labels.template.setAll({
      visible: false,
      scale: 0,
    });
    pieSeries.ticks.template.setAll({
      visible: false,
      scale: 0,
    });

    // EventDispatcher is disposed at SpriteEventDispatcher...
    // It looks like this error results from clicking events
    pieSeries.slices.template.events.on("click", (ev) => {
      var Selected: any = ev.target.dataItem?.dataContext;
      var Category: string = Selected.category;
      const find = statusNloQuery.find((emp: any) => emp.category === Category);
      const selectedStatus = find?.value;

      var highlightSelect: any;

      var query = nloLayer.createQuery();

      arcgisScene?.whenLayerView(nloLayer).then((layerView: any): any => {
        //chartLayerView = layerView;

        nloLayer.queryFeatures(query).then(function (results) {
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

          nloLayer.queryExtent(queryExt).then(function (result) {
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
          where: nloStatusField + " = " + selectedStatus,
        });
      }); // End of view.whenLayerView
    });

    pieSeries.data.setAll(nloData);

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
    chart.onPrivate("width", function (width: any) {
      const boxWidth = 270; //props.style.width;
      // var availableSpace = Math.max(width - chart.height() - boxWidth, boxWidth);
      var availableSpace = (boxWidth - valueLabelsWidth) * 1.1;
      legend.labels.template.setAll({
        width: availableSpace,
        maxWidth: availableSpace,
      });
    });

    // To align legend items: valueLabels right, labels to left
    // 1. fix width of valueLabels
    // 2. dynamically change width of labels by screen size

    const valueLabelsWidth = 50;

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
      width: valueLabelsWidth,
      fill: am5.color("#ffffff"),
      //fontSize: LEGEND_FONT_SIZE,
    });

    legend.itemContainers.template.setAll({
      // set space between legend items
      paddingTop: 5,
      paddingBottom: 1,
    });

    pieSeries.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [chartID, nloData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(nloData);
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
        <dl style={{ alignItems: "center" }}>
          <dt style={{ color: primaryLabelColor, fontSize: "1.1rem" }}>
            TOTAL NON-LAND OWNERS
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
            {thousands_separators(nloNumber)}
          </dd>
        </dl>
        <img
          src="https://EijiGorilla.github.io/Symbols/NLO_Logo.svg"
          alt="Structure Logo"
          height={"17%"}
          width={"17%"}
          style={{ paddingTop: "5px", paddingLeft: "5px" }}
        />
      </div>
      <div
        style={{
          color: daysPass === true ? "red" : "gray",
          fontSize: "0.8rem",
          float: "right",
          marginRight: "5px",
        }}
      >
        {!asOfDate ? "" : "As of " + asOfDate}
      </div>
      {/* <CalciteLabel>TOTAL NON-LAND OWNERS</CalciteLabel>
      <CalciteLabel layout="inline">
        <b className="permitToEnterNumber">
          {thousands_separators(nloNumber)}
          <img
            src="https://EijiGorilla.github.io/Symbols/NLO_Logo.svg"
            alt="NLO Logo"
            height={'55%'}
            width={'55%'}
            style={{ marginLeft: '200%', display: 'flex', marginTop: '-17%' }}
          />
        </b>
      </CalciteLabel> */}

      <div
        id={chartID}
        style={{
          height: "75vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
        }}
      ></div>
    </>
  );
}); // End of lotChartgs

export default NloChart;
