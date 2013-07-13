// Copyright (c) 2000, 2011, Oracle and/or its affiliates. All rights reserved.
// ToolsRel: 8.52.07
function PTImage(src)
{
	var temp = new Image();
	temp.onerror = function(){loadFailed = true;};
	temp.src = src;
	return temp;
}

var loadedImages = null;
var loadFailed = false;
var saveDateItems = null;
var _PS_popupCalendar;
var bLoaded = false;
function loadImages(dateitems)
{
if (document.images)
{
  saveDateItems = dateitems;
  loadedImages = new Array();
  loadedImages[0] = PTImage(dateitems.pt_dateheader);
  loadedImages[1] = PTImage(dateitems.pt_datering);
  loadedImages[2] = PTImage(dateitems.pt_datesel);
  loadedImages[3] = PTImage(dateitems.pt_prevmonth);
  loadedImages[4] = PTImage(dateitems.pt_nextmonth);
  loadedImages[5] = PTImage(dateitems.pt_daystitle_hijri);
  loadedImages[6] = PTImage(dateitems.pt_daystitle_s0);
  loadedImages[7] = PTImage(dateitems.pt_daystitle_m1);
  loadedImages[8] = PTImage(dateitems.pt_daystitle_t2);
  loadedImages[9] = PTImage(dateitems.pt_daystitle_w3);
  loadedImages[10] = PTImage(dateitems.pt_daystitle_t4);
  loadedImages[11] = PTImage(dateitems.pt_daystitle_f5);
  loadedImages[12] = PTImage(dateitems.pt_daystitle_s6);
  loadedImages[13] = PTImage(dateitems.pt_daystitle_thai);
  bLoaded = true;
}
}
var dateFormat;
var dateFieldToUpdate;
var promptField;
var submitAfter;
var formName;
var calendarRetry = 0;
var dateBoxOpen = false;

function openDate_win0(e,field,format,bsubmit,cal,firstDayOfWeek)
{
    if (bLoaded == false)
        LoadCalendar();
    if(dateBoxOpen) return;
	dateFieldToUpdate = e;
	formName = "win0";
	calendarType = cal;
	promptField = field;
	submitAfter=bsubmit;
	dateFormat = format;
	processing_win0(0);
	showCalendar_win0(field, format, '24', true,firstDayOfWeek);
	dateBoxOpen = true;
    //********************************* ICE 1904588000 *********************************
	
	var tablesize = document.getElementById("fullCalendar").offsetWidth - 5;
	var headSize = document.getElementById("headCalendar").offsetWidth;
	var iFullSize = parseInt(tablesize);
	var iHeadSize = parseInt(headSize);
	var iAdjust = iFullSize - iHeadSize;
	var strHeader;

	if('ltr' == 'ltr')
	// if('ltr' == 'ltr')
	{
		if(calendarType == "H")
		{
			var iCoord = parseInt("190")+iAdjust-0.1*iAdjust;
			var iImgWidth = parseInt("210")+iAdjust;
			var iCloseWidth = parseInt("205")+iAdjust-0.02*iAdjust;
		
		strHeader="<map name=map1ltr><area shape='rect' coords='"+iCoord+",1,"+iCloseWidth+",16' onclick='PTCalendar.closeWindow();' alt='Close' title='Close'/>"+"</map>" +  "<img usemap='#map1ltr' src="+loadedImages[0].src+" height='17' width='"+iImgWidth+"' border='0'>";
			}
		else
		{
			var iCoord = parseInt("195")+iAdjust-0.1*iAdjust;
			var iImgWidth = parseInt("215")+iAdjust;
			var iCloseWidth = parseInt("207")+iAdjust-0.02*iAdjust;
			strHeader="<map name=map1ltr><area shape='rect' coords='"+iCoord+",1,"+iCloseWidth+",16' onclick='PTCalendar.closeWindow();' alt='Close' title='Close'/>"+"</map>" +  "<img usemap='#map1ltr' src="+loadedImages[0].src+" height='17' width='"+iImgWidth+"' border='0'>";
			}
	}
	else
	{
		if(calendarType == "H")
		{
			var iCoord = parseInt("10")+iAdjust;
		        var iImgWidth = parseInt("210")+iAdjust;
		        var iCloseWidth = parseInt("22")+iAdjust;
		        
			strHeader="<map name=map1ltr><area shape='rect' coords='"+iCoord+",1,"+iCloseWidth+",16' onclick='PTCalendar.closeWindow();' alt='Close' title='Close'/>"+"</map>" +  "<img usemap='#map1ltr' src="+loadedImages[0].src+" height='17' width='"+iImgWidth+"' border='0'>";
			}
		else
		{
			var iCoord = parseInt("10")+iAdjust;
		        var iImgWidth = parseInt("215")+iAdjust;
		        var iCloseWidth = parseInt("22")+iAdjust;

			strHeader="<map name=map1ltr><area shape='rect' coords='"+iCoord+",1,"+iCloseWidth+",16' onclick='PTCalendar.closeWindow();' alt='Close' title='Close'/>"+"</map>" +  "<img usemap='#map1ltr' src="+loadedImages[0].src+" height='17' width='"+iImgWidth+"' border='0'>";
			}
		
	}
	
	document.getElementById("CalCloseHeader").innerHTML = "";           //ICE 1949169002
	document.getElementById("CalCloseHeader").innerHTML = strHeader;
	document.getElementById("fullCalendar").style.width = tablesize;
	document.getElementById("headCalendar").style.width = tablesize;
	document.getElementById("tailCalendar").style.width = tablesize * 0.8;
	
	//***********************************************************************************
}
function setResult_win0(dt)
{
	var obj = document.win0[dateFieldToUpdate];

	addchg_win0(obj);
	obj.value = pt_formatDate(dt, dateFormat, calendarType);
	PSclearError_win0(obj);
	closeCal();
	
	if (submitAfter)
	  submitAction_win0(obj.form,obj.name);
	else
	    if (typeof obj.onchange != "undefined" && typeof obj.onchange != "unknown" && obj.onchange)
	  {
	    obj.onchange();
	    PSshowDeferredMsg_win0();
	  }
	 dateBoxOpen=false;
	
	 // See if refresh RC service frame is needed
	if (typeof window.top.ptrc != "undefined" && window.top.ptrc != null)
    	 window.top.ptrc.refreshRCOnChangeIfNeeded(dateFieldToUpdate);
}

function closeCal()
{
	dateBoxOpen=false;
}

function closeCal2(obj)
{
    if (obj.id == promptField && "win0" == formName) return;      // Incident 1882152003
	if(_PS_popupCalendar != null)
		closeHandler(_PS_popupCalendar);
	dateBoxOpen=false;
}

function selected_win0(cal, date) {  
	if (cal.dateClicked )  
	{  

		if(cal.calType == "H")  
		{
			 var HijriDate = new window.HijriDate(date.getFullYear(),date.getMonth(),date.getDate()); 
		 	setResult_win0(HijriDate);
		} 
		 else
			setResult_win0(date);
		cal.destroy();  
	}
}
function closeHandler(cal)
 {
 	cal.destroy();
	_PS_popupCalendar = null;
}
function showCalendar_win0(id, format, showsTime, showsOtherMonths,firstdayofweek)
 {
	var fld = document.win0[dateFieldToUpdate];  
	var el = document.win0[id];   
	var cal = new PTCalendar(firstdayofweek, null, selected_win0, closeHandler);
	cal.weekNumbers = false; 
	cal.setRange(1900, 2070); 
	cal.create();
	_PS_popupCalendar = cal;
	var string = document.win0[dateFieldToUpdate].value;
	 var dt = getDate(string, dateFormat, calendarType);
	 _PS_popupCalendar.setDateFormat(format);   
	_PS_popupCalendar.parseDate(dt);      
	_PS_popupCalendar.sel = fld;                 
	_PS_popupCalendar.showAtElement(fld.nextSibling,"Br");     
	_PS_popupCalendar.setFirstDayOfWeek(firstdayofweek); 
	 _PS_popupCalendar = cal; 
	 return false;
}
window._PS_popupCalendar = null;
