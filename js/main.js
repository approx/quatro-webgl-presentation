$(document).ready(function() {
  new SCENE();
  SCENE.instance.initi();
  var multiplier = 0.001;
  var middleX = SCENE.instance.renderer.domElement.offsetWidth/2;
  var middleY = SCENE.instance.renderer.domElement.offsetHeight/2;
  var originalPosX = SCENE.instance.camera.position.x;
  var originalPosY = SCENE.instance.camera.position.y;
  var originalPosZ = SCENE.instance.camera.position.z;
  var mouse = new THREE.Vector2();
  var cliked = false;
  var hoverIten=false;

  function calculateMousePosition(event) {
    SCENE.instance.camera.position.set(((event.clientX-middleX)*multiplier)+originalPosX,((event.clientY-middleY)*multiplier)+originalPosY,originalPosZ);
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  function onclick(event) {
    if(hoverIten){
      cliked=true;
      console.log('clicou');
    }

  }

  SCENE.instance.dirLight();

  var group = new THREE.Group();
  console.log(group);
  var controls = SCENE.instance.addOrbitControls();
  controls.minPolarAngle= 0.785398;
  controls.maxPolarAngle= 1.13446;
  controls.minAzimuthAngle= -1.5708;
  controls.maxAzimuthAngle= 1.5708;
  controls.enableKeys=false;
  controls.enablePan=false;
  controls.enableRotate=false;
  $('.hud')[0].addEventListener('mousemove',calculateMousePosition);
  $('.hud')[0].addEventListener('click',onclick);

  SCENE.instance.loadObj('./obj/models/plane.json','./obj/textures/uvMapfloor-2048.png',group).then(function (obj) {
    //SCENE.instance.lookAt(obj.obj3D);
    obj.obj3D.name='planeObj';
    //obj.obj3D.rotateY(-0.7);
  }).catch(function (error) {
    console.log(error);
  });

  SCENE.instance.loadObj('./obj/models/buildsMargin.json','./obj/textures/uvMap2-2048margin.png',group).then(function (obj) {
    //SCENE.instance.lookAt(obj.obj3D);
    obj.obj3D.name='builds';
    //obj.obj3D.rotateY(-0.7);
  }).catch(function (error) {
    console.log(error);
  });

  /*$('.hud').append('<div></div>');*/
  var circle = $('.selected');
  var top = $('.top');
  var hud = $('.hud');

  var contentFadeout = function () {

  }

  //var sprite = SCENE.instance.createOrthoSprite('./obj/textures/circle.png');
  SCENE.instance.loadObj('./obj/models/aboutMargin.json','./obj/textures/uvMap2-2048margin.png',group).then(function (obj) {
    obj.obj3D.name='about';
    //obj.obj3D.rotateY(-0.7);
    var raycaster = SCENE.instance.rayCaster(mouse);
    var height = 10;


    var aboutGUI = new GUIOBJ(obj,circle,$('#aboutDesc'),400,function () {
      cliked=true;
      var logo = $('.logo');
      var logoWidth = logo.outerHeight();
      var logoPosition = logo.position();
      $('.logo').css({top:(logoWidth+logoPosition.top)*-1});
      $('.menu').css({bottom:-100});
      $('.top, .right, .left, .down').css({maxHeight:'80px',maxWidth:'80px'});
      $('.down').css({opacity:'0'});
      $('.content .title').css({marginLeft:'-300px',transition:'all 1s'});
      $('.content .description').css({marginLeft:'300px',transition:'all 1s'});
      setTimeout(function () {
        $('.content').css({opacity:'1',zIndex:'21'});
        $('.content .title').css({marginLeft:'0px'});
        $('.content .description').css({marginLeft:'0px'});
        $('.exit').click(function () {
          $('.menu').css({bottom:0});
          $('.logo').css({top:''});
          $('.content .title, .content .description').css({transition:'none'});
          $('.top, .right, .left, .down').css({maxHeight:'50px',maxWidth:'50px'});
          $('.top, .right, .left, .down').css({opacity:'1'});
          $('.content').css({opacity:'0',zIndex:'0'});
          setTimeout(function functionName() {
            $('.navBar #M').css({opacity:'0',marginLeft:''});
            $('.content .title, .content .description').css({opacity:'1'});
          },1000);
          setTimeout(function functionName() {
            $('.navBar #Vi').css({opacity:'0',marginLeft:''});
          },800);
          setTimeout(function functionName() {
            $('.navBar #Va').css({opacity:'0',marginLeft:''});
          },600);
          aboutGUI.exit();
        });
      },1000);
    });


    $('.navBar #M').hover(function () {
      var Swidht = $('.selected').outerWidth();
      var Sposition = $('.selected').position();

      var Sheight = $('.selected').outerHeight();
      var navMenuPosi = $('.navBar #M').offset();
      var calculatedDist = navMenuPosi.top+25;
      $('.MVVContent').css({height:Sheight-calculatedDist,paddingTop:calculatedDist+'px'});

      $('.MVVContent').css({left:Sposition.left+Swidht,opacity:1,transition:'all 1s'});
      $('.MVVContent #MContent').css({display:'block',opacity:0});
      setTimeout(function () {
        $('.MVVContent #MContent').css({opacity:1});
      },800);
      var docWidth = $('#container').outerWidth();
      $('.MVVContent').outerWidth((docWidth-(Sposition.left+Swidht))/2);
    },function () {
      var Swidht = $('.selected').outerWidth();
      var Sposition = $('.selected').position();
      $('.MVVContent #MContent').css({opacity:0,display:'none'});
      $('.MVVContent').css({left:Sposition.left+Swidht/2,opacity:0,transition:'none'});
      $('.MVVContent').outerWidth(Swidht);
    });


    $('.navBar #Va').hover(function () {
      var Swidht = $('.selected').outerWidth();
      var Sposition = $('.selected').position();

      var Sheight = $('.selected').outerHeight();
      var navMenuPosi = $('.navBar #Va').offset();
      var calculatedDist = navMenuPosi.top+25;
      $('.MVVContent').css({height:Sheight-calculatedDist,paddingTop:calculatedDist+'px'});

      $('.MVVContent').css({left:Sposition.left+Swidht,opacity:1,transition:'all 1s'});
      $('.MVVContent #VaContent').css({display:'block',opacity:0});
      setTimeout(function () {
        $('.MVVContent #VaContent').css({opacity:1});
      },800)
      var docWidth = $('#container').outerWidth();
      $('.MVVContent').outerWidth((docWidth-(Sposition.left+Swidht))/2);
    },function () {
      var Swidht = $('.selected').outerWidth();
      var Sposition = $('.selected').offset();
      $('.MVVContent #VaContent').css({opacity:0,display:'none'});
      $('.MVVContent').css({left:Sposition.left+Swidht/2,opacity:0,transition:'none'});
      $('.MVVContent').outerWidth(Swidht);
    });


    $('.navBar #Vi').hover(function () {
      var Swidht = $('.selected').outerWidth();
      var Sposition = $('.selected').position();

      var Sheight = $('.selected').outerHeight();
      var navMenuPosi = $('.navBar #Vi').offset();
      var calculatedDist = navMenuPosi.top+25;
      $('.MVVContent').css({height:Sheight-calculatedDist,paddingTop:calculatedDist+'px'});

      $('.MVVContent').css({left:Sposition.left+Swidht,opacity:1,transition:'all 1s'});
      $('.MVVContent #ViContent').css({display:'block',opacity:0});
      setTimeout(function () {
        $('.MVVContent #ViContent').css({opacity:1});
      },800)
      var docWidth = $('#container').outerWidth();
      $('.MVVContent').outerWidth((docWidth-(Sposition.left+Swidht))/2);
    },function () {
      var Swidht = $('.selected').outerWidth();
      var Sposition = $('.selected').position();
      $('.MVVContent #ViContent').css({opacity:0,display:'none'});
      $('.MVVContent').css({left:Sposition.left+Swidht/2,opacity:0,transition:'none'});
      $('.MVVContent').outerWidth(Swidht);
    });


    $('#estrategiEmp').click(function () {
      setTimeout(function () {
        $('.MVVContent div').css({display:'none'});
        var Sposition = $('.selected').position();
        var Swidht = $('.selected').outerWidth();
        var Sheight = $('.selected').outerHeight();
        $('.MVVContent').css({left:Sposition.left+Swidht/2});
        $('.MVVContent').outerWidth(Swidht);
        console.log($('#MVVContent'));
      },1000)


      var position = $('#estrategiEmp').position();
      var width = $('#estrategiEmp').outerWidth();
      var navPosition = $('.navBar').position();
      aboutGUI.element.animate({left:(position.left+navPosition.left)+width/2,width:'300px'},'slow');
      console.log(position.left);

      $('.content .title, .content .description').css({opacity:'0'});
      $('.top, .right, .left, .down').css({opacity:'0'});
      setTimeout(function functionName() {
        $('.navBar #M').css({opacity:'1',marginLeft:'0px'});
      },1000);
      setTimeout(function functionName() {
        $('.navBar #Vi').css({opacity:'1',marginLeft:'0px'});
      },800);
      setTimeout(function functionName() {
        $('.navBar #Va').css({opacity:'1',marginLeft:'0px'});
      },600);
    });


    var hoverMenu=false;
    $('.about').hover(function () {
      hoverMenu=true;
      aboutGUI.hover();
    },function () {
      hoverMenu=false;
    });
    $('.about').click(function () {
      aboutGUI.expand();
    })


    obj.update = function() {
      aboutGUI.CalculatePosition();
      var intersects = SCENE.rayIntersects(raycaster,group.children);
      if(!hoverMenu){
        intersects.length>0 ? (intersects[0].object.name=='about'? aboutGUI.hover():aboutGUI.out()):aboutGUI.out();
      }
    }
  }).catch(function (error) {

  });
  SCENE.instance.scene.add(group);
  group.rotateY(-0.7);

});
