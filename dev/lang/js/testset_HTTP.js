function req_Test() {
  var req_t = new XMLHttpRequest();
  req_t.open('GET', '/retrieveTest', true);
  req_t.onload = function() {
    if (req_t.status >= 200 && req_t.status < 400) {
    // Success!
      if(req_t.readyState==4 && req_t.status==200)
      {
        var myDiv = document.getElementById('toEval_TEST');
        myDiv.innerHTML = "alltests="+req_t.responseText;
        console.log(myDiv)
        eval(myDiv.innerHTML)
      }
    } else {
      console.log("err")
    // We reached our target server, but it returned an error
    }
  };
    req_t.onerror = function() {
      console.log("dblerr",req_t)
      // There was a connection error of some sort
    };
  req_t.send();
}

function req_File() {
  var req_f = new XMLHttpRequest();
  req_f.open('GET', '/retrieveFile', true);
  req_f.onload = function() {
    if (req_f.status >= 200 && req_f.status < 400) {
    // Success!
      if(req_f.readyState==4 && req_f.status==200)
      {
        var myDiv = document.getElementById('toEval_FILE');
        myDiv.innerHTML = req_f.responseText;
        console.log(myDiv)
        eval(myDiv.innerHTML)
      }
    } else {
      console.log("err")
    // We reached our target server, but it returned an error
    }
  };
    req_f.onerror = function() {
      console.log("dblerr",req_f)
      // There was a connection error of some sort
    };
  req_f.send();
}

req_Test()
req_File()
