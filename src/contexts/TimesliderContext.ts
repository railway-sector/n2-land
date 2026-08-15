import { createContext } from "react";

type TimesliderContextType = {
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
};

const initialState: TimesliderContextType = {
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
};

export const TimesliderContext = createContext<TimesliderContextType>({
  ...initialState,
});
