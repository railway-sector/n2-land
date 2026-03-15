/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable array-callback-return */
import { use, useEffect, useState } from "react";
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

import { chart_width, lotStatusField, statusLotNumber } from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";

import "../index.css";
import { MyContext } from "../contexts/MyContext";
import { queryStatisticsLayer } from "../Query";

// Zoom in to selected lot from expropriation list
let highlightSelect: any;
function resultClickHandler(event: any) {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const queryExtent = new Query({
    objectIds: [event.target.value],
  });
  lotLayer.queryExtent(queryExtent).then((result: any) => {
    result.extent &&
      arcgisScene?.goTo({
        target: result.extent,
        // speedFactor: 2,
        zoom: 17,
      });
  });

  arcgisScene?.whenLayerView(lotLayer).then((layerView: any) => {
    highlightSelect && highlightSelect.remove();
    highlightSelect = layerView.highlight([event.target.value]);

    arcgisScene?.view.on("click", () => {
      layerView.filter = null;
      highlightSelect.remove();
    });
  });
}

const ExpropriationList = () => {
  const { municipals, barangays } = use(MyContext);

  // Obtain Status number for 'For Expropriation'
  const find = statusLotNumber.filter((e) =>
    e.category.includes("Expropriation"),
  );
  const statusExproValue = find[0]?.value;
  const [exproItem, setExproItem] = useState<undefined | any>([]);

  useEffect(() => {
    const queryExpro = `${lotStatusField} = ${statusExproValue}`;
    const query = lotLayer.createQuery();
    query.where = queryStatisticsLayer({
      municipal: municipals,
      barangay: barangays,
      queryField: queryExpro,
    });
    query.outFields = ["*"];

    query.returnGeometry = true;
    lotLayer.queryFeatures(query).then((result: any) => {
      setExproItem([]);
      result.features.map((feature: any, index: any) => {
        const attributes = feature.attributes;
        const lotid = attributes.LotID;
        const cp = attributes.CP;
        const municipal = attributes.Municipality;
        const landowner = attributes.LandOwner;
        const objectid = attributes.OBJECTID;
        const id = index;

        setExproItem((prev: any) => [
          ...prev,
          {
            id: id,
            lotid: lotid,
            landowner: landowner,
            municipality: municipal,
            cp: cp,
            objectid: objectid,
          },
        ]);
      });
    });
  }, [municipals, barangays]);

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
