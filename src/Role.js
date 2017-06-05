var Role = (function(_super){
    //'use strict';
    function Role(){
        Role.super(this);
        if(!Role.hasInitOnce){
            Role.hasInitOnce = true;
            Laya.Animation.createFrames(['war/hero_fly1.png','war/hero_fly2.png'],'hero_fly');
            Laya.Animation.createFrames(['war/enemy1_fly1.png'],'enemy1_fly');
            Laya.Animation.createFrames(['war/enemy2_fly1.png'],'enemy2_fly');
            Laya.Animation.createFrames(['war/enemy3_fly1.png','war/enemy3_fly2.png'],'enemy3_fly');
            Laya.Animation.createFrames(['war/hero_down1.png','war/hero_down2.png','war/hero_down3.png','war/hero_down4.png'],'hero_down');
            Laya.Animation.createFrames(['war/enemy1_down1.png','war/enemy1_down2.png','war/enemy1_down3.png','war/enemy1_down4.png'],'enemy1_down');
            Laya.Animation.createFrames(['war/enemy2_down1.png','war/enemy2_down2.png','war/enemy2_down3.png','war/enemy2_down4.png'],'enemy2_down');
            Laya.Animation.createFrames(['war/enemy3_down1.png','war/enemy3_down2.png','war/enemy3_down3.png','war/enemy3_down4.png'],'enemy3_down');
            Laya.Animation.createFrames(['war/bullet1.png'],'bullet1');
        }
    }
    Laya.class(Role,'Role',_super);
    //难度等级
    Role.level = 1;
    //敌机速度
    Role.speed = [4,2,1];
    //子弹速度
    Role.bulletSpeed = 10;
    //hero
    Role.hero = null;
    //播放动画
    Role.prototype.play = function(action){
        if(!this.ani){
            this.ani = new Laya.Animation();
            this.addChild(this.ani);
        }
        if(action.indexOf('_down')!=-1){
            this.ani.on(Laya.Event.COMPLETE,this,function(){
                this.removeSelf();
            })
        }
        this.ani.clear();
        this.ani.play(0,true,action);
        var bounds = this.ani.getGraphicBounds();		
        this.ani.pos(-bounds.width / 2, -bounds.height / 2);
    }
    /**
     * roleType:1.hero,2.敌机,3.子弹
     */
    Role.prototype.init = function(roleType,enemyType){
        this.roleType = roleType;
        if(roleType == 1){//如果是hero
            Role.hero = this;
            this.hp = 1;
            this.play('hero_fly');
            var bounds = this.ani.getGraphicBounds();
            this.pos(Laya.stage.width/2,Laya.stage.height-bounds.height*2/3);
            //hero移动事件
            Laya.stage.on(Laya.Event.CLICK,this,function(event){
                if(this.hp<=0){
                    Laya.stage.off(Laya.Event.CLICK,this,arguments.callee);
                    this.visble = false;
                    return;
                }
                var x = Laya.stage.mouseX;
                var y = Laya.stage.mouseY;
                var minX = bounds.width/2;
                var maxX = Laya.stage.width - bounds.width/2;
                var minY = bounds.height/2;
                var maxY = Laya.stage.height - bounds.height/2;
                x = x<minX?minX:x;
                x = x>maxX?maxX:x;
                y = y<minY?minY:y;
                y = y>maxY?maxY:y;
                var dt1 = 1000*(Math.abs(this.x-x))/Laya.stage.width;
                var dt2 = 2000*(Math.abs(this.y-y))/Laya.stage.height;
                var dt = dt1>dt2?dt1:dt2;
                Laya.Tween.to(this,
                {
                    x: x,
                    y: y
                }, dt);
            })
        }else if(roleType==2){//如果是敌方机
            this.enemyType = enemyType;
            if(this.enemyType == 1){
                this.hp = 1;
            }else if(this.enemyType == 2){
                this.hp = 2;
            }else if(this.enemyType == 3){
                this.hp = 4;
            }
            this.play('enemy'+this.enemyType+'_fly');
            var bounds = this.ani.getGraphicBounds();
            this.x = Math.random()*(Laya.stage.width-bounds.width)+bounds.width/2;
            this.y = -bounds.height/2;
            Laya.timer.frameLoop(1,this,function(){
                this.y += Role.speed[this.enemyType-1];
                if(this.y > Laya.stage.height + bounds.height/2){
                    this.removeSelf();
                    this.visble = false;
                    Laya.timer.clear(this,arguments.callee);
                }
            });
        }else if(roleType==3){//如果是子弹
            this.hp = 1;
            this.play('bullet1');
            var bounds = this.ani.getGraphicBounds();
            this.x = Role.hero.x;
            this.y = Role.hero.y-Role.hero.ani.getGraphicBounds().height/2-bounds.height/2;
            Laya.timer.frameLoop(1,this,function(){
                this.y -= Role.bulletSpeed;
                if(this.y < - bounds.height/2){
                    this.removeSelf();
                    this.visble = false;
                    Laya.timer.clear(this,arguments.callee);
                }
            });
        }
        this.hitRadius = bounds.width/2;
        this.visble = true;
    }
    return Role;
})(Laya.Sprite)