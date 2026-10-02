const ADMIN={name:"Forum Administrator",email:"admin@forumhub.com",password:"admin123",role:"admin"};
const users=()=>JSON.parse(localStorage.getItem("users")||"[]");
function saveUsers(x){localStorage.setItem("users",JSON.stringify(x))}
document.addEventListener("DOMContentLoaded",()=>{
const sf=document.getElementById("signupForm");
if(sf)sf.addEventListener("submit",e=>{e.preventDefault();let a=users(),em=email.value.trim().toLowerCase();if(em===ADMIN.email||a.some(u=>u.email===em)){status.textContent="Email already registered.";return}a.push({name:name.value,email:em,password:password.value,role:"user"});saveUsers(a);status.textContent="Account created! Redirecting...";setTimeout(()=>location.href="login.html",500)});
const lf=document.getElementById("loginForm");
if(lf)lf.addEventListener("submit",e=>{e.preventDefault();let em=email.value.trim().toLowerCase(),pw=password.value,u=em===ADMIN.email&&pw===ADMIN.password?ADMIN:users().find(x=>x.email===em&&x.password===pw);if(!u){status.textContent="Invalid email or password.";return}localStorage.setItem("currentUser",JSON.stringify({name:u.name,email:u.email,role:u.role}));location.href=u.role==="admin"?"admin.html":"index.html"})});
