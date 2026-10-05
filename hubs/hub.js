(function(){
var H=window.HUB||{};
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
function ok(v){return v!==null&&v!==''&&v!=='false'&&v!=='0'}
if(H.type!=='cos')return;
var G=[[1,'The Call','gate-one.html'],[2,'The Stillness','gate-two.html'],[3,'The Wilderness','gate-three.html'],[4,'Surrender','gate-four.html'],[5,'Trust','gate-five.html'],[6,'Becoming','gate-six.html']];
var base='https://sanctuary-grace.com/',done=0,list=document.getElementById('status'),note=document.getElementById('status-note');
var v={};G.forEach(function(g){v[g[0]]=ok(ls('gate'+g[0]+'_verified'));if(v[g[0]])done=Math.max(done,g[0])});
var nextN=0;for(var i=1;i<=6;i++){if(!v[i]){nextN=i;break}}
if(list){var h='<li class="done"><span><a href="'+base+'gate-zero.html">Gate Zero: The Threshold</a></span><span class="st">Free</span></li>';
G.forEach(function(g){var cls=v[g[0]]?'done':(g[0]===nextN?'next':''),st=v[g[0]]?'Unlocked':'$9';h+='<li class="'+cls+'"><span><a href="'+base+g[2]+'">Gate '+g[0]+': '+g[1]+'</a></span><span class="st">'+st+'</span></li>'});list.innerHTML=h}
var t=document.getElementById('next-title'),x=document.getElementById('next-text'),b=document.getElementById('next-btn');
if(done>0&&nextN){var g=G[nextN-1];t.textContent='Continue to Gate '+g[0]+': '+g[1];x.textContent='Your unlocked gates stay open on this device. Gate '+g[0]+' is $9, one time, with lifetime access.';b.textContent='Open Gate '+g[0];b.href=base+g[2];if(note)note.textContent='You have unlocked '+done+' of 6 gates on this device.'}
else if(done>0&&!nextN){t.textContent='You have walked all six gates';x.textContent='What you have learned is yours. When you are ready for a longer, quieter place to stay, the Secret Place is next.';b.textContent='Go to The Secret Place hub';b.href=base+'hubs/secret-place.html';if(note)note.textContent='All six gates are unlocked on this device.'}
})();
