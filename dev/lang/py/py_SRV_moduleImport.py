"""
importlib alternatives:
########################################################

configfile = '~/config.py'

import os
import sys

sys.path.append(os.path.dirname(os.path.expanduser(configfile)))

import config

########################################################

import sys
# the mock-0.3.1 dir contains testcase.py, testutils.py & mock.py
sys.path.append('/foo/bar/mock-0.3.1')

from testcase import TestCase
from testutils import RunTests
from mock import Mock, sentinel, patch

########################################################
"""



def renewModuleBeingTested():
  import importlib
  config_test=globals()["config_test"]
  modDir=config_test["moduleDir"]
  modFn=config_test["moduleFileName"]
  modFile=modDir+modFn
  if str(type(globals()["testModule"]))=="<class 'module'>":
    globals()["testModule"]=importlib.reload(globals()["testModule"])
  else:
    globals()["testModule"]=importlib.import_module(modFile)


def callOut(funcname,args,argsOrder):
  maxArgs=5
  config_test=globals()["config_test"]
  #args : dict : {"arg1Name":argVal, "arg0Name":arg1Val, .. }
  #argsOrder : list : [arg0, arg1, .. ]
  fcall=getattr(globals()["testModule"],funcname)
  numOfArgs=len(argsOrder)
  if numOfArgs<=maxArgs:
    try:
      if numOfArgs==0:
        ret=fcall()
      elif numOfArgs==1:
        a0=args[argsOrder[0]]
        ret=fcall(a0)
      elif numOfArgs==2:
        a0=args[argsOrder[0]]
        a1=args[argsOrder[1]]
        ret=fcall(a0,a1)
      elif numOfArgs==3:
        a0=args[argsOrder[0]]
        a1=args[argsOrder[1]]
        a2=args[argsOrder[2]]
        ret=fcall(a0,a1,a2)
      elif numOfArgs==4:
        a0=args[argsOrder[0]]
        a1=args[argsOrder[1]]
        a2=args[argsOrder[2]]
        a3=args[argsOrder[3]]
        ret=fcall(a0,a1,a2,a3)
      elif numOfArgs==5:
        a0=args[argsOrder[0]]
        a1=args[argsOrder[1]]
        a2=args[argsOrder[2]]
        a3=args[argsOrder[3]]
        a4=args[argsOrder[4]]
        ret=fcall(a0,a1,a2,a3,a4)
    except:
      ret="FUNCTION FAILURE"
  else:
    ret="too many arguments, update this language's callOut() function to accomodate"
  return ret


def chkCallOut(self):
    #sent an object
    content_len=int(self.headers.get('content-length',0));
    post_body=self.rfile.read(content_len);
    dada=(post_body.decode("utf8"))
    ins=json.loads(dada)
    funcname=ins["funcname"]
    args=ins["args"]
    argsOrder=ins["argsOrder"]
    ret=callOut(funcname,args,argsOrder)
    respObj={}
    respObj["ret"]=ret
    respObj["type"]=str(type(ret))
    #print(respObj)
    req_resp=json.dumps(respObj)
    self.send_response(200)
    self.wfile.write(bytes(req_resp,"utf8"))


def chkFunc(self):
  #sent a string
  config_test=globals()["config_test"]
  content_len=int(self.headers.get('content-length',0));
  post_body=self.rfile.read(content_len);
  funcname=(post_body.decode("utf8"))
  try:
    fcall=getattr(globals()["testModule"],funcname)
    exists="exists"
  except:
    exists="function vacant from source file"
  self.send_response(200)
  self.wfile.write(bytes(exists,"utf8"))


