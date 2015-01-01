//Components.utils.import("chrome://menuontop/content/menuOnTop.jsm");
var EXPORTED_SYMBOLS = [ 'MenuOnTop_Util' ];
let MenuOnTop_Util = {
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
};