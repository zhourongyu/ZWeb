function range_build(){
	var S = KISSY,
	    DOM = S.DOM,
	    Event = S.Event; 
	var range = DOM.get('#menu-big-range'),
	    range_btn = DOM.get('#menu-big-range-btn'),
	    notes = DOM.query('.note'),
	    note_height = 150;
	var range_length = DOM.width(range)-12,
	    range_v = 0;
	var range_click_flg = false;
	Event.on(range_btn,'mousedown',function(){
		notes = DOM.query('.note');
		range_click_flg = true;
	});
	Event.on(document,'mouseup',function(){
		range_click_flg = false;
	});
	Event.on(document,'mousemove',function(e){
		range_v = e.clientX-5-DOM.offset(range).left;
		if(range_click_flg == true && range_v > 0&& range_v < range_length){
			DOM.offset(range_btn,{left:e.clientX-5,right:e.clientY});
			DOM.width(notes,note_height+range_v-1);
			DOM.height(notes,note_height+range_v-1);
			DOM.css(notes,'font-size',(note_height+range_v-1)/150*14+"px");
		}
	});
	Event.on(range,'click',function(e){
		notes = DOM.query('.note');
		range_v = e.clientX-5-DOM.offset(range).left;
		if(range_v < 0) range_v = 1;
		if(range_v > range_length-1) range_v = range_length-1;
		DOM.offset(range_btn,{left:DOM.offset(range).left+range_v,right:e.clientY});
		DOM.width(notes,note_height+range_v-1);
		DOM.height(notes,note_height+range_v-1);
		DOM.css(notes,'font-size',(note_height+range_v-1)/150*14+"px");
	});
	Event.on('#menu-big-s','click',function(e){
		notes = DOM.query('.note');
		range_v = 1;
		DOM.offset(range_btn,{left:DOM.offset(range).left+range_v,right:e.clientY});
		DOM.width(notes,note_height+range_v-1);
		DOM.height(notes,note_height+range_v-1);
		DOM.css(notes,'font-size',(note_height+range_v-1)/150*14+"px");
	});
	Event.on('#menu-big-b','click',function(e){
		notes = DOM.query('.note');
		range_v = range_length-1;
		DOM.offset(range_btn,{left:DOM.offset(range).left+range_v-1,right:e.clientY});
		DOM.width(notes,note_height+range_v-1);
		DOM.height(notes,note_height+range_v-1);
		DOM.css(notes,'font-size',(note_height+range_v-1)/150*14+"px");
	});
};
function note_event_build(node,db){
	var S = KISSY,
	    DOM = S.DOM,
	    Event = S.Event;
	var drop = DOM.children(node,'.drop')[0];
	Event.on(node,'mouseenter',function(){DOM.css(drop,'display','block');});
	Event.on(node,'mouseleave',function(){DOM.css(drop,'display','none');});
	Event.on(node,'click',function(e){
		if(e.target.tagName == 'B'||e.target.tagName == 'b'){
			DOM.remove(node);
			db.transaction( 
				function(tx){
					tx.executeSql("DELETE FROM NOTES WHERE id = ?", 
						[node.id], null, null); 
				} 
			); 
			return false;
		}
		var copy = DOM.create(S.clone(node));
		DOM.remove(DOM.children(copy,'.note-cover')[0]);
		DOM.remove(DOM.children(copy,'.drop')[0]);
		var txt =DOM.children(copy,'.note-txt')[0];
		var nodeHeight = 500;
		var nodeWidth  = 500;
		DOM.css(copy,'z-index','15');
		DOM.append(copy,'body');
		DOM.append(DOM.create('<em class="close"><b>×</b></em>'),copy);
		DOM.offset(copy,DOM.offset(node));
		var Anim = new S.Anim(copy, {width:(nodeWidth+'px'),height:(nodeHeight-40+'px'),top:(DOM.height('#notelist')-nodeHeight)/2+'px',left:(DOM.width('#notelist')-nodeWidth)/2+'px','font-size':'16px','margin-left':'-30px','padding-top':'50px','padding-left':'30px','padding-right':'30px','padding-bottom':'50px'},0.5,S.Easing.easeOutStrong,function(){
		zy_scrollbar(txt,'on');
		});
		tgo('#cover');
		Anim.run();
		Event.on(window,'resize',function(){
			var Anim = new S.Anim(copy, {top:(DOM.height('#notelist')-nodeHeight)/2+'px',left:(DOM.width('#notelist')-nodeWidth)/2+'px','font-size':'16px'},0.5,S.Easing.easeOutStrong);
			Anim.run();
		});
		Event.on(DOM.children(copy,'.close')[0],'click',function(){
			zy_scrollbar(txt,'off');
			var Anim = new S.Anim(copy, {width:DOM.width(node)+'px',height:DOM.height(node)+'px',top:DOM.offset(node).top+'px',left:DOM.offset(node).left+'px','font-size':DOM.css(node,'font-size'),'margin':'0px',padding:'5px'},0.5,S.Easing.easeOutStrong,function(){
				DOM.remove(copy);
				Event.remove(window,'resize');
			});
			tgo('#cover');
			Anim.run();
		})
	});
}
function tgo(node){
	var S = KISSY,
	    DOM = S.DOM,
	    Event = S.Event; 
	if(S.isString(node)) var cover = DOM.get(node);
	else var cover = node;
	DOM.css(cover,'display') == 'none' ? DOM.css(cover,'display','block') : DOM.css(cover,'display','none');
}
function tiny_build(){
	new TINY.editor.edit('editor',{//原来这里本来是KISSY EDITOR的位置，原来一直想用
		id:'tinyeditor',                          //KISSY EDITOR的，因为我用的KISSY的类库，想想总是
		width:470,                                //配套的好，发现KISSY EDITOR的本地化很不易，不能加载
		height:250,                               //图片，表格什么的。
		cssclass:'te',                            //虽然现在tiny也只是能够加载图片的url
		controlclass:'tecontrol',                 //tiny的取值比较麻烦，还好我没在这里用过iframe。不然就重了
		rowclass:'teheader',
		dividerclass:'tedivider',
		controls:['bold','italic','underline','strikethrough','|',
				  'orderedlist','unorderedlist','|','outdent','indent','|','leftalign',
				  'centeralign','rightalign','blockjustify','|','unformat','n','undo','redo',
				  'font','|','image','link','unlink','|','cut','copy','paste'],
		footer:true,
		fonts:['Verdana','Arial','Georgia','Trebuchet MS','宋体','微软雅黑','幼圆','隶书'],
		xhtml:true,
		cssfile:'style/tiny.css',
		bodyid:'editor',
		footerclass:'tefooter',
		toggle:{text:'source',activetext:'wysiwyg',cssclass:'toggle'}
	});
}
function zy_scrollbar(node,on){
	var S = KISSY,
	    DOM = S.DOM,
	    Event = S.Event; 
	//html_build
	if(on == 'on'){
		var content = DOM.create('<div class="zy_scrollbar-content"></div>')
	      bar = DOM.create('<div class="zy_scrollbar-bar" onselectstart="return false"><div class="zy_scrollbar-btn"><div class="zy_scrollbar-style"></div></div></div>');
	      btn = DOM.children(bar)[0];
	      style = DOM.children(btn)[0];
		DOM.insertBefore(content,node);
		DOM.remove(node);
		DOM.append(bar,content);
		DOM.append(node,content);
		DOM.css(content,{
			position:'relative',
			height:'100%',
			width:'100%',
		});
		DOM.css(bar,{
			width:'20px',
			position:'absolute',
			top:'40px',
			bottom:'40px',
			right:'-20px',
			overflow:''
		});
		DOM.css(btn,{
			height:(DOM.height(bar)/DOM.height(node)*DOM.height(content) > DOM.height(bar) ? DOM.height(bar) : DOM.height(bar)/DOM.height(node)*DOM.height(content))+'px',
			'border-color':'#fff',
			'border-width':'6px',
			'border-style':'solid'
		});
		DOM.css(style,{
			height:'100%',
			width:'100%',
			background:'#333',
			'-webkit-border-radius': '8px',
			'-moz-border-radius': '8px',
			'border-radius': '8px'
		});
		//event_build
		var btn_click_flg = false;
		var top,
		    point_top = 0,
		    ofst_top = 0,
		    tet_top = DOM.offset(node).top,
		    ofst_left = DOM.offset(btn).left;
		Event.on(btn,'mousedown',function(e){btn_click_flg = true;point_top = e.clientY;ofst_top = DOM.offset(btn).top});
		Event.on(document,'mouseup',function(){btn_click_flg = false});
		Event.on(document,'mousemove',function(e){
			top = e.clientY-(point_top-ofst_top);
			if(btn_click_flg == true && top > DOM.offset(bar).top && (top+DOM.height(btn)) < (DOM.offset(bar).top + DOM.height(bar))){
				DOM.offset(btn,{
					left:ofst_left,
					top:top
				});
				DOM.offset(node,{
					left:DOM.offset(node).left,
					top:tet_top-(DOM.offset(btn).top-DOM.offset(bar).top)*(DOM.height(node)+100)/DOM.height(bar)
				});
			}
		})
	}
	if(on == 'off'){
		//break_event
		Event.remove(document,'mouseup',function(){btn_click_flg = false});
		Event.remove(document,'mousemove',function(e){
			top = e.clientY-(point_top-ofst_top);
			if(btn_click_flg == true && top > DOM.offset(bar).top && (top+DOM.height(btn)) < (DOM.offset(bar).top + DOM.height(bar))){
				DOM.offset(btn,{
					left:ofst_left,
					top:top
				});
				DOM.offset(node,{
					left:DOM.offset(node).left,
					top:tet_top-(DOM.offset(btn).top-DOM.offset(bar).top)*(DOM.height(node)+100)/DOM.height(bar)
				});
			}
		});
		var content = DOM.parent(node);
		if(DOM.hasClass(content,'zy_scrollbar-content')){
			DOM.insertBefore(node,content);
			DOM.remove(content);
		}
	}
}
KISSY.ready(function(S){
	var DOM = S.DOM,
	    Event = S.Event; 
	if(KISSY.UA.core == 'trident'){//再见ie
		var body = DOM.get('body');
		body.innerHTML = "本案为html5实验作品。<br />您的浏览器不支持html5。<br />为了保证您的浏览体验，<br />请更换或升级浏览了。<br />谢谢";
		DOM.addClass(body,'ie');
	}
	if(!window.openDatabase){ //检测浏览器是否支持cs-db 
		alert('not supported cs-db! \n 您的浏览器不支持本地储存技术。请详见下面的AboutNote'); 
	} 
	else { 
		if(KISSY.UA.core == 'presto'){
			alert('您的opera浏览器支持本地储存。\n但是朱一做的时候发现opera只支持名值对的形式储存数据，所以本案暂不支持opera。\n抱歉，详见下面的AboutNote。\n');
		}
		var shortName = 'notesDB'; 
		var version = '1.0'; 
		var displayName = 'Notes database'; 
		var maxSize = 65536; //创建一个数据库 
		var db = openDatabase(shortName,version,displayName,maxSize);
		db.transaction( 
			function(tx) { 
				tx.executeSql("SELECT COUNT(*) FROM NOTES" , [] , null , function(tx, error) { 
					tx.executeSql("CREATE TABLE NOTES (id  INTEGER NOT NULL PRIMARY KEY, note TEXT, date TEXT)",
       [], null, null); } ); } ); 
    db.transaction( 
			function(tx) { tx.executeSql("SELECT * FROM NOTES", [],  function(tx, result) { 
				for(var i = 0,newNode; i < result.rows.length; i++){
					//alert(result.rows.item(i)['note']+"|"+result.rows.item(i)['date']); 
					newNode = DOM.create('<section id="'+result.rows.item(i)['id']+'" class="note"><div class="note-txt">'+result.rows.item(i)['note']+'</div><div class="note-date">'+result.rows.item(i)['date']+'</div><div class="note-cover"></div><em class="drop"><b>drop!</b></em></section>');
					DOM.prepend(newNode,'article');
					note_event_build(newNode,db);
				}}, null); 
			} 
		);
	} 		
	range_build();
	S.each(DOM.query('.note'),function(item){
		note_event_build(item,db);
	});
	//new-note
	tiny_build();
	Event.on('#menu-new-note','click',function(){
		tgo('#cover');
		tgo('#new-note');
	});
	Event.on('#new-note .close','click',function(){
		tgo('#cover');
		tgo(DOM.parent(this));
	});
	Event.on('#new-note-submit','click',function(){//write
		var newData = DOM.get('iframe').contentWindow.document.body.innerHTML;
		var newDate = new Date();
		var dateStr = newDate.getFullYear()+"."+(newDate.getMonth()+1)+"."+newDate.getDate();
		var thisnode = this;
		db.transaction( 
			function(tx){ 
				tx.executeSql("INSERT INTO NOTES (note, date) values(?, ?)", 
					[newData, dateStr], null, null);
			} 
		);  
		db.transaction( 
			function(tx) { tx.executeSql("SELECT * FROM NOTES", [],  function(tx, result) { 
				var newid = result.rows.item(result.rows.length-1)['id'];
				var newNode = DOM.create('<section id="'+newid+'" class="note"><div class="note-txt">'+newData+'</div><div class="note-date">'+dateStr+'</div><div class="note-cover"></div><em class="drop"><b>drop!</b></em></section>')
				DOM.prepend(newNode,'article');
				DOM.height(newNode,DOM.height(DOM.next(newNode)));
				DOM.width(newNode,DOM.width(DOM.next(newNode)));
				note_event_build(newNode,db);
				tgo('#cover');
				tgo(DOM.parent(thisnode));
				DOM.get('iframe').contentWindow.document.body.innerHTML = '';
				}, null); 
			} 
		);
	});
	Event.on('#new-note-reset','click',function(){DOM.get('iframe').contentWindow.document.body.innerHTML = ''});
	Event.on('#menu-Abo-note','click',function(){
		tgo('#cover');
		tgo('#about-note');
	});
	Event.on('#menu-home','click',function(){
		self.location='/';
	});
	Event.on('#about-note .close','click',function(){
		tgo('#cover');
		tgo('#about-note');
	});
	
})