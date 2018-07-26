#!/usr/bin/env python3

import json
from composeBaseTimecards import *
#import composeBaseTimecards

fn="tests/alltests.json"
fo=open(fn,"r")
alltests=json.load(fo)
fo.close()

def functionTest(ti,tests):
  if funcname in globals():
    testFunc=globals()[funcname]
    if len(ftest["arguments"])==1:
      for ea_assert in tests["assert"]:
        arg=ea_assert["what"]
    else:
      print(" TODO: add support for multiple arguments")
    #print("arg:",type(arg))
    #ttf(arg)

    chk=testFunc(arg)

    if len(tests["expect"])==1:
      expect=tests["expect"][0]["what"]
    else:
      print(" TODO: add support for multiple expects")
    #ttf(chk)
    if chk==expect:
      print(" "*5,str(fi)+"."+str(ti),"PASS",type(chk),type(expect),chk==expect)
    else:
      print("<> inequal:")
      ttf(chk)
      print(" "*5,str(fi)+"."+str(ti),"FAIL",type(chk),type(expect),chk==expect)
      if type(chk)==int or type(chk)==float:
        print(" "*6,"chk value:",chk)
  else:
    print(" function:",funcname+"(); is vacant from file")

for fi,ftest in enumerate(alltests):
  funcname=ftest["funcname"]
  print(" "*3,fi,funcname+"():")
  for ti,tests in enumerate(ftest["tests"]):
    functionTest(ti,tests)
