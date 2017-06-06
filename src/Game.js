/**
 * TODO: 游戏逻辑主类
 * date: 2017-6-6
 */
(function(){
    'use strict';
    var AniConfPath = 'res/atlas/war.json';
    Laya.init(480,852);
    Laya.stage.scaleMode = Laya.Stage.SCALE_NOBORDER;
    //创建背景
    var bg = new Background();
    Laya.stage.addChild(bg);
    //加载图集资源
    Laya.loader.load(AniConfPath, Laya.Handler.create(this,onload), null, Laya.Loader.ATLAS);
    function onload(){
        var hero = new Role(1);
        Laya.stage.addChild(hero);
        //碰撞检测
        Laya.timer.frameLoop(1,hero,hero.hitListener = checkHit);
        //创建敌机
        createEnemy();
        //发射子弹
        shoot();
    }
    //随机出现敌机
    function createEnemy(){
        //敌机出现频率,帧频
        var rate = 260;
        if(Role.level == 1){
            rate *= 2
        }else if(Role.level == 2){
            rate *= 3/2
        }
        Laya.timer.frameLoop(60,this,function(){
            var enemy = null;
            var rnd = Math.ceil(Math.random()*100);
            if(rnd < 70){
                enemy = new Role(2,1);
            }else if(rnd < 98){
                enemy = new Role(2,2);
            }else{
                enemy = new Role(2,3);
            }
            Laya.stage.addChild(enemy);
        });
    }
    //发射子弹
    function shoot(){
        Laya.timer.frameLoop(50,this,Laya.stage.shootListener = function(){
            var bullet = new Role(3);
            //添加子弹到舞台
            Laya.stage.addChild(bullet);
            //子弹碰撞检测
            Laya.timer.frameLoop(1,bullet,bullet.hitListener = checkHit);
            //hero死亡时不再发射子弹
            if(Role.hero.hp < 1){
                Laya.timer.clear(this,Laya.stage.shootListener);
            }
        })
    }
    //碰撞检测
    function checkHit(){
        var numChildren = Laya.stage.numChildren;
        for(var i = 0; i<numChildren; i++){
            var obj = Laya.stage.getChildAt(i);
            //子弹或者hero血量为0时，不再检测碰撞
            if(!this || (this.hp<=0 && this.roleType==3)){
                Laya.timer.clear(this,this.hitListener);
                break;
            }
            if(!obj || !obj.roleType || obj.hp <=0)
                continue;
            var xHitRadius = this.xHitRadius + obj.xHitRadius;
            var yHitRadius = this.yHitRadius + obj.yHitRadius;
            if(this.roleType == 1 && obj.roleType != 3 && obj.roleType != 1){//检测hero碰撞
                if(xHitRadius > Math.abs(this.x-obj.x) && yHitRadius > Math.abs(this.y-obj.y)){
                    //hero血量减1
                    this.hp--;
                    //敌机血量减1
                    obj.hp--;
                    //血量为0时播放hero爆炸动画
                    if(this.hp<=0)
                        this.play(Util.HERO_DOWN);
                    //根据血量播放敌机碰撞动画
                    if(obj.hp<=0 && obj.enemyType==1){
                        obj.play(Util.getDownActionByEnemyType(obj.enemyType));
                    }else if(obj.enemyType>1){
                        obj.play(Util.getHitActionByEnemyType(obj.enemyType));
                    }
                        
                }
            }else if(this.roleType == 3 && obj.roleType != 3 && obj.roleType != 1){//检测子弹碰撞
                if(xHitRadius > Math.abs(this.x-obj.x) && yHitRadius > Math.abs(this.y-obj.y)){
                    //子弹血量减1
                    this.hp--;
                    //子弹血量为0时销毁子弹对象
                    if(this.hp<=0)
                        this.destroy();
                    //敌机血量减1
                    obj.hp--;
                    //根据血量播放敌机碰撞动画
                    if(obj.hp<=0 && obj.enemyType==1){
                        obj.play(Util.getDownActionByEnemyType(obj.enemyType));
                    }else if(obj.enemyType>1){
                        obj.play(Util.getHitActionByEnemyType(obj.enemyType));
                    }
                }
            }
        }
    }
})()


