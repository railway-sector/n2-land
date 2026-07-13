import { useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import MainChart from "./components/MainChart";
import { authenticate } from "./autho";
import { MyContext } from "./contexts/MyContext";

//--- Create a client
const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    authenticate(setLoggedInState, "48xyFWCr20nwRSXv");
  }, []);

  //------------------------
  //  Create Context
  //------------------------
  const [asofdate, setAsofdate] = useState<any>();
  const updateAsofdate = useCallback((newAsofdate: any) => {
    setAsofdate(newAsofdate);
  }, []);

  const [timesliderOn, setTimesliderOn] = useState<boolean>(false);
  const updateTimesliderOn = useCallback((newState: boolean) => {
    setTimesliderOn(newState);
  }, []);

  const [newStatusField, setNewStatusField] = useState<any>();
  const updateNewStatusField = useCallback((newField: any) => {
    setNewStatusField(newField);
  }, []);

  const [newHoaField, setNewHoaField] = useState<any>();
  const updateNewHoaField = useCallback((newField: any) => {
    setNewHoaField(newField);
  }, []);

  const [newAfaField, setNewAfaField] = useState<any>();
  const updateNewAfaField = useCallback((newField: any) => {
    setNewAfaField(newField);
  }, []);

  const [newHoField, setNewHoField] = useState<any>();
  const updateNewHoField = useCallback((newField: any) => {
    setNewHoField(newField);
  }, []);

  const [municipality, setMunicipality] = useState<any>();
  const updateMunicipality = useCallback((newC: any) => {
    setMunicipality(newC);
  }, []);

  const [barangay, setBarangay] = useState<any>();
  const updateBarangay = useCallback((newB: any) => {
    setBarangay(newB);
  }, []);

  return (
    <>
      {loggedInState && (
        <calcite-shell
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #555",
            "--calcite-color-background": "#2b2b2b",
          }}
        >
          <MyContext
            value={{
              asofdate,
              updateAsofdate,
              timesliderOn,
              updateTimesliderOn,
              newStatusField,
              updateNewStatusField,
              newHoaField,
              updateNewHoaField,
              newAfaField,
              updateNewAfaField,
              newHoField,
              updateNewHoField,
              municipality,
              updateMunicipality,
              barangay,
              updateBarangay,
            }}
          >
            <QueryClientProvider client={queryClient}>
              <MainChart />
              <ActionPanel />
              <MapDisplay />
              <Header />
            </QueryClientProvider>
          </MyContext>
        </calcite-shell>
      )}
    </>
  );
}
