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
    staleTime: Infinity, // never refetch in the backround. If not Inifity, it will refetch.
    // gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
    container: (defaultStyles: any) => ({
      ...defaultStyles,
      width: "180px",
    }),
    control: (defaultStyles: any, { isDisabled, isFocused }: any) => ({
      ...defaultStyles,
      backgroundColor: isDisabled ? "#232323" : "#2b2b2b",
      borderColor: isFocused ? "#6aa9ff" : "#444444",
      borderRadius: "6px",
      minHeight: "36px",
      boxShadow: "none",
      opacity: isDisabled ? 0.6 : 1,
      "&:hover": {
        borderColor: isFocused ? "#6aa9ff" : "#5a5a5a",
      },
    }),
    placeholder: (defaultStyles: any) => ({
      ...defaultStyles,
      color: "#9a9a9a",
    }),
    singleValue: (defaultStyles: any) => ({
      ...defaultStyles,
      color: "#ffffff",
    }),
    input: (defaultStyles: any) => ({
      ...defaultStyles,
      color: "#ffffff",
    }),
    indicatorSeparator: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#444444",
    }),
    dropdownIndicator: (defaultStyles: any) => ({
      ...defaultStyles,
      color: "#9a9a9a",
      "&:hover": { color: "#ffffff" },
    }),
    clearIndicator: (defaultStyles: any) => ({
      ...defaultStyles,
      color: "#9a9a9a",
      "&:hover": { color: "#ffffff" },
    }),
    menu: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      border: "1px solid #444444",
      overflow: "hidden",
    }),
    option: (defaultStyles: any, { isFocused, isSelected }: any) => ({
      ...defaultStyles,
      backgroundColor: isFocused
        ? "#3a3a3a"
        : isSelected
          ? "#353535"
          : "#2b2b2b",
      color: "#ffffff",
      cursor: "pointer",
    }),
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
        isClearable
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
        isClearable
        styles={customstyles}
      />
    </div>
  );
}
