/*  Copyright (c) 2000, 2011, Oracle and/or its affiliates. All rights reserved. 
    ToolsRel: 8.52.07 */

function getScrollX()
{
  return document.body.scrollLeft;
}

function getScrollY()
{
  return document.body.scrollTop;
}

if (document.getElementById == null)
{
  document.getElementById = function(str) {return null;};
}