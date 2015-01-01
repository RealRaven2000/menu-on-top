
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/Promise.jsm");
//Components.utils.import("chrome://menuontop/content/menuOnTop.jsm");

var EXPORTED_SYMBOLS = [ 'TopMenu' ];
let TopMenu = {
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



