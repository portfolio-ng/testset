
function tst_windowCall0(funcname, testobj, torun) {
  var res = window[funcname]()
  return res
}

function tst_windowCall1(funcname, testobj, torun) {
  var argName1 = testobj["arguments"][0]
  var arg1 = torun[argName1]
    if ( arg1 == undefined ) {
      console.log("    missing the argument:",argName1,";from your test object:",torun)
      console.log("      change your assertion's 'where' to:",testobj["arguments"][0])
    }
  var res = window[funcname](arg1)
  return res
}
function tst_windowCall2(funcname, testobj, torun) {
  var argName1 = testobj["arguments"][0]
  var argName2 = testobj["arguments"][1]
  var arg1 = torun[argName1]
  var arg2 = torun[argName2]
  if (arg1 == undefined ) {
    console.log("    missing argument 1:",argName1,";from your test object:",torun)
    console.log("      change the argument's corresponding assertion's 'where' key or add the necessary assertion")
  }
  if (arg2 == undefined ) {
    console.log("    missing argument 2:",argName2,";from your test object:",torun)
    console.log("      change the argument's corresponding assertion's 'where' key or add the necessary assertion")
  }
  var res = window[funcname](arg1,arg2)
  return res
}

function tst_windowCall3(funcname, testobj, torun) {
  var argName1 = testobj["arguments"][0]
  var argName2 = testobj["arguments"][1]
  var argName3 = testobj["arguments"][2]
  var arg1 = torun[argName1]
  var arg2 = torun[argName2]
  var arg3 = torun[argName3]
  if (arg1 == undefined ) {
    console.log("    missing argument 1:",argName1,";from your test object:",torun)
    console.log("      change the argument's corresponding assertion's 'where' key or add the necessary assertion")
  }
  if (arg2 == undefined ) {
    console.log("    missing argument 2:",argName2,";from your test object:",torun)
    console.log("      change the argument's corresponding assertion's 'where' key or add the necessary assertion")
  }
  if (arg3 == undefined ) {
    console.log("    missing argument 3:",argName3,";from your test object:",torun)
    console.log("      change the argument's corresponding assertion's 'where' key or add the necessary assertion")
  }
  var res = window[funcname](arg1,arg2,arg3)
  return res
}

//TEMPLATE for user submitted multi argument function calls
function tst_windowCall4(funcname, testobj, torun) {
  var arglen=4
  var argcur=0
  var a=[]
  while ( argcur<arglen) {
    var argName=testobj["arguments"][argcur]
    var argI=torun[argName]
    if (argI == undefined ) {
      console.log("    missing argument "+String(argcur+1)+":",argName,";from your test object:",torun)
      console.log("      change the argument's corresponding assertion's 'where' key or add the necessary assertion")
    }
    a.push(argI)
    argcur++
  }
  var res = window[funcname](a[0],a[1],a[2],a[3])
  return res
}

function AGN_chkFuncname(lastFunc,funcname) {
  try {
    if (typeof window[funcname]=='function') {
      funcList.push(funcname)
    }
  } catch(e) {
    console.log("AGN_chkFuncname err : funcname :",funcname,": error :",e)
  }
  if ( funcname==lastFunc ) {
    funcListCallback(funcList)
  }
}

function AGN_maxFunctionArgs() {
  var wcc = 0
  var possArgVals = []
  var sublen="tst_windowCall".length
    //necessary to account for user defined possible number of arguments
  for (var ao in window) {
    var fn = String(ao)
    if (fn.substring(0, sublen) == "tst_windowCall") {
      var fnlen = fn.length
      possArgVals.push(parseInt(fn.substring(sublen, fnlen)))
      wcc++
    }
  }
  return possArgVals
} //goes through window object looking for functions to tst_windowCalls of arbitrary arguments


function AGN_chkFunctionExists(funcname) {
  return typeof window[funcname]==='function';
}

function AGN_functionCallout(lastFunc,iat,it,possArgVals,funcname,args,thetest) {
            res=""
            console.log(lastFunc,funcname)
            if (AGN_chkFunctionExists(funcname)) {
              var numOfArgs = alltests[iat]["arguments"].length
              if (possArgVals.indexOf(numOfArgs) > -1) {
                fstr = "tst_windowCall" + String(numOfArgs)
                try {
                  var res = window[fstr](funcname, alltests[iat], args)
                  thetest.procd["results"]=res
                } catch (err) {
                  console.log("    complete function failure while testing:", funcname,":args:", args, ":results:", res)
                  res="TEST FAILURE"
                }
                try {
                  thetest=tst_checkit(thetest)
                } catch (err) {
                  console.log("    checkit problem? f:",funcname,", iat:",iat,", it:",it)
                }
                alltests[iat][it]=thetest
              } else {
                console.log("  trying to call a function with more args then prepared for")
                console.log("    must change source adding new tst_windowCall# function")
                console.log("    that can accomodate the",numOfArgs,"arguments of your",funcname,"function")
              }

              console.log(iat, ".", it, " /\\/\\/\\_________________",funcname)
              if (funcname == lastFunc ) {
                calloutCallback()
              }
            } else {
              console.log("    ",funcname,"function is vacant from js file")
            }
            return {"results":res}
        }
