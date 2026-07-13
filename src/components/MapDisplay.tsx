import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-zoom";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import type { ArcgisScene } from "@arcgis/map-components/components/arcgis-scene";
import {
  structureLayer,
  pierAccessLayer,
  stationLayer,
  alignmentGroupLayer,
  nloLoOccupancyGroupLayer,
  lotGroupLayer,
  ngcp2_groupLayer,
  meralco_tss10_groupLayer,
  sources,
} from "../layers";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { addLayersToMap } from "../query";
import { useState } from "react";

export default function MapDisplay() {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;
  const [_mapView, setMapView] = useState<any>();

  //--- Add layers to scene view
  arcgisScene?.viewOnReady(() => {
    addLayersToMap(arcgisScene?.map, [
      pierAccessLayer,
      lotGroupLayer,
      ngcp2_groupLayer,
      structureLayer,
      nloLoOccupancyGroupLayer,
      meralco_tss10_groupLayer,
      alignmentGroupLayer,
      stationLayer,
    ]);

    arcgisSearch.allPlaceholder = "LotID, StructureID, Chainage";
    arcgisSearch.includeDefaultSourcesDisabled = true;
    arcgisSearch.locationDisabled = true;
    arcgisSearch?.sources.push(...sources);
    arcgisScene.hideAttribution = true;
    arcgisScene.view.environment.atmosphereEnabled = false;
    arcgisScene.view.environment.starsEnabled = false;
    if (arcgisScene?.map?.ground) {
      arcgisScene.map.ground.navigationConstraint = { type: "none" };
    }
  });

  return (
    <>
      <arcgis-scene
        basemap="dark-gray-vector"
        ground="world-elevation"
        viewingMode="local"
        center="120.5793, 15.18"
        zoom={10}
        onarcgisViewReadyChange={(event: any) => {
          setMapView(event.target);
        }}
      >
        <arcgis-compass slot="top-right"></arcgis-compass>
        <arcgis-expand close-on-esc slot="top-right" mode="floating">
          <arcgis-search></arcgis-search>
        </arcgis-expand>
        <arcgis-zoom slot="bottom-right"></arcgis-zoom>
      </arcgis-scene>
    </>
  );
}
