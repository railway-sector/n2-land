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
  meralco_tss10_groupLayer,
} from "../layers";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  timesliderFieldKeys,
  datefieldKeys,
  latestDateKeys,
} from "../interfaceKeys";
import { fetchDateInfo, getSortDates } from "../Query";
import { updatedDateCategoryNames } from "../uniqueValues";
import type {
  TimesliderFieldsTypes,
  DateFieldsType,
  LatestDateType,
} from "../interfaceKeys";

export default function MapDisplay() {
  const queryClient = useQueryClient();
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  //--- Latest date
  const { data: latestDate } = useQuery<LatestDateType | any>({
    queryKey: [latestDateKeys.selected, updatedDateCategoryNames[0]],
    queryFn: () => fetchDateInfo(updatedDateCategoryNames[0]),
    select: (response) => {
      return {
        latestasofdate: response[0][2],
      };
    },
    staleTime: Infinity,
  });
  queryClient.setQueryData<LatestDateType>(latestDateKeys.selected, latestDate);

  //--- Declare only in preparation for timeslider
  const { data: dateList } = useQuery<TimesliderFieldsTypes | any>({
    queryKey: [timesliderFieldKeys.selected], // lotLayer is a dependency
    queryFn: async () => {
      return {};
    },
    staleTime: Infinity,
  });
  queryClient.setQueryData<TimesliderFieldsTypes>(
    timesliderFieldKeys.selected,
    dateList,
  );

  //--- Dates array for time slider
  const { data: dateField } = useQuery<DateFieldsType | any>({
    queryKey: [datefieldKeys.selected, lotLayer], // lotLayer is a dependency
    queryFn: async () => {
      return {
        dateFields: await getSortDates(lotLayer),
      };
    },
    staleTime: Infinity,
  });
  queryClient.setQueryData<DateFieldsType>(datefieldKeys.selected, dateField);

  //--- Add layers to scene view
  arcgisScene?.viewOnReady(() => {
    arcgisScene?.map?.add(pierAccessLayer);
    arcgisScene?.map?.add(lotGroupLayer);
    arcgisScene?.map?.add(ngcp2_groupLayer);
    arcgisScene?.map?.add(structureLayer);
    arcgisScene?.map?.add(nloLoOccupancyGroupLayer);
    arcgisScene?.map?.add(meralco_tss10_groupLayer);
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
