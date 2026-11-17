const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
/* штампы */
let st={game:0,quiz:0,facts:0};
try{Object.assign(st,JSON.parse(localStorage.getItem('bilby')||'{}'))}catch(e){}
function paint(){let n=0;$$('.stamp').forEach(s=>{const on=st[s.dataset.k];s.classList.toggle('on',!!on);n+=on?1:0});$('#cnt').textContent=n;return n}
function stamp(k){if(!st[k]){st[k]=1;try{localStorage.setItem('bilby',JSON.stringify(st))}catch(e){}}paint()}
paint();
/* появление блоков и параллакс */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
const d1=$('.d1'),d2=$('.d2'),pl=$('.polaroid');
addEventListener('scroll',()=>{const y=Math.min(scrollY,600);d1.style.transform=`translateY(${y*.12}px)`;d2.style.transform=`translateY(${-y*.05}px)`;pl.style.transform=`rotate(3deg) translateY(${y*.08}px)`},{passive:true});
/* игра */
const FR='<svg viewBox="0 0 40 40"><circle cx="20" cy="23" r="13" fill="#c2371f"/><path d="M20 10q2-7 9-7q-1 7-9 7z" fill="#3f8f4b"/><circle cx="15" cy="19" r="3" fill="#fff" opacity=".35"/></svg>';
const LZ='<svg viewBox="0 0 64 40"><g fill="#6b7a35" stroke="#6b7a35" stroke-linecap="round"><ellipse cx="30" cy="20" rx="18" ry="8" stroke="none"/><circle cx="10" cy="19" r="6" stroke="none"/><path d="M46 19Q60 20 62 8" fill="none" stroke-width="5"/><path d="M20 26l-5 9M40 26l5 9M20 14l-5-9M40 14l5-9" fill="none" stroke-width="4"/></g><circle cx="8" cy="17" r="1.8" fill="#fff"/></svg>';
const egg=o=>`<svg viewBox="0 0 20 26" width="18" style="opacity:${o};margin-left:4px"><ellipse cx="10" cy="14" rx="8" ry="11" fill="#fff" stroke="#3a2a22" stroke-width="2"/></svg>`;
const H=$('#holes');
for(let i=0;i<9;i++){const b=document.createElement('button');b.className='hole';b.setAttribute('aria-label','Нора '+(i+1));b.onclick=()=>hit(i);H.appendChild(b)}
const holes=[...H.children],cur={};let score=0,lives=3,t=30,run=false,tm,sp;
function eggs(){$('#gh').innerHTML=[0,1,2].map(i=>egg(i<lives?1:.2)).join('')}
function clr(i){if(cur[i]){clearTimeout(cur[i].to);delete cur[i]}holes[i].innerHTML=''}
function spawn(){const free=holes.map((_,i)=>i).filter(i=>!cur[i]);if(!free.length)return;
const i=free[Math.random()*free.length|0],liz=Math.random()<.35;
holes[i].innerHTML=liz?LZ:FR;cur[i]={liz};
cur[i].to=setTimeout(()=>{if(!cur[i])return;if(cur[i].liz){lives--;eggs();$('#gm').textContent='Ящерица разбила яйцо!';if(lives<=0)end()}clr(i)},1200)}
function hit(i){if(!run||!cur[i])return;score+=cur[i].liz?2:1;$('#gm').textContent=cur[i].liz?'Прогнал! +2':'Вкусно! +1';$('#gs').textContent=score;clr(i)}
function end(){run=false;clearInterval(tm);clearInterval(sp);holes.forEach((_,i)=>clr(i));
const w=score>=8;$('#gm').textContent=w?`Итог: ${score}. Яйца целы, штамп твой!`:`Итог: ${score}. Нужно 8, попробуй ещё!`;
if(w)stamp('game');$('#gb').textContent='Ещё раз'}
$('#gb').onclick=()=>{if(run)return;score=0;lives=3;t=30;run=true;$('#gs').textContent=0;$('#gt').textContent=t;eggs();$('#gm').textContent='Лови!';
tm=setInterval(()=>{t--;$('#gt').textContent=t;if(t<=0)end()},1000);sp=setInterval(spawn,650)};
eggs();
/* анкета */
const Q=[['Ты нашёл последний плод. Что делаешь?',['Прячу на чёрный день','Делюсь с тем, кто рядом','Съедаю сразу, вдруг не повезёт']],
['Рядом хищник. План?',['Рою нору и жду','Отвлекаю и увожу за собой','Бегу быстрее ветра']],
['Твой главный талант?',['Хитрость','Заботливость','Скорость']]];
const R=[['Стратег','Ты просчитываешь всё на три хода вперёд. Идеальный напарник для экспедиции.'],
['Хранитель','Ты тот, за кем идут. Даже самый ворчливый герой в душе такой же.'],
['Спринтер','Тебя не поймать. Энергия и юмор — твоё оружие.']];
let qi=0,qa=[0,0,0];
function qr(){const c=$('#qz');
if(qi>=Q.length){const m=qa.indexOf(Math.max(...qa));stamp('quiz');
c.innerHTML=`<h3 style="font:900 28px Nunito">В пустыне ты — ${R[m][0]}</h3><p>${R[m][1]}</p><p><b>Штамп получен.</b></p><button class="btn" id="qr">Заново</button>`;
$('#qr').onclick=()=>{qi=0;qa=[0,0,0];qr()};return}
c.innerHTML=`<p><b>Вопрос ${qi+1} из 3</b></p><h3 style="font:900 24px Nunito;margin:0 0 8px">${Q[qi][0]}</h3>`+Q[qi][1].map((o,j)=>`<button class="opt" data-j="${j}">${o}</button>`).join('');
$$('.opt').forEach(b=>b.onclick=()=>{qa[b.dataset.j]++;qi++;qr()})}
qr();
/* заметки */
const F=[['Уши-радиаторы','Огромные уши не только слышат, но и помогают сбрасывать жар.'],
['Ночной житель','Днём билби спит в норе, а на охоту выходит, когда спадает жара.'],
['Без воды','Билби почти не пьёт: влагу берёт из еды — насекомых, семян, корешков.'],
['Пасхальный билби','В Австралии вместо пасхального кролика часто выбирают билби.']];
let op=0;
F.forEach(f=>{const b=document.createElement('button');b.className='scrap';b.innerHTML=`<b>${f[0]}</b><span>Нажми, чтобы прочитать</span>`;
b.onclick=()=>{if(b.classList.contains('open'))return;b.classList.add('open');b.querySelector('span').textContent=f[1];if(++op>=3)stamp('facts')};$('#fg').appendChild(b)});
/* билет */
$('#tb').onclick=()=>{const n=$('#nm').value.trim();if(!n){$('#nm').focus();return}
const code='BLB-'+Math.random().toString(36).slice(2,6).toUpperCase(),s=paint();
$('#tk').innerHTML=`<div class="ticket"><div class="m"><small>Пропуск на показ</small><h3></h3><div>${$('#gr').value} · ${$('#se').value}</div><p style="margin:.6em 0 0">${s>=3?'Все штампы собраны: бонус на входе твой!':`Штампов: ${s} из 3. Соберёшь все — получишь бонус.`}</p></div><div class="s">${code}</div></div>`;
$('#tk h3').textContent=n;$('#tk').scrollIntoView({block:'center'})};
