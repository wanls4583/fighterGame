/**
 * TODO: 角色类（hero，敌机，子弹）
 * date: 2017-6-6
 */
var Role = (function(_super){
    'use strict';
    function Role(roleType,enemyType){
        Role.super(this);
        //初始化动画模板
        if(!Role.hasInitOnce){
            Role.hasInitOnce = true;
            this.createFrames();
        }
        this.init(roleType,enemyType);
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
    //创建动画模板
    Role.prototype.createFrames = function(){
        Laya.Animation.createFrames(['war/hero_fly1.png','war/hero_fly2.png'],Util.HERO_FLY);
        Laya.Animation.createFrames(['war/enemy1_fly1.png'],Util.getFlyActionByEnemyType(1));
        Laya.Animation.createFrames(['war/enemy2_fly1.png'],Util.getFlyActionByEnemyType(2));
        Laya.Animation.createFrames(['war/enemy3_fly1.png','war/enemy3_fly2.png'],Util.getFlyActionByEnemyType(3));
        Laya.Animation.createFrames(['war/hero_down1.png','war/hero_down2.png','war/hero_down3.png','war/hero_down4.png'],Util.HERO_DOWN);
        Laya.Animation.createFrames(['war/enemy1_down1.png','war/enemy1_down2.png','war/enemy1_down3.png','war/enemy1_down4.png'],Util.getDownActionByEnemyType(1));
        Laya.Animation.createFrames(['war/enemy2_down1.png','war/enemy2_down2.png','war/enemy2_down3.png','war/enemy2_down4.png'],Util.getDownActionByEnemyType(2));
        Laya.Animation.createFrames(['war/enemy3_down1.png','war/enemy3_down2.png','war/enemy3_down3.png','war/enemy3_down4.png','war/enemy3_down5.png','war/enemy3_down6.png'],Util.getDownActionByEnemyType(3));
        Laya.Animation.createFrames(['war/bullet1.png'],Util.BULLET_1);
        Laya.Animation.createFrames(['war/enemy2_hit.png'],Util.getHitActionByEnemyType(2));
        Laya.Animation.createFrames(['war/enemy3_hit.png'],Util.getHitActionByEnemyType(3));
    }
    //播放动画
    Role.prototype.play = function(action){
        if(!this.ani){
            this.ani = new Laya.Animation();
            this.addChild(this.ani);
        }
        this.ani.clear();
        this.ani.offAll();
        if(Util.isDownAction(action)){
            this.ani.play(0,false,action);
            //爆炸后销毁对象
            this.ani.on(Laya.Event.COMPLETE,this,function(){
                this.destroy();
                this.ani.clear();
            })
        }else if(Util.isHitAction(action)){
            this.ani.play(0,false,action);	
            //被击中后播放爆炸动画
            this.ani.on(Laya.Event.COMPLETE,this,function(){
                if(this.hp<=0){
                    this.play(Util.getDownActionByEnemyType(this.enemyType));
                }else{
                    this.play(Util.getFlyActionByEnemyType(this.enemyType));
                }
            })
        }else{
            this.ani.play(0,false,action);
            this.ani.on(Laya.Event.COMPLETE,this,function(){
                //消失在画面时，销毁对象
                if(this.hp<=0)
                    this.ani.destroy();
                else
                    this.ani.play(0,false,action);
            })
        }
        //获得实际像素区域
        var bounds = this.ani.getGraphicBounds();		
        this.ani.pos(-bounds.width / 2, -bounds.height / 2);
    }
    /**
     * roleType:1.hero,2.敌机,3.子弹
     */
    Role.prototype.init = function(roleType,enemyType){
        this.roleType = roleType;
        var bounds = null
        if(roleType == 1){//如果是hero
            Role.hero = this;
            this.hp = 1;
            this.play(Util.HERO_FLY);
            bounds = this.ani.getGraphicBounds();
            this.pos(Laya.stage.width/2,Laya.stage.height-bounds.height*2/3);
            //hero移动事件
            Laya.stage.on(Laya.Event.CLICK,this,Laya.stage.clickListener = function(event){
                if(this.hp<=0){
                    Laya.stage.off(Laya.Event.CLICK,this,Laya.stage.clickListener);
                    this.roleVisible = false;
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
                var dt2 = 1000*(Math.abs(this.y-y))/Laya.stage.height*(Laya.stage.height/Laya.stage.width);
                var dt = dt1>dt2?dt1:dt2;
                //使用Tween移动hero
                Laya.Tween.to(this,{x: x,y: y}, dt);
            })
        }else if(roleType==2){//如果是敌方机
            this.enemyType = enemyType;
            //不同的敌机有不同血量
            if(this.enemyType == 1){
                this.hp = 1;
            }else if(this.enemyType == 2){
                this.hp = 2;
            }else if(this.enemyType == 3){
                this.hp = 4;
            }
            //播放敌机飞行动画
            this.play(Util.getFlyActionByEnemyType(this.enemyType));
            bounds = this.ani.getGraphicBounds();
            this.x = Math.random()*(Laya.stage.width-bounds.width)+bounds.width/2;
            this.y = -bounds.height/2;
            //敌机移动
            Laya.timer.frameLoop(1,this,this.roleMoveListener = function(){
                this.y += Role.speed[this.enemyType-1];
                if(this.y > Laya.stage.height + bounds.height/2){
                    this.destroy();
                    this.roleVisible = false;
                    Laya.timer.clear(this,this.roleMoveListener);
                }
            });
        }else if(roleType==3){//如果是子弹
            this.hp = 1;
            //播放子弹动画
            this.play(Util.BULLET_1);
            bounds = this.ani.getGraphicBounds();
            this.x = Role.hero.x;
            this.y = Role.hero.y-Role.hero.ani.getGraphicBounds().height/2-bounds.height/2;
            //子弹移动
            Laya.timer.frameLoop(1,this,this.roleMoveListener = function(){
                this.y -= Role.bulletSpeed;
                if(this.y < - bounds.height/2){
                    this.destroy();
                    this.roleVisible = false;
                    Laya.timer.clear(this,this.roleMoveListener);
                }
            });
        }
        this.xHitRadius = bounds.width/2;
        this.yHitRadius = bounds.height/2;
        this.roleVisible = true;
    }
    return Role;
})(Laya.Sprite)