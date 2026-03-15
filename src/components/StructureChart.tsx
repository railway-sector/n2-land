import { useEffect, useRef, useState, use } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import {
  chartRenderer,
  dateUpdate,
  generateStrucNumber,
  generateStructureData,
  queryLayersExpression,
  thousands_separators,
} from "../Query";
import "../index.css";
import {
  cutoff_days,
  primaryLabelColor,
  statusStructureQuery,
  structureStatusField,
  updatedDateCategoryNames,
  valueLabelColor,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";
import { structureLayer } from "../layers";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

///*** Others */

/// Draw chart
const StructureChart = () => {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const {
    municipals,
    barangays,
    timesliderstate,
    chartPanelwidth,
    updateChartPanelwidth,
  } = use(MyContext);

  // 0. Updated date
  const [asOfDate, setAsOfDate] = useState<undefined | any | unknown>(null);
  const [daysPass, setDaysPass] = useState<boolean>(false);
  useEffect(() => {
    dateUpdate(updatedDateCategoryNames[1]).then((response: any) => {
      setAsOfDate(response[0][0]);
      setDaysPass(response[0][1] >= cutoff_days ? true : false);
    });
  }, []);

  // ************************************
  //  Chart
  // ***********************************
  const new_fontSize = chartPanelwidth / 22.3;
  const new_valueSize = new_fontSize * 1.55;
  const new_imageSize = chartPanelwidth * 0.03;
  const new_asofDateSize = chartPanelwidth * 0.032;
  const new_pieSeriesScale = 220;
  const new_pieInnerValueFontSize = "1.2rem";
  const new_pieInnerLabelFontSize = "0.45em";

  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [structureData, setStructureData] = useState<any>([]);

  const chartID = "structure-chart";
  const [structureNumber, setStructureNumber] = useState([]);

  useEffect(() => {
    queryLayersExpression({
      superurgenttype: undefined,
      municipal: municipals,
      barangay: barangays,
      arcgisScene: arcgisScene,
      timesliderstate: timesliderstate,
    });

    generateStructureData(municipals, barangays).then((result: any) => {
      setStructureData(result);
    });

    // Structure Number
    generateStrucNumber(municipals, barangays).then((response: any) => {
      setStructureNumber(response);
    });
  }, [municipals, barangays]);

  useEffect(() => {
    // Dispose previously created root element
    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      }),
    );
    chartRef.current = chart;

    // Create series
    const pieSeries = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        categoryField: "category",
        valueField: "value",
        //legendLabelText: "[{fill}]{category}[/]",
        legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
        radius: am5.percent(45), // outer radius
        innerRadius: am5.percent(28),
      }),
    );
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // Legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
      }),
    );
    legendRef.current = legend;
    legend.data.setAll(pieSeries.dataItems);

    // Render chart
    chartRenderer({
      chart: chart,
      pieSeries: pieSeries,
      legend: legend,
      root: root,
      municipals: municipals,
      status_field: structureStatusField,
      arcgisScene: arcgisScene,
      updateChartPanelwidth: updateChartPanelwidth,
      data: structureData,
      pieSeriesScale: new_pieSeriesScale,
      pieInnerLabel: "STRUCTURES",
      pieInnerLabelFontSize: new_pieInnerLabelFontSize,
      pieInnerValueFontSize: new_pieInnerValueFontSize,
      layer: structureLayer,
      statusArray: statusStructureQuery,
    });

    return () => {
      root.dispose();
    };
  }, [chartID, structureData]);

  useEffect(() => {
    pieSeriesRef.current?.data.setAll(structureData);
    legendRef.current?.data.setAll(pieSeriesRef.current.dataItems);
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
        }}
      >
        <img
          src="https://EijiGorilla.github.io/Symbols/House_Logo.svg"
          alt="Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
          style={{ paddingTop: "2px" }}
        />
        <dl style={{ alignItems: "center" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
              marginRight: "25px",
            }}
          >
            TOTAL STRUCTURES
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {thousands_separators(structureNumber[2])}
          </dd>
        </dl>
      </div>

      <div
        style={{
          color: daysPass === true ? "red" : "gray",
          fontSize: `${new_asofDateSize}px`,
          float: "right",
          marginRight: "5px",
        }}
      >
        {!asOfDate ? "" : "As of " + asOfDate}
      </div>

      {/* Structure Chart */}
      <div
        id={chartID}
        style={{
          height: "57vh",
          backgroundColor: "rgb(0,0,0,0)",
          color: "white",
          marginBottom: "5%",
        }}
      ></div>

      {/* Permit-to-Enter */}
      <div
        style={{
          display: "flex",
          // marginTop: "3px",
          marginLeft: "15px",
          marginRight: "15px",
          justifyContent: "space-between",
        }}
      >
        <dl style={{ alignItems: "center", marginLeft: "15px" }}>
          <dt
            style={{
              color: primaryLabelColor,
              fontSize: `${new_fontSize}px`,
            }}
          >
            PERMIT-TO-ENTER
          </dt>
          <dd
            style={{
              color: valueLabelColor,
              fontSize: `${new_valueSize}px`,
              fontWeight: "bold",
              fontFamily: "calibri",
              lineHeight: "1.2",
              margin: "auto",
            }}
          >
            {structureNumber[1] === 0 ? (
              <span>{structureNumber[0]}% (0)</span>
            ) : (
              <span>
                {structureNumber[0]}% (
                {thousands_separators(structureNumber[1])})
              </span>
            )}
            {/* {structureNumber[0]}% ({thousands_separators(structureNumber[1])}) */}
          </dd>
        </dl>
        <img
          src="https://EijiGorilla.github.io/Symbols/Permit-To-Enter.png"
          alt="Structure Logo"
          height={`${new_imageSize}%`}
          width={`${new_imageSize}%`}
        />
      </div>
    </>
  );
}; // End of lotChartgs

export default StructureChart;
