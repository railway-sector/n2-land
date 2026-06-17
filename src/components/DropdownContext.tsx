import { useState } from "react";
import Select from "react-select";
import "../index.css";
import GenerateDropdownData from "npm-dropdown-package";
import { lotLayer } from "../layers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";

export default function DropdownData() {
  const queryClient = useQueryClient();

  const [barangayList, setBarangayList] = useState<any>();
  const [municipalSelected, setMunicipalSelected] = useState<any>();
  const [barangaySelected, setBarangaySelected] = useState<any>({ name: "" });

  const { data: municipalList } = useQuery<any>({
    queryKey: ["dropdownData"], // Do not add lotLayer as a dependency. The dropdown list will not be updated properly.
    queryFn: async () => {
      const dropdownData = new GenerateDropdownData(
        [lotLayer],
        ["Municipality", "Barangay"],
      );
      return await dropdownData.dropDownQuery();
    },
  });

  // this instantly updates the global cache
  function updateMunicipalBarangay(
    mobj_field: SelectedLocation["municipality"],
    bobj_field: SelectedLocation["barangay"],
  ) {
    return queryClient.setQueryData<SelectedLocation>(locationKeys.selected, {
      municipality: mobj_field,
      barangay: bobj_field,
    });
  }

  // handle change event of the Municipality dropdown
  const handleMunicipalityChange = (obj: any) => {
    updateMunicipalBarangay(obj.field1, undefined);

    setMunicipalSelected(obj);
    setBarangayList(obj.field2);
    setBarangaySelected({ name: "" });
  };

  // handle change event of the barangay dropdownff
  const handleBarangayChange = (obj: any) => {
    updateMunicipalBarangay(municipalSelected?.field1, obj.name);
    setBarangaySelected(obj);
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
        options={municipalList && municipalList}
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
