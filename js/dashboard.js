(function(){
  'use strict';
  const observer=new ResizeObserver(entries=>entries.forEach(({target})=>window.DashboardModules?.get(target.dataset.module)?.resize?.()));
  document.querySelectorAll('[data-module]').forEach(panel=>observer.observe(panel));
  const monthSelect=document.getElementById('global-month');
  const allMonths=['全部',...Array.from({length:4},(_,yearOffset)=>Array.from({length:12},(_,month)=>`${2023+yearOffset}-${String(month+1).padStart(2,'0')}`)).flat()];
  monthSelect.innerHTML=allMonths.map(value=>`<option value="${value}">${value==='全部'?'全部年月':value.replace('-','年')+'月'}</option>`).join('');
  monthSelect.value='2026-07';
  const publishMonth=()=>window.dispatchEvent(new CustomEvent('dashboard:month-change',{detail:{month:monthSelect.value==='全部'?'':monthSelect.value}}));
  monthSelect.addEventListener('change',publishMonth);
  window.DashboardModules?.get('stage-share')?.init(document.getElementById('panel-stage-share'),window.STAGE_SHARE_DATA);
  window.DashboardModules?.get('education-index')?.init(document.getElementById('panel-education-index'),window.EDUCATION_INDEX_DATA);
  window.DashboardModules?.get('coordination-index')?.init(document.querySelector('#panel-coordination-index .chart-container'),window.CoordinationIndexData);
  window.DashboardModules?.get('cooperation-network')?.init(document.getElementById('panel-cooperation-network'),{month:monthSelect.value});
  publishMonth();
  window.addEventListener('beforeunload',()=>{observer.disconnect();window.DashboardModules?.get('education-index')?.destroy?.();window.DashboardModules?.get('coordination-index')?.destroy?.();window.DashboardModules?.get('cooperation-network')?.destroy?.()},{once:true});
}());
