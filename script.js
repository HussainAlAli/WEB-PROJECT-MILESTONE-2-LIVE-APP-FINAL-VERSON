// This file does not store image URLs. It only switches states and classes that consume values from index.html.

// =========================================================
// ChefLak JavaScript
// ---------------------------------------------------------
// 1) App config and in-memory demo database
// 2) Translation dictionary
// 3) Data for chefs and team
// 4) Helpers and page navigation
// 5) Rendering functions
// 6) Booking / payment logic
// 7) Form handlers and event binding
// =========================================================

// App config
const Config = { SERVICE_FEE: 30 };

// Demo in-memory database
const DB = { users: { '0512345678': { name: 'Demo User', city: 'Dammam', password: '123456', orders: [] } } };
const State = { user: null, lang: 'ar', booking: { chef: null, hours: 4 } };

// =====================================================
// CUSTOM ADDITION: Authentication Validation System
// تمت إضافته للتحقق من:
// 1- رقم الجوال
// 2- الاسم
// 3- كلمة المرور
// 4- تسجيل الدخول والتسجيل
// =====================================================

const AuthValidator = {

  validatePhone(phone) {
    const cleaned = phone.replace(/\s+/g, '');
    // يقبل:
    // 512345678
    // أو
    // 0512345678
    const phoneRegex = /^(05\d{8}|5\d{8})$/;

    if (!cleaned) {
      return {
        valid: false,
        message: State.lang === 'ar'
          ? 'رقم الجوال مطلوب'
          : 'Phone number is required'
      };
    }

    if (!phoneRegex.test(cleaned)) {
      return {
        valid: false,
        message: State.lang === 'ar'
          ? 'رقم الجوال غير صحيح'
          : 'Invalid phone number'
      };
    }

    return { valid: true };
  },

  validateName(name) {
    if (!name || name.trim().length < 3) {
      return {
        valid: false,
        message: State.lang === 'ar'
          ? 'الاسم يجب أن يكون 3 أحرف على الأقل'
          : 'Name must be at least 3 characters'
      };
    }

    return { valid: true };
  },

  validatePassword(password) {

    // كلمة المرور يجب أن تحتوي:
    // حرف كبير + حرف صغير + رقم + 8 أحرف
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!password) {
      return {
        valid: false,
        message: State.lang === 'ar'
          ? 'كلمة المرور مطلوبة'
          : 'Password is required'
      };
    }

    if (!passwordRegex.test(password)) {
      return {
        valid: false,
        message: State.lang === 'ar'
          ? 'كلمة المرور يجب أن تحتوي على 8 أحرف وحرف كبير ورقم'
          : 'Password must contain 8 characters, uppercase letter and number'
      };
    }

    return { valid: true };
  }
};

// =====================================================
// CUSTOM ADDITION
// التحقق من صحة بيانات تسجيل الدخول
// =====================================================
function validateLoginForm(phone, password) {

  const phoneCheck = AuthValidator.validatePhone(phone);

  if (!phoneCheck.valid) {
    alert(phoneCheck.message);
    return false;
  }

  if (!password || password.length < 6) {
    alert(
      State.lang === 'ar'
        ? 'كلمة المرور غير صحيحة'
        : 'Invalid password'
    );

    return false;
  }

  return true;
}

// =====================================================
// CUSTOM ADDITION: Booking Date Lock System
// يمنع الحجز قبل تاريخ 16 مايو 2026
// =====================================================

function validateBookingDate(dateValue) {

  const selectedDate = new Date(dateValue);
  // أقل تاريخ متاح للحجز
  const minimumDate = new Date('2026-05-16');

  selectedDate.setHours(0,0,0,0);
  minimumDate.setHours(0,0,0,0);

  if (selectedDate < minimumDate) {
    alert(
      State.lang === 'ar'
        ? 'الحجز قبل 16 مايو 2026 غير متاح'
        : 'Booking before May 16, 2026 is not available'
    );

    return false;
  }

  return true;
}

// =====================================================
// CUSTOM ADDITION
// التحقق من صحة بيانات إنشاء الحساب
// =====================================================
function validateRegisterForm(formData) {

  const nameCheck =
    AuthValidator.validateName(formData.name);

  if (!nameCheck.valid) {
    alert(nameCheck.message);
    return false;
  }

  const phoneCheck =
    AuthValidator.validatePhone(formData.phone);

  if (!phoneCheck.valid) {
    alert(phoneCheck.message);
    return false;
  }

  const passwordCheck =
    AuthValidator.validatePassword(formData.password);

  if (!passwordCheck.valid) {
    alert(passwordCheck.message);
    return false;
  }

  return true;
}

// Translations
const T = {
  ar: {
    nav_home:'الرئيسية', nav_orders:'الطلبات', nav_about:'عن المنصة', login_subtitle:'احجز نخبة الطهاة في المنطقة الشرقية', tab_login:'دخول', tab_register:'تسجيل',
    phone_label:'رقم الجوال', password_label:'الرقم السري', btn_signin:'تسجيل الدخول', btn_demo:'تعبئة بيانات التجربة (0512345678)', name_label:'الاسم الكامل', city_label:'المدينة', btn_register:'إنشاء الحساب',
    saudi_experience:'تجربة طهي أصيلة', hero_title:'ارتقِ بتجربة تناول الطعام', hero_subtitle:'احجز أفضل الطهاة الخاصين في المنطقة الشرقية لمناسبتك القادمة.', home_title:'اكتشف الطهاة', welcome_back:'أهلاً بك،',
    total_bookings:'إجمالي الطلبات', years_exp:'سنوات خبرة', book_btn:'احجز الآن', currency:'ر.س', per_hour:'/ساعة', private_dining:'تفاصيل الحجز', rate_label:'سعر الساعة', gallery_title:'الأطباق المميزة',
    date_label:'التاريخ', time_label:'الوقت', address_label:'العنوان', duration_label:'المدة', service_fee:'رسوم الخدمة', total_label:'الإجمالي', btn_proceed:'إتمام الدفع', secure_payment:'الدفع', total_due:'المبلغ المطلوب',
    card_number:'رقم البطاقة', expiry_date:'الانتهاء', cvv_code:'CVV', btn_pay:'ادفع الآن', cancel_return:'رجوع', booking_confirmed:'تم التأكيد!', success_msg:'الشيف جاهز لخدمتك في مناسبتك.', ref_number:'المرجع', chef_name:'الشيف', total_paid:'المدفوع',
    go_orders:'عرض الطلب', back_home:'الرئيسية', my_bookings:'طلباتي', about_title:'عن شيف لك', about_desc:'"شيف لك" منصة متخصصة تربط العملاء بطهاة محترفين لتقديم تجارب طهي مميزة في المنازل والمناسبات الخاصة. نستهدف الأفراد، العائلات، والفعاليات، ونوفر إمكانية حجز طهاة متخصصين في مختلف أنواع الأطباق، مع تجربة حجز سهلة وسريعة تلبي احتياجات العملاء بكفاءة. نخدم حالياً المنطقة الشرقية، وتشمل: الدمام، الخبر، الظهران، بالإضافة إلى بعض المناطق القريبة، وذلك حسب توفر الطهاة',
	status_confirmed:'مؤكد',
	footer_contact:'تواصل معنا',
	footer_desc:'نحن في "شيف لك" نسعد بتواصلك معنا. يمكنك متابعة أحدث أخبارنا وعروضنا وتجارب الطهي المميزة عبر حساباتنا على وسائل التواصل الاجتماعي، أو مراسلتنا مباشرة لأي استفسار.',
	footer_instagram:'انستقرام',
	footer_twitter:'تويتر',
	footer_whatsapp:'واتساب',
	footer_email:'البريد',
	footer_copy:'© 2026 منصة شيف لك. جميع الحقوق محفوظة.'
  },
  en: {
    nav_home:'Home', nav_orders:'Orders', nav_about:'About', login_subtitle:'Book elite chefs in the Eastern Province', tab_login:'Login', tab_register:'Register',
    phone_label:'Mobile Number', password_label:'Password', btn_signin:'Sign In', btn_demo:'Fill Demo Login (0512345678)', name_label:'Full Name', city_label:'City', btn_register:'Create Account',
    saudi_experience:'Authentic Culinary Experience', hero_title:'Elevate Your Dining Experience', hero_subtitle:'Book the best private chefs in the Eastern Province for your next gathering.', home_title:'Discover Chefs', welcome_back:'Welcome back,',
    total_bookings:'Total Bookings', years_exp:'Years Exp.', book_btn:'Book Now', currency:'SAR', per_hour:'/hr', private_dining:'Booking Details', rate_label:'Hourly Rate', gallery_title:'Specialties',
    date_label:'Date', time_label:'Time', address_label:'Address', duration_label:'Duration', service_fee:'Service Fee', total_label:'Total', btn_proceed:'Proceed to Payment', secure_payment:'Payment', total_due:'Amount Due',
    card_number:'Card Number', expiry_date:'Expiry', cvv_code:'CVV', btn_pay:'Pay Now', cancel_return:'Back', booking_confirmed:'Confirmed!', success_msg:'Your chef is ready for your event.', ref_number:'Reference', chef_name:'Chef', total_paid:'Paid',
    go_orders:'View Order', back_home:'Home', my_bookings:'My Bookings', about_title:'About ChefLak', about_desc:'"Chef Lak" is a platform that connects clients with professional chefs to deliver unique private dining experiences at home or for special occasions. We serve individuals, families, and private events by offering access to specialized chefs across a variety of cuisines, all through a simple and seamless booking experience tailored to the client’s needs. We currently operate in the Eastern Province of Saudi Arabia, including Dammam, Khobar, Dhahran, and nearby areas, depending on chef availability.',
	status_confirmed:'Confirmed',
	footer_contact:'Contact Us',
	footer_desc:'At "Chef Lak", we\'d love to hear from you. Follow our latest news, offers, and dining experiences on our social media channels, or reach out directly for any inquiry.',
	footer_instagram:'Instagram',
	footer_twitter:'Twitter',
	footer_whatsapp:'WhatsApp',
	footer_email:'Email',
	footer_copy:'© 2026 Chef Lak Platform. All rights reserved.'
  }
};

// Chef data displayed on the home page
const chefs = [
{id:1,en:'Chef Tariq',ar:'الشيف طارق',city_en:'Dammam',city_ar:'الدمام',exp:8,rate:150,rating:4.9,imgClass:'',galleryClasses:[],desc_en:'Master of traditional feasts and Mandi.',desc_ar:'يضبط لك الذبايح والمندي على الأصول، يبيض وجهك في العزايم الكبيرة.',tags_en:['Mandi','Grills'],tags_ar:['مندي','مشاوي']},
{id:2,en:'Chef Sarah',ar:'الشيف سارة',city_en:'Khobar',city_ar:'الخبر',exp:5,rate:120,rating:4.8,imgClass:'',galleryClasses:[],desc_en:'Expert pastry chef.',desc_ar:'فنانة بالحلويات، تضبط لك حلى القهوة اللي يواجه ضيوفك.',tags_en:['Sweets','French'],tags_ar:['حلويات','فرنسي']},
{id:3,en:'Chef Khaled',ar:'الشيف خالد',city_en:'Dhahran',city_ar:'الظهران',exp:12,rate:180,rating:5.0,imgClass:'',galleryClasses:[],desc_en:'Fresh handmade pasta and risotto.',desc_ar:'يجيب لك إيطاليا لين بيتك! باستا فريش وريزوتو على كيف كيفك.',tags_en:['Italian','Pasta'],tags_ar:['إيطالي','باستا']},
{id:4,en:'Chef Fatima',ar:'الشيف فاطمة',city_en:'Dammam',city_ar:'الدمام',exp:6,rate:160,rating:4.7,imgClass:'',galleryClasses:[],desc_en:'Amazing seafood spreads.',desc_ar:'بحرية تفتح النفس! تضبط لك صواني السي فود والطبخات الساحلية.',tags_en:['Seafood','Fusion'],tags_ar:['بحريات','فيوجن']},
{id:5,en:'Chef Abdullah',ar:'الشيف عبدالله',city_en:'Khobar',city_ar:'الخبر',exp:4,rate:130,rating:4.9,imgClass:'',galleryClasses:[],desc_en:'King of BBQ and burgers.',desc_ar:'ملك الشوي والبرقرات، يضبط لك أحلى باربكيو بحديقة البيت.',tags_en:['Burgers','BBQ'],tags_ar:['برجر','شواء']},
{id:6,en:'Chef Noura',ar:'الشيف نورة',city_en:'Dhahran',city_ar:'الظهران',exp:3,rate:140,rating:4.6,imgClass:'',galleryClasses:[],desc_en:'Healthy and delicious meals.',desc_ar:'أكل صحي ولذيذ بنفس الوقت، تضبط لك سلطات ووجبات خفيفة.',tags_en:['Healthy','Vegan'],tags_ar:['صحي','نباتي']}
];

// Team data displayed on the about page
const team = [
{en:'Ahmed Al Qaisoum',ar:'أحمد آل قيصوم',role_en:'Founder & CEO',role_ar:'المؤسس والمدير التنفيذي',avatarClass:''},
{en:'Hussein Al Ali',ar:'حسين العلي',role_en:'COO',role_ar:'مدير العمليات',avatarClass:''},
{en:'Sultan Al Khalaf',ar:'سلطان الخلف',role_en:'CTO',role_ar:'المدير التقني',avatarClass:''},
{en:'Fares Al Dahesh',ar:'فارس الدهش',role_en:'CMO',role_ar:'مدير التسويق',avatarClass:''}
];

// Small helper functions
function t(k){return T[State.lang][k] || k}
function q(s){return document.querySelector(s)}
function qa(s){return [...document.querySelectorAll(s)]}

// Page navigation controller
function show(page){ qa('.page').forEach(p=>p.classList.remove('active')); q('#'+page).classList.add('active'); q('#main-nav').classList.toggle('hidden', page==='page-login'); q('#login-lang-btn').classList.toggle('hidden', page!=='page-login'); qa('[data-nav]').forEach(b=>b.classList.toggle('active', b.dataset.nav===page)); if(page==='page-orders') renderOrders(); }

function applyLang(){ document.documentElement.lang = State.lang; document.documentElement.dir = State.lang==='ar'?'rtl':'ltr'; qa('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n)); q('#lang-btn').textContent = State.lang==='ar'?'English':'عربي'; q('#login-lang-btn').textContent = State.lang==='ar'?'English':'عربي'; renderChefs(); renderTeam(); updateCounts(); }

// Render chef cards on the home page
function renderChefs(){ q('#chefs-container').innerHTML = chefs.map(c=>{ const name=State.lang==='ar'?c.ar:c.en; const city=State.lang==='ar'?c.city_ar:c.city_en; const desc=State.lang==='ar'?c.desc_ar:c.desc_en; const tags=(State.lang==='ar'?c.tags_ar:c.tags_en).map(x=>`<span class="tag">${x}</span>`).join(''); return `<article class="chef-card"><div class="chef-media"><div class="chef-photo chef-photo-${c.id}" style="width: 100%; height: 100%;"></div><div class="rate-chip">⭐ ${c.rating}</div><div class="chef-name">${name}</div></div><div class="chef-body"><div class="chef-meta">📍 ${city} • ${c.exp} ${t('years_exp')}</div><div>${desc}</div><div class="tags">${tags}</div><div class="chef-footer"><button class="btn primary book-btn" data-chef="${c.id}">${t('book_btn')}</button><div class="price">${c.rate} <small>${t('currency')}${t('per_hour')}</small></div></div></div></article>` }).join(''); qa('.book-btn').forEach(b=>b.onclick=()=>openBooking(+b.dataset.chef)); }

// Render about team cards
function renderTeam(){ q('#team-container').innerHTML = team.map((m,index)=>`<article class="team-card"><div class="team-avatar team-avatar-${index + 1}"></div><h3>${State.lang==='ar'?m.ar:m.en}</h3><p class="muted">${State.lang==='ar'?m.role_ar:m.role_en}</p></article>`).join(''); }

// Open booking modal with selected chef details
function openBooking(id){ const chef = chefs.find(c=>c.id===id); State.booking.chef = chef; State.booking.hours = 4; q('#booking-chef-name').textContent = State.lang==='ar'?chef.ar:chef.en; q('#booking-rating').textContent = chef.rating; q('#booking-rate').textContent = chef.rate; q('#page-booking').setAttribute('data-chef-id', chef.id); qa('.hour-btn').forEach(btn=>btn.classList.toggle('selected', btn.dataset.hours==='4')); updateSummary(); q('#booking-error') && q('#booking-error').classList.add('hidden'); show('page-booking'); }

// Recalculate booking totals
function updateSummary(){ if(!State.booking.chef) return; const subtotal = State.booking.chef.rate * State.booking.hours; const total = subtotal + Config.SERVICE_FEE; q('#calc-breakdown').textContent = `${State.booking.hours} × ${State.booking.chef.rate} ${t('currency')}`; q('#calc-subtotal').textContent = `${subtotal} ${t('currency')}`; q('#calc-total').textContent = total; }
function updateCounts(){ if(!State.user) return; const count = DB.users[State.user].orders.length; q('#home-order-count').textContent = count; q('#page-order-count').textContent = count; q('#nav-order-count').textContent = count; q('#nav-order-count').classList.toggle('hidden', count===0); }

// Render user orders list
function renderOrders(){ if(!State.user) return; const orders = DB.users[State.user].orders; q('#orders-container').innerHTML = orders.length? orders.map(o=>`<article class="order-card"><div class="order-top"><div><h3>${o.chef}</h3><span class="status-pill">${t('status_confirmed')}</span><div class="muted">${o.date} • ${o.ref}</div></div><div><strong>${o.total} ${t('currency')}</strong></div></div><div class="progress"><span></span></div></article>`).join('') : `<article class="order-card"><p>${State.lang==='ar'?'لا توجد طلبات حالياً':'No bookings yet'}</p></article>`; }

// Handle login form submit
function login(e){
  e.preventDefault();

  const phone=q('#login-phone').value.trim();
  const pass=q('#login-password').value.trim();

  if(!validateLoginForm(phone, pass)) return;

  let normalizedPhone = phone;

  if(phone.startsWith('5') && phone.length === 9){
    normalizedPhone = '0' + phone;
  }

  const u=DB.users[phone] || DB.users[normalizedPhone];

  if(u && u.password===pass){
    State.user=phone;
    q('#welcome-msg').textContent = u.name.split(' ')[0];
    updateCounts();
    show('page-home');
  } else {
    alert(State.lang==='ar'?'بيانات الدخول غير صحيحة':'Invalid credentials');
  }
}

// Handle register form submit
function register(e){
  e.preventDefault();

  const formData = {
    name: q('#reg-name').value.trim(),
    phone: q('#reg-phone').value.trim(),
    password: q('#reg-password').value.trim()
  };

  if(!validateRegisterForm(formData)) return;

  const phone = formData.phone;

  if(DB.users[phone]){
    return alert(State.lang==='ar'?'الرقم مسجل مسبقاً':'Phone already registered');
  }

  DB.users[phone]={
    name:formData.name || 'User',
    city:q('#reg-city').value,
    password:formData.password,
    orders:[]
  };

  State.user=phone;
  q('#welcome-msg').textContent = DB.users[phone].name.split(' ')[0];
  updateCounts();
  show('page-home');
}
function logout(){ State.user=null; show('page-login'); }

function validateBooking(){
  const date = q('#booking-date').value.trim();

  if(!validateBookingDate(date || bookingDate)) return;
  const address = q('#address-placeholder').value.trim();
  if(!date || !address){
    const msg = State.lang==='ar' ? 'لازم تعبي التاريخ والعنوان قبل تكمل الحجز' : 'Please fill in the date and address before continuing';
    const box = q('#booking-error');
    box.textContent = msg;
    box.classList.remove('hidden');
    return false;
  }
  q('#booking-error').classList.add('hidden');
  return true;
}

// Move to payment page after validating booking details
function proceedPayment(){ if(!validateBooking()) return; const total = State.booking.chef.rate*State.booking.hours + Config.SERVICE_FEE; q('#payment-total').textContent = total; show('page-payment'); }

// Handle payment form submit and create order
function pay(e){ e.preventDefault(); const card=q('#pay-card').value.replace(/\s/g,''); const exp=q('#pay-expiry').value; const cvv=q('#pay-cvv').value; if(card.length!==16) return showErr(State.lang==='ar'?'رقم البطاقة غير مكتمل':'Card must be 16 digits'); if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return showErr(State.lang==='ar'?'تاريخ غير صالح':'Invalid expiry'); if(cvv.length!==3) return showErr(State.lang==='ar'?'رمز CVV غير صحيح':'Invalid CVV'); q('#pay-error').classList.add('hidden'); const total = State.booking.chef.rate*State.booking.hours + Config.SERVICE_FEE; const ref='CL-'+Math.floor(10000+Math.random()*90000); const date=q('#booking-date').value || new Date().toISOString().split('T')[0]; DB.users[State.user].orders.unshift({ref, chef: State.lang==='ar'?State.booking.chef.ar:State.booking.chef.en, date, total, status:'Confirmed'}); q('#success-ref').textContent=ref; q('#success-chef').textContent=State.lang==='ar'?State.booking.chef.ar:State.booking.chef.en; q('#success-paid').textContent=total+' '+t('currency'); updateCounts(); show('page-success'); }
function showErr(msg){ q('#pay-error-text').textContent=msg; q('#pay-error').classList.remove('hidden'); }

// Bind all button and form events
function bind(){
  qa('[data-nav]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.nav)));
  q('#lang-btn').addEventListener('click',()=>{State.lang=State.lang==='ar'?'en':'ar'; applyLang();});
  q('#login-lang-btn').addEventListener('click',()=>{State.lang=State.lang==='ar'?'en':'ar'; applyLang();});
  q('#logout-btn').addEventListener('click',logout);
  q('#tab-login').addEventListener('click',()=>{q('#tab-login').classList.add('active');q('#tab-register').classList.remove('active');q('#form-login').classList.add('active');q('#form-register').classList.remove('active');});
  q('#tab-register').addEventListener('click',()=>{q('#tab-register').classList.add('active');q('#tab-login').classList.remove('active');q('#form-register').classList.add('active');q('#form-login').classList.remove('active');});
  q('#demo-btn').addEventListener('click',()=>{q('#login-phone').value='0512345678';q('#login-password').value='123456';});
  q('#form-login').addEventListener('submit',login);
  q('#form-register').addEventListener('submit',register);
  qa('.hour-btn').forEach(btn=>btn.addEventListener('click',()=>{State.booking.hours=+btn.dataset.hours; qa('.hour-btn').forEach(x=>x.classList.remove('selected')); btn.classList.add('selected'); updateSummary();}));
  q('#proceed-btn').addEventListener('click',proceedPayment);
  q('#payment-form').addEventListener('submit',pay);
  q('#pay-card').addEventListener('input',e=>e.target.value=e.target.value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 '));
  q('#pay-expiry').addEventListener('input',e=>{const n=e.target.value.replace(/\D/g,'').slice(0,4); e.target.value=n.length>2?`${n.slice(0,2)}/${n.slice(2)}`:n;});
  q('#pay-cvv').addEventListener('input',e=>e.target.value=e.target.value.replace(/\D/g,'').slice(0,3));
}

// Read image URLs from the hidden body block and expose them as CSS variables
function loadImageVariablesFromBody(){
  const source = document.getElementById('image-sources');
  if(!source) return;
  const root = document.documentElement;
  Object.entries(source.dataset).forEach(([key, value]) => {
    const cssVar = '--' + key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
    root.style.setProperty(cssVar, `url('${value}')`);
  });
}

// Initialize app after the document is ready
document.addEventListener('DOMContentLoaded',()=>{ loadImageVariablesFromBody(); bind(); applyLang(); show('page-login'); });

window.App={show};
