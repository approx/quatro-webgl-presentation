function SCENE() {
  SCENE.instance=this;
  this.renderer;
  this.camera;
  this.spriteCamera;
  this.spriteScene;
  this.scene;
  this.ambientlight;
  this.objects=[];
  this.controls;
  this.components={};
}

SCENE.prototype.add = function (obj) {
  if(obj instanceof WEBOBJ){
    this.scene.add(obj.obj3D);
    this.objects.push(obj);
  }

  if(obj instanceof THREE.Group){
    for (var i = 0; i < obj.children.length; i++) {
      if(obj.children[i] instanceof THREE.Mesh){
        this.scene.add(obj.obj3D);
        this.objects.push(obj);
      }
    }
  }
};

SCENE.prototype.createOrthoSprite = function (textureUrl) {
  /*if(this.spriteCamera == undefined){
    console.log('created camera');
    var container = $('#container');
    this.spriteCamera = new THREE.OrthographicCamera( - container.outerWidth() / 2, container.outerWidth() / 2, container.outerHeight() / 2, - container.outerHeight() / 2, 1, 10 );
    console.log(this.spriteScene);
		this.spriteCamera.position.z = 10;

    this.spriteScene = new THREE.Scene();
    this.spriteScene.add(this.spriteCamera);
  }*/

  var texture, textureLoader, material;
  if(textureUrl!=undefined){
    textureLoader = new THREE.TextureLoader();
    texture = textureLoader.load( textureUrl );
    material = new THREE.SpriteMaterial({map:texture});

    /*var width = material.map.image.width;
		var height = material.map.image.height;*/

    var sprite = new THREE.Sprite(material);
    //sprite.scale.set(width,height,1);
    this.scene.add(sprite);
    return sprite
  }

};

SCENE.prototype.vectorToScreen = function (vector) {
  if(vector instanceof THREE.Vector3){
    vector.project(this.camera);

    vector.x = Math.round((vector.x + 1) * this.renderer.domElement.width /2);
    vector.y = Math.round(( -vector.y + 1) * this.renderer.domElement.height /2);
    vector.z = 0;

    return vector;
  }
  else {
    console.warn('vector is not a instance of THREE.Vector3');
  }
};

SCENE.rayIntersects = function (rayCaster,group) {
  var intersects;
  if(group==undefined){
    intersects = rayCaster.intersectObjects(SCENE.instance.scene.children);
  }
  else {
    intersects = rayCaster.intersectObjects(group);
  }
  return intersects;
}

SCENE.prototype.fireRayCasters = function() {
  if(this.components.raycasters!=undefined){
    if(this.components.raycasters.length>0){
      for (var i = 0; i < this.components.raycasters.length; i++) {
        this.components.raycasters[i].raycaster.setFromCamera(this.components.raycasters[i].from,this.camera);
      }
    }
  }
}

SCENE.prototype.rayCaster = function  (from) {
  if(from instanceof THREE.Vector2){
    if(this.components.raycasters==undefined){
      this.components.raycasters =[];
    }
    var raycaster = new THREE.Raycaster();
    var customray = {
      'raycaster':raycaster,
      'from':from
    }
    this.components.raycasters.push(customray);
    return raycaster;

  }
  else {
    console.warn('raycaster could not be create: from parameter is not a Vector2');
  }
}

SCENE.prototype.dirLight = function () {
  light = new THREE.DirectionalLight(0xffffff,1.5);
  light.position.set(-1,0,1);
  this.scene.add(light);
  return light;
};

SCENE.prototype.getCenterPoint =function(mesh) {
    var middle = new THREE.Vector3();
    var geometry = mesh.geometry;

    geometry.computeBoundingBox();

    middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
    middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

    mesh.localToWorld( middle );
    return middle;
}

SCENE.prototype.loadObj = function (objUrl,imgUrl,group) {
  var manager = new THREE.LoadingManager();
  manager.onProgress = function(item,loaded,total){
    console.log(item,loaded,total);
  }

  var texture;

  var loader = new THREE.JSONLoader(manager,webojb);
  var webojb=null;

  return new Promise(function(resolve, reject) {
    var onProgress = function(xhr){
      if(xhr.lengthComputable ){
        var percentComplete = xhr.loaded/xhr.total * 100;
        console.log(Math.round(percentComplete, 2)+'% loaded');
      }
    }

    var onError = function(xhr) {
      reject('algum error aconteceu');
    }
    webojb = loader.load(objUrl,function (geometry,materials) {
      var material;

      if(imgUrl!=undefined){
        var texture = new THREE.TextureLoader().load(imgUrl);
        texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
        texture.anisotropy = 16;
        material = new THREE.MeshBasicMaterial({map:texture});
      }
      else {
        material = new THREE.MeshBasicMaterial();
      }

      var mesh = new THREE.Mesh(geometry,material);
      obj = new WEBOBJ(mesh);
      if(group instanceof THREE.Group){
        group.add(mesh);
        SCENE.instance.objects.push(obj)
      }
      else {
        SCENE.instance.add(obj);
      }
      resolve(obj);
    },onProgress,onError);
  });
};

SCENE.prototype.render = function () {
  this.renderer.render(this.scene,this.camera);
}

SCENE.prototype.addOrbitControls = function () {
  this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
  //this.controls.autoRotate = true;
  //this.controls.addEventListener( 'change', this.run() );
  this.controls.enableDamping = true;
	this.controls.dampingFactor = 0.25
  return this.controls;
};

SCENE.prototype.lookAt = function (obj) {
  this.camera.lookAt(obj.position);
};


SCENE.prototype.initi = function () {
  var container = $('#container');
  this.renderer = new THREE.WebGLRenderer({antialias:true});
  this.renderer.setSize(container.outerWidth(),container.outerHeight());
  container[0].appendChild(this.renderer.domElement);

  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color( '#959595' );

  this.camera = new THREE.PerspectiveCamera(45,container[0].offsetWidth/container[0].offsetHeight,1,4000);
  this.camera.position.set(0,3,9);
  //this.camera.quaternion.setFromEuler(new THREE.Euler(-0.5,0.7,0.3));
  this.scene.add(this.camera);



  this.ambientlight = new THREE.AmbientLight(0x404040);
  this.scene.add(this.ambientlight);

  this.renderer.autoClear = false;
  this.run()
  if(this.objects!=undefined && this.objects instanceof Array){
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].start();
    }
  }
};

SCENE.prototype.run = function(){
  this.fireRayCasters();
  if(this.objects!=undefined && this.objects instanceof Array){
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].update();
    }
  }
  this.renderer.clear();
  this.renderer.render(this.scene,this.camera);
  if(this.spriteScene!=undefined&&this.spriteCamera!=undefined){
    //this.renderer.clearDepth();
    //this.renderer.render(this.spriteScene,this.spriteCamera);
  }
  requestAnimationFrame(function() {
    if(SCENE.instance.controls instanceof THREE.OrbitControls){
      SCENE.instance.controls.update();
    }
    SCENE.instance.run();
  });
}
