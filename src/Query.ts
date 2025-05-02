import {
  dateTable,
  lotLayer,
  nloLayer,
  pierAccessLayer,
  structureLayer,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
// import { view } from "./Scene";
import {
  affectedAreaField,
  barangayField,
  cpField,
  handedOverLotField,
  lotHandedOverAreaField,
  lotIdField,
  lotStatusField,
  lotTargetActualDateField,
  municipalityField,
  nloStatusField,
  pierAccessBatchField,
  pierAccessStatusField,
  querySuperUrgent,
  statusLotLabel,
  statusLotQuery,
  statusNloLabel,
  statusNloQuery,
  statusStructureLabel,
  statusStructureQuery,
  structurePteField,
  structureStatusField,
  superurgent_items,
} from "./uniqueValues";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";

// get last date of month
export function lastDateOfMonth(date: Date) {
  const old_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const year = old_date.getFullYear();
  const month = old_date.getMonth() + 1;
  const day = old_date.getDate();
  const final_date = `${year}-${month}-${day}`;

  return final_date;
}

// Updat date
export async function dateUpdate(category: any) {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  const queryExpression =
    "project = 'N2'" + " AND " + "category = '" + category + "'";
  query.where = queryExpression; // "project = 'N2'" + ' AND ' + "category = 'Land Acquisition'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      // get today and date recorded in the table
      const today = new Date();
      const date = new Date(result.attributes.date);

      // Calculate the number of days passed since the last update
      const time_passed = today.getTime() - date.getTime();
      const days_passed = Math.round(time_passed / (1000 * 3600 * 24));

      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return [final, days_passed];
    });
    return dates;
  });
}

// Lot Status Query
export async function generateLotData(
  superurgent: any,
  municipal: any,
  barangay: any
) {
  // Query
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const querySuperUrgentMunicipality =
    querySuperUrgent + " AND " + queryMunicipality;
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const querySuperUrgentMunicipalBarangay =
    querySuperUrgentMunicipality + " AND " + queryBarangay;

  const queryField = lotStatusField + " IS NOT NULL";

  var total_count = new StatisticDefinition({
    onStatisticField: lotStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  var query = lotLayer.createQuery();
  query.outFields = [lotStatusField];
  query.outStatistics = [total_count];
  query.orderByFields = [lotStatusField];
  query.groupByFieldsForStatistics = [lotStatusField];

  if (superurgent === superurgent_items[0]) {
    if (!municipal) {
      query.where = queryField;
    } else if (municipal && !barangay) {
      query.where = queryField + " AND " + queryMunicipality;
    } else if (municipal && barangay) {
      query.where = queryField + " AND " + queryMunicipalBarangay;
    }
  } else if (superurgent === superurgent_items[1]) {
    if (!municipal) {
      query.where = queryField + " AND " + querySuperUrgent;
    } else if (municipal && !barangay) {
      query.where = queryField + " AND " + querySuperUrgentMunicipality;
    } else if (municipal && barangay) {
      query.where = queryField + " AND " + querySuperUrgentMunicipalBarangay;
    }
  }
  // if (municipal && !barangay) {
  //   query.where = queryField + ' AND ' + queryMunicipality;
  // } else if (barangay) {
  //   query.where = queryField + ' AND ' + queryMunicipalBarangay;
  // }

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const status_id = attributes.StatusLA;
      const count = attributes.total_count;
      return Object.assign({
        category: statusLotLabel[status_id - 1],
        value: count,
      });
    });

    const data1: any = [];
    statusLotLabel.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      const object = {
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusLotQuery[index].color),
        },
      };
      data1.push(object);
    });
    return data1;
  });
}

export async function generateLotNumber() {
  const onStatisticsFieldValue: string =
    "CASE WHEN " + lotStatusField + " >= 1 THEN 1 ELSE 0 END";

  var total_lot_number = new StatisticDefinition({
    onStatisticField: lotIdField,
    outStatisticFieldName: "total_lot_number",
    statisticType: "count",
  });

  var total_lot_pie = new StatisticDefinition({
    onStatisticField: onStatisticsFieldValue,
    outStatisticFieldName: "total_lot_pie",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [total_lot_number, total_lot_pie];
  query.returnGeometry = true;

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const totalLotNumber = stats.total_lot_number;
    const totalLotPie = stats.total_lot_pie;
    return [totalLotNumber, totalLotPie];
  });
}

export async function generateTotalAffectedArea(municipal: any, barangay: any) {
  // Query
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const queryField =
    `${affectedAreaField} IS NOT NULL` +
    " AND " +
    `${lotStatusField} IS NOT NULL`;

  var total_affected_area = new StatisticDefinition({
    onStatisticField: affectedAreaField,
    outStatisticFieldName: "total_affected_area",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [total_affected_area];

  if (municipal && !barangay) {
    query.where =
      queryField + " AND " + queryMunicipality + " AND " + queryField;
  } else if (barangay) {
    query.where =
      queryField + " AND " + queryMunicipalBarangay + " AND " + queryField;
  }

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const value = stats.total_affected_area;
    return value;
  });
}

export async function generateAffectedAreaForPie(
  municipal: any,
  barangay: any
) {
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const statusQuery =
    `${lotStatusField} IS NOT NULL` + " AND " + `${lotStatusField} >= 1`;

  var total_affected_area = new StatisticDefinition({
    onStatisticField: affectedAreaField,
    outStatisticFieldName: "total_affected_area",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [total_affected_area];
  query.orderByFields = [lotStatusField];

  query.groupByFieldsForStatistics = [lotStatusField];

  if (municipal && !barangay) {
    query.where = statusQuery + " AND " + queryMunicipality;
  } else if (barangay) {
    query.where = statusQuery + " AND " + queryMunicipalBarangay;
  } else {
    query.where = statusQuery;
  }

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const affected = attributes.total_affected_area;
      const status_id = attributes.StatusLA;

      return Object.assign({
        category: statusLotLabel[status_id - 1],
        value: affected,
      });
    });

    const data1: any = [];
    statusLotLabel.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value1 = find === undefined ? 0 : (find?.value).toFixed(0);
      const object = {
        category: status,
        value: value1,
      };
      data1.push(object);
    });
    return data1;
  });
}

// Handed Over
export async function generateHandedOverLotsNumber(
  superurgent: any,
  municipal: any,
  barangay: any
) {
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const querySuperUrgentMunicipality =
    querySuperUrgent + " AND " + queryMunicipality;
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const querySuperUrgentMunicipalBarangay =
    querySuperUrgentMunicipality + " AND " + queryBarangay;

  const queryField = `${lotIdField} IS NOT NULL`;
  const onStatisticsFieldValue: string =
    "CASE WHEN " + handedOverLotField + " = 1 THEN 1 ELSE 0 END";

  var total_handedover_lot = new StatisticDefinition({
    onStatisticField: onStatisticsFieldValue,
    outStatisticFieldName: "total_handedover_lot",
    statisticType: "sum",
  });

  var total_lot_N = new StatisticDefinition({
    onStatisticField: lotIdField,
    outStatisticFieldName: "total_lot_N",
    statisticType: "count",
  });

  var query = lotLayer.createQuery();

  if (superurgent === superurgent_items[0]) {
    if (!municipal) {
      query.where = queryField;
    } else if (municipal && !barangay) {
      query.where = queryField + " AND " + queryMunicipality;
    } else if (municipal && barangay) {
      query.where = queryField + " AND " + queryMunicipalBarangay;
    }
  } else if (superurgent === superurgent_items[1]) {
    if (!municipal) {
      query.where = queryField + " AND " + querySuperUrgent;
    } else if (municipal && !barangay) {
      query.where = queryField + " AND " + querySuperUrgentMunicipality;
    } else if (municipal && barangay) {
      query.where = queryField + " AND " + querySuperUrgentMunicipalBarangay;
    }
  }

  query.outStatistics = [total_handedover_lot, total_lot_N];
  // query.returnGeometry = true;

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const handedover = stats.total_handedover_lot;
    const totaln = stats.total_lot_N;
    const percent = ((handedover / totaln) * 100).toFixed(0);
    return [percent, handedover];
  });
}

export async function generateHandedOverArea(municipal: any, barangay: any) {
  // Query
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const queryField =
    `${affectedAreaField} IS NOT NULL` +
    " AND " +
    `${lotStatusField} IS NOT NULL`;

  var handed_over_area = new StatisticDefinition({
    onStatisticField: lotHandedOverAreaField,
    outStatisticFieldName: "handed_over_area",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [handed_over_area];

  if (municipal && !barangay) {
    query.where =
      queryField + " AND " + queryMunicipality + " AND " + queryField;
  } else if (barangay) {
    query.where =
      queryField + " AND " + queryMunicipalBarangay + " AND " + queryField;
  }

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const value = stats.handed_over_area;
    return value;
  });
}

// For monthly progress chart of lot
export async function timeSeriesHandedOverChartData(
  municipality: any,
  barangay: any
) {
  var total_target = new StatisticDefinition({
    onStatisticField: "CASE WHEN TargetActual = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_target",
    statisticType: "sum",
  });

  var total_actual = new StatisticDefinition({
    // means handed over
    onStatisticField: "CASE WHEN TargetActual = 2 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_actual",
    statisticType: "sum",
  });

  const query = lotLayer.createQuery();
  query.outStatistics = [total_target, total_actual];
  // eslint-disable-next-line no-useless-concat
  const queryMunicipality = `${municipalityField} = '` + municipality + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const queryField = `${lotIdField} IS NOT NULL`;
  const queryHandedOverHandOverDate =
    lotTargetActualDateField + " IS NOT NULL" + " AND " + queryField;

  if (municipality && barangay) {
    query.where =
      queryHandedOverHandOverDate + " AND " + queryMunicipalBarangay;
  } else if (municipality && !barangay) {
    query.where = queryHandedOverHandOverDate + " AND " + queryMunicipality;
  } else {
    query.where = queryHandedOverHandOverDate;
  }

  query.outFields = [lotTargetActualDateField];
  query.orderByFields = [lotTargetActualDateField];
  query.groupByFieldsForStatistics = [lotTargetActualDateField];

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;

    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const date = attributes[lotTargetActualDateField];
      const targetCount = attributes.total_target;
      const actualCount = attributes.total_actual;
      return Object.assign({
        date,
        target: targetCount,
        actual: actualCount,
      });
    });
    var sum_target: any = 0;
    var sum_actual: any = 0;

    const data2 = data.map((result: any, index: any) => {
      const date = result.date;
      const v_target = result.target;
      const v_actual = result.actual;
      sum_target += v_target;
      sum_actual += v_actual;
      return Object.assign({
        date,
        target: sum_target,
        actual: sum_actual,
      });
    });
    return data2;
  });
}

export async function pierBatchProgressChartData(
  municipality: any,
  barangay: any
) {
  var total_accessible = new StatisticDefinition({
    onStatisticField: "CASE WHEN AccessStatus = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_accessible",
    statisticType: "sum",
  });

  var total_inaccessible = new StatisticDefinition({
    // means handed over
    onStatisticField: "CASE WHEN AccessStatus = 0 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_inaccessible",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.outStatistics = [total_accessible, total_inaccessible];
  // eslint-disable-next-line no-useless-concat
  const queryMunicipality = `${municipalityField} = '` + municipality + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const queryAccessStatus = pierAccessStatusField + " IS NOT NULL";

  if (municipality && barangay) {
    query.where = queryAccessStatus + " AND " + queryMunicipalBarangay;
  } else if (municipality && !barangay) {
    query.where = queryAccessStatus + " AND " + queryMunicipality;
  } else {
    query.where = queryAccessStatus;
  }

  query.outFields = [pierAccessBatchField, pierAccessStatusField];
  query.orderByFields = [pierAccessBatchField];
  query.groupByFieldsForStatistics = [pierAccessBatchField];

  return pierAccessLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const batch = attributes[pierAccessBatchField];
      const batch_name =
        batch === 1
          ? "Batch 1"
          : batch === 2
          ? "Batch 2"
          : batch === 3
          ? "Batch 3"
          : "Batch 4";

      const total_access = attributes.total_accessible;
      const total_inaccess = attributes.total_inaccessible;

      // compile in object array
      return Object.assign({
        batch: batch_name,
        accessible: total_access,
        inaccessible: total_inaccess,
      });
    });
    return data;
  });
}

export async function generateHandedOverAreaData() {
  var total_affected_area = new StatisticDefinition({
    onStatisticField: affectedAreaField,
    outStatisticFieldName: "total_affected_area",
    statisticType: "sum",
  });

  var total_handedover_area = new StatisticDefinition({
    onStatisticField: lotHandedOverAreaField,
    outStatisticFieldName: "total_handedover_area",
    statisticType: "sum",
  });

  var query = lotLayer.createQuery();
  query.where = `${cpField} IS NOT NULL`;
  query.outStatistics = [total_affected_area, total_handedover_area];
  query.orderByFields = [cpField];
  query.returnGeometry = true;
  query.groupByFieldsForStatistics = [cpField];

  return lotLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const affected = attributes.total_affected_area;
      const handedOver = attributes.total_handedover_area;
      const cp = attributes.CP;

      const percent = ((handedOver / affected) * 100).toFixed(0);

      return Object.assign(
        {},
        {
          category: cp,
          value: percent,
        }
      );
    });

    return data;
  });
}

// Structure
export async function generateStructureData(municipal: any, barangay: any) {
  // Query
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const queryField = structureStatusField + " IS NOT NULL";

  var total_count = new StatisticDefinition({
    onStatisticField: structureStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  var query = structureLayer.createQuery();
  query.outFields = [structureStatusField];
  query.outStatistics = [total_count];
  query.orderByFields = [structureStatusField];
  query.groupByFieldsForStatistics = [structureStatusField];
  if (municipal && !barangay) {
    query.where = queryField + " AND " + queryMunicipality;
  } else if (barangay) {
    query.where = queryField + " AND " + queryMunicipalBarangay;
  }

  return structureLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const status_id = attributes.StatusStruc;
      const count = attributes.total_count;
      return Object.assign({
        category: statusStructureLabel[status_id - 1],
        value: count,
      });
    });

    const data1: any = [];
    statusStructureLabel.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      const object = {
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusStructureQuery[index].color),
        },
      };
      data1.push(object);
    });
    return data1;
  });
}

// For Permit-to-Enter
export async function generateStrucNumber() {
  const onStatisticsFieldValue: string =
    "CASE WHEN " + structureStatusField + " >= 1 THEN 1 ELSE 0 END";

  const onStatisticFieldValuePte: string =
    "CASE WHEN " + structurePteField + " = 1 THEN 1 ELSE 0 END";

  var total_pte_structure = new StatisticDefinition({
    onStatisticField: onStatisticFieldValuePte,
    outStatisticFieldName: "total_pte_structure",
    statisticType: "sum",
  });

  var total_struc_N = new StatisticDefinition({
    onStatisticField: onStatisticsFieldValue,
    outStatisticFieldName: "total_struc_N",
    statisticType: "sum",
  });

  var query = structureLayer.createQuery();

  query.outStatistics = [total_pte_structure, total_struc_N];
  return structureLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const pte = stats.total_pte_structure;
    const totaln = stats.total_struc_N;
    const percPTE = Number(((pte / totaln) * 100).toFixed(0));
    return [percPTE, pte, totaln];
  });
}

// Non-Land Owner
export async function generateNloData(municipal: any, barangay: any) {
  // Query
  const queryMunicipality = `${municipalityField} = '` + municipal + "'";
  const queryBarangay = `${barangayField} = '` + barangay + "'";
  const queryMunicipalBarangay = queryMunicipality + " AND " + queryBarangay;
  const queryField = nloStatusField + " IS NOT NULL";

  var total_count = new StatisticDefinition({
    onStatisticField: nloStatusField,
    outStatisticFieldName: "total_count",
    statisticType: "count",
  });

  var query = nloLayer.createQuery();
  query.outFields = [nloStatusField];
  query.outStatistics = [total_count];
  query.orderByFields = [nloStatusField];
  query.groupByFieldsForStatistics = [nloStatusField];
  if (municipal && !barangay) {
    query.where = queryField + " AND " + queryMunicipality;
  } else if (barangay) {
    query.where = queryField + " AND " + queryMunicipalBarangay;
  }

  return nloLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features;
    const data = stats.map((result: any, index: any) => {
      const attributes = result.attributes;
      const status_id = attributes.StatusRC;
      const count = attributes.total_count;
      return Object.assign({
        category: statusNloLabel[status_id - 1],
        value: count,
      });
    });

    const data1: any = [];
    statusNloLabel.map((status: any, index: any) => {
      const find = data.find((emp: any) => emp.category === status);
      const value = find === undefined ? 0 : find?.value;
      const object = {
        category: status,
        value: value,
        sliceSettings: {
          fill: am5.color(statusNloQuery[index].color),
        },
      };
      data1.push(object);
    });
    return data1;
  });
}

export async function generateNloNumber() {
  const onStatisticsFieldValue: string =
    "CASE WHEN " + nloStatusField + " >= 1 THEN 1 ELSE 0 END";

  var total_lbp = new StatisticDefinition({
    onStatisticField: onStatisticsFieldValue,
    outStatisticFieldName: "total_lbp",
    statisticType: "sum",
  });

  var query = nloLayer.createQuery();
  query.outStatistics = [total_lbp];
  return nloLayer.queryFeatures(query).then((response: any) => {
    var stats = response.features[0].attributes;
    const totalnlo = stats.total_lbp;

    return totalnlo;
  });
}

// For dropdown list
export async function getMuniciaplityBarangayPair() {
  var query = lotLayer.createQuery();
  // eslint-disable-next-line no-useless-concat
  query.where =
    `${barangayField} IS NOT NULL` +
    " AND " +
    `${municipalityField} IS NOT NULL`;
  query.outFields = [municipalityField, barangayField];
  query.groupByFieldsForStatistics = [municipalityField, barangayField];

  return lotLayer.queryFeatures(query).then((response: any) => {
    const values = response.features.map((result: any, index: number) => {
      const municipal = result.attributes.Municipality;
      const barang = result.attributes.Barangay;

      return Object.assign({
        municipality: municipal,
        barangay: barang,
      });
    });

    const municipalSelect = values
      .map((item: any) => item.municipality)
      .filter(
        (municipality: any, index: any, emp: any) =>
          emp.indexOf(municipality) === index
      );

    const pair = values.filter(
      (val: any, index: any) =>
        values.findIndex(
          (item: any) =>
            item.barangay === val.barangay &&
            item.municipality === val.municipality
        ) === index
    );

    const finalArray = municipalSelect.map(
      (municipal: string, index: number) => {
        let temp: Array<string> = [];

        // Find barangay(s) corresponding to each municipality
        const findBarangay = pair.filter(
          (emp: any) => emp.municipality === municipal
        );

        // Create an array of barangays correpsonding to each municipality
        for (var j: number = 0; j < findBarangay.length; j++) {
          const barangays = findBarangay[j].barangay;
          const OBJ = Object.assign({
            name: barangays,
          });
          temp.push(OBJ);
        }

        // return the array of collected barangays to an array of municipality
        return Object.assign({
          municipality: municipal,
          barangay: temp.length === 0 ? [{ name: "" }] : temp,
        });
      }
    );
    return finalArray;
  }); // end of qureyFeatures
}

export const dateFormat = (inputDate: any, format: any) => {
  //parse the input date
  const date = new Date(inputDate);

  //extract the parts of the date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //replace the month
  format = format.replace("MM", month.toString().padStart(2, "0"));

  //replace the year
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  }

  //replace the day
  format = format.replace("dd", day.toString().padStart(2, "0"));

  return format;
};

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  } else {
    return 0;
  }
}
// Zoom to Layer
// const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

let highlight: any;
export function highlightLot(layer: any, view: any) {
  view?.whenLayerView(layer).then((urgentLayerView: any) => {
    var query = layer.createQuery();
    layer.queryFeatures(query).then((results: any) => {
      const length = results.features.length;
      let objID = [];
      for (var i = 0; i < length; i++) {
        var obj = results.features[i].attributes.OBJECTID;
        objID.push(obj);
      }

      if (highlight) {
        highlight.remove();
      }
      highlight = urgentLayerView.highlight(objID);
    });
  });
}

export function highlightHandedOverLot(layer: any, view: any) {
  view?.whenLayerView(layer).then((urgentLayerView: any) => {
    var query = layer.createQuery();
    query.where = `${handedOverLotField} = 1`;
    layer.queryFeatures(query).then((results: any) => {
      const length = results.features.length;
      let objID = [];
      for (var i = 0; i < length; i++) {
        var obj = results.features[i].attributes.OBJECTID;
        objID.push(obj);
      }

      if (highlight) {
        highlight.remove();
      }
      highlight = urgentLayerView.highlight(objID);
    });
  });
}

export function highlightRemove(layer: any) {
  if (highlight) {
    highlight.remove();
  }
}
