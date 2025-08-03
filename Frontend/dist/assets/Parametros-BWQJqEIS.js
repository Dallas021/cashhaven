import{f as L,d as o,r as a,j as e,a as l,B as X,H as K}from"./index-BDPJB-4x.js";const Q=L`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    select{
    margin: 0;
    }
    
  }
`,U=o.div`
  background: #fff;
  border-radius: 0 0 10px 10px;

  gap: 1.5rem;

  input {
    padding: 0.5rem;
    border: 1px solid #73287d;
    border-radius: 8px;
    font-size: 16px;
    color: #73287d;
  }

  label {
    font-weight: bold;
    color: #73287d;
  }
`,W=o.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`,Y=o.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  border: 2px solid #73287d;
`,Z=o.h2`
  margin-bottom: 1rem;
  color: #73287d;
`;o.label`
  margin-top: 1rem;
  font-weight: bold;
  color: #73287d;
  display: block;
`;const R=o.select`
  width: 100%;
  margin-left: 0px
  margin-top: 0.3rem;
  border: 1px solid #73287d;
  border-radius: 8px;
  font-size: 16px;
`;o.ul`
  margin-top: 1rem;
  list-style: none;
  padding: 0;
`;o.li`
  padding: 0.5rem;
  margin-bottom: 0.3rem;
  background: #f0f0f0;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;o.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
`;const ee=o.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
`,p=o.button`
  padding: 0.6rem 1.5rem;
  background-color: ${t=>t.primary?"#73287d":t.cancel?"#aaa":"#a558c6"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`,P=o.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`,re=o.div`
     display: flex;
    justify-content: space-evenly;
`,ae=({fechar:t})=>{const[u,c]=a.useState([]),[x,j]=a.useState([]);a.useState(""),a.useState(""),a.useState([]);const[m,v]=a.useState(""),[h,y]=a.useState(""),[S,w]=a.useState([]),[g,I]=a.useState(""),[k,b]=a.useState(!1);a.useEffect(()=>{(async()=>{try{const n=await l.get("/imp/all");c(n.data.ips||[]),j(n.data.modelos||[]),w(n.data.message||[])}catch(n){console.error("Erro ao buscar dados:",n)}})()},[]);const C=async()=>{try{const s={ip:h,model:m},n=await l.post("/imp/register",s);console.log(n)}catch(s){console.error("Erro ao cadastrar impressora:",s)}},E=async()=>{try{const s={id:g};(await l.put("/imp/primary/salved",s)).status===200&&(X.success("Impressora cadastrada com sucesso!"),setTimeout(()=>{window.location.reload()},2e3))}catch(s){console.error("Erro ao cadastrar impressora:",s)}};return a.useEffect(()=>{(async()=>{try{const n=await l.get("/imp/all/models");j(n.data.message||[]),console.log(n.data.message,"modelos")}catch(n){console.error("Erro ao buscar dados:",n)}})()},[]),e.jsxs(e.Fragment,{children:[e.jsx(Q,{}),e.jsx(W,{children:e.jsxs(Y,{children:[e.jsx(Z,{children:"Configurar Impressoras"}),k?e.jsxs(e.Fragment,{children:[e.jsxs(U,{children:[e.jsxs(P,{children:[e.jsx("label",{children:"IP"}),e.jsx("input",{value:h,onChange:s=>y(s.target.value)})]}),e.jsxs(P,{children:[e.jsx("label",{children:"Modelo"}),e.jsxs(R,{value:m,onChange:s=>v(Number(s.target.value)),children:[e.jsx("option",{value:"",children:"Selecione uma"}),x.map(s=>e.jsx("option",{value:s.id,children:s.ref},s.id))]})]})]}),e.jsxs(ee,{children:[e.jsx(p,{onClick:()=>C(),children:"Salvar Impressora"}),e.jsx(p,{onClick:()=>b(!1),children:"Voltar"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(P,{children:[e.jsx("label",{children:"Selecionar Impressora"}),e.jsxs(R,{value:g,onChange:s=>I(s.target.value),children:[e.jsx("option",{value:"",children:"Selecione uma"}),S.map(s=>e.jsxs("option",{value:s.id,children:[s.ip," - ",s.id_model," - ",s.status==="1"?"Ativa":"Inativa"]},s.id))]})]}),e.jsxs(re,{children:[e.jsx(p,{onClick:()=>E(),children:" Salvar"}),e.jsx(p,{onClick:()=>b(!0),children:"Adicionar Impressora"}),e.jsx(p,{onClick:t,children:" Cancelar"})]})]})]})})]})},se=L`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`,oe=o.div`
  padding: 2rem;
  font-family: Arial, Helvetica, sans-serif;
  width: 1000px;
`,te=o.div`
  display: flex;
  margin-bottom: 20px;
  
`,z=o.button`
  padding: 10px 90px;
  font-weight: bold;
  color: #73287d;
  background: ${({active:t})=>t?"#f3eef7":"transparent"};
  border: 2px solid #73287d;
  border-bottom: ${({active:t})=>t?"none":"2px solid #73287d"};
  cursor: pointer;
  border-radius: 10px 10px 0 0;
`,T=o.div`
  background: #fff;
  padding: 2rem;
  border: 2px solid #73287d;
  border-radius: 0 0 10px 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;

  input {
    padding: 0.5rem;
    border: 1px solid #73287d;
    border-radius: 8px;
    font-size: 16px;
    color: #73287d;
  }

  label {
    font-weight: bold;
    color: #73287d;
  }
`,ne=o.div`
  background: #fff;
  padding: 2rem;
  border: 2px solid #73287d;
  border-radius: 0 0 10px 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1.2rem;

  input {
    padding: 0.5rem;
    border: 1px solid #73287d;
    border-radius: 8px;
    font-size: 16px;
    color: #73287d;
  }

  label {
    font-weight: bold;
    color: #73287d;
  }
`,i=o.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`,ie=o.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`,de=o.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,le=o.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
`,ce=o.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #73287d;
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`,pe=o.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 26px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
`,ue=o.button`
  padding: 0.7rem 2rem;
  background: #73287d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #5a2060;
  }
`,me=()=>{const[t,u]=a.useState("empresa"),[c,x]=a.useState("0.00"),[j,m]=a.useState(null),[v,h]=a.useState(""),[y,S]=a.useState(""),[w,g]=a.useState(""),[I,k]=a.useState(""),[b,C]=a.useState(""),[E,s]=a.useState(""),[n,N]=a.useState(""),[V,G]=a.useState(""),[H,O]=a.useState(""),[_,D]=a.useState(!1),[A,M]=a.useState("0.00"),[B,F]=a.useState("0.00");a.useEffect(()=>{(async()=>{try{const r=await l.get("company/all");m(r.data.message[0]),h(r.data.message[0].bairro),S(r.data.message[0].cidade),k(r.data.message[0].endereco),C(r.data.message[0].estado),g(r.data.message[0].cnpj),s(r.data.message[0].razao_social),N(r.data.message[0].ie)}catch(r){console.error("Erro ao buscar os dados:",r)}})()},[]),a.useEffect(()=>{(async()=>{try{const r=await l.get("/imp/primary");G(r.data.ip),O(r.data.model),console.log(r)}catch(r){console.error("Erro ao buscar os dados:",r)}})()},[]),a.useEffect(()=>{(async()=>{try{const r=await l.get("param/all");M(f(r.data.message[5].valor.toString())),F(f(r.data.message[2].valor.toString())),x(r.data.message[9].valor)}catch(r){console.log("Erro",r)}})()},[]);const q=async d=>{d.preventDefault();try{const r=[{id:6,valor:A,bit:1},{id:3,valor:B,bit:1},{id:10,valor:c,bit:1}];(await l.put("/param/update",r)).status}catch(r){console.error("Erro ao atualizar parâmetros:",r)}};function f(d){const r=d.replace(/\D/g,"");if(!r)return"0.00";if(r.length===1)return"0.0"+r;if(r.length===2)return"0."+r;const $=r.slice(0,-2),J=r.slice(-2);return $+"."+J}return e.jsxs(e.Fragment,{children:[e.jsx(se,{}),e.jsxs(oe,{children:[e.jsx("h2",{style:{color:"#73287d",marginBottom:"20px"},children:"PARÂMETROS"}),e.jsxs(te,{children:[e.jsx(z,{active:t==="empresa",onClick:()=>u("empresa"),children:"Configuração Empresa"}),e.jsx(z,{active:t==="pdv",onClick:()=>u("pdv"),children:"Configuração PDV"}),e.jsx(z,{active:t==="impressora",onClick:()=>u("impressora"),children:"Configuração Impressora"})]}),t==="empresa"&&e.jsxs(T,{children:[e.jsxs(i,{children:[e.jsx("label",{children:"ID"}),e.jsx("input",{defaultValue:"1",disabled:!0})]}),e.jsxs(i,{children:[e.jsx("label",{children:"Razão Social"}),e.jsx("input",{value:E})]}),e.jsxs(i,{children:[e.jsx("label",{children:"CNPJ"}),e.jsx("input",{value:w})]}),e.jsxs(i,{children:[e.jsx("label",{children:"IE"}),e.jsx("input",{value:n})]}),e.jsxs(i,{children:[e.jsx("label",{children:"Bairro"}),e.jsx("input",{value:v})]}),e.jsxs(i,{children:[e.jsx("label",{children:"Endereço"}),e.jsx("input",{value:I})]}),e.jsxs(i,{children:[e.jsx("label",{children:"Cidade"}),e.jsx("input",{value:y})]}),e.jsxs(i,{children:[e.jsx("label",{children:"Estado"}),e.jsx("input",{value:b})]})]}),t==="pdv"&&e.jsxs(T,{children:[e.jsxs(i,{children:[e.jsx("label",{children:"Saldo mínimo para resgate"}),e.jsx("input",{value:A,onChange:d=>M(f(d.target.value))})]}),e.jsxs(i,{children:[e.jsx("label",{children:"Percentual cashback"}),e.jsx("input",{value:B,onChange:d=>F(f(d.target.value))})]}),e.jsxs(i,{children:[e.jsx("label",{children:"Desativar/Ativar venda manual"}),e.jsxs(de,{children:[e.jsxs(le,{children:[e.jsx(ce,{type:"checkbox",checked:c==="1.00",onChange:d=>x(d.target.checked?"1.00":"0.00")}),e.jsx(pe,{})]}),e.jsx("span",{children:c==="1.00"?"Ativo":"Inativo"})]})]}),e.jsx("div",{style:{gridColumn:"1 / -1",display:"flex",justifyContent:"center"},children:e.jsx(ue,{onClick:q,children:" Salvar"})})]}),t==="impressora"&&e.jsxs(ne,{children:[e.jsxs(i,{children:[e.jsx("label",{children:"ID"}),e.jsx("input",{value:1,disabled:!0})]}),e.jsxs(i,{children:[e.jsx("label",{children:"IP"}),e.jsx("input",{value:V,disabled:!0})]}),e.jsxs(i,{children:[e.jsx("label",{children:"Modelo"}),e.jsx("input",{value:H,disabled:!0})]}),e.jsx(ie,{children:e.jsx(K,{style:{cursor:"pointer",fontSize:"40px",color:"#73287d"},onClick:()=>D(!0)})})]})]}),_&&e.jsx(ae,{fechar:()=>D(!1)})]})};export{me as default};
