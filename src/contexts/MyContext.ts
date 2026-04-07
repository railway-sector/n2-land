import { createContext } from "react";

type MyDropdownContextType = {
  municipals: any;
  barangays: any;
  statusdatefield: any;
  superurgenttype: any;
  datefields: any;
  timesliderstate: any;
  asofdate: any;
  latestasofdate: any;
  dateforhandedover: any;
  handedoverDatefield: any;
  newHandedoverAreafield: any;
  newAffectedAreafield: any;
  chartPanelwidth: any;
  newHandedOverfield: any;
  updateMunicipals: any;
  updateBarangays: any;
  updateStatusdatefield: any;
  updateSuperurgenttype: any;
  updateDatefields: any;
  updateTimesliderstate: any;
  updateAsofdate: any;
  updateLatestasofdate: any;
  updateDateforhandedover: any;
  updateHandedoverDatefield: any;
  updateNewHandedoverAreafield: any;
  updateNewAffectedAreafield: any;
  updateChartPanelwidth: any;
  updateNewHandedOverfield: any;
};

const initialState = {
  municipals: undefined,
  barangays: undefined,
  statusdatefield: undefined,
  superurgenttype: undefined,
  datefields: undefined,
  timesliderstate: undefined,
  asofdate: undefined,
  latestasofdate: undefined,
  dateforhandedover: undefined,
  handedoverDatefield: undefined,
  newHandedoverAreafield: undefined,
  newAffectedAreafield: undefined,
  chartPanelwidth: undefined,
  newHandedOverfield: undefined,
  updateMunicipals: undefined,
  updateBarangays: undefined,
  updateStatusdatefield: undefined,
  updateSuperurgenttype: undefined,
  updateDatefields: undefined,
  updateTimesliderstate: undefined,
  updateAsofdate: undefined,
  updateLatestasofdate: undefined,
  updateDateforhandedover: undefined,
  updateHandedoverDatefield: undefined,
  updateNewHandedoverAreafield: undefined,
  updateNewAffectedAreafield: undefined,
  updateChartPanelwidth: undefined,
  updateNewHandedOverfield: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
