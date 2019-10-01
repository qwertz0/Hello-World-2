// v1.0
const $s365=(function() {
	
	const teamFilter=["monchengladbach",null,"dortmund","bayern","fortuna","schalke","fckoln","paderborn","leverkusen","leipzig","frankfurt","freiburg","bremen","hertha","union","hoffenheim","wolfsburg","mainz","augsburg",null,null,"hamburg","stuttgart","stpauli","hannover","bochum","bielefeld","nurnberg","karlsruhe","erzgebirge","darmstadt","dresden","greuther","heidenheim","holstein","osnabruck","regensburg","sandhausen","wiesbaden",null,null,null,null,null,"liverpool","barcelona","saintgermain","realmadrid","manchestercity","juventus"];
	
	const adshell=(function(){
		let _timer=null, //[],
				_err=0; //[];			
		const fetch=function(/*id,*/url,callback) {
						console.log("PSEUDO: Lade adshell (1)"/*,id*/,url);
						setTimeout(()=>{
							//callback(err(/*id,*/100));
							callback(ok(/*id*/));
						},500);
					},
					err=function(/*id,*/status) {
						_err/*[id]*/++;
						console.log("PSEUDO: Banner-Error: "+status+" ("+_err+")"/*,id*/);
						if (_err/*[id]*/>4 && _timer/*[id]*/!==null) {
							console.log("PSEUDO: ==> Remove Adshell"/*,id*/);
							clearTimeout(_timer/*[id]*/);
							_timer/*[id]*/=null;
						}
						return status;										
					},
					ok=function(/*id*/) {
						console.log("PSEUDO: Banner OK"/*,id*/);
						_err/*[id]*/=0;
						return 0;
					};
		return {
			remove:function(/*id*/) {
				if (_timer/*[id]*/!==null) {
					console.log("PSEUDO: Remove Adshell"/*,id*/);
					clearTimeout(_timer/*[id]*/);
					_timer/*[id]*/=null;
				}
			},
			/*
			clear:function() {
				_timer.forEach((t,i)=>{
					if (t!==null) {
						console.log("PSEUDO: Remove Adshell",i);
						clearTimeout(t);
						t=null;					
					}
				});
			},
			*/
			attach:function(/*id,*/banner,callback) {
				console.log("PSEUDO: Attach Adshell"/*,id*/,banner);
				if (_timer/*[id]*/!==null) clearTimeout(_timer/*[id]*/);
				_err/*[id]*/=0;
				if (typeof banner==='string') {
					_timer/*[id]*/=setInterval(fetch,60000/*,id*/,banner,()=>{}); // <----- alle 1 Minuten erneuern
					fetch(/*id,*/banner,callback);
				} else {
					_timer/*[id]*/=null;
					callback(-1);
				}
			}
		};
	})(); // adshell
	
	return {
		
		resetKey:()=>{console.log("Key gelöscht")},
			
		getLinks:function(url,callback,err) {
			const _getLinks=function(resolve,reject) {
				console.log("PSEUDO: getLinks",url);
				setTimeout(()=>{
					//reject("Testfehler");
					//reject(null); // Bei Abbruch beim Erneuern des xKeys
					//resolve([]);
					/**/
					resolve([
						"http://video/0",
						"http://video/1",
						"http://video/2",
						"http://video/3",
						"http://video/4",
						"http://video/5",
						"http://video/6",
						"http://video/7",
						"http://video/8",
						"http://video/9",
						"http://video/10",
						"http://video/11",
						"http://video/12",
						"http://video/13",
						"http://video/14",
						"http://video/15",
						"http://video/16",
						"http://video/17",
						"http://video/18",
						"http://video/19"
					]);/**/
				},2000);				
			};
			if (typeof callback==='function') _getLinks(callback,err);
				else return new Promise(_getLinks);			
		},
		
		getStream:function(url,callback,err) {
			const _getStream=function(resolve,reject) {
				console.log("PSEUDO: getStream",url);
				let _url="http://easyhtml5video.com/assets/video/new/index_de/Penguins_of_Madagascar.m4v";
				switch (url.replace("http://video/","")) {
					case "1":_url="http://www.html5videoplayer.net/videos/toystory.mp4"; break;
					case "2":_url="https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"; break;
					case "3":_url="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"; break;
					case "4":_url="https://mnmedias.api.telequebec.tv/m3u8/29880.m3u8"; break;
					case "5":_url="http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8"; break;
					case "6":_url="http://www.streambox.fr/playlists/test_001/stream.m3u8"; break;
					
				};
				setTimeout(()=>{
					resolve({url:_url,banner:"pseudoBanner"});
				},200);				
			};
			if (typeof callback==='function') _getStream(callback,err);
				else return new Promise(_getStream);			
		},

							
		adshell:{
			attach:adshell.attach,
			remove:adshell.remove,
			clear:adshell.clear
		},
	
		getEvents:(function() {
			let nw=null;
			return function(fussball,de,callback,err) {
				const _nw=nw=Date.now();
				console.log("PSEUDO: getEvents",fussball,de,_nw);
				const _getEvents=function(resolve,reject) {
					setTimeout(()=>{
						if (nw!==_nw) {
							reject(null);
						} else if (false) { // Fehler
							reject("Test-Fehler in getEvents");
						} else {
							
							// Datensatz "leer"
							 //let R=[];
							
							// Datensetz 1
							//let R=JSON.parse('[{"time":"13:30","title":"Miami Heat - Orlando Magic","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0010","online":true,"lang":"HQ Deutsch"},{"time":"13:30","title":"Miami Heat - Orlando Magic","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0011","online":true,"lang":"HQ Englisch"},{"time":"13:30","title":"Miami Heat - Orlando Magic","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0012","online":true,"lang":"HQ Sonstwas"},{"time":"13:30","title":"Hamburger SV - Vfl Bochum","sub":"Fußball / Germany - 2.Bundesliga","url":"/de/links/0102","online":true,"lang":"HQ Englisch"},{"time":"13:30","title":"Hamburger SV - Vfl Bochum","sub":"Fußball / Germany - 2.Bundesliga","url":"/de/links/0103","online":true,"lang":"HQ Deutsch"},{"time":"13:30","title":"Hamburger SV - Vfl Bochum","sub":"Fußball / Germany - 2.Bundesliga","url":"/de/links/0104","online":true,"lang":"HQ Sonstwas"},{"time":"13:30","title":"SV Sandhausen - 1.FC Nurnberg","sub":"Fußball / Germany - 2.Bundesliga","url":"/de/links/0105","online":true,"lang":"HQ Deutsch"},{"time":"13:30","title":"SV Sandhausen - 1.FC Nurnberg","sub":"Fußball / Germany - 2.Bundesliga","url":"/de/links/0106","online":true,"lang":"HQ Sonstwas"},{"time":"13:30","title":"SV Sandhausen - 1.FC Nurnberg","sub":"Fußball / Germany - 2.Bundesliga","url":"/de/links/0107","online":true,"lang":"HQ Englisch"},{"time":"14:30","title":"Real Madrid FC - Fenerbahce","sub":"Fußball / World - Audi Cup","url":"/de/links/0034","online":true,"lang":"HQ Englisch"},{"time":"14:30","title":"Real Madrid FC - Fenerbahce","sub":"Fußball / World - Audi Cup","url":"/de/links/0035","online":true,"lang":"HQ Deutsch"},{"time":"14:30","title":"Real Madrid FC - Fenerbahce","sub":"Fußball / World - Audi Cup","url":"/de/links/0036","online":true,"lang":"HQ Sonstwas"},{"time":"14:30","title":"Real Madrid FC - Fenerbahce","sub":"Fußball / World - Audi Cup","url":"/de/links/0037","online":true,"lang":"Chinesisch"},{"time":"14:45","title":"BMW Open Munich","sub":"Tennis / Germany - BMW Open Munich","url":"/de/links/0336","online":true,"lang":"HQ Deutsch"},{"time":"14:45","title":"BMW Open Munich","sub":"Tennis / Germany - BMW Open Munich","url":"/de/links/0337","online":true,"lang":"HQ Englisch"},{"time":"15:30","title":"Konferenz","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0021","online":true,"lang":"HQ Deutsch"},{"time":"15:30","title":"SC Freiburg - 1. FSV Mainz 05","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0001","online":true,"lang":"HQ Englisch"},{"time":"15:30","title":"SC Freiburg - 1. FSV Mainz 05","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0002","online":true,"lang":"HQ Deutsch"},{"time":"15:30","title":"SC Freiburg - 1. FSV Mainz 05","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0003","online":true,"lang":"HQ Sonstwas"},{"time":"15:30","title":"SC Freiburg - 1. FSV Mainz 05","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0004","online":true,"lang":"Chinesisch"},{"time":"15:30","title":"Borussia Dortmund - FC Augsburg","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0005","online":true,"lang":"HQ Deutsch"},{"time":"15:30","title":"Borussia Dortmund - FC Augsburg","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0006","online":true,"lang":"HQ Englisch"},{"time":"15:30","title":"Borussia Dortmund - FC Augsburg","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0007","online":true,"lang":"HQ Sonstwas"},{"time":"15:30","title":"Borussia Dortmund - FC Augsburg","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0008","online":true,"lang":"Chinesisch"},{"time":"15:30","title":"Vfl Wolfsburg - 1.FC Koln","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0009","online":true,"lang":"Chinesisch"},{"time":"15:30","title":"Vfl Wolfsburg - 1.FC Koln","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0010","online":true,"lang":"HQ Deutsch"},{"time":"15:30","title":"Vfl Wolfsburg - 1.FC Koln","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0011","online":true,"lang":"HQ Englisch"},{"time":"15:30","title":"Vfl Wolfsburg - 1.FC Koln","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0012","online":true,"lang":"HQ Sonstwas"},{"time":"15:30","title":"Bayer Leverkusen - SC Paderborn 07","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0013","online":true,"lang":"HQ Deutsch"},{"time":"15:30","title":"Bayer Leverkusen - SC Paderborn 07","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0014","online":true,"lang":"HQ Englisch"},{"time":"15:30","title":"Bayer Leverkusen - SC Paderborn 07","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0015","online":true,"lang":"HQ Sonstwas"},{"time":"15:30","title":"Werder Bremen - Fortuna Dusseldorf","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0016","online":true,"lang":"HQ Englisch"},{"time":"15:30","title":"Werder Bremen - Fortuna Dusseldorf","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0017","online":true,"lang":"HQ Deutsch"},{"time":"15:30","title":"Werder Bremen - Fortuna Dusseldorf","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0018","online":true,"lang":"HQ Sonstwas"},{"time":"15:30","title":"Werder Bremen - Fortuna Dusseldorf","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0019","online":true,"lang":"Chinesisch"},{"time":"15:30","title":"Bayer Leverkusen - SC Paderborn 07","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0020","online":true,"lang":"Chinesisch"},{"time":"15:30","title":"ATP Washington","sub":"Tennis / USA - ATP Washingtion - Hard","url":"/de/links/0013","online":true,"lang":"HQ Englisch"},{"time":"15:30","title":"ATP Washington","sub":"Tennis / USA - ATP Washingtion - Hard","url":"/de/links/0014","online":true,"lang":"HQ Sonstwas"},{"time":"15:45","title":"Hapoel Ironi Kiryat Shmona - Maccabi Netanya","sub":"Fußball / Israel - Toto Cup Al","url":"/de/links/0033","online":false,"lang":"Chinesisch"},{"time":"15:45","title":"Hapoel Ironi Kiryat Shmona - Maccabi Netanya","sub":"Fußball / Israel - Toto Cup Al","url":"/de/links/0022","online":true,"lang":"HQ Sonstwas"},{"time":"15:45","title":"Hapoel Ironi Kiryat Shmona - Maccabi Netanya","sub":"Fußball / Israel - Toto Cup Al","url":"/de/links/0023","online":false,"lang":"HQ Englisch"},{"time":"16:00","title":"Halma Open","sub":"Hallenhalma / Germany - ABC","url":"/de/links/0999","online":false,"lang":"HQ Englisch"},{"time":"16:30","title":"Indiana Pacers - Atlanta Hawks","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0047","online":false,"lang":"HQ Englisch"},{"time":"16:30","title":"Indiana Pacers - Atlanta Hawks","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0048","online":false,"lang":"HQ Sonstwas"},{"time":"16:30","title":"Wimbledon","sub":"Tennis / Great Britain - Wimbledon - Women - Grass","url":"/de/links/0001","online":false,"lang":"HQ Englisch"},{"time":"16:30","title":"Wimbledon","sub":"Tennis / Great Britain - Wimbledon - Women - Grass","url":"/de/links/0002","online":false,"lang":"HQ Deutsch"},{"time":"17:00","title":"Liverpool FC - Olympique Lyonnais","sub":"Fußball / World - Club Friendlies","url":"/de/links/0024","online":false,"lang":"HQ Deutsch"},{"time":"17:00","title":"Liverpool FC - Olympique Lyonnais","sub":"Fußball / World - Club Friendlies","url":"/de/links/0025","online":false,"lang":"HQ Englisch"},{"time":"17:00","title":"Liverpool FC - Olympique Lyonnais","sub":"Fußball / World - Club Friendlies","url":"/de/links/0026","online":false,"lang":"Chinesisch"},{"time":"17:00","title":"Liverpool FC - Olympique Lyonnais","sub":"Fußball / World - Club Friendlies","url":"/de/links/0027","online":false,"lang":"HQ Sonstwas"},{"time":"18:30","title":"Borussia Monchengladbach - FC Schalke 04","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0028","online":false,"lang":"Chinesisch"},{"time":"18:30","title":"Borussia Monchengladbach - FC Schalke 04","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0029","online":false,"lang":"HQ Sonstwas"},{"time":"18:30","title":"Borussia Monchengladbach - FC Schalke 04","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0030","online":false,"lang":"HQ Deutsch"},{"time":"18:30","title":"Borussia Monchengladbach - FC Schalke 04","sub":"Fußball / Germany - Bundesliga","url":"/de/links/0031","online":false,"lang":"HQ Englisch"},{"time":"19:00","title":"The Open Championship","sub":"Golf / World - British Open","url":"/de/links/0041","online":false,"lang":"HQ Englisch"},{"time":"19:00","title":"The Open Championship","sub":"Golf / World - British Open","url":"/de/links/0042","online":false,"lang":"HQ Sonstwas"},{"time":"19:30","title":"Atlanta Braves - Washington Nationals","sub":"Baseball / North America - MLB","url":"/de/links/0004","online":false,"lang":"HQ Englisch"},{"time":"19:30","title":"Atlanta Braves - Washington Nationals","sub":"Baseball / North America - MLB","url":"/de/links/0005","online":false,"lang":"HQ Spanisch"},{"time":"19:30","title":"Atlanta Braves - Washington Nationals","sub":"Baseball / North America - MLB","url":"/de/links/0006","online":false,"lang":"Sonstwas"}]');
							// Datensatz 2
							let R=JSON.parse('[{"time":"19:00","title":"Wimbledon","sub":"Tennis / Great Britain - Wimbledon - Women - Grass","url":"/de/links/0001","online":true,"lang":"HQ Englisch"},{"time":"19:00","title":"Wimbledon","sub":"Tennis / Great Britain - Wimbledon - Women - Grass","url":"/de/links/0002","online":true,"lang":"HQ Deutsch"},{"time":"19:00","title":"Grand Prix of Aragon","sub":"Motorsports / Moto GP","url":"/de/links/0003","online":true,"lang":"HQ Englisch"},{"time":"19:30","title":"Atlanta Braves - Washington Nationals","sub":"Baseball / North America - MLB","url":"/de/links/0004","online":true,"lang":"HQ Englisch"},{"time":"19:30","title":"Atlanta Braves - Washington Nationals","sub":"Baseball / North America - MLB","url":"/de/links/0005","online":true,"lang":"HQ Spanisch"},{"time":"19:30","title":"Atlanta Braves - Washington Nationals","sub":"Baseball / North America - MLB","url":"/de/links/0006","online":true,"lang":"Sonstwas"},{"time":"20:00","title":"FC Barcelona - PSV Eindhoven","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0007","online":true,"lang":"HQ Deutsch"},{"time":"20:00","title":"FC Barcelona - PSV Eindhoven","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0008","online":true,"lang":"HQ Englisch"},{"time":"20:00","title":"FC Barcelona - PSV Eindhoven","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0009","online":true,"lang":"HQ Sonstwas"},{"time":"20:00","title":"Miami Heat - Orlando Magic","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0010","online":true,"lang":"HQ Deutsch"},{"time":"20:00","title":"Miami Heat - Orlando Magic","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0011","online":true,"lang":"HQ Englisch"},{"time":"20:00","title":"Miami Heat - Orlando Magic","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0012","online":true,"lang":"HQ Sonstwas"},{"time":"20:15","title":"ATP Washington","sub":"Tennis / USA - ATP Washingtion - Hard","url":"/de/links/0013","online":true,"lang":"HQ Englisch"},{"time":"20:15","title":"ATP Washington","sub":"Tennis / USA - ATP Washingtion - Hard","url":"/de/links/0014","online":true,"lang":"HQ Sonstwas"},{"time":"20:30","title":"Konferenz","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0111","online":true,"lang":"HQ Deutsch"},{"time":"20:30","title":"Inter Mailand - Tottenham Hotspur","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0015","online":true,"lang":"HQ Sonstwas"},{"time":"20:30","title":"Inter Mailand - Tottenham Hotspur","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0016","online":true,"lang":"HQ Englisch"},{"time":"20:30","title":"Inter Mailand - Tottenham Hotspur","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0017","online":true,"lang":"HQ Deutsch"},{"time":"20:45","title":"Konferenz","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0018","online":true,"lang":"HQ Deutsch"},{"time":"20:45","title":"KFC Uerdingen - Borussia Dortmund","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0019","online":true,"lang":"HQ Deutsch"},{"time":"20:45","title":"KFC Uerdingen - Borussia Dortmund","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0020","online":true,"lang":"HQ Englisch"},{"time":"20:45","title":"KFC Uerdingen - Borussia Dortmund","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0021","online":true,"lang":"HQ Sonstwas"},{"time":"20:45","title":"SV Sandhausen - Borussia Monchengladbach","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0022","online":true,"lang":"HQ Deutsch"},{"time":"20:45","title":"SV Sandhausen - Borussia Monchengladbach","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0023","online":true,"lang":"HQ Englisch"},{"time":"20:45","title":"SV Sandhausen - Borussia Monchengladbach","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0024","online":true,"lang":"HQ Sonstwas"},{"time":"20:45","title":"ATP Washington","sub":"Tennis / USA - ATP Washingtion - Hard","url":"/de/links/0025","online":true,"lang":"HQ Englisch"},{"time":"20:45","title":"ATP Washington","sub":"Tennis / USA - ATP Washingtion - Hard","url":"/de/links/0026","online":true,"lang":"HQ Deutsch"},{"time":"20:45","title":"FC Ingolstadt - 1.FC Nurnberg","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0027","online":true,"lang":"HQ Englisch"},{"time":"20:45","title":"FC Ingolstadt - 1.FC Nurnberg","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0028","online":true,"lang":"HQ Sonstwas"},{"time":"21:00","title":"FC Liverpool - Paris Saint-Germain","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0029","online":true,"lang":"HQ Deutsch"},{"time":"21:00","title":"FC Liverpool - Paris Saint-Germain","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0030","online":true,"lang":"HQ Englisch"},{"time":"21:00","title":"FC Liverpool - Paris Saint-Germain","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0031","online":true,"lang":"HQ Sonstwas"},{"time":"21:00","title":"Wigan Warriors - Wakefield Trinity Wildcats","sub":"Rugby / Great Britain - Super League","url":"/de/links/0032","online":true,"lang":"HQ Deutsch"},{"time":"21:00","title":"Wigan Warriors - Wakefield Trinity Wildcats","sub":"Rugby / Great Britain - Super League","url":"/de/links/0033","online":true,"lang":"HQ Englisch"},{"time":"21:00","title":"Wigan Warriors - Wakefield Trinity Wildcats","sub":"Rugby / Great Britain - Super League","url":"/de/links/0034","online":true,"lang":"HQ Sonstwas"},{"time":"21:00","title":"1.FC Kaiserslautern - 1.FSV Mainz 05","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0035","online":true,"lang":"HQ Deutsch"},{"time":"21:00","title":"1.FC Kaiserslautern - 1.FSV Mainz 05","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0036","online":false,"lang":"HQ Englisch"},{"time":"21:00","title":"1.FC Kaiserslautern - 1.FSV Mainz 05","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0037","online":true,"lang":"HQ Sonstwas"},{"time":"21:00","title":"Alemannia Aachen - TuS Dassendorf","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0038","online":false,"lang":"HQ Deutsch"},{"time":"21:00","title":"Alemannia Aachen - TuS Dassendorf","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0039","online":false,"lang":"HQ Englisch"},{"time":"21:00","title":"Alemannia Aachen - TuS Dassendorf","sub":"Fußball / Germany - DFB Pokal","url":"/de/links/0040","online":false,"lang":"HQ Sonstwas"},{"time":"21:10","title":"The Open Championship","sub":"Golf / World - British Open","url":"/de/links/0041","online":false,"lang":"HQ Englisch"},{"time":"21:10","title":"The Open Championship","sub":"Golf / World - British Open","url":"/de/links/0042","online":false,"lang":"HQ Sonstwas"},{"time":"21:15","title":"FK Roter Stern Belgrad - SSC Neapel","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0043","online":false,"lang":"HQ Englisch"},{"time":"21:15","title":"FK Roter Stern Belgrad - SSC Neapel","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0044","online":false,"lang":"HQ Deutsch"},{"time":"21:15","title":"FK Roter Stern Belgrad - SSC Neapel","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0045","online":false,"lang":"HQ Sonstwas"},{"time":"21:15","title":"FK Roter Stern Belgrad - SSC Neapel","sub":"Fußball / Europe - UEFA Champions League","url":"/de/links/0046","online":false,"lang":"HQ Sonstwas"},{"time":"21:30","title":"Indiana Pacers - Atlanta Hawks","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0047","online":false,"lang":"HQ Englisch"},{"time":"21:30","title":"Indiana Pacers - Atlanta Hawks","sub":"Basketball / North America - NBA Summer League","url":"/de/links/0048","online":false,"lang":"HQ Sonstwas"},{"time":"22:00","title":"Hapoel Raanana - Beitar Jerusalem","sub":"Fußball / Israel - Toto Cup Al","url":"/de/links/0049","online":false,"lang":"HQ Sonstwas"},{"time":"22:30","title":"WWE Smackdown","sub":"others","url":"/de/links/0050","online":false,"lang":"HQ Englisch"},{"time":"22:30","title":"WWE Smackdown","sub":"others","url":"/de/links/0051","online":false,"lang":"HQ Deutsch"},{"time":"23:00","title":"WTA San Jose","sub":"Tennis / USA - WTA San Jose - Hard","url":"/de/links/0052","online":false,"lang":"HQ Englisch"}]');
							
							if (fussball) R=R.filter(r=>r.sub.indexOf("Fußball")!==-1).map(r=>{r.sub=r.sub.substr(10); return r; });
							if (de) R=R.filter(r=>r.lang.indexOf("Deutsch")!==-1);
														
							R=foldEvents(R).map(e=>{
								e=identEvent(e,fussball,de);
								e.langs.sort((a,b)=>{
									const _a=4*a.online+2*a.de+a.en,
												_b=4*b.online+2*b.de+b.en;
									return _a===_b?0:_a>_b?-1:1;
								});
								return e;
							});

							// Kein Fussball
							// R=R.filter(r=>r.cat>5);
							// kein deutscher Wettbewerb -> nur nat!==true
							// R=R.filter(r=>r.nat!==true);
							// nur offline
							// R=R.filter(r=>r.online!==true);
							// nur ohne p
							// R=R.filter(r=>typeof r.p==='undefined');
							resolve(R);
						} // if ... else if ... else ...
					},1000);
				};
				if (typeof callback==='function') _getEvents(callback,err);
					else return new Promise(_getEvents);
			};
		})()
		
	}; // RETURN
	
	function foldEvents(events) {
		const foldedEvents=[];
		for (let i=0, e, X=[], x, idx; e=events[i]; i++) {
			x=(e.time+e.title+e.sub).replace(/\s/g,"");
			idx=X.indexOf(x);
			if (idx===-1) {
				X.push(x);
				foldedEvents.push({
					time:e.time,
					title:e.title,
					sub:e.sub,
					online:e.online,
					id:x,
					i:i,
					langs:[{lang:e.lang,online:e.online,url:e.url,id:"~0"}]
				});
			} else {
				foldedEvents[idx].online=foldedEvents[idx].online||e.online;
				foldedEvents[idx].langs.push({lang:e.lang,online:e.online,url:e.url,id:"~"+foldedEvents[idx].langs.length});
			}
		} // for
		return foldedEvents;
	} // foldEvents
	
	function identEvent(e,fb,de) {
		let m;
		//e.id=e.url
		e.langs.forEach(x=>{
			x.de=de||/deutsch|german/i.test(x.lang);
			x.en=!x.de&&/englisc?h/i.test(x.lang);
		});
		e.de=e.langs.some(x=>x.de);
		e.en=e.langs.some(x=>x.en);
		if (!fb) {
			m=e.sub.match(/([^\/]+?)\s?\/\s?(.+)/i);
			if (m) {
				e.sport=m[1];
				fb=/^(fu(ß|ss)ball|soccer)$/i.test(e.sport);
				e.cat=fb?5:7;
				m=m[2].match(/([^-]+?)\s?-\s?(.+)/i);
			} else {
				e.cat=9;
				return e;
			}
		} else {
			e.sport="Fußball";
			e.cat=5;
			m=e.sub.match(/([^-]+?)\s?-\s?(.+)/i);
		}
		
		if (m) {
			e.region=m[1];
			e.league=m[2];
			e.nat=/germany|deutschland/i.test(e.region);
			if (fb) {
				m=e.league.toLowerCase();
				if (e.nat) {
					const idx=m.indexOf("bundesliga");
					if (idx!==-1) {
						if (idx===0 || m.indexOf("1.")!==-1) e.cat=0;
							else if (m.indexOf("2.")!==-1) e.cat=1;
					} else if (m.indexOf("dfb pokal")!==-1) e.cat=2;
				} else if (m.indexOf("uefa champions league")!==-1) {
					e.cat=3;
				} else if (m.indexOf("uefa europa league")!==-1) {
					e.cat=4;
				}
			}	
		} // else if (fb) // ggf. cat, auch wenn Format nicht mehr "Region - Liga"
		if (fb) {
			const teams=e.title.toLowerCase().split(" - "), l=teams.length;
			e.home=null; e.away=null;
			if (l===2) {
				const n=teamFilter.length;
				for (let i=0, t=teams[0].replace(/\s|-/g,""); i<n; i++) {if (t.indexOf(teamFilter[i])!==-1) {e.home=i; break;}}
				for (let i=0, t=teams[1].replace(/\s|-/g,""); i<n; i++) {if (t.indexOf(teamFilter[i])!==-1) {e.away=i; break;}}
				if (e.home===null) e.home=[19,38,41,49,51,null][e.cat];
					else if (e.away===null) e.away=[19,38,41,49,51,null][e.cat];
			} else if (l===1 && (teams[0].indexOf("konferenz")!==-1 || teams[0].indexOf("simulcast")!==-1)) {
				e.home=[1,20,40,42,43,null][e.cat];
			} else {
				e.home=[19,38,41,49,51,null][e.cat];
			}
		}
		
//		if (e.online) {
//			if (typeof e.home==='number') {
//				if (typeof e.away==='number') e.p=Math.min(e.home,e.away);
//					else e.p=e.home===40?1:e.home;
//			}	else if (typeof e.away==='number') {
//				e.p=e.away;
//			} else if (e.nat) {
//				e.p=e.de?97:98;
//			} else if (e.de) e.p=99;
//		}
		
		return e;
	} // identEvent
	
})();
	
