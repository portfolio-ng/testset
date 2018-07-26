#!/usr/bin/env python3
# takes a directory and concats all tests found therein

import sys
import json

def helper():
  print("  ")

def cmdLine(args):
  if len(args)==1:
    if args[1]=="-h" or args[1]=="--help":
      helper()
    else:
      direct=args[1]
      jsond=[]
      try:
        for fn in direct
          test=json.loads(open(fn,'r').read())
          jsond.append(test[0])
      except:
        print("  "+fn+": bad directory or invalid json files")
        helper()
  return jsond

def onit():
  jsond=cmdLine(sys.argv)
  print(jsond)
  else:
    helper()
  print(17)

if __name__=='__main__':
  onit()
print("..01x17")
#./implode.py DIR_NAME
