var closetimer=0;
var xGPos_win0;
var yGPos_win0;
var sActFld;
var sActFldName;
var bDisableField = "false";
var bDisbledFieldLst="";
var sGlyphImgSrc="";
var sTblScrlLst_win0 ="";
var PrevScrollTop_win0 = new Array();
var PrevScrollLeft_win0 = new Array();
var hLst=[];
var cLst=[];
var tCTX=15,zCTX=1000,sCTX=6,aCTX;
var sGlyphList_win0="";
var raFormatedString = "";
var bIsPagelet_win0="false";
var sPageletName_win0="";
var nPgltTop_win0;
var nPgltLeft_win0;
var nPgltHeight_win0;
var nPgltWidth_win0;


NavigateRows = function(evt) {
    var objFrame =  window; //top.frames['TargetContent'];
    var ns6 = objFrame.document.getElementById&&!objFrame.document.all;
    var objSrc;
    if (ns6)
        objSrc= evt.target    
    else
        objSrc = event.srcElement;
    var EvCode = getKeyCode(evt);
    var bUpKey = false;
    var bDownKey = false;
    var bEnterKey = false;
    if (EvCode == "38")
        bUpKey = true;
    else if (EvCode == "40")
        bDownKey = true;
    else if (EvCode == "13")
        bEnterKey = true;
    else if (EvCode == "27")
        {
        HideContextMenu("FldCtxMenu");
        stopCTXEvent(evt);
        return;
        }
    else
        return;
    var sRowClass = objSrc.className;
    var objDiv= objFrame.document.getElementById("FldCtxMenu").firstChild;
    var tBody;
    if (ns6)
        tBody =   objDiv.childNodes[1];  
    else
        tBody = objDiv.childNodes[0];

    var nMenuCnt = tBody.childNodes.length;
    var objActRow;
    if (nCurRow != 0)
        {
        var objSrc =tBody.childNodes[nCurRow].childNodes[1].childNodes[0];
        var sCurRowCls = objSrc.className;

        if (bEnterKey)
            {
            if (objSrc.tagName == "A")
                {
                eval(objSrc.href);
                HideContextMenu("FldCtxMenu");
                }
            return; 
            }

        if (sRowClass.indexOf("HighLt")!= -1)
            {
            sRowClass = sRowClass.substr(0,sRowClass.indexOf("HighLt")-1);
            }
        objSrc.style.backgroundColor ="white";
        objSrc.className = sRowClass;

        if (nCurRow == nMenuCnt && bDownKey)
            {
            nActRow = 1;
            objActRow =tBody.childNodes[nActRow].childNodes[1].childNodes[0];
            }
        else if (nCurRow == 1 && bUpKey)
            {
            nActRow = nMenuCnt-1;
            objActRow =tBody.childNodes[nActRow].childNodes[1].childNodes[0];
            }
        else
            {
            var nTmpRow,nIncr;
            if (bUpKey)
            nIncr = - 1;
            else if (bDownKey)
            nIncr = 1;
            var nTmpRow = nCurRow + nIncr;
            if (nTmpRow == nMenuCnt)
            nTmpRow = 1;

            while  (true)
                {
                if (ns6)
                    {
                    var nLen = tBody.childNodes[nTmpRow].childNodes[1].childNodes.length;
                    objActRow = tBody.childNodes[nTmpRow].childNodes[1].childNodes[nLen-1];
                    }
                else
                    objActRow = tBody.childNodes[nTmpRow].childNodes[1].childNodes[0];
                var sActRowCls = objActRow.className;
                if ((sActRowCls == "PTCTXLnk") ||(sActRowCls == "PTCTXBRWLnk")||(sActRowCls == "PTCTXBRWLnkDis"))
                    {
                    nActRow = nTmpRow;
                    break;
                    }
                nTmpRow = nTmpRow + nIncr;  
                }
            }
        }
    else
        {
        if (bUpKey)
        nActRow = nMenuCnt-1;
        else if (bDownKey)
        nActRow = 1;
        objActRow =tBody.childNodes[nActRow].childNodes[1].childNodes[0];
        }

    objActRow.focus();
    objActRow.className += " HighLt";
    objActRow.style.backgroundColor = "#f9fea8";
    nCurRow = nActRow;
    stopCTXEvent(evt);
    }
    
doGetCaretPosition = function(InputField) {
var objFrame =  window; //top.frames['TargetContent'];
	var oField = objFrame.document.getElementById(InputField);
     var iCaretPos = 0;

     if (document.selection) {  //IE support
       oField.focus ();
       var oSel = document.selection.createRange ();
       oSel.moveStart ('character', -oField.value.length);
       iCaretPos = oSel.text.length;
     }

     
     else if (oField.selectionStart || oField.selectionStart == '0')// Firefox support
       iCaretPos = oField.selectionStart;

     return (iCaretPos);
   }
   
addEvent = function(el, evname, func) {
	if (el.attachEvent) { // IE
		el.attachEvent("on" + evname, func);
	} else if (el.addEventListener) { // Gecko / W3C
		el.addEventListener(evname, func, true);
	}
}	 
getAbsolutePos = function(el) {
	var x = 0, y = 0;	
	var e = el;	
	while(e) {
		x += e.offsetLeft || 0;
		y += e.offsetTop || 0;
		e = e.offsetParent;
	}
	return {x:x, y:y};
}

showGlyph = function (el, obj,p) {

	var s = obj.style;
	obj.className ="GlyphImg";
	p.x += el.offsetWidth;
    if ((el.type == "text" ||el.type == "password"|| el.tagName == "TD") && p.x>11)
	    p.x -= 10;
	else if (el.type == "select-one" && p.x>27)
	    p.x -= 28;
	s.left = p.x + "px";
	s.top = p.y + "px";

}


GenerateContextMenu_win0 = function(SrcEvt) {
var objFrame =  window; //top.frames['TargetContent'];
if (objFrame == null) return;
var nGPos = SrcEvt.indexOf("Glyph_");
if (nGPos != -1)
    {
    var sGlyphSrc = SrcEvt.substring(nGPos+6,SrcEvt.length);
    SrcEvt = sGlyphSrc;
    }

var nPos = SrcEvt.lastIndexOf("$");
var szBase = SrcEvt;
if (nPos != -1)
{
	if (nPos == SrcEvt.length-1)
		{
		szBase = SrcEvt;
		szBase += "$ctxmenu~"+ bIsPagelet_win0;
		}
	else
		{
		szBase = SrcEvt.substring(0,nPos);
		szBase += "$ctxmenu~"+ bIsPagelet_win0;
		szBase += SrcEvt.substring(nPos,SrcEvt.length);
		}
}
else
	szBase += "$ctxmenu~"+ bIsPagelet_win0;

CreateContextMenu_win0(szBase);
if (MOpopupObj_win0)
	MOpopupObj_win0.StopPopup("true");
}

onDocumentMouseDown_win0 = function(evt) {
var objFrame =  window; //top.frames['TargetContent'];
if (objFrame == null) return;
var ns6 = objFrame.document.getElementById&&!objFrame.document.all;
var SrcEvt="";
var xCoOrd,yCoOrd;

if (ns6)
    {
	if (evt.which == 1) return;
    xCoOrd = evt.clientX+objFrame.document.body.scrollLeft;
    yCoOrd = evt.clientY+objFrame.document.body.scrollTop;
    } 
else
    {
	if (event.button == 1) return;
    if (objFrame.event.x != 0 && objFrame.event.y != 0)
        {
        xCoOrd = objFrame.event.clientX+objFrame.document.body.scrollLeft;
        yCoOrd = objFrame.event.clientY+objFrame.document.body.scrollTop;
        }
    else
        {
        xCoOrd = objFrame.event.screenX;
        yCoOrd = objFrame.event.screenY - objFrame.screenTop;
        }
    }
    var elem = objFrame.document.elementFromPoint(xCoOrd, yCoOrd);
    if (bDisbledFieldLst != "" && elem!= null)
        {
        var CurElem = "^"+elem.id+"^";
        var nPos = bDisbledFieldLst.indexOf(CurElem);
        if (nPos != "-1")
            {
            objFrame.document.oncontextmenu =new Function ("return false");
            xGPos_win0 = xCoOrd;
            yGPos_win0 = yCoOrd;
            GenerateContextMenu_win0(elem.id);
            }
        }
}

onBuildContextMenu_win0 = function(evt) {
var objFrame =  window; //top.frames['TargetContent'];
if (objFrame == null) return;

var xPos,yPos;

var ns6 = objFrame.document.getElementById&&!objFrame.document.all;
var SrcEvt="";

if (ns6)
    {
	if ((evt.which == 1) && !(browserInfoObj2.isiPad && browserInfoObj2.isSafari)) return;
    SrcEvt = evt.target.id;
    xPos = evt.clientX+objFrame.document.body.scrollLeft;
    yPos = evt.clientY+objFrame.document.body.scrollTop;
    
    } 
else
    {
	if (event.button == 1) return;
    SrcEvt = objFrame.event.srcElement.id;
    xPos = objFrame.event.clientX+objFrame.document.body.scrollLeft;
    yPos = objFrame.event.clientY+objFrame.document.body.scrollTop;
    /*xPos = evt.x;
yPos = evt.y; */
    }
objFrame.document.oncontextmenu =new Function ("return false");
xGPos_win0 = xPos;
yGPos_win0 = yPos;
GenerateContextMenu_win0(SrcEvt);

}

CloseContextMenuHandler  = function(evt) {
if (closetimer) 
{
	clearTimeout(closetimer);
	closetimer = 0;
}

CloseContextMenu();
}

onFlipCursor = function(evt)
{
var objFrame =  window; //top.frames['TargetContent'];
if (objFrame == null) return;
var ns6 = objFrame.document.getElementById&&!objFrame.document.all;
var srcEvtElement;
var SrcEvtID="";

if (ns6)
    srcEvtElement = evt.target;
else
    srcEvtElement = objFrame.event.srcElement;
if (srcEvtElement.nodeName == "SPAN")
{
SrcEvtID = srcEvtElement.id;
objFrame.document.getElementById(SrcEvtID).style.cursor = "pointer";
}
}

HideContextMenu = function(menuID)
{
nCurRow = 0;
if ((typeof(menuID) == 'undefined') || (menuID == 'undefined')) return;
var objFrame =  window; //top.frames['TargetContent'];
if (objFrame == null) return;
glyphmenuitem = objFrame.document.getElementById(menuID);
if (glyphmenuitem == null) return;
ptEvent.remove(glyphmenuitem, "mouseover", ClearContextMenuTimer);
ptEvent.remove(glyphmenuitem, "mouseout", CloseContextMenuHandler);
ptEvent.remove(document, "keydown", NavigateRows);

if (glyphmenuitem != null)
    {
	var parent = objFrame.document.getElementsByTagName("body")[0];
	parent.removeChild(glyphmenuitem);	
    }

if (closetimer)
    {
    clearTimeout(closetimer); 
    closetimer = null;
    }
objFrame.document.oncontextmenu="return true";
sActFldName = "";
}

KeyDownHandler_win0 = function(evt)
{
if (isAltKey(evt) && getKeyCode(evt) == 186)
    {
var objFrame =  window; //top.frames['TargetContent'];
if (objFrame == null) return;
objFrame.document.oncontextmenu =new Function ("return false");
    var ns6 = objFrame.document.getElementById&&!objFrame.document.all;
    var SrcEvt="";

    if (ns6)
        SrcEvt = evt.target.id;
    else
        SrcEvt = objFrame.event.srcElement.id;
	var objEvt = objFrame.document.getElementById(SrcEvt);
    EvtPos = getAbsolutePos(objEvt);
    var nCaretPos=0;
    if (objEvt.tagName.toUpperCase() == "INPUT")
        nCaretPos = doGetCaretPosition(SrcEvt);
    xGPos_win0 = EvtPos.x+nCaretPos;
    yGPos_win0 = EvtPos.y;

    GenerateContextMenu_win0(SrcEvt);
    }
}

CloseContextMenu = function(sParentId)
{

/*var MenuId;
MenuId = "HideContextMenu('";
MenuId += glyphMenuID;
MenuId += "')";
closetimer = setTimeout(MenuId, 300); */
if (typeof(sParentId) == 'undefined') 
    sParentId="win0divPAGECONTAINER";
    
var sCntr = sParentId;
var index = sParentId.indexOf("$$");
if (index > 1) {
    var temp;
    temp = sParentId.substring(0, sParentId.indexOf('$'));
    sCntr = temp;
}
sIDOpenMenu= sCntr + "$$" + "DROPDOWNNAME1" + String.fromCharCode(127) + "#rt#$";


glObjTr.removePrevMenu(sIDOpenMenu);


}

ClearContextMenuTimer= function()
{
if (closetimer)
    {
    clearTimeout(closetimer); 
    closetimer = null;
    }
}

refreshGlyph = function (strLst,nScrlLeft,nScrlTop,nPrevScrollLeft,nPrevScrollTop,bScrollGrid) {
HideGlyph(strLst);
var nScrlTopVal = 0;
if (nPrevScrollTop < nScrlTop)
    nScrlTopVal =  -nScrlTop;
else
    {
    if (nScrlTop == 0)
        nScrlTopVal = nScrlTop;
    else
	nScrlTopVal =  - nScrlTop ;
    }
var nScrlLeftVal = 0;
if (nPrevScrollTop < nScrlLeft)
    nScrlLeftVal =  -nScrlLeft;
else
    {
    if (nScrlLeft == 0)
        nScrlLeftVal = nScrlLeft;
    else
		nScrlLeftVal =  - nScrlLeft ;
    }
    
GenerateGlyph_win0 (sGlyphImgSrc,strLst,nScrlLeftVal,nScrlTopVal,bScrollGrid);
}

onGridScroll_win0 = function (evt) {
var objFrame =  window; //top.frames['TargetContent'];
var e_out;
var ie_var = "srcElement";
var moz_var = "target";
var prop_var = "onScroll";
// "target" for Mozilla, Netscape, Firefox et al. ; "srcElement" for IE
evt[moz_var] ? e_out = evt[moz_var][prop_var] : e_out = evt[ie_var][prop_var];
var ns6 = objFrame.document.getElementById&&!objFrame.document.all;
var nScrlTop = 0;
var nScrlLeft = 0;
var srcElem;
if (!ns6) 
{
    srcElem = evt.srcElement.id;
    nScrlTop = evt.srcElement.scrollTop;
    nScrlLeft = evt.srcElement.scrollLeft;
}
else
{
    srcElem = evt.target.id;
    nScrlTop = evt.target.scrollTop;
    nScrlLeft = evt.target.scrollLeft;
}

var nPrevScrollTop = PrevScrollTop_win0[srcElem];
var nPrevScrollLeft = PrevScrollLeft_win0[srcElem];

var bLeft = false;
if ((typeof(nPrevScrollTop) == 'undefined') || (typeof(nPrevScrollLeft) == 'undefined'))
    {
    if (nScrlLeft != 0)
        bLeft = true; 
    }
else if ((nPrevScrollTop == nScrlTop) && (nScrlLeft != nPrevScrollTop))
    bLeft = true; 

PrevScrollTop_win0[srcElem] = nScrlTop;
PrevScrollLeft_win0[srcElem] = nScrlLeft;
var sGlyphImageList = e_out;
var sGrdUnFrozenLst = sGlyphImageList;
if (bLeft)
    {
    sGrdUnFrozenLst = "";
    var flist = sGlyphImageList.split("^");
    for (j = 1; j < flist.length; j++) 
        { // start from array index 1 (as index 0 is blank)
        if (flist[j].indexOf("$scrollF$") == -1)
            {
            sGrdUnFrozenLst += "^";
            sGrdUnFrozenLst += flist[j];
            }
        }
    }

if (sGrdUnFrozenLst != "")
    refreshGlyph(sGrdUnFrozenLst,nScrlLeft,nScrlTop,nPrevScrollLeft,nPrevScrollTop,"true");

}

GenerateGlyphImage = function(elID, nTabIndex,strImgSrc,strGlyph,nScrlLeftVal,nScrlTopVal,bPageRefresh) {

var nPos = elID.indexOf("~");
var sGridFld="";
var grHeight = 0;
var grWidth = 0;
if (nPos != -1)
	{
	sGridFld = elID.substring(nPos+1,elID.length-1)
	elID = elID.substring(0,nPos);
	}
var objFrame =  window; //top.frames['TargetContent'];
var el = objFrame.document.getElementById(elID);
if (el == null) return false;
if (el.tagName.toUpperCase() == "SPAN")
    {
    var sHTML = el.innerHTML;
    sHTML = sHTML.replace(/&nbsp;/gi,"");
    if (sHTML.length == 0) return;
    }
if (!((el.tagName.toUpperCase() == "SPAN")||((el.tagName.toUpperCase() == "INPUT") && (el.type == "text" ||el.type == "password")) ||(el.tagName.toUpperCase() == "SELECT")))
    return;
if (sGridFld != "" && (el.tagName.toUpperCase() == "SPAN"))
    el = el.offsetParent;

var parent = objFrame.document.getElementsByTagName("body")[0];

var glyphImgId = "Glyph_"+elID;
if (objFrame == null) return false;
var elImg = objFrame.document.getElementById(glyphImgId);
if (elImg!=null) 
parent.removeChild(elImg);

var pElementPos = getAbsolutePos(el);
if ((pElementPos.x<=0 ) || (pElementPos.y <= 0)) return false; 

if ((typeof (bPageRefresh) == "undefined") || (bPageRefresh == "false"))
{
	var sScrl = "$scroll";    
	if (sGridFld != "" && ((sGridFld.indexOf("$scroll")!= -1) || (sGridFld.indexOf("$scrollF")!= -1)))
		{
		var sParentGdFld = sGridFld;
		var elG = objFrame.document.getElementById(sParentGdFld);
		if (elG == null)
		    {
		    if (sGridFld.indexOf("$scrollF")!= -1)
		        sScrl = "$scrollF";
	    
		    sParentGdFld = sParentGdFld.replace(sScrl,"$scrollm");
		    elG = objFrame.document.getElementById(sParentGdFld);
		    }
		if (elG == null)
		    {
		    sParentGdFld = sParentGdFld.replace("$scrollm","$scrolli");
		    elG = objFrame.document.getElementById(sParentGdFld);
		    }
		if (elG == null) return false;

		var pParentGridPos = getAbsolutePos(elG);
		grHeight = pParentGridPos.y + elG.offsetHeight;
		grWidth = pParentGridPos.x + elG.offsetWidth;
		}



	if ((typeof(nScrlTopVal) == 'undefined') || (nScrlTopVal == 'undefined'))
	    nScrlTopVal = 0;
	else if (nScrlTopVal == 0)
	    nScrlTopVal = PrevScrollTop_win0["divgbr"+sGridFld];
	if ((typeof(nScrlTopVal) == 'undefined') || (nScrlTopVal == 'undefined'))
	    nScrlTopVal = 0;    
	if ((typeof(nScrlLeftVal) == 'undefined') || (nScrlLeftVal == 'undefined'))
	    nScrlLeftVal = 0;
	else if (nScrlLeftVal == 0)
	    nScrlLeftVal = PrevScrollLeft_win0["divgbr"+sGridFld];
	if ((typeof(nScrlLeftVal) == 'undefined') || (nScrlLeftVal == 'undefined'))
	    nScrlLeftVal = 0;
    

	pElementPos.y += nScrlTopVal;
	if (sGridFld.indexOf("$scrollF") == -1)
	    pElementPos.x += nScrlLeftVal;
	var sTmpGrdFld = "divgbr"+sGridFld;
	sTmpGrdFld = sTmpGrdFld.replace(sScrl,"");
	if (sTblScrlLst_win0.indexOf("^"+sGridFld) == -1)
	    {
	    sTblScrlLst_win0 += "^";
	    sTblScrlLst_win0 += sGridFld;
		elG = objFrame.document.getElementById(sTmpGrdFld);
		if (elG == null)
		    {
		    sTmpGrdFld = "divgbl"+sGridFld;
		    elG = objFrame.document.getElementById(sTmpGrdFld);
		    }

	    if (elG != null)
	        {
	        if (typeof(elG.onScroll) == 'undefined')
	            {
	            var flist = strGlyph.split("^");
	            var sGrdFldLst="";
	            for (j = 1; j < flist.length; j++) { // start from array index 1 (as index 0 is blank)
	            if (flist[j].indexOf("~"+sGridFld+"~") != -1)
	                {
	                sGrdFldLst += "^";
	                sGrdFldLst += flist[j];
	                }
	             }
	            ptEvent.add(elG, "scroll", onGridScroll_win0);
	            elG.onScroll = sGrdFldLst;
	            }
	        else
	            {
	            var sScroll = elG.onScroll;
	            if (sScroll.indexOf("^"+elID) == -1)
	                {
	                var flist = strGlyph.split("^");
	                var sGrdFldLst="";
	                for (j = 1; j < flist.length; j++) { // start from array index 1 (as index 0 is blank)
	                if (flist[j].indexOf("~"+sGridFld+"~") != -1)
	                    {
	                    sGrdFldLst += "^";
	                    sGrdFldLst += flist[j];
	                    }
	                 }
	                elG.onScroll += sGrdFldLst;
	                }
	            }
	        }
		}
	
	if ((grHeight > 0 &&(pElementPos.y >= grHeight || pElementPos.y+el.offsetHeight >= grHeight)) ||
	    (grWidth > 0 &&(pElementPos.x >= grWidth || pElementPos.x+el.offsetWidth >= grWidth)))
	         return false;

	if ((el.offsetParent != null) && (el.offsetParent.offsetParent != null))
	    sTmpGrdFld = el.offsetParent.offsetParent.id;

	if (sTmpGrdFld != "")
	    elG = objFrame.document.getElementById(sTmpGrdFld);
	var pGridPos = getAbsolutePos(elG);
	if ((pElementPos.y < pGridPos.y) || (pElementPos.x+el.offsetWidth < pGridPos.x))return false;
	}
else
	{
	pElementPos.x = pElementPos.x - nScrlLeftVal;
	pElementPos.y = pElementPos.y - nScrlTopVal;
    
	}
if (((pElementPos.y < nPgltTop_win0) || (pElementPos.y > nPgltHeight_win0)) ||
    ((pElementPos.x+el.offsetWidth < nPgltLeft_win0) || (pElementPos.x > nPgltWidth_win0)))
    
    return false;
var GlImgObj = objFrame.document.createElement("img");
GlImgObj.src = strImgSrc;
GlImgObj.tabIndex=nTabIndex;
GlImgObj.id=glyphImgId;

parent.appendChild(GlImgObj);

if (el.getAttribute("disabled"))
    {
    bDisableField = "true";
    bDisbledFieldLst+="^";
    bDisbledFieldLst+=elID;
    bDisbledFieldLst+="^";
    ptEvent.add(document, "mousedown", onDocumentMouseDown_win0);
        
    }
ptEvent.add(GlImgObj, "mousedown", onBuildContextMenu_win0);
if (browserInfoObj2.isiPad && browserInfoObj2.isSafari) 
	ptEvent.add(GlImgObj, "touchstart", onBuildContextMenu_win0);
ptEvent.add(el, "mousedown", onBuildContextMenu_win0);
//ptEvent.add(el, "mouseout", CloseContextMenuHandler);
ptEvent.add(el, "keyup", KeyDownHandler_win0);
ptEvent.add(GlImgObj, "keyup", KeyDownHandler_win0);
ptEvent.add(GlImgObj, "mouseover", onFlipCursor);
ptEvent.add(el, "mouseover", onFlipCursor);
ptEvent.add(parent, "unload", onUnload);



showGlyph(el,GlImgObj,pElementPos);
	
}

HideGlyph = function(strGlyph, oWin)
    {
if (typeof oWin == 'undefined') oWin = window;
    var objFrame =  oWin; //top.frames['TargetContent'];
	if (objFrame == null) return;
	var parent = objFrame.document.getElementsByTagName("body")[0];
    var el = strGlyph.split("^");
    for(i = 1;i<el.length;i++)
        {
        var sFld = el[i];
        var nPos = sFld.indexOf("$$");
        var nTabIndex;
        var sFldName = sFld;
        if (nPos != -1)
            sFldName = sFld.substring(0,nPos);
        nPos = sFldName.indexOf("~");
        if (nPos != -1)
            sFldName = sFld.substring(0,nPos);
        var glyphImgId = "Glyph_"+sFldName;
        var elID = objFrame.document.getElementById(sFldName);
        var glElm = objFrame.document.getElementById(glyphImgId);
        if (glElm != null)
            parent.removeChild(glElm);	
        }
    //sGlyphList = "";
    }


GenerateGlyph_win0 = function(strImgSrc,strGlyph,nScrlLeftVal,nScrlTopVal,bScrollGrid,bPageRefresh)
    {

    if ((typeof(strGlyph) != 'undefined') && strGlyph && strGlyph !='' && (typeof(bScrollGrid) == 'undefined'))
        sGlyphList_win0 = strGlyph;
    else
        strGlyph = sGlyphList_win0;

    sGlyphImgSrc = strImgSrc;
    sTblScrlLst_win0 =""
    var el = strGlyph.split("^");
    for(i = 1;i<el.length;i++)
        {
        var sFld = el[i];
        var nPos = sFld.lastIndexOf("$$");
        var nTabIndex;
        var sFldName = sFld;
        if (nPos != -1)
            {
            sFldName = sFld.substring(0,nPos);
            nTabIndex = parseInt(sFld.substring(nPos+2,sFld.length),10);
            }
        GenerateGlyphImage(sFldName,nTabIndex,strImgSrc,strGlyph,nScrlLeftVal,nScrlTopVal,bPageRefresh);
        }
// If it's a pagelete, subscribe for onscrollEvent
	if (bIsPagelet_win0 == "true" && sPageletName_win0 != "")
		{
		var objFrame =  window; //top.frames['TargetContent'];
		var sPgltID = "ptalPgltBodyDiv_"+sPageletName_win0;
		var el = objFrame.document.getElementById(sPgltID);
		if (el)
			ptEvent.add(el, "scroll", onDivScroll_win0);
		EvtPos = getAbsolutePos(el);
		nPgltTop_win0 = EvtPos.y;
		nPgltLeft_win0 = EvtPos.x;
		nPgltHeight_win0 = el.offsetHeight;
		nPgltWidth_win0 = el.offsetWidth;
		}
    }


ExecuteBrwMnuOpt = function(sFldName,nOpt) {
var objFrame =  window; //top.frames['TargetContent'];
if (objFrame == null) return;
var doc = objFrame.document.getElementById(sFldName);
var cp;
if (doc.tagName.toUpperCase() == "INPUT")
 {
cp = doc.createTextRange();
if (sSelText != "")
cp.findText(sSelText);
}
else
cp = objFrame.document.selection.createRange();
if (sSelText != "")
cp.findText(sSelText);
if (nOpt == "1")
    cp.execCommand("Cut");
else if (nOpt == "2")
    cp.execCommand("Copy");
else if (nOpt == "3")
    cp.execCommand("Paste");
else if (nOpt == "4")
    cp.execCommand("Delete");
}

PTCTXCreateElement = function(type, parent) {
	var el = null;
	if (document.createElementNS) {
		el = document.createElementNS("http://www.w3.org/1999/xhtml", type);
	} else {
		el = document.createElement(type);
	}
	if (typeof parent != "undefined") {
		parent.appendChild(el);
	}

	el.style.zIndex = 999;

	return el;
}

ConstructContextMenu_win0 = function(sFldName,sMenu,sMenuType,sParentID,sTop,sLeft,sParams){

var nLeft,nTop;
if (sMenuType == "3")
    {
    nLeft = 0;
    nTop = 0;
    if (typeof(sTop) == "undefined" ||  sTop == "" )
        {
        if (typeof(xGPos_win0) !== "undefined")
        nTop = xGPos_win0;
        }
    else
        nTop = parseInt(sTop);
    nLeft = 0;
    if (typeof(sLeft) == "undefined" ||  sLeft == "" )
        {
        if (typeof(yGPos_win0) !== "undefined")
        nLeft = yGPos_win0;
        }
    else
        nLeft = parseInt(sLeft);        
	    
	glObjTr.showActionMenu("win0divPAGECONTAINER",nTop,nLeft,5,3,sMenu,"DROPDOWNNAME1");
	}
else
	{
	nLeft = parseInt(sLeft);
	nTop = parseInt(sTop);
	nParams = parseInt(sParams);
	glObjTr.showActionMenu(sParentID,nTop,nLeft,nParams,5,sMenu,"DROPDOWNNAME1");
	}
return;  
//if iPad ICE 2029817000- support to close context menu with glyph image in iPad
if (browserInfoObj2.isiPad && browserInfoObj2.isSafari) {
    var spanArray = document.getElementById("FldCtxMenu").getElementsByTagName("span");
    if (spanArray.length > 0){
        var striPad = "<img src='/cs/ps/cache/PT_PORTAL_IC_CLOSE_1.gif' onclick='CloseContextMenuHandler();'>";
        spanArray[0].innerHTML = spanArray[0].innerHTML + striPad;
        }
    }
  
}

InvokeAppCls = function(sFldName,nRow)
{
var nPos = sFldName.lastIndexOf("$");
var szBase = sFldName;
if (nPos != -1)
    {
    if (nPos == sFldName.length-1)
        {
        szBase = sFldName;
        szBase += "$APPCLS#ICRow"+nRow;
        }
    else
        {
        szBase = sFldName.substring(0,nPos);
        szBase += "$APPCLS#ICRow"+nRow;
        szBase += sFldName.substring(nPos,sFldName.length);
        }
    }
else
    szBase = sFldName+"$APPCLS#ICRow"+nRow;

submitAction_win0(document.win0,szBase);
}

InvokePageAppCls = function(sServname)
{
var sAppServname = "$APPCLS#"+sServname;
submitAction_win0(document.win0,sAppServname);
}

stopCTXEvent = function(ev) {
ev || (ev = window.event);
var objFrame =  window; //top.frames['TargetContent'];
var ns6 = objFrame.document.getElementById&&!objFrame.document.all;
if (!ns6) {
ev.cancelBubble = true;
ev.returnValue = false;
} else {
ev.preventDefault();
ev.stopPropagation();
}
return false;
}
onUnload = function(ev) {
if(bDisableField)
    ptEvent.remove(document, "mousedown", onDocumentMouseDown_win0);
PrevScrollTop_win0 = null;
PrevScrollLeft_win0 = null;
}

function initMenu(p,c){

    var objFrame =  window; 
	aCTX=c; var w=document.getElementById(p), sCTX=w.getElementsByTagName('ul'), l=sCTX.length, i=0;
	for(i;i<l;i++){
		var h=sCTX[i].parentNode; hLst[i]=h; cLst[i]=sCTX[i];
	
		h.onmouseover=new Function("sh("+i+",true)");
		h.onmouseout=new Function("sh("+i+")");
	}
	}
	
function sh(x,f)
{
var c=cLst[x], h=hLst[x], p=h.getElementsByTagName('a')[0];
clearInterval(c.tCTX); c.style.overflow='hidden';
if(f){
    var b = 0;
	p.className+=' '+aCTX;
	if(!c.mh){c.style.display='block'; c.style.height=''; c.mh=c.offsetHeight; c.style.height=0;c.style.visibility = 'visible';}
	if(c.mh==c.offsetHeight){c.style.overflow='visible';c.style.visibility = 'visible';}
	else{c.style.zIndex=zCTX; zCTX++; c.tCTX=setInterval(function(){sl(c,1)},tCTX)}
}
else
{p.className=p.className.replace(aCTX,'');c.tCTX=setInterval(function(){sl(c,-1)},tCTX)}
}

	function sl(c,f){
		var h=c.offsetHeight;
		if((h<=0&&f!=1)||(h>=c.mh&&f==1)){
			if(f==1){c.style.filter=''; c.style.opacity=1; c.style.overflow='visible'}
			clearInterval(c.tCTX); return
		}
		else if (f == -1)
		{
		    c.style.visibility = 'hidden';
		    clearInterval(c.tCTX); return
		}
		var d=(f==1)?Math.ceil((c.mh-h)/sCTX):Math.ceil(h/sCTX), o=h/c.mh;
		c.style.opacity=o; c.style.filter='alpha(opacity='+(o*100)+')';
		c.style.height=h+(d*f)+'px';
	}
	
ResetGlyph_win0 = function()
{
if (sGlyphList_win0 != "")
	HideGlyph(sGlyphList_win0);
}

CreateContextMenu = function(sFieldName,nRowOcc,nType,sParentID, nLeft, nTop, nParametrs,sFormName,sMenuFldName) {
if (typeof(nRowOcc) == "undefined" && typeof(nType) == "undefined" &&
	typeof(sParentID) == "undefined" && typeof(nLeft) == "undefined" &&
	typeof(nTop) == "undefined" && typeof(nParametrs) == "undefined" )
	{
	submitAction_win0(document.win0,sFieldName);
	}
else
	{
    if (typeof(sMenuFldName) != "undefined" && sMenuFldName != null && sMenuFldName != "")
        {
        var objEvt = window.document.getElementById(sMenuFldName);
        var objEvt1 = window.document.win0[sMenuFldName];
        if (objEvt)
            {	
            EvtPos = getAbsolutePos(objEvt);
            var nElemHeight = objEvt.offsetHeight;
            nLeft = EvtPos.x;
            nTop = EvtPos.y+nElemHeight;
            }
        }
    sFieldName += "$ctxmenu~"+ bIsPagelet_win0;
    if (typeof(nType) == "undefined" || nType == "")
        sFieldName += "~3"
    else
        sFieldName += "~"+nType;
    if (typeof(sParentID) == "undefined" || sParentID == "")
        sFieldName += "~"
    else
        sFieldName += "~"+sParentID;
    if (typeof(nLeft) == "undefined" || nLeft == "")
        sFieldName += "~"
    else
        sFieldName += "~"+nLeft;
    if (typeof(nTop) == "undefined" || nTop == "")
        sFieldName += "~"
    else
        sFieldName += "~"+nTop;
    if (typeof(nParametrs) == "undefined" || nParametrs == "")
        sFieldName += "~0"
    else
        sFieldName += "~"+nParametrs;	 
    if (typeof(nRowOcc) != "undefined" && nRowOcc != null && nRowOcc != "" && nRowOcc != "-1")
        sFieldName += "$"+nRowOcc;	 	       	    	    	    
    if (typeof(sFormName) != "undefined" && sFormName!= null && sFormName != "")
        {
        var sSubmit = "submitAction_"+sFormName+"(document."+sFormName+",sFieldName)";
        eval(sSubmit);
        }
    else
        submitAction_win0(document.win0,sFieldName);
    }
}

// Search related Actions functions
var raClickPos = {x:0, y:0};

// setRAActionUrl
setRAActionUrl = function(srchUrl)
{		
	var elemUrl = document.getElementById("GSrchRaUrl");	
	if (elemUrl)
		elemUrl.value = srchUrl;
}

// process related actions reponse text
processRelatedActionsResponse = function(respText, fldId)
{
	if (!respText) 
		return;

    var xmlDoc = null;
    var bIsHomePage = false;
    if (typeof(top.searchGbl) !== "undefined") {
        bIsHomePage = top.searchGbl.isHomepage;
    }
    if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(respText);
    }
    else {
       var parser=new DOMParser();
       xmlDoc = parser.parseFromString(respText, "text/xml");
    }

    if (xmlDoc) {
		var scriptList = xmlDoc.getElementsByTagName("GENSCRIPT");
        if (scriptList) {
        	for (var i=0; i < scriptList.length; i++) {
            	eval(scriptList[i].firstChild.data);
            }
        }

        var absCord = {x:0,y:0}; 
        var referenceObj = document.getElementById(fldId); 
        if (!referenceObj) { 
            referenceObj = window.top.document.getElementById(fldId); 
            if (referenceObj) { 
                absCord.x = referenceObj.offsetLeft; 
                absCord.y = referenceObj.offsetTop; 
            } 
        } else { 
            absCord = ptCommonObj2.getAbsolutePosition(referenceObj); 
        } 

        if (glObjTr) { 
            if (referenceObj) 
                glObjTr.showActionMenu(fldId, absCord.x, absCord.y + referenceObj.offsetHeight, 5, 4, raFormatedString, 'DROPDOWNNAME1'); 
            else 
                glObjTr.showActionMenu(fldId, absCord.x, absCord.y, 5, 4, raFormatedString, 'DROPDOWNNAME1'); 
        } else {
            alert('glObjTr is null');
        }
    } else {
        alert('xmldoc is null');
    }

    document.win0.ICAction.value = ""; 
}

// handle related actions click
getRelatedActions = function(srchUrl, fldId)
{
	var elem = document.getElementById(fldId);
	var prevCursor = elem.style.cursor;
	elem.style.cursor="wait";	
	// setRAActionUrl(srchUrl);
	// submitAction_win0(document.win0, fldId);

	var doclocation = document.location.href;
	var actionurl = doclocation;
	var index = doclocation.indexOf('/h/?');
	if (index > 0) {
        actionurl = doclocation.replace('/h/?', '/c/PORTAL_ADMIN.PTSF_GLOBAL_SEARCH.GBL?');
		doclocation = actionurl;
	}
	var index = doclocation.indexOf('?');
	if (index > 0) {
		actionurl = doclocation.substr(0, index);
	}


	// http://rtdc79500vmc.us.oracle.com/psc/ps/EMPLOYEE/QE_LOCAL/c/PORTAL_ADMIN.PTSF_GLOBAL_SEARCH.GBL
	// http://rtdc79500vmc.us.oracle.com/psp/ps/Remote_Portal/HCM_Node/c/PORTAL_ADMIN.PTSF_GLOBAL_SEARCH.GBL?cmd=smartnav

	var bRemoteRA = true;
	var respText = "";
	raFormatedString = "";

	// parse local url and srch url
	var localURLArr= actionurl.split('/');
	var srchURLArr= srchUrl.split('/');

	// get local host
	var localHost = localURLArr[2];

	//get srchUrl host
	var srchUrlHost = srchURLArr[2];

	// if both hosts are different
	if ((localHost.length == srchUrlHost.length) && (localHost.indexOf(srchUrlHost) == 0))
		bRemoteRA = false;

	var tmpActionUrl = actionurl;
	var origUrl = actionurl;

	if (bRemoteRA) {
		// replace psc to psp
		actionurl = tmpActionUrl.replace('\/psc\/', '\/psp\/');

		// get local portal name
		var portalName = localURLArr[5];

		// get remote portal name
		var remotePortalName = srchURLArr[5];

		// replace local portal name in url to remote portal name	
		tmpActionUrl = actionurl.replace(portalName, remotePortalName);

		// get local env's default local node
		var localNodeName = localURLArr[6];
	
		// get remote env's default local node
		var remoteNodeName = srchURLArr[6];
	
		// replace local node name in url to remote node name	
		actionurl = tmpActionUrl.replace('\/' + localNodeName + '\/', '\/' + remoteNodeName + '\/');

		document.win0.ICAction.value = fldId;

		// add smartnav req param
		// tmpActionUrl = actionurl.concat('?cmd=uninav');
		tmpActionUrl = actionurl.concat('?cmd=smartnav');

		actionurl = tmpActionUrl.concat('&ICAction=' + fldId);
		tmpActionUrl = actionurl.concat('&GSrchRaUrl=' + encodeURIComponent(srchUrl));
		actionurl = tmpActionUrl.concat('&ICAJAX=1');

		var xmlHttpReq = false;
	
		// Mozilla/Safari
		if (window.XMLHttpRequest) { 
			  xmlHttpReq = new XMLHttpRequest();
		} 
		// IE
		else if (window.ActiveXObject) {
			  xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlHttpReq.open('POST', actionurl, true);
		xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlHttpReq.onreadystatechange = function() {
			if (xmlHttpReq.readyState == 4) {
				respText = xmlHttpReq.responseText;
				processRelatedActionsResponse(respText, fldId);
			    elem.style.cursor = prevCursor;
			}
		}
		xmlHttpReq.send(null);    
	} else {
		document.win0.ICAction.value = fldId;

		tmpActionUrl = actionurl.concat('?ICAction=' + fldId);
		actionurl = tmpActionUrl.concat('&GSrchRaUrl=' + encodeURIComponent(srchUrl));
		tmpActionUrl = actionurl.concat('&ICAJAX=1');
		actionurl = tmpActionUrl;

		// url,form,name,method,onload,onerror,params,contentType,bAjax,bPrompt,headerArray,isAsync,sXMLResponse)
		// sLoader.req.responseXML, sLoader.req.responseText
		var sLoader = new net2.ContentLoader(actionurl, document.win0, fldId, null,
						function() {
							respText = this.req.responseText;
							processRelatedActionsResponse(respText, fldId);
			    			elem.style.cursor = prevCursor;
						}, null, null, "application/x-www-form-urlencoded", 
						true, false, null, false, null);

		if (respText == "") {
			respText = sLoader.req.responseText;
			processRelatedActionsResponse(respText, fldId);
			elem.style.cursor = prevCursor;
		}
	}
}
setPageletInfoInCtxmenu_win0 = function(isPagelet,sPgltName)
{
if (isPagelet == "false")
	bIsPagelet_win0 = "false";
else
	bIsPagelet_win0 = "true";
if (typeof(sPgltName) != "undefined" && sPgltName!= null && sPgltName != "")
	sPageletName_win0 = sPgltName;
else
	sPageletName_win0 = "";

}


CreateContextMenu_win0 = function(sFieldName) {
submitAction_win0(document.win0,sFieldName);
}

onDivScroll_win0 = function(evt) {
//var s = s.len();
var objFrame =  window; //top.frames['TargetContent'];

var viewportHeight = ptCommonObj.getViewportHeight();            // viewable height
var viewportWidth = ptCommonObj.getViewportWidth();              // viewable width
if (sGlyphList_win0 != "")
	HideGlyph(sGlyphList_win0);


var e_out;
var ie_var = "srcElement";
var moz_var = "target";
var prop_var = "onScroll";
var ns6 = objFrame.document.getElementById&&!objFrame.document.all;
var nScrlTop = 0;
var nScrlLeft = 0;
var srcElem;
if (!ns6) 
{
    srcElem = evt.srcElement.id;
    nScrlTop = evt.srcElement.scrollTop;
    nScrlLeft = evt.srcElement.scrollLeft;
}
else
{
    srcElem = evt.target.id;
    nScrlTop = evt.target.scrollTop;
    nScrlLeft = evt.target.scrollLeft;
}

GenerateGlyph_win0 (sGlyphImgSrc,sGlyphList_win0,nScrlLeft,nScrlTop,"false","true");
}
