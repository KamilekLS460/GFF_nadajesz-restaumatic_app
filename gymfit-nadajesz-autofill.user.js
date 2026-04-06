// ==UserScript==
// @name         GymFit -> Nadajesz Autofill
// @namespace    https://gastro.nadajesz.pl
// @version      3.1
// @description  Automatycznie wypelnia formularz Nadajesz danymi z URL
// @author       GymFit Food
// @match        https://gastro.nadajesz.pl/*
// @match        https://www.gastro.nadajesz.pl/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  var params = new URLSearchParams(window.location.search);
  var phone  = params.get('phone')  || '';
  var street = params.get('street') || '';
  var house  = params.get('house')  || '';
  var flat   = params.get('flat')   || '';
  var amount = params.get('amount') || '';
  var card   = params.get('card')   === '1';
  var notes  = params.get('notes')  || '';
  if (!phone && !street) return;
  function setVal(id, val) {
    var el = document.getElementById(id);
    if (!el || !val) return;
    el.focus(); el.value = val;
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.blur();
  }
  function fillForm() {
    setVal('order_phone_1',  phone);
    setVal('order_street_1', street);
    setVal('order_nr_1',     house);
    setVal('order_nr_lok_1', flat);
    setVal('order_price_1',  amount);
    setVal('uwagi_1',        notes);
    if (card) {
      var d = document.querySelector('.click_platnosc_karta');
      var i = document.getElementById('platnosc_karta_1');
      if (d && i && i.value !== '1') d.click();
    }
    window.history.replaceState({}, document.title, '/');
    var b = document.createElement('div');
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#27ae60;color:white;padding:14px 20px;font-size:16px;font-weight:bold;text-align:center;z-index:99999;cursor:pointer';
    b.textContent = 'Wypelniono! ' + phone + ' - ' + street + ' ' + house + (flat?'/'+flat:'') + ' - ' + (card?'KARTA':(amount?amount+' zl':'ONLINE')) + (notes?' - '+notes:'');
    b.onclick = function(){ b.remove(); };
    document.body.appendChild(b);
    setTimeout(function(){ if(b.parentNode) b.remove(); }, 8000);
  }
  var t=0, iv=setInterval(function(){
    t++;
    if(document.getElementById('order_phone_1')||t>=20){
      clearInterval(iv);
      if(document.getElementById('order_phone_1')) fillForm();
    }
  }, 300);
})();
