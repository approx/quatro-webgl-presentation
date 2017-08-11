function WEBOBJ(obj3D,update,start) {
  this.obj3D=obj3D;
  this.update=(update==undefined)?function(){}:update;
  this.start=(start==undefined)?function(){}:start;
}
