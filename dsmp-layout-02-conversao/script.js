(function(){
  const qs = new URLSearchParams(window.location.search);
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','xcod'].forEach(id=>{
    const el = document.getElementById(id); if (el) el.value = qs.get(id) || '';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const form = document.getElementById('leadForm');
  if(!form) return;
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const countrySelect = document.getElementById('countryCode');
  const submitBtn = document.getElementById('submitBtn');
  const showError = (id, show) => document.getElementById(id).classList.toggle('show', show);
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  phoneInput.addEventListener('input', () => { phoneInput.value = phoneInput.value.replace(/\D/g,'').slice(0,13); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const nameOk = nameInput.value.trim().length > 2;
    const mailOk = emailOk(emailInput.value.trim());
    const phoneOk = phoneInput.value.replace(/\D/g,'').length >= 10;
    showError('nameError', !nameOk); showError('emailError', !mailOk); showError('phoneError', !phoneOk);
    if(!nameOk || !mailOk || !phoneOk) return;

    submitBtn.disabled = true; submitBtn.textContent = 'Abrindo seu acesso...';
    const fullPhone = countrySelect.value + phoneInput.value.replace(/\D/g,'');
    const data = new URLSearchParams();
    data.append('name', nameInput.value.trim());
    data.append('email', emailInput.value.trim());
    data.append('phone', fullPhone);
    data.append('country_code', countrySelect.value);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','xcod'].forEach(id=> data.append(id, document.getElementById(id).value || ''));
    data.append('s1','dsmp_l01_v1_aberta');
    data.append('timestamp', new Date().toISOString());
    data.append('page_url', window.location.href);

    fetch('https://n8n.mentoryacademy.com.br/webhook/rec-dsmp-page', {
      method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:data.toString(), mode:'no-cors'
    }).finally(function(){
      const params = new URLSearchParams({
        off:'ou6hxg4g', checkoutMode:'10', name:nameInput.value.trim(), email:emailInput.value.trim(), phone:fullPhone,
        src:'utm_source='+(document.getElementById('utm_source').value||'')+'|utm_medium='+(document.getElementById('utm_medium').value||'')+'|utm_campaign='+(document.getElementById('utm_campaign').value||'')+'|utm_term='+(document.getElementById('utm_term').value||'')+'|s1=dsmp_l01_v1_aberta',
        sck:document.getElementById('utm_content').value || '', xcod:document.getElementById('xcod').value || ''
      });
      window.location.href = 'https://pay.hotmart.com/L103414795W?' + params.toString();
    });
  });
})();
