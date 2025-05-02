import React, { createContext, useState } from "react";
import "./App.css";
import "./index.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/calcite/calcite.css";
import { CalciteShell } from "@esri/calcite-components-react";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import MainChart from "./components/MainChart";

type MyDropdownContextType = {
  municipals: any;
  barangays: any;
  updateMunicipals: any;
  updateBarangays: any;
};

const initialState = {
  municipals: undefined,
  barangays: undefined,
  updateMunicipals: undefined,
  updateBarangays: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});

function App() {
  const [municipals, setMunicipals] = useState<any>();
  const [barangays, setBarangays] = useState<any>();

  const updateMunicipals = (newMunicipal: any) => {
    setMunicipals(newMunicipal);
  };

  const updateBarangays = (newBarangay: any) => {
    setBarangays(newBarangay);
  };

  return (
    <div>
      <CalciteShell>
        <MyContext
          value={{
            municipals,
            barangays,
            updateMunicipals,
            updateBarangays,
          }}
        >
          <ActionPanel />
          <MapDisplay />
          <MainChart />
          <Header />
        </MyContext>
      </CalciteShell>
    </div>
  );
}

export default App;
