KISSY.ready(function(S){
	var DOM = S.DOM,
		Event = S.Event;
	//=======page-0=============================
	(function(){
		var page1 = DOM.get('.page-0');
		var love = function(content,S){
			var love = S.DOM.create('<div class="love"></div>');
			var top = 80+Math.random()*100,
				left = 150+Math.random()*600;
			S.DOM.css(love,{
				top:top+'px',
				left:left+'px',
				backgroundImage:'url(/static/img/love'+parseInt(Math.random()*5)+'.png)'
			});
			S.DOM.append(love,content);		
			S.Anim(love,{
				top:top-20+'px',
				left:Math.random()>0.5?left-10+'px':left+10+'px',
				opacity:0
			},2,S.Easing.easeOut,function(){
				S.DOM.remove(love);
			}).run();
		}
		setInterval(function(){new love(page1,S)},500);	
	})();
})