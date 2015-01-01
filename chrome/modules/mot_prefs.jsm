Components.utils.import("resource://gre/modules/osfile.jsm")
Components.utils.import("resource://gre/modules/Services.jsm");
//Components.utils.import("chrome://menuontop/content/menuOnTop.jsm");

var EXPORTED_SYMBOLS = [ 'MenuOnTop_Preferences' ];
let MenuOnTop_Preferences = {
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
