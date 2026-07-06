import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import * as am5 from "@amcharts/amcharts5";
import Query from "@arcgis/core/rest/support/Query";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

//---------------------------------------------//
//           Pie Chart Data Generation         //
//---------------------------------------------//
interface StatusQueryItem {
  category: string;
  value: number | string;
  color: string;
}

interface pieChartStatusDataType {
  qChart: any;
  layer: FeatureLayer;
  statusList: StatusQueryItem;
  statusField: string;
  statisticField: string;
  statisticType: "count" | "sum" | undefined | null;
}

class ChartPieSeries0 implements pieChartStatusDataType {
  qChart: any;
  layer: any;
  statusList: any;
  statusField: any;
  statisticField: any;
  statisticType: "count" | "sum" | undefined | null;

  constructor(
    qChart: any,
    layer: any,
    statusList: any,
    statusField: any,
    statisticField: any,
    statisticType: "count" | "sum" | undefined | null,
  ) {
    this.qChart = qChart;
    this.layer = layer;
    this.statusList = statusList;
    this.statusField = statusField;
    this.statisticField = statisticField;
    this.statisticType = statisticType;
  }

  chartDataPieSeries0 = async () => {
    const statsCollect = new StatisticDefinition({
      onStatisticField: this.statisticField,
      outStatisticFieldName: "statsCollect",
      statisticType: this.statisticType,
    });

    //--- Query
    const query = new Query();
    query.outStatistics = [statsCollect];
    query.where = this.qChart;
    query.orderByFields = [this.statusField];
    query.groupByFieldsForStatistics = [this.statusField];

    const response = await this.layer?.queryFeatures(query);
    let total_count = 0;

    //--- Create a Map of values indexed by category for O(1) lookup
    const dataMap = new Map<any, number>();

    response.features.forEach((result: any) => {
      const { statsCollect: value } = result.attributes;
      const statusName = result.attributes[this.statusField];
      total_count += value;

      //-- Resolve category immediately
      const category =
        typeof statusName === "number"
          ? this.statusList.find((item: any) => item.value === statusName)
              ?.category
          : statusName;

      if (category !== undefined) {
        dataMap.set(category, value);
      }
    });

    //-- Map directly from statusList to generate final chart data structure
    const data0 = this.statusList.map((status: any) => ({
      category: status.category,
      value: dataMap.get(status.category) ?? 0,
      sliceSettings: { fill: am5.color(status.color) },
    }));
    return [data0, total_count];
  };
}

export default ChartPieSeries0;
