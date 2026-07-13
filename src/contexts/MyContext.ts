import { createContext } from "react";

type MyDropdownContextType = {
  asofdate: any;
  updateAsofdate: any;
  timesliderOn: any;
  updateTimesliderOn: any;
  newStatusField: any;
  updateNewStatusField: any;
  newHoaField: any;
  updateNewHoaField: any;
  newAfaField: any;
  updateNewAfaField: any;
  newHoField: any;
  updateNewHoField: any;
  municipality: any;
  updateMunicipality: any;
  barangay: any;
  updateBarangay: any;
};

const initialState = {
  asofdate: undefined,
  updateAsofdate: undefined,
  timesliderOn: undefined,
  updateTimesliderOn: undefined,
  newStatusField: undefined,
  updateNewStatusField: undefined,
  newHoaField: undefined,
  updateNewHoaField: undefined,
  newAfaField: undefined,
  updateNewAfaField: undefined,
  newHoField: undefined,
  updateNewHoField: undefined,
  municipality: undefined,
  updateMunicipality: undefined,
  barangay: undefined,
  updateBarangay: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
