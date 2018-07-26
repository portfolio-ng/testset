#!/usr/bin/env python3
##build a template test framework

#output file: TIMESTAMP.builttest.js

import json
import linecache
import re
import sys

from subprocess import call
from composeCreate import *
import composeCreate

print("corrjs.py")
call(["cp","/home/cing/cinger/proj/corr/corrjs.py","./"])
print("getfrom.py")
call(["cp","/home/cing/cinger/proj/corr/getfrom.py","./"])

from corrjs import corr

def printcontents(fdata):
    print() #blank line for simpler review
    #TOOLtoform(fdata["cor"],"print")
    try:
     #..funcname
      print(str(fdata["funcname"])+"()") #print funcname with some cosmetics: FUNC()
     #..why the function is called, what purpose it serves
      print(fdata["why"])
     #..passed variables
      try:
        #n=fdata["cor"]["ins"]["funcd"] #fail without printing successes to root out bugs
        print("  passed ::",fdata["cor"]["ins"]["funcd"])
      except:
        #print(fdata["funcname"])
        print("  lacks passed variable information")
     #..return
      try:
        #n=fdata["cor"]["ret"]["funcd"] #fail without printing successes to root out bugs
        print("  returned ::",fdata["cor"]["ret"]["funcd"]) #comment out when looking for bugs
      except:
        #print(fdata["funcname"])
        print("  lacks return object information")
    except:
      print(fdata["footer"])

def writetofile(wtest):
  #wtest=json.loads(wtest)
  #TOOLtoform(wtest,'p')
  wtest="alltests =\n"+json.dumps(wtest,indent=2,sort_keys=False)
  import datetime
  thenow=".".join(str(datetime.date.today()).split('-'))
  specificuse = open("./tmp/"+str(thenow)+'.js','w')
  specificuse.write(wtest)
  specificuse.close()

def contemporise(testd,oletest):
  #contemporise means to make a test suite that:
  #   was built with an old compose.py andor,
  #   performs with an old version of tests.js;
  # usable with the most recent stable suite

  testtowrite=[]
  ltst=len(testd)
  offset=1
  ot_func=[]
  td_func=[]
  for ot in oletest:
    ot_func.append(ot["funcname"])
  for ti,td in enumerate(testd):
    if ti>0:
      td_func.append(td["funcname"])

  test_props=[]
  cCsub=dir(composeCreate)
  for ea in cCsub:
    if ea[:13]=="createtestATT":
      test_props.append(ea)

  usedArgs=testd[0]["meta"]["usedArgs"]
  if "-do" in usedArgs:
    pass
    #imagine, deleting old tests for functions vacant from source
    # check if ot_func has funcname vacant from testd
    # if so, delete

  cnt=1 # will cnt testd, skip 0 meta data
  while cnt < ltst:
    td_curr=testd[cnt]
    #check if test for function already exists
    # if exists update by augmenting and appending
    # else create a test for the new function
    if td_curr["funcname"] in ot_func: # if curr in ot because usually new functions are added to the source, ie curr
      for ea in oletest:
        if ea["funcname"]==td_curr["funcname"]:
          ot_curr=ea
      for ea in test_props:
        spl=ea.split("ATT")[1]
        if spl not in td_curr:
          mod_func=getattr(composeCreate,ea)
          ot_curr=mod_func(ot_curr,td_curr)
      print("found   :",ot_curr["funcname"],ot_curr["arguments"])
      testtowrite.append(ot_curr)
    else:
      ftest=createtestREQindi(td_curr)
      print("missing :",ftest["funcname"],ftest["arguments"])
      testtowrite.append(ftest)
    cnt+=1
  return testtowrite


def contemporiseREQkeynewname(obj):
  #old names are logged in ole object
  # key is old name
  # property is knu_INDEX.LAST_USABLE_COMMIT_HASH.VERSION
  #new names are listed in knu list
  # 0 for knu_INDEX deletes key completely

  ### yuck, wasted cycles
  # getting redefined each traversal
  # could add as arguments to a traverse(obj,ole,knu,userDefobj) fucntion
  ole={
      "in":"1.a67da76.alpha",
      "tried":"1.a67da76.alpha",
      "out":"2.a67da76.alpha",
      "expected":"2.a67da76.alpha"
      }
  knu={
      "0":"",
      "1":"assert",
      "2":"expect"
      }
  userDefobj=['what','where']
  for ea in userDefobj:
    if ea in ole:
      nuUDO=knu[ole[ea].split('.')[0]]
      userDefobj.append(nuUDO)
  ###

  if type(obj)==dict:
    #necessary to use list() to disassociate because deleting keys causes error
    # RuntimeError: dictionary changed size during iteration
    for key in list(obj.keys()):
      if key in ole:
        knuInd=ole[key].split(".")[0] #get the index number from ole obj
        if knuInd != "0":
          nu_key=knu[knuInd] # get associated key from knu obj
          obj[nu_key] = obj[key] #create new key
        del obj[key] #delete the old
    TOOLtoform(obj,"p")
    for ea in obj:
      if ea not in userDefobj: # limit traversal to avoid changing user's object keys
        obj[ea]=contemporiseREQkeynewname(obj[ea])
  elif type(obj)==list:
    for ea in obj:
      ea=contemporiseREQkeynewname(ea)
  return obj


def d_usedArgs():
  #steps through sys.argv and determines if an argument is present
  # DEV:
  #      any new arguments must be added to allowedArgs list
  allowedArgs={}
  allowedArgs["-c"]="contemporise the oletest suite"
  allowedArgs["--contemporise"]="contemporise the oletest suite"
  allowedArgs["-do"]="delete tests for functions now vacant from source"
  allowedArgs["--delete-ole"]="delete tests for functions now vacant from source"
  allowedArgs["-T"]="contemporises test TEMPLATE"

  usedArgs=[]
  todel=[]
  for ei,ea in enumerate(sys.argv):
    if ea in allowedArgs:
      todel.append(ei)
      spl=ea.split("-")
      short="-"
      for espl in spl:
        if espl != "":
          short=short+espl[0]
      usedArgs.append(short)

  offset=0
  for ea in todel:
    del sys.argv[ea-offset] #remove used argument, promoting all subsequent arguments
    offset+=1 # need to offset as with each del len(sys.argv) and subsequent indices reduce
  return usedArgs


def TOOLtoform(toform,instruction):
  if instruction == "print" or instruction == "p":
    formd=json.dumps(toform,indent=2,sort_keys=True)
    print(formd)
    #print(formd,"\n^^^^^^^^^^^^^^^\n")
    ret=0
  if instruction == "return" or instruction == "r":
    formd=json.dumps(toform,indent=2,sort_keys=True)
    ret=formd
  return ret


def onit():
#check for schema
#in schemaPropChk() if property missing from schema say so in property: 'missing property in schema.json'
  usedArgs=d_usedArgs()
  if "-T" in usedArgs:
    fn_oletemplate=sys.argv[1]
    fole=open(fn_oletemplate,"r")
    next(fole) #skip first line: alltests=;
    predict=""
    for line in fole:
      predict=predict+line
    ole_template=json.loads(predict)
    ole_template=contemporiseREQkeynewname(ole_template)
    TOOLtoform(ole_template,"p")
    wtemp="alltests =\n"+json.dumps(ole_template,indent=2,sort_keys=True)
    tempout = open("TEMPLATE_tests.json",'w')
    tempout.write(wtemp)
    tempout.close()
  else:
    if "-c" in usedArgs:
      fn_oletest=sys.argv[2]
      fole=open(fn_oletest,"r")
      next(fole) #skip first line: alltests=;
      predict=""
      for line in fole:
        predict=predict+line
      print(predict)
      oletest=json.loads(predict)
      print(json.dumps(oletest,indent=2,sort_keys=True))
      testtowrite=contemporise(testd,oletest)
      testtowrite=contemporiseREQkeynewname(testtowrite)
      #corview = open('tmp.corview','w')
      #wcor=json.dumps(testd,indent=2,sort_keys=False)
      #corview.write(wcor)
      #corview.close()
      writetofile(testtowrite)
    else:
      #corview = open('tmp.corview','w')
      #wcor=json.dumps(testd,indent=2,sort_keys=False)
      #corview.write(wcor)
      #corview.close()
      print("here?")
      testd=[]
      testd=corr(testd)
      testd[0]["meta"]["usedArgs"]=usedArgs
      testtowrite=createtest(testd)
      writetofile(testtowrite)
  try:
    call(["mkdir","./tmp/pymod"])
  except:
    pass
  call(["mv","corrjs.py","./tmp/pymod/"])
  call(["mv","getfrom.py","./tmp/pymod/"])
  call(["mv","pyesprima3.py","./tmp/pymod/"])
  #call(["rm","partsetedited.*.json"])
onit() #initiate

#draw from schema for types for full test possibilities
# use schema for test building in external schema.json file
### orhave at the top of the js file for broad reaching objects,
### or at the top of a function for ephemeral variables
#  //schema :: jsond
#  // {
#  // ae : INT,
#  // ea : STRING,
#  // hazzah : []
#  //schema ||
#
# NUM :: will test various ints -17,-1.7,0,3.4,34
# -INT :: will test negative INTS
# ..

print("..01x17")
#./composetestset.py --contemporise /home/cing/cinger/proj/pane/pane.js /home/cing/cinger/proj/pane/tests/tests.json
#./composetestset.py /home/cing/cinger/proj/cent/cent.js
