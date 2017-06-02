var Background = (function(_supper){
    function Background(){
        Background.super(this);
        this.bg1 = new Laya.Sprite();
        this.bg1.loadImage('ui/img_bg_level_1.jpg');
        this.addChild(this.bg1);
        this.bg2 = new Laya.Sprite();
        this.bg2.loadImage('ui/img_bg_level_1.jpg');
        this.bg2.pos(0,-768);
        this.addChild(this.bg2);
        Laya.timer.frameLoop(1,this,this.onLoop);
    }
    Laya.class(Background,'Background',_supper);
    Background.prototype.onLoop = function(){
        this.y += 1;
        if(this.bg1.y + this.y > 768){
            this.bg1.y -= 768*2;
        }
        if(this.bg2.y + this.y > 768){
            this.bg2.y -= 768*2;
        }
    }
    return Background;
})(Laya.Sprite)