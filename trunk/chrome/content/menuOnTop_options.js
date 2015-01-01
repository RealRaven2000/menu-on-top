"use strict";


MenuOnTop.Options = {
	prefService : null,
	bypassObserver: false,
	observe : function observe(aSubject, aTopic, aData) {
		if (this.bypassObserver) 
			return; // avoid too many css changes
		if ("nsPref:changed" == aTopic) {
			// let newValue = aSubject.getIntPref(aData);
			if (aData.toString() == "extensions.menuontop.statusIcon") // don't reload CSS when toggling icon
				return;
			this.apply();
		}
	},

  onLoad: function onLoad() {
		MenuOnTop.ensureMenuBarVisible(MenuOnTop.Util.MainWindow); // more for testing, but it might have its place!
	  // alert('test');
		MenuOnTop.Util.logDebug ("MenuOnTop.Options.onLoad()");
		// add an event listener that reacts to changing all preferences by reloading the CSS
		let Ci = Components.interfaces;
		this.prefService =
       Components.classes["@mozilla.org/preferences-service;1"].getService( Ci.nsIPrefBranch);
		this.prefService.QueryInterface(Ci.nsIPrefBranch2);
		// => 'this' implements observe() interface
		this.prefService.addObserver('extensions.menuontop.', this, false);
		this.prefService.QueryInterface(Ci.nsIPrefBranch);
    document.getElementById('tabsInTitle').checked = MenuOnTop.Util.getTabInTitle();
	},
	
	onUnload: function onUnload() {
		MenuOnTop.Util.logDebug ("MenuOnTop.Options.onClose()");
	  this.prefService.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefService.removeObserver('extensions.menuontop.', this);
	},
	
	onStatusCheck: function onStatusCheck(chk) {
		let win = MenuOnTop.Util.MainWindow;
		if (chk.checked)
			MenuOnTop.showAddonButton(win);
		else
			MenuOnTop.hideAddonButton(win);
			
	},
  
  onCustomMenu: function onCustomMenu(chk) {
		let win = MenuOnTop.Util.MainWindow;
    MenuOnTop.Preferences.setBoolPref('customMenu', chk.checked);
    MenuOnTop.showCustomMenu(win);
  } ,
	
	accept: function accept() {
		this.apply();
	},
	
	apply: function apply() {
		let win = MenuOnTop.Util.MainWindow;
		MenuOnTop.resetCSS(win);
		MenuOnTop.loadCSS(win);
	},
  
  toggleTabsInTitle: function toggleTabsInTitle(checkbox) {
    let util = MenuOnTop.Util;
    util.setTabInTitle(!util.getTabInTitle());
    checkbox.checked = util.getTabInTitle();
  },
	
	selectScheme: function selectScheme(sel) {
	  // set a value and notify the bound preference via an input event; thanks to John-Galt !!
	  function setElementValue(id, val) {
			let doc = window.document;
			let element = doc.getElementById(id);
      if (element.tagName=='colorpicker') 
        element.color = val;
			else if (typeof val == 'boolean')
				element.checked = val;
			else
				element.value = val;
			
			let evt = doc.createEvent("UIEvents")
			evt.initUIEvent('input', true, true, doc.defaultView, 1);
			element.dispatchEvent(evt);
		}
		this.bypassObserver = true
		let selection = parseInt(sel, 10);
	  if (selection<0)
			return;
		switch(selection) {
			case 0:  // default - Australis
				setElementValue('txtNegativeMargin', MenuOnTop.defaultPREFS.negativeMargin);
				setElementValue('txtMenuMarginTop', MenuOnTop.defaultPREFS.menuMarginTop);
				setElementValue('chkMenuShadow', MenuOnTop.defaultPREFS.textShadow);
				setElementValue('txtMenuBackgroundDefault',  MenuOnTop.defaultPREFS.menuBackground);
				setElementValue('txtMenuFontColorDefault',  MenuOnTop.defaultPREFS.menuFontColor);
				setElementValue('txtMenuBackgroundHover',  MenuOnTop.defaultPREFS.menuBackgroundHover);
				setElementValue('txtMenuFontColorHover',  MenuOnTop.defaultPREFS.menuFontColorHover);
				setElementValue('txtMenuBackgroundActive',  MenuOnTop.defaultPREFS.menuBackgroundActive);
				setElementValue('txtMenuFontColorActive',  MenuOnTop.defaultPREFS.menuFontColorActive);
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', MenuOnTop.defaultPREFS.menuBorderWidth);
				setElementValue('txtMaxHeight', MenuOnTop.defaultPREFS.maxHeight);
				setElementValue('txtMenuIconSmall', MenuOnTop.defaultPREFS.iconSizeSmall);
				setElementValue('chkMenubarTransparent', MenuOnTop.defaultPREFS.menubarTransparent);
				break;
			case 1:  // dark - TT deepdark
				setElementValue('chkMenuShadow', true);
				// from Bloomind's TT deepdark, slighly tweaked start point to make it brighter & more apparent (we are missing borders)
				setElementValue('txtNegativeMargin', 6);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(rgb(88, 88, 88), rgb(35, 35, 35) 45%, rgb(33, 33, 33) 48%, rgb(24, 24, 24))'); 
				setElementValue('txtMenuFontColorDefault', 'rgba(220, 220, 220, 0.8)');
        // text-shadow: 0px 0px 3px rgb(0, 173, 238);
				setElementValue('txtMenuBackgroundHover',  'linear-gradient(rgb(88, 88, 88), rgb(35, 35, 35) 45%, rgb(33, 33, 33) 48%, rgb(24, 24, 24))'); 
				setElementValue('txtMenuFontColorHover', 'rgb(0, 173, 238)'); // blue on hover
				setElementValue('txtMenuBackgroundActive',  'linear-gradient(rgb(45,45,45))'); 
				setElementValue('txtMenuFontColorActive', 'rgba(255, 255, 255, 0.9)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 22);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 0);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 16);
				break;
			case 2:  // bright - Nautipolis
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuRadius', '0.5');
				setElementValue('chkMenuShadow', false);
        setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(215, 215, 215, 0.9))');
				setElementValue('txtMenuFontColorDefault', 'rgb(15,15,15)');
				setElementValue('txtMenuBackgroundHover',  'rgb(204, 204, 255)');
				setElementValue('txtMenuFontColorHover', 'rgb(0,0,0)');
				setElementValue('txtMenuBackgroundActive',  'linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(215, 215, 215, 0.9))');
				setElementValue('txtMenuFontColorActive', 'rgb(15,15,15)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 20);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 16);
				break;
			case 3:  // Nuvola - silver
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMarginTop', 5);
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(#f4f4f9,#c0c1ca)');
				setElementValue('txtMenuFontColorDefault', 'rgb(0, 0, 0)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 22);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;
			case 4:  // orange - Lantana
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(252,219,143,0.9) 0%,rgba(249,156,62,0.9) 49%,rgba(229,143,45,0.9) 52%,rgba(234,122,37,1) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgba(84,84,100,0.9)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 22);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 0);
				break;
			case 5:  // fudge - Charamel
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMarginTop', 8);
				setElementValue('chkMenuShadow', true);
				setElementValue('chkMenubarTransparent', true);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(234,225,209,0.9) 0%,rgba(232,217,195,0.93) 34%,rgba(229,198,156,1) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgb(127, 83, 44)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 24);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;
			case 6:  // Noja Extreme - needs white shadow!
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMarginTop', 12);
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(184,185,197,1) 27%,rgba(184,185,197,1) 48%,rgba(210,212,219,1) 65%,rgba(245,245,255,1) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgb(0,0,0)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 26);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;
			case 7:  // Walnut 2
				setElementValue('txtNegativeMargin', 0);
				setElementValue('txtMenuMarginTop', 6);
				setElementValue('txtMenuRadius', '0.5');
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(228, 208, 155, 0.95), rgba(228, 208, 155, 0.5))');
				setElementValue('txtMenuFontColorDefault', 'rgb(15,15,15)');
				setElementValue('txtMenuBackgroundHover',  'linear-gradient(to bottom, rgb(220,180,110), rgb(220,180,110))');
				setElementValue('txtMenuFontColorHover', ' rgb(105,41,3)');
				setElementValue('txtMenuBackgroundActive',  'linear-gradient(to bottom, rgb(105,41,3), rgb(105,41,3))');
				setElementValue('txtMenuFontColorActive', 'rgb(255,255,255)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 21);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 16);
				break;
			case 8:  // small icons - Littlebird
				setElementValue('txtNegativeMargin', 0);
				setElementValue('txtMenuMarginTop', 2);
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(215, 215, 215, 0.9))');
				setElementValue('txtMenuFontColorDefault', 'rgb(15,15,15)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 20);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 16);
				break;
			case 9:  // robin - red
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMarginTop', 7);
				setElementValue('txtMenuRadius', '0.5');
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(237,4,8,0.8) 0%,rgba(137,13,2,0.8) 45%,rgba(117,23,0,0.8) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgba(255, 240, 255, 1)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 22);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 0);
				break;
			case 10:  // phoenity (shredder)
				setElementValue('txtNegativeMargin', 4);
				setElementValue('txtMenuMarginTop', 4);
				setElementValue('txtMenuRadius', '0.3');
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(206,206,206,1) 0%,rgba(212,212,212,1) 45%,rgba(206,206,206,1) 45%,rgba(199,199,199,1) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgba(0, 0, 25, 1)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 22);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;
			case 11:  // SilverMel
				setElementValue('txtNegativeMargin', 0);
				setElementValue('txtMenuMarginTop', 10);
				setElementValue('txtMenuRadius', '0');
				setElementValue('chkMenuShadow', false);
				setElementValue('chkMenubarTransparent', true);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(206,206,206,1) 0%,rgba(212,212,212,1) 45%,rgba(206,206,206,1) 45%,rgba(199,199,199,1) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgba(0, 0, 25, 1)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 28);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;
			case 12:  // Mountain - blue
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMarginTop', 5);
				setElementValue('txtMenuRadius', '0.5');
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(4,160,238,0.8) 0%,rgba(2,79,138,0.8) 47%,rgba(0,53,118,0.8) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgba(225, 245, 255, 0.95)');
				setElementValue('txtMenuBackgroundHover',  'linear-gradient(to bottom, rgba(4,160,238,0.8) 0%,rgba(2,79,138,0.8) 47%,rgba(0,53,118,0.8) 100%)');
				setElementValue('txtMenuFontColorHover', 'rgba(225, 245, 255, 0.95)');
				setElementValue('txtMenuBackgroundActive',  'linear-gradient(to bottom, rgba(4,160,238,0.8) 0%,rgba(2,79,138,0.8) 47%,rgba(0,53,118,0.8) 100%)');
				setElementValue('txtMenuFontColorActive', 'rgba(225, 245, 255, 0.95)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 22);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;
			case 13:  // Parakeet - green
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMarginTop', 5);
				setElementValue('txtMenuRadius', '0.75');
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(3,185,173,0.8) 0%,rgba(2,105,108,0.8) 47%,rgba(0,78,92,0.8) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgba(225, 255, 250, 0.95)');
				setElementValue('txtMenuBorderColor', 'transparent');
				setElementValue('txtMenuBorderWidth', '0');
				setElementValue('txtMaxHeight', 22);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;	
			case 14:  // Tangerine - orange
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMarginTop', 5);
				setElementValue('txtMenuRadius', '0.75');
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackgroundDefault',  'linear-gradient(to bottom, rgba(255,183,107,1) 0%,rgba(255,167,61,1) 11%,rgba(255,124,0,1) 51%,rgba(255,127,4,1) 100%)');
				setElementValue('txtMenuFontColorDefault', 'rgba(225, 255, 250, 0.99)');
				setElementValue('txtMenuBorderColor', 'rgba(255,255,255,0.7)');
				setElementValue('txtMenuBorderWidth', '1');
				setElementValue('txtMaxHeight', 22);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;	
      case 15: // Australis Redesign
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMarginTop', 5);
				setElementValue('txtMenuRadius', '0.4');
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackgroundDefault',  '#EAF2FB');
				setElementValue('txtMenuFontColorDefault', 'rgb(51, 102, 153)');
				setElementValue('txtMenuBackgroundHover',  '#ffffff');
				setElementValue('txtMenuFontColorHover', '#113366'); 
				setElementValue('txtMenuBackgroundHover',  '#ffffff');
				setElementValue('txtMenuFontColorActive', '#113366');
				setElementValue('txtMenuBorderColor', '#7A8D9B');
				setElementValue('txtMenuBorderWidth', '1');
				setElementValue('txtMaxHeight', 24);
				setElementValue('txtMenuIconSmall', 16);
				setElementValue('txtMenuIconNormal', 24);
				break;	
		}
		this.apply();
		window.setTimeout( function() { 
			MenuOnTop.Util.logDebug ("enabling prefs observer...");
			MenuOnTop.Options.bypassObserver = false; 
		}, 500); // avoid too many loadCSS calls.
		// this.bypassObserver = false;
	}
}