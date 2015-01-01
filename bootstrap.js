/* Menu On Top Bootstrap Script
 * see https://developer.mozilla.org/en/Extensions/Bootstrapped_extensions
 * LICENSE
 *   this is a hack based on the Rise Of The Tools extension by rsjtdrjgfuzkfg (which was released under Mozilla Public License Version 1.1)
 *   For License info on _this_ Addon [Menu On Top], please refer to the module chrome/content/menuOnTop.js
 * OBJECTIVE
 *   objective is to get the menu bar to the top without interfering with the UI coloring too much 
 *   and is designed specifcally for Windows users.
 *   From Tb22.0 the menu bar will be on the top anyways so it is restricted to Tb 17.* max version
 * COMPATIBILITY
 *   Note - this is (probably) not compatible with Rise of the Tools, if you install both extensions I guarantee nothing!
 *   Nor is this tested with a load of other toolbar related addons, so ymmv. It works well with my own addons and a big bunch
 *   that I am using, but that's not saying much.
 * VERSION HISTORY
 *    For version history, please refer to the module chrome/content/menuOnTop.js
 */

const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

(function(global) global.include = function include(src) {
var o = {};
Components.utils.import("resource://gre/modules/Services.jsm", o);
var uri = o.Services.io.newURI(
src, null, o.Services.io.newURI(__SCRIPT_URI_SPEC__, null, null));
o.Services.scriptloader.loadSubScript(uri.spec, global);
})(this);

var MOT = {};



/*
var mozIJSSubScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                            .getService(Components.interfaces.mozIJSSubScriptLoader);

mozIJSSubScriptLoader.loadSubScript("chrome://menuontop/content/menuOnTop.js", {},  "ASCII");
*/
														
var windows = []; // All windows we're started in, to remove helpers at shutdown

// we cannot have default prefs in a file, so:
// see http://starkravingfinkle.org/blog/2011/01/restartless-add-ons-%E2%80%93-default-preferences/
const PREF_BRANCH = "extensions.menuontop.";

function setDefaultPrefs() {
  let branch = Services.prefs.getDefaultBranch(PREF_BRANCH);
  for (let [key, val] in Iterator( MOT.MenuOnTop.defaultPREFS )) {
		MOT.MenuOnTop.Util.logDebug ("Loading default pref " + key + ": " + val);
		
    switch (typeof val) {
      case "boolean":
        branch.setBoolPref(key, val);
        break;
      case "number":
        branch.setIntPref(key, val);
        break;
      case "string":
        branch.setCharPref(key, val);
        break;
    }
  }
}

var winListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let domWindow = aWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor).
                          getInterface(Components.interfaces.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      try{
        start(domWindow);
      } catch (e) {Components.utils.reportError(e);}
    }, false);
    /*// Do not clean up in unloading windows, so we don't leak listeners on removal
		  domWindow.addEventListener("unload", function() {
      try{
        stop(domWindow);
      } catch (e) {Components.utils.reportError(e);}
    }, false);*/ 
  },
  onCloseWindow: function(aWindow) { },
  onWindowTitleChange: function(aWindow, aTitle) { },
};

install = function(data, reason){
  // We run the first time
	Components.manager.addBootstrappedManifestLocation(data.installPath);
	// setDefaultPrefs();
};

uninstall = function(data, reason){
  // We'll get deleted and have to clean up
};

var MOT = {};

startup = function(data, reason){
  Cu.import("chrome://menuontopmod/content/menuontop.jsm", MOT); // => MOT.MenuOnTop
  Cu.import("chrome://menuontopmod/content/mot_util.jsm", MOT.MenuOnTop); // Add .Util
  Cu.import("chrome://menuontopmod/content/mot_prefs.jsm", MOT.MenuOnTop);  // Add .Preferences
  Cu.import("chrome://menuontopmod/content/mot_prefs.jsm", MOT.MenuOnTop);  // Add .TopMenu
  
	setDefaultPrefs(); // we need to do this every time!
  
  // We're starting up
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].
                      getService(Components.interfaces.nsIWindowMediator);
  // Start in all current windows:
  var enumerator = wm.getEnumerator(MOT.MenuOnTop.Util.MainWindowXulId); // "mail:3pane"
	Components.manager.addBootstrappedManifestLocation(data.installPath);
	
  while (enumerator.hasMoreElements()) {
    var window = enumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
    start(window);
		// if we install or change the version, we must make the menu visible otherwise no obvious change for user
		if (   reason == ADDON_INSTALL 
		    || reason == ADDON_UPGRADE 
				|| reason == ADDON_DOWNGRADE 
				|| reason == ADDON_ENABLE) {
			MOT.MenuOnTop.ensureMenuBarVisible(window);
		}
  }
  // Start in new windows:
  wm.addListener(winListener);
	
};

shutdown = function(data, reason){
  // We're shutting down
  
  // Stop listening
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].
                      getService(Components.interfaces.nsIWindowMediator);
  wm.removeListener(winListener);
  
  for each (var window in windows){
    try{
      stop(window);
    } catch (e){}
  }
};


var start = function(window){
  // We're starting up in a window
  let util = MOT.MenuOnTop.Util;
  util.logDebug ("MenuOnTop.start()");
  let document = window.document;
  // let toolbar = document.getElementById("mail-bar3"); // toolbar with buttons
  let navigationBox = document.getElementById(MOT.MenuOnTop.Util.ToolboxId);
	let menubar =  document.getElementById(MOT.MenuOnTop.Util.ToolbarId);
  if (!(menubar && navigationBox)) {
    util.logDebug ("MenuOnTop.start(): early exit, no navigation-toolbox or menubar found");
    return; // We're only interested in windows with the menubar in it
  }
  windows.unshift(window);
  
  // Save the position for restoring if we get disabled / uninstalled, also our attrchange handler
  menubar.menuOnTop = {
    parent: menubar.parentNode,
    next: menubar.nextSibling
  };
  
  // Move the menu toolbar to the very top
  // 
	// ╔╤══THUNDERBIRD══════════════  #navigation-toolbox ═════════════════════════╤╗
	// ║│ ┌───────────────────────────────────────────────────────────────────────┐│║
	// ║│ │   #mail-toolbar-menubar2                                              ││║
	// ║│ └───────────────────────────────────────────────────────────────────────┘│║
	// ║│ ┌───────────────────────────────────────────────────────────────────────┐│║
	// ║│ │   #tabs-toolbar                                                       ││║
	// ║│ └───────────────────────────────────────────────────────────────────────┘│║
	// ╚╧══════════════════════════════════════════════════════════════════════════╧╝
  // 
	// ╔╤═══FIREFOX═════════════════  #navigator-toolbox  ═════════════════════════╤╗
	// ║│ ┌───────────────────────────────────────────────────────────────────────┐│║
	// ║│ │   #toolbar-menubar                                                    ││║
	// ║│ └───────────────────────────────────────────────────────────────────────┘│║
	// ║│ ┌───────────────────────────────────────────────────────────────────────┐│║
	// ║│ │   #TabsToolbar                                                        ││║
	// ║│ └───────────────────────────────────────────────────────────────────────┘│║
	// ╚╧══════════════════════════════════════════════════════════════════════════╧╝
  let first = navigationBox.firstChild;
  if (util.Application=='Firefox' && util.AppVersion>20.0) {
    util.logDebug("No change in menubar order");
  }
  else {
    util.logDebug("inserting menubar before: " + first + '\n'
                  + first.tagName + ': ['
                  + (first.id ? first.id : '') + ']');
    navigationBox.insertBefore(menubar, first);
    menubar.menuOnTop.restacked = true;
  }

  // Inject CSS for themes with the menubar under the tabbar, which looks terrible after moving the toolbar up
	MOT.MenuOnTop.loadCSS(window);
	
	// if the option is active, we show the icon in the addon bar.
	if (MOT.MenuOnTop.Preferences.isStatusIcon)
		MOT.MenuOnTop.showAddonButton(window);
	
};

var stop = function(window){
  // We're shutting down in a window
  var document = window.document;
  // Undo changes
  try {
		let menubar =  window.document.getElementById(MOT.MenuOnTop.Util.ToolbarId);
    
		// restore original toolbar order
		// insertBefore(what = tabs-toolbar, reference element = mail-toolbar-menubar2)
    if (menubar.menuOnTop.restacked)
      menubar.menuOnTop.parent.insertBefore(menubar.menuOnTop.next, menubar);
    delete menubar.menuOnTop;
    
		MOT.MenuOnTop.resetCSS(window);
		MOT.MenuOnTop.hideAddonButton(window);
    MOT.MenuOnTop.hideCustomMenu(window);
  } catch (e) {}
  
  // Remove closed window out of list
  for (var i = 0; i < windows.length; i++)
    if (windows[i] == window)
      windows = windows.splice(i,1);
	Components.manager.removeBootstrappedManifestLocation(data.installPath);
};

