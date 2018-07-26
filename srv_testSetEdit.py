#!/usr/bin/env python3
# a simple http server to serve python tests to the testsetedit ui

def helper():
    print("  a simple http server to serve python tests to the testsetedit ui")
    print("    ./simpHTTP PROJ_NM [PORT_NUM]  #[] optional, default 8000")
    print("      PROJ_NM : project name : identifying key from testconfig file dict")

import sys
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

if len(sys.argv)>1:
    currTest=sys.argv[1]
    try:
        testConfig=json.loads(open("testconfig","r").read())
    except:
        print("err : missing or faulty testconfig file in current directory")
        print("    : check dev/templates/ for a template testconfig file")
        exit()
    config_test=testConfig[currTest]
else:
    helper()

globals()["testModule"]=""

def roll(ins):
  for i in ins:
    print(i)

def loadIndex(req):
  req.path=17

class testHTTP(BaseHTTPRequestHandler):
  #GET
  def do_GET(self):
    sendReply=False
    index=False
    if self.path=="/":
      loadIndex(self)

      self.path="./testsetedit.htm"
      mimetype='text/html'
      sendReply=True
      index=True

    config_test=globals()["config_test"]

    if self.path=="/retrieveTest":
        modDir=config_test["testFileDir"]
        modFn=config_test["testFileName"]
        modFile=modDir+modFn
        print(modFile)
        if modFile[-5:]==".json":
            mimetype="application/javascript"
            #mimetype="application/json"
            self.send_response(200)
            self.send_header('Content-type',mimetype)
            self.end_headers()
            f=open(modFile,'r')
            fin=f.read()
            self.wfile.write(bytes(fin,"utf8"))
            f.close()

    if self.path=="/retrieveFile":
        modDir=config_test["projDir"]
        modFn=config_test["projFileName"]
        modFile=modDir+modFn
        if modFile[-3:]==".js":            # javascript tests
            mimetype="application/javascript"
            self.send_response(200)
            self.send_header('Content-type',mimetype)
            self.end_headers()
            f=open(modFile,'r')
            fin=f.read()
            self.wfile.write(bytes(fin,"utf8"))
            f.close()
        elif modFile[-3:]==".py":          # python tests
            import pyTstSRV
            pyTstSRV.renewModuleBeingTested()


    if self.path.endswith(".js"):
      mimetype="application/javascript"
      sendReply=True
      self.path="dev/lang/js/"+self.path
    if self.path.endswith(".json"):
      mimetype="application/json"
      sendReply=True
    if index==False and len(self.path.split("/"))==2: #path="pathlessFile.js"
      self.path="."+self.path
    else:  #path="/file/with/path.js"
      self.path=self.path
    if sendReply==True:
      try:
        f=open(self.path,"r")
        self.send_response(200)
        self.send_header('Content-type',mimetype)
        self.end_headers()
        fin=f.read()
        self.wfile.write(bytes(fin,"utf8"))
        f.close()
      except:
        print("failed to open file:",self.path)
    return

  def do_POST(self):
    #print(self)
    #print(dir(self))
    #print(roll(dir(self.headers)))
    renewModuleBeingTested()
    if self.path=="/chkFunctionExists":
      #sent a string : "FUNCTION_NAME"
      chkFunc(self)

    if self.path=="/functionCallout":
      #sent dict : {
      #             "funcname": "FUNCTION_NAME",
      #             "args": { DICT_OF_ARGS },
      #             "argsOrder": [ ORDERED_LIST_OF_ARGS ]
      #            }
      chkCallOut(self)

    return


def run():
  print("starting server..")
  srv_loop="127.0.0.1"
  if len(sys.argv)>2:
    try:
      srv_port=int(sys.argv[2])
    except:
      srv_port=8000
  else:
    srv_port=8000
  server_address=(srv_loop,srv_port)
  httpd=HTTPServer(server_address,testHTTP)
  print(" ..",srv_loop+":"+str(srv_port))
  print("running server..",sys.argv[1])
  httpd.serve_forever()
run()

#./simpHTTP PROJ_NM [PORT_NUM]  #[] optional, default 8000
