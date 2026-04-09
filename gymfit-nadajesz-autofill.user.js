// ==UserScript==
// @name         GymFit -> Nadajesz Autofill
// @namespace    https://gastro.nadajesz.pl
// @version      6.0
// @match        https://gastro.nadajesz.pl/*
// @match        https://www.gastro.nadajesz.pl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==
(function() {
  var LOGIN = 'gymfitfood2000@gmail.com';
  var PASS  = 'gymfit123';

  // Pobierz dane z URL
  var p=new URLSearchParams(window.location.search);
  var phone=p.get('phone')||'';
  var street=p.get('street')||'';
  var house=p.get('house')||'';
  var flat=p.get('flat')||'';
  var amount=p.get('amount')||'';
  var card=p.get('card')==='1';
  var notes=p.get('notes')||'';
  var city=p.get('city')||'';

  // Zapisz dane do GM storage jeśli są w URL
  if(phone||street){
    GM_setValue('gf_phone',phone);
    GM_setValue('gf_street',street);
    GM_setValue('gf_house',house);
    GM_setValue('gf_flat',flat);
    GM_setValue('gf_amount',amount);
    GM_setValue('gf_card',card?'1':'0');
    GM_setValue('gf_notes',notes);
    GM_setValue('gf_city',city);
    GM_setValue('gf_ts',Date.now().toString());
  } else {
    var ts=parseInt(GM_getValue('gf_ts','0'));
    if(ts && Date.now()-ts < 10*60*1000){
      phone=GM_getValue('gf_phone','');
      street=GM_getValue('gf_street','');
      house=GM_getValue('gf_house','');
      flat=GM_getValue('gf_flat','');
      amount=GM_getValue('gf_amount','');
      card=GM_getValue('gf_card','0')==='1';
      notes=GM_getValue('gf_notes','');
      city=GM_getValue('gf_city','');
    }
  }

  // AUTO-LOGIN
  function tryLogin(){
    var loginInput = document.querySelector('input[type="email"],input[name="email"],input[name="login"],input[type="text"]');
    var passInput  = document.querySelector('input[type="password"]');
    var submitBtn  = document.querySelector('button[type="submit"],input[type="submit"]');
    if(loginInput && passInput && submitBtn){
      loginInput.value = LOGIN;
      loginInput.dispatchEvent(new Event('input',{bubbles:true}));
      passInput.value = PASS;
      passInput.dispatchEvent(new Event('input',{bubbles:true}));
      setTimeout(function(){ submitBtn.click(); }, 500);
      return true;
    }
    return false;
  }

  var isLoginPage = window.location.href.includes('login') ||
                    window.location.href.includes('signin') ||
                    document.querySelector('input[type="password"]') !== null;

  if(isLoginPage){
    var lt=0, liv=setInterval(function(){
      lt++;
      if(tryLogin() || lt>=10) clearInterval(liv);
    }, 500);
    return;
  }

  if(!phone&&!street) return;

  // Wypełnij pole tekstowe
  function s(id,v){
    var e=document.getElementById(id);
    if(!e||!v) return;
    e.focus();
    e.value=v;
    e.dispatchEvent(new Event('input',{bubbles:true}));
    e.dispatchEvent(new Event('change',{bubbles:true}));
    e.blur();
  }

  // Wybierz miejscowość z listy dropdown
  function selectCity(cityName) {
    if (!cityName) return;
    // Szukaj selecta z miastami
    var selects = document.querySelectorAll('select');
    for (var i=0; i<selects.length; i++) {
      var sel = selects[i];
      var opts = sel.options;
      // Sprawdź czy to select z miastami (ma Białystok)
      var hasBialystok = false;
      for (var j=0; j<opts.length; j++) {
        if (opts[j].text.indexOf('Białystok') !== -1 || opts[j].text.indexOf('Bialystok') !== -1) {
          hasBialystok = true; break;
        }
      }
      if (!hasBialystok) continue;

      // Szukaj pasującej opcji (dopasowanie częściowe, case-insensitive)
      var cityLower = cityName.toLowerCase().trim();
      var bestMatch = -1;
      for (var k=0; k<opts.length; k++) {
        var optText = opts[k].text.toLowerCase().trim();
        if (optText === cityLower) { bestMatch = k; break; } // dokładne dopasowanie
        if (optText.indexOf(cityLower) !== -1 && bestMatch === -1) bestMatch = k; // częściowe
      }
      if (bestMatch !== -1) {
        sel.selectedIndex = bestMatch;
        sel.dispatchEvent(new Event('change', {bubbles:true}));
      }
    }
  }

  var t=0, iv=setInterval(function(){
    t++;
    if(document.getElementById('order_phone_1') || t>=30){
      clearInterval(iv);
      if(!document.getElementById('order_phone_1')) return;

      s('order_phone_1', phone);
      s('order_street_1', street);
      s('order_nr_1', house);
      s('order_nr_lok_1', flat);
      s('order_price_1', amount);
      s('uwagi_1', notes);

      // Wybierz miejscowość z listy
      if (city) selectCity(city);

      if(card){
        var d=document.querySelector('.click_platnosc_karta');
        var i=document.getElementById('platnosc_karta_1');
        if(d&&i&&i.value!=='1') d.click();
      }

      GM_setValue('gf_ts','0');
      window.history.replaceState({},'','/');

      var b=document.createElement('div');
      b.style.cssText='position:fixed;top:0;left:0;right:0;background:#27ae60;color:white;padding:14px;font-size:16px;font-weight:bold;text-align:center;z-index:99999;cursor:pointer';
      b.textContent='Wypelniono! '+phone+' - '+street+' '+house+(flat?'/'+flat:'')+' '+city+' - '+(card?'KARTA':(amount?amount+' zl':'ONLINE'))+(notes?' - '+notes:'');
      b.onclick=function(){b.remove();};
      document.body.appendChild(b);
      setTimeout(function(){if(b.parentNode)b.remove();},8000);
    }
  }, 300);
})();
