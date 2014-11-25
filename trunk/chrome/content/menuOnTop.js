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

  0.9.4 - 02/09/2013
	  # Choices for corner radius rules (left, right)
		# removed ROTT specific code to eliminate mail-toolbar3 dependencies
		# Added icon size setting
		# Added transparency switch for menu background (for light themes)
		# to do: better css tidy up routine! disable only works once in a session.
		
  0.9.5 - 25/05/2014
	  # preferences dialog stays on top now
    # new "Tangerine" theme
    # border color and width (experimental)
    # better handling of defaults.
    # increase search box height when displaying in menu by cutting down margin: .chromeclass-menubar .remote-gloda-search{margin:1px 2px; }

  0.9.6 - 10/08/2014
    # Added a "force small icons" option to make sure buttons in menu toolbar stay small in the latest Thunderbird versions
  
  0.9.7 - 04/11/2014
    # Added Firefox Support
    # Added setting for left margin

	
*/



var MenuOnTop = {
  CSSid: "menuOnTop-style",
	loadCSS: function loadCSS(window) {
		// Inject CSS for themes with the menubar under the tabbar, which looks terrible after moving the toolbar up
		try {
			let document = window.document;
      let util = MenuOnTop.Util;
      let txt = "################################" +'\n'
              + "###    MenuOnTop.loadCSS()   ###" +'\n'
              + "################################";
			util.logDebug (txt);
			var css = document.getElementById(util.MainWindowId).
												 appendChild(document.createElementNS("http://www.w3.org/1999/xhtml", "style"));
			css.setAttribute("type", "text/css");
			css.id = MenuOnTop.CSSid;
			
			let Prefs = MenuOnTop.Preferences;
			let m = '-' + (Math.abs(Prefs.negativeMargin)).toString();
			let bg = Prefs.menuBackground; // linear-gradient(to bottom, rgba(255,255,255,0.5),rgba(255,255,255,0.5))
			let col = Prefs.menuFontColor;
			let colorString = col ?  '#' + util.MenubarId + ' > menu > label {color: ' + col + ' !important;} ' : ''; // style only the top level items!
			
			let shadowString = Prefs.isTextShadow ? 'text-shadow: 1px 1px 1px rgba(128, 128, 128, 0.6) !important;' : '';
			let maxHeightString = Prefs.maxHeight ? 'max-height: ' + Prefs.maxHeight + 'px;' : '';
			let menuItemString = (shadowString + maxHeightString) ? '#' + util.MenubarId + ' > menu  {' + shadowString + maxHeightString + '}' : '';
			let menuMarginTop = 'margin-top: ' + Prefs.menuMarginTop + 'px !important;';
			let menuMarginLeft = 'margin-left: ' + Prefs.menuMarginLeft + 'px !important;';
			let menuRadiusValue = Prefs.menuRadius;
			let left  = Prefs.menuRadiusLeft ? menuRadiusValue + 'em' : '0';
			let right  = Prefs.menuRadiusRight ? menuRadiusValue + 'em' : '0';
			let radiusString = 'border-radius: ' + left + ' ' + right + ' ' + right + ' ' + left +' !important;';
      let tw = Prefs.menuBorderWidth.toString(); // allow for full 4 falue syntax, e.g. 1px 1px 1px 0  to avoid left border
      tw = tw.indexOf('px')<0 ? tw +'px' : tw;
			let borderWidth = 'border-width: ' + tw + ' !important;';
			let borderStyle = borderWidth
			                + 'border-style: solid !important; ' 
											+ 'border-color: ' + Prefs.menuBorderColor + ' !important;';
			let smallIconSize = Prefs.iconSizeSmall ? Prefs.iconSizeSmall + 'px' : 'auto';
			let normalIconSize = Prefs.iconSizeNormal ? Prefs.iconSizeNormal + 'px' : 'auto';
			if (Prefs.isForceIconSize) {
			  smallIconSize += ' !important';
				normalIconSize += ' !important';
			}
			let icsSmall = (smallIconSize.indexOf('auto')==0) ? '' : ('toolbar[iconsize="small"].chromeclass-menubar toolbarbutton.toolbarbutton-1 > image.toolbarbutton-icon { width: ' + smallIconSize + ';  height: ' + smallIconSize + '; } ');
			let icsNormal = (normalIconSize.indexOf('auto')==0) ? '' : ('toolbar:not([iconsize="small"]).chromeclass-menubar toolbarbutton.toolbarbutton-1 > image.toolbarbutton-icon { width: ' + normalIconSize + ';  height: ' + normalIconSize + '; } ');
			let dropDownSmall =  (smallIconSize.indexOf('auto')==0) ? '' : ('toolbar[iconsize="small"].chromeclass-menubar toolbarbutton.toolbarbutton-menubutton-button > image.toolbarbutton-icon { width: ' + smallIconSize + ';  height: ' + smallIconSize + '; } ');
			let dropDownNormal = (normalIconSize.indexOf('auto')==0) ? '' : ('toolbar:not([iconsize="small"]).chromeclass-menubar toolbarbutton.toolbarbutton-menubutton-button > image.toolbarbutton-icon { width: ' + normalIconSize + ';  height: ' + normalIconSize + '; } ');
			let menubar = Prefs.menuTransparent ? 
			      '#'+ util.ToolbarId +':-moz-lwtheme { background-image: none !important;} ' 
						+ '#'+ util.ToolbarId +':not(:-moz-lwtheme) { background:none !important;} '
						: ''; // linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5) 50%); 
			
			// Prefs.isMenuShadow // later!

			// Inject some css!
			// we override min-height for charamel!
			
			// chrome://messenger/skin/primaryToolbar.css
      let cssCode = '';
      let ordinalTb = '';
      if (util.Application=='Thunderbird') {
        ordinalTb = '-moz-box-ordinal-group: 10 !important;';
        cssCode += '#tabs-toolbar {-moz-box-ordinal-group: 20 !important;} ' +
                   '#mail-bar3{-moz-box-ordinal-group: 30 !important;} ';
      }
			cssCode +=icsSmall +
                icsNormal +
                dropDownSmall + 
                dropDownNormal +
                menubar +
                '.chromeclass-menubar .remote-gloda-search{margin:1px 2px; } ' +
                '#'+ util.ToolbarId +' {' + ordinalTb +' border-color: transparent !important;} ' +
                '#'+ util.ToolbarId +' toolbarbutton {border-color: transparent !important;} ' +
                '#'+ util.ToolbarId +':not([inactive]) {margin-top: ' + m + 'px;} ' +
                '#menubar-items > #' + util.MenubarId + '[id] { background:' + bg + ' !important;'   // override border-top-style!
                   + borderStyle
                   + radiusString +'  min-height:' + Prefs.maxHeight + 'px;} ' +
                '#menubar-items > #' + util.MenubarId + '[id][style] {' + borderWidth + '} ' +
                '#menubar-items:not(:-moz-lwtheme){ background-color: transparent !important; } ' + // Nautipolis!
                '#menubar-items > menubar { background: none; ' + menuMarginTop + '; ' + menuMarginLeft +'; } ' + // TT deepdark!
                '#' + util.ToolboxId + ' > #'+ util.ToolbarId +':not(:-moz-lwtheme) { background-color: transparent !important; background-image:none; } ' +
                colorString + 
                menuItemString;

			css.appendChild(document.createTextNode(cssCode));
      util.logDebug ("Appended CSS: " + cssCode);
      MenuOnTop.forceIconSize(window);
		}
		catch (ex) {
			MenuOnTop.Util.logDebug ("MenuOnTop.loadCSS() failed\n" + ex);
		}
	},
	
	resetCSS: function resetCSS(window) {
		try {
			MenuOnTop.Util.logDebug ("MenuOnTop.resetCSS()...");
			let document = window.document; 
      let styleId = MenuOnTop.CSSid;
			let css = document.getElementById(styleId);
      if (css)
        css.parentNode.removeChild(css);
      else
        MenuOnTop.Util.logDebug ("Could not find the css style element:" + css);
		}
		catch (ex) {
			MenuOnTop.Util.logDebug ("MenuOnTop.resetCSS() failed\n" + ex);
		}
  },
	
	setEventAttribute: function setEventAttribute(element, eventName, eventAction) {
	  // workaround to lower number of warnings in addon validation
		element.setAttribute(eventName, eventAction);	
	} ,
  
  makeMenuItem(doc, url, label, cmd) {
    let menuitem = doc.createElement('menuitem');
    menuitem.setAttribute('label', label);
    menuitem.className='menuitem-iconic';
    if (!cmd) {
      // open URL as default
      // cmd = "MenuOnTop.openURLInTab('" + url + "')";
      menuitem.addEventListener("command", function() { MenuOnTop.Util.openURLInTab(url); }, false);
    }
    else
      menuitem.addEventListener("command", cmd, false);
    return menuitem;
  } ,
  
  populateMenu: function populateMenu(doc, menu) {
    try {
      MenuOnTop.Util.logDebug(
        '******************************\n'
        + '** populateMenu()  ' + menu.id + '\n'
        + '******************************');
      let menuPopup = doc.createElement('menupopup');
      
      menuPopup.id = "menu_menuOnTopPopup";
      menu.appendChild(menuPopup);
      // test test test
      // for bookmarks handling, read
      // http://mxr.mozilla.org/mozilla-central/source/browser/base/content/browser-places.js#640
      menuPopup.appendChild(this.makeMenuItem(doc, 
        "https://corp.share.avaya.com/sites/OneSource_Vertical/IT%20One%20Source%20Library/Forms/AllItems.aspx?RootFolder=%2fsites%2fOneSource%5fVertical%2fIT%20One%20Source%20Library%2fProjects&FolderCTID=0x012000DDBED9FADEF6284D91D8FD7DCC424602", 
        "Projects - All Documents"));
      menuPopup.appendChild(this.makeMenuItem(doc, 
        "https://projects.share.avaya.com/sites/ACSProgram/default.aspx", 
        "Home - ACS Program"));
      menuPopup.appendChild(this.makeMenuItem(doc, 
        "https://corp.share.avaya.com/sites/Product_Vertical/Product/Forms/AllItems.aspx?RootFolder=%2Fsites%2FProduct%5FVertical%2FProduct%2FVOC%20FY15%2FPTR%201744%5F%20VOC%20%2D%20Dec%20Release&FolderCTID=0x012000F4CE2F804B1FC34392F1F4D05D593E74&View=%7B3AC5B1BE%2DAC60%2D48C7%2D8DA4%2DB4D09FB99E7B%7D", 
        "PTR 1744 - VOC - All Documents"));
        
      menuPopup.appendChild(doc.createElement('menuseparator'));
      menuPopup.appendChild(this.makeMenuItem(doc, 
        '', 'Add new menu item here...',  // no URL!
        function() { MenuOnTop.Interface.addCustomMenuItem(menuPopup); })); // add my own command
        
      MenuOnTop.Util.logDebug('populateMenu() ENDS');
    }
    catch(ex) {
      MenuOnTop.Util.logException('populateMenu()', ex);
    }
  } ,
  
  showCustomMenu: function showCustomMenu(win) {
    let visible = MenuOnTop.Preferences.isCustomMenu;
    MenuOnTop.Util.logDebug('showCustomMenu - visible = ' + visible);
    let menuId = "menuOnTop-menu-Custom";
    let doc = win.document;
    let menubar = doc.getElementById(MenuOnTop.Util.MenubarId);
    let label = MenuOnTop.Preferences.customMenuTitle;
    // create a menu item to th8e left of file menu
    if (menubar) {
      if (visible) {
        if (doc.getElementById(menuId))
          return;
        let menu = doc.createElement('menu');
        // menu.id=menuId;
        menu.setAttribute("id", menuId);
        menu.setAttribute("label", label);
        // menu.collapsed = false;
        // empty will be shown as collapsed
        MenuOnTop.populateMenu(doc, menu);
        menubar.insertBefore(menu, menubar.firstChild);
      }
      else { // remove it if it exists
        let menu = doc.getElementById(menuId);
        if (menu)
          menubar.removeChild(menu);
      }
    }  
  } ,
  
  hideCustomMenu: function hideCustomMenu(win) {
    let doc = win.document;
    let menuId = "menuOnTop-menu-Custom";
    let menubar = doc.getElementById(MenuOnTop.Util.MenubarId);
    let menu = doc.getElementById(menuId);
    if (menu)
      menubar.removeChild(menu);
  } ,
  
	ensureMenuBarVisible: function(win) {
		// see also  c-c/source/suite/common/utilityOverlay.js
		// goToggleToolbar  
		MenuOnTop.Util.logDebug('ensureMenuBarVisible()');
    try {
      let id = MenuOnTop.Util.ToolbarId;
      let doc = win.document;
      let toolbar = doc.getElementById(id);
      MenuOnTop.Util.logDebug('toolbar (' + id +') = ' + toolbar);
      let isChange = false;
      let hidingAttribute = "autohide";
      let attribValue = toolbar.getAttribute("autohide") ;
      
      if ( attribValue == "true" ) {
        let hidden =  "false"; // aEvent.originalTarget.getAttribute("checked") !=
        toolbar.setAttribute(hidingAttribute, hidden);
        win.setTimeout(
          function() {
            doc.persist(toolbar.id, hidingAttribute);
            MenuOnTop.Util.logDebug('ensureMenuBarVisible() - after document.persist();');
          }
        );
      }
      MenuOnTop.showCustomMenu(win);
      // MenuOnTop.showCustomMenu(win);
    }
    catch(ex) {
      MenuOnTop.Util.logException('ensureMenuBarVisible()', ex);
    }
	} ,
  
  forceIconSize: function(win) {
		let id = MenuOnTop.Util.ToolbarId;
    let isForce = MenuOnTop.Preferences.isForceIconSmall;
    MenuOnTop.Util.logDebug('forceIconSize()\nForce Small = ' + isForce);
		let toolbar = win.document.getElementById(id);
    if (toolbar) {
      MenuOnTop.Util.logDebug('forceIconSize()\nFound toolbar, changing iconsize attribute...');
      if (MenuOnTop.Preferences.isForceIconSmall) {
        toolbar.setAttribute("menuOnTop-forceSmall", "true");
        toolbar.setAttribute("iconsize", "small");
      }
      else {
        if (toolbar.getAttribute("menuOnTop-forceSmall")) {
          toolbar.setAttribute("iconsize", ""); // let's not set it at all.
        }
      }
    }
  } ,
	
	defaultPREFS : {
		negativeMargin: 2,
		menuMarginTop: 6,
		menuMarginLeft: 2,
		maxHeight: 20,
    menuBorderWidth: "0",
		menuRadius: "0.5",
		menuRadiusLeft: false,
		menuRadiusRight: true,
		menubarTransparent: true,
		menuBackground: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))",
		menuFontColor: "rgb(15,15,15)",
		iconSizeSmall: 16,
		iconSizeNormal: 16,
    forceSmallIcons: true, // new setting to avoid smudged icons in menu bar!
		textShadow: false,
		debug: false,
		statusIcon: true,
    customMenu: false,
    customMenuTitle: ''
  },
	
	showAddonButton :function(mainWindow) {
		MenuOnTop.Util.logDebug ("MenuOnTop.showAddonButton()...");
		if (!mainWindow) return;

		let buttonContainer = MenuOnTop.Util.ButtonPanel(mainWindow);  
		// Get the anchor for "overlaying" but make sure the UI is loaded
		if (!buttonContainer) return;

		// Place the new button after the last button in the top set
		let button = mainWindow.document.createElement("statusbarpanel");
		button.setAttribute("id", "menuOnTop-statusButton");
		button.setAttribute("label", "");
		button.setAttribute("tooltiptext", "Menu on Top - click for options");
		button.setAttribute("class", "statusbarpanel-iconic");
		button.style.listStyleImage = "url(chrome://menuontop/content/menuOnTop16.png)";
		// button.style.mozImageRegion = "rect(0px, 16px, 16px, 0px)"; // this probably won't work as it isn't declared in CSS2 ElementCSSInlineStyle.style

		button.addEventListener("click", function() {
      MenuOnTop.Util.logDebug('click');
			var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
					.getService(Components.interfaces.nsIWindowMediator);
			var addonWin = windowManager.getMostRecentWindow("addon:MenuOnTop"); // use windowtype to set this
			if (addonWin)
				addonWin.focus();
			else {
        MenuOnTop.Util.logDebug('Calling openDialog...');
        try {
          mainWindow.openDialog("chrome://menuontop/content/menuOnTop_options.xul",'menuontop-options','chrome,titlebar,centerscreen,resizable,alwaysRaised');
        }
        catch(ex) {
          MenuOnTop.Util.logException("openDialog()",ex);
        }
      }
		}, false);

		buttonContainer.appendChild(button);
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
  mAppName: null,
  get Application() {
		if (null == this.mAppName) {
			var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
											.getService(Components.interfaces.nsIXULAppInfo);
			const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
			const THUNDERBIRD_ID = "{3550f703-e582-4d05-9a08-453d09bdfdc6}";
			const SEAMONKEY_ID = "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}";
			const POSTBOX_ID = "postbox@postbox-inc.com";
			switch(appInfo.ID) {
				case FIREFOX_ID:
					return this.mAppName='Firefox';
				case THUNDERBIRD_ID:
					return this.mAppName='Thunderbird';
				case SEAMONKEY_ID:
					return this.mAppName='SeaMonkey';
				case POSTBOX_ID:
					return this.mAppName='Postbox';
				default:
					this.mAppName=appInfo.name;
					this.logDebug ( 'Unknown Application: ' + appInfo.name);
					return appInfo.name;
			}
		}
		return this.mAppName;  
  } ,
  
  get AppVersion() {
		var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
						.getService(Components.interfaces.nsIXULAppInfo);
		return parseFloat(appInfo.version);
  } ,
  
  get MainWindowXulId() {
    switch(this.Application) {
      case 'Thunderbird':
        return "mail:3pane";
      case 'Firefox':
        return "navigator:browser";
    }
    return "";
  } ,
  
	get MainWindow() {
    var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
        .getService(Components.interfaces.nsIWindowMediator);
    switch(this.Application) {
      case 'Thunderbird':
      case 'Firefox':
        let win = windowManager.getMostRecentWindow(this.MainWindowXulId);
        return win;
    }
    return null;
	} ,
  
  get MainWindowId() {
    switch(this.Application) {
      case 'Thunderbird':
        return 'messengerWindow';
      case 'Firefox':
        return 'main-window';
    }
    return null;
  } ,

  get ToolbarId() {
    switch(this.Application) {
      case 'Thunderbird':
        return 'mail-toolbar-menubar2';
      case 'Firefox':
        return 'toolbar-menubar';
    }
    return '';
  } ,  
  
  get ToolboxId() {
    switch(this.Application) {
      case 'Thunderbird':
        return 'navigation-toolbox';
      case 'Firefox':
        return 'navigator-toolbox';
    }
    return '';
  } ,  
  
  ButtonPanel: function ButtonPanel(win) {
    // passing in win so we can toggle the button
    // from options dialog (which is a child window)
    let id='';
    let bar = null;
    if (!win) win=window;
    switch(this.Application) {
      case 'Thunderbird':
        id = "status-bar";
        bar = win.document.getElementById(id);
        break;
      case 'Firefox':
        id = "addonbarteo-addon-bar";
        bar = win.document.getElementById(id);
        if (!bar) {
          id = "nav-bar";
          bar = win.document.getElementById(id);
        }
        // we could potentially look at last child of browser-bottombox (must be visible and have a toolbar tag)
        if (!bar) {
          let par = win.document.getElementById("browser-bottombox");
          for (let i=0; i<par.childNodes.length; i++) {
            let el = par.childNodes[i];
            if (!el.hidden && el.tagName && el.tagName == 'toolbar') {
              bar = el;
              if (el.id) id = el.id;
            }
          }
        }
        break;
    }
    let txt = "ButtonPanel() returns:"+  bar;
    if (id) {
      txt += '\nDetermined id of button container:' + id;
    }
    MenuOnTop.Util.logDebug(txt);
    return bar;
  } ,
  
  get MenubarId() {
    switch(this.Application) {
      case 'Thunderbird':
        return 'mail-menubar';
      case 'Firefox':
        return 'main-menubar';
    }
    return '';
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
		try {
      return this.service.getCharPref("extensions.menuontop." + p);
		}
		catch(ex) {
			MenuOnTop.Util.logException("getCharPref(extensions.menuontop." + p + ")", ex);
			return '';
		}
	},
	
	getIntPref: function(p) {
		try {
      return this.service.getIntPref("extensions.menuontop." + p);
		}
		catch(ex) {
			MenuOnTop.Util.logException("getIntPref(extensions.menuontop." + p + ")", ex);
			return 0;
		}
	},
	
	setBoolPref: function(term, val) {
		try {
			return this.service.setBoolPref("extensions.menuontop." + term, val);
		}
		catch(ex) {
			MenuOnTop.Util.logException("setBoolPref(extensions.menuontop." + term + ")", ex);
		}
	},  
  
	// GET: specific settings
  get isCustomMenu() {
		return this.getBoolPref('customMenu');
  } ,
  
  get customMenuTitle() {
		return this.getCharPref('customMenu.title');
  } ,
  
	get iconSizeNormal() {
		return this.getIntPref('iconSize.normal');
	} ,
	
	get iconSizeSmall() {
		return this.getIntPref('iconSize.small');
	} ,
	
	get isForceIconSize() {
		return this.getBoolPref('iconSize.force'); 
	} ,
  
  get isForceIconSmall() {
		return this.getBoolPref('iconSize.forceSmall'); 
  } ,
	
	get negativeMargin() {
		return this.getIntPref('negativeMargin');
	} ,
	
	get menuMarginLeft() {
		return this.getIntPref('menuMargin.left');
	} ,
  
  get menuMarginTop() {
		return this.getIntPref('menuMargin');
	} ,
	
	get maxHeight() {
		return this.getIntPref('maxHeight');
	} ,
	
	get menuRadius() {
		return this.getCharPref('menuRadius'); // in em!
	} ,
	
	get menuBorderWidth() {
		return this.getCharPref('menuBorderWidth'); // css string
	},
	
	get menuBorderColor() {
		return this.getCharPref('menuBorderColor'); 
	},
	
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
};  // Preferences

MenuOnTop.Bookmarks = {
  getFxMarks: function() {
    var bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"]
                      .getService(Components.interfaces.nsINavBookmarksService);
    var menuFolder = bmsvc.toolbarFolder; // Bookmarks toolbar folder
    let parentFolder;
    parentFolderId = bmsvc.getChildFolder(menuFolder, "MenuOnTop");
    if (!parentFolder)
      parentFolder = bmsvc.createFolder(menuFolder, "MenuOnTop", bmsvc.DEFAULT_INDEX); 
    var rootNode = parentFolder.root;
    rootNode.containerOpen = true;
    // iterate over the immediate children of this folder and dump to console
    for (var i = 0; i < rootNode.childCount; i ++) {
      var node = rootNode.getChild(i);
      dump("Child: " + node.title + "\n");
    }

    // close a container after using it!
    rootNode.containerOpen = false;
  }
};  // Bookmarks

MenuOnTop.Interface = {
  addCustomMenuItem: function addCustomMenuItem(el) {
    alert('To do:  add custom menu items...');
  }
};  // Interface


