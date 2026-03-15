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
  handedoverAreafield: any;
  affectedAreafield: any;
  chartPanelwidth: any;
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
  updateHandedoverAreafield: any;
  updateAffectedAreafield: any;
  updateChartPanelwidth: any;
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
  handedoverAreafield: undefined,
  affectedAreafield: undefined,
  chartPanelwidth: undefined,
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
  updateHandedoverAreafield: undefined,
  updateAffectedAreafield: undefined,
  updateChartPanelwidth: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
