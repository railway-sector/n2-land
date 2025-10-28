import { useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import "@arcgis/map-components/dist/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-search";

import {
  structureLayer,
  pierAccessLayer,
  stationLayer,
  alignmentGroupLayer,
  nloLoOccupancyGroupLayer,
  lotGroupLayer,
  ngcp2_groupLayer,
  lotLayer,
} from "../layers";
import "@esri/calcite-components/dist/components/calcite-button";

function MapDisplay() {
  const [sceneView, setSceneView] = useState();
  const arcgisScene = document.querySelector("arcgis-scene");
  const arcgisSearch = document.querySelector("arcgis-search");

  useEffect(() => {
    if (sceneView) {
      arcgisScene.map.add(pierAccessLayer);
      arcgisScene.map.add(lotGroupLayer);
      arcgisScene.map.add(ngcp2_groupLayer);
      arcgisScene.map.add(structureLayer);
      arcgisScene.map.add(nloLoOccupancyGroupLayer);
      arcgisScene.map.add(alignmentGroupLayer);
      arcgisScene.map.add(stationLayer);

      arcgisSearch.sources = [
        {
          layer: lotLayer,
          searchFields: ["LotID"],
          displayField: "LotID",
          exactMatch: false,
          outFields: ["LotID"],
          name: "Lot ID",
          placeholder: "example: 10083",
        },
        {
          layer: structureLayer,
          searchFields: ["StrucID"],
          displayField: "StrucID",
          exactMatch: false,
          outFields: ["StrucID"],
          name: "Structure ID",
          placeholder: "example: NSRP-01-02-ML007",
        },
        {
          layer: pierAccessLayer,
          searchFields: ["PierNumber"],
          displayField: "PierNumber",
          exactMatch: false,
          outFields: ["PierNumber"],
          name: "Pier No",
          zoomScale: 1000,
          placeholder: "example: P-288",
        },
      ];
      arcgisSearch.allPlaceholder = "LotID, StructureID, Chainage";
      arcgisSearch.includeDefaultSourcesDisabled = true;
      arcgisSearch.locationDisabled = true;
    }
  });

  return (
    <arcgis-scene
      // item-id="5ba14f5a7db34710897da0ce2d46d55f"
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom="10"
      center="120.5793, 15.18"
      onarcgisViewReadyChange={(event) => {
        setSceneView(event.target);
      }}
    >
      <arcgis-compass position="top-right"></arcgis-compass>
      <arcgis-expand close-on-esc position="top-right" mode="floating">
        <arcgis-search></arcgis-search>
        {/* <arcgis-placement>
          <calcite-button>Placeholder</calcite-button>
        </arcgis-placement> */}
      </arcgis-expand>
      <arcgis-zoom position="bottom-right"></arcgis-zoom>
    </arcgis-scene>
  );
}

export default MapDisplay;
