import { useState, useEffect } from "react";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal";
import { MyContext } from "./contexts/MyContext";
import MapDisplay from "./components/MapDisplay";
import { superurgent_items } from "./uniqueValues";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import MainChart from "./components/MainChart";

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  useEffect(() => {
    const info = new OAuthInfo({
      appId: "48xyFWCr20nwRSXv",
      popup: false,
      portalUrl: "https://gis.railway-sector.com/portal",
    });

    IdentityManager.registerOAuthInfos([info]);
    async function loginAndLoadPortal() {
      try {
        await IdentityManager.checkSignInStatus(info.portalUrl + "/sharing");
        const portal: any = new Portal({
          // access: "public",
          url: info.portalUrl,
          authMode: "no-prompt",
        });
        portal.load().then(() => {
          setLoggedInState(true);
          console.log("Logged in as: ", portal.user.username);
        });
      } catch (error) {
        console.error("Authentication error:", error);
        IdentityManager.getCredential(info.portalUrl);
      }
    }
    loginAndLoadPortal();
  }, []);

  const [municipals, setMunicipals] = useState<any>();
  const [barangays, setBarangays] = useState<any>();
  const [statusdatefield, setStatusdatefield] = useState<any>();
  const [superurgenttype, setSuperurgenttype] = useState<any>(
    superurgent_items[0],
  );
  const [datefields, setDatefields] = useState<any>();
  const [timesliderstate, setTimesliderstate] = useState<boolean>(false);
  const [asofdate, setAsofdate] = useState<any>();
  const [latestasofdate, setLatestasofdate] = useState<any>();
  const [dateforhandedover, setDateforhandedover] = useState<any>();
  const [handedoverDatefield, setHandedoverDatefield] = useState<any>();
  const [handedoverAreafield, setHandedoverAreafield] = useState<any>();
  const [affectedAreafield, setAffectedAreafield] = useState<any>();
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();

  const updateMunicipals = (newMunicipal: any) => {
    setMunicipals(newMunicipal);
  };

  const updateBarangays = (newBarangay: any) => {
    setBarangays(newBarangay);
  };

  const updateStatusdatefield = (newStatusfield: any) => {
    setStatusdatefield(newStatusfield);
  };

  const updateSuperurgenttype = (newSuperurgenttype: any) => {
    setSuperurgenttype(newSuperurgenttype);
  };

  const updateDatefields = (newDateFields: any) => {
    setDatefields(newDateFields);
  };

  const updateTimesliderstate = (newState: any) => {
    setTimesliderstate(newState);
  };

  const updateAsofdate = (newAsofdate: any) => {
    setAsofdate(newAsofdate);
  };

  const updateLatestasofdate = (newAsofdate: any) => {
    setLatestasofdate(newAsofdate);
  };

  const updateDateforhandedover = (newDate: any) => {
    setDateforhandedover(newDate);
  };

  const updateHandedoverDatefield = (newDatefield: any) => {
    setHandedoverDatefield(newDatefield);
  };

  const updateHandedoverAreafield = (newAreafield: any) => {
    setHandedoverAreafield(newAreafield);
  };

  const updateAffectedAreafield = (newAreafield: any) => {
    setAffectedAreafield(newAreafield);
  };

  const updateChartPanelwidth = (newWidth: any) => {
    setChartPanelwidth(newWidth);
  };

  return (
    <>
      {loggedInState && (
        <calcite-shell
          // content-behind
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #555",
            "--calcite-color-background": "#2b2b2b",
          }}
        >
          <MyContext
            value={{
              municipals,
              barangays,
              statusdatefield,
              superurgenttype,
              datefields,
              timesliderstate,
              asofdate,
              latestasofdate,
              dateforhandedover,
              handedoverDatefield,
              handedoverAreafield,
              affectedAreafield,
              chartPanelwidth,
              updateMunicipals,
              updateBarangays,
              updateStatusdatefield,
              updateSuperurgenttype,
              updateDatefields,
              updateTimesliderstate,
              updateAsofdate,
              updateLatestasofdate,
              updateDateforhandedover,
              updateHandedoverDatefield,
              updateHandedoverAreafield,
              updateAffectedAreafield,
              updateChartPanelwidth,
            }}
          >
            <MainChart />
            <ActionPanel />
            <MapDisplay />

            <Header />
          </MyContext>
        </calcite-shell>
      )}
    </>
  );
}
