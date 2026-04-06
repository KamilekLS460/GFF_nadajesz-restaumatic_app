// ==UserScript==
// @name         GymFit -> Nadajesz Autofill
// @namespace    https://gastro.nadajesz.pl
// @version      3.1
// @match        https://gastro.nadajesz.pl/*
// @match        https://www.gastro.nadajesz.pl/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(function() {
  var p=new URLSearchParams(window.location.search);
  var phone=p.get('phone')||'',street=p.get('street')||'',house=p.get('house')||'',flat=p.get('flat')||'',amount=p.get('amount')||'',card=p.get('card')==='1',notes=p.get('notes')||'';
  if(!phone&&!street)return;
  function s(id,v){var e=document.getElementById(id);if(!e||!v)return;e.focus();e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.blur();}
  var t=0,iv=setInterval(function(){t++;if(document.getElementById('order_phone_1')||t>=20){clearInterval(iv);if(!document.getElementById('order_phone_1'))return;s('order_phone_1',phone);s('order_street_1',street);s('order_nr_1',house);s('order_nr_lok_1',flat);s('order_price_1',amount);s('uwagi_1',notes);if(card){var d=document.querySelector('.click_platnosc_karta'),i=document.getElementById('platnosc_karta_1');if(d&&i&&i.value!=='1')d.click();}window.history.replaceState({},'','/');var b=document.createElement('div');b.style.cssText='position:fixed;top:0;left:0;right:0;background:#27ae60;color:white;padding:14px;font-size:16px;font-weight:bold;text-align:center;z-index:99999;cursor:pointer';b.textContent='Wypelniono! '+phone+' - '+street+' '+house+(flat?'/'+flat:'')+' - '+(card?'KARTA':(amount?amount+' zl':'ONLINE'))+(notes?' - '+notes:'');b.onclick=function(){b.remove();};document.body.appendChild(b);setTimeout(function(){if(b.parentNode)b.remove();},8000);}},300);
})();
