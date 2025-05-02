import "@esri/calcite-components/dist/components/calcite-tabs";
import "@esri/calcite-components/dist/components/calcite-tab";
import "@esri/calcite-components/dist/components/calcite-tab-nav";
import "@esri/calcite-components/dist/components/calcite-tab-title";
import "@esri/calcite-components/dist/calcite/calcite.css";
import {
  CalciteTab,
  CalciteTabs,
  CalciteTabNav,
  CalciteTabTitle,
} from "@esri/calcite-components-react";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import { useEffect, useState } from "react";
import { lotLayer } from "../layers";

import LotChart from "./LotChart";
import "../index.css";
import "../App.css";
import StructureChart from "./StructureChart";
import NloChart from "./NloChart";
import ExpropriationList from "./ExpropriationList";

function MainChart() {
  const [lotLayerLoaded, setLotLayerLoaded] = useState<any>();
  const [chartTabName, setChartTabName] = useState("Land");

  // Somehow if you do not add arcgisScene here, the child components (ie., LotChart)
  // will not inherit arcgisScene
  // const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  useEffect(() => {
    lotLayer.load().then(() => {
      setLotLayerLoaded(lotLayer.loadStatus);
    });
  });

  return (
    <>
      <CalciteTabs
        style={{ width: "37%" }}
        slot="panel-end"
        layout="center"
        scale="m"
      >
        <CalciteTabNav
          slot="title-group"
          id="thetabs"
          onCalciteTabChange={(event: any) =>
            setChartTabName(event.srcElement.selectedTitle.className)
          }
        >
          <CalciteTabTitle class="Land">Land</CalciteTabTitle>
          <CalciteTabTitle class="Structure">Structure</CalciteTabTitle>
          <CalciteTabTitle class="NLO">NLO</CalciteTabTitle>
          <CalciteTabTitle class="ExproList">ExproList</CalciteTabTitle>
        </CalciteTabNav>

        {/* CalciteTab: Lot */}
        <CalciteTab>{lotLayerLoaded === "loaded" && <LotChart />}</CalciteTab>

        {/* CalciteTab: Structure */}
        <CalciteTab>
          {chartTabName === "Structure" && <StructureChart />}
        </CalciteTab>

        {/* CalciteTab: Non-Land Owner */}
        <CalciteTab>{chartTabName === "NLO" && <NloChart />}</CalciteTab>

        {/* CalciteTab: List of Lots under Expropriation */}
        <CalciteTab>
          {chartTabName === "ExproList" && <ExpropriationList />}
        </CalciteTab>
      </CalciteTabs>
    </>
  );
}

export default MainChart;
