"use strict";

/* BEGIN LICENSE BLOCKAMO
for detail, please refer to license.txt in the root folder of this extension

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 3
of the License, or (at your option) any later version.

If you use large portions of the code please attribute to the authors
(Axel Grude)

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You can download a copy of the GNU General Public License at
http://www.gnu.org/licenses/gpl-3.0.txt or get a free printed
copy by writing to:
  Free Software Foundation, Inc.,
  51 Franklin Street, Fifth Floor,
  Boston, MA 02110-1301, USA.
END LICENSE BLOCK 
*/


/*=============================
  Project History - Menu On Top
  =============================

  Note: All Dates here are given in UK format - dd/MM/yyyy

  Personnel:
  AG - Lead Developer and owner of the AMO project Menu On Top

  0.9 :  09/06/2013 - Initial Release for preliminary review
    # Created Prototype based code on "Rise Of The Tools" (released under Mozilla Public License Version 1.1) by rsjtdrjgfuzkfg 
		# It just moved the menu to the top, no configurable options.

  0.9.1 : 10/06/2013 
	  #  Added options window, with settings for margins and color
		#  Added style chooser, supporting major themes
		#  Added Linux / Mac support
		#  Bumped up max version to 22 for current beta users

  0.9.2 - 15/06/2013
    #  Real Instant Apply from Options screen
    #  Added options for border radius (value in em and left, right switches)
    #  Added Statusbar Icon
    #  Menu will now be made visible automatically when Addon is installed or updated.
    #  Added Phoenity style
		
  0.9.3 - 17/06/2013
    #  Persisted statusbar icon across sessions.
    #  Added version history button.
    #  Reuse preferences window if it is already open.
    #  Improved debug log feature.

  0.9.4 - WIP
	  # Choices for corner radius rules (left, right)
		# removed ROTT specific code to eliminate mail-toolbar3 dependencies
		# Added icon size setting
		# Added transparency switch for menu background (for light themes)
		# to do: better css tidy up routine! disable only works once in a session.
		
		
*/



var MenuOnTop = {
	loadCSS: function(window) {
		// Inject CSS for themes with the menubar under the tabbar, which looks terrible after moving the toolbar up
		try {
			let document = window.document
			MenuOnTop.Util.logDebug ("MenuOnTop.loadCSS()...");

			var css = document.getElementById("messengerWindow").
												 appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "style"));
			css.setAttribute("type", "text/css");
			css.id = "menuOnTop-style";
			
			let Prefs = MenuOnTop.Preferences;
			let m = '-' + (Math.abs(Prefs.negativeMargin)).toString();
			let bg = Prefs.menuBackground; // linear-gradient(to bottom, rgba(255,255,255,0.5),rgba(255,255,255,0.5))
			let col = Prefs.menuFontColor;
			let colorString = col ?  '#mail-menubar > menu > label {color: ' + col + ' !important;} ' : ''; // style only the top level items!
			
			let shadowString = Prefs.isTextShadow ? 'text-shadow: 1px 1px 1px rgba(128, 128, 128, 0.6) !important;' : '';
			let maxHeightString = Prefs.maxHeight ? 'max-height: ' + Prefs.maxHeight + 'px;' : '';
			let menuItemString = (shadowString + maxHeightString) ? '#mail-menubar > menu  {' + shadowString + maxHeightString + '}' : '';
			let menuMargin = 'margin-top: ' + Prefs.menuMargin + 'px !important;';
			let menuRadiusValue = Prefs.menuRadius;
			let left  = Prefs.menuRadiusLeft ? menuRadiusValue + 'em' : '0';
			let right  = Prefs.menuRadiusRight ? menuRadiusValue + 'em' : '0';
			let radiusString = 'border-radius: ' + left + ' ' + right + ' ' + right + ' ' + left +' !important;'
			let smallIconSize = Prefs.iconSizeSmall ? Prefs.iconSizeSmall + 'px' : 'auto';
			let normalIconSize = Prefs.iconSizeNormal ? Prefs.iconSizeNormal + 'px' : 'auto';
			if (Prefs.isForceIconSize) {
			  smallIconSize += ' !important';
				normalIconSize += ' !important';
			}
			let icsSmall = (smallIconSize.indexOf('auto')==0) ? '' : 'toolbar[iconsize="small"].chromeclass-menubar toolbarbutton.toolbarbutton-1 > image.toolbarbutton-icon { width: ' + smallIconSize + ';  height: ' + smallIconSize + '; } ';
			let icsNormal = (normalIconSize.indexOf('auto')==0) ? '' : 'toolbar:not([iconsize="small"]).chromeclass-menubar toolbarbutton.toolbarbutton-1 > image.toolbarbutton-icon { width: ' + normalIconSize + ';  height: ' + normalIconSize + '; } ';
			let dropDownSmall =  (smallIconSize.indexOf('auto')==0) ? '' : 'toolbar[iconsize="small"].chromeclass-menubar toolbarbutton.toolbarbutton-menubutton-button > image.toolbarbutton-icon { width: ' + smallIconSize + ';  height: ' + smallIconSize + '; } ';
			let dropDownNormal = (normalIconSize.indexOf('auto')==0) ? '' : 'toolbar:not([iconsize="small"]).chromeclass-menubar toolbarbutton.toolbarbutton-menubutton-button > image.toolbarbutton-icon { width: ' + normalIconSize + ';  height: ' + normalIconSize + '; } ';
			let menubar = Prefs.menuTransparent ? 
			      '#mail-toolbar-menubar2:-moz-lwtheme { background-image: none !important;} ' 
						+ '#mail-toolbar-menubar2:not(:-moz-lwtheme) { background:none !important;} '
						: ''; // linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5) 50%); 
			
			// Prefs.isMenuShadow // later!

			// Inject some css!
			// we override min-height for charamel!
			
			// chrome://messenger/skin/primaryToolbar.css
			let csstext = '#tabs-toolbar {-moz-box-ordinal-group: 20 !important;} ' +
										'#mail-bar3{-moz-box-ordinal-group: 30 !important;} ' +
										icsSmall +
										icsNormal +
										dropDownSmall + 
										dropDownNormal +
										menubar +
										'#mail-toolbar-menubar2 {-moz-box-ordinal-group: 10 !important;border-color: transparent !important;} ' +
										'#mail-toolbar-menubar2 toolbarbutton {border-color: transparent !important;} ' +
										'#mail-toolbar-menubar2:not([inactive]) {margin-top: ' + m + 'px;} ' +
										'#menubar-items > #mail-menubar[id] { background:' + bg + ' !important;' + radiusString +'  min-height:' + Prefs.maxHeight + 'px;} ' +
										'#menubar-items:not(:-moz-lwtheme){ background-color: transparent !important; } ' + // Nautipolis!
										'#menubar-items > menubar { background: none; ' + menuMargin + ' } ' + // TT deepdark!
										'#navigation-toolbox > #mail-toolbar-menubar2:not(:-moz-lwtheme) { background-color: transparent !important; background-image:none; } ' +
										colorString + 
										menuItemString;

			css.appendChild(document.createTextNode(csstext));
		}
		catch (ex) {
			MenuOnTop.Util.logDebug ("MenuOnTop.loadCSS() failed\n" + ex);
		}
	},
	
	resetCSS: function(window) {
		try {
			MenuOnTop.Util.logDebug ("MenuOnTop.resetCSS()...");
			let document = window.document; 
			let css = document.getElementById("menuOnTop-style");
			css.parentNode.removeChild(css);
		}
		catch (ex) {
			MenuOnTop.Util.logDebug ("MenuOnTop.resetCSS() failed\n" + ex);
		}
  },
	
	ensureMenuBarVisible: function(window) {
		// see also  c-c/source/suite/common/utilityOverlay.js
		// goToggleToolbar  
		MenuOnTop.Util.logDebug('ensureMenuBarVisible()');
		let id = 'mail-toolbar-menubar2';
		let doc = window.document;
		let toolbar = doc.getElementById(id);
		let isChange = false;
		let hidingAttribute = "autohide";
		let attribValue = toolbar.getAttribute("autohide") ;
		
  	if ( attribValue == "true" )
    {
		  let hidden =  "false"; // aEvent.originalTarget.getAttribute("checked") !=
			toolbar.setAttribute(hidingAttribute, hidden);
			window.setTimeout(
				function() {
				  doc.persist(toolbar.id, hidingAttribute);
					MenuOnTop.Util.logDebug('ensureMenuBarVisible() - after document.persist();');
				}
			);
		}
	} ,
	
	defaultPREFS : {
		negativeMargin: 2,
		menuMargin: 6,
		maxHeight: 20,
		menuRadius: "0.5",
		menuRadiusLeft: false,
		menuRadiusRight: true,
		menubarTransparent: true,
		menuBackground: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))",
		menuFontColor: "rgb(15,15,15)",
		iconSizeSmall: 16,
		iconSizeNormal: 16,
		textShadow: false,
		debug: false,
		statusIcon: true
  },
	
	showAddonButton :function(window) {
		MenuOnTop.Util.logDebug ("MenuOnTop.showAddonButton()...");
		if (!window) return;

		let statusbar = window.document.getElementById("status-bar");
		// Get the anchor for "overlaying" but make sure the UI is loaded
		if (!statusbar) return;

		// Place the new button after the last button in the top set
		
		let button = window.document.createElement("statusbarpanel");
		button.setAttribute("id", "menuOnTop-statusButton");
		button.setAttribute("label", "");
		button.setAttribute("tooltiptext", "Menu on Top - click for options");
		button.setAttribute("class", "statusbarpanel-iconic");
		button.style.listStyleImage = "url(chrome://menuontop/content/menuOnTop16.png)";
		// button.style.mozImageRegion = "rect(0px, 16px, 16px, 0px)"; // this probably won't work as it isn't declared in CSS2 ElementCSSInlineStyle.style

		button.addEventListener("click", function() {
			var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
					.getService(Components.interfaces.nsIWindowMediator);
			var win = windowManager.getMostRecentWindow("addon:MenuOnTop"); // use windowtype to set this
			if (win)
				win.focus();
			else
				window.openDialog("chrome://menuontop/content/menuOnTop_options.xul");
		}, false);

		statusbar.appendChild(button);
	} ,
	
	hideAddonButton : function(window) {
		MenuOnTop.Util.logDebug ("MenuOnTop.hideAddonButton()...");
		if (!window) return;
		let button = window.document.getElementById("menuOnTop-statusButton");
		if (button)
			button.parentNode.removeChild(button);
	
	} 
	

};


Components.utils.import("resource://gre/modules/Services.jsm");

MenuOnTop.Util = {
	getMail3PaneWindow: function() {
		var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
				.getService(Components.interfaces.nsIWindowMediator);
		var win3pane = windowManager.getMostRecentWindow("mail:3pane");
		return win3pane;
	} ,

	lastTime:0 ,
	logTime: function() {
		let timePassed = '';
		let end = new Date();
		try { // AG added time logging for test
			let endTime = end.getTime();
			if (this.lastTime==0) {
				this.lastTime = endTime;
				return "[logTime init]"
			}
			let elapsed = new String(endTime - this.lastTime); // time in milliseconds
			timePassed = '[' + elapsed + ' ms]	 ';
			this.lastTime = endTime; // remember last time
		}
		catch(e) {;}
		return end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds() + '.' + end.getMilliseconds() + '  ' + timePassed;
	},
	
	logToConsole: function (msg, optionTag) {
		Services.console.logStringMessage("MenuOnTop "
			+ (optionTag ? '{' + optionTag.toUpperCase() + '} ' : '')
			+ this.logTime() + "\n"+ msg);
	},	

  logDebug: function(msg) {
	  if (MenuOnTop.Preferences.isDebug)
			this.logToConsole(msg);	
	},
	
	logDebugOptional: function (option, msg) {
		if (MenuOnTop.Preferences.isDebugOption(option))
			this.logToConsole(msg, option);
	},
	
	logError: function (aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags) {
	  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	                                 .getService(Components.interfaces.nsIConsoleService);
	  var aCategory = '';

	  var scriptError = Components.classes["@mozilla.org/scripterror;1"].createInstance(Components.interfaces.nsIScriptError);
	  scriptError.init(aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags, aCategory);
	  consoleService.logMessage(scriptError);
	} ,
	
	logException: function(msg, ex) {
		var stack = ''
		if (typeof ex.stack!='undefined')
			stack= ex.stack.replace("@","\n  ");
		// let's display a caught exception as a warning.
		let fn = ex.fileName ? ex.fileName : "?";
		this.logError(msg + "\n" + ex.message, fn, stack, ex.lineNumber, 0, 0x1);
	},
	
  openURL: function(evt,URL) { 
		if (this.openURLInTab(URL) && null!=evt) {
			evt.preventDefault();
			evt.stopPropagation();
		}
	},
	
	openURLInTab: function (URL) {
		try {
			var sTabMode="";
			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator);
			var mainWindow = wm.getMostRecentWindow("navigator:browser");
			if (mainWindow) {
				var newTab = mainWindow.gBrowser.addTab(URL);
				mainWindow.gBrowser.selectedTab = newTab;
				return true;
			}


			var tabmail;
			tabmail = document.getElementById("tabmail");
			if (!tabmail) {
				// Try opening new tabs in an existing 3pane window
				var mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"]
										 .getService(Components.interfaces.nsIWindowMediator)
										 .getMostRecentWindow("mail:3pane");
				if (mail3PaneWindow) {
					tabmail = mail3PaneWindow.document.getElementById("tabmail");
					mail3PaneWindow.focus();
				}
			}
			if (tabmail) {
				sTabMode = "contentTab";
				tabmail.openTab(sTabMode,
				{contentPage: URL, clickHandler: "specialTabs.siteClickHandler(event, QuickPasswords_TabURIregexp._thunderbirdRegExp);"});
			}
			else
				window.openDialog("chrome://messenger/content/", "_blank",
								  "chrome,dialog=no,all", null,
			  { tabType: "contentTab",
			   tabParams: {contentPage: URL,
			              clickHandler: "specialTabs.siteClickHandler(event, QuickPasswords_TabURIregexp._thunderbirdRegExp);", id:"QuickPasswords_Weblink"}
			  } );
		}
		catch(e) {
			this.logException("openURLInTab(" + URL + ")", e);
			return false;
		}
		return true;
	}	
};

MenuOnTop.Preferences = {
	service: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),

	getBoolPref: function(term) {
		try {
			return this.service.getBoolPref("extensions.menuontop." + term);
		}
		catch(ex) {
			MenuOnTop.Util.logException("getBoolPref(extensions.menuontop." + term + ")", ex);
			return false;
		}
	},
	
  getCharPref: function(p) {
		return this.service.getCharPref("extensions.menuontop." + p);
	},
	
	getIntPref: function(p) {
		return this.service.getIntPref("extensions.menuontop." + p);
	},
	
	// GET: specific settings
	get iconSizeNormal() {
		return this.getIntPref('iconSize.normal');
	} ,
	
	get iconSizeSmall() {
		return this.getIntPref('iconSize.small');
	} ,
	
	get isForceIconSize() {
		return this.getBoolPref('iconSize.force'); 
	} ,
	
	get negativeMargin() {
		return this.getIntPref('negativeMargin');
	} ,
	
	get menuMargin() {
		return this.getIntPref('menuMargin');
	} ,
	
	get maxHeight() {
		return this.getIntPref('maxHeight');
	} ,
	
	get menuRadius() {
		return this.getCharPref('menuRadius'); // in em!
	} ,
	
	get menuRadiusLeft() {
		return this.getBoolPref('menuRadiusLeft'); 
	} ,
	
	get menuRadiusRight() {
		return this.getBoolPref('menuRadiusRight'); 
	} ,
	
	get menuBackground() {
		return this.getCharPref('menuBackground');
	} ,
	
	get menuFontColor() {
		return this.getCharPref('menuFontColor');
	} ,
	
	get menuTransparent() {
		return this.getBoolPref('menubar.transparent');
	} ,
	
	get isTextShadow() {
		return this.getBoolPref('textShadow');
	} ,
	
	get isDebug() {
	  return this.getBoolPref('debug');
	} ,
	
	get isStatusIcon() {
	  return this.getBoolPref('statusIcon');
	} ,
	
	isDebugOption: function(key) {
	  return this.getBoolPref('debug.' + key );
	}
};

