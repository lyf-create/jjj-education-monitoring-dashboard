# 京津冀教育协同发展监测平台

静态数据大屏首页，包含协同热点、协同结构、河北市级地图、教育协同合作网络及三个年度指数模块。

## 本地预览

在本目录启动任意静态 Web 服务，并打开 `index.html`。

## 数据接入位置

- `data/news-data.js`：重要协同新闻事件。
- `data/activity-timeline-data.js`：月度协同活动及五类协同指标。
- `data/stage-share-data.js`：分学段协同事件占比。
- `data/coordination-index-data.js`：区域协同度年度指数。
- `data/education-index-data.js`：教育发展年度指数。
- `data/city-map-data.js`：市级活跃度数据接入结构，记录格式为 `{ month, cityCode, cityName, category, value }`。

河北市级行政区边界在运行时从公开行政区边界服务读取；无法加载时会回退为既有省级边界。
