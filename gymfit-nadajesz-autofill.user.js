// ==UserScript==
// @name         GymFit -> Nadajesz Autofill
// @namespace    https://gastro.nadajesz.pl
// @version      4.0
// @match        https://gastro.nadajesz.pl/*
// @match        https://www.gastro.nadajesz.pl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==
(function() {
  // Pobierz dane z URL lub z GM storage (po przekierowaniu logowania)
  var p=new URLSearchParams(window.location.search);
  var phone=p.get('phone')||'';
  var street=p.get('street')||'';
  var house=p.get('house')||'';
  var flat=p.get('flat')||'';
  var amount=p.get('amount')||'';
  var card=p.get('card')==='1';
  var notes=p.get('notes')||'';

  // Jeśli są dane w URL - zapisz do GM storage na wypadek przekierowania
  if(phone||street){
    GM_setValue('gf_phone',phone);
    GM_setValue('gf_street',street);
    GM_setValue('gf_house',house);
    GM_setValue('gf_flat',flat);
    GM_setValue('gf_amount',amount);
    GM_setValue('gf_card',card?'1':'0');
    GM_setValue('gf_notes',notes);
    GM_setValue('gf_ts',Date.now().toString());
  } else {
    // Brak danych w URL - sprawdź GM storage (po przekierowaniu)
    var ts=parseInt(GM_getValue('gf_ts','0'));
    if(ts && Date.now()-ts < 10*60*1000) {
      phone=GM_getValue('gf_phone','');
      street=GM_getValue('gf_street','');
      house=GM_getValue('gf_house','');
      flat=GM_getValue('gf_flat','');
      amount=GM_getValue('gf_amount','');
      card=GM_getValue('gf_card','0')==='1';
      notes=GM_getValue('gf_notes','');
    }
  }

  if(!phone&&!street)return;

  function s(id,v){var e=document.getElementById(id);if(!e||!v)return;e.focus();e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.blur();}

  var t=0,iv=setInterval(function(){
    t++;
    if(document.getElementById('order_phone_1')||t>=30){
      clearInterval(iv);
      if(!document.getElementById('order_phone_1'))return;
      s('order_phone_1',phone);
      s('order_street_1',street);
      s('order_nr_1',house);
      s('order_nr_lok_1',flat);
      s('order_price_1',amount);
      s('uwagi_1',notes);
      if(card){var d=document.querySelector('.click_platnosc_karta'),i=document.getElementById('platnosc_karta_1');if(d&&i&&i.value!=='1')d.click();}
      // Wyczyść storage po wypełnieniu
      GM_setValue('gf_ts','0');
      window.history.replaceState({},'','/');
      var b=document.createElement('div');
      b.style.cssText='position:fixed;top:0;left:0;right:0;background:#27ae60;color:white;padding:14px;font-size:16px;font-weight:bold;text-align:center;z-index:99999;cursor:pointer';
      b.textContent='Wypelniono! '+phone+' - '+street+' '+house+(flat?'/'+flat:'')+' - '+(card?'KARTA':(amount?amount+' zl':'ONLINE'))+(notes?' - '+notes:'');
      b.onclick=function(){b.remove();};
      document.body.appendChild(b);
      setTimeout(function(){if(b.parentNode)b.remove();},8000);
    }
  },300);
})();
