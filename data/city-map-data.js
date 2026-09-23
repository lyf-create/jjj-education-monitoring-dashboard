/*
 * 市级地图接入位。
 * 后续接入时填入权威行政区 GeoJSON（北京市、天津市、河北省市级边界），并将 records
 * 按 { month, cityCode, cityName, category, value } 写入。页面不会据此生成虚构边界或数值。
 */
window.JJJ_CITY_MAP_DATA = window.JJJ_CITY_MAP_DATA || {
  geoJson: null,
  records: []
};
