import "@arcgis/map-components/components/arcgis-time-slider";
import "@arcgis/map-components/components/arcgis-time-bar";
import "@arcgis/map-components/components/arcgis-time-bar-slider";
import {
  toAsofdate,
  toDateList,
  updateLotSymbology,
  useDateFields,
  yearMonthDay,
} from "../query";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { use } from "react";
import { TimesliderContext } from "../contexts/TimesliderContext";
import { lotLayer } from "../layers";

export default function Timeslider() {
  const {
    updateAsofdate,
    updateNewStatusField,
    updateNewHoaField,
    updateNewAfaField,
    updateNewHoField,
  } = use(TimesliderContext);

  const arcgisScene = document.querySelector("arcgis-scene");

  //---------------------------------------------
  //  Call date list for the time slider
  //---------------------------------------------
  const { data: dateList } = useDateFields(lotLayer);

  arcgisScene?.viewOnReady(() => {
    const timeBar: any = document.querySelector("arcgis-time-bar");

    if (!dateList) return; // wait until the query has resolved (another option is useEffect)
    const datesObj: any = dateList && toDateList(dateList?.dateFields);

    //--- Define start and end dates of time-slider
    timeBar.fullTimeExtent = {
      start: datesObj[0],
      end: datesObj.at(-1),
    };

    //--- Define timestamps where the slider stops.
    timeBar.stops = { dates: datesObj };

    reactiveUtils.watch(
      () => timeBar?.timeExtent,
      (timeExtent) => {
        if (!timeExtent) return;

        if (timeExtent) {
          //--- Extract year, month, and day
          const { year, month, day } = yearMonthDay(timeExtent.end);

          //--- Update asOfDate
          updateAsofdate(toAsofdate(timeExtent.end));

          //--- Update date fields for time slider:
          const mm = String(month).padStart(2, "0");
          const dd = String(day).padStart(2, "0");
          const new_date_field = `x${year}${mm}${dd}`;

          //--- Update date fields changed with time stapms
          updateNewStatusField(new_date_field);
          updateNewHoaField(`${new_date_field}_HOA`);
          updateNewAfaField(`${new_date_field}_TAA`);
          updateNewHoField(`${new_date_field}_HO`);

          //--- Update lot symbology
          updateLotSymbology(new_date_field);
        }
      },
    );
  });

  return (
    <div
      style={{
        bottom: "1.5%",
        left: "5%",
        position: "fixed",
        zIndex: 1,
        width: "60%",
      }}
    >
      <arcgis-time-bar
        referenceElement="arcgis-scene"
        slot="bottom-left"
        mode="cumulative-from-start"
        show-next
        show-play
        show-previous
        show-time-extent
      >
        <arcgis-time-bar-slider
          slot="time-extent"
          show-min
          show-max
          show-thumb-labels
          show-ticks
          popover-display="always"
        ></arcgis-time-bar-slider>
      </arcgis-time-bar>
    </div>
  );
}
