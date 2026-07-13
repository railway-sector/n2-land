/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable array-callback-return */
import { lotLayer } from "../layers";
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
import {
  barangay_f,
  chart_width,
  lot_status_f,
  lot_status_q,
  municipality_f,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { use, useMemo } from "react";
import { MyContext } from "../contexts/MyContext";
import { makeQuery } from "../query";

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

//--- queryFeatures function
interface QueryFeaturesType {
  layer: FeatureLayer;
  queryc: any;
}

async function queryFeatures({ layer, queryc }: QueryFeaturesType) {
  const query = lotLayer.createQuery();
  query.where = queryc.queryExpression();
  query.outFields = ["*"];
  query.returnGeometry = true;

  return await layer?.queryFeatures(query);
}

//--- Component for expropriation List
const ExpropriationList = () => {
  const { municipality, barangay } = use(MyContext);

  //--- Status value for Expro
  const exproV = lot_status_q.filter((e: any) =>
    e.category.includes("Expropriation"),
  )[0]?.value;

  //--- Make query expression
  const qV = [municipality, barangay];
  const qF = [municipality_f, barangay_f];
  const querycExpro = makeQuery(qV, qF, `${lot_status_f} = ${exproV}`);

  //--- Obtain queried Features
  const { data } = useQuery<any>({
    queryKey: [municipality, barangay, lot_status_f],
    queryFn: () => queryFeatures({ layer: lotLayer, queryc: querycExpro }),
    select: (response) => {
      return response.features;
    },
  });

  const exproItem =
    data &&
    data.map((feature: any, index: number) => {
      const attributes = feature.attributes;
      return {
        id: index,
        lotid: attributes.LotID,
        landowner: attributes.LandOwner,
        municipality: attributes.Municipality,
        cp: attributes.CP,
        objectid: attributes.OBJECTID,
      };
    });

  //--- When exproItem is not changed, do not render
  const uniqueExproItems = useMemo(() => {
    if (!exproItem) return [];
    const seen = new Map<any, any>();
    for (const item of exproItem) {
      if (!seen.has(item.objectid)) seen.set(item.objectid, item);
    }
    return [...seen.values()]; //--- extract only values (not key)
  }, [exproItem]);

  return (
    <>
      <calcite-list
        id="result-list"
        label="exproListLabel"
        displayMode="nested"
        style={{ width: chart_width }}
      >
        {uniqueExproItems.map((result: any) => (
          // need 'key' to upper div and inside CalciteListItem
          <calcite-list-item
            key={result.id}
            expanded
            label={result.lotid}
            description={result.landowner}
            value={result.objectid}
            selected={undefined}
            oncalciteListItemSelect={(event: any) => resultClickHandler(event)}
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
        ))}
      </calcite-list>
    </>
  );
};

export default ExpropriationList;
