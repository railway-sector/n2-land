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
  lotLayer,
  lotLayerRenderer,
} from "../layers";
import { use, useEffect } from "react";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { MyContext } from "../contexts/MyContext";

export default function MapDisplay() {
  const {
    updateDatefields,
    updateStatusdatefield,
    updateHandedoverAreafield,
    updateAffectedAreafield,
  } = use(MyContext);

  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  useEffect(() => {
    // Extract status date fields for time slider
    lotLayer.when(() => {
      const all_fields: string[] = [];
      lotLayer?.fields.map((field) => {
        all_fields.push(field.name);
      });

      const date_fields = all_fields.filter(
        (field: any) => field.startsWith("x") && !isNaN(field.slice(1)),
      );

      // Re-order date fields in ascending order
      date_fields.sort((a: any, b: any) => {
        const a_date: any = new Date(
          Number(a.slice(1, 5)),
          Number(a.slice(5, 7)) - 1,
          Number(a.slice(7, 9)),
        );
        const b_date: any = new Date(
          Number(b.slice(1, 5)),
          Number(b.slice(5, 7)) - 1,
          Number(b.slice(7, 9)),
        );
        return a_date - b_date;
      });

      const latest_date = date_fields[date_fields.length - 1]; // E.g., "x20260220"
      updateDatefields(date_fields);
      updateStatusdatefield(latest_date);
      updateHandedoverAreafield(`${latest_date}_HOA`);
      updateAffectedAreafield(`${latest_date}_TAA`);

      // Default lot layer renderer
      lotLayerRenderer.field = latest_date;
      lotLayer.renderer = lotLayerRenderer;
    });
  }, []);

  arcgisScene?.viewOnReady(() => {
    arcgisScene?.map?.add(pierAccessLayer);
    arcgisScene?.map?.add(lotGroupLayer);
    arcgisScene?.map?.add(ngcp2_groupLayer);
    arcgisScene?.map?.add(structureLayer);
    arcgisScene?.map?.add(nloLoOccupancyGroupLayer);
    arcgisScene?.map?.add(alignmentGroupLayer);
    arcgisScene?.map?.add(stationLayer);

    // Search components
    const sources: any = [
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
    arcgisScene.hideAttribution = true;
    arcgisSearch?.sources.push(...sources);
  });

  return (
    <>
      <arcgis-scene
        basemap="dark-gray-vector"
        ground="world-elevation"
        viewingMode="local"
        center="120.5793, 15.18"
        zoom={10}
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
