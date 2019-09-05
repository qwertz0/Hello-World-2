// v1.0
var $device=null;

const $settings={
	autoselect:localStorage.getItem('autoselect')==="false"?false:true,
	vMinEvents:7,
	vNum:2,
	foldEvents:localStorage.getItem('foldEvents')==="false"?false:true,
	avplay:localStorage.getItem('avplay')==="true"||false, // false = nativ /  true = avplay,
	s365pseudo:localStorage.getItem('s365pseudo')==="true"||false // todo: setting_s365pseudo
};

function start() {
	
	(function() {
		const schedule=document.createElement("div");
		schedule.id="schedule";
		schedule.className="schedule";
		schedule.style.opacity="0";
		schedule.innerHTML=
					 '<div class="schedule-dimmer" id="dimmer"></div>'
					+'<div class="schedule-menu" id="menu">'
						+'<div class="menu-item menu-item--reload" id="menuReload"></div>'
						+'<div class="menu-seperator"></div>'
						+'<div class="menu-item menu-item--de" id="menuDe"></div>'
						+'<div class="menu-item menu-item--main" id="menuMain"></div>'
						+'<div class="menu-item menu-item--fb" id="menuFb"></div>'
						+'<div class="menu-item menu-item--more" id="menuMore"></div>'
						+'<div class="menu-seperator"></div>'
						+'<div class="menu-item menu-item--audio" id="menuAudio"></div>'
						+'<div class="menu-item menu-item--group" id="menuGroup"></div>'
						+'<div class="menu-seperator"></div>'
						+'<div class="menu-item menu-item--settings" id="menuSettings"></div>'
						//+'<div class="menu-helper" id="menuHelper"></div>'
					+'</div>'
					+'<div class="schedule-list" id="list0"></div>'
					+'<div class="schedule-list" id="list1"></div>'
					+'<div class="schedule-list" id="listSettings">'
						+'<div class="setting"><input type="checkbox"'+($settings.autoselect?' checked':'')+' id="setting_autoselect"><label for="setting_autoselect">Streams automatisch auswählen</label></div>'
						+'<div class="setting"><input type="checkbox"'+($settings.foldEvents?' checked':'')+' id="setting_foldEvents"><label for="setting_foldEvents">Sprachen zu Untermenüs zusammenfassen</label></div>'
						+'<div class="setting"><input type="checkbox"'+($settings.avplay?' checked':'')+' id="setting_avplay"><label for="setting_avplay">AvPlay statt native Wiedergabe benutzen</label></div>'
						
						// todo: setting_s365pseudo
						+'<div class="setting"><input type="checkbox"'+($settings.s365pseudo?' checked':'')+' id="setting_s365pseudo"><label for="setting_s365pseudo">s365-Test (Neustart notwendig)</label></div>'
					+'</div>'			
				+'</div><div class="msg-exit"></div>';
		document.body.appendChild(schedule);
	})();
	
	$device=(function() {
		
		// todo: dynamische Erzeugung der Elemente
		(function() {
			const exitMsg=document.createElement("div");
			exitMsg.className="msg-exit";
			document.body.appendChild(exitMsg);
		})();
		setting_foldEvents.checked=$settings.foldEvents;
		setting_autoselect.checked=$settings.autoselect;
		setting_avplay.checked=$settings.avplay;
		setting_s365pseudo.checked=$settings.s365pseudo;
		

	//	document.addEventListener('visibilitychange', function() {
	//    if(document.hidden){
	//       console.log("<<<<<<<<<<<HIDDEN>>>>>>>>>>>","maroon");
	//    } else {
	//       console.log(">>>>>>>>>>>RESUME<<<<<<<<<<<","maroon");
	//    }
	//	});

		const exitApp=function() {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (error) {
				console.error('Application exit failed.', error);
			}
		};	
		
		tizen.tvinputdevice.registerKeyBatch([
			'Info','MediaStop','MediaRewind','MediaFastForward','MediaPlay','ChannelUp','ChannelDown'
		]);

		var selectedElement=null;
		
		const _menu={
			focus:function() {
				switch (schedule.getAttribute("filter")) {
					case "de":
						_menuItem.select(menuDe);
						break;
					case "fb":
						_menuItem.select(menuFb);
						break;
					case "main":
						_menuItem.select(menuMain);
						break;
					default:
						_menuItem.select(menuMore);										
				};
				schedule.classList.add("schedule--menu");
			},
			close:function(obj) {
				_list.focus($schedule.list());
				obj.classList.remove("menu-item--hover");
				schedule.classList.remove("schedule--menu");			
			}
		},
		
		_menuItem={
			previous:function(obj) {
				let nxt=obj.previousElementSibling;
				while(nxt && !nxt.classList.contains("menu-item")) nxt=nxt.previousElementSibling;
				return nxt;
			},
			next:function(obj) {
				let nxt=obj.nextElementSibling;
				while(nxt && !nxt.classList.contains("menu-item")) nxt=nxt.nextElementSibling;
				return nxt;
			},
			select:function(obj) {
				obj.classList.add("menu-item--hover");
				selectedElement=obj;
			},
			onKey:function(keyCode) {
				switch (keyCode) {
					case tizen.tvinputdevice.getKey('ArrowRight').code:
						_menu.close(this);
						break;
					case tizen.tvinputdevice.getKey('ArrowUp').code:
						(function() {
							let pre=_menuItem.previous(this);
							if (pre) {
								_menuItem.select(pre);
								this.classList.remove("menu-item--hover");
							}
						}).call(this);
						break;
					case tizen.tvinputdevice.getKey('ArrowDown').code:
						(function() {
							let nxt=_menuItem.next(this);
							if (nxt) {
								_menuItem.select(nxt);
								this.classList.remove("menu-item--hover");
							}
						}).call(this);
						break;
					case tizen.tvinputdevice.getKey('Enter').code:
						switch (this.id) {
							case 'menuReload':
								$schedule.reload(true,_list.reset);
								break;
							case 'menuDe':
							case 'menuMain':
							case 'menuFb':
							case 'menuMore':
								localStorage.setItem('filter',$schedule.setFilter(this.id.substr(4).toLowerCase(),_list.reset));
								break;
							case 'menuAudio':
								localStorage.setItem('audiofilter',$schedule.toggleAudiofilter(_list.reset));
								break;
							case 'menuGroup':
								localStorage.setItem('grouping',$schedule.toggleGrouping(_list.reset));
								break;											
							case 'menuSettings':
								if (schedule.classList.contains("schedule--settings")) _menu.close(this);
									else $schedule.openSettings(()=>_menu.close(this));
								break;
						};
						break;
					case tizen.tvinputdevice.getKey('Back').code:
						_menu.close(this);
						break;							
					//default: _glb(e);
				};
			}
		},
		
		_list={
			focus:function(obj) {
				const cur=obj.currentEvent||obj.querySelector(".event");
				if (cur && cur.offsetParent) _event.select(cur);
					else selectedElement=obj; // kann nur bei list0 oder listSettings passieren
			},
			onKey:function(keyCode) { // nur für list0
				switch (keyCode) {
					case tizen.tvinputdevice.getKey('ArrowLeft').code:
							_menu.focus();
							break;
					case tizen.tvinputdevice.getKey('Back').code:
						if (document.documentElement.classList.contains("exit")) {
							exitApp();
						} else {
							document.documentElement.classList.add("exit");
							setTimeout(()=>document.documentElement.classList.remove("exit"),1000);	
						}
						break;
					case tizen.tvinputdevice.getKey('Info').code:
						$schedule.reload(true,_list.reset); // <--- todo: Ist das gut oder verwirrend bei Steuerung? Oder nur bei Main?
						break;	
				};
			},
			settingsOnKey:function(keyCode) {
				switch (keyCode) {
					case tizen.tvinputdevice.getKey('ArrowUp').code:
						switch (this.selectedSetting) {
							case "autoselect":
								break;
							case "foldEvents":
								this.selectedSetting="autoselect";
								setting_autoselect.parentElement.classList.add("setting--hover");
								setting_foldEvents.parentElement.classList.remove("setting--hover");
								break;
							case "avplay":
								this.selectedSetting="foldEvents";
								setting_foldEvents.parentElement.classList.add("setting--hover");
								setting_avplay.parentElement.classList.remove("setting--hover");
								break;
							case "s365pseudo": // todo: setting_s365pseudo
								this.selectedSetting="avplay";
								setting_avplay.parentElement.classList.add("setting--hover");
								setting_s365pseudo.parentElement.classList.remove("setting--hover");
								break;							
							default:
								this.selectedSetting="autoselect";
								setting_autoselect.parentElement.classList.add("setting--hover");
								break;															
						};
						break;
					case tizen.tvinputdevice.getKey('ArrowDown').code:
						switch (this.selectedSetting) {
							case "autoselect":
								this.selectedSetting="foldEvents";
								setting_foldEvents.parentElement.classList.add("setting--hover");
								setting_autoselect.parentElement.classList.remove("setting--hover");
								break;				
							case "foldEvents":
								this.selectedSetting="avplay";
								setting_avplay.parentElement.classList.add("setting--hover");
								setting_foldEvents.parentElement.classList.remove("setting--hover");
								break;
								 // todo: setting_s365pseudo
	//						case "avplay":
	//							break;						
							case "avplay":
								this.selectedSetting="s365pseudo";
								setting_s365pseudo.parentElement.classList.add("setting--hover");
								setting_avplay.parentElement.classList.remove("setting--hover");
								break;
							case "s365pseudo": // todo: setting_s365pseudo
								break;
								
							default:
								this.selectedSetting="autoselect";
								setting_autoselect.parentElement.classList.add("setting--hover");
								break;															
						};
						break;			
					case tizen.tvinputdevice.getKey('Enter').code:
						switch (this.selectedSetting) {
							case "autoselect":
								setting_autoselect.checked=!setting_autoselect.checked;
								localStorage.setItem('autoselect',setting_autoselect.checked);
								$settings.autoselect=setting_autoselect.checked;
								break;				
							case "foldEvents":
								setting_foldEvents.checked=!setting_foldEvents.checked;
								localStorage.setItem('foldEvents',setting_foldEvents.checked);
								$settings.foldEvents=setting_foldEvents.checked;							
								break;
							case "avplay":
								setting_avplay.checked=!setting_avplay.checked;
								localStorage.setItem('avplay',setting_avplay.checked);
								$settings.avplay=setting_avplay.checked;								
								break;
							 // todo: setting_s365pseudo
							case "s365pseudo":
								setting_s365pseudo.checked=!setting_s365pseudo.checked;
								localStorage.setItem('s365pseudo',setting_s365pseudo.checked);
								$settings.s365pseudo=setting_s365pseudo.checked;								
								break;																				
						};
						break;				
					case tizen.tvinputdevice.getKey('Back').code:
						$schedule.reload(false,_list.reset);
						break;
					case tizen.tvinputdevice.getKey('ArrowLeft').code:
						_menu.focus();
						break;					
				};
			},
			blur:function() {
				$schedule.list().currentEvent.classList.remove("event--hover");
			},
			reset:function() {
				list0.currentEvent=list0.querySelector(".event");
				if (list0.currentEvent && !schedule.classList.contains("schedule--menu") && $schedule.list()===list0) _event.select(list0.currentEvent);
			}
		},
		
		_event={
			previous:function(obj) {
				let nxt=obj.previousElementSibling;
				while(nxt && !nxt.classList.contains("event")) nxt=nxt.previousElementSibling;
				return nxt;
			},
			next:function(obj) {
				let nxt=obj.nextElementSibling;
				while(nxt && !nxt.classList.contains("event")) nxt=nxt.nextElementSibling;
				return nxt;
			},
			select:function(obj,pos) {
				obj.classList.add("event--hover");
				obj.parentElement.currentEvent=obj;
				if (obj.currentStream) _stream.select(obj.currentStream,true);
					else selectedElement=obj;
				const list=obj.offsetParent;
				// todo: ggf. dy nicht header-Höhe sondern margin-top
				switch (pos) {
					case null:
					case "":
						break;
					case "top":
						list.scrollTop=obj.offsetTop-obj.firstElementChild.clientHeight;
						break;
					case "bottom":
						list.scrollTop=obj.offsetTop-list.offsetHeight+obj.offsetHeight+obj.firstElementChild.clientHeight;
						break;
					case "center":
						list.scrollTop=obj.offsetTop-(list.offsetHeight-obj.clientHeight)/2;
						break;
					case "auto":
					default:
						const dy=obj.firstElementChild.clientHeight;
				    if (obj.offsetTop - dy < list.scrollTop) { // overTop
				    	list.scrollTop=obj.offsetTop-dy;
				    } else if ((obj.offsetTop + obj.clientHeight + dy) > (list.scrollTop + list.clientHeight)) { // overBottom
				    	list.scrollTop=obj.offsetTop-list.offsetHeight+obj.offsetHeight+dy;
				    }					
				}						  
			}, // select
			refreshStreams:function(evnt) {
				evnt.currentStream=null;				
				$schedule.openEvent(evnt,ok=>{
					if (ok===true) {
						const cur=evnt.querySelector(".stream");
						if (cur) _stream.select(cur);
					}
				});
			},
			isOpen:(evnt)=>evnt.classList.contains("event--open"),
			onKey:function(keyCode) {
				switch (keyCode) {
					case tizen.tvinputdevice.getKey('ArrowLeft').code:
							_menu.focus();
							_list.blur();
							break;						
					case tizen.tvinputdevice.getKey('ArrowUp').code:
						(function() {
							let pre=_event.previous(this);
							if (pre) {
								_event.select(pre);
								this.classList.remove("event--hover");
							}
						}).call(this);
						break;
					case tizen.tvinputdevice.getKey('ArrowDown').code:
						(function() {
							let nxt=_event.next(this);
							if (nxt) { 
								_event.select(nxt);
								this.classList.remove("event--hover");
							}
						}).call(this);
						break;
					case tizen.tvinputdevice.getKey('Back').code:
						if (_event.isOpen(this)) {
							$schedule.closeEvent(this);
							this.currentStream=null;						
						} else if ($schedule.closeSub()) {
							_list.focus(list0);
						} else if (document.documentElement.classList.contains("exit")) {
							exitApp();
						} else {
							document.documentElement.classList.add("exit");
							setTimeout(()=>document.documentElement.classList.remove("exit"),1000);	
						}
						break;													
					case tizen.tvinputdevice.getKey('Enter').code:
						$schedule.openEvent(this,ok=>{
							if (ok!==null) {
								if (ok===true) {
									const cur=this.querySelector(".stream");
									if (cur) _stream.select(cur);
								}	else {
									list1.currentEvent=null;
									_list.focus(list1);
									this.classList.remove("event--hover");
									this.parentElement.currentEvent=this;
								}
							}
						});
						break;
					case tizen.tvinputdevice.getKey('Info').code:
						if (_event.isOpen(this)) _event.refreshStreams(this);
							else $schedule.reload(true,_list.reset); // <--- todo: Ist das gut oder verwirrend bei Steuerung? Oder nur bei Main?
						break;
				};
			}
		},
		
		_stream={
			parentEvent:(obj)=>obj.parentElement.parentElement.parentElement,
			select:function(obj) {
		    const parentEvent=_stream.parentEvent(obj);
		    obj.classList.add("stream--hover");
		    parentEvent.currentStream=obj;
		    if ($schedule.list().currentEvent===parentEvent) selectedElement=obj;
		    const m=parseInt(window.getComputedStyle(obj,null).getPropertyValue("margin-left")),
		    			p=obj.offsetParent,
		    			dx=obj.offsetWidth;
				if (obj.offsetLeft-m-dx<p.scrollLeft) {
					p.scrollLeft=obj.offsetLeft-m-dx;
				} else if (obj.offsetLeft+obj.offsetWidth+m+dx>p.scrollLeft+p.offsetWidth) {
					p.scrollLeft=obj.offsetLeft+obj.offsetWidth+m+dx-p.offsetWidth;
				}
			},
			onKey:function(keyCode) {
				switch (keyCode) {
					case tizen.tvinputdevice.getKey('ArrowLeft').code:
						if (this.previousElementSibling) {
							this.classList.remove("stream--hover");
							_stream.select(this.previousElementSibling);
						} else {
							_menu.focus();
							_list.blur();		
						}
						break;
					case tizen.tvinputdevice.getKey('ArrowRight').code:
						if (this.nextElementSibling) {
							this.classList.remove("stream--hover");
							_stream.select(this.nextElementSibling);
						}				
						break;
					case tizen.tvinputdevice.getKey('ArrowUp').code:
						(function() {
							const parentEvent=_stream.parentEvent(this);
							let pre=_event.previous(parentEvent);
							if (pre) {
								_event.select(pre);
								parentEvent.classList.remove("event--hover");
							}
						}).call(this);
						break;
					case tizen.tvinputdevice.getKey('ArrowDown').code:
						(function() {
							const parentEvent=_stream.parentEvent(this);
							let nxt=_event.next(parentEvent);
							if (nxt) { 
								_event.select(nxt);
								parentEvent.classList.remove("event--hover");
							}
						}).call(this);
						break;
					case tizen.tvinputdevice.getKey('Back').code:
						(function() {
							const parentEvent=_stream.parentEvent(this);
							$schedule.closeEvent(parentEvent);
							parentEvent.currentStream=null;
							selectedElement=parentEvent;
						}).call(this);
						break;													
					case tizen.tvinputdevice.getKey('Enter').code:
						$schedule.openStream(this);
						//todo: muss hier noch mehr passieren???
						break;
					case tizen.tvinputdevice.getKey('Info').code:
						_event.refreshStreams(_stream.parentEvent(this));				
						break;
				};		
			}
		},
		
		_video={
			onkey:function(keyCode) {
				switch (keyCode) {
					case tizen.tvinputdevice.getKey('ArrowRight').code:
					case tizen.tvinputdevice.getKey('ArrowLeft').code:
					case tizen.tvinputdevice.getKey('ArrowDown').code:
					case tizen.tvinputdevice.getKey('Info').code:
						_videoBar.open(this);
						break;
					case tizen.tvinputdevice.getKey('MediaStop').code:	
					case tizen.tvinputdevice.getKey('Back').code:
						$video.close();
						_list.focus($schedule.list());
						break;													
					case tizen.tvinputdevice.getKey('MediaRewind').code:
					case tizen.tvinputdevice.getKey('ChannelDown').code:
						this.previousStream();
						break;
					case tizen.tvinputdevice.getKey('MediaFastForward').code:
					case tizen.tvinputdevice.getKey('ChannelUp').code:
						this.nextStream();
						break;
					case tizen.tvinputdevice.getKey('MediaPlay').code:
						if (this.isError() && this.stream) $video.play(this.stream);
						break;
					case tizen.tvinputdevice.getKey('Enter').code:
						if (this.isError() && this.stream) $video.play(this.stream);
							else _videoBar.open(this);
						break;
				};			
			}
		},
		
		_videoBar={
			open:function(player) {
				selectedElement=player.videoBar.open();
				if (selectedElement.player.stream) _videoBar.selectStream(selectedElement.player.stream.streamBarObj,selectedElement);
			},
			selectStream:function(streamObj,bar) {
				if (bar.selectedStream) bar.selectedStream.classList.remove("video-stream--hover");
				streamObj.classList.add("video-stream--hover");
				//$video.scrollStreamBar(streamObj.stream); // todo: check
				bar.streamBar.scrollStreamIntoView(streamObj.stream);
				bar.selectedStream=streamObj;
			},
			onkey:function(keyCode) {
				switch (keyCode) {
					case tizen.tvinputdevice.getKey('ArrowRight').code:
						(function() {
							if (this.selectedStream && this.selectedStream.offsetParent) {
								const nx=this.selectedStream.nextSibling;
								if (nx) _videoBar.selectStream(nx,this);
							} else if (this.player.stream && this.player.stream.offsetParent) {
								_videoBar.selectStream(this.player.stream.streamBarObj,this);
							} else {
								const nx=this.obj.querySelector(".video-stream");
								if (nx) _videoBar.selectStream(nx,this);
							}

						}).call(this);
						break;
					case tizen.tvinputdevice.getKey('ArrowLeft').code:
						(function() {
							if (this.selectedStream && this.selectedStream.offsetParent) {
								const nx=this.selectedStream.previousSibling;
								if (nx) _videoBar.selectStream(nx,this);
							} else if (this.player.stream && this.player.stream.offsetParent) {
								_videoBar.selectStream(this.player.stream.streamBarObj,this);
							} else {
								const nx=this.obj.querySelector(".video-stream");
								if (nx) _videoBar.selectStream(nx,this);
							}
						}).call(this);
						break;
					case tizen.tvinputdevice.getKey('MediaPlay').code:
					case tizen.tvinputdevice.getKey('Enter').code:
						if (this.selectedStream) {
							$video.play(this.selectedStream.stream);
						}
						break;					
					case tizen.tvinputdevice.getKey('Back').code:
					case tizen.tvinputdevice.getKey('ArrowUp').code:
						selectedElement=this.close();
						break;
					case tizen.tvinputdevice.getKey('Info').code:
						this.refreshStreams((cur)=>{
							if (cur) _videoBar.selectStream(cur.streamBarObj,this);
						});
						break;
					case tizen.tvinputdevice.getKey('MediaStop').code:
						$video.close();
						_list.focus($schedule.list());
						break;													
					case tizen.tvinputdevice.getKey('MediaRewind').code:
					case tizen.tvinputdevice.getKey('ChannelDown').code:
						this.player.previousStream();
						selectedElement=this.close();
						break;
					case tizen.tvinputdevice.getKey('MediaFastForward').code:
					case tizen.tvinputdevice.getKey('ChannelUp').code:
						this.player.nextStream();
						selectedElement=this.close();
						break;
				};			
			}
		};
		
		menuReload.onKey=_menuItem.onKey;
		menuDe.onKey=_menuItem.onKey;
		menuMain.onKey=_menuItem.onKey;
		menuFb.onKey=_menuItem.onKey;
		menuMore.onKey=_menuItem.onKey;
		menuAudio.onKey=_menuItem.onKey;
		menuGroup.onKey=_menuItem.onKey;
		menuSettings.onKey=_menuItem.onKey;
		list0.onKey=_list.onKey;
		listSettings.onKey=_list.settingsOnKey;
		
		return {
			activateEvent:function(obj) {
				obj.onKey=_event.onKey;
			},
			activateStream:function(obj) {
				obj.onKey=_stream.onKey;
			},
			activateStreamBarStream:function(obj) {
				// nichts
			},
			activateVideoBar:function(obj) {
				obj.onKey=_videoBar.onkey;
			},
			activatePlayer:function(player) {
				player.extendVideoBar();
				if ($settings.avplay) {
						player.video=document.createElement("object");
						player.video.type = 'application/avplayer';
						player.open=function(url) {
							webapis.avplay.stop();
							webapis.avplay.open(url);
							webapis.avplay.setListener({
								onbufferingstart: function() {
							    player.waiting();
							  },
							  onbufferingprogress:function(b) {
							  	player.buffer(b);
							  },
							  onbufferingcomplete: function() {
							   player.canplay();
							  },
							  onstreamcompleted: function() {
							    webapis.avplay.stop();
							    player.error("Stream beendet");
							  },
							  onerror:function(e) {
							  	webapis.avplay.stop();
							  	player.error("Fehler: "+e);
							  }
							});
							webapis.avplay.setDisplayRect(0,0,1920,1080);
							webapis.avplay.prepareAsync(function() {
								webapis.avplay.play();
							},function(e) {
								webapis.avplay.stop();
								player.error("Fehler: "+e);
							});
						};
						player.close=function() {
							webapis.avplay.close();
						};			
				} else {
					player.video=document.createElement("video");
					player.video.autoplay=true;
					player.video.addEventListener("waiting",player.waiting);
					player.video.addEventListener("seeking",player.waiting);
					player.video.addEventListener("canplay",player.canplay);
					player.video.addEventListener("loadstart",player.waiting);
					player.video.addEventListener("ended",()=>player.error("Stream beendet"));
					player.video.addEventListener("stalled",player.waiting);
					player.video.addEventListener("progress",function() {
						if (player.isWaiting()) {
					    if (player.video.duration > 0) for (var i = 0; i < player.video.buffered.length; i++) {
				        if (player.video.buffered.start(player.video.buffered.length - 1 - i) <= player.video.currentTime) {
				          player.buffer((player.video.buffered.end(player.video.buffered.length - 1 - i) / player.video.duration) * 100);
				          break;
				        }
				      }
				    }
					});
					//player.video.addEventListener("abort",console.log);
					player.video.addEventListener("error",()=>{
						if ('error' in player.video && player.video.error!==null && ('code' in player.video.error || 'message' in player.video.error)) {
							player.error("Fehler: "+('code' in player.video.error?"["+player.video.error.code+"] ":"")+(player.video.error.message||""));
						} else player.error("Fehler: unbekannter Video-Error");
					});
					player.open=function(url) {
						player.video.src=url;
					};
					player.close=function() {
						player.video.pause();
					};
				}
				player.video.className="video-player";
				player.container.appendChild(player.video);
				player.onKey=_video.onkey;
				selectedElement=player;
				return player;
			},		
			init:function() {

				document.body.addEventListener('keydown', function(e) {
					if (selectedElement!==null) selectedElement.onKey(e.keyCode);
					e.preventDefault();
				});
				
				$schedule.init(
					localStorage.getItem('filter')||"fb",
					localStorage.getItem('audiofilter')||false,
					localStorage.getItem('grouping')||false,
					()=>{
						_list.focus(list0);
					}
				);
				
				schedule.style.opacity="1";
				spinner.style.opacity="0";
				setTimeout(()=>spinner.remove(),1000);				
				
			}
		};
		
	})();

	// todo: setting_s365pseudo
	const s365file=localStorage.getItem('s365pseudo')==="true"?"s365_pseudo.js":"s365.js";
					
	importFiles({
		js:[$srcUrl+"share.js",$srcUrl+s365file],
		css:[$srcUrl+"share.css",$srcUrl+"tizen.css"]
	},()=>$device.init());
}
