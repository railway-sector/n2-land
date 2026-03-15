import { useEffect, useState, use } from "react";
import Select from "react-select";
import "../index.css";
import GenerateDropdownData from "npm-dropdown-package";
import { MyContext } from "../contexts/MyContext";
import { lotLayer } from "../layers";

export default function DropdownData() {
  const { updateMunicipals, updateBarangays } = use(MyContext);

  const [initMunicipalBarangay, setInitMunicipalBarangay] = useState();
  const [barangayList, setBarangayList] = useState();
  const [municipalSelected, setMunicipalSelected] = useState();
  const [barangaySelected, setBarangaySelected] = useState({ name: "" });

  useEffect(() => {
    const dropdownData = new GenerateDropdownData(
      [lotLayer],
      ["Municipality", "Barangay"],
    );
    dropdownData.dropDownQuery().then((response: any) => {
      setInitMunicipalBarangay(response);
    });
  }, []);

  // handle change event of the Municipality dropdown
  const handleMunicipalityChange = (obj: any) => {
    setMunicipalSelected(obj);
    setBarangayList(obj.field2);
    setBarangaySelected({ name: "" });
    updateMunicipals(obj.field1);
    updateBarangays(undefined);
  };

  // handle change event of the barangay dropdownff
  const handleBarangayChange = (obj: any) => {
    setBarangaySelected(obj);
    updateBarangays(obj.name);
  };

  // Style CSS
  const customstyles = {
    option: (styles: any, { isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#999999"
          : isSelected
            ? "#2b2b2b"
            : "#2b2b2b",
        color: "#ffffff",
        width: "200px",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      color: "#ffffff",
      touchUi: false,
      width: "200px",
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", margin: "auto" }}>
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
        value={municipalSelected}
        options={initMunicipalBarangay}
        onChange={handleMunicipalityChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
      <br />
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
          marginLeft: "10px",
        }}
      >
        Barangay
      </div>
      <Select
        placeholder="Select Barangay"
        value={barangaySelected}
        options={barangayList}
        onChange={handleBarangayChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}
