PTCalendar = function (firstDayOfWeek, dateStr, onSelected, onClose) {
	this.calType = calendarType;
	this.activeDiv = null;
	this.currentDateEl = null;
	this.timeout = null;
	this.onSelected = onSelected || null;
	this.onClose = onClose || null;
	this.hidden = false;
	this.minYear = 1970;
	this.maxYear = 2050;
	this.dateFormat = null;
	this.isPopup = true;
	this.weekNumbers = true;
	this.firstDayOfWeek = typeof firstDayOfWeek == "number" ? firstDayOfWeek : 0;
	this.ar_days = null;
	this.hiliteToday = true;
	this.multiple = null;
	this.showsOtherMonths = false;
	// HTML elements
	this.table = null;
	this.Headertable = null;
	this.element = null;
	this.tbody = null;
	this.firstdayname = null;
	// Combo boxes
	this.monthsCombo = null;
	this.yearsCombo = null;
	this.hilitedMonth = null;
	this.activeMonth = null;
	this.hilitedYear = null;
	this.activeYear = null;
	// Information
	this.dateClicked = false;
	this.firstDayOfMonth=0;
	this.CellSel = null;
	this.TodayCell = null;
};
PTCalendar._C = null;
PTCalendar.is_ie = ( /msie/i.test(navigator.userAgent) &&
		   !/opera/i.test(navigator.userAgent) );
PTCalendar.is_ie5 = ( PTCalendar.is_ie && /msie 5\.0/i.test(navigator.userAgent) );
PTCalendar.is_opera = /opera/i.test(navigator.userAgent);
PTCalendar.is_khtml = /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
PTCalendar.getAbsolutePos = function(el) {
	var SL = 0, ST = 0;
	var is_div = /^div$/i.test(el.tagName);
	if (is_div && el.scrollLeft)
		SL = el.scrollLeft;
	if (is_div && el.scrollTop)
		ST = el.scrollTop;
	var r = { x: el.offsetLeft - SL, y: el.offsetTop - ST };
	if (el.offsetParent) {
		var tmp = this.getAbsolutePos(el.offsetParent);
		r.x += tmp.x;
		r.y += tmp.y;
	}
	return r;
};

PTCalendar.removeClass = function(el, className) {
	if (!(el && el.className)) {
		return;
	}
	var cls = el.className.split(" ");
	var ar = new Array();
	for (var i = cls.length; i > 0;) {
		if (cls[--i] != className) {
			ar[ar.length] = cls[i];
		}
	}
	el.className = ar.join(" ");
};

PTCalendar.addClass = function(el, className) {
	PTCalendar.removeClass(el, className);
	el.className += " " + className;
};


PTCalendar.getElement = function(ev) {
	var f = PTCalendar.is_ie ? window.event.srcElement : ev.currentTarget;
	while (f.nodeType != 1 || /^div$/i.test(f.tagName))
		f = f.parentNode;
	return f;
};

PTCalendar.getTargetElement = function(ev) {
	var f = PTCalendar.is_ie ? window.event.srcElement : ev.target;
	while (f.nodeType != 1)
		f = f.parentNode;
	return f;
};

PTCalendar.stopEvent = function(ev) {
	ev || (ev = window.event);
	if (PTCalendar.is_ie) {
		ev.cancelBubble = true;
		ev.returnValue = false;
	} else {
		ev.preventDefault();
		ev.stopPropagation();
	}
	return false;
};

PTCalendar.addEvent = function(el, evname, func) {
	if (el.attachEvent) { // IE
		el.attachEvent("on" + evname, func);
	} else if (el.addEventListener) { // Gecko / W3C
		el.addEventListener(evname, func, true);
	} else {
		el["on" + evname] = func;
	}
};

PTCalendar.removeEvent = function(el, evname, func) {
	if (el.detachEvent) { // IE
		el.detachEvent("on" + evname, func);
	} else if (el.removeEventListener) { // Gecko / W3C
		el.removeEventListener(evname, func, true);
	} else {
		el["on" + evname] = null;
	}
};

PTCalendar.createElement = function(type, parent) {
	var el = null;
	if (document.createElementNS) {
		// use the XHTML namespace; IE won't normally get here unless
		// _they_ "fix" the DOM2 implementation.
		el = document.createElementNS("http://www.w3.org/1999/xhtml", type);
	} else {
		el = document.createElement(type);
	}
	if (typeof parent != "undefined") {
		parent.appendChild(el);
	}

	el.style.zIndex = 350;

	return el;
};

// END: UTILITY FUNCTIONS

// BEGIN: CALENDAR STATIC FUNCTIONS

/** Internal -- adds a set of events to make some element behave like a button. */
PTCalendar._add_evs = function(el) {
	with (PTCalendar) {
		addEvent(el, "click", dayMouseClick);
		addEvent(el, "dblclick", dayMouseDblClick);
		if (is_ie) {
			//addEvent(el, "dblclick", dayMouseDblClick);
			el.setAttribute("unselectable", true);
		}
	}
};

// event handlers

PTCalendar.tableMouseDown = function (ev) {
	if (PTCalendar.getTargetElement(ev) == PTCalendar.getElement(ev)) {
		return PTCalendar.stopEvent(ev);
	}
};


PTCalendar.dayMouseClick = function(ev) {
	var cal = _PS_popupCalendar;
	if(cal!= null)
	{
		if(PTCalendar.getElement(ev).disabled == true)
			return;
		cal.dateClicked=true;
		PTCalendar.cellClick(PTCalendar.getElement(ev), ev || window.event);
		if (PTCalendar.is_ie) document.selection.empty();
	}
};

PTCalendar.dayMouseDblClick = function(ev) {
	var cal = _PS_popupCalendar;
	cal.dayMouseClick(ev);
};

PTCalendar.closeWindow = function() {
	dateBoxOpen = false;
    var cal = window._PS_popupCalendar;
	if(cal!=null)
    	cal.callCloseHandler();
       
};

PTCalendar.HandleInnercell = function() {
	var cal = _PS_popupCalendar;
	if(cal!=null)
	{
		var cell1 = cal.TodayCell;
		cal.dateClicked=true;
		PTCalendar.cellClick(cell1, cell1 || window.event);
	}
	
};

PTCalendar.previousMonth = function() {
	prevMonth(0);
};
PTCalendar.nextMonth = function() {
	nextMonth(0)
};
PTCalendar.toDay = function() {
var date = new Date();
callHandler();
};
PTCalendar.MonthChanged = function() {
	var cal = window._PS_popupCalendar;
	var mon = cal.monthsCombo.selectedIndex;
	cal.dateClicked = false;
	selectMonth(mon);
};

PTCalendar.YearChanged = function() {
	var cal = window._PS_popupCalendar;
    var date = null;
	cal.dateClicked = false;
	if(cal.calType =="H")
	{
		date = new window.HijriDate(cal.date.year,cal.date.month,cal.date.day);
		date.year =cal.yearsCombo.selectedIndex+1321;
	}
	else
	{
		date = new Date(cal.date);
		var nYearIndex = cal.yearsCombo.selectedIndex+1900;
		if(cal.calType =="T") 
		    nYearIndex+=543;
		date.PT_setFullYear(nYearIndex);
	}
	cal.callHandler();
	cal.setDate(date);
};

PTCalendar.SelectToday = function() {
    var date = null;
    var date1 = null;
	var cal = window._PS_popupCalendar;
    cal.dateClicked=true;
	if(cal.calType =="H")
	{
		var Hijridate = new window.HijriDate();
		date = new Date(Hijridate.year,Hijridate.month,Hijridate.day);
		date1 = date;
	}
	else
		date = new Date();	
	cal.setDate(date);
	if(cal.calType =="H")
		cal.date = date1;
	cal.callHandler();
	cal.callCloseHandler();
};

//MERGED FROM PT_CALENDARSCRIPT2

/**
 *  A generic "click" handler :) handles all types of buttons defined in this
 *  calendar.
 */
PTCalendar.cellClick = function(el, ev) {
	var closing = false;
	var newdate = false;
	var date = null;
	var cal = el.PTCalendar;
	if (typeof el.navtype == "undefined") {
			if (cal.currentDateEl) {
                var cell = cal.CellSel;
                cell.background="";
				var bToday = false;
                var TodayDate;
				if(cal.calType == "H")
				{
					var todate = new window.HijriDate();
					TodayDate = todate.day;
					if(todate.day == el.calday && todate.month == el.calMonth && todate.year == el.calYear)
						bToday = true;
				}
				else
				{
					var todate = new Date();
					TodayDate = todate.getDate();
					if(todate.getDate() == el.calday && todate.getMonth() == el.calMonth && todate.getFullYear() == el.calYear)
					{
						bToday = true;
					}
				} 
						
				cell.style.backgroundRepeat = "no-repeat"; 
				
				if(cal.CellSel == cal.TodayCell)
				{
					cell.style.background  = "url('"+loadedImages[1].src+"')";
					cell.style.backgroundRepeat = "no-repeat"; 
					cell.innerHTML ="<a style='font-weight:bold; text-decoration:none;color:black;width:19;height:19;padding: 1.45px 2px 2px 2px;'>"+TodayDate+"</a>";
				}
				else
				{
					cell.style.background = "";
					cell.style.fontWeight ="normal";
				}
				el.style.background  = "url('"+loadedImages[2].src+"')";
				el.style.backgroundRepeat = "no-repeat";
				el.style.fontWeight ="normal";
				if(bToday == true)
				{
					if( PTCalendar.is_ie == false)
					{
						el.style.background  = "url('"+loadedImages[1].src+"')";
						el.style.textAlign  = 'left';
						el.style.backgroundRepeat = "no-repeat";
						if(el.calday<10)
							el.innerHTML ="<a style='font-weight:bold;background:url("+loadedImages[2].src+"); text-decoration:none;color:black;width:19;height:19;padding: 1.45px 7.5px 2px 2px;'>"+el.calday+"</a>";
						else
							el.innerHTML ="<a style='font-weight:bold;background:url("+loadedImages[2].src+"); text-decoration:none;color:black;width:19;height:19;padding: 1.45px 2px 2px 2px;'>"+el.calday+"</a>";
					}
					else
						el.innerHTML ="<a style='font-weight:bold;background:url("+loadedImages[1].src+"); repeat-x 100% 100%;text-align: center; text-decoration:none;color:black;width:19;height:19;'>"+el.calday+"</a>";
					
				}
				else
				{
					el.style.fontWeight ="Bold";
					el.style.background = "url('"+loadedImages[2].src+"')";
				}
            
                cal.CellSel = el;
				PTCalendar.removeClass(cal.currentDateEl, "PT_CALselected");
				PTCalendar.addClass(el, "PT_CALselected");
				closing = (cal.currentDateEl == el);
				if (!closing) {
					cal.currentDateEl = el;
				}
		   }
			if(cal.calType == "H")
			{
			cal.date = new Date(el.calYear,el.calMonth,el.calday);
			}
 
        cal.date.setDateOnly(el.calday,el.calMonth,el.calYear);
        cal.day = el.calday;
		cal.month = el.calMonth;
		cal.year = el.calYear;
		newdate =true;
		date = cal.date;
	}
	if (newdate) {
		cal.dateClicked=true;
		ev && cal.callHandler();
	}
	ev && cal.callCloseHandler();
};

// END: CALENDAR STATIC FUNCTIONS

// BEGIN: CALENDAR OBJECT FUNCTIONS
PTCalendar.prototype.create = function (_par) {
	var parent = null;
	if (! _par) {
		// default parent is the document body, in which case we create
		// a popup calendar.
		parent = document.getElementsByTagName("body")[0];
		this.isPopup = true;
	} else {
		parent = _par;
		this.isPopup = false;
	}

	var table1 = PTCalendar.createElement("table");
	this.Headertable = table1;
    table1.setAttribute("id","tailCalendar");       //ICE 1904588000
	table1.cellSpacing = 0;
	table1.cellPadding = 0;
	table1.style.fontSize = "11px";
	table1.PTCalendar = this;

	var thead1 = PTCalendar.createElement("thead", table1);
	var cell = null;
	var row = null;
	row = PTCalendar.createElement("tr", thead1);
	row.style.backgroundColor =  "white";		

	cell = PTCalendar.createElement("td", row);
	var spVar="";
/*	for(i=0;i<14;i++)
	  spVar+="&nbsp;";*/
	for(i=0;i<16;i++)
	  spVar+="&nbsp;";
    cell.innerHTML = spVar; 
	cell = PTCalendar.createElement("td", row);
	//cell.classname = "PT_CALlbutton";
	cell.style.textAlign  = 'left';
	cell.style.width = "4px";
	cell.style.height = "2px";

	cell.PTCalendar = cal;
	PTCalendar.addEvent(cell, "click", PTCalendar.previousMonth);
	var prevMonth = PTCalendar.createElement("img");
	prevMonth.src = loadedImages[3].src;
	prevMonth.alt = 'Previous Month';
	prevMonth.title= prevMonth.alt;
	cell.appendChild(prevMonth);
	var LeftSpaceCell = PTCalendar.createElement("td", row);
	LeftSpaceCell.innerHTML = "&nbsp;&nbsp;";
	cell = PTCalendar.createElement("td", row);
	var cellLink = PTCalendar.createElement("td", row);
	cellLink.align = "center";
	cellLink.valign = "Top";
	var HyperElem = document.createElement("a"); 
	HyperElem.setAttribute("href",'Javascript:PTCalendar.SelectToday()');
	var strCurrentDate = 'Current Date';
	HyperElem.appendChild(document.createTextNode(strCurrentDate));
	cellLink.appendChild(HyperElem);
	var RightSpaceCell = PTCalendar.createElement("td", row);
	RightSpaceCell.innerHTML = "&nbsp;&nbsp;";

	cell = PTCalendar.createElement("td", row);
	var NextMonth = PTCalendar.createElement("img");
	NextMonth.src = loadedImages[4].src;
	NextMonth.alt = 'Next Month';
	NextMonth.title = NextMonth.alt;
	cell.appendChild(NextMonth);
	cell.calendar = cal;
	PTCalendar.addEvent(cell, "click", PTCalendar.nextMonth);
	cell = PTCalendar.createElement("tr", row);
	for (var i = 5; i > 0; --i) {
	row2 = PTCalendar.createElement("tr", row);}

	var table = PTCalendar.createElement("table");
	this.table = table;
    table.setAttribute("id","bodyCalendar");        //ICE 1904588000
	table.cellSpacing = 0;
	table.cellPadding = 0;
	table.style.fontSize = "11px";
	table.PTCalendar = this;
	table.dir = 'ltr';
	PTCalendar.addEvent(table, "mousedown", PTCalendar.tableMouseDown);
	PTCalendar.addEvent(table1, "mousedown", PTCalendar.tableMouseDown);

	var div = PTCalendar.createElement("div");
	this.element = div;
    div.setAttribute("id","fullCalendar");      //ICE 1904588000
	//div.className = "PT_CAL";
	div.style.borderTop = "2px";
	div.style.borderBottom = "2px";
	div.style.borderLeft = "2px";
	div.style.borderRight = "2px";
	div.style.borderStyle ="solid";
	div.style.borderColor ="#797979";
	div.style.backgroundColor =  "white";
	div.style.position="absolute";
	

	if (this.isPopup) {
		div.style.position = "absolute";
		div.style.display = "none";
	}
	

    var table2 = PTCalendar.createElement("table");
    table2.setAttribute("id","headCalendar");       //ICE 1904588000
	table2.cellSpacing = 0;
	table2.cellPadding = 0;
	table2.style.fontSize = "11px";
	table2.dir = 'ltr';
	var thead2 = PTCalendar.createElement("thead", table2);
	var cell2 = null;
	
	var row = null;
	row = PTCalendar.createElement("tr", thead2);
	row.style.backgroundColor =  "white";		
	var strHeader;
	if(table2.dir == 'ltr')
	{
		if(this.calType == "H")
			strHeader="<map name=map1ltr><area shape='rect' coords='190,1,210,18' onclick='PTCalendar.closeWindow();' alt='Close' title='Close'/>"+"</map>" +  "<img usemap='#map1ltr' src="+loadedImages[0].src+" height='17' width='210' border='0'>";
		else
			strHeader="<map name=map1ltr><area shape='rect' coords='195,1,205,18' onclick='PTCalendar.closeWindow();' alt='Close' title='Close'/>"+"</map>" +  "<img usemap='#map1ltr' src="+loadedImages[0].src+" height='17' width='215' border='0'>";
	}
	else
	{
		if(this.calType == "H")
			strHeader="<map name=map1ltr><area shape='rect' coords='10,1,20,18' onclick='PTCalendar.closeWindow();' alt='Close' title='Close'/>"+"</map>" +  "<img usemap='#map1ltr' src="+loadedImages[0].src+" height='17' width='210' border='0'>";
		else
			strHeader="<map name=map1ltr><area shape='rect' coords='10,1,20,18' onclick='PTCalendar.closeWindow();' alt='Close' title='Close'/>"+"</map>" +  "<img usemap='#map1ltr' src="+loadedImages[0].src+" height='17' width='215' border='0'>";
		
	}
	cell = PTCalendar.createElement("td", row);
    cell.innerHTML = strHeader; 
    cell.id = "CalCloseHeader";     //ICE 1904588000

	div.appendChild(table2);	
	div.appendChild(table);
	div.appendChild(table1);
	
	
	var thead = PTCalendar.createElement("thead", table);
	var cell = null;
	var row = null;
	var cal = this;
	var CreateCell = function (text, cs, navtype) {
	    cell = PTCalendar.createElement("td", row);
		cell.colSpan = cs;
		cell.PTCalendar = cal;
		cell.navtype = navtype;
		var bCreateButton = 0;
        var src;	
		//	cell.className = "PT_CALbutton";
		cell.style.textAlign  = 'center';
		cell.style.width = "4px";
		cell.style.height = "2px";
		cell.style.fontWeight = 'bold'; 
		/*if (navtype != 0 && Math.abs(navtype) <= 2)
			cell.className += " nav";*/
	
        if (text=="WeekHeader")
		{
		    var ImageIdx = 6+cal.firstDayOfWeek;
		    src = loadedImages[ImageIdx].src;
			bCreateButton = 1;
		}
		if(bCreateButton == 1  )
		{
			
			var obj = PTCalendar.createElement("img", row);
			obj.src = src;
			text = '';
			cell.appendChild(obj);
			cell.navtype = navtype;
		
		}
		else if (bCreateButton == 0  )
		{
		
			cell.innerHTML = "<div unselectable='on'>" + text + "</div>";
		}

		return cell;
	};
	
	row = PTCalendar.createElement("tr", thead2);
	for (var i = 5; i > 0; --i) {
		row2 = PTCalendar.createElement("tr", thead2);
	}

	row = PTCalendar.createElement("tr", thead2);
	var title_length = 15;
	(this.isPopup) && --title_length;
	this.weekNumbers = true;
	(this.weekNumbers) && ++title_length;

	this.title = CreateCell("Title", title_length, 400);
	//this.title.className = "PT_CALtitle";
	this.title.style.fontWeight = 'bold';
	this.title.style.textAlign  = 'center';
	this.title.style.padding = "4px";

	row = PTCalendar.createElement("tr", thead);
	
	for (var i = 5; i > 0; --i) {
		row2 = PTCalendar.createElement("tr", thead);
	}

	row2 = PTCalendar.createElement("tr", thead);
	row = PTCalendar.createElement("tr", thead);

	if (this.weekNumbers) {
		cell = PTCalendar.createElement("td", row);
		//cell.className = "PT_CALname wn";
		cell.style.textAlign  = 'center';
		cell.style.padding = "1px";
		cell.style.color = '#fff'; 

	}

	this.firstdayname = (this.weekNumbers) ? row.firstChild.nextSibling : row.firstChild;

	row = PTCalendar.createElement("tr", thead);

	CreateCell("",1,1);
    //CreateCell("WeekHeader", 10, 1);

    //create week header
    var daystitle = new Array();
    daystitle[0] = "S";
    daystitle[1] = "M";
    daystitle[2] = "T";
    daystitle[3] = "W";
    daystitle[4] = "T";
    daystitle[5] = "F";
    daystitle[6] = "S";
    
    var daystitle_idx = -1 + cal.firstDayOfWeek;

    for (var i=0; i<7; i++) {
        daystitle_idx = daystitle_idx + 1;
    if (daystitle_idx> 6 ) {
        daystitle_idx = -1;
    daystitle_idx = daystitle_idx + 1;  }
    
    cell = PTCalendar.createElement("td", row);   
	cell.style.textAlign  = 'center';
    cell.style.padding = "1px";   
    cell.bgColor ="#A0CFEC"; 
    cell.innerHTML = daystitle[daystitle_idx] ;
    }
    //end create week header

    for (var i = 5; i > 0; --i)
		row2 = PTCalendar.createElement("tr", thead);

	var tbody = PTCalendar.createElement("tbody", table);
	this.tbody = tbody;

	for (i = 6; i > 0; --i) {
		row = PTCalendar.createElement("tr", tbody);
		if (this.weekNumbers) {
			cell = PTCalendar.createElement("td", row);
		}
		var noDays = 7;
		for (var j = noDays; j > 0; --j) {
			cell = PTCalendar.createElement("td", row);
			cell.PTCalendar = this;
			PTCalendar._add_evs(cell);
			}
	}

	row = PTCalendar.createElement("tr", tbody);

	var tfoot = PTCalendar.createElement("tfoot", table);
	row = PTCalendar.createElement("tr", tfoot);
	for (i = 6; i > 0; --i) {
	row2 = PTCalendar.createElement("tr", tfoot);
	}
	parent.appendChild(this.element);
};


function prevMonth(step) {
	NavigateMonth(-1,step);
};

function nextMonth(step) {
	NavigateMonth(1,step);
};

function NavigateMonth(monDir,step)
{
	var cal = window._PS_popupCalendar;
	cal.TodayCell = null;
	cal.dateClicked = false;
	var objCnt = document.getElementsByTagName("select").length;
	var objMonth =null;
	var objYear =null;
	for (var i = 0; i <objCnt;i++) {
	var objSelect = document.getElementsByTagName("select")[i];
	if(objSelect != null)
		{
		if(objSelect.name == 'PTMonth')
			objMonth = objSelect;
		else if(objSelect.name == 'PTYear')
			objYear = objSelect;
		}
		if(objMonth != null && objYear != null) break;

	}
	var date;
	if(cal.calType == "H")
		date = new window.HijriDate(cal.year,cal.month,cal.day);
	else
		date = new Date(cal.date);
	if(monDir==-1)
	{
		if(objMonth != null)
		{
			if(objMonth.selectedIndex>0)
				objMonth.selectedIndex = objMonth.selectedIndex-1;
			else
			{
				objMonth.selectedIndex = 11;
				if(objYear != null)
				objYear.selectedIndex = objYear.selectedIndex-1;
			}
		}

		if(step == 0)
		{
			var mon;
			if(cal.calType == "H")
				mon= date.month;
			else
				mon= date.getMonth();
			if(mon == 0)
			{
				mon =11;
				selectMonth(mon,-1);
			}
			else
				selectMonth(mon - 1);
		}
		else
		{
		   var yr,mn,day;
			if(cal.calType =="H")
			{
				date.day=cal.day;
				date.month = cal.month;
				date.year = cal.year;
				date.adjustDay(-step);
				cal.day = date.day;
				cal.month = cal.calmonth = date.month;
				cal.year = cal.calYear = date.year;
				 
			}
			else
			{
				date = cal.date;
				date.setDate(date.getDate() - step);
				day = date.getDate();
				mn = date.getMonth();
				yr = date.getFullYear();
			}
			cal.setDate(date);
		}
	}
	else
	{
		if(objMonth != null)
		{
			if(objMonth.selectedIndex<11)
				objMonth.selectedIndex = objMonth.selectedIndex+1;
			else
			{
				objMonth.selectedIndex = 0;
				if(objYear != null)
				objYear.selectedIndex = objYear.selectedIndex+1;
			}
		}
		if(step == 0)
		{
			var mon;
			if(cal.calType == "H")
				mon= date.month;
			else
				mon= date.getMonth();
			if(mon == 11)
			{
				mon =0;
				selectMonth(mon,1);
			}
			else
				selectMonth(mon+1);
		}
		else
		{
			if(cal.calType =="H")
			{
				date.day=cal.day;
				date.month = cal.month;
				date.year = cal.year;
				date.adjustDay(step);
				cal.day = date.day;
				cal.month = cal.calmonth = date.month;
				cal.year = cal.calYear = date.year;
			}
			else
			{
                date = cal.date;
				date.setDate(date.getDate() + step);
				cal.calmonth = date.getMonth();
				cal.calYear = date.getFullYear();
			}
			cal.setDate(date);
		}

	}
}


function selectMonth(Month,year) {
	var cal = window._PS_popupCalendar;
	if(cal.calType == "H")
	{
		var date = new window.HijriDate(cal.year,cal.month,cal.day);
		date.day = cal.day;
		var day = date.day;
		var max = date.daysOfMonth();
		if (day > max) {
			date.day=max;
		}
		date.month = Month;
		if(year == -1)
		{
			var yr=date.year-1;
			date.year =yr;
		}
		else if(year == 1)
		{
			var yr=date.year+1;
			date.year =yr;
		}
		cal.setDate(date);

	}
	else
	{
		var date = new Date(cal.date);
		var day = date.getDate();
		var max = date.getMonthDays(Month);
		if (day > max) {
			date.setDate(max);
		}
		date.setMonth(Month);
		var yr=date.getFullYear();
		if(year == -1)
			yr--;
		else if(year == 1)
			yr++;
		date.PT_setFullYear(yr);
		cal.setDate(date);
	}
	cal.dateClicked=false;
	cal.callHandler();
}

//MERGED FROM PT_CALENDARSCRIPT3

/** keyboard navigation, only for popup calendars */
PTCalendar._keyEvent = function(ev) {
	var cal = window._PS_popupCalendar;
	if (!cal || cal.multiple)
		return false;
	(PTCalendar.is_ie) && (ev = window.event);
	var act = (PTCalendar.is_ie || ev.type == "keypress"),
		K = ev.keyCode;

	if (ev.ctrlKey) {
		switch (K) {
		    case 37: // KEY left
			act && PTCalendar.cellClick(cal._nav_pm);
			break;
		    case 38: // KEY up
			act && PTCalendar.cellClick(cal._nav_py);
			break;
		    case 39: // KEY right
			act && PTCalendar.cellClick(cal._nav_nm);
			break;
		    case 40: // KEY down
			act && PTCalendar.cellClick(cal._nav_ny);
			break;
		    default:
			return false;
		}
	} else switch (K) {
	    case 27: // KEY esc
		act && cal.callCloseHandler();
		break;
	    case 37: // KEY left
	    case 38: // KEY up
	    case 39: // KEY right
	    case 40: // KEY down
		if (act) {
		
			var prev, x, y, ne, el, step;
			prev = K == 37 || K == 38;
			step = (K == 37 || K == 39) ? 1 : 7;
			function setVars() {
				el = cal.currentDateEl;
				var p = el.pos;
				x = p & 15;
				y = p >> 4;
				ne = cal.ar_days[y][x];
			};setVars();
			
			while (1) {
				switch (K) {
				    case 37: // KEY left
					if (--x >= 0)
						ne = cal.ar_days[y][x];
					else {
						x = 6;
						K = 38;
						continue;
					}
					break;
				    case 38: // KEY up
					if (--y >= 0)
						ne = cal.ar_days[y][x];
					else {
						prevMonth(7);
						setVars();
					}
					break;
				    case 39: // KEY right
					if (++x < 7)
						ne = cal.ar_days[y][x];
					else {
						x = 0;
						K = 40;
						continue;
					}
					break;
				    case 40: // KEY down
					if (++y < cal.ar_days.length)
						ne = cal.ar_days[y][x];
					else {
						nextMonth(7);
						setVars();
					}
					break;
				}
				break;
			}
			if (ne) {
			
				if (!ne.disabled)
				{
					PTCalendar.cellClick(ne);
					}
				else 
				{
					if(K == 37 || K == 39)
						step = 1;
					else if(K == 38 || K == 40)
						step = 7;

					if (prev)
				       prevMonth(step);
				    else
					   nextMonth(step);
				}
			}
		}
		break;
	    case 13: // KEY enter
		if (act)
		{
		
			PTCalendar.cellClick(cal.currentDateEl, ev);
		}
		break;
	    default:
		return false;
	}
	return PTCalendar.stopEvent(ev);
};
/**
 *  (RE)Initializes the calendar to the given date and firstDayOfWeek
 */
PTCalendar.prototype._init = function (firstDayOfWeek, date) {
	var today,TY,TM,TD,SrcDay;
	var year,month,mday,no_days;

	if(this.calType == "H")
	{
		today = new window.HijriDate();
		TY = today.year;
		TM = today.month;
		TD = today.day;
		var srcDate = new window.HijriDate(date.year,date.month,date.day);
		SrcDay = srcDate.day;
		year = srcDate.year;
		month = srcDate.month;
		mday = srcDate.day;
		no_days = srcDate.daysOfMonth();
		var startJul = window.HijriToJulian(year,month,1);
		var startGregorian = window.JulianToGregorian(startJul);
		this.firstDayOfMonth = 	startGregorian.getDay();
		this.date = new window.HijriDate(year,month,mday);
	}
	else
	{
		today = new Date();
		TY = today.getFullYear();
		TM = today.getMonth();
		TD = today.getDate();
		//SrcDate = new Date(date);
		SrcDay = date.getDate();
		year = date.getFullYear();
		var year = date.getFullYear();
		if ((this.calType == "T") && (year < this.minYear)) year = year + 543;      //bug 11867135
		if (year < this.minYear) {
			year = this.minYear;
			date.PT_setFullYear(year);
		} else if (year > this.maxYear) {
			year = this.maxYear;
			date.PT_setFullYear(year);
		}	
		month = date.getMonth();
		mday = date.getDate();
		no_days = date.getMonthDays();
		this.date = new Date(date);
		date.setDate(1);
		this.firstDayOfMonth = date.getDay();
	}
	
	this.table.style.visibility = "hidden";
	this.firstDayOfWeek = firstDayOfWeek;
	var day1 = (this.firstDayOfMonth - this.firstDayOfWeek) % 7;
    var currentDate = 1;
	if (day1 < 0)
		day1 += 7;
	var row = this.tbody.firstChild;
	var ar_days = this.ar_days = new Array();
	var dates = this.multiple ? (this.datesCells = {}) : null;
	for (var i = 0; i < 6; ++i, row = row.nextSibling) {
		var cell = row.firstChild;
		cell.style.backgroundImage = "";
		if (this.weekNumbers) {
				cell.style.width="1.6em";
				cell.style.textAlign  = 'left';
				cell.style.paddingTop = "1px";
				cell.style.paddingRight = "2px";
				cell.style.paddingBottom = "1px";
				cell.style.paddingLeft = "1px";

			cell = cell.nextSibling;
			
		}
		var hasdays = false, iday, dpos = ar_days[i] = [];
			for (var j = 0; j < 7; ++j, cell = cell.nextSibling) {
			if(this.calType =="H")
				if(currentDate> 31) break;
    			var sBorderCls="";
				cell.style.fontFamily = 'Arial, sans-serif';
				cell.style.width="19";
				cell.style.height="19";
				cell.style.color = '#000';
				cell.style.textAlign  = 'center';
				cell.style.paddingTop = "2px";
				cell.style.paddingRight = "3px";
				cell.style.paddingBottom = "3px";
				cell.style.paddingLeft = "2px";
				cell.style.fontWeight ="normal";
				if( PTCalendar.is_ie == true)
					cell.style.cursor='hand';

			if(PTCalendar.is_khtml == true)
				{
					cell.style.paddingRight = "4px";
					cell.style.paddingBottom = "2px";
				}
            	if(i==0 && j<7)
				{
					cell.style.borderTop = "1px";
					cell.style.borderBottom = "0px";
					cell.style.borderLeft = "0px";
					cell.style.borderRight = "0px";
					cell.style.borderStyle ="solid";
					cell.style.borderColor ="#797979";

				}
				if(j==0)
				{
					if(i!=0)
						cell.style.borderTop = "0px";
					else
						cell.style.borderTop = "1px";

					cell.style.borderBottom = "0px";
					if(this.table.dir == 'ltr')
					{
						cell.style.borderLeft = "1px";
						cell.style.borderRight = "0px";
					}
					else
					{
						cell.style.borderLeft = "0px";
						cell.style.borderRight = "1px";
					}

					cell.style.borderStyle ="solid";
					cell.style.borderColor ="#797979";

				}


				if(j>0 && j%6==0)
				{
					cell.style.borderBottom = "0px";
					if(i!=0)
						cell.style.borderTop = "0px";
					else
						cell.style.borderTop = "1px";
					if(this.table.dir == 'ltr')
					{
						cell.style.borderLeft = "0px";
						cell.style.borderRight = "1px";
					}
					else
					{
						cell.style.borderLeft = "1px";
						cell.style.borderRight = "0px";
					}
					cell.style.borderStyle ="solid";
					cell.style.borderColor ="#797979";
				}


				if(i==5&& j<7)
				{
					cell.style.borderTop = "0px";
					cell.style.borderBottom = "1px";
					if(j!=0) {
			 			if(this.table.dir == 'ltr')					
						   cell.style.borderLeft = "0px";					
					    else					
						   cell.style.borderRight = "0px";
					    }
                    else {
		                if(this.table.dir == 'ltr')					
						   cell.style.borderLeft = "1px";									
					    else									
						   cell.style.borderRight = "1px";
					 }
					if(j>0 && j%6==0) {
			           if(this.table.dir == 'ltr')
					    	cell.style.borderRight = "1px";
                       else
					    	cell.style.borderLeft = "1px"; }
                    else {
                         if(this.table.dir == 'ltr')
						    cell.style.borderRight = "0px";
                         else
						    cell.style.borderLeft = "0px";
                    }
					cell.style.borderStyle ="solid";
					cell.style.borderColor ="#797979";

				}
			cell.pos = i << 4 | j;
			dpos[j] = cell;
			var current_month = true;
			if(day1>0)
			{
				current_month = false;
				day1--;
			}
			if (!current_month) {
				
				cell.style.backgroundImage = "";
				cell.style.fontFamily = "Arial, sans-serif";
				cell.style.width="19px";
				cell.style.height="19px";
				cell.style.color = "#000000";
				cell.style.textAlign  = "center";
				cell.style.paddingTop = "2px";
				cell.style.paddingRight = "3px";
				cell.style.paddingBottom = "3px";
				cell.style.paddingLeft = "2px";
				cell.innerHTML = "&nbsp;";
				cell.disabled = true;
				continue;
			
			} else {
				cell.otherMonth = false;
				hasdays = true;
			}
			cell.disabled = false;
			if(currentDate>no_days)
			{
			    cell.style.backgroundImage = "";
				cell.style.fontFamily = "Arial, sans-serif";
				cell.style.width="19px";
				cell.style.height="19px";
				cell.style.color = "#000000";
				cell.style.textAlign  = "center";
				cell.style.paddingTop = "2px";
				cell.style.paddingRight = "3px";
				cell.style.paddingBottom = "3px";
				cell.style.paddingLeft = "2px";
				cell.innerHTML = "&nbsp;";
				cell.disabled = true;
				continue;
			}
			if( PTCalendar.is_ie == false)
				cell.innerHTML ="<a href = 'javascript:SelectDay("+currentDate+")' style = 'color:black;text-decoration:none;'>"+currentDate+"</a>";
			else
				cell.innerHTML = currentDate;
			
            cell.className+=sBorderCls;
			cell.style.backgroundImage = "";
			if(j>=7)
			{
            	cell.style.fontFamily = "Arial, sans-serif";
				cell.style.width="19px";
				cell.style.height="19px";
				cell.style.color = "#000000";
				cell.style.textAlign  = "center";
				cell.style.paddingTop = "2px";
				cell.style.paddingRight = "3px";
				cell.style.paddingBottom = "3px";
				cell.style.paddingLeft = "2px";
				cell.style.background = "";
				cell.innerHTML = "&nbsp;";
				cell.disabled = true;
				continue;
			}
			if (!cell.disabled) {
				cell.calday = currentDate;
								
				if(this.calType == "H")
				{
					cell.calMonth = date.month;
					cell.calYear = date.year; 
				}
				else
				{
					cell.calMonth = date.getMonth();
					cell.calYear = date.getFullYear(); 
				}
				if (!this.multiple && current_month
				    && currentDate == mday && this.hiliteToday) {
					this.currentDateEl = cell;
				}
				if(currentDate == SrcDay &&
					cell.calMonth == month &&
					cell.calYear == year)
				{
					this.CellSel = cell;
					this.day = currentDate;
					this.month = month;
					this.year = year;
					cell.style.backgroundImage  = "url('"+loadedImages[2].src+"')";
					cell.style.backgroundRepeat = "no-repeat";
                    cell.style.backgroundPosition = "center";       //ICE 1904588000 
					cell.style.fontWeight = 'bold';

					
				}

				if (currentDate == TD &&
					cell.calMonth == TM &&
					cell.calYear == TY) {
					this.TodayCell = cell;
					
					cell.style.width="19";
					cell.style.height="19";
					cell.style.color = '#000';
					cell.style.textAlign  = 'center';
					cell.style.padding = "1px";
					cell.style.backgroundImage  = "url('"+loadedImages[1].src+"')";
					cell.style.backgroundRepeat = "no-repeat";
                    cell.style.backgroundPosition = "center";       //ICE 1904588000
					if(TD == SrcDay)
					{
						if( PTCalendar.is_ie == false)
						{
							cell.style.backgroundImage  = "url('"+loadedImages[1].src+"')";
							cell.style.textAlign  = 'center';
							cell.style.backgroundRepeat = "no-repeat";
							if(currentDate<10)
								cell.innerHTML ="<a style='font-weight:bold;background:url("+loadedImages[2].src+"); text-decoration:none;color:black;width:19;height:19;padding: 1.45px 8.5px 1.5px 2.5px;' onclick = 'javascript:PTCalendar.HandleInnercell();'>"+currentDate+"</a>";
							else
								cell.innerHTML ="<a style='font-weight:bold;background:url("+loadedImages[2].src+"); text-decoration:none;color:black;width:19;height:19;padding: 1.45px 2px 2px 2px; padding-bottom: 1px;' onclick = 'javascript:PTCalendar.HandleInnercell();'>"+currentDate+"</a>";
							
						}
						else
						{
							cell.style.backgroundImage  = "url('"+loadedImages[2].src+"')";
							cell.innerHTML ="<a style='font-weight:bold;background:url("+loadedImages[1].src+");text-align: center; text-decoration:none;color:black;width:19;height:19;'onclick = 'javascript:PTCalendar.HandleInnercell();' >"+currentDate+"</a>";
						}
					}
					else
						cell.innerHTML ="<a style='font-weight:bold;text-align: center; text-decoration:none;color:black;width:19;height:19;' onclick = 'javascript:PTCalendar.HandleInnercell();'>"+currentDate+"</a>";

					
					this.TodayCell = cell;
					
				}
    			currentDate++;
			}
		}
		if (!(hasdays || this.showsOtherMonths))
			row.className = "PT_CALemptyrow";
	}
	this.table.style.visibility = "visible";
	
};

PTCalendar.prototype.setDate = function (date) {
	this._init(this.firstDayOfWeek, date);
};

PTCalendar.prototype.setCalendarTye = function (calType) {
    this.calType = calType;
}
/** Modifies the "firstDayOfWeek" parameter (pass 0 for Synday, 1 for Monday, etc.). */
PTCalendar.prototype.setFirstDayOfWeek = function (firstDayOfWeek) {
	this._init(firstDayOfWeek, this.date);
	var nCurMonth;
	var nCurYr;
	var nStartYear = 1900;
	var nEndYear = 2100;
	var nDay=0;
    var strMonth;
    var strMonthName;
	if(this.calType=="H")
    {
       nCurMonth = this.date.month;
       nCurYr = this.date.year;
       nStartYear = 1321;
       nEndYear = 1521;
	   strMonth= "<select style = 'width:130px;' name = 'PTMonth' onChange =PTCalendar.MonthChanged()>" ;
	   strMonth = strMonth + "<option value='0'>"+ 'Muharram'+ "</option>" ;
       strMonth = strMonth + "<option value='10'>"+ 'Safar' + "</option>" ;
	   strMonth = strMonth + "<option value='1'>"+ 'Rabi Al-Awwal' + "</option>" ;
	   strMonth = strMonth + "<option value='2'>"+  'Rabi Al-Akhar' + "</option>" ;
	   strMonth = strMonth + "<option value='3'>"+ 'Jumada Al-Awwal' + "</option>" ;
	   strMonth = strMonth + "<option value='4'>"+ 'Jumada Al-Akhirah' + "</option>" ;
	   strMonth = strMonth + "<option value='5'>"+ 'Rajab' + "</option>" ;
	   strMonth = strMonth + "<option value='6'>"+ 'Shaban' + "</option>" ;
	   strMonth = strMonth + "<option value='7'>"+ 'Ramadan' + "</option>" ;
	   strMonth = strMonth + "<option value='8'>"+ 'Shawwal' + "</option>" ;
	   strMonth = strMonth + "<option value='9'>"+ 'Dhul-Qadah' + "</option>" ;
	   strMonth = strMonth + "<option value='11'>"+ 'Dhul-Hijjah' + "</option>" ;
   }
   else
   {
	   nCurMonth = this.date.getMonth();
	   nCurYr = this.date.getYear();
       if (this.calType=="T")
       {
           if( PTCalendar.is_ie == true)
               nCurYr = nCurYr + 543;
           nStartYear = 2443;
           nEndYear = 2644;
       } 
	   strMonth= "&nbsp;&nbsp;&nbsp;<select name = 'PTMonth' onChange =PTCalendar.MonthChanged()>" ;
	   strMonth = strMonth + "<option value='0'>"+ 'January' + "</option>" ;
	   strMonth = strMonth + "<option value='1'>"+ 'February' + "</option>" ;
       strMonth = strMonth + "<option value='2'>"+ 'March' + "</option>" ;
       strMonth = strMonth + "<option value='3'>"+ 'April' + "</option>" ;
       strMonth = strMonth + "<option value='4'>"+ 'May' + "</option>" ;
       strMonth = strMonth + "<option value='5'>"+ 'June' + "</option>" ;
       strMonth = strMonth + "<option value='6'>"+ 'July' + "</option>" ;
       strMonth = strMonth + "<option value='7'>"+ 'August' + "</option>" ;
       strMonth = strMonth + "<option value='8'>"+ 'September' + "</option>" ;
       strMonth = strMonth + "<option value='9'>"+ 'October' + "</option>" ;
       strMonth = strMonth + "<option value='10'>"+ 'November' + "</option>" ;
       strMonth = strMonth + "<option value='11'>"+ 'December' + "</option>" ;  
   }    

  strMonth = strMonth + "</select>";
  var strYr = " <select name = 'PTYear' onChange = PTCalendar.YearChanged()>" ;
  for (var nYr = nStartYear; nYr <= nEndYear; ++nYr)
		strYr = strYr + "<option>" + nYr + "</option>" ;
	if(nCurYr > nStartYear) nCurYr -=nStartYear;
    this.title.innerHTML = strMonth + strYr;
    this._selectCombos();
    this.monthsCombo.selectedIndex = nCurMonth;
    this.yearsCombo.selectedIndex = nCurYr;
	this.minYear = nStartYear;
	this.maxYear = nEndYear;
	
};
/** Customization of allowed year range for the calendar. */
PTCalendar.prototype.setRange = function (a, z) {
	this.minYear = a;
	this.maxYear = z;
};
/** Calls the first user handler (selectedHandler). */
PTCalendar.prototype.callHandler = function () {
	if (this.onSelected) {
		this.onSelected(this, this.date);
	}
};
/** Calls the second user handler (closeHandler). */
PTCalendar.prototype.callCloseHandler = function () {
	if (this.onClose) {
		this.onClose(this);
	}
	
};
/** Removes the calendar object from the DOM tree and destroys it. */
PTCalendar.prototype.destroy = function () {
	if (this.isPopup) {
		PTCalendar.removeEvent(document, "keydown", PTCalendar._keyEvent);
		PTCalendar.removeEvent(document, "keypress", PTCalendar._keyEvent);
		PTCalendar.removeEvent(document, "mousedown", PTCalendar._checkCalendar);
	}
	var el = this.element.parentNode;
	if (typeof el != "undefined" && el != null) 
	el.removeChild(this.element);
	PTCalendar._C = null;
	window._PS_popupCalendar = null;
};

PTCalendar._checkCalendar = function(ev) {
};

//MERGED FROM PT_CALENDARSCRIPT4

// JScript source code

PTCalendar.prototype.show = function () {
	var rows = this.table.getElementsByTagName("tr");
	for (var i = rows.length; i > 0;) {
		var row = rows[--i];
		PTCalendar.removeClass(row, "rowhilite");
		var cells = row.getElementsByTagName("td");
		for (var j = cells.length; j > 0;) {
			var cell = cells[--j];
			PTCalendar.removeClass(cell, "hilite");
			PTCalendar.removeClass(cell, "active");
		}
	}
	this.element.style.display = "block";
	this.hidden = false;
	if (this.isPopup) {
		window._PS_popupCalendar = this;
		PTCalendar.addEvent(document, "keydown", PTCalendar._keyEvent);
		PTCalendar.addEvent(document, "keypress", PTCalendar._keyEvent);
		PTCalendar.addEvent(document, "mousedown", PTCalendar._checkCalendar);
	}
		
};
/**
 *  Hides the calendar.  Also removes any "hilite" from the class of any TD
 *  element.
 */
PTCalendar.prototype.hide = function () {
	if (this.isPopup) {
		PTCalendar.removeEvent(document, "keydown", PTCalendar._keyEvent);
		PTCalendar.removeEvent(document, "keypress", PTCalendar._keyEvent);
		PTCalendar.removeEvent(document, "mousedown", PTCalendar._checkCalendar);
	}
	
	this.element.style.display = "none";
	this.hidden = true;
	
	this.title.innerHTML="";
};

/**
 *  Shows the calendar at a given absolute position (beware that, depending on
 *  the calendar element style -- position property -- this might be relative
 *  to the parent's containing rectangle).
 */
PTCalendar.prototype.showAt = function (x, y) {
	var s = this.element.style;
    if (x < 0) x = Math.abs(x);       //so that the calendar doesnt get cut off if the parent window is small
	if (y < 0) y = Math.abs(y);       //ICE 1796052003
	s.left = x + "px";
	s.top = y + "px";
	this.show();
};

/** Shows the calendar near a given element. */
PTCalendar.prototype.showAtElement = function (el, opts) {
	var self = this;
	var p = PTCalendar.getAbsolutePos(el);
	if (!opts || typeof opts != "string") {
		this.showAt(p.x, p.y + el.offsetHeight);
		return true;
	}
	function fixPosition(box) {
		if (box.x < 0)
			box.x = 0;
		if (box.y < 0)
			box.y = 0;
		var cp = document.createElement("div");
		var s = cp.style;
		s.position = "absolute";
		s.display = "block";
		s.right = s.bottom = s.width = s.height = "0px";
		document.body.appendChild(cp);
		var br = PTCalendar.getAbsolutePos(cp);
		document.body.removeChild(cp);
		if (PTCalendar.is_ie) {
			br.y += document.body.scrollTop;
			br.x += document.body.scrollLeft;
		} else {
			br.y += window.scrollY;
			br.x += window.scrollX;
		}
		var tmp = box.x + box.width - br.x;
		if (tmp > 0) box.x -= tmp;
		tmp = box.y + box.height - br.y;
		if (tmp > 0) box.y -= tmp;
	};
	this.element.style.display = "block";
	PTCalendar.continuation_for_the_khtml_browser = function() {
		var w = self.element.offsetWidth;
		var h = self.element.offsetHeight;
		self.element.style.display = "none";
		var valign = opts.substr(0, 1);
		var halign = "l";
		if (opts.length > 1) {
			halign = opts.substr(1, 1);
		}
		// vertical alignment
		switch (valign) {
		    case "T": p.y -= h; break;
		    case "B": p.y += el.offsetHeight; break;
		    case "C": p.y += (el.offsetHeight - h) / 2; break;
		    case "t": p.y += el.offsetHeight - h; break;
		    case "b": break; // already there
		}
		// horizontal alignment
		switch (halign) {
		    case "L": p.x -= w; break;
		    case "R": p.x += el.offsetWidth; break;
		    case "C": p.x += (el.offsetWidth - w) / 2; break;
		    case "l": p.x += el.offsetWidth - w; break;
		    case "r": break; // already there
		}
		p.width = w+50;
		p.height = h + 40;
		//self.monthsCombo.style.display = "none";
		fixPosition(p);
		self.showAt(p.x, p.y);
	};
	if (this.is_khtml)
		setTimeout("PTCalendar.continuation_for_the_khtml_browser()", 10);
	else
		PTCalendar.continuation_for_the_khtml_browser();
};

/** Customizes the date format. */
PTCalendar.prototype.setDateFormat = function (str) {
	this.dateFormat = str;
};

/** Customizes the tooltip date format. */
PTCalendar.prototype.setTtDateFormat = function (str) {
	this.ttDateFormat = str;
};

/**
 *  Tries to identify the date represented in a string.  If successful it also
 *  calls this.setDate which moves the calendar to the given date.
 */
PTCalendar.prototype.parseDate = function(str, fmt) {
	if (!fmt)
		fmt = this.dateFormat;
		
	if(this.calType == "H")
	{
		if(str==null || str == "")
		{
			date = new HijriDate();
		}
		else
		{
			date = str;
		}
		
		
	}
	else
	{
		if(str==null || str == "")
		{
			date = new Date();
		}
		else
		{
		date = str;
		}
	}
	this.setDate(date);
};


/** Internal function; it displays the bar with the names of the weekday. */
PTCalendar.prototype._displayWeekdays = function () {
    return;

};

/** Internal function.  Hides all combo boxes that might be displayed. */
PTCalendar.prototype._hideCombos = function () {
	this.monthsCombo.style.display = "none";
	this.yearsCombo.style.display = "none";
};

/** Internal function.  Starts dragging the element. */
PTCalendar.prototype._dragStart = function (ev) {
	if (this.dragging) {
		return;
	}
	this.dragging = true;
	var posX;
	var posY;
	if (PTCalendar.is_ie) {
		posY = window.event.clientY + document.body.scrollTop;
		posX = window.event.clientX + document.body.scrollLeft;
	} else {
		posY = ev.clientY + window.scrollY;
		posX = ev.clientX + window.scrollX;
	}
	var st = this.element.style;
	this.xOffs = posX - parseInt(st.left);
	this.yOffs = posY - parseInt(st.top);
	with (Calendar) {
		addEvent(document, "mousemove", calDragIt);
		addEvent(document, "mouseup", calDragEnd);
	}
};

PTCalendar.prototype._selectCombos = function (monthIndex) {
	var objCnt = document.getElementsByTagName("select").length;
	var objMonth =null;
	var objYear =null;
	for (var i = 0; i <objCnt;i++) {
	var objSelect = document.getElementsByTagName("select")[i];
	if(objSelect != null)
		{
		if(objSelect.name == 'PTMonth')
			{
			objMonth = objSelect;
			}
		else if(objSelect.name == 'PTYear')
			objYear = objSelect;
		}
		if(objMonth != null && objYear != null) break;
	}
	if(objMonth != null)
		this.monthsCombo = objMonth;
	if(objYear != null)
		this.yearsCombo = objYear;
}

// BEGIN: DATE OBJECT PATCHES

/** Adds the number of days array to the Date object. */
Date._MD = new Array(31,28,31,30,31,30,31,31,30,31,30,31);

/** Constants used for time computations */
Date.SECOND = 1000 /* milliseconds */;
Date.MINUTE = 60 * Date.SECOND;
Date.HOUR   = 60 * Date.MINUTE;
Date.DAY    = 24 * Date.HOUR;
Date.WEEK   =  7 * Date.DAY;

Date.parseDate = function(str, fmt) {
	var today = new Date();
	var y = 0;
	var m = -1;
	var d = 0;
	var a = str.split(/\W+/);
	var b = fmt.match(/%./g);
	var i = 0, j = 0;
	var hr = 0;
	var min = 0;
	for (i = 0; i < a.length; ++i) {
		if (!a[i])
			continue;
		switch (b[i]) {
		    case "%d":
		    case "%e":
			d = parseInt(a[i], 10);
			break;

		    case "%m":
			m = parseInt(a[i], 10) - 1;
			break;

		    case "%Y":
		    case "%y":
			y = parseInt(a[i], 10);
			(y < 100) && (y += (y > 29) ? 1900 : 2000);
			break;

		    case "%b":
		    case "%B":
			for (j = 0; j < 12; ++j) {
				//if (PTCalendar._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) { m = j; break; }
			}
			break;

		    case "%H":
		    case "%I":
		    case "%k":
		    case "%l":
			hr = parseInt(a[i], 10);
			break;

		    case "%P":
		    case "%p":
			if (/pm/i.test(a[i]) && hr < 12)
				hr += 12;
			else if (/am/i.test(a[i]) && hr >= 12)
				hr -= 12;
			break;

		    case "%M":
			min = parseInt(a[i], 10);
			break;
		}
	}
	if (isNaN(y)) y = today.getFullYear();
	if (isNaN(m)) m = today.getMonth();
	if (isNaN(d)) d = today.getDate();
	if (isNaN(hr)) hr = today.getHours();
	if (isNaN(min)) min = today.getMinutes();
	if (y != 0 && m != -1 && d != 0)
		return new Date(y, m, d, hr, min, 0);
	y = 0; m = -1; d = 0;
	for (i = 0; i < a.length; ++i) {
		if (a[i].search(/[a-zA-Z]+/) != -1) {
			var t = -1;
			for (j = 0; j < 12; ++j) {
				//if (PTCalendar._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) { t = j; break; }
			}
			if (t != -1) {
				if (m != -1) {
					d = m+1;
				}
				m = t;
			}
		} else if (parseInt(a[i], 10) <= 12 && m == -1) {
			m = a[i]-1;
		} else if (parseInt(a[i], 10) > 31 && y == 0) {
			y = parseInt(a[i], 10);
			(y < 100) && (y += (y > 29) ? 1900 : 2000);
		} else if (d == 0) {
			d = a[i];
		}
	}
	if (y == 0)
		y = today.getFullYear();
	if (m != -1 && d != 0)
		return new Date(y, m, d, hr, min, 0);
	return today;
};

/** Returns the number of days in the current month */
Date.prototype.getMonthDays = function(month) {
	var year = this.getFullYear();
	if (typeof month == "undefined") {
		month = this.getMonth();
	}
	if (((0 == (year%4)) && ( (0 != (year%100)) || (0 == (year%400)))) && month == 1) {
		return 29;
	} else {
		return Date._MD[month];
	}
};

/** Returns the number of day in the year. */
Date.prototype.getDayOfYear = function() {
	var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
	var time = now - then;
	return Math.floor(time / Date.DAY);
};

/** Returns the number of the week in year, as defined in ISO 8601. */
Date.prototype.getWeekNumber = function() {
	var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	var DoW = d.getDay();
	d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
	var ms = d.valueOf(); // GMT
	d.setMonth(0);
	d.setDate(4); // Thu in Week 1
	return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
};

/** Checks date and time equality */
Date.prototype.equalsTo = function(date) {
	return ((this.getFullYear() == date.getFullYear()) &&
		(this.getMonth() == date.getMonth()) &&
		(this.getDate() == date.getDate()) &&
		(this.getHours() == date.getHours()) &&
		(this.getMinutes() == date.getMinutes()));
};

Date.prototype.setDateOnly = function(day,month,Year) {
	this.setDate(1);
	this.PT_setFullYear(Year);
	this.setMonth(month);
	this.setDate(day);
	
};

if ( !Date.prototype.__msh_oldSetFullYear ) {
Date.prototype.__msh_oldSetFullYear = Date.prototype.setFullYear;
}
Date.prototype.PT_setFullYear = function(y) {
   	var d = new Date(this);
	d.__msh_oldSetFullYear(y);
	if (d.getMonth() != this.getMonth())
		this.setDate(28);
	this.__msh_oldSetFullYear(y);
	};


// END: DATE OBJECT PATCHES
