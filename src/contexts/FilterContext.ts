import { createContext } from "react";

type FilterContextType = {
  municipality: any;
  updateMunicipality: any;
  barangay: any;
  updateBarangay: any;
};

const initialState: FilterContextType = {
  municipality: undefined,
  updateMunicipality: undefined,
  barangay: undefined,
  updateBarangay: undefined,
};

export const FilterContext = createContext<FilterContextType>({
  ...initialState,
});
