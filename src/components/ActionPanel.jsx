import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import {
  CalciteShellPanel,
  CalciteActionBar,
  CalciteAction,
  CalcitePanel,
} from "@esri/calcite-components-react";
import { useEffect, useState } from "react";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-directline-measurement-3d";
import "@arcgis/map-components/components/arcgis-area-measurement-3d";
import { defineActions } from "../uniqueValues";
import { ngcp_tagged_structureLayer, ngcp_working_area } from "../layers";
import HandedOverAreaChart from "./HandedOverAreaChart";
import LotProgressChart from "./LotProgressChart";

function ActionPanel() {
  const [activeWidget, setActiveWidget] = useState(null);
  const [nextWidget, setNextWidget] = useState(null);
  const arcgisScene = document.querySelector("arcgis-scene");
  const directLineMeasure = document.querySelector(
    "arcgis-directline-measurement-3d"
  );
  const areaMeasure = document.querySelector("arcgis-area-measurement-3d");

  useEffect(() => {
    if (activeWidget) {
      const actionActiveWidget = document.querySelector(
        `[data-panel-id=${activeWidget}]`
      );
      actionActiveWidget.hidden = true;
      directLineMeasure
        ? directLineMeasure.clear()
        : console.log("Line measure is cleared");
      areaMeasure
        ? areaMeasure.clear()
        : console.log("Area measure is cleared.");
    }

    if (nextWidget !== activeWidget) {
      const actionNextWidget = document.querySelector(
        `[data-panel-id=${nextWidget}]`
      );
      actionNextWidget.hidden = false;
    }
  });

  return (
    <>
      <CalciteShellPanel
        width="1"
        slot="panel-start"
        position="start"
        id="left-shell-panel"
        displayMode="dock"
      >
        <CalciteActionBar slot="action-bar">
          <CalciteAction
            data-action-id="layers"
            icon="layers"
            text="layers"
            id="layers"
            //textEnabled={true}
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="basemaps"
            icon="basemap"
            text="basemaps"
            id="basemaps"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="charts"
            icon="graph-time-series"
            text="Progress Chart"
            id="charts"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="handedover-charts"
            icon="graph-bar-side-by-side"
            text="Handed-Over Area"
            id="handedover-charts"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="directline-measure"
            icon="measure-line"
            text="Line Measurement"
            id="directline-measure"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="area-measure"
            icon="measure-area"
            text="Area Measurement"
            id="area-measure"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>

          <CalciteAction
            data-action-id="information"
            icon="information"
            text="Information"
            id="information"
            onClick={(event) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></CalciteAction>
        </CalciteActionBar>

        <CalcitePanel
          heading="Layers"
          height="l"
          width="l"
          data-panel-id="layers"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-layer-list
            referenceElement="arcgis-scene"
            selectionMode="multiple"
            visibilityAppearance="checkbox"
            // show-collapse-button
            show-filter
            filter-placeholder="Filter layers"
            listItemCreatedFunction={defineActions}
            onarcgisTriggerAction={(event) => {
              const { id } = event.detail.action;
              if (id === "full-extent-ngcpwa") {
                arcgisScene
                  ?.goTo(ngcp_working_area.fullExtent)
                  .catch((error) => {
                    if (error.name !== "AbortError") {
                      console.error(error);
                    }
                  });
              } else if (id === "full-extent-ngcptagged") {
                arcgisScene
                  ?.goTo(ngcp_tagged_structureLayer.fullExtent)
                  .catch((error) => {
                    if (error.name !== "AbortError") {
                      console.error(error);
                    }
                  });
              }
            }}
          ></arcgis-layer-list>
        </CalcitePanel>

        <CalcitePanel
          heading="Basemaps"
          height="l"
          data-panel-id="basemaps"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-basemap-gallery referenceElement="arcgis-scene"></arcgis-basemap-gallery>
        </CalcitePanel>

        <CalcitePanel
          class="timeSeries-panel"
          height="l"
          data-panel-id="charts"
          hidden
        ></CalcitePanel>

        <CalcitePanel
          class="handedOverArea-panel"
          height="l"
          data-panel-id="handedover-charts"
          hidden
        ></CalcitePanel>

        <CalcitePanel
          heading="Direct Line Measure"
          height="l"
          width="l"
          data-panel-id="directline-measure"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-directline-measurement-3d
            id="directLineMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
            // onarcgisPropertyChange={(event) => console.log(event.target.id)}
          ></arcgis-directline-measurement-3d>
        </CalcitePanel>

        <CalcitePanel
          heading="Area Measure"
          height="l"
          width="l"
          data-panel-id="area-measure"
          style={{ width: "18vw" }}
          hidden
        >
          <arcgis-area-measurement-3d
            id="areaMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
            icon="measure-area"
          ></arcgis-area-measurement-3d>
        </CalcitePanel>

        <CalcitePanel heading="Description" data-panel-id="information" hidden>
          {nextWidget === "information" ? (
            <div className="informationDiv">
              <ul>
                <div>
                  <b style={{ color: "white", fontWeight: "bold" }}>
                    --- How to Use Dropdown List ---
                  </b>
                </div>
                <li>
                  You can <b>filter the data</b> by City and Barangy using
                  dropdown lists.
                </li>
                <li>
                  <b>Click a tab</b> below the dropdown lists to view progress
                  on land, structure, or NLO in charts.
                </li>

                <div>
                  <b style={{ color: "white", fontWeight: "bold" }}>
                    --- How to Use Chart ---
                  </b>
                </div>
                <li>
                  <b>Click series in pie charts</b> to view progress on the
                  corresponding lots/structures/NLO on the map.
                </li>
                <li>
                  <b>Lots under expropriation</b> are available in the 'Expro
                  List' tab.
                </li>
                <li>
                  <b>Pie chart for lands</b> represent <b>private lands only</b>
                  .
                </li>
                <li>
                  Values in the bracket of Land legend represent the total
                  affected areas in square meters corresponeding to milestone
                  status.
                </li>
                <li>
                  <b>Permit-to-Enter</b> represents both public and private
                  lands{" "}
                </li>
                <li>
                  <b>Progress Chart</b> indicates the number of handed-over lots
                  for both public and private lands{" "}
                </li>
                <li>
                  <b>Handed-Over</b> represents both public and privalte lands.
                </li>
              </ul>
            </div>
          ) : (
            <div className="informationDiv" hidden></div>
          )}
        </CalcitePanel>
      </CalciteShellPanel>

      {nextWidget === "charts" && nextWidget !== activeWidget && (
        <LotProgressChart />
      )}

      {nextWidget === "handedover-charts" && nextWidget !== activeWidget && (
        <HandedOverAreaChart />
      )}
    </>
  );
}

export default ActionPanel;
