(function(){
  'use strict';
  const TYPE_COLORS={高校:'#168cff',中小学:'#24d18d',职业院校:'#ffd34c',科研机构:'#b877ff',政府部门:'#ff6478',企业:'#ff9f43',其他:'#a8b7c7'};
  const areaOptions=['全部地区','北京&天津','北京&河北','天津&河北','北京&天津&河北'];
  const legend=Object.entries(TYPE_COLORS).map(([name,color])=>`<span><i style="background:${color}"></i>${name}</span>`).join('');
  const module={
    init(panel,initial){
      this.destroy(); this.panel=panel;
      const actions=panel.querySelector('.panel-actions');
      actions.innerHTML=`<label class="network-area-label">合作地区<select aria-label="合作地区">${areaOptions.map(x=>`<option>${x}</option>`).join('')}</select></label><a class="jjj-network__detail-link" href="assets/cooperation-network.html" target="_blank" rel="noopener">查看详情</a>`;
      const body=panel.querySelector('.panel-body');
      body.innerHTML=`<div class="jjj-network-frame"><iframe title="教育协同合作网络" src="assets/cooperation-network.html?mode=dashboard"></iframe></div><div class="network-type-legend" aria-label="机构类型图例">${legend}</div><p class="network-evidence-note">连线仅展示已纳入的“具体机构 + 明确合作行为”事件证据；未将同篇新闻中的机构自动两两连接。</p>`;
      this.frame=body.querySelector('iframe'); this.area=actions.querySelector('select'); this.month=initial?.month||'';
      this.send=()=>{this.frame?.contentWindow?.postMessage({type:'cooperation-network-filter',month:this.month,area:this.area.value},'*');const metrics=this.frame?.contentDocument?.querySelector('.metrics');if(metrics)metrics.style.visibility='hidden'};
      this.messageHandler=event=>{if(event.source!==this.frame?.contentWindow)return;if(event.data?.type==='cooperation-network-ready')this.send();if(event.data?.type==='cooperation-network-month-summary')window.dispatchEvent(new CustomEvent('dashboard:map-month-data',{detail:event.data}))}; window.addEventListener('message',this.messageHandler);
      this.frame.addEventListener('load',this.send); this.area.addEventListener('change',this.send);
      this.monthHandler=e=>{this.month=e.detail?.month||'';this.send()}; window.addEventListener('dashboard:month-change',this.monthHandler);
    },
    resize(){},
    destroy(){ if(this.monthHandler)window.removeEventListener('dashboard:month-change',this.monthHandler); if(this.messageHandler)window.removeEventListener('message',this.messageHandler); this.frame=null; this.monthHandler=this.messageHandler=null; }
  };
  window.DashboardModules?.register('cooperation-network',module);
}());
