import "@esri/calcite-components/components/calcite-tabs";
import "@esri/calcite-components/components/calcite-tab";
import "@esri/calcite-components/components/calcite-tab-nav";
import "@esri/calcite-components/components/calcite-tab-title";
import "@esri/calcite-components/components/calcite-panel";
import "@esri/calcite-components/components/calcite-shell-panel";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import LotChart from "./ChartLot";
import "../index.css";
import StructureChart from "./ChartStructure";
import NloChart from "./ChartNlo";
import ExpropriationList from "./ExpropriationList";
import { primaryLabelColor } from "../uniqueValues";
import { useState } from "react";

function ChartMain() {
  const [panelWidth, setPanelWidth] = useState<string>("40%");
  const [panelHeader, setPanelHeader] = useState<string>("Chart");
  const [tabName, setTabName] = useState<string>("Land");

  const handleTabChange = (event: any) => {
    setTabName(event.target.selectedTitle.textContent);
  };

  const handlePanelCollapse = (event: any) => {
    const collapse_state = event.target.collapsed;

    if (collapse_state) {
      setPanelWidth("50px");
      setPanelHeader("");
    } else {
      setPanelWidth("40%");
      setPanelHeader("Chart");
    }
  };
  return (
    <>
      <calcite-panel
        scale="s"
        slot="panel-end"
        collapsible
        heading={panelHeader}
        headingLevel={3}
        id="chart-panel"
        collapseDirection="up"
        style={{
          "--calcite-panel-heading-text-color": primaryLabelColor,
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          borderColor: "#555555",
          width: panelWidth,
          overflowY: "auto",
          display: "block", // without adding display, background will not disappear.
          scrollbarWidth: "none",
        }}
        onClick={handlePanelCollapse}
      >
        <calcite-tabs
          style={{
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#555555",
            backgroundColor: "#2b2b2b",
          }}
          layout="center"
          scale="m"
        >
          <calcite-tab-nav
            slot="title-group"
            id="thetabs"
            oncalciteTabChange={handleTabChange}
          >
            <calcite-tab-title>Land</calcite-tab-title>
            <calcite-tab-title>Structure</calcite-tab-title>
            <calcite-tab-title>Households</calcite-tab-title>
            <calcite-tab-title>ExproList</calcite-tab-title>
          </calcite-tab-nav>

          {/* CalciteTab: Lot */}
          <calcite-tab>
            <LotChart />
          </calcite-tab>

          {/* CalciteTab: Structure */}
          <calcite-tab>
            {tabName === "Structure" && <StructureChart />}
          </calcite-tab>

          {/* CalciteTab: Non-Land Owner */}
          <calcite-tab>{tabName === "Households" && <NloChart />}</calcite-tab>

          {/* CalciteTab: List of Lots under Expropriation */}
          <calcite-tab>
            {tabName === "ExproList" && <ExpropriationList />}
          </calcite-tab>
        </calcite-tabs>
      </calcite-panel>
    </>
  );
}

export default ChartMain;
