import { useEffect, useState, use } from "react";
import Select from "react-select";
import "../index.css";
import "../App.css";
import { getMuniciaplityBarangayPair } from "../Query";
import { MyContext } from "../App";

export default function DropdownData() {
  const { municipals, barangays, updateMunicipals, updateBarangays } =
    use(MyContext);

  const [initMunicipalBarangay, setInitMunicipalBarangay] = useState([
    {
      municipality: "",
      barangay: [
        {
          name: "",
        },
      ],
    },
  ]);

  const [municipality, setMunicipality] = useState(null);
  const [barangay, setBarangay] = useState(null);
  const [barangayList, setBarangayList] = useState([]);
  const [municipalSelected, setMunicipalSelected] = useState({
    municipality: "",
    barangay: [
      {
        name: "",
      },
    ],
  });
  const [barangaySelected, setBarangaySelected] = useState({ name: "" });

  useEffect(() => {
    getMuniciaplityBarangayPair().then((response: any) => {
      setInitMunicipalBarangay(response);
    });
  }, []);

  // handle change event of the Municipality dropdown
  const handleMunicipalityChange = (obj: any) => {
    setMunicipalSelected(obj);
    setMunicipality(obj);
    setBarangayList(obj.barangay);
    setBarangay(null);
    setBarangaySelected({ name: "" });
    updateMunicipals(obj.municipality);
    updateBarangays(undefined);
  };

  // handle change event of the barangay dropdownff
  const handleBarangayChange = (obj: any) => {
    setBarangaySelected(obj);
    setBarangay(obj);
    updateBarangays(obj.name);
  };

  return (
    <>
      <DropdownListDisplay
        handleMunicipalityChange={handleMunicipalityChange}
        handleBarangayChange={handleBarangayChange}
        municipality={municipality}
        initMunicipalBarangay={initMunicipalBarangay}
        barangay={barangay}
        barangayList={barangayList}
        municipalSelected={municipalSelected}
        barangaySelected={barangaySelected}
      ></DropdownListDisplay>
    </>
  );
}

export function DropdownListDisplay({
  handleMunicipalityChange,
  handleBarangayChange,
  municipality,
  initMunicipalBarangay,
  barangay,
  barangayList,
  municipalSelected,
  barangaySelected,
}: any) {
  // Style CSS
  const customstyles = {
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#999999"
          : isSelected
          ? "#2b2b2b"
          : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      color: "#ffffff",
      touchUi: false,
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div className="dropdownFilterLayout">
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
        }}
      >
        Municipality
      </div>
      <Select
        placeholder="Select Municipality"
        value={municipality}
        options={initMunicipalBarangay}
        onChange={handleMunicipalityChange}
        getOptionLabel={(x: any) => x.municipality}
        styles={customstyles}
      />
      <br />
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
        }}
      >
        Barangay
      </div>
      <Select
        placeholder="Select Barangay"
        value={barangay}
        options={barangayList}
        onChange={handleBarangayChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}
