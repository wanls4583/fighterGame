var Background = (function(_super){
    function Background(){
        Background.super(this);
        this.bg1 = new Laya.Sprite();
        this.bg1.loadImage('background.png',0,0);
        this.addChild(this.bg1);
        this.bg2 = new Laya.Sprite();
        this.bg2.loadImage('background.png',0,0);
        this.bg2.pos(0,-852)
        this.addChild(this.bg2);
        Laya.timer.frameOnce(1,this,this.onLoad);
    }
    Laya.class(Background,'Background',_super);
    Background.prototype.onLoad = function(){
        this.y++;
        if(this.bg1.y + this.y > 852){
            this.bg1.y -=2*852;
        }
        if(this.bg2.y + this.y > 852){
            this.bg2.y -=2*852;
        }
        Laya.timer.frameOnce(1,this,this.onLoad);
    }
    return Background;
})(Laya.Sprite)