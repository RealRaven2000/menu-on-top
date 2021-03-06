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
    # was auto-updated to 0.9.8.1 signed by AMO
    
  1.0 - 12/10/2015
    # You can now specify a space for dragging the window if you are using the option "show menu in titlebar"
    # Added lop-left bookmark feature   
    # Added separate color choices for hover / active menu items
    # New theme "Australis Redesigned"
    # Improved layout of settings dialog
    
	1.1 - 17/10/2015
    # improved instant loading of settings on update
    # added icons for firefox, thunderbird, earlybird, Halloween
		# Font size and bold attribute for custom menuitem.
    # enabling Custom Menu will show avatar icon instantly
		
  1.2 - 11/01/2016
		# fixed global let which breaks MenuOnTop in Firefox 44
		
	1.3 - 10/05/2016
	  # Removed caption buttons space (right of calendar buttons) in Thunderbird under Windows
		# Added remote port label for developers
		# Fixed "about" tabs to open in content tabs from Firefox 43.0
		# Tb 48.0 Support for adding the new preferences tab to bookmark menu
		# known issue: avatar icon not working if profile name contains special characters (space?)
		
	1.4 - 09/03/2017
	  # add spacing to caption bar when in maximized mode
		# added Pale Moon support
		# added setting for decreasing top-spacing of tab bar in non-maximized mode
		# Moved support pages to quickfolders.org
		# make sure that icon height overrides max menu height
		
	1.5 - 04/11/2017
	  # made sure the new tabbar top-spacing setting from version 1.4 works in Firefox too.
		# added Italian Locale (thanks to Leopoldo Saggin at Babelzilla)
		# added Chinese Locale (thanks to YFdyh000 at Babelzilla)
		# added Swedish Locale (thanks to A. Regnander at Babelzilla)
		# Added option for font shadows
		# Firefox Pale Moon: fix tab opener for bookmarks
		# In Firefox: If a tab is already open in the current window, set focus to it instead of opening a duplicate.
		
  1.6 - 12/11/2017
    # Completed Swedish Locale (thanks to A. Regnander at Babelzilla)
		
	1.7 - 26/11/2017
		# Removed obsolete references to nsIPrefBranch2. These would break when reading settings in Thunderbird 57.
		# Removed version options from script tags which also broke settings in Thunderbird 57 and later.
		# Fixed storing of some default settings (top margin, left margin)
		
	1.8.1 - 27/04/2018
	  # Added Shim modules for backwards compatibility for Thunderbird versions < 51
		# Added Spanish Locale (thanks to strel at Babelzilla)
		# Added Waterfox, Firefox Quantum and some Pepe avatars
		# Made compatible for Thunderbird 60.* (2018 ESR Release)
	  # Updated ES locale
		
	1.9 - 27/05/2018
		# Added more color flavors (May Green, Cloud Blue, Rose Pink, Photon Bright & Dark)
    # Added menu border style options (solid, hidden, inset, outset, groove, ridge, dotted, dashed, double)
		# changed Radius settings from em to px because Thunderbird removed the em binding in XUL input items
		# Added New Avatar Icon for Thunderbird 60
		# Added function to sanitise the CSS for menu backgrounds 
		  (removes background: and semicolon when pasting rules from colorzilla.com)
		
	1.10 - 15/10/2018
	  # Made compatible with Thunderbird 63 - replaced listbox with richlistbox
		
	1.11 - 19/02/2019
	  # Made compatible with Thunderbird 66 - removed some errors with missing default prefs and fixed statusbar icon
    # Added new darker orange color choice 'fire'
    # Improved positioning of status bar icon when it is configured 
    # Added cleanup code that hides the Status bar icon when uinstalling / updating.

  1.13 - 21/02/2019 - Released for Interlink
    # Resolved Positioning problems in Interlink Mail Client.
		
	1.14 - 06/05/2019
	  # Make compatible with Thunderbird beta 67.0
		# Replaced all colorpickers with HTML elements (standard color picker, OS dependant).
		# Replaced all groupbox elements with HTML fieldsets
		# Replaced getCharPref with getStringPref
		# Added advanced debug settings

	1.14.1 - 07/05/2019
	  # removed javascript console warnings caused by MenuOnTop unnecessarily running on dialog windows.

  1.15 - 17/06/2019
	  # Improved loading UI on Thunderbird 68 beta.
		# Support for new HTML color picker which replaces the XUL version of same in modern versions orf Thunderbird.
		# Support for new Preferences system, but backwards compatible with Thunderbird 60.
		# Replacement of document.createElement with createXULElement
		# Improved loading custom icon (avatar) in modern versions of Thunderbird.
		
	1.16 - WIP
    # Thunderbird 70 Compatibility: 
		#   Removed QueryInterface to nsIDOMChromeWindow and nsIInterfaceRequestor
		# fixed a missing entity in Italian locale
		
*/
Components.utils.import("resource://gre/modules/Services.jsm");
//  { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

var EXPORTED_SYMBOLS = [ 'MenuOnTop' ],
    MenuOnTop = {
  Id: "menuOnTop@agrude.com",
  _Version: "",
	_CurrentBuild: "1.15", 
  mAppName: null,
	mAppNameFull: "",
  CSSid: "menuOnTop-style",
  CustomMenuId: "menuOnTop-menu-Custom",
  CustomMenuPopupId: "menu_menuOnTopPopup",
	loadCSS: function loadCSS(window) {
		const util = this.Util;
		// Inject CSS for themes with the menubar under the tabbar, which looks terrible after moving the toolbar up
		try {
			let document = window.document,
          txt = "################################" +'\n'
              + "###    MenuOnTop.loadCSS()   ###" +'\n'
              + "################################";
			util.logDebug (txt);
			let styleElement = document.createElementNS("http://www.w3.org/1999/xhtml", "style");
			/*
				document.createXULElement ? 
				document.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', "style");
				document.createElementNS("http://www.w3.org/1999/xhtml", "style");
				*/
			var css = document.getElementById(util.MainWindowId).appendChild(styleElement);
			css.setAttribute("type", "text/css");
			css.id = this.CSSid;
			
			let Prefs = this.Preferences,
			    m = '-' + (Math.abs(Prefs.negativeMargin)).toString(),
			
			    shadowString = Prefs.isTextShadow ? 'text-shadow: 1px 1px 1px rgba(128, 128, 128, 0.6) !important;' : '',
			    maxHeightString = Prefs.maxHeight ? 'max-height: ' + Prefs.maxHeight + 'px;' : '',
			    menuItemString = (shadowString + maxHeightString) ? '#' + util.MenubarId + ' > menu  {' + shadowString + maxHeightString + '}' : '',
			    menuMarginTop = 'margin-top: ' + Prefs.menuMargin + 'px !important;',
			    menuMarginLeft = 'margin-left: ' + Prefs.menuMargin_left + 'px !important;',
			    menuRadiusValue = Prefs.menuRadiusValue,
			    left  = Prefs.menuRadiusLeft ? menuRadiusValue + 'px' : '0',
			    right  = Prefs.menuRadiusRight ? menuRadiusValue + 'px' : '0',
			    radiusString = 'border-radius: ' + left + ' ' + right + ' ' + right + ' ' + left +' !important;',
          tw = Prefs.menuBorderWidth.toString(), // allow for full 4 falue syntax, e.g. 1px 1px 1px 0  to avoid left border
          marginSelector = (util.Application == 'Thunderbird') ? 
                           ' #messengerWindow[tabsintitlebar][sizemode="normal"] #mail-toolbar-menubar2' : 
                           ' #main-window[tabsintitlebar][sizemode="normal"] #navigator-toolbox > #toolbar-menubar',
          tmargin = util.getTabInTitle() ? (marginSelector + ' { margin-right: ' + Prefs.toolbarMarginRight.toString() + 'px !important;}') : '',
          paddingSelector = (util.Application == 'Thunderbird') ? 
                           ' #messengerWindow[tabsintitlebar][sizemode="maximized"] #mail-toolbar-menubar2' : 
                           ' #main-window[tabsintitlebar][sizemode="maximized"] #navigator-toolbox > #toolbar-menubar',
					tpadding = util.getTabInTitle() ? (paddingSelector + ' { padding-right: 200px !important;}') : '',
					titlebarplaceholder = util.getTabInTitle() ? ' #messengerWindow:[tabsintitlebar] .titlebar-placeholder { visibility: collapse; }' : '';
      tw = tw.indexOf('px')<0 ? tw +'px' : tw;
			let borderWidth = 'border-width: ' + tw + ' !important;',
			    borderStyle = borderWidth
			                + 'border-style: ' + Prefs.menuBorderStyle + ' !important; ' 
											+ 'border-color: ' + Prefs.menuBorderColor + ' !important;',
			    smallIconSize = Prefs.iconSizeSmall ? Prefs.iconSizeSmall + 'px' : 'auto',
			    normalIconSize = Prefs.iconSizeNormal ? Prefs.iconSizeNormal + 'px' : 'auto';
			if (Prefs.isForceIconSize) {
			  smallIconSize += ' !important';
				normalIconSize += ' !important';
			}
			let icsSmall = (smallIconSize.indexOf('auto')==0) ? '' : ('toolbar[iconsize="small"].chromeclass-menubar toolbarbutton.toolbarbutton-1 > image.toolbarbutton-icon { width: ' + smallIconSize + ';  height: ' + smallIconSize + '; } '),
			    icsNormal = (normalIconSize.indexOf('auto')==0) ? '' : ('toolbar:not([iconsize="small"]).chromeclass-menubar toolbarbutton.toolbarbutton-1 > image.toolbarbutton-icon { width: ' + normalIconSize + ';  height: ' + normalIconSize + '; } '),
			    dropDownSmall =  (smallIconSize.indexOf('auto')==0) ? '' : ('toolbar[iconsize="small"].chromeclass-menubar toolbarbutton.toolbarbutton-menubutton-button > image.toolbarbutton-icon { width: ' + smallIconSize + ';  height: ' + smallIconSize + '; } '),
			    dropDownNormal = (normalIconSize.indexOf('auto')==0) ? '' : ('toolbar:not([iconsize="small"]).chromeclass-menubar toolbarbutton.toolbarbutton-menubutton-button > image.toolbarbutton-icon { width: ' + normalIconSize + ';  height: ' + normalIconSize + '; } '),
			    menubar = Prefs.menuTransparent ? 
			      '#'+ util.ToolbarId +':-moz-lwtheme { background-color:transparent !important; background-image: none !important;} ' 
						+ '#'+ util.ToolbarId +':not(:-moz-lwtheme) { background-color:transparent !important; background-image: none !important;} '
						: ''; // linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5) 50%); 
			
			// Prefs.isMenuShadow // later!
      /**** COLORS ****/
			// linear-gradient(to bottom, rgba(255,255,255,0.5),rgba(255,255,255,0.5))
      // override border-top-style!
      let backgroundString = '#menubar-items > #' + util.MenubarId + '[id] { background:' + Prefs.menuBackground + ' !important;'
            + borderStyle 
            + radiusString 
            + '  min-height:' + Prefs.maxHeight + 'px;} ',
			    col = Prefs.menuFontColor,
			    colorString = col ?  '#' + util.MenubarId + ' > menu > label {color: ' + col + ' !important;} ' : ''; 
			col = Prefs.menuFontColorHover;
			colorString += col ?  '#' + util.MenubarId + ' > menu[_moz-menuactive="true"]:not([open="true"]):not([disabled="true"]) > label {color: ' + col + ' !important;} ' : ''; 
			col = Prefs.menuFontColorActive;
			colorString += col ?  '#' + util.MenubarId + ' > menu[open="true"] > label {color: ' + col + ' !important;} ' : ''; 
      let backgroundStringHover = 
        '#menubar-items > #' + util.MenubarId + '[id] menu[_moz-menuactive="true"]:not([open="true"]):not([disabled="true"]) { background-image:' + Prefs.menuBackgroundHover + ' !important;} ',
          backgroundStringActive = 
        '#menubar-items > #' + util.MenubarId + '[id] menu[open="true"]:not([disabled="true"]) { background-image:' + Prefs.menuBackgroundActive + ' !important;} '

			// Inject some css!
			// we override min-height for charamel!
			let isInterlink = (util.ApplicationName == 'Interlink');

			
			// chrome://messenger/skin/primaryToolbar.css
      let cssCode = '',
          ordinalTb = '',
					tabbarMargin = 'margin-top: ' + Prefs.tabbarMargin + 'px !important;';
      if (util.Application=='Thunderbird') {
				if (util.ApplicationName =='Interlink') {
					// no reordering necessary.
				}
				else {
          // menu bar on top:
          ordinalTb = '-moz-box-ordinal-group: 10 !important;';
          if (prefs.getBoolPref('riseOfTools')) {
            // Tools
            cssCode	+= '#mail-bar3{-moz-box-ordinal-group: 20 !important;} ';
            // Tabs
            cssCode += '#tabs-toolbar{-moz-box-ordinal-group: 30 !important;} ';
            util.riseOfTools(document, true);
          }
          else {
            // Tabs
            cssCode += '#tabs-toolbar{-moz-box-ordinal-group: 20 !important;} ';
            // Tools
            cssCode	+= '#mail-bar3{-moz-box-ordinal-group: 30 !important;} ';
            util.riseOfTools(document, false);            
          }
				}
      }
			
			// note Interlink has toolboxId = #mail-toolbox
			cssCode +=  ((util.Application == 'Thunderbird') ?
			  ' #' + util.MainWindowId + '[tabsintitlebar][sizemode="normal"] > #' + util.ToolboxId + ' > #tabs-toolbar '
				:
				' #toolbar-menubar:not([autohide=true]) ~ #TabsToolbar:not([inFullscreen]),' +
        ' #toolbar-menubar[autohide=true]:not([inactive]) ~ #TabsToolbar:not([inFullscreen])')
				+ ' {' + tabbarMargin + '} '
				;
			cssCode +=icsSmall +
                icsNormal +
                dropDownSmall + 
                dropDownNormal +
                menubar +
                '.chromeclass-menubar .remote-gloda-search{margin:1px 2px; } ' +
                '#'+ util.ToolbarId +' {' + ordinalTb +' border-color: transparent !important;} ' +
                '#'+ util.ToolbarId +' toolbarbutton {border-color: transparent !important;} ' +
                '#'+ util.ToolbarId +':not([inactive]) {margin-top: ' + m + 'px !important;} ' +
                colorString + 
                backgroundString +
                backgroundStringHover +
                backgroundStringActive +
                '#menubar-items > #' + util.MenubarId + '[id][style] {' + borderWidth + '} ' +
                '#menubar-items:not(:-moz-lwtheme){ background-color: transparent !important; } ' + // Nautipolis!
                '#menubar-items > menubar { background: none; ' + menuMarginTop + '; ' + menuMarginLeft +'; } ' + // TT deepdark!
                '#' + util.ToolboxId + ' > #'+ util.ToolbarId +':not(:-moz-lwtheme) { background-color: transparent !important; background-image:none; } ' +
                menuItemString + 
								tpadding +
                tmargin,
								titlebarplaceholder;
      if (Prefs.isCustomMenuIcon) {

        let Id = this.CustomMenuId;
        cssCode += " #" + Id + " > image { width:" + Prefs.customMenuIconSize + "px; height:" + Prefs.customMenuIconSize + "px; margin-left: 5px; }";
        if (Prefs.getBoolPref('customMenu.label.specialFont')) {
          cssCode += " #" + Id + " > label { "
            + ((Prefs.getBoolPref('customMenu.label.bold')) ? "font-weight: bold; " : "")
            + "font-size:" + Prefs.getIntPref('customMenu.label.size') + "pt; } ";
        }
      }

      // apply all styles
			css.appendChild(document.createTextNode(cssCode));
      util.logDebug ("Appended CSS: " + cssCode);
      this.forceIconSize(window);
      // Avatar
      this.setCustomIcon(window, Prefs.customMenuIconURL);
			let controlsPlaceholder = document.getElementById("titlebar-placeholder-on-TabsToolbar-for-captions-buttons");
			if (controlsPlaceholder) {
				controlsPlaceholder.collapsed=true;
			}
		}
		catch (ex) {
			this.Util.logDebug ("MenuOnTop.loadCSS() failed\n" + ex);
		}
	},
	
	resetCSS: function resetCSS(window) {
		try {
			this.Util.logDebug ("MenuOnTop.resetCSS()...");
			let document = window.document, 
          styleId = this.CSSid,
			    css = document.getElementById(styleId);
      if (css)
        css.parentNode.removeChild(css);
      else
        this.Util.logDebug ("Could not find the css style element:" + css);
			let controlsPlaceholder = document.getElementById("titlebar-placeholder-on-TabsToolbar-for-captions-buttons");
			if (controlsPlaceholder) controlsPlaceholder.collapsed=false;			
		}
		catch (ex) {
			this.Util.logDebug ("MenuOnTop.resetCSS() failed\n" + ex);
		}
  } ,
	
	setEventAttribute: function setEventAttribute(element, eventName, eventAction) {
	  // workaround to lower number of warnings in addon validation
		element.setAttribute(eventName, eventAction);	
	} ,
  
  makeMenuItem : function makeMenuItem(doc, url, label, cmdType) {
		const util = this.Util;
    let menuitem = doc.createXULElement ? doc.createXULElement('menuitem') : doc.createElement('menuitem'),
        className = 'menuitem-iconic',
        tm;
    // get to the original MenuOnTop object (of the main window):
    switch (cmdType) {
      case "calendar":
			  let cal;
				try {
					cal = doc.getElementById('calendar-tab-button');
					if (cal) {
						label = cal.getAttribute('title');
						tm = doc.getElementById('tabmail');
						menuitem.addEventListener("command", function(event) { 
									tm.openTab('calendar', { title: label });
								}, false);
					}
				}
				catch(ex) {
					
				}
				finally {
					if (!cal) {
						label = "Calendar (button) not Available";
						menuitem.setAttribute("disabled", "true");
					} 
				}
        className += ' MOT_calendar';
        break;
      case "browser":
        menuitem.addEventListener("command", function(event) { 
          util.openURLInTab(url); //event.target.ownerDocument.defaultView.
          }, false);
        className += ' MOT_browser';
        break;
      case "message":
        menuitem.addEventListener("command", function(event) { 
          util.openMessageFromUri(url, event); 
          }, false);
        className += ' MOT_mailmessage';
        break;
			case "preferencesTab":
				// break;
      case "contentTab.about":
        // the about url is in url
        let tabParams = {
              contentPage: url,
              clickHandler: "specialTabs.aboutClickHandler(event);"
            };
        switch (util.Application) {
				  case 'Thunderbird':
						tm = doc.getElementById('tabmail');
						menuitem.addEventListener("command", function(event) { 
							tm.openTab("contentTab", tabParams);
							}, false);
						break;
          case 'Firefox':
						let filename = url.replace(":","").replace("?","").replace("=","");
						if (util.openURLInTab) {  // use a content tab
						  menuitem.addEventListener("command", function(event) { 
									util.openURLInTab(url);
								}, false);
						}
						else {
							menuitem.addEventListener("command", function(event) { 
								util.MainWindow.openDialog("chrome://viewabout/content/dialogs/"+filename+".xul", filename, "chrome,resizable=yes,width=800,height=500,centerscreen"); 
								}, false);
						}
						break;
        }
				if (cmdType=='preferencesTab' || url=='about:preferences')
					className += ' MOT_prefs';
        else
					className += ' MOT_about';
        break;
      case "addon":
        switch(url) {
          case 'stationery':
            className += ' MOT_stationery';
            menuitem.addEventListener("command", function(event) { 
              let win = util.MainWindow;
              if (win.Stationery)
                win.Stationery.showOptions();
              else
                Services.prompt.alert(null, 'MenuOnTop', 'Could not find Stationery - is Stationery installed?');
            }, false);
            break;
          case 'thunderstats':
            className += ' MOT_thunderstats';
            menuitem.addEventListener("command", function(event) { 
              let win = util.MainWindow;
              if (win.miczThunderStatsButton)
                util.MainWindow.miczThunderStatsButton.onCommand();
              else
                Services.prompt.alert(null, 'MenuOnTop', 'Could not find miczThunderStatsButton - is ThunderStats installed?');
            }, false);
            break;
          default:
            className += ' MOT_addon';
            break;
        }
        break;
      case "folder":
        menuitem.addEventListener("command", function(event) { 
          util.openFolderFromUri(url);
        }, false);
        className += ' MOT_mailfolder';
        break;
      case "function": // for adding custom functions / commands
        menuitem.addEventListener("command", url, false);
        className += ' MOT_function';
        break;
      default:
        menuitem.addEventListener("command", 
          function() { 
            Services.prompt.alert(null, 'MenuOnTop - makeMenuItem', 'This bookmark type is not currently supported: ' + cmdType); 
          }, 
          false);
        break;
    }
    menuitem.setAttribute('label', label);
    menuitem.className = className;
    return menuitem;
  } ,
  
  deconstructMenu: function deconstructMenu(doc, menu) {
		const util = this.Util;
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
      util.logDebug('deconstructMenu()');
      removeChildren('menuitem');
      removeChildren('menuseparator');
    }
    catch(ex) {
      util.logException('deconstructMenu()', ex);
    }
  } ,
  
  populateMenu: function populateMenu(doc, menu) {
		const util = this.Util,
		      topMenu = this.TopMenu,
					_mot = this,
					createElement = doc.createXULElement ? doc.createXULElement.bind(doc) : doc.createElement.bind(doc);
    try {
      if (!menu) {
        menu = doc.getElementById(this.CustomMenuId);
      }
      const getBundleString = util.getBundleString.bind(util);
      if (!menu) {
        util.logDebug('populateMenu() - menu not active, so early exit!');
        return;
      }
      util.logDebug(
          '******************************\n'
        + '** populateMenu()  ' + menu.id + '\n'
        + '******************************');
      
      this.deconstructMenu(doc, menu);
      
      let menuPopup = doc.getElementById(this.CustomMenuPopupId);
      if (!menuPopup) {
        menuPopup = createElement('menupopup');
        menuPopup.id = this.CustomMenuPopupId;
      }
      
      menu.appendChild(menuPopup);
      for (let i = 0; i < topMenu.Entries.length; i++) {
        let entry = topMenu.Entries[i];
        menuPopup.appendChild(this.makeMenuItem(doc, entry.url, entry.label, entry.bookmarkType));
      }
      
      // test test test
      // for bookmarks handling, read
      // http://mxr.mozilla.org/mozilla-central/source/browser/base/content/browser-places.js#640
      const ellipsis = "\u2026".toString();
      menuPopup.appendChild(createElement('menuseparator')) ;
			let lblAddItem = (util.Application == 'Thunderbird') ?
           			getBundleString('menuontop.custommenu.addcurrentitem', 'Add current Item' + ellipsis) :
           			getBundleString('menuontop.custommenu.addcurrentpage', 'Add current Webpage' + ellipsis),
					lblOptions = getBundleString('menuontop.custommenu.options', 'Menu On Top Options' + ellipsis);
			
      menuPopup.appendChild(
				this.makeMenuItem(
					doc, 
					function() { 
						_mot.TopMenu.appendBookmark(menuPopup); 
					}, 
					lblAddItem,  
					'function'
				)
      ); // add my own command
      menuPopup.appendChild(
				this.makeMenuItem(
					doc, 
					function(evt) { 
						_mot.showOptions(evt); 
					},
					lblOptions, 'function'
				)
      ); // add my own command
        
      util.logDebug('populateMenu() ENDS');
    }
    catch(ex) {
      util.logException('populateMenu()', ex);
    }
  } ,
  
  showCustomMenu: function showCustomMenu(win, fromOptions) {
		const prefs = this.Preferences,
		      util = this.Util,
					_mot = this;
    let display = prefs.isCustomMenu,
        menuId = this.CustomMenuId, 
        doc = win.document,
        menubar = doc.getElementById(util.MenubarId),
        label = prefs.customMenuLabelTitle;
    util.logDebug('showCustomMenu - display = ' + display);
    // create a menu item to the left of file menu
    if (menubar) {
      if (display) {
        let menu = doc.getElementById(menuId);
        if (!menu) {
          menu = doc.createXULElement ? doc.createXULElement('menu') : doc.createElement('menu');
          // menu.id=menuId;
          menu.setAttribute("id", menuId);
        }
        // refresh label
        menu.className = "menu-iconic";
        menu.setAttribute("label", label);
        // we must insert the menu into the document first!
        menubar.insertBefore(menu, menubar.firstChild);
        
        // menu.collapsed = false;
        // empty will be shown as collapsed
        this.TopMenu.loadCustomMenu(fromOptions).then(
          function onSuccess() {
            util.logDebug('showCustomMenu - after loadCustomMenu - populate');
            _mot.populateMenu(doc, menu);
						menu.style.visibility = "visible";
          },
          function onFailure(ex) {
            util.logDebug('showCustomMenu - after loadCustomMenu - failure:\n' + ex);
          }
        );
      }
      else { // remove it if it exists
        let menu = doc.getElementById(menuId);
        if (menu)
          menubar.removeChild(menu);
      }
    }  
  } ,
  
  hideCustomMenu: function hideCustomMenu(win) {
    let doc = win.document,
        menuId = "menuOnTop-menu-Custom",
        menubar = doc.getElementById(this.Util.MenubarId),
        menu = doc.getElementById(menuId);
    if (menu)
      menubar.removeChild(menu);
  } ,
  
  setCustomIcon: function setCustomIcon(win, iconURL) {
		const prefs = this.Preferences;
		const util = this.Util;
    let menuItem = win.document.getElementById('menuOnTop-menu-Custom');
    if (menuItem) {
      if (prefs.isCustomMenuIcon) {
        util.logDebug('Setting avatar icon, URL: ' + iconURL);
        try {
          if (iconURL) {
            let cssUri = '';
            if (iconURL) {
              if (iconURL.indexOf('url')==0)
                cssUri = iconURL;
              else
                cssUri = 'url(' + iconURL + ')';
            }
            util.logDebug('Css URI: ' + cssUri);
            menuItem.style.listStyleImage = cssUri; // direct styling!
          }
          else
            menuItem.style.listStyleImage = 'none';
        }
        catch(ex) {
          util.logException('setCustomIcon()', ex);
        }
      }
      else {
        if (menuItem.style.listStyleImage)
          util.logDebug('Removing avatar icon...');
        menuItem.style.listStyleImage = 'none';
      }
    }
  },
  
	ensureMenuBarVisible: function ensureMenuBarVisible(win) {
		// see also  c-c/source/suite/common/utilityOverlay.js
		// goToggleToolbar  
		const prefs = this.Preferences,
		      util = this.Util;
		util.logDebug('ensureMenuBarVisible()');
    try {
      let id = util.ToolbarId,
          doc = win.document,
          toolbar = doc.getElementById(id);
      util.logDebug('toolbar (' + id +') = ' + toolbar);
      let isChange = false,
          hidingAttribute = "autohide",
          attribValue = toolbar.getAttribute("autohide") ;
      
      if ( attribValue == "true" ) {
        let hidden = "false"; // aEvent.originalTarget.getAttribute("checked") !=
        toolbar.setAttribute(hidingAttribute, hidden);
        win.setTimeout(
          function() {
						if (doc.persist)
							doc.persist(toolbar.id, hidingAttribute);
            util.logDebug('ensureMenuBarVisible() - after document.persist();');
          }
        );
      }
      this.showCustomMenu(win);
    }
    catch(ex) {
      util.logException('ensureMenuBarVisible()', ex);
    }
	} ,
  
  forceIconSize: function forceIconSize(win) {
		const prefs = this.Preferences;
		const util = this.Util;
    try {
      let id = util.ToolbarId,
          isForce = prefs.isForceIconSmall;
      util.logDebug('forceIconSize()\nForce Small = ' + isForce);
      let toolbar = win.document.getElementById(id);
      if (toolbar) {
        util.logDebug('forceIconSize()\nFound toolbar, changing iconsize attribute...');
        if (prefs.isForceIconSmall) {
          toolbar.setAttribute("menuOnTop-forceSmall", "true");
          toolbar.setAttribute("iconsize", "small");
        }
        else {
          if (toolbar.getAttribute("menuOnTop-forceSmall")) {
            toolbar.setAttribute("iconsize", ""); // let's not set it at all.
          }
        }
      }
    }
    catch (ex) {
      util.logException("forceIconSize()", ex);
    }
  } ,
	
	// This must contain the complete list of pref from the defaults folder to work!
  // replace pref1.pref2 with pref1_pref2
	defaultPREFS : {
		customMenu: false,
		customMenu_icon_size: 20,
		customMenu_icon_url: '',
		customMenu_icon_usee: false,
		customMenu_label_bold: false,
		customMenu_label_size: 9,
		customMenu_label_specialFont: false,
		customMenu_title: 'MenuOnTop',
		customMenu_title_remote: false,
		debug: false,
		debug_appStart: false,
		debug_customMenu: false,
		debug_default: false,
		debug_optionsDialog: false,
		flavor_coloronly: false,
		iconSize_forceSmall: true, // new setting to avoid smudged icons in menu bar!
		iconSize_forced: false,
		iconSize_normal: 16,
		iconSize_small: 16,
		maxHeight: 20,
		menuBackground: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))",
		menuBackground_active: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))",
		menuBackground_hover: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))",
		menuBorderColor: "#FFFFFF",
		menuBorderStyle: "solid",
		menuBorderWidth: "0",
		menuFontColor: "rgb(15,15,15)",
		menuFontColor_active: "rgb(15,15,15)",
		menuFontColor_hover: "rgb(15,15,15)",
		menuMargin: 6,
		menuMargin_left: 2,
		menuRadiusLeft: false,
		menuRadiusRight: true,
		menuRadiusValue: "4px",
		menubar_transparent: true,
		negativeMargin: 0,
		statusIcon: true,
		tabbarMargin: 3,
		textShadow: false,
		toolbarMargin_right: 350,
  },
	
  showOptions: function showOptions(evt, win) {
		const util = this.Util,
          windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
           .getService(Components.interfaces.nsIWindowMediator),
          addonWin = windowManager.getMostRecentWindow("addon:MenuOnTop"); // use windowtype to set this
    if (addonWin) {
      addonWin.focus();
			return;
		}	
		
    if (!win) {
			if (evt)
				win = evt.view.window;
			else
				win = window;
		}
    
		let optionsDialog =
		 util.versionGreaterOrEqual(util.AppverFull, "66") ?
			 "chrome://menuontop/content/menuOnTop_options66.xul" :
			 "chrome://menuontop/content/menuOnTop_options.xul";
			 
		win.openDialog(optionsDialog,'menuontop-options','chrome,titlebar,centerscreen,resizable,alwaysRaised');
  } ,
  
	showAddonButton :function showAddonButton(mainWindow) {
		const util = this.Util;
		util.logDebug ("MenuOnTop.showAddonButton()...");
		if (!mainWindow) return;

		let buttonContainer = util.ButtonPanel(mainWindow);  
		// Get the anchor for "overlaying" but make sure the UI is loaded
		if (!buttonContainer) return;

		// Place the new button after the last button in the top set
		let doc = mainWindow.document,
				createElement = doc.createXULElement ? doc.createXULElement.bind(doc) : doc.createElement.bind(doc),
		    panel = createElement("statusbarpanel"),
		    button = createElement("toolbarbutton");
		panel.setAttribute("id", "menuOnTop-statusPanel");
		panel.classList.add("statusbarpanel");
		
		button.setAttribute("id", "menuOnTop-statusButton");
		button.setAttribute("label", "");
		button.setAttribute("tooltiptext", "Menu on Top - click for options");
		button.setAttribute("class", "statusbarpanel-iconic");
		button.style.listStyleImage = "url(chrome://menuontop/content/menuOnTop16.png)";
		// button.style.mozImageRegion = "rect(0px, 16px, 16px, 0px)"; // this probably won't work as it isn't declared in CSS2 ElementCSSInlineStyle.style

		let menuOnTop = this; // closure this
		button.addEventListener("click", function() {
      util.logDebug('click');
      menuOnTop.showOptions(null, mainWindow);
		}, false);

		let resizer = doc.getElementsByClassName("statusbar-resizerpanel"),
		    before = resizer.length ? resizer[0] : buttonContainer.lastChild;
		buttonContainer.insertBefore(panel, before);
		panel.appendChild(button);
		// buttonContainer.appendChild(panel);
	} ,
	
	hideAddonButton : function hideAddonButton(window) {
		this.Util.logDebug ("MenuOnTop.hideAddonButton()...");
		if (!window) return;
		let button = true, panel = true;
		while (button) {
			button = window.document.getElementById("menuOnTop-statusButton");
			if (button)
				button.parentNode.removeChild(button);
		}
		while (panel) {
			panel = window.document.getElementById("menuOnTop-statusPanel")
			if (panel)
				panel.parentNode.removeChild(panel);
		}
	
	} ,
  
  get Application() {
		// test
		return 'Thunderbird';
		if (null == this.mAppName) {
			const CI = Components.interfaces;
			var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
											.getService(CI.nsIXULAppInfo);
			const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
			      PALEMOON_ID = "{8de7fcbb-c55c-4fbe-bfc5-fc555c87dbc4}",
			      THUNDERBIRD_ID = "{3550f703-e582-4d05-9a08-453d09bdfdc6}",
			      SEAMONKEY_ID = "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}",
			      POSTBOX_ID = "postbox@postbox-inc.com";
			this.mAppNameFull = appInfo.name;
			switch(appInfo.ID) {
				case PALEMOON_ID:
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
	
	get ApplicationName() {
		if (!this.mAppNameFull) {
			const CI = Components.interfaces;
			var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(CI.nsIXULAppInfo);
			this.mAppNameFull = appInfo.name;
		}
		return this.mAppNameFull;
	}
	
};  // MenuOnTop

// Components.utils.import("resource://gre/modules/osfile.jsm")
// MenuOnTop is undefined?


MenuOnTop.Util = {
	mPlatformVer: null,
	get util() {
    return this._mot.Util;
	} ,
	get prefs() {
    return this._mot.Preferences;
	} ,
  get Application() {
    return this._mot.Application;
  } ,
	
	get ApplicationName() {
    return this._mot.ApplicationName; // the real name - e.g. Palemoon, Interlink
	} ,
  
  get AppVersion() {
		var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
						.getService(Components.interfaces.nsIXULAppInfo);
		return parseFloat(appInfo.version);
  } ,
	
	get PlatformVersion() {
		if (null==this.mPlatformVer)
			try {
				let appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
				this.mPlatformVer = parseFloat(appInfo.platformVersion);
			}
			catch(ex) {
				this.mPlatformVer = 1.0; // just a guess
			}
		return this.mPlatformVer;
	},
	
	get AppverFull() {
		let appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
						.getService(Components.interfaces.nsIXULAppInfo);
		return appInfo.version;
	},	
	
	versionGreaterOrEqual: function(a, b) {
		/*
			Compares Application Versions
			returns
			- is smaller than 0, then A < B
			-  equals 0 then Version, then A==B
			- is bigger than 0, then A > B
		*/
		let versionComparator = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
														.getService(Components.interfaces.nsIVersionComparator);
		return (versionComparator.compare(a, b) >= 0);
	} ,
	
	get MailUtils() { // wrapper!
		const util = MenuOnTop.Util,
		      isTb66 = util.versionGreaterOrEqual(util.AppverFull, "61"),
		      mailUtilsName =
			isTb66 ?
			 "MailUtils.jsm" : 
       "MailUtils.js"; // why o why? 
	
		var { MailUtils } = 
			isTb66 ?
				ChromeUtils.import("resource:///modules/" + mailUtilsName) :
				Components.utils.import("resource:///modules/" + mailUtilsName);		
			
		return MailUtils;
	},
	
	simplifyVersion: function simplifyVersion(verStringOrNum) {
		function strip(version, token) {
			let cutOff = version.indexOf(token);
			if (cutOff > 0) { 	// make sure to strip of any pre release labels
				return version.substring(0, cutOff);
			}
			return version;
		}
		let ver = verStringOrNum.toString(),
		    pureVersion = strip(ver, 'pre');
		pureVersion = strip(pureVersion, 'beta');
		pureVersion = strip(pureVersion, 'alpha');
		return strip(pureVersion, '.hc');
	},
  
  
  get MainWindowXulId() {
    switch(this.util.Application) {
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
    switch(this.util.Application) {
      case 'Thunderbird':
      case 'Firefox':
        let win = windowManager.getMostRecentWindow(this.util.MainWindowXulId);
        return win;
    }
    return null;
	} ,
  
  get MainWindowId() {
    switch(this.util.Application) {
      case 'Thunderbird':
        return 'messengerWindow';
      case 'Firefox':
			default:
        return 'main-window';
    }
    return '';
  } ,

  get ToolbarId() {
    switch(this.util.Application) {
      case 'Thunderbird':
        return 'mail-toolbar-menubar2';
      case 'Firefox':
        return 'toolbar-menubar';
    }
    return '';
  } ,  
  
  get ToolboxId() {
    switch(this.util.Application) {
      case 'Thunderbird':
			  if (this.util.ApplicationName=='Interlink')
					return 'mail-toolbox';
        return 'navigation-toolbox';
      case 'Firefox':
        return 'navigator-toolbox';
    }
    return '';
  } ,  
  
	get TabInTitleBoolPref() {
		switch (this.util.Application) {
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
	
	MyBundle: null,
	get StringBundle() {
		if (!this.MyBundle) try {
			const bundlePath = "chrome://menuontop/locale/menuontop.properties";
			Components.utils.import("resource://gre/modules/Services.jsm");
			if (Services.strings) {
				this.MyBundle = Services.strings.createBundle(bundlePath);
			}
			let svc = Components.classes["@mozilla.org/intl/stringbundle;1"]
				  .getService(Components.interfaces.nsIStringBundleService);
			this.MyBundle = svc.createBundle(bundlePath)
				  .QueryInterface(Components.interfaces.nsIStringBundle);
		}
		catch (ex) {
			this.logException ("Could not retrieve StringBundle: ", ex);
		}
		
		return this.MyBundle;
	} ,
	
	getBundleString: function getBundleString(id, defaultText) {
		let s="";
		try {
			s= this.StringBundle.GetStringFromName(id);
		}
		catch(e) {
			s= defaultText;
			this.logToConsole ("Could not retrieve bundle string: " + id + "");
		}
		return s;
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
          id = "addon-bar";
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
				// last resort: the main toolbar
        if (!bar) {
          id = "nav-bar";
          bar = win.document.getElementById(id);
        }
        break;
    }
    let txt = "ButtonPanel() returns:"+  bar;
    if (id) {
      txt += '\nDetermined id of button container:' + id;
    }
    this.util.logDebug(txt);
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
  
  checkVersion: function checkVersion(win) {
		const util = this.util;
		let current = this._mot.Version,
        addonId = this._mot.Id;
    util.logDebug('checkVersion() for ' + addonId);
		const platformVer = util.simplifyVersion(util.PlatformVersion);
		/*
		if (platformVer >= 61) { // don't use AddonManager for now
			util.checkFirstRun(MenuOnTop._CurrentBuild);
		}
		else
		*/
    win.setTimeout (function () {
			Components.utils.import("resource://gre/modules/AddonManager.jsm");
			AddonManager.getAddonByID(addonId).then(
				function mot_gotAddon(addon) {
					if (addon.version)
						util.checkFirstRun(addon.version);
					else
						util.checkVersion(); // retry
				}
				,
				function mot_failedAddon(ex) {
					Components.utils.import("resource://gre/modules/Services.jsm");
					Services.prompt.alert(null, 'MenuOnTop - checkVersion', ' AddonManager.getAddonByID promise failed!\n' + ex.toString()); 
					util.logDebug('getAddonByID promise - failed');
				}
			);
    }, 150);
  } ,

  checkFirstRun: function checkFirstRun(ver) {
		const util = this.util;
		let loggedVer = this.prefs.getStringPref('version'),
        freshInstall = false;
    if (util.Version == ver) return; // we have been here!
    util.Version = ver;
    let pureVersion = util.simplifyVersion(ver);
    // assume this is a new installation?
    if (!loggedVer )  // && !prefs.getStringPref('menuBackground')
      freshInstall = true;
    util.logDebug('checkFirstRun() Running version: ' + pureVersion + '   [' + ver + ']\n'
                  + 'logged Version = ' + loggedVer + ' , freshInstall = ' + freshInstall);
    // save current version
    this.prefs.setStringPref('version', pureVersion);
    if (freshInstall)
      util.showHistory();
    else if (pureVersion != loggedVer) {
      util.showHistory(pureVersion);
    }
  } ,
  
  showHistory: function showHistory(ver) {
    let url = 'http://quickfolders.org/menuOnTopHistory.html';
    if (ver) url+= '?version#' + ver;
    this.util.openURL(null, url);
  } ,
  
  get Version() {
    return this._mot._Version;
  } ,
  
  set Version(v) {
    this._mot._Version = v;
  } ,

	lastTime:0,
  
	logTime: function logTime() {
		let timePassed = '',
		    end = new Date();
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
		Components.utils.import("resource://gre/modules/Services.jsm");
		Services.console.logStringMessage("MenuOnTop "
			+ (optionTag ? '{' + optionTag.toUpperCase() + '} ' : '')
			+ this.logTime() + "\n"+ msg);
	},	

  logDebug: function logDebug(msg) {
	  if (this.prefs.isDebug)
			this.logToConsole(msg);	
	},
	
	logDebugOptional: function logDebugOptional(option, msg) {
		if (this.prefs.isDebugOption(option))
			this.logToConsole(msg, option);
	},
	
	logError: function logError(aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags) {
	  let consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	                                 .getService(Components.interfaces.nsIConsoleService),
	      aCategory = '',
	      scriptError = Components.classes["@mozilla.org/scripterror;1"].createInstance(Components.interfaces.nsIScriptError);
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
  
  get mailWindow() {
    var mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                 .getService(Components.interfaces.nsIWindowMediator)
                 .getMostRecentWindow("mail:3pane");
    return mail3PaneWindow;
  } ,
  get mainDocument() {
    if (typeof document != 'undefined') return document;
    let win = this.mailWindow;
    if (win)
      return win.document;
    return null;
  } ,
	
	getTabInfoLength: function getTabInfoLength(tabmail) {
		if (tabmail.tabInfo)
		  return tabmail.tabInfo.length;
	  if (tabmail.tabOwners)
		  return tabmail.tabOwners.length;
		return null;
	} ,	
	
	getTabInfoByIndex: function getTabInfoByIndex(tabmail, idx) {
		if (tabmail.tabInfo)
			return tabmail.tabInfo[idx];
		if (tabmail.tabOwners)
		  return tabmail.tabOwners[idx];
		return null;
	} ,
	
	getBaseURI: function baseURI(URL) {
		let hashPos = URL.indexOf('#'),
				queryPos = URL.indexOf('?'),
				baseURL = URL;
				
		if (hashPos>0)
			baseURL = URL.substr(0, hashPos);
		else if (queryPos>0)
			baseURL = URL.substr(0, queryPos);
		if (baseURL.endsWith('/'))
			return baseURL.substr(0, baseURL.length-1); // match "x.com" with "x.com/"
		return baseURL;		
	} ,
	
	findMailTab: function findMailTab(tabmail, URL) {
		const util = this.util;
		// mail: tabmail.tabInfo[n].browser		
		let baseURL = util.getBaseURI(URL),
				numTabs = util.getTabInfoLength(tabmail);
		
		for (let i = 0; i < numTabs; i++) {
			let info = util.getTabInfoByIndex(tabmail, i);
			if (info.browser && info.browser.currentURI) {
				let tabUri = util.getBaseURI(info.browser.currentURI.spec);
				if (tabUri == baseURL) {
					tabmail.switchToTab(i);
					// focus on tabmail ?
					
					return true;
				}
			}
		}
		return false;
	} ,		
	
  findBrowserTab: function findTab(URL) {
		const util = this.util;
		const Cc = Components.classes,
					Ci = Components.interfaces;
					
		let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator),
		    browserEnumerator = wm.getEnumerator("navigator:browser"),
		    found = false,
				baseURL = util.getBaseURI(URL);
		// more tolerant URL match; cutting off anchors / queryString for better re-using of tabs!
		
		try {
			while (!found && browserEnumerator.hasMoreElements()) {
				let browserWin = browserEnumerator.getNext(),
						tabbrowser = browserWin.gBrowser;

				// Check each tab of this browser instance
				let numTabs = tabbrowser.browsers.length;
				for (let index = 0; index < numTabs; index++) {
					let currentBrowser = tabbrowser.getBrowserAtIndex(index);
					
					if (baseURL == util.getBaseURI(currentBrowser.currentURI.spec)) {
						// The URL is already opened. Select this tab.
						tabbrowser.selectedTab = tabbrowser.tabContainer.childNodes[index];
						// Focus *this* browser-window
						browserWin.focus();
						// reload with querystring #xyz
						if (URL != currentBrowser.currentURI.spec)
							tabbrowser.loadURI(URL);
						found = true;
						break;
					}
				}				
			}
		}
		catch(ex) {
			// a problem occurred
			util.logException("findBrowserTab(" + URL + ")", ex);
		}
		return found;
	} ,	
	
  openURL: function openURL(evt,URL) { 
		if (this.openURLInTab(URL) && null!=evt) {
			evt.preventDefault();
			evt.stopPropagation();
		}
	} ,
	
	openURLInTab: function openURLInTab(URL) {
		const util = this.util;
		try {
			let sTabMode="",
			    wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator),
			    mainWindow = wm.getMostRecentWindow("navigator:browser");
			if (mainWindow) { // Firefox
				if (!util.findBrowserTab(URL))
				  mainWindow.gBrowser.selectedTab = mainWindow.gBrowser.addTab(URL);
				mainWindow.focus();
				return true;
			}

      let doc = this.mainDocument,
			    tabmail = doc ? doc.getElementById("tabmail") : null;
      if (tabmail) { // Tb Content Tab
        this.mailWindow.focus()
				sTabMode = "contentTab";
        let browser = MenuOnTop.TopMenu.getBrowser(); // tabmail.getBrowserForDocument(content);
        tabmail.openTab(sTabMode,
            { contentPage: URL,
              background: false,
              clickHandler: 'specialTabs.siteClickHandler(event);' });  // , new RegExp("^http://quickfolders.org/")
			}
			else
				window.openDialog("chrome://messenger/content/", "_blank",
								  "chrome,dialog=no,all", null,
			  { 
          tabType: "contentTab",
			    tabParams: {contentPage: URL,
			              clickHandler: 'specialTabs.siteClickHandler(event, new RegExp("^http://quickfolders.org/"));', 
                    id:"MenuOnTop_Weblink"}
			  } );
		}
		catch(e) {
			util.logException("openURLInTab(" + URL + ")", e);
			return false;
		}
		return true;
	}	,
  
  openMessage: function (msgHdr, forceMethod)  {
		const util = this.util;
    let doc = util.MainWindow.document,
        tabmail = doc.getElementById("tabmail"),
        method = forceMethod || 'currentTab'; // || prefs.getStringPref('bookmarks.openMethod');
    if (util.Application != 'Thunderbird')
      throw('Cannot open email, application is not supported:' + util.Application);
    // Components.utils.import("resource:///modules/MailUtils.js");
    try {
      if (!msgHdr) return false;
      if ((msgHdr.messageId.toString() + msgHdr.author + msgHdr.subject) == '' 
          && msgHdr.messageSize==0) // invalid message
        return false;
    }
    catch(ex) {
      util.logException('bookmarks.openMessage',ex);
      return false;
    }
    try {
      switch (method) {
        case 'currentTab':
          let mode = tabmail.selectedTab.mode.name; // mode should be 3pane or folder
          util.MailUtils.displayMessageInFolderTab(msgHdr);
          return true;
        case 'window':
          util.MailUtils.openMessageInNewWindow(msgHdr);
          return true;
        default:
          util.logDebug('Unknown bookmarks.open.method: {' + method + '}'); 
          // fall through
        case 'newTab':
          tabmail.openTab('message', {msgHdr: msgHdr, background: false});  
          return true;
      } // switch method
    }
    catch(ex) {
      util.logException('bookmarks.openMessage',ex);
    }
      
    return false;
  },

  // open an email in a new tab
  openMessageFromUri: function openMessageFromUri(messageUri, event) {
		const util = this.util;
    let isAlt, isCtrl, isShift, hdr,
        win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                 .getService(Components.interfaces.nsIWindowMediator)
                 .getMostRecentWindow("mail:3pane");  
		Components.utils.import("resource://gre/modules/Services.jsm");
    if (!win) {
      Services.prompt.alert(null, 'MenuOnTop - openMessageFromUri', 'No open mail window found!'); 
      return;
    }    
    try {
      hdr = win.messenger.messageServiceFromURI(messageUri).messageURIToMsgHdr(messageUri);
    }
    catch(ex) {
      Services.prompt.alert(null, 'MenuOnTop', 
        'Message could not be retrieved - it may have been moved to a different folder?\n'
        + messageUri);
      return;
    }
    
    if (event) {
      isAlt = event.altKey;
      isCtrl = event.ctrlKey;
      isShift = event.shiftKey;
    }
    let method = 'currentTab';
    if (isShift) method = 'window';
    if (isCtrl) method = 'newTab';
    util.openMessage(hdr, method);
  } ,

  openFolderFromUri: function openFolder(uri) {
		const util = this.util;
    const win = util.MainWindow;
    if (!win) return false;
		
    let mailUtils = util.MailUtils,
		    msgFolder = mailUtils.getExistingFolder ?
					mailUtils.getExistingFolder(uri, true) :
				  mailUtils.getFolderForURI(uri, true),
        theTreeView = win.gFolderTreeView;
    theTreeView.selectFolder(msgFolder);
    return true;
  } ,

	getSystemColor: function getSystemColor(sColorString, doc) {
		const util = this.util;
    function hex(x) { return ("0" + parseInt(x).toString(16)).slice(-2); }

		let getContainer = function() {
			return doc.getElementById('mot-options-prefpane');
		}
		
		try {
			if (sColorString.startsWith('rgb')) {
				// rgb colors.
				let components = sColorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/),
				    hexColor = "#" + hex(components[1]) + hex(components[2]) + hex(components[3]); // ignore transparency
				return hexColor;
			}
			
			if (sColorString.startsWith('#') || sColorString=='transparent')
				return sColorString;
			
			let win = this._mot.TopMenu.optionsWindow || util.MainWindow;
			if (!doc) {
				doc = win.document;
			}
			let theColor, // convert system colors such as menubackground etc. to hex
			    d = doc.createXULElement ? doc.createXULElement("div") : doc.createElement("div");
			d.style.color = sColorString;
			getContainer().appendChild(d)
			theColor = win.getComputedStyle(d,null).color;
			getContainer().removeChild(d);

			if (theColor.search("rgb") == -1)
				return theColor; // unchanged
			else {
				// rgb colors.
				theColor = theColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
				let hexColor = "#" + hex(theColor[1]) + hex(theColor[2]) + hex(theColor[3]);
				return hexColor;
			}
		}
		catch(ex) { // Bug 26387
			if (this.prefs.isDebug) debugger;
			this.logException('getSystemColor(' + sColorString + ') failed', ex);
			return "#000000";
		}

	},

	getRGBA: function getRGBA(hexIn, alpha) {
		const util = this.util;
		function cutHex(h) {
			let rv = ((h.toString()).charAt(0)=='#') ? h.substring(1,7) : h;
			return rv.toString();
		}
		function HexToR(h) {
			return parseInt(h.substring(0,2),16);
		}
		function HexToG(h) {
			return parseInt(h.substring(2,4),16);
		}
		function HexToB(h) {
		  return parseInt(h.substring(4,6),16);
		}
		
		let hex = hexIn,
		    isRGB = (hexIn.indexOf('rgb')>=0),
		    isRGBA = (hexIn.indexOf('rgba')>=0);
		if (isRGB) {
		  // inject alpha value:
			let li = isRGBA ?
               hexIn.lastIndexOf(',') :   // replace alpha
			         hexIn.indexOf(')');        // append alpha
			hex = hexIn.substring(0, li) + ',' +  alpha.toString() +')';
			if (!isRGBA)
			  hex = hex.replace('rgb','rgba');
			return hex;
		}
		else {
			try {
        if (hex.charAt(0) == '#')
          parseInt(cutHex(hex),16);
        else
          hex = util.getSystemColor(hex);
			}
			catch(e) {
				hex = util.getSystemColor(hex);
			}
		}
		if (hex) { // 6 digit hex string
			hex = cutHex(hex);
			let r = HexToR(hex).toString();
			let g = HexToG(hex).toString();
			let b = HexToB(hex).toString();
			return "rgba(" + r + ',' + g + ',' + b + ',' + alpha.toString() +')';
		}
		else {
			util.logDebug ("Can not retrieve color value: " + hexIn);
			return "#666";
		}
	},
  
  riseOfTools: function (doc, isRise) {
    let toolbar = doc.getElementById("mail-bar3"),
        newparent = doc.getElementById("navigation-toolbox");
        
    // Move the toolbar
    if (isRise)
      for (let node of newparent.childNodes){
        if (node.id == "tabs-toolbar")
          newparent.insertBefore(toolbar, node);
      }
  }
	
};  // Util

MenuOnTop.Util._mot = MenuOnTop;
// var utilMOT = MenuOnTop.Util;

MenuOnTop.Preferences = {
	service: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),

	getBoolPref: function getBoolPref(term) {
		try {
			return this.service.getBoolPref("extensions.menuontop." + term);
		}
		catch(ex) {
			this.util.logException("getBoolPref(extensions.menuontop." + term + ")", ex);
			return false;
		}
	},
	
  getStringPref: function getStringPref(p) {
		try {
			if (this.service.getCharPref)
				return this.service.getCharPref("extensions.menuontop." + p);
      return this.service.getStringPref("extensions.menuontop." + p);
		}
		catch(ex) {
			this.util.logException("getStringPref(extensions.menuontop." + p + ")", ex);
			return '';
		}
	},
	
	getIntPref: function getIntPref(p) {
		try {
      return this.service.getIntPref("extensions.menuontop." + p);
		}
		catch(ex) {
			this.util.logException("getIntPref(extensions.menuontop." + p + ")", ex);
			return 0;
		}
	},
	
	setBoolPref: function setBoolPref(term, val) {
		try {
			return this.service.setBoolPref("extensions.menuontop." + term, val);
		}
		catch(ex) {
			this.util.logException("setBoolPref(extensions.menuontop." + term + ")", ex);
		}
	},  
  
  setIntPref: function setIntPref(term, val) {
		try {
			return this.service.setIntPref("extensions.menuontop." + term, val);
		}
		catch(ex) {
			this.util.logException("setIntPref(extensions.menuontop." + term + ")", ex);
		}
	},  
  
  setStringPref: function setStringPref(term, val) {
		try {
			if (this.service.setCharPref)
			  return this.service.setCharPref("extensions.menuontop." + term, val);
			return this.service.setStringPref("extensions.menuontop." + term, val);
		}
		catch(ex) {
			this.util.logException("setStringPref(extensions.menuontop." + term + ")", ex);
		}
  },
  
  get isColorOnly() {
    return this.getBoolPref('flavor.coloronly');
  } ,
  
	// GET: specific settings
  get isCustomMenu() {
		return this.getBoolPref('customMenu');
  } ,
  
  set isCustomMenu(val) {
    this.setBoolPref('customMenu', val);
  } ,
  
  get isCustomMenuIcon() {
    return this.getBoolPref('customMenu.icon.use');
  } ,
  
  set isCustomMenuIcon(val) {
    this.setBoolPref('customMenu.icon.use', val);
  } ,
  
  get customMenuIconSize() {
    return this.getIntPref('customMenu.icon.size');
  } ,
  set customMenuIconSize(val) {  
    this.setIntPref('customMenu.icon.size', val);
  } ,
  
  get customMenuIconURL() {
    return this.getStringPref('customMenu.icon.url')
  } ,
	
	get customMenuLabelTitle() {
		let s = this.customMenuTitle;
		try {
			if (this.getBoolPref('customMenu.title.remote')) {
				return s + ': ' + this.service.getIntPref('devtools.debugger.remote-port');
			}
		}
		catch(ex) { s + ': no remote port'; }
		return s;
	} ,
	
  get customMenuTitle() {
		return this.getStringPref('customMenu.title');
  } ,
  
  set customMenuTitle(val) {
    this.setStringPref('customMenu.title', val);
  },
  
	get iconSizeNormal() {
		return this.getIntPref('iconSize.normal');
	} ,
	
	get iconSizeSmall() {
		return this.getIntPref('iconSize.small');
	} ,
	
	get isForceIconSize() {
		return this.getBoolPref('iconSize.forced'); 
	} ,
  
  get isForceIconSmall() {
		return this.getBoolPref('iconSize.forceSmall'); 
  } ,
	
	get negativeMargin() {
		return this.getIntPref('negativeMargin');
	} ,
  
	get toolbarMarginRight() {
    return this.getIntPref('toolbarMargin.right');
  } ,
  
	get menuMargin_left() {
		return this.getIntPref('menuMargin.left');
	} ,
  
  get menuMargin() {
		return this.getIntPref('menuMargin');
	} ,
	
	get tabbarMargin() {
		return this.getIntPref('tabbarMargin');
	} ,
	
	get maxHeight() {
		return this.getIntPref('maxHeight');
	} ,
	
	get menuRadiusValue() {
		return this.getStringPref('menuRadiusValue'); // in em!
	} ,
	
	get menuBorderWidth() {
		return this.getStringPref('menuBorderWidth'); // css string
	},
	
	get menuBorderColor() {
		return this.getStringPref('menuBorderColor'); 
	},
	
	get menuBorderStyle() {
    return this.getStringPref('menuBorderStyle');
	} ,
	
	get menuRadiusLeft() {
		return this.getBoolPref('menuRadiusLeft'); 
	} ,
	
	get menuRadiusRight() {
		return this.getBoolPref('menuRadiusRight'); 
	} ,
	
	get menuBackground() {
		return this.getStringPref('menuBackground');
	} ,
	
	get menuFontColor() {
		return this.getStringPref('menuFontColor');
	} ,
	
	get menuBackgroundHover() {
		return this.getStringPref('menuBackground.hover');
	} ,
	
	get menuFontColorHover() {
		return this.getStringPref('menuFontColor.hover');
	} ,
	
	get menuBackgroundActive() {
		return this.getStringPref('menuBackground.active');
	} ,
	
	get menuFontColorActive() {
		return this.getStringPref('menuFontColor.active');
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
 
MenuOnTop.Preferences.util = MenuOnTop.Util;
 
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/Promise.jsm");

MenuOnTop.TopMenu = {
  Entries: [],
  charset: "UTF-8",
  _document: null,
  get document() { // document of option window
    if (this._document) return this._document;
		let win = this.optionsWindow;
		this._document = win ? win.document : null;
    return  this._document;
  },
	
	get optionsWindow() {
    let mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator),
        getWindowEnumerator = 
            (this._mot.Util.isLinux) ?
            mediator.getXULWindowEnumerator :
            mediator.getZOrderXULWindowEnumerator;
		// Thunderbird 63 getNext throws!			
		if (getWindowEnumerator ('addon:MenuOnTop', true).hasMoreElements()) {
			try {
				let optionsWindow = getWindowEnumerator ('addon:MenuOnTop', true).getNext();
				return optionsWindow;
			}
			catch( ex) { ; }
		}
		return null;
	} , 
  
  get ListBox() {
    return this.document.getElementById('bookmarksList');
  },
  
  get BookmarkTypes() {
    const util = this._mot.Util;
    switch (util.Application) {
      case 'Firefox':
        return  ['addon', 'browser', 'function', 'contentTab.about'];
      case 'Thunderbird':
        return  ['addon', 'browser', 'function', 'contentTab.about', 'calendar', 'message', 'folder', 'preferencesTab'];
      default:
        return [];
    }
  } ,
  
  isTypeSupported: function isTypeSupported(bmType) {
    let bTypes = this.BookmarkTypes;
    return (bTypes.indexOf(bmType) >= 0);
  },
  
  addItem: function addItem(url, label, bookmarkType) {
    let listbox = this.ListBox;
    if (listbox)
      listbox.appendItem(label, url);
  },
  
  clearList: function clearList(onlyUI) {
    const util = this._mot.Util;
    if (!onlyUI) {
      util.logDebug ('clearList() - empty bookmarks list'); 
      while (this.Entries.length)
        this.Entries.pop();
    }
    if (this.document) {  // only if options window is visible
      util.logDebug ('clearList() - empty listbox'); 
      let theList = this.ListBox;
      if (theList) {
        while(theList.lastElementChild) {
          theList.removeChild(theList.lastElementChild);
        }
      }
    }
  },
  
  reset: function reset() {
    // just a test
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                              .getService(Components.interfaces.nsIPromptService);
    if (!promptService.confirm(null, 'Menu On Top', 'Are you sure - Delete all bookmarks?'))
      return;
    
  },

  // repopulates listbox and rebuilds menu!
  repopulate: function repopulate(lb) {
    // listbox
    if (lb) {
      this.clearList(true);
      for (let i=0; i<this.Entries.length; i++) {
        let entry = this.Entries[i];
        // populate the options list
        this.addItem(entry.url, entry.label, entry.bookmarkType);
        // populate the Entries array; fallback to browser bookmark type if undefined
      }
    }
    // main menu
    let win = this._mot.Util.MainWindow,
        doc = win.document;
    this._mot.populateMenu(doc);
  },
   
  onEdit: function onEdit(txt) {
    // check if one is selected and we just changed it]
    let url = this.document.getElementById('linkURL').value,
        label = this.document.getElementById('linkLabel').value,
        bookmarkType = this.document.getElementById('linkType').value,
        listbox = this.ListBox,
        idx = listbox.selectedIndex;
    if (idx ==-1) return;
    let e = this.Entries[idx];
    // check if matches
    switch (txt.id) {
      case 'linkUrl':
        if (e.label == label && e.bookmarkType) {
          if (e.url == txt.value)
            return; // no change
          e.url = txt.value; // modify url
          listbox.selectedItem.value = e.url;
        }
        break;
      case 'linkLabel':
        if (e.url == url && e.bookmarkType) {
          if (e.label == txt.value)
            return; // no change
          e.label = txt.value; // modify label
          listbox.selectedItem.label = e.label;
        }
        break;
    }
    this.repopulate(false); // rebuild menu
    this.saveCustomMenu();
  } ,  
  
  checkUrlLabel: function checkUrlLabel(label) {
    const util = this._mot.Util,
		      getBundleString = util.getBundleString.bind(util),
          prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                              .getService(Components.interfaces.nsIPromptService),
          title = getBundleString('menuontop.bookmarks.promptTitle.caption', "Bookmark Title"),
          text = getBundleString('menuontop.bookmarks.promptTitle', "Please enter a short title:");
    let input = {value: label},
        check = {value: false},
        result = prompts.prompt(util.MainWindow, title, text, input, null, check); // #loginTextBox { min-height :2em; }
    if (!result) return label;
    return input.value;
  } ,
  
  update: function update(isNew) {
    const util = this._mot.Util,
		      getBundleString = util.getBundleString.bind(util);

    let url = this.document.getElementById('linkURL').value,
        label = this.document.getElementById('linkLabel').value,
        bookmarkType = this.document.getElementById('linkType').value,
        existingEntry = null, 
        existingIndex = null;
		
		Components.utils.import("resource://gre/modules/Services.jsm");
    // check if it exists and replace label
    if (!isNew) {
      let lb = this.ListBox;      
      existingIndex = lb.selectedIndex;
      if (existingIndex<0) {
				let txt = getBundleString('menuontop.bookmarks.wrnSelectUpdateItem','You have to select an item from the list to update!'),
				    title = getBundleString('menuontop.bookmarks.wrnSelectUpdateItem.caption','MenuOnTop - update');
        Services.prompt.alert(null, title, txt);
        return;
      }
      existingEntry = this.Entries[existingIndex];
      existingEntry.url = url;
      existingEntry.label = label;
    }
				
    if (!label.trim()) {
			let txt = getBundleString('menuontop.bookmarks.wrnEnterLabel','Please enter a label!');
      Services.prompt.alert(null, 'MenuOnTop', txt);
      return;
    }
    if (!url.trim()) {
			let txt = getBundleString('menuontop.bookmarks.wrnEnterURL','Please enter a URL!');
      Services.prompt.alert(null, 'MenuOnTop', txt);
      return;
    }
    if (!bookmarkType.trim()) {
			let txt = getBundleString('menuontop.bookmarks.wrnEnterType','Please enter bookmark type!\nSupported types are: {0}');
      Services.prompt.alert(null, 'MenuOnTop', txt.replace('{0}',this.BookmarkTypes.toString()));
      return;
    }
    if (!this.isTypeSupported(bookmarkType)) {
			let txt = getBundleString('menuontop.bookmarks.wrnInvalidType','Invalid bookmark type!\nSupported types are: {0}');
      Services.prompt.alert(null, 'MenuOnTop', txt.replace('{0}',this.BookmarkTypes.toString()));
      return;
    }
    
    // TO DO:
    // should we allow changing the URL ? (for selected item only)
    // do a match of first n characters and display a confirmation?
    if (!existingEntry) {
      this.addItem(url, label, bookmarkType);
      this.Entries.push({url:url, label:label, bookmarkType: bookmarkType});
    }
    else {
      // update existing item (label)
      util.logDebug('Updating existing item: ' + existingEntry.label + '  [' + existingEntry.url +']');
      let lb = this.ListBox;
      lb.ensureIndexIsVisible(existingIndex);
      lb.getItemAtIndex(existingIndex).firstChild.value = label; // changed to richlistitem
      this.Entries[existingIndex].label = label;
    }
      
    this.repopulate(false); // rebuild menu
    this.saveCustomMenu();
  },
  
  remove: function remove() {
    if (MenuOnTop.Preferences.isDebug) debugger;
    let listbox = this.ListBox,
        idx = listbox.selectedIndex;
    if (idx<0) return;
    this.Entries.splice(idx, 1); // remove from array
		if (listbox.removeItemAt) // method was removed in Tb 61
			listbox.removeItemAt(idx);
		else { 
			listbox.getItemAtIndex(idx).remove();
		}
    this.repopulate(false); // rebuild menu
    this.saveCustomMenu();
  },
  
  up: function up() {
    let listbox = this.ListBox,
        idx = listbox.selectedIndex;
    if (idx>0) {
      let swap = this.Entries[idx-1];
      this.Entries[idx-1] = this.Entries[idx];
      this.Entries[idx] = swap;
      
      this.repopulate(true);
      this.saveCustomMenu();
      listbox.selectedIndex = idx-1;
    }
  },
  
  down: function down() {
    let listbox = this.ListBox,
        idx = listbox.selectedIndex;
    if (idx < this.Entries.length-1) {
      let swap = this.Entries[idx+1];
      this.Entries[idx+1] = this.Entries[idx];
      this.Entries[idx] = swap;
      
      this.repopulate(true);
      this.saveCustomMenu();
      listbox.selectedIndex = idx+1;
    }
  },
  
  getBrowser: function getBrowser() {
		const Ci = Components.interfaces;
    let util = this._mot.Util, 
		    interfaceType = Ci.nsIDOMWindow, 
        mediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator), 
        browsers = null,
        DomWindow = null,
        theBrowser = null;
    
    let getWindowEnumerator = 
      (util.isLinux) ?
      mediator.getXULWindowEnumerator :
      mediator.getZOrderXULWindowEnumerator;
    browsers = getWindowEnumerator ('navigator:browser', true);
    if (browsers && browsers.hasMoreElements()) {
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
    let uriObject= {url:'',label:'', bookmarkType: null},
        util = this._mot.Util,
        browser = this.getBrowser(),
        tabmail = null,
        currentURI = '',
        currentLabel = '',
        currentType = '';
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
						let tab = tabmail.selectedTab ? tabmail.selectedTab : tabmail.currentTab,  // Pb currentTab
						    theMode = tab.mode ? tab.mode.name : tab.getAttribute("type");
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
								try {
									let currentFolder =
                        tab.folderDisplay ?
                        tab.folderDisplay.displayedFolder :
                        browser.GetFirstSelectedMsgFolder().QueryInterface(Components.interfaces.nsIMsgFolder);
									// let currentFolder2 = tab.folderDisplay.view.displayedFolder.QueryInterface(Components.interfaces.nsIMsgFolder);
									// let msgFolder = theFolder.QueryInterface(Components.interfaces.nsIMsgFolder);
									currentURI = currentFolder.URI; // password manager shows the host name
									// if (currentURI == 'localhost') {
									//	 currentURI = currentFolder.server.realHostName;
									// }
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
							case 'preferencesTab':
                currentType = 'preferencesTab';
                currentLabel = tab.browser.contentTitle;
								currentURI = tab.browser.currentURI.asciiSpec;
							  break;
							case 'contentTab':      // fall through
							case 'thunderbrowse':
                currentType = 'browser';
                currentLabel = tab.browser.contentTitle;
                // check tab.browser.mIconURL :-)
                try {
                  try {
                    currentURI = tab.browser.currentURI.asciiSpec;
                  } catch (ex) {;}
                  if (!currentURI) {
                    currentURI = tab.browser.currentURI.specIgnoringRef;
                    if (!currentURI)
                      currentURI = tab.browser.currentURI.host;
                  }
                  if (currentURI.indexOf('about:') == 0) {
                    currentType = 'contentTab.about';
                  }
                }
                catch(ex) {
                  util.logException('getActiveUri()', ex);
                  return null;
                }
                if (!currentLabel) {
									Components.utils.import("resource://gre/modules/Services.jsm");
                  Services.prompt.alert(null, 'MenuOnTop - getActiveUri', 'Failed - could not retrieve  label from content Tab!');
                  return null;
                }
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
              case 'miczThStatsTab':
                currentURI = tab.browser.currentURI.host; // 'thunderstats'
                currentLabel = tab.title;
                currentType = 'addon';
                break;
              case 'extensions.stationery.options':
                currentURI = tab.browser.currentURI.host; // 'stationery'
                currentLabel = tab.title;
                currentType = 'addon';
                break;
							default:  // case 'tasks':
								Components.utils.import("resource://gre/modules/Services.jsm");
                Services.prompt.alert(null, 'MenuOnTop - getActiveUri', 'Not supported: bookmarking ' + theMode + ' tab!');
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
          currentURI = uri.spec;  // whole URL including query parameters; there is also asciiSpec and specIgnoringRef
          if (currentURI.indexOf('about:') == 0) {
            currentType = 'contentTab.about';
          }
          currentLabel = lB.contentTitle;
					
				}
			}
			catch(ex) {
        util.logException("Error retrieving current URL:", ex);
        if (!currentLabel) currentLabel = 'Error';
        if (!currentURI) return null;
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
    if (null == uriObject || Object.keys(uriObject).length === 0) {
			Components.utils.import("resource://gre/modules/Services.jsm");
      Services.prompt.alert(null, 'MenuOnTop - getFromContext', 
        'Could not safely determine context URL! This type of tab may not be supported.');
      return;
    }
    this.document.getElementById('linkURL').value = uriObject.url;
    this.document.getElementById('linkLabel').value = uriObject.label;
    this.document.getElementById('linkType').value = uriObject.bookmarkType;
  },
  
  getLocalFile: function getLocalFile() {
    // get the "menuOnTop.json" file in the profile/extensions directory
    let path = new Array("extensions", "menuOnTop.json");
    // http://dxr.mozilla.org/comm-central/source/mozilla/toolkit/modules/FileUtils.jsm?from=FileUtils.jsm&case=true#41
		return FileUtils.getFile("ProfD", path); // implements nsIFile
  } ,
  
  readStringFile: function readStringFile() {
    // To read content from file
    // const {OS} = Components.utils.import("resource://gre/modules/osfile.jsm", {}); // TextDecoder
		
		const {OS} = (typeof ChromeUtils.import == "undefined") ?
		  Components.utils.import("resource://gre/modules/osfile.jsm", {}) :
		  ChromeUtils.import("resource://gre/modules/osfile.jsm", {});
    // To read & write content to file
    // const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});  
    
    let profileDir = OS.Constants.Path.profileDir,
        path = OS.Path.join(profileDir, "extensions", "menuOnTop.json"),
        // decoder = new TextDecoder(),        // This decoder can be reused for several reads
        promise = OS.File.read(path, { encoding: "utf-8" }); // Read the complete file as an array - returns Uint8Array 
    return promise;
  } ,
  
  loadCustomMenu: function loadCustomMenu(fromOptions) {
    const util = this._mot.Util,
		      menuOnTop = this._mot;
    fromOptions = fromOptions ? true : false;
    util.logDebug ('loadCustomMenu(' + fromOptions + ')...'); 
    let promise3;
    try {
      // let CustomMenuString='';
      let topMenu = this, // closure this
          promise2 = this.readStringFile().then (
        function onSuccess(CustomMenuData) {
          // populate the bookmarks
          util.logDebug ('readStringFile() - Success'); 
          
          topMenu.clearList(false);
          let entries = JSON.parse(CustomMenuData);  
          util.logDebug ('parsed ' + entries.length + ' entries'); 
          for (let i=0; i<entries.length; i++) {
            let entry = entries[i];
            // populate the options list
            if (fromOptions)
              topMenu.addItem(entry.url, entry.label, entry.bookmarkType);
            // populate the Entries array; fallback to browser bookmark type if undefined
            topMenu.Entries.push(
              {url:entry.url, 
              label:entry.label, 
              bookmarkType:entry.bookmarkType ? entry.bookmarkType : 'browser'}
              );
          }
        },
        function onFailure(ex) {
          util.logDebug ('readStringFile() - Failure: ' + ex); 
          if (ex.becauseNoSuchFile) {
            // File does not exist);
          }
          else {
            // Some other error
						Components.utils.import("resource://gre/modules/Services.jsm");
            Services.prompt.alert(null, 'MenuOnTop - loadCustomMenu', 'Reading the bookmarks file failed\n' + ex);
          }     
          // no changes to Entries array
        }
      );
      
      promise3 = promise2.then(
        function promise2_populateMenu() {
          const // util = MenuOnTop.Util,
                doc = util.MainWindow.document;
          util.logDebug ('promise2.then populateMenu() ...'); 
          menuOnTop.populateMenu(doc);
          return promise2; // make loadCustomMenu chainable
        },
        function promise2_onFail(ex) {
          util.logDebug ('promise2.then onFail():\n' + ex); 
					Components.utils.import("resource://gre/modules/Services.jsm");
          Services.prompt.alert(null, 'MenuOnTop - promise2.then', 'Did not load main menu\n' + ex);
          return promise2; // make loadCustomMenu chainable
        }
      );
    }
    catch(ex) {
      util.logException('MenuOnTop.TopMenu.loadCustomMenu()', ex);
    }
    return promise3;
  } ,

  saveCustomMenu: function saveCustomMenu()  {
    const util = this._mot.Util;
    
    try {
      // const {OS} = Components.utils.import("resource://gre/modules/osfile.jsm", {});
			const {OS} = (typeof ChromeUtils.import == "undefined") ?
				Components.utils.import("resource://gre/modules/osfile.jsm", {}) :
				ChromeUtils.import("resource://gre/modules/osfile.jsm", {});
				
      let topMenu = this, // closure this
          profileDir = OS.Constants.Path.profileDir,
          path = OS.Path.join(profileDir, "extensions", "menuOnTop.json"),
          backPath = OS.Path.join(profileDir, "extensions", "menuOnTop.json.bak"),
          promiseDelete = OS.File.remove(backPath),  // only if it exists
          promiseBackup = promiseDelete.then(
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
          let entity = topMenu.Entries.length ? topMenu.Entries : '',
              outString = JSON.stringify(entity, null, '  '); // prettify
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
  
  appendBookmark: function appendBookmark(menu) {
    const topMenu = this,
          uriObject = topMenu.getActiveUri();
    if (Object.keys(uriObject).length === 0) {
      Services.prompt.alert(null, 'MenuOnTop - getFromContext', 'Could not generate bookmark! This type of content might not be supported');
      return;
    }
    
    // new item: option to ask for modification of name
    let menuLabel = topMenu.checkUrlLabel(uriObject.label);
    
    // listbox only. We 9don't need it (unless dialog is open!)
    // topMenu.addItem(uriObject.url, uriObject.label, uriObject.bookmarkType);
    topMenu.Entries.push(
      {
        url: uriObject.url, 
        label: menuLabel, 
        bookmarkType: uriObject.bookmarkType
      }
    );
    topMenu.repopulate(false); // rebuild menu
    topMenu.saveCustomMenu();
  }
  
};  // TopMenu

MenuOnTop.TopMenu._mot = MenuOnTop;

// my "globals"
var util = MenuOnTop.Util;
var prefs = MenuOnTop.Preferences;