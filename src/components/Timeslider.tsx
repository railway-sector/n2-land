import "@arcgis/map-components/components/arcgis-time-slider";
import { MyContext } from "../contexts/MyContext";
import { use } from "react";
import { updateLotSymbology } from "../Query";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

export default function Timeslider() {
  const {
    updateStatusdatefield,
    datefields,
    latestasofdate,
    updateTimesliderstate,
    updateAsofdate,
    updateDateforhandedover,
    updateNewHandedoverAreafield,
    updateNewAffectedAreafield,
    updateNewHandedOverfield,
  } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene");

  arcgisScene?.viewOnReady(() => {
    // arcgisScene?.whenLayerView(lotLayer).then((layerView) => {
    const timeSlider: any = document.querySelector("arcgis-time-slider");

    const dateCollect: any = [];
    datefields.map((date: any) => {
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
      // end: dateCollect[dateCollect.length - 1].push(latestasofdate),
      end: latestasofdate,
    };

    // timeSlider.stops = {
    //   interval: {
    //     value: 1,
    //     unit: "months",
    //   },
    // };

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

          // for 'As of' date in chart panel
          const c_month = timeExtent.end.toLocaleString("en-US", {
            month: "long",
          });
          updateAsofdate(`${c_month} ${day}, ${year}`);

          // Date for filtering handed-over lots number
          updateDateforhandedover(`${year}-${month}-${day}`);

          const yyyy0mdd = `x${year}0${month}${day}`;
          const yyyymmdd = `x${year}${month}${day}`;
          const yyyymm0d = `x${year}${month}0${day}`;
          const yyyy0m0d = `x${year}0${month}0${day}`;

          // Updating status field:
          const new_date_field =
            month <= 9 && day <= 9
              ? yyyy0m0d
              : month <= 9 && day >= 10
                ? yyyy0mdd
                : month >= 10 && day <= 9
                  ? yyyymm0d
                  : yyyymmdd;

          updateLotSymbology(new_date_field);
          updateStatusdatefield(new_date_field);

          // Updating Handed-Over Area field:
          const new_handedoverarea_field = `${new_date_field}_HOA`;
          updateNewHandedoverAreafield(new_handedoverarea_field);

          // Updating Affected-Area field:
          const new_affectedarea_field = `${new_date_field}_TAA`;
          updateNewAffectedAreafield(new_affectedarea_field);

          // Updating Haned-Over field
          const new_handedover_field = `${new_date_field}_HO`;
          updateNewHandedOverfield(new_handedover_field);
        }
      },
    );
    // });
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
          onarcgisPropertyChange={() => {
            updateTimesliderstate(true);
          }}
        ></arcgis-time-slider>
      </div>
    </>
  );
}
