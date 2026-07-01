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
  sources,
} from "../layers";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  timesliderFieldKeys,
  datefieldKeys,
  dateDisplayKeys,
} from "../interfaceKeys";
import { addLayersToMap, dateUpdate, getSortDates } from "../query";
import { updatedDateCategoryNames } from "../uniqueValues";
import type {
  TimesliderFieldsTypes,
  DateFieldsType,
  DisplayDates,
} from "../interfaceKeys";

export default function MapDisplay() {
  const queryClient = useQueryClient();
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  //--- As of Date and days Passed
  const { data: newAsOfDate } = useQuery<DisplayDates | any>({
    queryKey: [dateDisplayKeys.selected, updatedDateCategoryNames[0]],
    queryFn: () => dateUpdate(updatedDateCategoryNames[0]),
    select: (response) => {
      return {
        asOfDate: response[0][0],
        daysPass: response[0][1],
      };
    },
    staleTime: Infinity,
  });
  queryClient.setQueryData<DisplayDates>(dateDisplayKeys.selected, newAsOfDate);

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
      const response = await dateUpdate(updatedDateCategoryNames[0]);
      return {
        dateFields: await getSortDates(lotLayer),
        latestasofdate: response[0][2],
      };
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  queryClient.setQueryData<DateFieldsType>(datefieldKeys.selected, dateField);

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
