#!/usr/bin/env python3
#compose a test file for a python script or module
#  includes a few variable  options.. see helper()


import sys
import json


def helper(args):
  print("  "+args[0]+" -m /PATH/TO/MODULE.py")
  print("             OPTIONAL :")
  print("                       -t /PATH/TO/TEST_FILE")
  print("                       -o /PATH/TO/OUT_TST_FILE : if -o missing -t will be overridden")
  print("                       -e OUT_TST_FILE_EXT : js || json ")
  print("                                           : implicit if -o present")
  print("                                           : -e overrides -o, default js")
  exit()


def rollArgs(args):
  dargs={}
  dargs["module"]=""
  dargs["tstFn"]=""
  dargs["tests"]=[]
  dargs["outFn"]=""
  dargs["outExt"]="js"
  if (len(args)-1)%2==0:
    for ei,ea in enumerate(args):
      if ea=="-h":
        helper(args)
      elif ea=="-m":
        try:
          fo=open(args[ei+1],"r")
          module=fo.readlines()
        except Exception as e:
          print("  ..err loading module: please ensure the path and filename are correct")
          print("                      :",e)
        dargs["module"]=module
      elif ea=="-t":
        try:
          fo=open(args[ei+1],"r")
          ftxt=fo.read()
          jstron=ftxt.split("alltests = ")[1]
          tests=json.loads(jstron)
          dargs["tests"]=tests
          dargs["tstFn"]=args[ei+1]
        except Exception as e:
          print("  ..err loading module: please ensure the path and filename are correct")
          print("                      :",e)
      elif ea=="-o":
        dargs["outFn"]=args[ei+1]
        spl=args[ei+1].split(".")
        if "-e" not in args:
          dargs["outExt"]=spl[len(spl)-1]
      elif ea=="-e":
        dargs["outExt"]=args[ei+1]
  else:
    print("  ..check your arguments:",args)
    helper(args)
  if dargs["module"]=="":
    print("  ..  "+args[0]+" requires the -m argument")
    helper(args)
  if dargs["outFn"]=="":
    if dargs["tstFn"]=="":
      dargs["outFn"]="./tmp.composedTests"+"."+dargs["outExt"]
    else:
      dargs["outFn"]=dargs["tstFn"]
  return dargs


def chkIfFuncPresent(funcname,tests):
  present=False
  for ea in tests:
    if ea["funcname"]==funcname:
      present=True
  return present


def appendNewTest(funcname,f_args,tests):
  f_args=f_args.split(",")
  if len(f_args)==1 and f_args[0]=="":
    f_args=[]
  nuTest={}
  nuTest["funcname"]=funcname
  nuTest["arguments"]=f_args
  nuTest["desc"]=""
  nuTest["tests"]=[]
  nuTest["tests"].append({})
  nuTest["tests"][0]["why"]=""
  nuTest["tests"][0]["assert"]=[]
  for ea in f_args:
    nuTest["tests"][0]["assert"].append({"what":"","where":ea})
  nuTest["tests"][0]["expect"]=[{"what":"","where":"ret"}]
  tests.append(nuTest)
  return tests


def rollFuncs(dargs):
  tests=dargs['tests']
  for ea in dargs["module"]:
    ea=ea.strip()                 #remove leading and trailing whitespace
    if len(ea)>0:
      if ea[0]!="#":                #ignore comments
        if ea[:4]=="def ":             #YUCK, my style hardcoded.. LIMITED SCOPE, consider other ways to declare funcs
          remDef=ea.split("def ")[1]  #remove "def "
          funcname=remDef.split("(")[0] #remove args "(ARG, ARG, ..):"
          f_args=remDef.split("(")[1].split(":")[0][:-1] #-1 removes the closing ')'
          present=chkIfFuncPresent(funcname,tests)
          if present==False:
            tests=appendNewTest(funcname,f_args,tests)
  dargs["tests"]=tests
  return dargs

def writeToJSFile(dargs):
  fn=dargs["outFn"]
  fo=open(fn,"w")
  fo.write("var alltests = "+json.dumps(dargs["tests"],sort_keys=True,indent=2))
  fo.close()

def writeToJSONFile(dargs):
  fn=dargs["outFn"]
  fo=open(fn,"w")
  fo.write(json.dump(dargs["tests"],sort_keys=True,indent=2))
  fo.close()

def onit():
  args=sys.argv
  dargs=rollArgs(args)
  dargs=rollFuncs(dargs)
  if dargs["outExt"]=="js":
    writeToJSFile(dargs)
  elif dargs["outExt"]=="json":
    writeToJSONFile(dargs)

if __name__=="__main__":
  onit()
  print("..01x17")
#./py_composeTests.py -m /PATH/TO/MODULE [-t /PATH/TO/TEST_FILE]  #[] optional
