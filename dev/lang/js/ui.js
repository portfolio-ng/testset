//built in ui

//base ui ideas :: meta info: number of succ out of full, fails out of full, add anchors to fails with clickable jumps at top, color text of individual expectations based on succ or fail; placed at top of test list

function tst_uidisp(alltests) {
    console.log("ui called")
    var fulllist = document.getElementById("fulllist")
    fulllist.style.listStyleType = "none"
    var atl = alltests.length
    for (var iat = 0; iat < atl; iat++) {
      var thefuncname = alltests[iat].funcname
      tl = alltests[iat].tests.length
      var tnode = document.createElement("li")
      var tbrnode = document.createElement("br")
      var tfuncnode = document.createTextNode(String(iat) + ".." + thefuncname + "() ..")
      var tdescnode = document.createTextNode(String(alltests[iat].desc))
      id_node=thefuncname+"."+iat
      var a_node = document.createElement("a")
      //check if any tests fail
      test_fail=false
      for ( ind in alltests[iat].tests ){
        var curr_test=alltests[iat].tests[ind]
        if ( curr_test.outcome != "succ" ) {
          test_fail=true
        }
      }
      if ( test_fail == false ){
        tnode.style.background = "#6ea4ff" //blue
      } else {
        tnode.style.background = "#ff70d4" //pink
      }
      a_node.setAttribute("href","javascript:ui_toggle('"+String(id_node)+"')")
      a_node.id="a"+id_node
      a_node.innerHTML="+"
      tnode.appendChild(a_node)
      tnode.appendChild(tfuncnode)
      tnode.appendChild(tdescnode)
      tnode.appendChild(tbrnode)
      fulllist.appendChild(tnode)
      for (var it = 0; it < tl; it++) {
        var thetest = alltests[iat].tests[it]
        var node = document.createElement("li")
        node.className=id_node
        var headobj={"iat": iat,"thefuncname": thefuncname,"it":it,"tl":tl,"thetest":thetest,"appendto":node,"desc":alltests[iat].desc}
        header(headobj)
        var outcomelist = document.createElement("ul")
          var assertexpcdobj={"thetest": thetest,"appendto": outcomelist}
        node.appendChild(theAssertions(assertexpcdobj))
        node.appendChild(theExpected(assertexpcdobj))
        if (thetest.outcome == "succ") {
          node.style.background = "#6ea4ff" //blue
        } else {
          node.style.background = "#ff70d4" //pink
        }
        node.style.display="none"
        fulllist.appendChild(node)
      } //for (var it = 0; it < tl; it++) {
      divisionlines()
    } //for (var iat = 0; iat < atl; iat++) {
} //uidisp, display the alltests through the ui

function header(headobj) {
        var iat = headobj.iat
        var thefuncname = headobj.thefuncname
        var it = headobj.it
        var tl = headobj.tl
        var thetest = headobj.thetest
        var node = headobj.appendto
        //node.appendChild(brnode)
        var whynode = document.createTextNode(String(iat)+".." + String((it)) + " of " + String(tl-1) + ".. " + thetest.why)
        node.appendChild(whynode)
}//header(), creates a little header for each test


function theAssertions(assertexpcdobj) {
  var thetest = assertexpcdobj.thetest
  var outcomelist = assertexpcdobj.appendto
        for (var iassert = 0; iassert < thetest["assert"].length; iassert++) {
          var outcomeNode = document.createElement("li")
          if (typeof thetest["assert"][iassert].what === 'object') {
            var textnode = document.createTextNode("asserting: '" + thetest["assert"][iassert].where + "'   as   ")
            outcomeNode.appendChild(textnode)
            var preobj={"toprintd":thetest["assert"][iassert].what , "appendto": outcomeNode}
            precontainer(preobj)
          } else {
            var textnode = document.createTextNode("asserting: '" + thetest["assert"][iassert].where + "'   as   " + thetest["assert"][iassert].what)
            outcomeNode.appendChild(textnode)
          }
          outcomelist.appendChild(outcomeNode)
        }
return outcomelist
}//theAssertions(), run through each assertion 

function theExpected(assertexpcdobj) {
  var thetest = assertexpcdobj.thetest
  var outcomelist = assertexpcdobj.appendto
        for (var iexp = 0; iexp < thetest["expect"].length; iexp++) {
          var outcomeNode = document.createElement("li")
          var expOutWhat = thetest["expect"][iexp].what
          var expoutgot = thetest["expect"][iexp].got
          if (typeof expOutWhat === 'object' || typeof expoutgot === 'object') {
            var incaseobj={"thetest": thetest,"appendto":outcomeNode,"loopposition":iexp}
            incaseofobjects(incaseobj)
          } else {
            var textnode = document.createTextNode("expecting: '" + thetest["expect"][iexp].where + "'   returned as:   '" + expOutWhat + "(" + thetest["expect"][iexp].whttype + ")" + "' and received: '" + "(" + thetest["expect"][iexp].gottype + ")" + expoutgot + "'")
            outcomeNode.appendChild(textnode)
          }
          outcomelist.appendChild(outcomeNode)
          if (thetest.outcome == "fail" && typeof expoutgot === 'object') {
            var textnode = document.createTextNode("NOTE: undefined values are hidden but will cause failure due to inequality.. manually compare objects in console")
            textnode.display = "none"
            outcomelist.appendChild(textnode)
          }
        }
return outcomelist
}//theExpected(), run through each expectation


function incaseofobjects(incaseobj) {
          var outcomeNode = incaseobj.appendto
          var iexp = incaseobj.loopposition
          var thetest = incaseobj.thetest
          var expOutWhat = thetest["expect"][iexp].what
          var expoutgot = thetest["expect"][iexp].got

            var textnode = document.createTextNode("expecting: '" + thetest["expect"][iexp].where + "'   returned as:   '")
            outcomeNode.appendChild(textnode)
            
            if (typeof expOutWhat === 'object') {
              var preobj={"toprintd": expOutWhat, "appendto": outcomeNode}
              precontainer(preobj)
            } else {
              var textnode = document.createTextNode(expOutWhat)
              outcomeNode.appendChild(textnode)
            }
            var pobj={"toprintd":"' and recieved: ", "appendto":outcomeNode}
            pcontainer(pobj)

            if (typeof expoutgot === 'object') {
              var preobj={"toprintd": expoutgot, "appendto": outcomeNode}
              precontainer(preobj)
            } else {
              var textnode = document.createTextNode(expoutgot)
              outcomeNode.appendChild(textnode)
            }
}//incaseofobjects(), 


function precontainer(preobj) {
  var toprintd=preobj.toprintd
  var appendto=preobj.appendto
  var pretty = document.createElement("pre")
  pretty.style.width = "30%"
  pretty.style.display = "inline-block"
  pretty.style.border = "1 solid white"
  pretty.innerHTML = JSON.stringify(toprintd, null, 2)
  appendto.appendChild(pretty)
}//precontainer(), creates a new <pre> ellement and displays the contents of toprint

function pcontainer(pobj) {
  var toprintd=pobj.toprintd
  var appendto=pobj.appendto
  var pretty = document.createElement("pre")
  pretty.style.width = "30%"

            var textnode = document.createElement("p")
            textnode.innerHTML = toprintd
            textnode.style.display = "inline-block"
            appendto.appendChild(textnode)
}//txtcontainer(), creates a new textNode and displays the contents of toprint

function divisionlines() {
    //fully autonomous
    var fulllist = document.getElementById("fulllist")
    var linode = document.createElement("li")
    linode.style.height = "7px"
    fulllist.appendChild(linode)
  } //divisionlines(), draws a list objment with an hr line to more clearly divide the tests by function


function ui_toggle(id_in) {
  var eles = document.getElementsByClassName(id_in);
  var stp=0
  var elen=eles.length
  while (stp < elen) {  
    var ele=eles[stp]
    a_id="a"+id_in
    if (ind != "length"){
      var a_in = document.getElementById(a_id);
      if(ele.style.display == "block") {
        ele.style.display = "none";
        a_in.innerHTML = "+";
      } else {
        ele.style.display = "block";
        a_in.innerHTML = "-";
      }
    }
    stp++
  }
} //ui_toggle(),

//function dada() {
//} //dada(), various bits of interesting information about the tests considered as a whole
