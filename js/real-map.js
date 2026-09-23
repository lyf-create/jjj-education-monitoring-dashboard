(async function(){
  'use strict';
  /* Future metric data: records = [{month, cityCode, cityName, category, value}]. */
  const el=document.getElementById('real-jjj-map'), configured=window.JJJ_CITY_MAP_DATA;
  if(!el||!window.echarts||!window.JJJ_GEOJSON)return;
  let cityGeo=configured?.geoJson;
  if(!cityGeo?.features?.length){
    try { const response=await fetch('https://geo.datav.aliyun.com/areas_v3/bound/130000_full.json'); if(response.ok) cityGeo=await response.json(); }
    catch(error) { console.warn('河北市级边界加载失败，使用省级边界。'); }
  }
  const cityReady=Boolean(cityGeo?.features?.length);
  const baseFeatures=window.JJJ_GEOJSON.features.filter(feature=>feature.properties?.name!=='Hebei');
  const geoJson=cityReady?{type:'FeatureCollection',features:[...baseFeatures,...cityGeo.features.map(feature=>({...feature,properties:{...feature.properties,name:feature.properties?.name||String(feature.properties?.adcode||'')}}))]}:window.JJJ_GEOJSON;
  const mapName=cityReady?'jingjinji-hebei-cities':'jingjinji-real';
  const chart=echarts.init(el,null,{renderer:'canvas'});
  echarts.registerMap(mapName,geoJson);
  const labels={Beijing:'北京市',Tianjin:'天津市',Hebei:'河北省'};
  const status=document.getElementById('city-map-status');
  if(status){status.textContent=cityReady?'当前展示：河北省真实市级行政区边界':'河北市级边界加载失败（当前为省级边界）';status.classList.toggle('is-ready',cityReady)}
  let values={},activeMonth='',activeCategory='总体';
  function cityValues(){return (configured?.records||[]).filter(row=>(!activeMonth||row.month===activeMonth)&&(!activeCategory||activeCategory==='总体'||row.category===activeCategory)).reduce((out,row)=>{const name=row.cityName||String(row.cityCode);out[name]=(out[name]||0)+Number(row.value||0);return out},{})}
  function render(){const data=cityReady?{...values,...cityValues()}:values;chart.setOption({series:[{data:Object.entries(data).map(([name,value])=>({name,value}))}]})}
  chart.setOption({animationDuration:700,tooltip:{trigger:'item',backgroundColor:'rgba(3,20,48,.94)',borderColor:'#18cbff',textStyle:{color:'#effaff'},formatter:p=>`${labels[p.name]||p.name}<br/>当月有效协同事件：${p.value||0} 件`},visualMap:{show:false,min:1,max:160,inRange:{color:['#d4f7ff','#6dbffc','#176bea','#073c9a']}},geo:{map:mapName,roam:true,zoom:1.03,label:{show:true,formatter:p=>labels[p.name]||p.name,color:'#ecf9ff',fontSize:cityReady?9:15,fontWeight:'bold',textShadowColor:'#003477',textShadowBlur:6},itemStyle:{borderColor:'#b5f1ff',borderWidth:1.05,areaColor:'#1676d3',shadowColor:'#05beff',shadowBlur:12},emphasis:{label:{color:'#fff'},itemStyle:{areaColor:'#00a8ff'}}},series:[{type:'map',geoIndex:0,data:[],silent:false}]});
  const mapNames={北京:'Beijing',天津:'Tianjin',河北:'Hebei'};
  addEventListener('dashboard:map-month-data',event=>{activeMonth=event.detail?.month||'';values=Object.fromEntries(Object.entries(event.detail?.counts||{}).map(([region,count])=>[mapNames[region],count]));render()});
  document.querySelector('.map-tabs')?.addEventListener('click',event=>{const tab=event.target.closest('b,span');if(!tab)return;activeCategory=tab.textContent.trim();document.querySelectorAll('.map-tabs b,.map-tabs span').forEach(item=>item.classList.toggle('is-active',item===tab));render()});
  window.HomepageCityMapAdapter={refresh:render,contract:'{ records: [{month, cityCode, cityName, category, value}] }'};
  addEventListener('resize',()=>chart.resize());
}());
