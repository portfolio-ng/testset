
var globe={"testslct":0,"del":0,"dupe":0,"reselect":0,"chord":[],"hardChord":[16,17,18]} 
//hard coded chord keys:16 shift,17 ctrl, 18 alt;

var blue="#6ea4ff"
var pink="#ff70d4"

// callout functions >>>

function d_windowCall1(funcname,torun) {
  window[funcname](torun[0])
} //d_windowCall, call a window function with one arguments
function d_windowCall2(funcname,torun) {
  window[funcname](torun[0],torun[1])
} //d_windowCall, call a window function with two arguments
function d_windowCall3(funcname,torun) {
  window[funcname](torun[0],torun[1],torun[2])
} //d_windowCall, call a window function with three arguments
function d_windowCall4(funcname,torun) {
  window[funcname](torun[0],torun[1],torun[2],torun[3])
} //d_windowCall, call a window function with four arguments
function d_windowCall5(funcname,torun) {
  window[funcname](torun[0],torun[1],torun[2],torun[3],torun[4])
} //d_windowCall, call a window function with five arguments
function d_windowCall6(funcname,torun) {
  window[funcname](torun[0],torun[1],torun[2],torun[3],torun[4],torun[5])
} //d_windowCall6, call a window function with six arguments

// callout functions <<<


document.onkeyup = function(e) {
  globe["chord"]=[]
  var kc=e["keyCode"]
  if ( kc < 37 || kc > 40 && kc!="" ) { //arrows:37,38,39,40; and whatever else
    var txtchk=e["path"][0].tagName.toLowerCase()=="textarea"
    if ( txtchk ) {
      var id=e["path"][0]["id"]
      var spl=id.split(".",4)
      if ( spl.length > 3) {
        var fn=spl[1]
        var ti=spl[2]
        var acn=spl[3]
        var ac=acn.substring(0,3) 
        if ( ac == "why" ) {
          var txta=document.getElementById(id)
          var vwhy=txta.value
          try {    
            alltests[fn]["tests"][ti][ac]=vwhy
          } catch(err) {
            //ignore these keypresses
          }
        }      
      }
    }
  }
} //.onkeyup()

function checkChord() {
  var full=false
  var ic=globe["hardChord"]
  //.sort() is a mess of a function but luckily we only care about 16,17,18
  //  so it works fine for our uses
  var c=globe["chord"].sort() 
  //wat?
  // a=[16,17,18]
  // b=[16,17,18]
  // a[0]==b[0]?true
  // a[1]==b[1]?true
  // a[2]==b[2]?true
  // a==b?false
  //if ( c==[16, 17, 18] || c==[37,38,39] ) { 
  if ( c[0]==ic[0] &&  c[1]==ic[1] && c[2]==ic[2] ) { 
    full=true  
  }
  return full
} //checkChord(), determine is the chord is being held

document.onkeydown = function(e) {
  e=e||window.event
  var kc=e.keyCode
    if (kc==27) { //ESC
    var ope=document.getElementById("testout")
    if (ope) {
      ope.parentElement.removeChild(ope)
    }
  }
  if ( globe["chord"].length==3 && checkChord() && kc == 82 ) { //82 : r 
    var txtchk=e["path"][0].tagName.toLowerCase()=="textarea"
    if ( txtchk ) {
      var id=e["path"][0]["id"]
      var spl=id.split(".",4)
      if ( spl.length > 3) {
      var fn=spl[1]
      var ti=spl[2]
      var acn=spl[3]
      var ac=acn.substring(0,3)
      if ( ac == "why" ) {
        var txta=document.getElementById(id)
        var vwhy=txta.value
        try {    
          alltests[fn]["tests"][ti][ac]=vwhy
        } catch(err) {
          //ignore these keypresses
        }
      } else {
        ac=acn.substring(0,6) //either 'why'(3) or 'assert'(6) or 'expect'(6)
        //var aci=parseInt(acn.split(ac)[1])-1 //old way relied heavily on ids
        var txta=document.getElementById(id)
        var val=txta.value
        var vwhr=val.split(" = ")[0]
        var vwht=val.split(" = ")[1]
        
        // this new way assigns the index based on vwhr
        acTest=alltests[fn]["tests"][ti][ac]
        for ( var ea in acTest ){ 
          thisWhr=acTest[ea]["where"]
          if (thisWhr==vwhr) {
            var aci=ea
          }
        }


        //TODO, clear assert if multiple values
        //{"wt":1,"wh":"j.s.o.n","wt":1,"wh":"j.s.o.nd","wt":1,"wh":"j.s.o.nde"}  
        //is folded into
        //{"wt":{"s":{"o":{"n":1,"nd":1,"nde":1}}},"wh":"j"}
        //so clear out assert:[] to avoid double filling
        // imagine, could either get sophisticated to retain original individual inputs
        //   or retain current method of just replacing the individuals for one block
        if ( alltests[fn]["arguments"].length < 2 ) {
          alltests[fn]["tests"][ti][ac]=[]
        }
        //TODO,add assertion if missing any in original but present in testsetedit ui
        if ( val && alltests[fn]["tests"][ti][ac].length <= aci ) {
          alltests[fn]["tests"][ti][ac].push({})
        }
        
        //var cwhr=alltests[fn]["tests"][ti][ac][aci]["where"]
        //var cwht=alltests[fn]["tests"][ti][ac][aci]["what"]
        var runtest=false
        try {
          //in case of failure from assignment
          try {
            //in case of failure from JSON.parse()
            //JSON.parse() works on strings into objects or numbers but fails on strings into strings
            alltests[fn]["tests"][ti][ac][aci]["what"]=JSON.parse(vwht)
          } catch(err) {
            if ( isnumb(vwht) ) {
              alltests[fn]["tests"][ti][ac][aci]["what"]=parseFloat(vwht) //float because all numb are float in js
            } else {
              alltests[fn]["tests"][ti][ac][aci]["what"]=String(vwht)
            }
          }
          runtest=true
        } catch(err) {
          console.log("err, try1")
          //ignore these keypresses
        }
        var cwht=alltests[fn]["tests"][ti][ac][aci]["what"]
        try {
        alltests[fn]["tests"][ti][ac][aci]["where"]=vwhr
        runtest=true
        } catch(err) {
          console.log("err, try2")
          //ignore these keypresses
        }
        var cwhr=alltests[fn]["tests"][ti][ac][aci]["where"]
        if ( runtest ) {
        // refactor testset.js to be able to run the individual test?
        globe["reselect"]=fn
        tst_cycle()
        }
      }
    }
    }
  } else { 
    globe["chord"].push(kc)
  }
}
function isnumb(numb) {
    //uses :: numb 
    var boold = !isNaN(parseFloat(numb)) && isFinite(numb)
    return boold
  } //isnumb(), determines if the value is a number

function ted_createDropdown() {
  var id="slctdiv"
  var olet=document.getElementById(id)
  if (olet) {
    olet.parentElement.removeChild(olet)
  } 
  var div = document.getElementById("divslct")
  var frag = document.createElement("slctdiv")
  frag.id=id
  var select = document.createElement("select")
  select.id="slct"
  for ( var at=0,atl=alltests.length; at<atl;at++){
    opt=String(at)+"."
    opt=opt+alltests[at]["funcname"]

    var pass=true
    for (var ti in alltests[at]["tests"] ) {
      if ( alltests[at]["tests"][ti]["outcome"] == "fail" ) {
        pass=false
      }
    }
    select.options.add( new Option(opt) )
    var opc=select.options[select.options.length-1]
    if ( at == globe["reselect"] ) {
      opc.selected="selected"
    }
    if ( pass ) {
      opc.style.background=blue
    } else {
      opc.style.background=pink
    }
  }
  select.selected="true"
  frag.appendChild(select);
  
  var bid="prnt"
  var disp="print test"
  var act=function(){prntTest()}
  //var style={}
  //createButton(frag,bid,disp,act,style)
  //||
  //createButton(frag,bid,disp,act,{})
  //||
  createButton(frag,bid,disp,act)
  
  var bid="prnta"
  var disp="print all"
  var act=function(){prntAll(alltests)}
  createButton(frag,bid,disp,act)
  
  div.appendChild(frag);
  var dropDown=document.getElementById("slct")
  dropDown.onchange = function() {
    showTest(this.value)
  }
  var dropVal=dropDown.value
  var spl=dropVal.split(".")
  var funcname=alltests[parseInt(spl[0])]["funcname"]
  if ( tst_chkFuncInFuncList(funcList,funcname) ){
    showTest(dropDown.value)
  }
}

function TOOLdiss(obj) {
    //ERR=["obj=1=E", obj]
    var jstr = JSON.stringify(obj)
    var nuobj = JSON.parse(jstr)
    return nuobj
  } //TOOLdiss(), creates companion immutable values from mutable values 



function prntTest() {
  var id="testout"
  var olet=document.getElementById(id)
  if (olet) {
    olet.parentElement.removeChild(olet)
  }  
  var tsto=alltests[globe["testslct"]]
  var prntout=document.createElement("textarea")
  
  prntout.id=id
  prntout.cols="80"
  prntout.rows="34"
  prntout.style.zIndex="170"
  prntout.style.position="absolute"
  prntout.style.top="17px"
  prntout.style.left="17px"
  var ctst=TOOLdiss(tsto)
  
  for ( var ea in ctst["tests"] ) {
    var ectst=ctst["tests"][ea]
    delete ectst["procd"]
    delete ectst["outcome"]
    delete ectst["funcname"]
    for ( var ai in ectst["assert"] ) {
      delete ectst["assert"][ai]["base"]
    }
    for ( var ei in ectst["expect"] ) {
      delete ectst["expect"][ei]["got"]
      delete ectst["expect"][ei]["gottype"]
      delete ectst["expect"][ei]["whttype"]
    }
  }
  prntout.value=JSON.stringify(ctst,null,2)
  var odiv=document.getElementById("divslct")
  odiv.appendChild(prntout)
}

function prntAll(allt) {
  var id="testout"
  var olet=document.getElementById(id)
  if (olet) {
    olet.parentElement.removeChild(olet)
  }  
  
  var prntout=document.createElement("textarea")
  prntout.id=id
//  prntout.cols="80"
 // prntout.rows="34"
  prntout.style.zIndex="170"
  prntout.style.position="absolute"
  prntout.style.top="17px"
  prntout.style.left="17px"
  var rgt=window.innerWidth-34
  prntout.style.width=String(rgt)+"px"
  prntout.style.bottom="17px"
  var outtest=TOOLdiss(alltests)
  for ( var oti in outtest ) {
    var ctst=outtest[oti]
    for ( var ea in ctst["tests"] ) {
      var ectst=ctst["tests"][ea]
      delete ectst["procd"]
      delete ectst["outcome"]
      delete ectst["funcname"]
      for ( var ai in ectst["assert"] ) {
        delete ectst["assert"][ai]["base"]
      }
      for ( var ei in ectst["expect"] ) {
        delete ectst["expect"][ei]["got"]
        delete ectst["expect"][ei]["gottype"]
        delete ectst["expect"][ei]["whttype"]
      }
    }
  }
  prntout.value="alltests"+" = \n"+JSON.stringify(outtest,null,2)
  var odiv=document.getElementById("divslct")
  odiv.appendChild(prntout)
}

function calld(at) {
  //console.log("calld",at)
}

function ted_onit() {
  ted_createDropdown()
}

function tst_uidisp() {
  ted_onit()
}


function delTst() {
  var aitst=globe["testslct"]
  var atst=alltests[aitst]
  var itst=globe["del"]
  atst["tests"].splice(itst,1)
  var ins=String(aitst)+"."+alltests[aitst]["funcname"]
  showTest(ins)
}


function dupeTst() {
  var aitst=globe["testslct"]
  var atst=alltests[aitst]
  var itst=globe["dupe"]
  var dtst=TOOLdiss(atst["tests"][itst])
  atst["tests"].splice(itst,0,dtst)
  var ins=String(aitst)+"."+alltests[aitst]["funcname"]
  showTest(ins)
}

function showTest(ins) {
  var te=document.getElementById("tedit")
  var ctole=document.getElementById("currtest")
  te.removeChild(ctole)
  var ct=document.createElement("div")
  ct.id="currtest"
  te.appendChild(ct)

  var spl=ins.split(".")
  var iat=parseInt(spl[0])
  var fn=spl[1]
  globe["testslct"]=iat
  //for ( var ti=0,tl=alltests[iat]["tests"].length; ti<tl;ti++) {
      var tl=alltests[iat]["tests"].length
  for ( var ti=0; ti<tl;ti++) {
    var strti=String(ti)
    var did="tst"+String(ti)
    var style={"background":"#347"}
    var cont="createDiv_ui_tst"
    createDiv(ct,did,style,cont,[iat,ti,tl])
 }       
} //showTest(), display all the tests from a single function

function createDiv_ui_assert(uio,fulld,atst,args,iat,ti) {     
      var para={}
      para["cols0"]=34
      para["cols1"]=17
      para["cols"]=[34,17]
      para["rows"]=0 //
      para["rows"]=17 //
      //para["rows"]=51 //

      var as=uio //the ui object
      //var trow=parseInt(17/(args.length)) //the rows, 17 is ideal.. fracture in case of multiple asserts
      var trow=para["rows"]
      //console.log(args,trow)
      for ( var ari in args ) {
        var ar=args[ari]
        var aro=atst["procd"]["testobj"][ar]
        //console.log("..",uio,aro)
        var assertd=document.createElement("textarea")
        assertd.id="txta."+as.id+String(parseInt(ari)+1)
        if (typeof aro=='object') {
          assertd.cols=para["cols"][0]
          assertd.rows=trow
          assertd.value=String(ar)+" = "+JSON.stringify(aro,null,2)
        } else {
          assertd.cols=para["cols"][1]
          assertd.rows=trow
          assertd.value=String(ar)+" = "+aro
        }
        assertd.style.display="compact"
        assertd.style.position="relative"
        as.appendChild(assertd)
        as.style.display="inline"
      }
} //createDiv_ui_assert(), create the ui to be contained within the assert div

function createDiv_ui_tst(uio,iat,ti,tl) {
    var tst=uio //the ui object
    
    var bid="del"+String(ti)
    var act=function(){globe["del"]=parseInt(this.id.split("del")[1]);delTst()}
    var style={"cssFloat":"right"}
    createButton(tst,bid,"del",act,style)
    
    var bid="dupe"+String(ti)
    var act=function(){globe["dupe"]=parseInt(this.id.split("dupe")[1]);dupeTst()}
    var style={"cssFloat":"right"}
    createButton(tst,bid,"dupe",act,style)
    
    var pid="which"+String(ti)
    var ih=String(ti)+" of "+String(tl-1)+" : "
    var style={"color":"white"}
    createP(tst,pid,ih,style)
      
    var tt=alltests[iat]["tests"][ti]
    var tid="txta."+String(iat)+"."+String(ti)+".why"
    createTextarea(tst,tid,80,1,tt["why"]) 
   
    //indi,list object properties in inidividual textareas
    //full,list object in single textarea
    
    var fulld=document.createElement("div")
    fulld.id="fulld"+String(ti)
    fulld.style.background="#173"
    //imagine, createDiv() 
    var atst=alltests[iat]["tests"][ti]
    var args=alltests[iat]["arguments"]
    if ( args.length == 0) {
      var expt=document.createElement("p")
      expt.id="expt0"
      expt.innerHTML="empty function"
    } else {
      var did=String(iat)+"."+String(ti)+".assert"
      var style={"background":"#347"}
      var cont="createDiv_ui_assert"
      var uiargs=[fulld,atst,args,iat,ti] //arguments for the createDiv_ui_FUNC()
      createDiv(fulld,did,style,cont,uiargs)

      var id="txta."+String(iat)+"."+String(ti)+".expect"+String(1)
      var exo=atst["expect"][0]["what"]
      var val=atst["expect"][0]["where"]+" = "+JSON.stringify(exo,null,2)
      var style={"display":"inline"}
      //var ex=createTextarea(null,id,34,17,val,style)
      //fulld.appendChild(ex)
      //||
      createTextarea(fulld,id,34,17,val,style)
     
      var id=String(iat)+"."+String(ti)+".procd"+String(1)
      var pro=atst["procd"]["results"]
      var val=JSON.stringify(pro,null,2)
      var style={"display":"inline","_readOnly":true,"background-color":"#dbdbdb"}
      createTextarea(fulld,id,34,17,val,style)
      
      var did=String(iat)+"."+String(ti)+".sufa"+String(1)
      var bg=pink
      if (atst["outcome"] =="succ") {
        bg=blue 
      }
      var style={"height":"17%","width":"17px","stylefloat":"right","cssFloat":"right","background":bg}
      createDiv(fulld,did,style)
    }
    tst.appendChild(fulld)
} //createDiv_ui_tst(), create the ui to be contained within the tst div

function createButton(el,bid,disp,act,sty) {
    var b=document.createElement("button")
    b.id=bid
    b.innerHTML=disp
    if (sty) {
      for ( var ea in sty) {
        b["style"][ea]=sty[ea]
      }
    }
    el.appendChild(b)
    b.onclick=act
} //createButton(), create a button, ['parent_element','button_id','button_displayed_innerHTML','called_action','css.style.OBJ']
    
function createP(el,pid,ih,sty) {
    var p=document.createElement("p")
    p.id=pid
    p.innerHTML=ih
    for ( var ea in sty) {
      p["style"][ea]=sty[ea]
    }
    el.appendChild(p)
} //createP(), create a <p>, ['parent_element','p_id','p_displayed_innerHTML','css.style.OBJ']

function createTextarea(par,id,col,rows,val,sty) {
  var t=document.createElement("textarea")
  t.id=id
  t.cols=col
  t.rows=rows
  t.value=val
  if (sty) {
    for ( var ea in sty) {
      if ( ea[0] == "_" ) {
        var skey=ea.substring(1)
        t[skey]=sty[ea]
      } else {
        t["style"][ea]=sty[ea]
      }
    }
  }
  if (par) {
    par.appendChild(t)}
  else {
    return t
  }
} //createTextarea(), create a <textarea>, ['parent_element','textarea_id','columns','rows','contents','css.style.OBJ']

function createDiv(el,did,sty,contui,args) {
    //console.log(this)
    var d=document.createElement("div")
    d.id=did
    var d_args=[d]
    for ( var ea in args ) {
     d_args.push(args[ea])
    }
    if ( contui ) {
      var calld="d_windowCall"+String(d_args.length)
      window[calld](contui,d_args)
    }
    for ( var ea in sty) {
      d["style"][ea]=sty[ea]
    }
    el.appendChild(d)
} //createDiv(), create a <div>, ['parent_element','div_id','div_contents_ui_function','arguments_ui()']
  
