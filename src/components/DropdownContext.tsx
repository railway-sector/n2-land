import { useMemo, useState } from "react";
import Select from "react-select";
import "../index.css";
import GenerateDropdownData from "dropdown-pkg-arcgis";
import { lotLayer } from "../layers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationKeys } from "../interfaceKeys";
import type { SelectedLocation } from "../interfaceKeys";

const theme = {
  bg: "#2b2b2b",
  bgDisabled: "#232323",
  border: "#444444",
  borderHover: "#5a5a5a",
  borderFocus: "#6aa9ff",
  text: "#ffffff",
  textMuted: "#9a9a9a",
  optionFocused: "#3a3a3a",
  optionSelected: "#353535",
};

const customStyles = {
  container: (s: any) => ({ ...s, width: "180px" }),
  control: (s: any, { isDisabled, isFocused }: any) => ({
    ...s,
    backgroundColor: isDisabled ? theme.bgDisabled : theme.bg,
    borderColor: isFocused ? theme.borderFocus : theme.border,
    borderRadius: "6px",
    minHeight: "36px",
    boxShadow: "none",
    opacity: isDisabled ? 0.6 : 1,
    "&:hover": {
      borderColor: isFocused ? theme.borderFocus : theme.borderHover,
    },
  }),
  placeholder: (s: any) => ({ ...s, color: theme.textMuted }),
  singleValue: (s: any) => ({ ...s, color: theme.text }),
  input: (s: any) => ({ ...s, color: theme.text }),
  indicatorSeparator: (s: any) => ({ ...s, backgroundColor: theme.border }),
  dropdownIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  clearIndicator: (s: any) => ({
    ...s,
    color: theme.textMuted,
    "&:hover": { color: theme.text },
  }),
  menu: (s: any) => ({
    ...s,
    backgroundColor: theme.bg,
    border: `1px solid ${theme.border}`,
    overflow: "hidden",
  }),
  option: (s: any, { isFocused, isSelected }: any) => ({
    ...s,
    backgroundColor: isFocused
      ? theme.optionFocused
      : isSelected
        ? theme.optionSelected
        : theme.bg,
    color: theme.text,
    cursor: "pointer",
  }),
};

export default function DropdownData() {
  const queryClient = useQueryClient();

  const [municipalSelected, setMunicipalSelected] = useState<any | null>(null);
  const [barangaySelected, setBarangaySelected] = useState<any | null>(null);

  const { data: municipalList } = useQuery<any>({
    queryKey: ["dropdownData"], // Do not add lotLayer as a dependency. The dropdown list will not be updated properly.
    queryFn: async () => {
      return await new GenerateDropdownData(
        [lotLayer],
        ["Municipality", "Barangay"],
      ).dropDownQuery();
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  //--- Without useMemo, the code above returns and collects [] in memory every time
  //--- the component renders => waster of memory.
  const barangayList = useMemo(
    () => municipalSelected?.field2 ?? [],
    [municipalSelected],
  );

  //--- Function to instantly update the global cache
  function setSelectedLocation(patch: Partial<SelectedLocation>) {
    queryClient.setQueryData<SelectedLocation>(
      locationKeys.selected,
      (prev) => ({
        municipality: prev?.municipality ?? null,
        barangay: prev?.barangay ?? null,
        ...patch,
      }),
    );
  }

  //--- Update Municipalicty
  const handleMunicipalityChange = (obj: any | null) => {
    setSelectedLocation({ municipality: obj?.field1 ?? null, barangay: null });
    setMunicipalSelected(obj);
    setBarangaySelected(null);
  };

  //--- Update Barangay
  const handleBarangayChange = (obj: any | null) => {
    setSelectedLocation({ barangay: obj?.name ?? null });
    setBarangaySelected(obj);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "auto",
        gap: "12px",
      }}
    >
      <Select
        placeholder="Select Municipality"
        value={municipalSelected}
        options={municipalList && municipalList}
        onChange={handleMunicipalityChange}
        getOptionLabel={(x: any) => x.field1}
        isClearable
        styles={customStyles}
      />
      <br />
      <Select
        placeholder="Select Barangay"
        value={barangaySelected}
        options={barangayList}
        onChange={handleBarangayChange}
        getOptionLabel={(x: any) => x.name}
        isClearable
        styles={customStyles}
      />
    </div>
  );
}
