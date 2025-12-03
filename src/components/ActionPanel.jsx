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
import "@arcgis/map-components/components/arcgis-direct-line-measurement-3d";
import "@arcgis/map-components/components/arcgis-area-measurement-3d";
import { defineActions } from "../uniqueValues";
import {
  ngcp_tagged_structureLayer,
  ngcp_working_area,
  prowOthersLayer,
} from "../layers";
import HandedOverAreaChart from "./HandedOverAreaChart";
import LotProgressChart from "./LotProgressChart";

function ActionPanel() {
  const [activeWidget, setActiveWidget] = useState(null);
  const [nextWidget, setNextWidget] = useState(null);
  const arcgisScene = document.querySelector("arcgis-scene");
  const directLineMeasure = document.querySelector(
    "arcgis-direct-line-measurement-3d"
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
        <CalciteActionBar
          slot="action-bar"
          style={{
            borderStyle: "solid",
            borderRightWidth: 3.5,
            borderLeftWidth: 5,
            borderBottomWidth: 5,
            borderColor: "#555555",
          }}
        >
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
              } else if (id === "full-extent-sapangbalenriver") {
                arcgisScene?.goTo(prowOthersLayer.fullExtent).catch((error) => {
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
          <arcgis-direct-line-measurement-3d
            id="directLineMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
            // onarcgisPropertyChange={(event) => console.log(event.target.id)}
          ></arcgis-direct-line-measurement-3d>
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
            <div style={{ paddingLeft: "20px" }}>
              This smart map shows the progress on the following:
              <ul>
                <li>Land Aquisition, </li>
                <li>Structures, </li>
                <li>Housedholds (NLOs), </li>
                <li>Lots under Expropriation, </li>
              </ul>
              <div style={{ paddingLeft: "20px" }}>
                <li>
                  The source of data: <b>Master List tables</b> provided by the
                  RAP Team.
                </li>
              </div>
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
