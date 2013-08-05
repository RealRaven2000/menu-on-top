"use strict";


MenuOnTop.Options = {
	prefService : null,
	bypassObserver: false,
	observe : function(aSubject, aTopic, aData) {
		if (this.bypassObserver) 
			return; // avoid too many css changes
		if ("nsPref:changed" == aTopic) {
			// let newValue = aSubject.getIntPref(aData);
			if (aData.toString() == "extensions.menuontop.statusIcon") // don't reload CSS when toggling icon
				return;
			this.apply();
		}
	},

  onLoad: function() {
		MenuOnTop.ensureMenuBarVisible(MenuOnTop.Util.getMail3PaneWindow()); // more for testing, but it might have its place!
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
	},
	
	onUnload: function() {
		MenuOnTop.Util.logDebug ("MenuOnTop.Options.onClose()");
	  this.prefService.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefService.removeObserver('extensions.menuontop.', this);
	},
	
	onStatusCheck: function(chk) {
		let win = MenuOnTop.Util.getMail3PaneWindow();
		if (chk.checked)
			MenuOnTop.showAddonButton(win);
		else
			MenuOnTop.hideAddonButton(win);
			
	},
	
	accept: function() {
		this.apply();
	},
	
	apply: function() {
		let win = MenuOnTop.Util.getMail3PaneWindow();
		MenuOnTop.resetCSS(win);
		MenuOnTop.loadCSS(win);
	},
	
	selectScheme: function(sel) {
	  // set a value and notify the bound preference via an input event; thanks to John-Galt !!
	  function setElementValue(id, val) {
			let doc = window.document;
			let element = doc.getElementById(id);
			if (typeof val == 'boolean')
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
				setElementValue('txtMenuMargin', MenuOnTop.defaultPREFS.menuMargin);
				setElementValue('chkMenuShadow', MenuOnTop.defaultPREFS.textShadow);
				setElementValue('txtMenuBackground',  MenuOnTop.defaultPREFS.menuBackground);
				setElementValue('txtMenuFontColor',  MenuOnTop.defaultPREFS.menuFontColor);
				setElementValue('txtMaxHeight', MenuOnTop.defaultPREFS.maxHeight);
				break;
			case 1:  // dark - TT deepdark
				setElementValue('chkMenuShadow', true);
				// from Bloomind's TT deepdark, slighly tweaked start point to make it brighter & more apparent (we are missing borders)
				setElementValue('txtMenuBackground',  'linear-gradient(rgb(88, 88, 88), rgb(35, 35, 35) 45%, rgb(33, 33, 33) 48%, rgb(24, 24, 24))'); 
				setElementValue('txtMenuFontColor', 'rgba(220, 220, 220, 0.8)');
				setElementValue('txtMaxHeight', 22);
				break;
			case 2:  // bright - Nautipolis
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMargin', 8);
				setElementValue('txtMenuRadius', '0.5');
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(215, 215, 215, 0.9))');
				setElementValue('txtMenuFontColor', 'rgb(15,15,15)');
				setElementValue('txtMaxHeight', 18);
				break;
			case 3:  // blue - Nuvola
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMargin', 5);
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(4,160,238,0.8) 0%,rgba(2,79,138,0.8) 47%,rgba(0,53,118,0.8) 100%)');
				setElementValue('txtMenuFontColor', 'rgba(255, 225, 255, 0.95)');
				setElementValue('txtMaxHeight', 22);
				break;
			case 4:  // orange - Lantana
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(252,219,143,0.9) 0%,rgba(249,156,62,0.9) 49%,rgba(229,143,45,0.9) 52%,rgba(234,122,37,1) 100%)');
				setElementValue('txtMenuFontColor', 'rgba(84,84,100,0.9)');
				setElementValue('txtMaxHeight', 22);
				break;
			case 5:  // fudge - Charamel
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMargin', 8);
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(234,225,209,0.9) 0%,rgba(232,217,195,0.93) 34%,rgba(229,198,156,1) 100%)');
				setElementValue('txtMenuFontColor', 'rgb(127, 83, 44)');
				setElementValue('txtMaxHeight', 24);
				break;
			case 6:  // Noja Extreme - needs white shadow!
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMargin', 12);
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(184,185,197,1) 27%,rgba(184,185,197,1) 48%,rgba(210,212,219,1) 65%,rgba(245,245,255,1) 100%)');
				setElementValue('txtMenuFontColor', 'rgb(0,0,0)');
				setElementValue('txtMaxHeight', 26);
				break;
			case 7:  // Walnut 2
				setElementValue('txtNegativeMargin', 0);
				setElementValue('txtMenuMargin', 4);
				setElementValue('txtMenuRadius', '0.5');
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(228, 208, 155, 0.95), rgba(228, 208, 155, 0.5))');
				setElementValue('txtMenuFontColor', 'rgb(15,15,15)');
				setElementValue('txtMaxHeight', 21);
				break;
			case 8:  // small icons - Littlebird
				setElementValue('txtNegativeMargin', 0);
				setElementValue('txtMenuMargin', 2);
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(215, 215, 215, 0.9))');
				setElementValue('txtMenuFontColor', 'rgb(15,15,15)');
				setElementValue('txtMaxHeight', 20);
				break;
			case 9:  // red
				setElementValue('txtNegativeMargin', 2);
				setElementValue('txtMenuMargin', 7);
				setElementValue('chkMenuShadow', true);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(237,4,8,0.8) 0%,rgba(137,13,2,0.8) 45%,rgba(117,23,0,0.8) 100%)');
				setElementValue('txtMenuFontColor', 'rgba(255, 240, 255, 1)');
				setElementValue('txtMaxHeight', 22);
				break;
			case 10:  // phoenity (shredder)
				setElementValue('txtNegativeMargin', 4);
				setElementValue('txtMenuMargin', 4);
				setElementValue('txtMenuRadius', '0.3');
				setElementValue('chkMenuShadow', false);
				setElementValue('txtMenuBackground',  'linear-gradient(to bottom, rgba(206,206,206,1) 0%,rgba(212,212,212,1) 45%,rgba(206,206,206,1) 45%,rgba(199,199,199,1) 100%)');
				setElementValue('txtMenuFontColor', 'rgba(0, 0, 25, 1)');
				setElementValue('txtMaxHeight', 22);
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