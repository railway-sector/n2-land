import Collection from "@arcgis/core/core/Collection";
import ActionButton from "@arcgis/core/support/actions/ActionButton";

// Chart width
export const chart_width = "26vw";

// Pier Workable properties
export const color_workable = "#38A800";
export const color_nonworkable = "#FF0000";
export const color_completed = "#0070ff";

// Updated Dates
export const updatedDateCategoryNames = [
  "Land Acquisition",
  "Structure",
  "Non Land Owner",
];
export const cutoff_days = 30;

// Lot Status
export const superUrgentField = "Urgent";
export const querySuperUrgent = `${superUrgentField} = 0`;
export const superurgent_items = ["OFF", "ON"];
// export const superUrgentProperty = []

export const lotHandOverDateField = "HandOverDate";
export const lotTargetActualField = "TargetActual";
export const lotTargetActualDateField = "TargetActualDate";

// Handed Over Date and Handed Over Area
export const lotIdField = "LotID";
export const percentHandedOverField = "percentHandedOver";
export const municipalityField = "Municipality";
export const barangayField = "Barangay";
export const landOwnerField = "LandOwner";
export const cpField = "CP";
export const landUseField = "LandUse";
export const endorsedField = "Endorsed";
export const handedOverLotField = "HandedOver";
export const lotHandedOverDateField = "HandedOverDate";
export const lotHandedOverAreaField = "HandedOverArea";
export const lotStatusField = "StatusLA";
export const affectedAreaField = "AffectedArea";
export const statusLotLabel = [
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Offer to Buy",
  "For Notice of Taking",
  "With PTE",
  "For Expropriation",
];

export const statusLotNumber = statusLotLabel.map((stat, index) => {
  return Object.assign({
    category: stat,
    value: index + 1,
  });
});

// export const statusLotColor = ['#00734d', '#0070ff', '#ffff00', '#ffaa00', '#ff0000'];
export const statusLotColor = [
  "#00734d",
  "#0070ff",
  "#ffff00",
  "#ffaa00",
  "#FF5733",
  "#70AD47",
  "#FF0000",
];

export const statusLotQuery = statusLotLabel.map((status, index) => {
  return Object.assign({
    category: status,
    value: index + 1,
    color: statusLotColor[index],
  });
});

// Permit to Enter for lot
export const lotPteField = "PTE";

// Endorsed Lot
export const statusLotEndorsedLabel = ["Not Endorsed", "Endorsed", "NA"];
export const statusLotEndorsedColor = ["#ff0000", "#006eff", "#d3d3d3"];
export const statusLotEndorsedQuery = statusLotEndorsedLabel.map(
  (status, index) => {
    return Object.assign({
      category: status,
      value: index,
      color: statusLotEndorsedColor[index],
    });
  }
);

// Lot MOA
export const lotMoaField = "MoA";
export const statusMoa = [
  "For Negotiation",
  "Expropriation",
  "Donation",
  "CA 141",
  "No Need to Acquire",
];
export const statusMoaQuery = statusMoa.map((status, index) => {
  return Object.assign({
    category: status,
    value: index + 1,
  });
});

// Structure
export const structureStatusField = "StatusStruc";
export const statusStructureLabel = [
  "Demolished",
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Offer to Compensate",
  "For Notice of Taking",
  "No Need to Acquire",
];

export const statusStructureColorHex = [
  "#00C5FF",
  "#70AD47",
  "#0070FF",
  "#FFFF00",
  "#FFAA00",
  "#FF5733", //'#FF0000',
  "#B2BEB5",
];
export const statusStructureColorRgb = [
  [0, 197, 255, 0.6],
  [112, 173, 71, 0.6],
  [0, 112, 255, 0.6],
  [255, 255, 0, 0.6],
  [255, 170, 0, 0.6],
  [255, 87, 51, 0.6], //[255, 0, 0, 0.6],
  [178, 190, 181, 0.6],
];

export const statusStructureQuery = statusStructureLabel.map(
  (status, index) => {
    return Object.assign({
      category: status,
      value: index + 1,
      colorLayer: statusStructureColorRgb[index],
      color: statusStructureColorHex[index],
    });
  }
);

// Permit to Enter for structure
export const structurePteField = "PTE";

// Structure MOA
export const structureMoaField = "MoA";
export const statusMoaStructure = [
  "For Negotiation",
  "Expropriation",
  "Donation",
  "No Need to Acquire",
];

export const statusMoaStructureQuery = statusMoaStructure.map(
  (status, index) => {
    return Object.assign({
      category: status,
      value: index + 1,
    });
  }
);

// NLO
export const occupancyField = "Occupancy";
export const nloLoStatusField = "Status";
export const structureIdField = "StrucID";
export const nloStatusField = "StatusRC";
export const statusNloLabel = [
  "Relocated",
  "Paid",
  "For Payment Processing",
  "For Legal Pass",
  "For Appraisal/OtC/Requirements for Other Entitlements",
  "LBP Account Opening",
];
export const statusNloColor = [
  "#00C5FF",
  "#70AD47",
  "#0070FF",
  "#FFFF00",
  "#FFAA00",
  "#FF0000",
];

export const statusNloSymbolRef = [
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Relocated.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_Paid.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_PaymentProcess.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LegalPass.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_OtC.svg",
  "https://EijiGorilla.github.io/Symbols/3D_Web_Style/ISF/ISF_LBP.svg",
];

export const statusNloQuery = statusNloLabel.map((status, index) => {
  return Object.assign({
    category: status,
    value: index + 1,
    color: statusNloColor[index],
  });
});

// Structure Ownership
export const statusStructureOwnershipLabel = [
  "LO (Land Owner)",
  "NLO (Non-Land Owner)",
];
export const statusStructureOwnershipColor = [
  [128, 128, 128, 1],
  [128, 128, 128, 1],
];

// Structure Occupancy
export const statusStructureOccupancyLabel = ["Occupied", "Relocated"];
export const statusStructureOccupancyRef = [
  "https://EijiGorilla.github.io/Symbols/Demolished.png",
  "https://EijiGorilla.github.io/Symbols/DemolishComplete_v2.png",
];

// Pier Access layer
export const pierAccessValue = ["empty", "accessible", "others"];
export const pierAccessValueLabel = [
  "Dates are missing",
  "Accessible",
  "Others",
];
export const pierAccessValueDateColor = [
  [255, 0, 0, 0.9], // Missing
  [0, 255, 0, 0.9], // Accessible
  [255, 255, 255, 0.9], // Dates are missing
];
export const pierAccessStatusField = "AccessStatus";
export const pierAccessBatchField = "BatchNo";

// Chart and chart label color
export const primaryLabelColor = "#9ca3af";
export const valueLabelColor = "#d1d5db";

// Layter list
export async function defineActions(event) {
  const { item } = event;

  if (item.title === "Sapang Balen River Realignment") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-sapangbalenriver",
        }),
      ]),
    ]);
  }

  if (item.title === "NGCP Pole Relocation Working Area") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcpwa",
        }),
      ]),
    ]);
  }

  if (item.title === "NGCP Pole Relocation Tagged Structures") {
    item.actionsSections = new Collection([
      new Collection([
        new ActionButton({
          title: "Zoom to Area",
          icon: "zoom-in-fixed",
          id: "full-extent-ngcptagged",
        }),
      ]),
    ]);

    // highlightLot(ngcp_tagged_structureLayer);
  }

  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }

  item.title === "Chainage" ||
  item.title === "Pier Head/Column" ||
  item.title === "NLO/LO Ownership (Structure)" ||
  // item.title === 'Super Urgent Lot' ||
  item.title === "Land Acquisition (Endorsed Status)" ||
  item.title === "Handed-Over (public + private)" ||
  item.title === "Structure" ||
  item.title === "NGCP Pole Relocation Working Area" ||
  item.title === "NGCP Pole Relocation Tagged Structures" ||
  item.title === "NLO (Non-Land Owner)" ||
  item.title === "Occupancy (Structure)" ||
  item.title === "Handed-Over Area"
    ? (item.visible = false)
    : (item.visible = true);
}
