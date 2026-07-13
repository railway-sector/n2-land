export type statisticsType = "count" | "sum";
export type TypeFieldType = "number" | "string";

//--- Dropdown
export interface SelectedLocation {
  municipality: string | any;
  barangay: string | any;
}

export const locationKeys = {
  selected: ["selectedLocation"] as const,
};

//-- date fields (needs to render only once)
export interface DateFieldsType {
  dateFields: any;
  latestdate?: any;
}

export const datefieldKeys = {
  selected: ["selectedDateFields"] as const,
};

//--- Dates for chart
export interface TimesliderFieldsTypes {
  statusdateField?: string | any;
  newHandedoverAreafield?: string | any;
  newAffectedAreafield?: string | any;
  newHandedOverfield?: string | any;
  dateforhandedover?: string | any;
}

export const timesliderFieldKeys = {
  selected: ["selectedTimesliderFields"] as const,
};

//-- Date for display
export interface DisplayDates {
  asOfDate?: any;
  daysPass?: boolean;
}

export const dateDisplayKeys = {
  selected: ["displayDates"] as const,
};

//--- Chart
export interface ChartResponse {
  chartData: any[];
  totalNumber: number | string | undefined;
}
