import Collection from "@arcgis/core/core/Collection";
import ActionButton from "@arcgis/core/support/actions/ActionButton";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";
import ExtrudeSymbol3DLayer from "@arcgis/core/symbols/ExtrudeSymbol3DLayer";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D";
import IconSymbol3DLayer from "@arcgis/core/symbols/IconSymbol3DLayer";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { yearMonthDay } from "./query";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
const portalItem_url = { url: "https://gis.railway-sector.com/portal" };

export const portalItems = (id: any) => {
  return { id: id, portal: portalItem_url };
};

//--- cp list
export const cp_list = ["All", "N-01", "N-02", "N-03", "N-04", "N-05"];

export const monitorLists = ["Land Acquisition", "Structure", "Non Land Owner"];

//----------------------------------------------//
//              Chart Parameters                //
//----------------------------------------------//
// chart width
export const chart_width = "26vw";
export const chart_box_width = 250;

// labeling and value label color
export const primaryLabelColor = "#9ca3af";
export const valueLabelColor = "#d1d5db";

// Pier Workable properties
export const color_workable = "#38A800";
export const color_nonworkable = "#FF0000";
export const color_completed = "#0070ff";

//----------------------------------------------//
//          Lot Layer Parameters                //
//----------------------------------------------//
//--- Layer Fields
// Acronym:
// ho: handed over
// hoa: handed-over area
// hod: handed-over date
// pri: priority
// lu: land use
// pho: percent handed-over area
// aa: affected area

export const cp_f = "CP";
export const municipality_f = "Municipality";
export const barangay_f = "Barangay";

export const lot_hod_f = "HandOverDate";
export const lot_hdod_f = "HandedOverDate";
export const lot_id_f = "LotID";
export const lot_pri_f = "Priority1_1";
export const lot_status_f = "StatusLA";
export const lot_lo_f = "LandOwner";
export const lot_lu_f = "LandUse";
export const lot_endorsed_f = "Endorsed";
export const lot_ho_f = "HandedOver";
export const lot_hoa_f = "HandedOverArea";
export const lot_pho_f = "percentHandedOver";
export const lot_aa_f = "AffectedArea";
export const lot_tunnel_f = "TunnelAffected";
export const lot_urgent_f = "Urgent";
export const lot_urgent_q = `${lot_urgent_f} = 0`;
export const lot_urgent_switch = ["OFF", "ON"];

export const lot_endorsed_arr = ["Not Endorsed", "Endorsed", "NA"];

//--- LOT LAYER ---//
//Layer Query
export const lot_status_q = [
  { value: 1, category: "Paid", color: "#00734d" },
  { value: 2, category: "For Payment Processing", color: "#0070ff" },
  { value: 3, category: "For Legal Pass", color: "#ffff00" },
  { value: 4, category: "For Offer to Buy", color: "#ffaa00" },
  { value: 5, category: "For Notice of Taking", color: "#FF5733" },
  { value: 6, category: "With PTE", color: "#70AD47" },
  { value: 7, category: "For Expropriation", color: "#6f0000" },
  { value: 8, category: "Optimized", color: "#B2B2B2" },
];

//--- Layer Labels
export const lot_label = new LabelClass({
  labelExpressionInfo: { expression: "$feature.LotID" },
  symbol: {
    type: "text",
    color: "black",
    haloColor: "white",
    haloSize: 0.5,
    font: { size: 11, weight: "bold" },
  },
});

export const lot_symbol = new SimpleFillSymbol({
  color: [0, 0, 0, 0],
  style: "solid",
  outline: { color: [110, 110, 110], width: 0.7 },
});

export const lot_uniqueV = lot_status_q.map((item: any) => {
  return Object.assign({
    value: item.value,
    label: item.category,
    symbol: new SimpleFillSymbol({ color: item.color }),
  });
});

export const lot_renderer = new UniqueValueRenderer({
  field: lot_status_f,
  defaultSymbol: lot_symbol, // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: lot_uniqueV,
});

//--- Layer Popup
const highlight = (value: unknown) =>
  `<span style="color: #d9dc00ff; font-weight: bold">${value}</span>`;

const customContentLot = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    const attrs = event.graphic.attributes;
    const hod = attrs[lot_hod_f];
    const hdod = attrs[lot_hdod_f];
    const hoa = attrs[lot_pho_f];
    const statusV = attrs[lot_status_f];
    const lu = attrs[lot_lu_f];
    const municipal = attrs[municipality_f];
    const barangay = attrs[barangay_f];
    const lo = attrs[lot_lo_f];
    const cp = attrs[cp_f];
    const endorse = attrs[lot_endorsed_f];
    const endorsed = lot_endorsed_arr[endorse];
    const remarks = attrs["Remarks"];
    const note = attrs["note"];

    //--- Hand-Over Date
    let hod1: any;
    if (hod) {
      const { year, month, day } = yearMonthDay(new Date(hod));
      hod1 = `${year}-${month}-${day}`;
    }

    //--- Handed-Over Date
    let hdod1: any;
    if (hdod) {
      const { year, month, day } = yearMonthDay(new Date(hod));
      hdod1 = `${year}-${month}-${day}`;
    }

    //--- Status with label
    const statusLabel =
      lot_status_q.find((f: any) => f.value === statusV)?.category ?? "";
    const lu_label = lu >= 1 ? lot_lu_arr[lu - 1] : "";

    return `
    <div style='color: #eaeaea'>
    <ul><li>Handed-Over Area: ${highlight(`${hoa} %`)}</li>
    <li>Hand-Over Date: ${highlight(hdod1 ?? "")}</li>
    <li>Handed-Over Date: ${highlight(hod1 ?? "")}</li>
    <li>Status:           ${highlight(statusLabel ?? "")}</li>
    <li>Land Use:         ${highlight(lu_label ?? "")}</li>
    <li>Municipality:     ${highlight(municipal ?? "")}</li>
    <li>Barangay:         ${highlight(barangay ?? "")}</li>
    <li>Land Owner:       ${highlight(lo ?? "")}</li>
    <li>CP:               ${highlight(cp ?? "")}</li>
    <li>Endorsed:         ${highlight(endorsed ?? "")}</li>
    <li>Acquisition Status: ${highlight(remarks ?? "")}</li>
    <li>Note: ${highlight(note ?? "")}</li></ul>
    </div>
              `;
  },
});

export const lot_popup = new PopupTemplate({
  title: "<div style='color: #eaeaea'>Lot No.: <b>{LotID}</b></div>",
  lastEditInfoEnabled: false,
  content: [customContentLot],
});

//--- Land use Array
export const lot_lu_arr = [
  "Agricultural",
  "Agricultural & Commercial",
  "Agricultural / Residential",
  "Commercial",
  "Industrial",
  "Irrigation",
  "Residential",
  "Road",
  "Road Lot",
  "Special Exempt",
];

//--- HANDED-OVER LOTS (PUBLIC + PRIATE LOTS) ---//
export const lot_ho_renderer = new UniqueValueRenderer({
  valueExpression:
    "When($feature.HandedOver == 1 && $feature.StatusLA != 8, 'Handed-Over', 'others')",
  uniqueValueInfos: [
    {
      value: "Handed-Over",
      label: "Handed-Over",
      symbol: new SimpleFillSymbol({
        color: [0, 255, 255, 0.3],
        outline: new SimpleLineSymbol({ color: "#00ffff", width: "4px" }),
      }),
    },
  ],
});

//--- MERALCO TSS 10 ---//
export const lot_meralco_tss_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#f10861",
    style: "horizontal",
    outline: { color: primaryLabelColor, width: "3px" },
  }),
});

export const lot_meralco_tss_lot_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#f10861",
    width: "3px",
    style: "short-dash",
  }),
});

//--- ENDORSED LOT LAYER ---//
export const lot_endorsed_q = [
  { value: 0, category: "Not Endorsed", color: "#ff0000" },
  { value: 1, category: "Endorsed", color: "#006eff" },
  { value: 2, category: "NA", color: "#d3d3d3" },
];

const lot_endorsed_uniqueV = lot_endorsed_q.map((item: any) => {
  return {
    value: item.value,
    label: item.category,
    symbol: new SimpleFillSymbol({ color: item.color }),
  };
});

export const lot_endorsed_renderer = new UniqueValueRenderer({
  field: "Endorsed",
  defaultSymbol: lot_symbol,
  uniqueValueInfos: lot_endorsed_uniqueV,
});

//--- CANDIDIATE LOT LAYER ---//
export const lot_candidate_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "#808080",
    style: "horizontal",
    outline: { color: "#808080", width: "6px" },
  }),
});

//--- ACCESSIBLE LOT AREA BY CONTRACTORS ---//
export const lot_access_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: "purple",
    style: "solid",
    outline: { width: 1, color: "black" },
  }),
});

//----------------------------------------------//
//       Structure Layer Parameters             //
//----------------------------------------------//
//--- STRUCTURE LAYER ---//
export const str_status_f = "StatusStruc";
export const str_id_f = "StrucID";
export const str_pte_f = "PTE";

export const rgb = [
  [0, 197, 255, 0.6],
  [112, 173, 71, 0.6],
  [0, 112, 255, 0.6],
  [255, 255, 0, 0.6],
  [255, 170, 0, 0.6],
  [255, 83, 73, 0.6],
  [178, 190, 181, 0.6],
  [111, 0, 0, 0.6],
];

export const str_status_q = [
  {
    value: 1,
    category: "Demolished",
    color: "#00C5FF",
    colrgb: rgb[0],
  },
  { value: 2, category: "Paid", color: "#70AD47", colrgb: rgb[1] },
  {
    value: 3,
    category: "For Payment Processing",
    color: "#0070FF",
    colrgb: rgb[2],
  },
  { value: 4, category: "For Legal Pass", color: "#FFFF00", colrgb: rgb[3] },
  {
    value: 5,
    category: "For Offer to Compensate",
    color: "#FFAA00",
    colrgb: rgb[4],
  },
  {
    value: 6,
    category: "For Notice of Taking",
    color: "#FF5733",
    colrgb: rgb[5],
  },
  {
    value: 7,
    category: "No Need to Acquire",
    color: "#B2BEB5",
    colrgb: rgb[6],
  },
  {
    value: 8,
    category: "For Expropriation",
    color: "#6f0000",
    colrgb: rgb[7],
  },
];

const height = 5;
const edgeSize = 0.3;

const str_symbol = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 5,
      material: { color: [0, 0, 0, 0.4] },
      edges: new SolidEdges3D({ color: "#4E4E4E", size: edgeSize }),
    }),
  ],
});

const str_uniqueV = str_status_q.map((item: any) => {
  return {
    value: item.value,
    symbol: new PolygonSymbol3D({
      symbolLayers: [
        new ExtrudeSymbol3DLayer({
          size: height,
          material: { color: item.colrgb },
          edges: new SolidEdges3D({ color: "#4E4E4E", size: edgeSize }),
        }),
      ],
    }),
    label: item.category,
  };
});

export const str_renderer = new UniqueValueRenderer({
  defaultSymbol: str_symbol,
  defaultLabel: "Other",
  field: str_status_f,
  uniqueValueInfos: str_uniqueV,
});

export const str_popup = {
  title: "<div style='color: #eaeaea'>{StrucID}</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "StrucOwner", label: "Structure Owner" },
        { fieldName: "Municipality" },
        { fieldName: "Barangay" },
        { fieldName: "StatusStruc", label: "<p>Status for Structure</p>" },
        { fieldName: "Name" },
        { fieldName: "Status", label: "Households Ownership (structure) " },
      ],
    },
  ],
};

//--- STRUCUTURE OWNERSHIP LAYER ---//
export const str_owner_status_f = "Status";
const str_owner_q = [
  { value: 1, category: "LO (Land Owner)", color: [128, 128, 128, 1] },
  { value: 2, category: "Households", color: [128, 128, 128, 1] },
];

export const str_uniqueV_owner = str_owner_q.map((item: any) => {
  return {
    value: item.value,
    label: item.category,
    symbol: new SimpleFillSymbol({
      style: "forward-diagonal",
      color: item.color,
      outline: { color: "#6E6E6E", width: 0.3 },
    }),
  };
});

export const str_owner_renderer = new UniqueValueRenderer({
  field: str_owner_status_f,
  uniqueValueInfos: str_uniqueV_owner,
});

//----------------------------------------------//
//       Households Layer Parameters             //
//----------------------------------------------//
//--- NLO LAYER ---//
export const nlo_status_f = "StatusRC";

export const nlo_status_symbol = [
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Relocated.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Paid.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_PaymentProcess.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LegalPass.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_OtC.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LBP.svg",
];

export const nlo_status_q = [
  {
    value: 1,
    category: "Relocated",
    color: "#00C5FF",
    logo: nlo_status_symbol[0],
  },
  { value: 2, category: "Paid", color: "#70AD47", logo: nlo_status_symbol[1] },
  {
    value: 3,
    category: "For Payment Processing",
    color: "#0070FF",
    logo: nlo_status_symbol[2],
  },
  {
    value: 4,
    category: "For Legal Pass",
    color: "#FFFF00",
    logo: nlo_status_symbol[3],
  },
  {
    value: 5,
    category: "For Appraisal/OtC/Requirements for Other Entitlements",
    color: "#FFAA00",
    logo: nlo_status_symbol[4],
  },
  {
    value: 6,
    category: "For Notice of Taking",
    color: "#6f0000",
    logo: nlo_status_symbol[5],
  },
];

const symbolSize = 30;

const nlo_uniqueV = nlo_status_q.map((item: any) => {
  return Object.assign({
    value: item.value,
    label: item.category,
    symbol: new PointSymbol3D({
      symbolLayers: [
        new IconSymbol3DLayer({
          resource: { href: item.logo },
          size: symbolSize,
          outline: { color: "white", size: 2 },
        }),
      ],
    }),
  });
});

export const nlo_renderer = new UniqueValueRenderer({
  field: nlo_status_f,
  uniqueValueInfos: nlo_uniqueV,
});

export const nlo_popup = {
  title: "<div style='color: #eaeaea'>{StrucID}</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "StrucOwner", label: "Structure Owner" },
        { fieldName: "Municipality" },
        { fieldName: "Barangay" },
        { fieldName: "StatusRC", label: "<p>Status for Relocation</p>" },
        { fieldName: "Name" },
        { fieldName: "Status", label: "Households Ownership (structure) " },
      ],
    },
  ],
};

//--- HOUSEHOLDS OCCUPANCY (STATUS OF RELOCATION) ---//
export const str_occup_f = "Occupancy";
export const str_occup_q = [
  {
    value: 0,
    category: "Occupied",
    ref: "https://EijiGorilla.github.io/Symbols/Demolished.png",
  },
  {
    value: 1,
    category: "Relocated",
    ref: "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
  },
];

const str_occup_offsetV = {
  screenLength: 10,
  maxWorldLength: 10,
  minWorldLength: 10,
};
const occupancyPointSize = 20;

const str_occup_uniqueV = str_occup_q.map((item: any) => {
  return {
    value: item.value,
    label: item.category,
    symbol: new PointSymbol3D({
      symbolLayers: [
        new IconSymbol3DLayer({
          resource: { href: item.ref },
          size: occupancyPointSize,
          outline: { color: "white", size: 2 },
        }),
      ],
      verticalOffset: str_occup_offsetV,

      callout: {
        type: "line",
        color: [128, 128, 128, 0.6],
        size: 0.4,
        border: { color: "grey" },
      },
    }),
  };
});

export const str_occup_renderer = new UniqueValueRenderer({
  field: str_occup_f,
  uniqueValueInfos: str_occup_uniqueV,
});

export const str_occup_popup = {
  title: "<div style='color: #eaeaea'>{StrucID}</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "StrucOwner", label: "Structure Owner" },
        { fieldName: "Municipality" },
        { fieldName: "Barangay" },
        {
          fieldName: "Occupancy",
          label: "<p>Status for Relocation(structure)</p>",
        },
        { fieldName: "Name" },
        { fieldName: "Status", label: "Households Ownership" },
      ],
    },
  ],
};

//----------------------------------------------//
//            Alignment Layers                  //
//----------------------------------------------//
//--- PIER HEAD & COLUMN LAYER ---//
const pHeight = 0;

const pier_column_symbol = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 10,
      material: { color: [78, 78, 78, 0.5] },
      edges: new SolidEdges3D({ color: "#4E4E4E", size: 0.3 }),
    }),
  ],
});

const pilecap_symbol = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: pHeight + 3,
      material: { color: [200, 200, 200, 0.7] },
      edges: new SolidEdges3D({ color: "#4E4E4E", size: 1.0 }),
    }),
  ],
});

export const pierhead_renderer = new UniqueValueRenderer({
  field: "Layer",
  legendOptions: { title: "Pile Cap/Column" },
  uniqueValueInfos: [
    { value: "Pier_Column", symbol: pier_column_symbol, label: "Column" },
    { value: "Pile_Cap", symbol: pilecap_symbol, label: "Pile Cap" },
  ],
});

//--- PIER ACCESS POINT LAYER ---//
export const pier_access_label = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: valueLabelColor },
        size: 15,
        font: { family: "Ubuntu Mono", weight: "bold" },
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
      border: { color: [255, 255, 255, 0.7] },
    },
  }),
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  labelPlacement: "above-center",
});

//--- CHAINAGE LAYER ---//
export const label_chainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: { size: 15, weight: "bold" },
  },
});

export const chainage_renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: { width: 0.2, color: "black" },
  }),
});

//--- STATION BOX LAYER ---//
export const stationbox_renderer = new UniqueValueRenderer({
  field: "Layer",
  uniqueValueInfos: [
    {
      value: "00_Platform",
      label: "Platform",
      symbol: new SimpleFillSymbol({
        color: [160, 160, 160],
        style: "backward-diagonal",
        outline: { width: 1, color: "black" },
      }),
    },
    {
      value: "00_Platform 10car",
      label: "Platform 10car",
      symbol: new SimpleFillSymbol({
        color: [104, 104, 104],
        style: "cross",
        outline: { width: 1, color: "black", style: "short-dash" },
      }),
    },
    {
      value: "00_Station",
      label: "Station Box",
      symbol: new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: { width: 2, color: [115, 0, 0] },
      }),
    },
  ],
});

//--- PROW LAYER ---//
// ORIGINAL (DEFAULT)
export const prow_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({ color: "#ff0000", width: "2px" }),
});

// PROW OTHERS
export const prow_others_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({ color: "red", width: "2px", style: "dash" }),
});

export const pnr_popup = {
  title: "<div style='color: #eaeaea'>{LandOwner} ({LotID})</div>",
  lastEditInfoEnabled: false,
  returnGeometry: true,
  content: [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "OwnershipType", label: "Ownership Type" },
        { fieldName: "HandOverDate", label: "Hand-Over Date" },
        { fieldName: "Municipality" },
        { fieldName: "Barangay" },
        { fieldName: "LandOwner", label: "Land Owner" },
      ],
    },
  ],
};

//--- PNR ---//
export const pnr_renderer = new UniqueValueRenderer({
  field: "OwnershipType",
  uniqueValueInfos: [
    {
      value: 1, // RP
      label: "RP",
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: { width: 0.5, color: "black" },
      }),
    },
    {
      value: 2, // PNR
      label: "PNR",
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: { width: 0.5, color: "black" },
      }),
    },
    {
      value: 3, // BCDA
      label: "BCDA",
      symbol: new SimpleFillSymbol({
        color: [137, 205, 102],
        style: "diagonal-cross",
        outline: { width: 0.5, color: "black" },
      }),
    },
  ],
});

//--- STATION LAYER ---//
export const label_stationp = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: "#d4ff33" },
        size: 15,
        halo: { color: "black", size: 0.5 },
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
      border: { color: "grey" },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: { expression: "$feature.Station" },
});

//----------------------------------------------//
//                Other Layers                  //
//----------------------------------------------//
//--- NGCP WORKING AREA LAYER ---//
export const ngcp_wa_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [197, 0, 255],
    style: "backward-diagonal",
    outline: { color: "#C500FF", width: 0.7 },
  }),
});

//--- NGCP TAGGED STRUCTURES LAYER ---//
export const ngcp_tagged_renderer = new SimpleRenderer({
  symbol: new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    outline: { color: "#00ffffff", width: 1 },
  }),
});

//----------------------------------------------//
//                Layer List                    //
//----------------------------------------------//
function zoomToAction(id: string) {
  return new Collection([
    new Collection([
      new ActionButton({
        title: "Zoom to Area",
        icon: "zoom-in-fixed",
        id: id,
      }),
    ]),
  ]);
}

export async function defineActions(event: any) {
  const { item } = event;

  if (item.title === "Additional Area due to Sapang Balen River Training") {
    item.actionsSections = zoomToAction("full-extent-sapangbalenriver");
  }

  if (item.title === "NGCP Pole Relocation Working Area") {
    item.actionsSections = zoomToAction("full-extent-ngcpwa");
  }

  if (item.title === "NGCP Pole Relocation Tagged Structures") {
    item.actionsSections = zoomToAction("full-extent-ngcptagged");
  }

  if (item.layer.type !== "group") {
    item.panel = { content: "legend", open: true };
  }

  item.title === "Chainage" ||
  item.title === "Pier Head/Column" ||
  item.title === "Households Ownership (Structure)" ||
  item.title === "Land Acquisition (Endorsed Status)" ||
  item.title === "Handed-Over (public + private)" ||
  item.title === "Structure" ||
  item.title === "NGCP Pole Relocation Working Area" ||
  item.title === "NGCP Pole Relocation Tagged Structures" ||
  item.title === "Households" ||
  item.title === "Occupancy (Structure)" ||
  item.title === "Handed-Over Area" ||
  item.title === "MERALCO TSS 10" ||
  item.title ===
    "Candidate Lots of NSCR-Ex Passenger & Freight Line for Optimization"
    ? (item.visible = false)
    : (item.visible = true);
}
