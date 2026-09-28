(() => {
  'use strict';
  const event=window.WEDDING;
  const $=selector=>document.querySelector(selector);
  const all=selector=>[...document.querySelectorAll(selector)];
  const welcome=$('#welcome'), invitation=$('#invitation'), openButton=$('#open-invitation');
  const date=new Date(event.date);
  const parts=Object.fromEntries(new Intl.DateTimeFormat('es-CL',{timeZone:event.timezone,day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));
  const month=new Intl.DateTimeFormat('es-CL',{timeZone:event.timezone,month:'2-digit'}).format(date);
  const time=`${parts.hour}:${parts.minute}`, initials=event.names.map(n=>n[0]);
  document.title=event.names.join(' & ')+' · Una historia eterna';
  const separator=()=>Object.assign(document.createElement('span'),{textContent:'&'});
  $('#welcome-title').replaceChildren(event.names[0]+' ',separator(),' '+event.names[1]);
  $('.hero h2').replaceChildren(event.names[0]+' ',separator(),document.createElement('br'),event.names[1]);
  $('#crest').querySelectorAll('text').forEach((el,i)=>el.textContent=initials[i]);
  $('.monogram').replaceChildren(initials[0]+' ',separator(),' '+initials[1]);
  $('.wax-seal').replaceChildren(initials[0]+' ',Object.assign(document.createElement('i'),{textContent:'&'}),' '+initials[1]);
  $('.cover-date').textContent=`${parts.day} · ${parts.month.toUpperCase()} · ${parts.year}`;
  $('.nav-date').textContent=`${parts.day}.${month}.${parts.year}`;
  $('.footer-date').textContent=`${parts.day} · ${month} · ${parts.year}`;
  $('.footer-names').textContent=event.names.join(' & ');
  const plaque=$('.date-plaque');
  plaque.children[0].textContent=parts.month.toUpperCase();plaque.children[1].textContent=parts.day;plaque.children[2].textContent=`${parts.year} · ${time} H`;
  $('#venue-time').textContent=time;
  all('[data-venue]').forEach(el=>el.textContent=event.venue);all('[data-region]').forEach(el=>el.textContent=event.region);
  $('.map-caption').textContent=event.region+' · Un rincón fuera del tiempo';
  $('#story-text').textContent=event.story;
  $('.hero-image').style.backgroundImage=`url('${event.images[0]}')`;
  $('.story-portrait img').src=event.images[1];$('.photo-break img').src=event.images[2];
  all('.gallery-item img').forEach((img,i)=>img.src=event.images[i]);
  $('.story-portrait img').alt=event.names.join(' y ')+', pareja ficticia caminando bajo los árboles';
  openButton.setAttribute('aria-label','Abrir la invitación de '+event.names.join(' y '));
  async function openInvitation(){
    if(!invitation.hidden)return {opened:true};
    if(openButton.disabled)return {opened:false,opening:true};
    openButton.disabled=true;welcome.classList.add('opening');
    await new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?0:1100));
    welcome.hidden=true;invitation.hidden=false;invitation.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});return {opened:true};
  }
  openButton.addEventListener('click',openInvitation);
  $('#close-invitation').addEventListener('click',()=>{invitation.hidden=true;welcome.hidden=false;welcome.classList.remove('opening');openButton.disabled=false;window.scrollTo({top:0,behavior:'instant'});openButton.focus({preventScroll:true});});
  function updateCountdown(){
    const remaining=Math.max(0,Math.floor((date.getTime()-Date.now())/1000));
    $('#countdown').hidden=remaining===0;$('.countdown-caption').hidden=remaining===0;$('#celebration-message').hidden=remaining!==0;
    const values=[Math.floor(remaining/86400),Math.floor(remaining/3600)%24,Math.floor(remaining/60)%60,remaining%60];
    ['days','hours','minutes','seconds'].forEach((key,i)=>$('#'+key).textContent=String(values[i]).padStart(2,'0'));
  }
  updateCountdown();setInterval(updateCountdown,1000);
  const utc=value=>new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const escapeICS=value=>String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  $('#calendar').addEventListener('click',()=>{
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Invitacion Medieval//Demo//ES','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:boda-demo-${date.getTime()}@invitacion.invalid`,`DTSTAMP:${utc(new Date())}`,`DTSTART:${utc(event.date)}`,`DTEND:${utc(event.endDate)}`,`SUMMARY:${escapeICS('DEMO · Boda de '+event.names.join(' y '))}`,`LOCATION:${escapeICS(event.venue+', '+event.region+' (lugar ficticio)')}`,'DESCRIPTION:Evento de demostración con datos ficticios. No corresponde a una boda real.','END:VEVENT','END:VCALENDAR'];
    const encoder=new TextEncoder();
    const folded=lines.map(line=>{let out='',size=0;for(const char of line){const len=encoder.encode(char).length;if(size+len>74){out+='\r\n ';size=1;}out+=char;size+=len;}return out;});
    const url=URL.createObjectURL(new Blob([folded.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}));
    const link=Object.assign(document.createElement('a'),{href:url,download:'boda-demo.ics'});document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  });
  const venueDialog=$('#venue-dialog'),photoDialog=$('#photo-dialog');
  $('#venue-details').addEventListener('click',()=>venueDialog.showModal());
  all('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});});
  all('.gallery-item').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.image);$('#lightbox-photo').src=event.images[index];$('#lightbox-photo').alt=button.querySelector('img').alt;$('#lightbox-caption').textContent=button.querySelector('span').textContent.replace('↗','').trim();photoDialog.showModal();}));
  const form=$('#rsvp-form'),name=$('#guest-name'),count=$('#guest-count');
  for(let i=1;i<=event.maxGuests;i++)count.add(new Option(`${i} ${i===1?'persona':'personas'}`,String(i)));
  $('#guests-error').textContent=`Selecciona entre 1 y ${event.maxGuests} personas.`;
  function attendanceChanged(){const no=form.elements.attendance.value==='no';$('#guest-count-field').hidden=no;count.disabled=no;count.required=!no;if(no){count.value='';count.removeAttribute('aria-invalid');$('#guests-error').hidden=true;}$('#attendance-error').hidden=true;}
  all('input[name=attendance]').forEach(radio=>radio.addEventListener('change',attendanceChanged));
  name.addEventListener('input',()=>{name.removeAttribute('aria-invalid');$('#name-error').hidden=true;});
  count.addEventListener('change',()=>{count.removeAttribute('aria-invalid');$('#guests-error').hidden=true;});
  form.addEventListener('submit',e=>{
    e.preventDefault();const attendance=form.elements.attendance.value;
    const invalidName=!name.value.trim(),invalidAttendance=!['yes','no'].includes(attendance),invalidCount=attendance==='yes'&&(!Number.isInteger(Number(count.value))||Number(count.value)<1||Number(count.value)>event.maxGuests);
    $('#name-error').hidden=!invalidName;name.setAttribute('aria-invalid',String(invalidName));$('#attendance-error').hidden=!invalidAttendance;$('#guests-error').hidden=!invalidCount;count.setAttribute('aria-invalid',String(invalidCount));
    if(invalidName){name.focus();return;}if(invalidAttendance){form.querySelector('input[name=attendance]').focus();return;}if(invalidCount){count.focus();return;}
    form.hidden=true;$('#rsvp-success').hidden=false;$('#rsvp-success>.script').textContent=attendance==='yes'?'Gracias por acompañarnos':'Gracias por hacérnoslo saber';form.reset();attendanceChanged();$('#reset-rsvp').focus({preventScroll:true});
  });
  $('#reset-rsvp').addEventListener('click',()=>{form.hidden=false;$('#rsvp-success').hidden=true;name.removeAttribute('aria-invalid');count.removeAttribute('aria-invalid');name.focus();});
  const context=document.modelContext;
  if(context?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(context.registerTool({name:'open_wedding_invitation',title:'Abrir invitación',description:'Abre el sobre y muestra la invitación ficticia. No envía ni guarda información.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async input=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Esta acción no acepta parámetros.');return openInvitation();}},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
})();
