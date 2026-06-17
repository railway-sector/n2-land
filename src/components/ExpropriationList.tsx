/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable array-callback-return */
import { lotLayer, querycExpro } from "../layers";
import Query from "@arcgis/core/rest/support/Query";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-list";
import "@esri/calcite-components/components/calcite-list-item";
import "@esri/calcite-components/components/calcite-shell-panel";
import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-chip";
import "@esri/calcite-components/components/calcite-chip-group";
import "@esri/calcite-components/components/calcite-avatar";
import "@esri/calcite-components/components/calcite-action-bar";
import { chart_width, lotStatusField, statusLotNumber } from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";

//--- Zoom in to selected lot from expropriation list
let highlightSelect: any;
async function resultClickHandler(event: any) {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const queryExtent = new Query({
    objectIds: [event.target.value],
  });
  const result = await lotLayer.queryExtent(queryExtent);
  result.extent &&
    arcgisScene?.goTo({
      target: result.extent,
      // speedFactor: 2,
      zoom: 17,
    });

  const layerView = await arcgisScene?.whenLayerView(lotLayer);
  highlightSelect && highlightSelect.remove();
  highlightSelect = layerView.highlight([event.target.value]);
  arcgisScene?.view.on("click", () => {
    layerView.filter = null;
    highlightSelect.remove();
  });
}

//--- List component
const ExpropriationList = () => {
  //--- 1. Location state
  const { data: selectedLocation } = useQuery<SelectedLocation | any>({
    queryKey: locationKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const municipality = selectedLocation?.municipality;
  const barangay = selectedLocation?.barangay;

  //--- Obtain Status number for 'For Expropriation'
  const find = statusLotNumber.filter((e) =>
    e.category.includes("Expropriation"),
  );
  const statusExproValue = find[0]?.value;

  //--- queryFeatures function
  async function queryFeatures() {
    const query = lotLayer.createQuery();

    querycExpro.qValues = [municipality, barangay];
    querycExpro.qExpression = `${lotStatusField} = ${statusExproValue}`;
    query.where = querycExpro.queryExpression();
    query.outFields = ["*"];
    query.returnGeometry = true;

    return await lotLayer?.queryFeatures(query);
  }

  //--- Obtain queried Features
  const { data } = useQuery<any>({
    queryKey: [municipality, barangay, lotStatusField],
    queryFn: () => queryFeatures(),
    select: (response) => {
      return response.features;
    },
  });

  const exproItem = data
    ? data.map((feature: any, index: number) => {
        const attributes = feature.attributes;
        return {
          id: index,
          lotid: attributes.LotID,
          landowner: attributes.LandOwner,
          municipality: attributes.Municipality,
          cp: attributes.CP,
          objectid: attributes.OBJECTID,
        };
      })
    : [];

  return (
    <>
      <calcite-list
        id="result-list"
        label="exproListLabel"
        displayMode="nested"
        style={{ width: chart_width }}
      >
        {exproItem && // Extract unique objects from the array
          exproItem
            .filter(
              (ele: any, ind: any) =>
                ind ===
                exproItem.findIndex(
                  (elem: any) => elem.objectid === ele.objectid,
                ),
            )
            .map((result: any) => {
              return (
                // need 'key' to upper div and inside CalciteListItem
                <calcite-list-item
                  key={result.id}
                  expanded
                  label={result.lotid}
                  description={result.landowner}
                  value={result.objectid}
                  selected={undefined}
                  oncalciteListItemSelect={(event: any) =>
                    resultClickHandler(event)
                  }
                  style={{ "--calcite-list-label-text-color": "red" }}
                >
                  <calcite-chip
                    value={result.cp}
                    label={""}
                    slot="content-end"
                    scale="s"
                    id="exproListChip"
                  >
                    <calcite-avatar
                      full-name={result.municipality}
                      scale="s"
                      style={{ marginTop: "3px" }}
                    ></calcite-avatar>
                    <span
                      style={{
                        top: -7,
                        bottom: 1,
                        position: "relative",
                        paddingLeft: "3px",
                      }}
                    >
                      {result.cp}
                    </span>
                  </calcite-chip>
                </calcite-list-item>
              );
            })}
      </calcite-list>
    </>
  );
};

export default ExpropriationList;
