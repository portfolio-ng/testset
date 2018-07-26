//js functions for interacting with language functions
//
// language :: py 
//

function AGN_maxFunctionArgs(){
  return 5 //see simpHTTP::callOut()
}


function AGN_chkFuncInSource(lastFunc,funcname) {
  var exists=false
    var request=new XMLHttpRequest();
  request.open('POST','/chkFunctionExists',true);
  request.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
  request.onreadystatechange=function() {
    if (this.readyState == 4 ){
      if (request.response == "exists" ) { // "exists" || "function vacant from source file"
          funcList.push(funcname)
        }
      if ( funcname==lastFunc) {
        chkFuncInSourceCallback(funcList)
      }
    }
  };
  request.send(funcname);
}


function AGN_chkAndApplyTypeFromLang(res) {
  //from python3, str(type()) values
  var py_dict="<class 'dict'>"
  var py_list="<class 'list'>"
  var py_float="<class 'float'>"
  var py_int="<class 'int'>"
  var py_str="<class 'str'>"
  var py_None="<class 'NoneType'>"
  var py_bool="<class 'bool'>"
  var ret="FUNCTION FAILURE"
  var ret_type=res["type"]
  //JSON.parse() from AGN_functionCallout() will convert all dicts and lists to 'object' 
  //  if that is the intended functionality then proceed, 
  //    else if ret_type is another type, such as STRING
  if ( ( typeof res["ret"] === 'object' ) && ( (ret_type==py_dict) || (ret_type==py_list) ) ) { 
    ret=res["ret"]
  } else {
    //JSON.parse() can take: String({}),String([]),INT,String(INT),FLOAT,String(FLOAT),bool
    if ( ( ret_type==py_dict ) || ( ret_type==py_list ) || ( ret_type==py_float ) || ( ret_type==py_int ) || ( ret_type==py_bool )  ) {
      ret=JSON.parse(res["ret"])
    } else if ( ret_type==py_str ) { // leave strings untouched
      ret=String(res["ret"])
    } else if ( ret_type==py_None ) {
      ret=null
    } else {
      console.log("AGN_chkAndApplyTypeFromLang() err :: unaccounted for ret type:",ret_type,", ret val:",res)
    }
  }
  return ret
} //chkTypeAndApplyFromLang(), 

//debug_testsout=[]
function AGN_functionCallout(lastFunc,possArgVals,iat,it,thetest,funcname,args) {
  dada={} //dada sent to server through HTTP::POST
  dada["args"]=args
  dada["argsOrder"]=alltests[iat]["arguments"]
  dada["funcname"]=funcname
  dada=JSON.stringify(dada)
  var request=new XMLHttpRequest();
  request.open('POST','/functionCallout',true);
  request.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
  request.onreadystatechange=function() {
    if (this.readyState == 4 ){
      res=JSON.parse(request.responseText)
        
     ret=AGN_chkAndApplyTypeFromLang(res)
      thetest["procd"]["results"] = ret
      thetest = tst_checkit(thetest)
      alltests[iat]["tests"][it]=thetest  //locally this executes in order so can stop on last func
      //debug_testsout.push(String(iat)+"."+String(it))
      //may be better to do a chained callback to ensure determinate order
      if ( funcname==lastFunc ) {
        var indexOfLastTest=alltests[iat]["tests"].length-1
        if ( it==indexOfLastTest )  {
          //last test of last function?
          functionCalloutCallback()
        }
      }
    }
  };
  request.send(dada)
}
