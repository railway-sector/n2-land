import "@arcgis/map-components/components/arcgis-time-slider";
import { updateDisplayDates, updateLotSymbology } from "../query";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  timesliderFieldKeys,
  timesliderKeys,
  datefieldKeys,
} from "../interfaceKeys";
import type {
  TimesliderFieldsTypes,
  TimeSliderState,
  DateFieldsType,
} from "../interfaceKeys";

export default function Timeslider() {
  const arcgisScene = document.querySelector("arcgis-scene");
  const queryClient = useQueryClient();

  //--- Update timeslider state
  const handletimesliderStateChange = () => {
    const updatedTimesliderState: TimeSliderState = {
      timesliderstate: true,
    };

    queryClient.setQueryData<TimeSliderState>(
      timesliderKeys.selected,
      updatedTimesliderState,
    );
  };

  //-- Date Fields
  const { data: dateField } = useQuery<DateFieldsType | any>({
    queryKey: datefieldKeys.selected,
    queryFn: async () => ({}),
    staleTime: Infinity,
  });
  const latestasofdate = dateField?.latestasofdate;

  arcgisScene?.viewOnReady(() => {
    const timeSlider: any = document.querySelector("arcgis-time-slider");

    const dateCollect: any = [];
    dateField?.dateFields.map((date: any) => {
      const yyyy = Number(date.slice(1, 5));
      const desired_mm = Number(date.slice(5, 7));
      const dd = Number(date.slice(7, 9));
      const mm = desired_mm - 1;
      const final = new Date(yyyy, mm, dd);
      dateCollect.push(final);
    });

    const updatedDateCollect = [...dateCollect.slice(0, -1), latestasofdate];

    timeSlider.fullTimeExtent = {
      start: dateCollect[0],
      end: latestasofdate,
    };

    timeSlider.stops = {
      dates: updatedDateCollect,
    };

    reactiveUtils.watch(
      () => timeSlider?.timeExtent,
      (timeExtent) => {
        if (timeExtent) {
          const year = timeExtent.end.getFullYear();
          const month = timeExtent.end.getMonth() + 1;
          const day = timeExtent.end.getDate();

          //--- for 'As of' date in chart panel
          const c_month = timeExtent.end.toLocaleString("en-US", {
            month: "long",
          });

          //--- Update only asOfDate
          updateDisplayDates(
            queryClient,
            "asOfDate",
            `${c_month} ${day}, ${year}`,
          );

          //--- Updating status and date fields for time slider:
          const yyyy0mdd = `x${year}0${month}${day}`;
          const yyyymmdd = `x${year}${month}${day}`;
          const yyyymm0d = `x${year}${month}0${day}`;
          const yyyy0m0d = `x${year}0${month}0${day}`;

          const new_date_field =
            month <= 9 && day <= 9
              ? yyyy0m0d
              : month <= 9 && day >= 10
                ? yyyy0mdd
                : month >= 10 && day <= 9
                  ? yyyymm0d
                  : yyyymmdd;

          queryClient.setQueryData<TimesliderFieldsTypes>(
            timesliderFieldKeys.selected,
            {
              dateforhandedover: `${year}-${month}-${day}`,
              statusdateField: new_date_field,
              newHandedoverAreafield: `${new_date_field}_HOA`,
              newAffectedAreafield: `${new_date_field}_TAA`,
              newHandedOverfield: `${new_date_field}_HO`,
            },
          );

          updateLotSymbology(new_date_field);
        }
      },
    );
  });

  return (
    <>
      <span style={{ fontSize: "16px", color: "#d1d5db", margin: "auto" }}>
        Historical Progress on Land Acquisition
      </span>
      <div>
        <arcgis-time-slider
          referenceElement="arcgis-map"
          slot="bottom"
          layout="auto"
          mode="cumulative-from-start"
          onarcgisPropertyChange={handletimesliderStateChange}
        ></arcgis-time-slider>
      </div>
    </>
  );
}
