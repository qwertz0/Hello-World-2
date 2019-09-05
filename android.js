// v2.0

var $device=null;

const $settings={
	autoselect:localStorage.getItem('autoselect')==="false"?false:true,
	vMinEvents:7,
	vNum:2,
	foldEvents:localStorage.getItem('foldEvents')==="false"?false:true,
	exoplayer:localStorage.getItem('exoplayer')==="false"?false:true, // false = hls.js /  true = exoplayer
	s365pseudo:localStorage.getItem('s365pseudo')==="true"||false // todo: setting_s365pseudo
};

function start() {

	(function() {
		const schedule=document.createElement("div");
		schedule.id="schedule";
		schedule.className="schedule";
		schedule.style.opacity="0";
		schedule.innerHTML=
						'<div class="schedule-hamburger">'
							+'<span class="hamburger-icon" id="hamburger"></span>'
							+'<span class="hamburger-filter"></span>'
							+'<span class="hamburger-audio_group"></span>'
						+'</div>'
					+'<div class="schedule-dimmer" id="dimmer"></div>'
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
					+'</div>'
					+'<div class="schedule-list" id="list0"></div>'
					+'<div class="schedule-list" id="list1"></div>'
					+'<div class="schedule-list" id="listSettings">'
						+'<div class="setting"><input type="checkbox"'+($settings.autoselect?' checked':'')+' id="setting_autoselect"><label for="setting_autoselect">Streams automatisch auswählen</label></div>'
						+'<div class="setting"><input type="checkbox"'+($settings.foldEvents?' checked':'')+' id="setting_foldEvents"><label for="setting_foldEvents">Sprachen zu Untermenüs zusammenfassen</label></div>'
						+'<div class="setting"><input type="checkbox"'+($settings.exoplayer?' checked':'')+' id="setting_exoplayer"><label for="setting_exoplayer">ExoPlayer für Wiedergabe benutzen (erst nach Neustart der App)</label></div>'
						
						// todo: setting_s365pseudo
						+'<div class="setting"><input type="checkbox"'+($settings.s365pseudo?' checked':'')+' id="setting_s365pseudo"><label for="setting_s365pseudo">s365-Test (Neustart notwendig)</label></div>'
					+'</div>'			
				+'</div><div class="msg-exit"></div>';
		document.body.appendChild(schedule);
	})();

	$device=(function() {
		
		var isMenu=false, isHamburger=window.matchMedia("(orientation:portrait)") /*false*/, hoverEvent=null;
		
		const openMenu=function() { schedule.classList.add("schedule--menu"); isMenu=true; },
					closeMenu=function() { schedule.classList.remove("schedule--menu"); isMenu=false; };
		
		// todo: dynamische Erzeugung der Elemente
		const exitMsg=document.createElement("div");
		exitMsg.className="msg-exit";
		document.body.appendChild(exitMsg);

	//	var touch=false;
	//	document.onpointerdown=function(e) {
	//		if (e.pointerType==='touch') {
	//			touch=true;
	//			//document.documentElement.classList.add("--touch");
	//			document.onpointerdown=null;
	//		}
	//	}
		
	//	let smallMediaMatch=window.matchMedia("(max-width: 600px)");	// todo: abgleichen mit css
	//	const switchMenu=function(q){
	//		closeMenu();
	//		isHamburger=q.matches;
	//		if (isHamburger) {
	//			menu.onpointerenter=null;
	//			menu.onpointerleave=null;		
	//		} else {
	//			menu.onpointerenter=function(e) { if (e.pointerType!=="touch") openMenu(); };
	//			menu.onpointerleave=function(e) { if (e.pointerType!=="touch") closeMenu(); };
	//		}
	//	};	
	//	smallMediaMatch.addListener(switchMenu);
	//	switchMenu(smallMediaMatch);

		hamburger.onclick=openMenu;
		dimmer.onclick=closeMenu;

		menu.onpointerenter=function(e) { if (!isMenu && !isHamburger.matches && !(menu.touched=e.pointerType==="touch")) openMenu(); };
		menu.onpointerleave=function(e) { if (!isHamburger.matches && e.pointerType!=="touch") closeMenu(); };	
		menu.onclick=function() { if (menu.touched && !isMenu) openMenu(); };

		// Menü "reinziehen"
		schedule.onpointerdown=function(e) {
			if (e.pointerType!=="touch") return;
			let em=0,
					mx=0,
					raf=false,
					pid=-1,
					x=0,
					x0=0,
					menuMove=false;
			const dx=20,	
						pointerdown=function(e) {
							if (e.pointerType==="touch" && pid===-1) {
								em=parseFloat(getComputedStyle(schedule,null).fontSize);
								mx=16*em;
								if (isMenu || e.clientX<(4-2*isHamburger.matches)*em) {
									x0=e.clientX;
									pid=e.pointerId;
									schedule.onpointermove=pointermove;
									schedule.onpointerup=pointerup;
									schedule.onpointercancel=pointerup;						
								}
							}
						},
						pointerup=function(e) {
							if (pid===e.pointerId) {
								if (menuMove) {
									if (e.clientX-x0>mx/2) openMenu();
										else closeMenu();
									menu.style.left=null;
									menu.style.width=null;
									dimmer.style.opacity=null;
									schedule.classList.remove("--menuMove");
									schedule.releasePointerCapture(e.pointerId);
									menuMove=false;							
								}
								schedule.onpointermove=null;
								schedule.onpointerup=null;
								schedule.onpointercancel=null;
								pid=-1;
							}
						}
						pointermove=function(e) {
							if (pid===e.pointerId) {
								if (menuMove) {
									x=e.clientX;
									if (raf) return;
									window.requestAnimationFrame(swipe);
									raf=true;
								} else if (Math.abs(e.clientX-x0)>dx) {
									schedule.setPointerCapture(e.pointerId);
									menuMove=true;
									schedule.classList.add("--menuMove");
									x0=isMenu?Math.min(e.clientX-mx,0):e.clientX;
								}
							}
						},
						swipe=function() {
							if (menuMove && raf) {
								const p=Math.max(0,Math.min((x-x0)/mx,1));
								if (isHamburger.matches) menu.style.left=-(mx*(1-p))+"px";
									else menu.style.width=(mx*p)+"px";
								dimmer.style.opacity=p/10;
							}
							raf=false;
						};
			schedule.onpointerdown=pointerdown;
			pointerdown(e);
		};
		
		// Scrolling per Air-Maus	
		const addAirMouseScroll=function(obj,xy) { // xy===true => scrolling in x-Richtung
			const _xy=xy?"clientX":"clientY",
						airMouseScroll=function(e) {
							if (e.pointerType!=="mouse") return;
							e.preventDefault();
							const _this=this;
							
							let c0=e[_xy], c=e[_xy], raf=false, act=false, d=10;
							
							const pointercancel=function(evt) {
											if (evt.pointerId===e.pointerId) {
												_this.onpointermove=null;
												_this.onpointerup=null;
												_this.onpointercancel=null;
												if (act) {
													_this.classList.remove("scrll");
													_this.releasePointerCapture(evt.pointerId);
												}
											}
										},
										scrll=function() {
											if (raf) {
												if (xy) _this.scrollBy(c0-c,0);
													else _this.scrollBy(0,c0-c);
												c0=c;
											}
											raf=false;
										};
							_this.onpointermove=function(evt) {
								if (evt.pointerId===e.pointerId) {
									c=evt[_xy];
									if (raf) return;
									if (!act) {
										if (Math.abs(c0-c)>d) {
											c0=c;
											_this.classList.add("scrll");
											_this.setPointerCapture(evt.pointerId);
											act=true;
										}
									} else {
										raf=true;
										window.requestAnimationFrame(scrll);
									}
								}
							};
							_this.onpointerup=pointercancel;	
							_this.onpointercancel=pointercancel;
						};		
			obj.addEventListener('pointerdown',airMouseScroll);
		}; // addAirMouseScroll	
		addAirMouseScroll(list0,false);
		addAirMouseScroll(list1,false);
		
		// Wischgeste "zurück"
		const addSwipeBack=function(obj,callback) {
			let pId=-1;
			obj.addEventListener("pointerdown",function(e) {
				if (e.pointerType!=="touch" || pId!==-1) return;
				pId=e.pointerId;
				obj.setPointerCapture(pId);
				const x0=e.clientX,
							pointerup=function(e) {
								if (e.pointerId!==pId) return;
								if (Math.abs(e.clientX-x0)>200) callback(); // todo: welche Richtung?
								pointercancel(e);
							},
							pointercancel=function(e) {
								if (e.pointerId!==pId) return;
								pId=-1;
								obj.releasePointerCapture(e.pointerId);	
								obj.onpointercancel=null;
								obj.onpointerup=null;
							};
				obj.onpointercancel=pointercancel;
				obj.onpointerup=pointerup;
			});
		};
		addSwipeBack(list1,()=>$schedule.closeSub());
		addSwipeBack(listSettings,()=>$schedule.reload(false));
		
		const activateMenuItem=function(obj,fnc) {
			obj.onpointerenter=function(e) { /*if (e.pointerType!=="touch")*/ obj.classList.add("menu-item--hover"); };
			obj.onpointerleave=function(e) { /*if (e.pointerType!=="touch")*/ obj.classList.remove("menu-item--hover"); };
			obj.onpointerdown=function(e) { obj.touched=e.pointerType==="touch"; }; // todo: siehe "ist das gut???"
			obj.onclick=function() {
				if (isMenu) { // && !menu.preventClick
					fnc();
					if (obj.touched) closeMenu(); // todo: ist das gut???
				}
			};
		};
		activateMenuItem(menuReload,()=>$schedule.reload(true));
		activateMenuItem(menuDe,()=>localStorage.setItem('filter',$schedule.setFilter("de")));
		activateMenuItem(menuMain,()=>localStorage.setItem('filter',$schedule.setFilter("main")));
		activateMenuItem(menuFb,()=>localStorage.setItem('filter',$schedule.setFilter("fb")));
		activateMenuItem(menuMore,()=>localStorage.setItem('filter',$schedule.setFilter("more")));
		activateMenuItem(menuAudio,()=>localStorage.setItem('audiofilter',$schedule.toggleAudiofilter()));
		activateMenuItem(menuGroup,()=>localStorage.setItem('grouping',$schedule.toggleGrouping()));
		activateMenuItem(menuSettings,function() {
			if (!schedule.classList.contains("schedule--settings")) $schedule.openSettings();
		});
		
		const activateCheckBox=function(obj,key) {
			obj.onclick=function() {
				localStorage.setItem(key,obj.checked);
				$settings[key]=obj.checked;		
			};
			obj.checked=$settings[key];	
		};
		activateCheckBox(setting_exoplayer,"exoplayer");
		activateCheckBox(setting_foldEvents,"foldEvents");
		activateCheckBox(setting_autoselect,"autoselect");
		activateCheckBox(setting_s365pseudo,"s365pseudo");

		const backbutton=function() {
			if ($video.isOpen()) {
				if ($settings.exoplayer===true) { // exoplayer
					$video.close();
				} else {
					const _player=$video.getPlayer();
					if (_player.videoBar.isOpen()) {
						_player.videoBar.close();
					} else {
						AndroidFullScreen.showSystemUI();
						$video.close();
					}
				}
			} else if (isMenu) {
				closeMenu();
			} else if (schedule.classList.contains("schedule--settings")) {
				$schedule.reload(false);
			} else if ($schedule.closeSub()) {
				// nichts
			} else if (document.documentElement.classList.contains("exit")) {
				navigator.app.exitApp();
			} else {
				document.documentElement.classList.add("exit");
				setTimeout(()=>document.documentElement.classList.remove("exit"),1000);			
			}
			return false;
		};
		document.addEventListener('backbutton', backbutton);

		return {
			activateEvent:function(obj) {
				const header=obj.firstChild;
				header.onclick=function(e) {
					if (e.shiftKey) $schedule.closeEvent(obj); // todo: Funktioniert das?
						else $schedule.openEvent(obj);
				};
				header.oncontextmenu=function(e) {
					$schedule.closeEvent(obj);
					e.preventDefault();
				};
				obj.onpointerenter=function(e) { this.classList.add("event--hover"); };
				obj.onpointerleave=function(e) { 
					this.classList.remove("event--hover");
					this.classList.toggle("event--touched",e.pointerType==="touch");
				};
			},
			activateStream:function(obj) {
				obj.onclick=function() { $schedule.openStream(obj); };
				obj.onpointerenter=function(e) { this.classList.add("stream--hover"); };
				obj.onpointerleave=function(e) { this.classList.remove("stream--hover"); };
			},
			activateVideoBar:function(bar) {
				bar.obj.onpointerenter=function(e) {
					if (e.pointerType!=="touch") bar.open();
				};
				bar.obj.onpointerleave=function(e) {
					if (e.pointerType!=="touch") bar.close();
				};
				bar.obj.onpointerdown=function(e) {
					if (e.pointerType!=="touch") return;
					let oH, barMove, y0, y, p,
							raf=false,
							pId=-1;
					const dy=20,
								pointerdown=function(e) {
									if (e.pointerType==="touch" && pId===-1) {
										oH=bar.obj.offsetHeight;
										p=null;
										barMove=false;
										pId=e.pointerId;
										bar.obj.setPointerCapture(pId);
										y0=e.clientY;
									}
								},
								pointerup=function(e) {
									if (e.pointerId===pId) {
										if (barMove) {
											if (p!==null) {
												if (p>0.5) bar.open();
													else bar.close();
											}
											bar.obj.style.bottom=null;
											bar.obj.style.opacity=null;
											bar.obj.classList.remove("video-bar--touchMove");
											barMove=false;
										}
										bar.obj.releasePointerCapture(pId);
										pId=-1;
									}
								},						
								swipe=function() {
									if (barMove) {
										p=Math.max(0,Math.min((y0-y)/oH,1));
										bar.obj.style.bottom=(oH*(p-1))+"px";
										bar.obj.style.opacity=p;					
									}
									raf=false;							
								};
					bar.obj.onpointerdown=pointerdown;
					bar.obj.onpointermove=function(e) {
						if (e.pointerId===pId) {
							if (barMove) {
								y=e.clientY;
								if (raf) return;
								raf=true;
								window.requestAnimationFrame(swipe);
							} else if (Math.abs(y0-e.clientY)>dy) {
								barMove=true;
								y0=e.clientY+bar.isOpen()*oH;
								bar.obj.classList.add("video-bar--touchMove");
							}
						}
					};
					bar.obj.onpointerup=pointerup;
					bar.obj.onpointercancel=pointerup;			
					pointerdown(e);
				};
				addAirMouseScroll(bar.streamBar.obj,true);
				const videoBarReload=document.createElement("div");
				videoBarReload.innerHTML="&#xe800;";
				videoBarReload.className="video-bar-reload";
				videoBarReload.onclick=function() {
					bar.refreshStreams();
				};
				bar.obj.appendChild(videoBarReload);
			},
			activateStreamBarStream:function(obj) {
				obj.onclick=function() { $video.play(this.stream); }
				obj.onpointerenter=function(e) { this.classList.add("video-stream--hover"); };
				obj.onpointerleave=function(e) { this.classList.remove("video-stream--hover"); };			
			},
			activatePlayer:function(player) {
				const containerPointerdown=function(e) {
					if (e.pointerType!=="touch") return;
					let x,y,pId=-1;
					const //t=20, // Toleranz für Klick
								ty=0.1, // Toleranz für swipe (ty * |x0-x1|)
								dx=200, // swipe-Schwelle
								pointerdown=function(e) {
									if (pId===-1 && e.pointerType==="touch" && e.target===player.container) {
										player.container.setPointerCapture(pId=e.pointerId);
										y=e.clientY;
										x=e.clientX;
									}
								},
								pointerup=function(e) {
									if (e.pointerId===pId) {
										x-=e.clientX;
										y=Math.abs(e.clientY-y);
										if (y<ty*x) {
											x-=e.clientX;
											if (-x>dx) player.nextStream();
												else if (x>dx) player.previousStream();
													//else if (player.videoBar.isOpen() && y<t && Math.abs(x)<t) player.videoBar.close();
										}
										pId=-1;
										player.container.releasePointerCapture(e.pointerId);
									}
								};
					player.container.onpointerdown=pointerdown;
					player.container.onpointerup=pointerup;
					player.container.onpointercancel=pointerup;			
					pointerdown(e);				
				};
				
				if ($settings.exoplayer) {
					const successCallback=function(success){
									console.log(success); // todo
									if (success.eventType==="KEY_EVENT") {
										if (success.eventAction==="ACTION_DOWN") {
									    if(success.eventKeycode == 'KEYCODE_BACK'){
									    	setTimeout(()=>$video.close(),100); // Verzögerung, um "doppelten"/"durchreichen" des Back-Button zu vermeiden
									    } else if(success.eventKeycode == 'KEYCODE_SPACE' || success.eventKeycode == 'KEYCODE_ENTER') { // todo: ggf. AirMausklick
									    	window.ExoPlayer.showController();
									    } else if(success.eventKeycode == 'KEYCODE_DPAD_LEFT' || success.eventKeycode == 'KEYCODE_DPAD_DOWN' || success.eventKeycode == 'KEYCODE_PAGE_DOWN') {
					        			player.previousStream();		    	
									    } else if(success.eventKeycode == 'KEYCODE_DPAD_RIGHT' || success.eventKeycode == 'KEYCODE_DPAD_UP' || success.eventKeycode == 'KEYCODE_PAGE_UP') {
					        			player.nextStream();			    	
									    } else if(success.eventKeycode == 'KEYCODE_X') { // todo: Löschen
									    	window.ExoPlayer.close();
												player.error("Testfehler");
									    }
									  }
									} else if(success.eventType == 'TOUCH_EVENT'){
							        window.ExoPlayer.showController();
							        if (success.eventAction==='ACTION_DOWN') {
							        	pointer.x=success.eventAxisX;
							        	pointer.y=success.eventAxisY;
							        } else if (success.eventAction==='ACTION_UP') {
							        	const dy=Math.abs(pointer.y-success.eventAxisY),
							        				dx=Math.abs(pointer.x-success.eventAxisX);
							        	if (dx>500 && dy<dx/10) {
							        		if (pointer.x>success.eventAxisX) player.previousStream();
							        			else player.nextStream();
							        	}
							        }
							    }
								},
								errorCallback=function(err) {
									console.log(err); //todo
									window.ExoPlayer.close();
									player.error(err.errorMessage||"unbekannter Fehler");							
								},
								pointer={x:0,y:0};
					player.close=window.ExoPlayer.close;
					player.open=function(url) {
						const dsc=player.event.time+" - "+player.broadcast.lang+" - Stream "+(player.stream.id+1);
						player.canplay();
						window.ExoPlayer.getState((r)=>{
							if (r.playbackState==="STATE_ENDED") window.ExoPlayer.show({url: url,controller:{streamTitle:player.event.title,streamDescription:dsc,hideProgress:true}},successCallback,errorCallback);
								else window.ExoPlayer.setStream(url,{streamTitle:player.event.title,streamDescription:dsc,hideProgress:true});
						},()=>{
							window.ExoPlayer.show({url: url,controller:{streamTitle:player.event.title,streamDescription:dsc,hideProgress:true}},successCallback,errorCallback);
						}); // getstate
					};
					player.container.onpointerdown=containerPointerdown;

				} else {  // hls.js

					if (typeof Hls==="function" && Hls.isSupported()) {
						player.extendVideoBar();
						Hls.onHlsError=function(event,data) {
							const hls_fehlermeldung=(data.fatal?"Schwerer ":"")+
												(data.type===Hls.ErrorTypes.NETWORK_ERROR?"Netzwerkfehler (":
												data.type===Hls.ErrorTypes.MEDIA_ERROR?"Medienfehler (":
												data.type===Hls.ErrorTypes.MUX_ERROR?"Mux-Fehler (":
												data.type===Hls.ErrorTypes.OTHER_ERROR?"Fehler (":
												"Unbekannter Fehler (")+data.details+")!";
							//console.log("HLS "+(data.fatal?"Fatal ":"")+"Error",data.type,data.details,data);
					    if (data.fatal) {
					    	player.error(hls_fehlermeldung);
					    	player.hls.destroy();
					    } //else if (data.details!=="bufferStalledError")		
						};
						Hls.onHlsFragLoadProgress=function(event,data){
							if (player.isWaiting()) player.buffer(data.stats.loaded/data.stats.total*100);
						};
						player.video=document.createElement("video");
						player.video.autoplay=true;
						player.video.poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // um default-poster (grauer Play-Button) zu vermeiden
						player.video.addEventListener("waiting",player.waiting);
						player.video.addEventListener("seeking",player.waiting);
						player.video.addEventListener("canplay",player.canplay);
						player.video.addEventListener("loadstart",player.waiting);
						player.video.addEventListener("ended",()=>player.error("Stream beendet"));
						player.video.addEventListener("stalled",player.waiting);
						/* scheint bei Hls nicht zu funktionieren:
						player.video.addEventListener("progress",function() {
							if (player.isWaiting()) {
								console.log("progress",player.video.duration,player.video.buffered.length,player.video.currentTime);
						    if (player.video.duration > 0) for (var i = 0; i < player.video.buffered.length; i++) {
					        if (player.video.buffered.start(player.video.buffered.length - 1 - i) <= player.video.currentTime) {
					          player.buffer((player.video.buffered.end(player.video.buffered.length - 1 - i) / player.video.duration) * 100);
					          break;
					        }
					      }
					    }
						});
						*/
						//player.video.addEventListener("abort",console.log);
						player.video.addEventListener("error",()=>{
							if ('error' in player.video && player.video.error!==null && ('code' in player.video.error || 'message' in player.video.error)) {
								player.error("Fehler: "+('code' in player.video.error?"["+player.video.error.code+"] ":"")+(player.video.error.message||""));
							} else player.error("Fehler: unbekannter Video-Error");
						});
						player.open=function(url) {
				  		if (player.hls) {
								player.hls.destroy();
								if (player.hls.bufferTimer) { clearInterval(player.hls.bufferTimer); player.hls.bufferTimer=undefined; }
								player.hls=null;		  			
				  		}				
							player.hls=new Hls();
							player.hls.on(Hls.Events.ERROR,Hls.onHlsError);
							//player.hls.on(Hls.Events.MANIFEST_PARSED,function() { player.video.play(); });
							player.hls.on(Hls.Events.FRAG_LOAD_PROGRESS,Hls.onHlsFragLoadProgress);
					    player.hls.loadSource(url);
					    player.hls.attachMedia(player.video);
						};
						player.close=()=>{
							if (player.hls) {
								player.hls.destroy();
								if (player.hls.bufferTimer) { clearInterval(player.hls.bufferTimer); player.hls.bufferTimer=undefined; }
								player.hls=null;
							}
						};
						player.video.className="video-player";
						player.container.appendChild(player.video);
						player.container.onpointerdown=containerPointerdown;
						player.container.onclick=function() { if (player.videoBar.isOpen()) player.videoBar.close(); };
						AndroidFullScreen.immersiveMode();
					} else {
						player.video=null;
						player.close=()=>{};
						player.error("HLS nicht unterstützt");
					}
				}
				return player;
			},
			init:function() {
				document.body.addEventListener('keydown', function(e) {
					switch (e.keyCode) {
						case 37:
						case 40:
						case 34:
							if ($video.isOpen()) $video.getPlayer().previousStream();
							break;
						case 38:
						case 39:
						case 33:
							if ($video.isOpen()) $video.getPlayer().nextStream();
							break;						
					};
				});		

				$schedule.init(
					localStorage.getItem('filter')||"fb",
					localStorage.getItem('audiofilter')||false,
					localStorage.getItem('grouping')||false
				);
				
				schedule.style.opacity="1";
				spinner.style.opacity="0";
				setTimeout(()=>{
					spinner.remove();
					document.body.style.background="#f0f0f0";
				},1000);				
								
			}
		};
		
	})();

	(function() {
		
		let JS=[$srcUrl+"share.js"];
		if (localStorage.getItem('exoplayer')==="false") JS.push($deviceUrl+"lib/hls.light.min.js");
			
		// todo: setting_s365pseudo
		if (localStorage.getItem('s365pseudo')==="true") JS.push($srcUrl+"s365_pseudo.js");
			else JS.push($srcUrl+"s365.js");
		
		importFiles({
			js:JS,
			css:[$srcUrl+"share.css",$srcUrl+"android.css"]
		},()=>$device.init());
		
	})();
	
} // start
