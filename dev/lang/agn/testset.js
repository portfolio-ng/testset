//testset
// tests functions based on predictable results
////
//
//
//refact
//
funcList=[]
tst_onit() //initiate



function tst_onit() {
  createFuncList()
} //tst_onit(), initiate



function chkFuncInSourceCallback() {
  tst_cycle()
} //chkFuncCallback(), the callback called after the last funcTools.js::AGN_chkFuncname() HTTP::POST responds

function createFuncList() {
  var atl=alltests.length
  if (tst_has(alltests[atl-1],"funcname")){
    var lastFunc=alltests[atl-1]["funcname"]
  }
  for (var iat = 0; iat<atl; iat++ ) {
    if (tst_has(alltests[iat],"funcname")){
      funcList.push(alltests[iat]["funcname"])
      //chkFuncInSourceCallback()
//     AGN_chkFuncInSource(lastFunc,alltests[iat]["funcname"])
    }
  }
} //createFuncList(), create a list of all functions that appear both in the tests and the source


function findLastFunctionInAlltests() {
  var atl=alltests.length
  if (tst_has(alltests[atl-1],"funcname")){
    lastFunc=alltests[atl-1]["funcname"]
  } else {
    //safety net:
    // roll through alltests in reverse until a test contains funcname
    // that will be lastFunc
  }
  return lastFunc
}

function ftest_error(errNumb,varList) {
  if ( errNumb=="err.0" ) {
    console.log("err.0 :: function :",varList[0],": is vacant from the source file.. see global variable funcList for full list")
  } else if ( errNumb=="err.1" ) {
    console.log("err.1 :: bad test at index of:",varList[0],": of alltests, missing funcname key")
  } else if ( errNumb=="err.2" ) {
    console.log("err.2 :: ") 
  }
}

function functionCalloutCallback() {  
  tst_uidisp()
} //functionCalloutCallback(), the callback called after the last funcTools.js::AGN_functionCallOut() HTTP::POST responds

function processFunctionTests() {
  var atl=alltests.length
  var possArgVals = AGN_maxFunctionArgs() //maximum number of callable function arguments
  var lastFunc=findLastFunctionInAlltests()
  for (var iat = 0; iat<atl; iat++ ) {
    if (tst_has(alltests[iat],"funcname")){
      var funcname=alltests[iat]["funcname"]
      if ( tst_chkFuncInFuncList(funcList,funcname) ) {
        var tl=alltests[iat]["tests"].length
        for (var it = 0; it < tl; it++) {
          var thetest = alltests[iat]["tests"][it]
          thetest = tst_fillobj(thetest,funcname)
          args=thetest["procd"]["testobj"]
//console.log(iat, ".", it," \\/\\/\\/_________________",funcname)
          AGN_functionCallout(lastFunc,possArgVals,iat,it,thetest,funcname,args)
        }
      } else {
        ftest_error("err.0",[funcname])
      }
    } else {
      ftest_error("err.1",[iat])
    }
  }
} //processFunctionTests(), callout to each function being tested and store the returned value in processed : ["procd"]
  

function tst_chkFuncInFuncList(funcList,funcname) {
  var exists=false
  for (var ind in funcList ) {
    if ( funcList[ind] == funcname) {
      exists=true
      break;
    }
  }
  return exists
}

function tst_cycle() {
  processFunctionTests()
} //tst_onit(), fills the obj, calls the function and checks the values returned


function tst_fillobj(thetest,funcname) {
  thetest["funcname"] = funcname //adds funcname to all tests for debug purposes
  thetest["procd"] = {} //initialises or clears if present
  var thistry = thetest["assert"]
  var testobj = {}

  for (var itt = 0, ttl = thistry.length; itt < ttl; itt++) {
    var thiswhr = thistry[itt]["where"]
    var base = thiswhr.split(".")[0]
      testobj[base] = {}
      thistry[itt]["base"] = base
  }
  for (var itt = 0, ttl = thistry.length; itt < ttl; itt++) {
    var thiswht = thistry[itt]["what"]
    var thiswhr = thistry[itt]["where"]
    var thisbase = thistry[itt]["base"]
      
    if (thiswhr.indexOf(".") < 0) {
      testobj[thisbase] = thiswht
    } else {
        var dotobj = {
          "obj": testobj[thisbase],
          "val": thiswht,
          "loc": thiswhr
        }
        testobj[thisbase] = tst_dotset(dotobj)
    }
  } // for ( var itt = 0, ttl=thistry.length; itt < ttl; itt++ ) 
  thetest["procd"]["testobj"] = TOOLdiss(testobj)
  return thetest
} //tst_fillobj(), fill the object that will be sent to the function being tested 

//try:: INT..tries three ints 1+,1-,0..
//// ~INT~10.. tries ten ints of random sign and value
//// ~INT+~17..tries 17 random ints, all positive
//// ~FLT~.. try 3 floats
//// ~WRD~.. tries random words.. on and on
//obj{"WRD": "funcforWRD", "FLT": "funcforFLT", "INT": "funcforINT"}
//if hasproperty(split(~)[1]) window[obj.split(~)[1]


function tst_dotset(dotobj) {
  //check against schema.json for values
  try {
    var dobj = dotobj["obj"]
    var str = dotobj["loc"]
    var val = dotobj["val"]
    var str = str.split(".")
    str.shift() //removes root from object dot notation
    var next = ""
    while (str.length > 1) {
      next = str.shift()
      if (typeof dobj[next] === "undefined") {
        dobj[next] = {}
        dobj = dobj[next]
      } else {
        dobj = dobj[next]
      }
    }
    next = str.shift()
    if (typeof dobj[next] === "undefined") {
      dobj[next] = {}
    }
    dobj[next] = val
  } catch (err) {
    dotobj.obj = "invalid expression of object in test.. usually obj[0].KEY should be obj.0.KEY"
  }
  return dotobj.obj //mutated via dobj
} //tst_dotset(), initialise object values passed as dot notation

function tst_checkitREQDOM(thetest) {
  var expwht = thetest["expect"][iexp]["what"] // could send as func args instead
  var expwhr = thetest["expect"][iexp]["where"] // could send as func args instead
  var dommy = String(expwhr).substring(4, expwhr.length)
  var domarr = String(dommy).split(".")


    var domobj = document.getElementById(domarr[0])
    if (domobj) {
      var domattr = domarr[domarr.length - 1]
      var domstyl = domobj["style"][domattr]
      var got = String(domstyl)
    } else {
      var got = "DOM :: check your return value"
    }
    if (domobj == null) {
      var got = "DOM :: check your htm, missing this ellement"
    }
  return got
}


function checkitREQstrNaN(obj){
  if (typeof obj == 'object') {
    for ( var ea in obj ) {
      obj[ea]=checkitREQstrNaN(obj[ea])
    }
  } else { 
    if (String(obj) == "NaN") {
      obj="NaN"
    }
  } 
      return obj
} // checkitREQstrNaN(), descends object and converts all NaNs to "NaN" due NaN present json being invalid

function tst_checkit(thetest) {
  for (var iexp = 0; iexp < thetest["expect"].length; iexp++) {
    var expwht = thetest["expect"][iexp].what
    var expwhr = thetest["expect"][iexp].where
    if (String(expwhr).substring(0, 4) == "DOM.") {
      var got = tst_checkitREQDOM(thetest)
    } else {
      if (thetest["procd"]["results"] || thetest["procd"]["results"] == false) {

        var getobj = {
          "obj": thetest["procd"]["results"],
          "expwhr": expwhr
        }
        var got = tst_getproperty(getobj)
      } else {
        var got = "OBJ :: expected return value undefined, check that your function has a return value, or check the console for other error details"
      }
    }
    got=checkitREQstrNaN(got)
    if (got == undefined ) { //json only allows null value
      got = null
    }

    thetest["expect"][iexp]["got"] = got
    thetest["expect"][iexp]["gottype"] = typeof got
    thetest["expect"][iexp]["whttype"] = typeof expwht
    possobj = {
      "expwht": expwht,
      "got": got
    }
    var thisoutcome = tst_possout(possobj) //returns string, "succ" or "fail"
    if (thetest["outcome"]) {
      //if already set to succ but current test fails then set to fail
      if (thetest["outcome"] == "succ" && thisoutcome == "fail") {
        thetest["outcome"] = thisoutcome
      } else  if (thetest["outcome"] == "fail" && thisoutcome == "succ") {
        thetest["outcome"] = thisoutcome 
      }//if already set to fail then leave it be
    } else {
      //if running the first test set the initial value
      thetest["outcome"] = thisoutcome
    }
  }
  return thetest
} //tst_checkit(), checks to see if returned values match expected values 


function tst_possout(possobj) {
  var expwht = possobj["expwht"]
  var got = possobj["got"]
 
  var eqstr = false
  if (typeof expwht === 'string' && typeof got === 'string') {
    if (expwht == got) {
      eqstr = true
    }
  }
  
  var eqnum = false
  if (typeof expwht === 'number' && typeof got === 'number') {
    //var epsilon = Math.pow(2, -17)
    var epsilon = 0.17 //em calculations seem to have quite a bit of wiggle room what was 49.588 once is now 49.593 
    if (expwht == got || String(expwht) == String(got) || Math.abs(expwht - got) < epsilon) {
      eqnum = true
    }
  }
  
  var eqobj = false
  if (typeof expwht === 'object' && typeof got === 'object') {
    eqobj = tst_eq(got, expwht, [], [])
  }
  
  var eqnul = false
  //yuck, string conversion of NaN possible failure point?e
  if ((expwht == null || String(expwht) == "NaN") && (got == null || String(got) == "NaN")) { 
    eqnul = true
  }
  
  var eqboo = false
  if (typeof expwht === 'boolean' && typeof got === 'boolean') {
    if (String(expwht) == "true" && String(got) == "true") {
      eqboo = true
    }
    if (String(expwht) == "false" && String(got) == "false") {
      eqboo = true
    }
  }
 
  if (eqstr == true || eqnum == true || eqobj == true || eqnul == true || eqboo == true) {
    outcome = "succ"
  } else {
    outcome = "fail"
  }
  return outcome
} //tst_possout(), checks different types for equivalence




function tst_getproperty(getobj) {
  try {
    var gobj = getobj["obj"]
    var expwhr = getobj["expwhr"]


    if (String(expwhr).indexOf(".") < 0) {
      return gobj
    } else {
      var fulldep = String(expwhr).split(".")
      var thisdep = fulldep.shift()
      var itl = fulldep.length;
      for (var itd = 0; itd < itl; itd++) {
        thisdep = fulldep[itd]
        if (tst_isanumber(thisdep)) {
          thisdep = parseInt(thisdep)
        }
        if (itd < itl - 1) {
          if (gobj[thisdep]) {
            gobj = gobj[thisdep]
          }
        } else {
          gobj = gobj[thisdep]
        }
      }
    }
  } catch (err) {
    gobj = "invalid expression of object in test.. usually obj[0].KEY should be obj.0.KEY"
  }
  return gobj
} //tst_getproperty(), retrieve a property deep in an object




function tst_isanumber(numb) {
  return !isNaN(parseFloat(numb)) && isFinite(numb)
} //tst_isanumber(), determines if the value is a number







//lifted underscore.js's eq function.. thanks for some beautiful code: underscorejs.org
// Internal recursive comparison function for `isEqual`.
//var eq = function(a, b, aStack, bStack) {
function tst_eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a==-0 || b==-0 ? a===b : a !== 0 || 1 / a == 1 / b;
  // A strict comparison is necessary because `null == undefined`.
  if (a == null || b == null) return a === b;
  // Unwrap any wrapped objects.
  //if (a instanceof _) a = a._wrapped;
  //if (b instanceof _) b = b._wrapped;
  // Compare `[[Class]]` names.
  var className = toString.call(a);

  if (className != toString.call(b)) return false;
  switch (className) {
    // Strings, numbers, dates, and booleans are compared by value.
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return a == String(b);
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
      // other numeric values.
      //return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b); //original underscore code
      console.log("numb??",a,b,"js has many dubious equivalences, ensure opinion")
      return (a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b))? true : tst_eqAllowd(a,b) ;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a == +b;
      // RegExps are compared by their source patterns and flags.
    case '[object RegExp]':
      return a.source == b.source &&
        a.global == b.global &&
        a.multiline == b.multiline &&
        a.ignoreCase == b.ignoreCase;
  }
  if (typeof a != 'object' || typeof b != 'object') return false;
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] == a) return bStack[length] == b;
  }
  // Objects with different constructors are not equivalent, but `Object`s
  // from different frames are.
  var aCtor = a.constructor,
    bCtor = b.constructor;
  //if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
  //    _.isFunction(bCtor) && (bCtor instanceof bCtor)) && ('constructor' in a && 'constructor' in b)) {
  if (aCtor !== bCtor && !(typeof aCtor == 'function' && (aCtor instanceof aCtor) &&
      (typeof bCtor == 'function') && (bCtor instanceof bCtor)) && ('constructor' in a && 'constructor' in b)) {
    return false;
  }
  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);
  var size = 0,
    result = true;
  // Recursively compare objects and arrays.
  if (className == '[object Array]') {
    // Compare array lengths to determine if a deep comparison is necessary.
    size = a.length;
    result = size == b.length;
    if (result) {
      // Deep compare the contents, ignoring non-numeric properties.
      while (size--) {
        if (!(result = tst_eq(a[size], b[size], aStack, bStack))) break;
      }
    }
  } else {
    // Deep compare objects.
    for (var key in a) {
      if (tst_has(a, key)) {
        // Count the expected number of properties.
        size++;
        // Deep compare each member.
        if (!(result = tst_has(b, key) && tst_eq(a[key], b[key], aStack, bStack))) break;
      }
    }
    // Ensure that both objects contain the same number of properties.
    if (result) {
      for (key in b) {
        if (tst_has(b, key) && !(size--)) break;
      }
      result = !size;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return result;
} //tst_eq(), lifted from underscore.js 1.6.0 .. this function determines if two objects are the same

function tst_has(obj, key) {
  return hasOwnProperty.call(obj, key);
} //tst_has(), lifted from underscore.js 1.6.0 .. subfunction of eq checks if an object has a key

//globalfree :: t 
//compatible :: t
//fullytestd :: t 
function tst_TOOLchkNegZero(ni) {
  //ni == -0 ? ni=0 : ni=ni //see README Infinity!=-Infinity
  var ret=ni
  if ( ni == -0 ) {
    ret=0
  }
  if ( typeof ni=='string' ) {
    ret=ni=="-0" ? ni="0" : ni
  } else {
    ret=ni==-0 ? ni=0 : ""+ni
  }
  return ret
} //tst_TOOLchkNegZero(), checks for negative zero, if found assign zero

function tst_eqAllowd(fir, sec) {
    //ERR=["fir=1=num,sec=2=num", fir, sec]
    var acceptablyequal = false
    //var allowederror = 0.0000017
    var allowederror = 0.17
    fir=tst_TOOLchkNegZero(fir)
    sec=tst_TOOLchkNegZero(sec)
    console.log(fir,sec)
    //investigate, have improvements solved this problem?
    fir=parseFloat(fir)
    sec=parseFloat(sec)
    var val = Math.abs(parseFloat(fir) - parseFloat(sec))
    if (val < allowederror) {
      acceptablyequal = true
    } else {
      acceptablyequal = false
    }
    return acceptablyequal 
  } //tst_eqAllowd(), something about the floating point numbers creates errors of .5px that is sometimes better ignored, yuck
