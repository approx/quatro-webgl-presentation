function GUIOBJ(webobj,element,description,time,onClick) {
  this.webobj = webobj;
  this.element = element;
  this.description = description;
  this.time =  time;
  this.hoverIten = false;
  var guiobj = this;
  this.onClick = onClick;
  this.element.click(function() {
    guiobj.expand();
  });
  this.enablePosition=true;
}

function screenHeightPercentageToPixel(percentega) {
  return ($('.hud').outerHeight()*percentega)/100;
}

GUIOBJ.prototype.CalculatePosition = function () {
  if(this.enablePosition){
    var meshCenter = SCENE.instance.getCenterPoint(this.webobj.obj3D);
    meshCenter.y+=.6;
    var position = SCENE.instance.vectorToScreen(meshCenter);
    this.element.offset({top:(position.y-this.element.outerHeight()/2),left:(position.x-this.element.outerWidth()/2)});
    this.description.offset({top:(position.y-screenHeightPercentageToPixel(9)),left:(position.x-this.description.outerWidth()/2)});
  };
};

GUIOBJ.prototype.fadeIn = function () {
};

GUIOBJ.prototype.hover = function () {
  if(this.enablePosition){
    var fadeEnded=false;
    if(!this.hoverIten){
      $('html').css('cursor','pointer');
      this.element.fadeTo(300,1);
      this.description.css('opacity','1');
    }
    //console.log('hover');
    this.hoverIten=true;
  }
};

GUIOBJ.prototype.exit = function () {
  this.element.css({backgroundColor:'transparent'});
  this.element.animate({opacity:'0'},1000);
  var obj = this;
  setTimeout(function () {
    obj.element.css({transform:'',opacity:''});
    obj.enablePosition=true;
    obj.element.clearQueue();
    obj.element.addClass('animIdle');
  },1000);
};

GUIOBJ.prototype.expand = function () {
  this.enablePosition=false;
  $('html').css('cursor','default');
  this.out();
  var screenWidth = $('.hud').outerWidth();
  var screenHeight = $('.hud').outerHeight();
  var offset = this.element.position();

  this.element.css({transform:'translate(-50%,-50%)',display:'block',backgroundColor:'rgba(53, 102, 155, 0.85)'});
  this.element.animate({top:screenHeight/2,left:screenWidth/2,height:screenHeight,width:screenWidth,backgroundColor:'rgba(53, 102, 155, 0.85)'},"slow")
  this.element.removeClass('animIdle');
  this.description.css('opacity','0');
  this.onClick();
};

GUIOBJ.prototype.out = function () {
  if(this.enablePosition){
    if(this.hoverIten){
      $('html').css('cursor','default');
      this.element.fadeTo(300,0);
      this.description.css('opacity','0');
    }
    //console.log('out');
    this.hoverIten=false;
  }
};
