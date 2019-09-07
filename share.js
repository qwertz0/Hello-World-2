// v1.0
const $schedule=(function() {
	
	let _events=[], _list=list0;

	return {
		setFilter:function(f,callback) {
			schedule.setAttribute("filter",f);
			getSchedule(
				f,
				schedule.classList.contains("schedule--audiofilter"),
				schedule.classList.contains("schedule--group"),
				callback
			);
			return f;			
		},
		toggleAudiofilter:function(callback) {
			const a=schedule.classList.toggle("schedule--audiofilter");
			getSchedule(
				schedule.getAttribute("filter")||"more",
				a,
				schedule.classList.contains("schedule--group"),
				callback
			);
			return a;
		},
		toggleGrouping:function(callback) {
			const g=schedule.classList.toggle("schedule--group");
			getSchedule(
				schedule.getAttribute("filter")||"more",
				schedule.classList.contains("schedule--audiofilter"),
				g,
				callback
			);
			return g;
		},		
		openSettings:function(callback) {
			_list=listSettings;
			schedule.classList.add("schedule--settings");
			if (typeof callback==='function') callback();
		},
		openEvent:function(evnt,callback) {
			callback=typeof callback==='function'?callback:function(){};
			if (evnt.event.online) {
				if (evnt.broadcast===null) {
					openSub(evnt.event);
					callback(false);
				} else if ($settings.autoselect) {
					$video.open(evnt.event,evnt.broadcast);
					callback(null);
				} else if (!evnt.loading) {
					getStreams(evnt.event,evnt.broadcast,evnt,function(ok) {
						callback(ok?true:null);
					});
				} else callback(null);
			} else callback(null);
		},
		refreshLinks:function(ev,bc,callback) {
			getStreams(ev,bc,null,callback);
		},
		closeEvent:function(evnt) {
			evnt.classList.remove("event--open","event--loading");
			evnt.getElementsByClassName("event-content")[0].innerHTML="";
		},
		openStream:function(strm) {
			const e=strm.parentElement.parentElement.parentElement;
			$video.open(e.event,e.broadcast,strm.stream);
		},
//		isMain:()=>_list===list0,
//		isSub:()=>_list===list1,
		list:()=>_list,
		closeSub:closeSub,
		mediaPlaying:function(s) {
			if (s.streamObj) s.streamObj.classList.add("stream--played");
		},
		reload:function(resetKey,callback) {
			if (resetKey) $s365.resetKey();
			getSchedule(
				schedule.getAttribute("filter")||"more",
				schedule.classList.contains("schedule--audiofilter"),
				schedule.classList.contains("schedule--group"),
				callback
			);
		},
		init:function(f,af,gf,callback) {
			f=f||"fb";
			schedule.setAttribute("filter",f);
			schedule.classList.toggle("schedule--audiofilter",af===true);
			schedule.classList.toggle("schedule--group",gf===true);
			getSchedule(f,af===true,gf===true,callback);			
		} // init
		
	}; // return
	
	function getStreams(ev,bc,obj,callback) {
		if (obj===null) obj=document.getElementById(ev.id+"~"+bc.id);
		let content=null;
		if ($settings.autoselect===false && obj) {
			obj.loading=true;
			obj.classList.add("event--loading");
			obj.classList.add("event--open");
			content=obj.children[1]; //.getElementsByClassName("event-content")[0];
			content.innerHTML="<span class='event-streams'></span><div class='spinner event-spinner'></div>";
			const dy=parseInt(window.getComputedStyle(obj,null).getPropertyValue("margin-bottom"));
	    if ((obj.offsetTop + obj.clientHeight + dy) > (_list.scrollTop + _list.clientHeight-_list.offsetTop)) { // overBottom
	    	_list.scrollTop=obj.offsetTop-_list.offsetHeight+_list.offsetTop+obj.offsetHeight+dy;
	    }
		}
		$s365.getLinks(bc.url)
			.then(links=>{
				if (_events.some(x=>x===ev)) {
					const oldStreams=bc.streams||[];
					bc.streams=links.map((l,i)=>({url:l,id:i,played:(oldStreams.find(s=>s.url===l)||{}).played||false}));
					if (content && obj.offsetParent!==null) {
						const streamsObj=content.firstChild;//content.getElementsByClassName("event-streams")[0];
						bc.streams.forEach((l,i)=>{
							const o=document.createElement("span");
							o.stream=l;
							o.innerHTML=i+1;
							o.id=ev.id+"~"+bc.id+"~"+l.id;
							l.streamObj=o;
							o.className="stream"+(l.played?" stream--played":"");
							streamsObj.appendChild(o);
							$device.activateStream(o);
						});
						obj.classList.remove("event--loading");
						obj.loading=false;				
					}
					callback(true,bc.streams);				
				} else callback(null,null);
			}).catch(e=>{
				if (content && obj.offsetParent!==null) {
					if (e!==null) {
						console.log("FEHLER",e);
						content.firstChild.innerHTML="Fehler beim Laden!";
					} else obj.classList.remove("event--open");
					obj.classList.remove("event--loading");
					obj.loading=false;
				} else if (e!==null) console.log("FEHLER",e);
				callback(e!==null?false:null,e);
			});
	}
	
	function closeSub() {
		if (_list!==list0) {
			_list=list0;
			schedule.classList.remove("schedule--sub","schedule--settings");
			return true;
		} else return false;
	}

	function drawHeadline(t) {
		const o=document.createElement("div");
		o.className="list-seperator";
		o.innerHTML=t;
		_list.appendChild(o);
		return o;
	}
					
	function drawEvent(x,z) {									
		const o=document.createElement("div"),
				hasAwayLogo=typeof x.away==='number';
		if (typeof z==='undefined') z=x.langs.length===1?x.langs[0]:x;
		o.className="event"+(z.online?" event--online":"")+(z.de?" event--german":"")+(z.en?" event--english":"");
		o.event=x;
		if (z.lang) {
			o.id=x.id+"~"+z.id;
			o.broadcast=z;
		} else {
			x.id=x.id;
			o.broadcast=null;
		}		
		o.innerHTML='<div class="event-header"><div class="event-time">'+x.time+'</div><div class="event-label"><div class="event-title">'+x.title+'</div><div class="event-league">'+x.sub+'</div></div><div class="event-logos">'
								+'</div><div class="event-lang"><span>'+(z.lang||"Multilingual")+'</span></div></div><div class="event-content"></div>';
		if (typeof x.home==='number') {
			const el=o.firstChild.children[2],
						hl=document.createElement("div");
			hl.style.backgroundImage='url('+$deviceUrl+'logos/'+x.home+'.svg)';
			el.appendChild(hl);
			if (typeof x.away==='number') {
				const al=document.createElement("div");
				al.style.backgroundImage='url('+$deviceUrl+'logos/'+x.away+'.svg)';
				el.appendChild(al);				
			}
		}
		_list.appendChild(o);
		$device.activateEvent(o);
		return o;
	}

	function openSub(x) {
		_list=list1;
		schedule.classList.add("schedule--sub");
		list1.innerHTML='<div id="listSpinner" class="spinner schedule-spinner"></div>';
		list1.classList.add("schedule-list--loading");
		
		const hlObj=drawHeadline(x.title);
		let online=false;
		x.langs.forEach(z=>{
			online=online||z.online;
			drawEvent(x,z);
		});
		if (online) hlObj.classList.add("list-seperator--online");
		list1.classList.remove("schedule-list--loading");
	}
	
	function getSchedule(f,de,grp,callback) {
		
		callback=typeof callback==='function'?callback:function(){};
		
		_events=[];
		closeSub();

		list0.innerHTML='<div id="listSpinner" class="spinner schedule-spinner"></div>';
		list0.removeAttribute("text");
		list0.classList.add("schedule-list--loading");
		
		$s365.getEvents(f!=="more",de)
			.then(events=>{
				console.log(events);
				if (f==="de") events=events.filter(e=>e.nat===true); // oder .filter(e=>e.cat<3)
					else if (f==="main") events=events.filter(e=>e.cat<5);				
				
				if (events.length>0) {
										
					if (grp) {
						events.sort((a,b)=>{
							if (a.cat!==b.cat) {
								return a.cat-b.cat;
							} else if (a.cat===7) {
								const _a=a.sport.toLowerCase(),
											_b=b.sport.toLowerCase();
								return _a===_b?a.i-b.i:_a>_b?1:-1; // a.i-b.i statt 0 um auf tizen stabil zu sortieren!
							} else return a.i-b.i;
						}).forEach(e=>{
							e.group=e.cat!==7
								?(["1. Bundesliga","2. Bundesliga","DFB Pokal","UEFA Champions League","UEFA Europa League","Fußball (sonstiges)","?","","?","Sonstiges"])[e.cat]
								:e.sport;
						});
					} else {
						events.forEach(e=>{
							e.group=parseInt(e.time.substr(0,e.time.indexOf(":")))+":00";
						});
					}
					
					let v=[];
					if (events.length>$settings.vMinEvents && $settings.vNum>0) {
						let p=[];
						events.forEach((e,i)=>{
							if (e.online) {
								if (typeof e.home==='number') {
									if (typeof e.away==='number') p[i]=Math.min(e.home,e.away);
										else p[i]=e.home===40?1:e.home;
								}	else if (typeof e.away==='number') {
									p[i]=e.away;
								} else if (e.nat) {
									p[i]=e.de?96:e.en?97:98;
								} else if (e.de) {
									p[i]=99;
								} else p[i]=Infinity;
							} else p[i]=Infinity;
						});						
						for (let j=0, mn, idx, o; j<$settings.vNum; j++) {
							mn=Math.min(...p);
							if (mn===Infinity) break;
							idx=p.indexOf(mn);
							p[idx]=Infinity;
							o=Object.assign({},events[idx]);
							if (!$settings.foldEvents) o.langs=[o.langs[0]];
							o.id="_"+events[idx].id;
							o.group="Vorschläge";
							v.push(o)
						}
					}
										
					_events=v.concat(events);
					
					let g="", online=false, hlObj=null;
					_events.forEach(x=>{
						if (g!==x.group) {
							if (online) hlObj.classList.add("list-seperator--online");
							hlObj=drawHeadline(g=x.group);
							online=x.online;
						} else online=online||x.online;
						if ($settings.foldEvents===true) drawEvent(x);
							else x.langs.forEach(z=>drawEvent(x,z));
					});
					if (online) hlObj.classList.add("list-seperator--online");
					list0.classList.remove("schedule-list--loading");
					callback(true);
				}  else { 
					/* Keine Ereignisse vorhanden! */
					list0.classList.remove("schedule-list--loading");
					list0.setAttribute("text","");
					callback(true);
				}
			}).catch(e=>{
				if (e!==null) {
					console.log("FEHLER:",e);
					list0.setAttribute("text",e);
					list0.classList.remove("schedule-list--loading");
					callback(false,e);
				} else {
					callback(null);
				}
			});
	}
	
})();

const $video=(function () {
		
	var player=null;
	
	const Player=function(evnt,broadcast) {
		this.container=document.createElement("div");
		this._status=0;
		this.event=evnt;
		this.broadcast=broadcast;
		this.waiting=()=>{
			this.container.classList.add("video--loading");
			this.container.removeAttribute("error");
			this._status=1;
		};
		this.buffer=()=>{};
		this.canplay=()=>{
			this.container.classList.remove("video--loading");
			this.container.removeAttribute("error");
			this._status=2;
		};
		this.error=(e)=>{
			if (e!==null) {
				//$s365.adshell.remove();
				this.container.setAttribute("error",e);
				this._status=-1;
			}
		};
		this.isError=()=>this._status===-1, //()=>this.container.hasAttribute("error"),
		this.isWaiting=()=>this._status===1,
		this.stream=null,
		this.playing=(stream)=>this.stream=stream,			
		this.nextStream=()=>{
			const n=this.broadcast.streams.length;
			if (this.stream && n>1) {
				let i=this.stream.id+1;
				if (i<n) $video.play(this.broadcast.streams[i]);
					else $video.play(this.broadcast.streams[0]);
			}
		};
		this.previousStream=()=>{
			const n=this.broadcast.streams.length;
			if (this.stream && n>1) {
				let i=this.stream.id-1;
				if (i>-1) $video.play(this.broadcast.streams[i]);
					else $video.play(this.broadcast.streams[n-1]);
			}
		};
		this.streamBar={
			error:()=>{},
			draw:()=>{}
		};		
		this.videoBar={
			isOpen:()=>false,
			open:()=>{},
			streamBar:this.streamBar,
			player:this
		};
		this.extendVideoBar=()=>{
			this.buffer=(b)=>videoSpinner.setAttribute("buffer",~~b);
			this.videoBar.obj=document.createElement("div");
			this.videoBar.close=()=>{
				this.container.classList.remove("video--bar");
				return this;
			};
			this.videoBar.open=()=>{
				this.container.classList.add("video--bar");
				return this.videoBar;
			};
			this.videoBar.isOpen=()=>this.container.classList.contains("video--bar");
			this.videoBar.refreshStreams=(callback)=>{
				callback=typeof callback==='function'?callback:()=>{};
				if (!this.streamBar.obj.classList.contains("video-streambar--loading")) {
					this.streamBar.obj.classList.add("video-streambar--loading");
					$schedule.refreshLinks(this.event,this.broadcast,(ok,r)=>{
						if (ok) {
							this.streamBar.draw(this.broadcast.streams);
							const cur=this.broadcast.streams.find(s=>s.url===this.stream.url);
							if (cur) this.playing(cur);
							callback(cur);
						} else this.streamBar.error(r);
					});
				}
			};
			this.streamBar.obj=document.createElement("div");
			this.streamBar.draw=(streams)=>{
				const _streams=this.streamBar.obj.firstChild;
				_streams.innerHTML="";
				if (!streams) {
					this.streamBar.obj.classList.add("video-streambar--loading");
				} else {
					if (streams.length===0) {
						_streams.innerHTML="Keine Streams gefunden!";
					} else {
						streams.forEach((s,i)=>{
							const obj=document.createElement("div");
							obj.className="video-stream"+(s.played?" video-stream--played":"");
							obj.innerHTML=(i+1);
							obj.stream=s;
							s.streamBarObj=obj;
							$device.activateStreamBarStream(obj);
							_streams.appendChild(obj);
						});
					}
					this.streamBar.obj.classList.remove("video-streambar--loading");
				}
			}; // draw
			this.playing=(stream)=>{
				if (this.stream) this.stream.streamBarObj.classList.remove("video-stream--playing");
				this.stream=stream;
				stream.streamBarObj.classList.add("video-stream--played","video-stream--playing");
				this.streamBar.scrollStreamIntoView(stream);
			};
			this.streamBar.scrollStreamIntoView=(stream)=>{
				const obj=stream.streamBarObj;
				if (obj && obj.offsetParent) {
					const p=obj.offsetParent,
								m=parseInt(window.getComputedStyle(obj,null).marginLeft),
								dx=obj.offsetWidth;
					if (obj.offsetLeft-m-dx<p.scrollLeft) {
						p.scrollLeft=obj.offsetLeft-m-dx;
					} else if (obj.offsetLeft+obj.offsetWidth+m+dx>p.scrollLeft+p.offsetWidth) {
						p.scrollLeft=obj.offsetLeft+obj.offsetWidth+m+dx-p.offsetWidth;
					}
				}	
			};
			this.streamBar.error=(e)=>{
				this.streamBar.obj.firstChild.innerHTML="Fehler: "+e;
				this.streamBar.obj.classList.remove("video-streambar--loading");
			};

			this.container.innerHTML+='<div class="video-gradient"></div>';
			this.videoBar.obj.className="video-bar";
			this.videoBar.obj.innerHTML='<div class="video-info"><div class="video-info-meta"><div class="video-info-time">'
					+this.event.time
					+'</div><div class="video-info-lang">'
					+this.broadcast.lang
					+'</div></div><div class="video-info-title">'
					+this.event.title
					+'</div></div>';
			this.streamBar.obj.className="video-streambar video-streambar--loading";
			this.streamBar.obj.innerHTML='<span class="video-streams"></span><div class="spinner video-streambar-spinner"></div>';
			this.videoBar.obj.appendChild(this.streamBar.obj);
			this.container.appendChild(this.videoBar.obj);
			$device.activateVideoBar(this.videoBar);
			this.extendVideoBar=()=>{};
			return this;
		};
		//player.streamBar.videoBar=player.videoBar;
		this.container.className="video-container video--loading video-container--hidden";
		this.container.innerHTML+='<div id="videoSpinner" class="spinner video-spinner"></div>';
		document.body.appendChild(this.container);
		setTimeout(()=>this.container.classList.remove("video-container--hidden"),50);
		return this;
	};

	return {
		open:function(evnt,broadcast,stream) {
			player=new Player(evnt,broadcast);
			$device.activatePlayer(player);
			if (player.video!==null) {
				document.body.style.background="black";
				if (!Array.isArray(broadcast.streams) || broadcast.streams.length===0) {
					$schedule.refreshLinks(evnt,broadcast,(ok,r)=>{
						if (ok) {
							const n=broadcast.streams.length
							player.streamBar.draw(broadcast.streams);
							if (n===0) {
								player.error("Keine Streams gefunden!");					
							} else {
								stream=broadcast.streams[Math.floor(Math.random()*n)];
								$video.play(stream);
							}					
						} else {
							player.error(r);
							player.streamBar.error(r);
						}
					});
				} else {
					player.streamBar.draw(broadcast.streams);
					if (typeof stream==='undefined') stream=broadcast.streams[Math.floor(Math.random()*broadcast.streams.length)];
					$video.play(stream);
				}
			}
		},
		play:function(stream) {
			if (player!==null) {
				player.waiting();
				player.buffer(0);
				$schedule.mediaPlaying(stream);
				player.playing(stream);
				stream.played=true;
				$s365.getStream(stream.url,function(r) {
					$s365.adshell.attach(r.banner,function(ok) {
						player.open(r.url);
					});
				},(e)=>player.error(e));
			} else console.error("$video.play: Kein Player!");
		},
		close:function() {
			if (player && player.isClosing!==true) {
				player.isClosing=true;
				$s365.adshell.remove();
				player.container.classList.add("video-container--hidden");
				player.close();
				document.body.style.background="#f0f0f0";
				setTimeout(()=>{
					player.container.remove();
					player=null;
				},500);
			}
		},
		isOpen:()=>player!==null,
		getPlayer:()=>player
	};
	
})();
