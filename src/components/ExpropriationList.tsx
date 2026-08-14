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
  expro_status_q,
  expro_wop_f,
  lot_status_f,
  lot_status_q,
  municipality_f,
} from "../uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import "../index.css";
import { useQuery } from "@tanstack/react-query";
import { memo, use, useEffect, useMemo, useRef } from "react";
import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { MyContext } from "../contexts/MyContext";
import { fieldStatistic } from "../query";
import * as am5 from "@amcharts/amcharts5";
import {
  chartSetter,
  legendSetter,
  rootSetter,
  seriesSetter,
} from "../chartSetter";
import QueryExpressionLayers from "query-layers-expression";

//--- Highlight & zoom into clicked land
let highlight: any;

async function resultClickHandler(event: any) {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const qExtent = new Query({ objectIds: [event.target.value] });

  const result = await lotLayer.queryExtent(qExtent);
  result.extent && arcgisScene?.goTo({ target: result.extent, zoom: 17 });

  const lv = await arcgisScene?.whenLayerView(lotLayer);
  highlight && highlight.remove();
  highlight = lv.highlight([event.target.value]);

  arcgisScene?.view.on("click", () => {
    lv.filter = null;
    highlight.remove();
  });
}

//--- Return expro lots
interface QueryFeaturesType {
  layer: FeatureLayer;
  where: any;
}

//--------------------------//
//        queryFeatures     //
//--------------------------//
async function queryFeatures({ layer, where }: QueryFeaturesType) {
  const query = lotLayer.createQuery();
  query.where = where;
  query.outFields = [
    "LotID",
    "LandOwner",
    "Municipality",
    "Barangay",
    "CP",
    "OBJECTID",
    "WOP",
    "StatusLA",
  ];
  query.returnGeometry = true;
  return await layer?.queryFeatures(query);
}

//--------------------------//
//     ExpropriationList    //
//--------------------------//
function exproListData(
  municipality: string,
  barangay: string,
  statusField: string,
  baseFilter: any,
) {
  return useQuery<any>({
    queryKey: [municipality, barangay, statusField],
    queryFn: async () => {
      //--- Status value for Expro
      const exproV = lot_status_q.filter((e: any) =>
        e.category.includes("Expropriation"),
      )[0]?.value;

      const qe1 = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${statusField} = ${exproV}`,
      }).queryExpression();

      const qe2 = new QueryExpressionLayers({
        ...baseFilter,
        qExpression: `${expro_wop_f} = 1`,
      }).queryExpression();

      const [exproList, wop] = await Promise.all([
        queryFeatures({
          layer: lotLayer,
          where: qe1,
        }),

        fieldStatistic({
          where: qe2,
          layer: lotLayer,
          statisticField: "OBJECTID",
          statisticType: "count",
        }),
      ]);
      const totalExpro = exproList.features.length ?? 0;

      //--- Pie chart data
      const chartData = expro_status_q.map((f: any, i: any) => {
        return {
          category: f.category,
          value: i === 0 ? totalExpro - wop : wop,
          sliceSettings: { fill: am5.color(f.color) },
        };
      });
      return { features: exproList?.features, chartData, totalExpro, wop };
    },
    staleTime: Infinity,
  });
}

const ExpropriationList = memo(() => {
  const { municipality, barangay } = use(MyContext);

  //--- Base filter
  const baseFilter = {
    qFields: [municipality_f, barangay_f],
    qValues: [municipality, barangay],
  };

  //--- Fetch data
  const { data, isLoading } = exproListData(
    municipality,
    barangay,
    lot_status_f,
    baseFilter,
  );

  const exproList = data?.features ?? [];
  const chartData = useMemo(() => data?.chartData ?? [], [data]); //data?.chartData ?? [];
  const totalExpro = data?.totalExpro ?? 0;
  const totalWop = data?.wop ?? 0;

  //--- 3. Compile expro lots in an object
  const exproItem = exproList.map((feature: any, index: number) => {
    const attrs = feature.attributes;
    return {
      id: index,
      lotid: attrs.LotID,
      landowner: attrs.LandOwner,
      municipality: attrs.Municipality,
      cp: attrs.CP,
      objectid: attrs.OBJECTID,
    };
  });

  //--- Get unique expro lots (but re-rendered only when the list is changed.)
  const uniqueExproItems = useMemo(() => {
    if (!exproItem) return [];
    const seen = new Map<any, any>();
    for (const item of exproItem) {
      if (!seen.has(item.objectid)) seen.set(item.objectid, item);
    }
    return [...seen.values()];
  }, [exproItem]);

  //--- Pie chart renderer
  const pieSeriesRef = useRef<unknown | any | undefined>({});
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const chartID = "expro-pie2";

  useEffect(() => {
    const root = rootSetter({ chartID: chartID });
    const chart = chartSetter({ root: root });
    chartRef.current = chart;

    //---------------------------//
    //      Pie Series          //
    //--------------------------//
    const pieSeries = seriesSetter({
      chart: chart,
      root: root,
      categoryField: "category",
      valueField: "value",
      legendLabelText: "{category}",
      // legendValueText: "{valuePercentTotal.formatNumber('#.')}% ({value})",
      radius: 90,
      innerRadius: 50,
    });
    pieSeriesRef.current = pieSeries;
    chart.series.push(pieSeries);

    // Set slice opacity and stroke color
    pieSeries.slices.template.setAll({
      toggleKey: "none",
      fillOpacity: 0.9,
      stroke: am5.color("#ffffff"),
      strokeWidth: 0.5,
      strokeOpacity: 1,
      templateField: "sliceSettings",
      tooltipText: '{category}: {valuePercentTotal.formatNumber("#.")}%',
    });

    //--- Click pie series ---//
    pieSeries.slices.template.events.on("click", (ev: any) => {
      const selected: any = ev.target.dataItem?.dataContext;
      console.log(selected);
    });

    pieSeries.data.setAll(chartData);

    // Disabling labels and ticksll
    pieSeries.labels.template.setAll({
      visible: true,
      text: "{value} ({valuePercentTotal.formatNumber('#.')}%)",
      fill: am5.color("#ececec"),
      fontSize: 14,
      fontWeight: "500",
      radius: -55,
      inside: true,
    });

    //---------------------------//
    //           Legend          //
    //--------------------------//
    const legend = legendSetter({
      chart: chart,
      root: root,
      centerX: 50,
      x: 50,
    });
    legendRef.current = legend;

    // Center the legend as a whole within its parent
    legend.setAll({
      x: am5.percent(50),
      centerX: am5.percent(40),
      y: am5.percent(87),
    });

    // Force a 2-column grid layout
    legend.set("layout", root.gridLayout);
    legend.set("width", am5.percent(50)); // needed so columns have room to compute against
    legend.set(
      "layout",
      am5.GridLayout.new(root, { maxColumns: 2, fixedWidthGrid: true }),
    );
    legend.data.setAll(pieSeries.dataItems);

    legend.labels.template.setAll({
      fontSize: "0.7rem",
      fill: am5.color("#ffffff"),
    });

    legend.valueLabels.template.setAll({
      fontSize: "0.7rem",
      textAlign: "right",
      fill: am5.color("#ffffff"),
    });

    legend.itemContainers.template.setAll({
      paddingTop: 3,
      paddingBottom: 1,
    });

    legend.markers.template.setAll({
      width: 17,
      height: 17,
    });

    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10,
    });

    // Dispose root
    return () => {
      root.dispose();
    };
  }, [municipality, barangay, chartData, totalExpro, totalWop]);

  return (
    <>
      <div>
        <div
          style={{
            fontSize: "1.2rem",
            color: "#ececec",
            fontWeight: "bold",
            marginLeft: "20px",
            marginTop: "10px",
          }}
        >
          {`TOTAL EXPRO: ${totalExpro}`}
        </div>
        <div
          id={chartID}
          style={{
            width: "100%",
            height: "41vh",
            color: "white",
            opacity: isLoading || !uniqueExproItems.length ? 0 : 1,
          }}
        ></div>
      </div>

      <calcite-list
        id="result-list"
        label="exproListLabel"
        displayMode="nested"
        style={{
          overflowY: "auto",
          maxHeight: "40vh",
          scrollbarWidth: "none",
          opacity: isLoading || !uniqueExproItems.length ? 0 : 1,
        }}
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
});

export default ExpropriationList;
