import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";
import ExtrudeSymbol3DLayer from "@arcgis/core/symbols/ExtrudeSymbol3DLayer";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D";
import IconSymbol3DLayer from "@arcgis/core/symbols/IconSymbol3DLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";

import {
  statusLotEndorsedLabel,
  statusLotEndorsedQuery,
  statusLotLabel,
  statusLotQuery,
  statusNloLabel,
  statusNloSymbolRef,
  statusStructureQuery,
  statusStructureLabel,
  statusStructureOccupancyLabel,
  statusStructureOccupancyRef,
  statusStructureOwnershipColor,
  statusStructureOwnershipLabel,
  statusNloQuery,
  valueLabelColor,
  lotStatusField,
  lotHandedOverDateField,
  percentHandedOverField,
  municipalityField,
  barangayField,
  landOwnerField,
  cpField,
  endorsedField,
  landUseField,
  handedOverLotField,
  nloStatusField,
  nloLoStatusField,
  occupancyField,
} from "./uniqueValues";

export const drone_image_point_layer = new FeatureLayer({
  portalItem: {
    id: "ef71df6d19294328a5b756c4806c9c67",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Drone Image",
  outFields: ["*"],
  popupEnabled: false,
});

export const test_lot_layer = new FeatureLayer({
  portalItem: {
    id: "e8b886da76ae474f8985f3ac26f8792b",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },

  title: "Drone Image",
  outFields: ["*"],
  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "b2a118b088a44fa0a7a84acbe0844cb2",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});

/* Chainage Layer  */
const labelChainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: {
      size: 15,
      weight: "bold",
    },
  },
});

const chainageRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: {
      width: 0.2,
      color: "black",
    },
  }),
});

export const chainageLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 5,
  title: "Chainage",
  elevationInfo: {
    mode: "relative-to-ground",
  },
  labelingInfo: [labelChainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainageRenderer,

  popupEnabled: false,
});

/* Station Box */
const stationBoxRenderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "00_Platform",
      label: "Platform",
      symbol: new SimpleFillSymbol({
        color: [160, 160, 160],
        style: "backward-diagonal",
        outline: {
          width: 1,
          color: "black",
        },
      }),
    },
    {
      value: "00_Platform 10car",
      label: "Platform 10car",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "cross",
        outline: {
          width: 1,
          color: "black",
          style: "short-dash",
        },
      }),
    },
    {
      value: "00_Station",
      label: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: {
          width: 2,
          color: [115, 0, 0],
        },
      }),
    },
  ],
});

export const stationBoxLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  renderer: stationBoxRenderer,
  minScale: 150000,
  maxScale: 0,
  title: "Station Box",

  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* ROW Layer */
const prowRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
    // style: "dash",
  }),
});

export const prowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/N2_Alignment/FeatureServer/1",
  layerId: 1,
  title: "PROW",
  popupEnabled: false,
  renderer: prowRenderer,
});
// prowLayer.listMode = "hide";

/* PROW others */
const prowOthersRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "red",
    width: "2px",
    style: "dash",
  }),
});

export const prowOthersLayer = new FeatureLayer({
  portalItem: {
    id: "d96c5a8d86e54587ae09174b10fc90bd",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "Additional Area due to Sapang Balen River Training",
  renderer: prowOthersRenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* PNR */
const pnrRenderer = new UniqueValueRenderer({
  field: "OwnershipType",
  uniqueValueInfos: [
    {
      value: 1, // RP
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
    {
      value: 2, // PNR
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
    {
      value: 3, // BCDA
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: {
          width: 0.5,
          color: "black",
        },
      }),
    },
  ],
});

export const pnrLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  title: "Land (Excluded for Acquisition)",
  definitionExpression: "OwnershipType IN (1, 2, 3)",

  elevationInfo: {
    mode: "on-the-ground",
  },
  labelsVisible: false,
  renderer: pnrRenderer,
  popupTemplate: {
    title: "<div style='color: #eaeaea'>{LandOwner} ({LotID})</div>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "OwnershipType",
            label: "Ownership Type",
          },
          {
            fieldName: "HandOverDate",
            label: "Hand-Over Date",
          },
          {
            fieldName: "Municipality",
          },
          {
            fieldName: "Barangay",
          },
          {
            fieldName: "LandOwner",
            label: "Land Owner",
          },
        ],
      },
    ],
  },
});

/* Station Layer */
const labelClass = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#d4ff33",
        },
        size: 15,
        halo: {
          color: "black",
          size: 0.5,
        },
        font: {
          family: "Ubuntu Mono",
          //weight: "bold"
        },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 700,
      minWorldLength: 80,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.Station",
    //value: "{TEXTSTRING}"
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "N2 Stations",
  labelingInfo: [labelClass],
  elevationInfo: {
    mode: "relative-to-ground",
  },
});
stationLayer.listMode = "hide";

/* The colors used for the each transit line */
const lotIdLabel = new LabelClass({
  labelExpressionInfo: { expression: "$feature.LotID" },
  symbol: {
    type: "text",
    color: "black",
    haloColor: "white",
    haloSize: 0.5,
    font: {
      size: 11,
      weight: "bold",
    },
  },
});

/* uniqueRenderer */
export const lotDefaultSymbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: {
    // autocasts as new SimpleLineSymbol()
    color: [110, 110, 110],
    width: 0.7,
  },
});

export const lotLayerRendererUniqueValueInfos = statusLotLabel.map(
  (status: any, index: any) => {
    return Object.assign({
      value: index + 1,
      label: status,
      symbol: new SimpleFillSymbol({
        color: statusLotQuery[index]?.color,
      }),
    });
  },
);

export const lotLayerRenderer = new UniqueValueRenderer({
  field: undefined,
  defaultSymbol: lotDefaultSymbol, // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: lotLayerRendererUniqueValueInfos,
});

// Custom popup for lot layer
const customContentLot = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    // Extract AsscessDate of clicked pierAccessLayer
    const handedOverDate = event.graphic.attributes[lotHandedOverDateField];
    const handOverArea = event.graphic.attributes[percentHandedOverField];
    const statusLot = event.graphic.attributes[lotStatusField];
    const landUse = event.graphic.attributes[landUseField];
    const municipal = event.graphic.attributes[municipalityField];
    const barangay = event.graphic.attributes[barangayField];
    const landOwner = event.graphic.attributes[landOwnerField];
    const cpNo = event.graphic.attributes[cpField];
    const endorse = event.graphic.attributes[endorsedField];
    const endorsed = statusLotEndorsedLabel[endorse];
    const remarks = event.graphic.attributes["Remarks"];
    const note = event.graphic.attributes["note"];

    // let daten: any;
    let date: any;
    if (handedOverDate) {
      const daten = new Date(handedOverDate);
      const year = daten.toLocaleString("default", { year: "numeric" });
      const month = daten.toLocaleString("default", { month: "2-digit" });
      const day = daten.toLocaleString("default", { day: "2-digit" });
      date = `${year}-${month}-${day}`;
    } else {
      date = "Undefined";
    }
    // Convert numeric to date format 0
    //const daten = new Date(handedOverDate);
    //const date = dateFormat(daten, 'MM-dd-yyyy');
    //<li>Hand-Over Date: <b>${date}</b></li><br>

    return `
    <div style='color: #eaeaea'>
    <ul><li>Handed-Over Area: <span style="color: #d9dc00ff; font-weight: bold">${handOverArea} %</span></li>
    <li>Handed-Over Date: <span style="color: #d9dc00ff; font-weight: bold">${date}</span></li>
              <li>Status:           <span style="color: #d9dc00ff; font-weight: bold">${
                statusLot >= 0 ? statusLotLabel[statusLot - 1] : ""
              }</span></li>
              <li>Land Use:         <span style="color: #d9dc00ff; font-weight: bold">${landUse}</span></li>
              <li>Municipality:     <span style="color: #d9dc00ff; font-weight: bold">${municipal}</span></li>
              <li>Barangay:         <span style="color: #d9dc00ff; font-weight: bold">${barangay}</span></li>
              <li>Land Owner:       <span style="color: #d9dc00ff; font-weight: bold">${landOwner}</span>
              <li>CP:               <span style="color: #d9dc00ff; font-weight: bold">${cpNo}</span><br>
              <li>Endorsed:         <span style="color: #d9dc00ff; font-weight: bold">${endorsed}</span></li>
              <li>Acquisition Status: <span style="color: #d9dc00ff; font-weight: bold">${remarks}</span></li>
              <li>Note: <span style="color: #d9dc00ff; font-weight: bold">${note}</span></li></ul>
              </div>
              `;
  },
});

const templateLot = new PopupTemplate({
  title: "<div style='color: #eaeaea'>Lot No.: <b>{LotID}</b></div>",
  lastEditInfoEnabled: false,
  content: [customContentLot],
});

export const lotLayer = new FeatureLayer({
  portalItem: {
    id: "e8b886da76ae474f8985f3ac26f8792b",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  labelingInfo: [lotIdLabel],
  renderer: lotLayerRenderer,
  popupTemplate: templateLot,
  title: "Land Acquisition",
  minScale: 150000,
  maxScale: 0,
  //labelsVisible: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

// Candidate Lot Layer
const studiedLotRenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#808080",
    style: "horizontal",
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: "#808080", //#DF73FF,
      width: "6px",
    },
  }),
});

export const candidate_lot_layer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  definitionExpression: "OptLots = 1",
  labelingInfo: [lotIdLabel],
  renderer: studiedLotRenderer,
  popupTemplate: templateLot,
  title: "Candidate Lots of NSCR-Ex Passenger & Freight Line for Optimization",
  minScale: 150000,
  maxScale: 0,
  //labelsVisible: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Endorsed Lot Layer */
// Endorsed lot layer
const endorsedLayerRendererUniqueValueInfos = statusLotEndorsedLabel.map(
  (status: any, index: any) => {
    return Object.assign({
      value: index,
      label: status,
      symbol: new SimpleFillSymbol({
        color: statusLotEndorsedQuery[index].color,
      }),
    });
  },
);
const endorsedLayerRenderer = new UniqueValueRenderer({
  field: "Endorsed",
  defaultSymbol: lotDefaultSymbol,
  uniqueValueInfos: endorsedLayerRendererUniqueValueInfos,
});

export const endorsedLotLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  renderer: endorsedLayerRenderer,
  labelingInfo: [lotIdLabel],

  title: "Land Acquisition (Endorsed Status)",
  minScale: 150000,
  maxScale: 0,
  //labelsVisible: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});
endorsedLotLayer.popupTemplate = templateLot;

/* Supre Urgent Lots */
// const superUrgentLotRenderer = new UniqueValueRenderer({
//   field: "Urgent",

//   uniqueValueInfos: [
//     {
//       value: 0,
//       label: "Super Urgent",
//       symbol: new SimpleFillSymbol({
//         color: [255, 0, 0, 0],
//         outline: {
//           color: [255, 0, 0, 1],
//           width: 0.3,
//         },
//       }),
//     },
//   ],
// });

// export const superUrgentLotLayer = new FeatureLayer({
//   portalItem: {
//     id: '23500954a8d84a46886e76e6e0883a69',
//     portal: {
//       url: 'https://gis.railway-sector.com/portal',
//     },
//   },
//   layerId: 4,
//   definitionExpression: 'Urgent = 0',
//   renderer: superUrgentLotRenderer,
//   popupEnabled: false,
//   labelsVisible: false,
//   title: 'Super Urgent Lot',
//   elevationInfo: {
//     mode: 'on-the-ground',
//   },
// });

/* Handed-Over Lot (public + private) */
const handedOverLotRenderer = new UniqueValueRenderer({
  field: "HandedOver",

  uniqueValueInfos: [
    {
      value: 1,
      label: "Handed-Over",
      symbol: new SimpleFillSymbol({
        color: [0, 255, 255, 0.3], //[0, 255, 255, 0.1], #00ffff
        outline: new SimpleLineSymbol({
          color: "#00ffff",
          width: "4px",
        }),
      }),
    },
  ],
});

export const handedOverLotLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  definitionExpression: `${handedOverLotField} = 1`,
  renderer: handedOverLotRenderer,
  // popupEnabled: false,
  popupTemplate: templateLot,
  title: "Handed-Over (public + private)",
  elevationInfo: {
    mode: "on-the-ground",
  },
});
// handedOverLotLayer.listMode = "hide";

/* contractor accessible layer */
const accessible_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "purple",
    // style: 'cross',
    style: "solid",

    outline: {
      width: 1,
      color: "black",
    },
  }),
});
export const accessibleLotAreaLayer = new FeatureLayer({
  portalItem: {
    id: "32c788b35f7f4946b92820e7ae3cb9b3",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  renderer: accessible_renderer,
  title: "Handed-Over Area",
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Structure Layer */
const height = 5;
const edgeSize = 0.3;

const defaultStructureRenderer = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 5,
      material: {
        color: [0, 0, 0, 0.4],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: edgeSize,
      }),
    }),
  ],
});

const structureRendererUniqueValueInfos = statusStructureLabel.map(
  (status: any, index: any) => {
    return Object.assign({
      value: index + 1,
      symbol: new PolygonSymbol3D({
        symbolLayers: [
          new ExtrudeSymbol3DLayer({
            size: height,
            material: {
              color: statusStructureQuery[index].colorLayer,
            },
            edges: new SolidEdges3D({
              color: "#4E4E4E",
              size: edgeSize,
            }),
          }),
        ],
      }),
      label: status,
    });
  },
);

const structureRenderer = new UniqueValueRenderer({
  defaultSymbol: defaultStructureRenderer,
  defaultLabel: "Other",
  field: "StatusStruc",
  uniqueValueInfos: structureRendererUniqueValueInfos,
});

export const structureLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "Structure",
  renderer: structureRenderer,

  elevationInfo: {
    mode: "on-the-ground",
  },
  popupTemplate: {
    title: "<div style='color: #eaeaea'>{StrucID}</div>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "FamilyNumber",
            label: "<b>Number of Families</b>",
          },
          {
            fieldName: "StrucOwner",
            label: "Structure Owner",
          },
          {
            fieldName: "Municipality",
          },
          {
            fieldName: "Barangay",
          },
          {
            fieldName: "StatusStruc",
            label: "<p>Status for Structure</p>",
          },
          {
            fieldName: "Name",
          },
          {
            fieldName: "Status",
            label: "Households Ownership (structure) ",
          },
        ],
      },
    ],
  },
});

/* NGCP */
const ngcpPoleWARenderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [197, 0, 255],
    style: "backward-diagonal",
    outline: {
      color: "#C500FF",
      width: 0.7,
    },
  }),
});

export const ngcp_working_area = new FeatureLayer({
  portalItem: {
    id: "ef4460e67411480aa8315e897e9b172d",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  renderer: ngcpPoleWARenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
  definitionExpression: "SiteNo = '2'",
  title: "NGCP Pole Relocation Working Area",
});

const ngcp_tagged_structure_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    outline: {
      color: "#00ffffff",
      width: 1,
    },
  }),
});

export const ngcp_tagged_structureLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "NGCP Pole Relocation Tagged Structures",
  definitionExpression: "NGCP_Affected = 1",
  renderer: ngcp_tagged_structure_renderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
  popupEnabled: false,
});

// NLO Layer
const symbolSize = 30;

const nloRendererUniqueValueInfos = statusNloLabel.map(
  (status: any, index: any) => {
    return Object.assign({
      value: statusNloQuery[index].value,
      label: status,
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: statusNloSymbolRef[index],
            },
            size: symbolSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
      }),
    });
  },
);

const nloRenderer = new UniqueValueRenderer({
  field: nloStatusField,
  uniqueValueInfos: nloRendererUniqueValueInfos,
});

export const nloLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  renderer: nloRenderer,

  title: "Households",
  elevationInfo: {
    mode: "relative-to-scene",
  },
  minScale: 10000,
  maxScale: 0,
  popupTemplate: {
    title: `<div style='color: #eaeaea'>{StrucID}</div>`,
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Municipality",
          },
          {
            fieldName: "Barangay",
          },
          {
            fieldName: "StatusRC",
            label: "<p>Status for Relocation</p>",
          },
          {
            fieldName: "Name",
          },
          {
            fieldName: "Status",
            label: "Households Ownership (structure) ",
          },
        ],
      },
    ],
  },
});

/* Structure Ownership Layer */
const statusStructureOwnershipSymbolStyles: any = [
  "forward-diagonal",
  "vertical",
];

const structureOwnershipRendererUniqueValueInfos =
  statusStructureOwnershipLabel.map((status: any, index: any) => {
    return Object.assign({
      value: index + 1,
      label: status,
      symbol: new SimpleFillSymbol({
        style: statusStructureOwnershipSymbolStyles[index],
        color: statusStructureOwnershipColor[index],
        outline: {
          color: "#6E6E6E",
          width: 0.3,
        },
      }),
    });
  });

const NLOLORenderer = new UniqueValueRenderer({
  field: nloLoStatusField,
  uniqueValueInfos: structureOwnershipRendererUniqueValueInfos,
});

export const strucOwnershipLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  renderer: NLOLORenderer,
  layerId: 3,
  title: "Households Ownership (Structure)",

  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

/* Occupancy (Status of Relocation) */
const verticalOffsetExistingOccupancy = {
  screenLength: 10,
  maxWorldLength: 10,
  minWorldLength: 10,
};
const occupancyPointSize = 20;

const statusStructureOccupancyRendererUniqueValueInfos =
  statusStructureOccupancyLabel.map((status: any, index: any) => {
    return Object.assign({
      value: index,
      label: status,
      symbol: new PointSymbol3D({
        symbolLayers: [
          new IconSymbol3DLayer({
            resource: {
              href: statusStructureOccupancyRef[index],
            },
            size: occupancyPointSize,
            outline: {
              color: "white",
              size: 2,
            },
          }),
        ],
        verticalOffset: verticalOffsetExistingOccupancy,
        callout: {
          type: "line",
          color: [128, 128, 128, 0.6],
          size: 0.4,
          border: {
            color: "grey",
          },
        },
      }),
    });
  });

const occupancyRenderer = new UniqueValueRenderer({
  field: occupancyField,
  uniqueValueInfos: statusStructureOccupancyRendererUniqueValueInfos,
});

export const occupancyLayer = new FeatureLayer({
  portalItem: {
    id: "23500954a8d84a46886e76e6e0883a69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,

  title: "Occupancy (Structure)",
  renderer: occupancyRenderer,
  elevationInfo: {
    mode: "relative-to-scene",
  },
  popupTemplate: {
    title: "<div style='color: #eaeaea'>{StrucID}</div>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "StrucOwner",
            label: "Structure Owner",
          },
          {
            fieldName: "Municipality",
          },
          {
            fieldName: "Barangay",
          },
          {
            fieldName: "Occupancy",
            label: "<p>Status for Relocation(structure)</p>",
          },
          {
            fieldName: "Name",
          },
          {
            fieldName: "Status",
            label: "Households Ownership",
          },
        ],
      },
    ],
  },
});

/* Pier Head and Column */
const pHeight = 0;

const pierColumn = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 10,
      material: {
        color: [78, 78, 78, 0.5],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: 0.3,
      }),
    }),
  ],
});

const pileCap = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 3,
      material: {
        color: [200, 200, 200, 0.7],
      },
      edges: new SolidEdges3D({
        color: "#4E4E4E",
        size: 1.0,
      }),
    }),
  ],
});

const pierHeadRenderer = new UniqueValueRenderer({
  // defaultSymbol: new PolygonSymbol3D({
  //   symbolLayers: [
  //     {
  //       type: "extrude",
  //       size: 5, // in meters
  //       material: {
  //         color: "#E1E1E1",
  //       },
  //       edges: new SolidEdges3D({
  //         color: "#4E4E4E",
  //         size: 1.0,
  //       }),
  //     },
  //   ],
  // }),
  // defaultLabel: "Other",
  field: "Layer",
  legendOptions: {
    title: "Pile Cap/Column",
  },
  uniqueValueInfos: [
    {
      value: "Pier_Column",
      symbol: pierColumn,
      label: "Column",
    },
    /*
  {
    value: "Pier_Head",
    symbol: pierHead,
    label: "Pier Head"
  },
  */
    {
      value: "Pile_Cap",
      symbol: pileCap,
      label: "Pile Cap",
    },
  ],
});

export const pierHeadColumnLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  title: "Pile Cap/Column",
  definitionExpression: "Layer <> 'Pier_Head'",

  minScale: 150000,
  maxScale: 0,
  renderer: pierHeadRenderer,
  popupEnabled: false,
  elevationInfo: {
    mode: "on-the-ground",
  },
});
// pierHeadColumnLayer.listMode = 'hide';

/* Pier Point Layer with access dates */
// default label without access dates
const defaultPierAccessLabel = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: valueLabelColor,
        },
        size: 15,
        font: {
          family: "Ubuntu Mono",
          weight: "bold",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 80,
      maxWorldLength: 500,
      minWorldLength: 30,
    },
    callout: {
      type: "line",
      size: 0.5,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0.7],
      },
    },
  }),
  labelExpressionInfo: {
    expression: "$feature.PierNumber",
    //'DefaultValue($feature.GeoTechName, "no data")'
    //"IIF($feature.Score >= 13, '', '')"
    //value: "{Type}"
  },
  labelPlacement: "above-center",
  // where: 'AccessDate IS NULL',
});

// 1. Get unique dates
export const pierAccessLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  outFields: ["*"],
  layerId: 6,
  labelingInfo: [defaultPierAccessLabel], //[pierAccessReadyDateLabel, pierAccessNotYetLabel, pierAccessDateMissingLabel],
  title: "Pier Number", //'Pier with Access Date (as of October 2023)',
  minScale: 150000,
  maxScale: 0,
  // renderer: pierWorkableRenderer,
  elevationInfo: {
    mode: "on-the-ground",
  },
});

// Group layers //
export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [
    stationBoxLayer,
    chainageLayer,
    pierHeadColumnLayer,
    prowOthersLayer,
    prowLayer,
  ],
}); //map.add(alignmentGroupLayer, 0);

export const nloLoOccupancyGroupLayer = new GroupLayer({
  title: "Households Occupancy",
  visible: true,
  visibilityMode: "independent",
  layers: [occupancyLayer, strucOwnershipLayer, nloLayer],
});

export const lotGroupLayer = new GroupLayer({
  title: "Land",
  visible: true,
  visibilityMode: "independent",
  // layers: [endorsedLotLayer, lotLayer, handedOverLotLayer, superUrgentLotLayer, pnrLayer],
  layers: [
    endorsedLotLayer,
    lotLayer,
    candidate_lot_layer,
    pnrLayer,
    accessibleLotAreaLayer,
    handedOverLotLayer,
  ],
});

export const ngcp2_groupLayer = new GroupLayer({
  title: "NGCP Site 2",
  visible: false,
  visibilityMode: "independent",
  layers: [ngcp_tagged_structureLayer, ngcp_working_area],
});

/// Wiedget
