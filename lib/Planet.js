function Planet(vertices,textureUrl,rotationSpeed,tilt,size) {
  this.size=size;
  this.vertices=vertices;
  this.textureUrl=textureUrl;
  this.rotation=rotationSpeed;
  this.tilt=tilt;
  this.obj3D;
}

Planet.prototype.initi = function (material) {
  var geometry;
  if(this.size!=undefined){
    geometry = new THREE.SphereGeometry(this.size,this.vertices,this.vertices);
  }
  else {
    geometry = new THREE.SphereGeometry(1,1,1);
  }
  if(material==undefined){
    var texture = new THREE.TextureLoader().load(this.textureUrl);
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
    texture.anisotropy = 16;
    var material = new THREE.MeshPhongMaterial({map:texture});
  }
  this.obj3D = new THREE.Mesh(geometry,material);

  this.obj3D.rotation.z = this.tilt;

  SCENE.instance.add(this);
};

Planet.prototype.update = function () {
  this.obj3D.rotation.y+=this.rotation;
};
