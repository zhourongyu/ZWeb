var ppt={};
ppt.turnpage = function(num,DOM){
	ppt.pageIndx = num;
	ppt.pageList.style.marginLeft = num*(-1000)+'px';
	for(var i=0;i<ppt.points.length;i++){
		if(i<=num) ppt.points[i].style.backgroundColor = '#8DD34A';
		else ppt.points[i].style.backgroundColor = '#fff';
		ppt.line.style.width = ppt.pointRate*num+10+'px';
	}
}
KISSY.ready(function(S){
	var DOM = S.DOM,
		Event = S.Event;
	ppt.content = DOM.get('#ppt-content');
	ppt.pageList = DOM.get('#ppt-content .page-list');
	ppt.pages = DOM.children(ppt.pageList,'.page');
	ppt.pointBlock = DOM.get('#ppt-bottombar .process');
	ppt.points =[]; 
	ppt.line = DOM.get('#ppt-bottombar .line');
	DOM.width(ppt.pageList,ppt.pages.length*1000+10);
	ppt.pointRate = (DOM.width(ppt.pointBlock)-50)/(ppt.pages.length-1);
	for(var i=0;i<ppt.pages.length;i++){
		ppt.points[i] = DOM.create('<div class="point">'+i+'</div>');
		ppt.points[i].Index = i;
		DOM.append(ppt.points[i],ppt.pointBlock);
		ppt.points[i].style.left = ppt.pointRate*i+'px';
		Event.on(ppt.points[i],'click',function(){
			ppt.turnpage(this.Index,DOM);
		})
	}
	Event.on(DOM.get('#home'),'click',function(){
		self.location='/';
	})
	Event.on(DOM.get('#notes'),'click',function(){
		self.location='/notes';
	})
	Event.on(DOM.get('#btn-left'),'click',function(){
		if(ppt.pageIndx<=0) return false;
		ppt.turnpage(ppt.pageIndx-1,DOM);
	})
	Event.on(DOM.get('#btn-right'),'click',function(){
		if(ppt.pageIndx>=ppt.pages.length-1) return false;
		ppt.turnpage(ppt.pageIndx+1,DOM);
	})
	Event.on(document,'keyup',function(e){
		ppt.content.scrollLeft = '0px';
		if(e.keyCode == 9) return false;
		if(e.keyCode == 39){
			if(ppt.pageIndx>=ppt.pages.length-1) return false;
			ppt.turnpage(ppt.pageIndx+1,DOM);
		}else if(e.keyCode == 37){
				if(ppt.pageIndx<=0) return false;
				ppt.turnpage(ppt.pageIndx-1,DOM);
			}
	})
	ppt.turnpage(0,DOM);
	
	
	
	
	
})



function DrawImage(ImgD,iwidth,iheight){   
    //参数(图片,允许的宽度,允许的高度)   
    var image=new Image();   
    image.src=ImgD.src;   
    if(image.width>0 && image.height>0){   
      if(image.width/image.height>= iwidth/iheight){   
          if(image.width>iwidth){     
              ImgD.width=iwidth;   
              ImgD.height=(image.height*iwidth)/image.width;   
          }else{   
              ImgD.width=image.width;     
              ImgD.height=image.height;   
          }   
      }else{   
          if(image.height>iheight){     
              ImgD.height=iheight;   
              ImgD.width=(image.width*iheight)/image.height;           
          }else{   
              ImgD.width=image.width;     
              ImgD.height=image.height;   
          }   
      }   
    }   
}  