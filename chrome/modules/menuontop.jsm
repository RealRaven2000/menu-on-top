//"use strict";

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

var EXPORTED_SYMBOLS = [ 'MenuOnTop' ];

let MenuOnTop = {
  mAppName: null,
  CSSid: "menuOnTop-style",
  CustomMenuId: "menuOnTop-menu-Custom",
  CustomMenuPopupId: "menu_menuOnTopPopup",
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
      /**** COLORS ****/
			// linear-gradient(to bottom, rgba(255,255,255,0.5),rgba(255,255,255,0.5))
      // override border-top-style!
      let backgroundString = '#menubar-items > #' + util.MenubarId + '[id] { background:' + Prefs.menuBackground + ' !important;'
            + borderStyle 
            + radiusString 
            + '  min-height:' + Prefs.maxHeight + 'px;} ';

			let col = Prefs.menuFontColor;
			let colorString = col ?  '#' + util.MenubarId + ' > menu > label {color: ' + col + ' !important;} ' : ''; 
			col = Prefs.menuFontColorHover;
			colorString += col ?  '#' + util.MenubarId + ' > menu[_moz-menuactive="true"]:not([open="true"]):not([disabled="true"]) > label {color: ' + col + ' !important;} ' : ''; 
			col = Prefs.menuFontColorActive;
			colorString += col ?  '#' + util.MenubarId + ' > menu[open="true"] > label {color: ' + col + ' !important;} ' : ''; 
      let backgroundStringHover = 
        '#menubar-items > #' + util.MenubarId + '[id][_moz-menuactive="true"]:not([open="true"]):not([disabled="true"]) { background-image:' + Prefs.menuBackgroundHover + ' !important;} '
      let backgroundStringActive = 
        '#menubar-items > #' + util.MenubarId + '[id][open="true"]:not([disabled="true"]) { background-image:' + Prefs.menuBackgroundActive + ' !important;} '

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
                colorString + 
                backgroundString +
                backgroundStringHover +
                backgroundStringActive +
                '#menubar-items > #' + util.MenubarId + '[id][style] {' + borderWidth + '} ' +
                '#menubar-items:not(:-moz-lwtheme){ background-color: transparent !important; } ' + // Nautipolis!
                '#menubar-items > menubar { background: none; ' + menuMarginTop + '; ' + menuMarginLeft +'; } ' + // TT deepdark!
                '#' + util.ToolboxId + ' > #'+ util.ToolbarId +':not(:-moz-lwtheme) { background-color: transparent !important; background-image:none; } ' +
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
  } ,
	
	setEventAttribute: function setEventAttribute(element, eventName, eventAction) {
	  // workaround to lower number of warnings in addon validation
		element.setAttribute(eventName, eventAction);	
	} ,
  
  makeMenuItem : function makeMenuItem(doc, url, label, cmdType) {
    let menuitem = doc.createElement('menuitem');
    menuitem.setAttribute('label', label);
    menuitem.className='menuitem-iconic';
    // get to the original MenuOnTop object (of the main window):
    let mot = MenuOnTop; // prefer the main object though so we can access "messenger"
    switch (cmdType) {
      case "browser":
        menuitem.addEventListener("command", function(event) { 
          MenuOnTop.Util.openURLInTab(url); //event.target.ownerDocument.defaultView.
          }, false);
        break;
      case "message":
        menuitem.addEventListener("command", function(event) { 
          MenuOnTop.Util.openMessageTabFromUri(url); 
          }, false);
        break;
      case "function": // for adding custom functions / commands
        menuitem.addEventListener("command", url, false);
        break;
      default:
        menuitem.addEventListener("command", function() { alert('This bookmark type is not currently supported:' + cmdType); }, false);
        break;
    }
    return menuitem;
  } ,
  
  deconstructMenu: function deconstructMenu(doc, menu) {
    function removeChildren(tagName) {
      let elements = menu.getElementsByTagName(tagName);
      if (elements && elements.length) {
        for (let i=elements.length-1; i>=0; i--) {
          let el = elements[i];
          if (el.parentNode)
            el.parentNode.removeChild(el);
        }
      }
    }
    try {
      MenuOnTop.Util.logDebug('deconstructMenu()');
      removeChildren('menuitem');
      removeChildren('menuseparator');
    }
    catch(ex) {
      MenuOnTop.Util.logException('deconstructMenu()', ex);
    }
  } ,
  
  populateMenu: function populateMenu(doc, menu) {
    try {
      if (!menu) {
        menu = doc.getElementById(MenuOnTop.CustomMenuId);
      }
      MenuOnTop.Util.logDebug(
          '******************************\n'
        + '** populateMenu()  ' + menu.id + '\n'
        + '******************************');
      if (MenuOnTop.Preferences.isDebug) debugger;
      
      this.deconstructMenu(doc, menu);
      
      let menuPopup = doc.getElementById(MenuOnTop.CustomMenuPopupId);
      if (!menuPopup) {
        menuPopup = doc.createElement('menupopup');
        menuPopup.id = MenuOnTop.CustomMenuPopupId;
      }
      
      menu.appendChild(menuPopup);
      for (let i = 0; i < MenuOnTop.TopMenu.Entries.length; i++) {
        let entry = MenuOnTop.TopMenu.Entries[i];
        menuPopup.appendChild(this.makeMenuItem(doc, entry.url, entry.label, entry.bookmarkType));
      }
      
      // test test test
      // for bookmarks handling, read
      // http://mxr.mozilla.org/mozilla-central/source/browser/base/content/browser-places.js#640
        
      menuPopup.appendChild(doc.createElement('menuseparator'));
      menuPopup.appendChild(this.makeMenuItem(doc, 
        function() { MenuOnTop.TopMenu.addCustomMenuItem(menuPopup); }),
        'Add current Webpage...',  // no URL!
        'function'
        ); // add my own command
        
      MenuOnTop.Util.logDebug('populateMenu() ENDS');
    }
    catch(ex) {
      MenuOnTop.Util.logException('populateMenu()', ex);
    }
  } ,
  
  showCustomMenu: function showCustomMenu(win) {
    if (MenuOnTop.Preferences.isDebug) debugger;
    let display = MenuOnTop.Preferences.isCustomMenu;
    MenuOnTop.Util.logDebug('showCustomMenu - display = ' + display);
    let menuId = MenuOnTop.CustomMenuId; 
    let doc = win.document;
    let menubar = doc.getElementById(MenuOnTop.Util.MenubarId);
    let label = MenuOnTop.Preferences.customMenuTitle;
    // create a menu item to th8e left of file menu
    if (menubar) {
      if (display) {
        let menu = doc.getElementById(menuId);
        if (!menu) {
          menu = doc.createElement('menu');
          // menu.id=menuId;
          menu.setAttribute("id", menuId);
        }
        // refresh label
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
  
	ensureMenuBarVisible: function ensureMenuBarVisible(win) {
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
  
  forceIconSize: function forceIconSize(win) {
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
		menuBackgroundHover: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))",
		menuFontColorHover: "rgb(15,15,15)",
		menuBackgroundActive: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))",
		menuFontColorActive: "rgb(15,15,15)",
		iconSizeSmall: 16,
		iconSizeNormal: 16,
    forceSmallIcons: true, // new setting to avoid smudged icons in menu bar!
		textShadow: false,
		debug: false,
		statusIcon: true,
    customMenu: false,
    customMenuTitle: ''
  },
	
	showAddonButton :function showAddonButton(mainWindow) {
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
	
	hideAddonButton : function hideAddonButton(window) {
		MenuOnTop.Util.logDebug ("MenuOnTop.hideAddonButton()...");
		if (!window) return;
		let button = window.document.getElementById("menuOnTop-statusButton");
		if (button)
			button.parentNode.removeChild(button);
	
	} ,
  
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
  }   

};

MenuOnTop.Util = {
  get Application() {
    return MenuOnTop.Application;
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
  
	get TabInTitleBoolPref() {
		switch (this.Application) {
			case 'Thunderbird':
				return 'mail.tabs.drawInTitlebar';
			case 'Firefox':
				return 'browser.tabs.drawInTitlebar';
			case 'Postbox': // not supported yet
				return 'mail.tabs.drawInTitlebar';
			case 'SeaMonkey': // not supported yet
				return 'mail.tabs.drawInTitlebar';
		}
		return null;
	} ,
  
  setTabInTitle: function setTabInTitle(flag) {
    let service = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    service.setBoolPref(this.TabInTitleBoolPref, flag);
  } ,
  
  getTabInTitle: function getTabInTitle() {
    let service = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    return service.getBoolPref(this.TabInTitleBoolPref);
  } ,
  
  get isLinux() {
    // https://developer.mozilla.org/en-US/docs/OS_TARGET
    let xulRuntime = Components.classes["@mozilla.org/xre/app-info;1"]
                 .getService(Components.interfaces.nsIXULRuntime);  
    return (xulRuntime.OS.indexOf('Linux')>=0);
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
  
	lastTime:0,
  
	logTime: function logTime() {
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
	
	logToConsole: function logToConsole(msg, optionTag) {
		Services.console.logStringMessage("MenuOnTop "
			+ (optionTag ? '{' + optionTag.toUpperCase() + '} ' : '')
			+ this.logTime() + "\n"+ msg);
	},	

  logDebug: function logDebug(msg) {
	  if (MenuOnTop.Preferences.isDebug)
			this.logToConsole(msg);	
	},
	
	logDebugOptional: function logDebugOptional(option, msg) {
		if (MenuOnTop.Preferences.isDebugOption(option))
			this.logToConsole(msg, option);
	},
	
	logError: function logError(aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags) {
	  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	                                 .getService(Components.interfaces.nsIConsoleService);
	  var aCategory = '';

	  var scriptError = Components.classes["@mozilla.org/scripterror;1"].createInstance(Components.interfaces.nsIScriptError);
	  scriptError.init(aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags, aCategory);
	  consoleService.logMessage(scriptError);
	} ,
	
	logException: function logException(msg, ex) {
		var stack = ''
		if (typeof ex.stack!='undefined')
			stack= ex.stack.replace("@","\n  ");
		// let's display a caught exception as a warning.
		let fn = ex.fileName ? ex.fileName : "?";
		this.logError(msg + "\n" + ex.message, fn, stack, ex.lineNumber, 0, 0x1);
	},
	
  openURL: function openURL(evt,URL) { 
		if (this.openURLInTab(URL) && null!=evt) {
			evt.preventDefault();
			evt.stopPropagation();
		}
	},
	
	openURLInTab: function openURLInTab(URL) {
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

			let tabmail;
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
	}	,

  // open an email in a new tab
  openMessageTabFromUri: function openMessageTabFromUri(messageUri) {
    let tabmail = document.getElementById("tabmail");
    let hdr = messenger.messageServiceFromURI(messageUri).messageURIToMsgHdr(messageUri);
    
    switch (MenuOnTop.Util.Application) {
      case 'Thunderbird':
        tabmail.openTab('message', {msgHdr: hdr, background: false});  
        break;
      case 'SeaMonkey':
        let tabMode = tabmail.tabModes['3pane'];
        let tabInfo = {mode: tabMode, canClose: true};
        let modeBits = 2; // get current mode? (kTabShowFolderPane = 1, kTabShowMessagePane = 2, kTabShowThreadPane = 4)
        // gMailNewsTabsType.modes['3pane'].openTab(tabInfo, modeBits, null, hdr);
        tabmail.openTab('3pane', modeBits, null, hdr);
        break;
      case 'Postbox':
				var win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
										 .getService(Components.interfaces.nsIWindowMediator)
										 .getMostRecentWindow("mail:3pane");          
        // from src/mail/base/content/mailWindowOverlay.js
        win.MsgOpenNewTabForMessageWithAnimation(
               hdr.messageKey, 
               hdr.folder.URI, //
               '',       // aMode
               false ,   // Background
               true      // skipAnimation 
               // [, aAccountURI (optional) ]
               )
        break;
    }
  }  
};  // Util

Components.utils.import("resource://gre/modules/osfile.jsm")
Components.utils.import("resource://gre/modules/Services.jsm");

MenuOnTop.Preferences = {
	service: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),

	getBoolPref: function getBoolPref(term) {
		try {
			return this.service.getBoolPref("extensions.menuontop." + term);
		}
		catch(ex) {
			MenuOnTop.Util.logException("getBoolPref(extensions.menuontop." + term + ")", ex);
			return false;
		}
	},
	
  getCharPref: function getCharPref(p) {
		try {
      return this.service.getCharPref("extensions.menuontop." + p);
		}
		catch(ex) {
			MenuOnTop.Util.logException("getCharPref(extensions.menuontop." + p + ")", ex);
			return '';
		}
	},
	
	getIntPref: function getIntPref(p) {
		try {
      return this.service.getIntPref("extensions.menuontop." + p);
		}
		catch(ex) {
			MenuOnTop.Util.logException("getIntPref(extensions.menuontop." + p + ")", ex);
			return 0;
		}
	},
	
	setBoolPref: function setBoolPref(term, val) {
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
	
	get menuBackgroundHover() {
		return this.getCharPref('menuBackground.hover');
	} ,
	
	get menuFontColorHover() {
		return this.getCharPref('menuFontColor.hover');
	} ,
	
	get menuBackgroundActive() {
		return this.getCharPref('menuBackground.active');
	} ,
	
	get menuFontColorActive() {
		return this.getCharPref('menuFontColor.active');
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
	
	isDebugOption: function isDebugOption(key) {
	  return this.getBoolPref('debug.' + key );
	}
};  // Preferences
 
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/Promise.jsm");

MenuOnTop.TopMenu = {
  Entries: [],
  charset: "UTF-8",
  
  addItem: function addItem(url, label, bookmarkType) {
    let listbox = document.getElementById('bookmarksList');
    listbox.appendItem(label, url);
  },
  
  clearList: function clearList() {
    let listbox = document.getElementById('bookmarksList');
    while(listbox.getRowCount())
      listbox.removeItemAt(0);
    while (this.Entries.length)
      this.Entries.pop();
  },
  
  add: function add() {
    if (MenuOnTop.Preferences.isDebug) debugger;
    let url = document.getElementById('linkURL').value;
    let label = document.getElementById('linkLabel').value;
    let bookmarkType = document.getElementById('linkType').value;
    this.addItem(url, label, bookmarkType);
    this.Entries.push({url:url, label:label, bookmarkType: bookmarkType});
  },
  
  remove: function remove() {
    if (MenuOnTop.Preferences.isDebug) debugger;
    let listbox = document.getElementById('bookmarksList');
    if (listbox.selectedIndex>=0) {
      this.Entries.splice(listbox.selectedIndex, 1); // remove from array
      listbox.removeItemAt( listbox.selectedIndex );
    }
  },
  
  getBrowser: function getBrowser() {
		const Ci = Components.interfaces;
    let util = MenuOnTop.Util;
		let interfaceType = Ci.nsIDOMWindow;
    let mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
    let browsers = null;
    let DomWindow = null;
    let theBrowser = null;
    
    let getWindowEnumerator = 
      (util.isLinux) ?
      mediator.getXULWindowEnumerator :
      mediator.getZOrderXULWindowEnumerator;
    browsers = getWindowEnumerator ('navigator:browser', true);
    if (browsers) {
      theBrowser = browsers.getNext();
      if (theBrowser) {
        if (theBrowser.getInterface)
          DomWindow = theBrowser.getInterface(interfaceType);
        else {
          try {
            // Linux
            DomWindow = theBrowser.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(interfaceType);
          }
          catch(e) {;}
        }
      }
    }
    if (!DomWindow) {
      browsers = getWindowEnumerator ('navigator:browser', true);
      if (!browsers || !(util.Application!='Firefox' && browsers.hasMoreElements()))
        browsers = getWindowEnumerator ('mail:3pane', true);
      if (!browsers)
        return  null;
      if (browsers.hasMoreElements()) {
        theBrowser = browsers.getNext();
        if (theBrowser.getInterface)
          DomWindow = theBrowser.getInterface(interfaceType);
        else // Linux
          DomWindow = theBrowser.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(interfaceType)
      }
      else {
        try { DomWindow=getBrowser(); } // Linux last resort
        catch(ex) {
          util.logException("getBrowser() failed:", ex);
        }
      }
    
    }
    return DomWindow;
  },
  
  getActiveUri: function getActiveUri() {
    let uriObject= {url:'',label:'', bookmarkType: null};
    let util = MenuOnTop.Util;
    let browser = this.getBrowser();
    let tabmail = null;
    let currentURI = '';
    let currentLabel = '';
    let currentType = '';
		if (browser || document.getElementById("tabmail")) {  // in Linux we cannot get the browser while options dialog is displayed :(
			try {
				let isOriginBrowser = (util.Application=='Firefox');
				// for SeaMonkey we need to determine whether we opened from the messenger or from the navigator window
				if (util.Application!='Firefox') {
					tabmail = browser.document ? browser.document.getElementById("tabmail") : document.getElementById("tabmail");
					// double check whether we come from browser
					if (util.Application=='SeaMonkey') {
					  if (!tabmail) {
							isOriginBrowser = true;
						}
						else {  
						  // both windows are open, now what?
						  // best: which window is in foreground. or which window called (owner?)
						}
					}
				}
				/*     GET CONTEXT FROM CURRENT MAIL TAB  */
				if (!isOriginBrowser) {
					
					if (tabmail) {
						let tab = tabmail.selectedTab ? tabmail.selectedTab : tabmail.currentTab;  // Pb currentTab
						let theMode = tab.mode ? tab.mode.name : tab.getAttribute("type");
						if (!browser)
							browser = tab.browser;
						if (theMode == 'folder') {
						  // if we are in folder mode we might have a message selected
							if (tab.folderDisplay && tab.folderDisplay.focusedPane && tab.folderDisplay.focusedPane.id =='threadTree') {
								theMode = 'message';
							}
						}
            
            currentType = theMode;

						util.logDebugOptional("default", "Selected Tab mode: " + theMode);
						switch (theMode) {
							case 'folder':
								isMailbox = true;

								try {
									let currentFolder =
										tab.folderDisplay ?
										tab.folderDisplay.displayedFolder :
										browser.GetFirstSelectedMsgFolder().QueryInterface(Components.interfaces.nsIMsgFolder);
									// let currentFolder2 = tab.folderDisplay.view.displayedFolder.QueryInterface(Components.interfaces.nsIMsgFolder);
									// let msgFolder = theFolder.QueryInterface(Components.interfaces.nsIMsgFolder);
									currentURI = currentFolder.server.hostName; // password manager shows the host name
									if (currentURI == 'localhost') {
										currentURI = currentFolder.server.realHostName;
									}
                  currentLabel = currentFolder.prettyName;
								}
								catch(ex) {
									util.logException("Could not determine current folder: ",ex);
									return ""
								}
								break;

							case 'calendar':
								currentURI="Calendar";
                currentLabel="Calendar";
								break;
							case 'contentTab':      // fall through
							case 'thunderbrowse':
								currentURI = tab.browser.currentURI.host;
                currentLabel = tab.browser.contentTitle;
                currentType = 'browser';
								break;
							case 'glodaFacet':         // fall through
							case 'glodaSearch-result': // fall through
							case 'glodaList':          // fall through
							case 'message':            // fall through
								// find out about currently viewed message
								try {
									let msg = null;
									if (tab.folderDisplay) {
										msg = tab.folderDisplay.selectedMessage;
									}
									else {
										if (tab.messageDisplay && tab.messageDisplay.selectedCount==1) {
											msg = tab.messageDisplay.displayedMessage;
										}
										else {
											let msgUri = this.alternativeGetSelectedMessageURI (browser);
											if (msgUri) {
												msg = browser.messenger.messageServiceFromURI(msgUri).messageURIToMsgHdr(msgUri);
											}
										}
									}
									if (!msg) return '';
                  currentURI = msg.folder.generateMessageURI(msg.messageKey) 
                  currentLabel = msg.mime2DecodedSubject.substring(0, 70);
                  currentType = 'message';
								}
								catch(ex) { 
								  util.logException("Could not retrieve message from context menu", ex);
									currentURI = "{no message selected}"; 
								};
								break;
              case 'chat':
                currentLabel = tab.title;
                currentURI = '#msg: not yet implemented - chat bookmarks.';
                break;
							default:  // case 'tasks':
                alert('Not supported: bookmarking ' + theMode + ' tab!');
								break;
						}
					}
				}
				/*     GET CONTEXT FROM CURRENT BROWSER  */
				else {
          // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/tabs_utils
				  // Fx
          currentType = 'browser';
					let lB = browser.gBrowser.selectedTab.linkedBrowser;
					// SM:
					let uri = lB.registeredOpenURI ? lB.registeredOpenURI : lB.currentURI; // nsIURI
          currentLabel = lB.contentTitle;
          currentURI = uri.spec;  // whole URL including query parameters; there is also asciiSpec and specIgnoringRef
					
          /*
					// prepend http:// or https:// etc.
					let uriProtocol = uri.scheme + '://';
					
					if (uri.host == "ietab2") {
						// find first url parameter:
						let f = uri.path.indexOf("?url=");
						let ieTabUri = "";
						if (f > 0) {
							let ieTabUri = uri.path.substring(f + 5);
							f = ieTabUri.indexOf("//");
							if (withServer && f > 0) {
								uriProtocol = ieTabUri.substring(0, f+2);
							}
							else {
								uriProtocol = "";
							}
							let r = ieTabUri.substring(f+2);
							currentURI = uriProtocol +  r.substring(0 , r.indexOf("/"));
						  
						}
					}

					currentURI = uriProtocol + uri.host;
          */
					
				}
			}
			catch(ex) {
        util.logException("Error retrieving current URL:", ex);
			}
		}

    // Assign the object to pass back
    uriObject.url = currentURI;
    uriObject.label = currentLabel;
    uriObject.bookmarkType = currentType;
    
		return uriObject;
  },
  
  getFromContext: function getFromContext() {
    let uriObject = this.getActiveUri();
    if (Object.keys(uriObject).length === 0) {
      alert('Could not determine context URL!');
      return;
    }
    document.getElementById('linkURL').value = uriObject.url;
    document.getElementById('linkLabel').value = uriObject.label;
    document.getElementById('linkType').value = uriObject.bookmarkType;
  },
  
  getLocalFile: function getLocalFile() {
    // get the "menuOnTop.json" file in the profile/extensions directory
    let path = new Array("extensions", "menuOnTop.json");
    // http://dxr.mozilla.org/comm-central/source/mozilla/toolkit/modules/FileUtils.jsm?from=FileUtils.jsm&case=true#41
		return FileUtils.getFile("ProfD", path); // implements nsIFile
  } ,
  
  readStringFile: function readStringFile() {
    // To read content from file
    const {TextDecoder,OS} = Components.utils.import("resource://gre/modules/osfile.jsm", {});
    // To read & write content to file
    // const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});  
    
    let profileDir = OS.Constants.Path.profileDir;
    let path = OS.Path.join(profileDir, "extensions", "menuOnTop.json");
  
    let decoder = new TextDecoder();        // This decoder can be reused for several reads
    let promise = OS.File.read(path, { encoding: "utf-8" }); // Read the complete file as an array - returns Uint8Array 
    return promise;
  } ,
  
  loadCustomMenu: function loadCustomMenu() {
    if (MenuOnTop.Preferences.isDebug) debugger;
    let util = MenuOnTop.Util;
    try {
      // let CustomMenuString='';
      let topMenu = this; // closure this
      let promise2 = this.readStringFile().then (
        function onSuccess(CustomMenuData) {
          // populate the bookmarks
          topMenu.clearList();
          let entries = JSON.parse(CustomMenuData);  
          for (let i=0; i<entries.length; i++) {
            let entry = entries[i];
            topMenu.addItem(entry.url, entry.label, entry.bookmarkType);
            topMenu.Entries.push(
              {url:entry.url, 
              label:entry.label, 
              bookmarkType:entry.bookmarkType}
              );
          }
        },
        function onFailure(ex) {
          if (ex.becauseNoSuchFile) {
            // File does not exist);
          }
          else {
            // Some other error
            alert('Reading the bookmarks file failed ' + ex);
          }     
          // no changes to Entries array
        }
      );
      
      promise2.then(
        function populateMenu() {
          let win = MenuOnTop.Util.MainWindow;
          let doc = win.document;
          MenuOnTop.populateMenu(doc);
        },
        function onFail(ex) {
          alert('Did not load main menu' + ex);
        }
      );
    }
    catch(ex) {
      util.logException('MenuOnTop.TopMenu.loadCustomMenu()', ex);
    }
  } ,

  saveCustomMenu: function saveCustomMenu()  {
    if (MenuOnTop.Preferences.isDebug) debugger;
    let util = MenuOnTop.Util;
    try {
      const {OS} = Components.utils.import("resource://gre/modules/osfile.jsm", {});
      if (MenuOnTop.Preferences.isDebug) debugger;
      let topMenu = this; // closure this
      let profileDir = OS.Constants.Path.profileDir;
      let path = OS.Path.join(profileDir, "extensions", "menuOnTop.json");
      let backPath = OS.Path.join(profileDir, "extensions", "menuOnTop.json.bak");
      let promiseDelete = OS.File.remove(backPath);  // only if it exists
      let promiseBackup = promiseDelete.then(
        function () { 
          util.logDebug ('OS.File.move is next...'); 
          OS.File.move(path, backPath); 
        },
        function failedDelete(fileError) { 
          util.logDebug ('OS.File.remove failed for reason:' + fileError); 
          OS.File.move(path, backPath); 
        }
        );

      promiseBackup.then( 
        function backSuccess() {
          let entity = topMenu.Entries.length ? topMenu.Entries : '';
          let outString = JSON.stringify(entity, null, '  '); // prettify
          try {
            // let theArray = new Uint8Array(outString);
            let promise = OS.File.writeAtomic(path, outString, { encoding: "utf-8"});
            promise.then(
              function saveSuccess(byteCount) {
                util.logDebug ('successfully saved ' + topMenu.Entries.length + ' bookmarks [' + byteCount + ' bytes] to file');
              },
              function saveReject(fileError) {  // OS.File.Error
                util.logDebug ('saveCustomMenu error:' + fileError);
              }
            );
          }
          catch (ex) {
            util.logException('MenuOnTop.TopMenu.saveCustomMenu()', ex);
          }
        },
        function backupFailure(fileError) {
          util.logDebug ('promiseBackup error:' + fileError);
        }
      )
    }
    catch(ex) {
      util.logException('MenuOnTop.TopMenu.saveCustomMenu()', ex);
    }
        
  },
  
  addCustomMenuItem: function addCustomMenuItem(menu) {
    alert('To do:  add custom menu items...');
  }
  
};  // TopMenu


