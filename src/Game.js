(function(){
    var AniConfPath = 'res/atlas/war.json';
    Laya.init(480,852);
    Laya.stage.scaleMode = Laya.Stage.SCALE_NOBORDER;
    var bg = new Background();
    Laya.stage.addChild(bg);
    Laya.loader.load(AniConfPath, Laya.Handler.create(this,onload), null, Laya.Loader.ATLAS);
    function onload(){
        var hero = new Role();
        hero.init(1);
        Laya.stage.addChild(hero);
        Laya.timer.frameLoop(1,hero,checkHit);
        createEnemy();
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
            var enemy = new Role();
            var rnd = Math.ceil(Math.random()*100);
            if(rnd < 70){
                enemy.init(2,1);
            }else if(rnd < 98){
                enemy.init(2,2);
            }else{
                enemy.init(2,3);
            }
            Laya.stage.addChild(enemy);
        });
    }
    //发射子弹
    function shoot(){
        Laya.timer.frameLoop(30,this,function(){
            var bullet = new Role();
            bullet.init(3);
            Laya.stage.addChild(bullet);
            Laya.timer.frameLoop(1,bullet,checkHit);
            //hero死亡时不再发射子弹
            if(Role.hero.hp < 1){
                Laya.timer.clear(this,arguments.callee);
            }
        })
    }
    //碰撞检测
    function checkHit(){
        var numChildren = Laya.stage.numChildren;
        for(var i = 0; i<numChildren; i++){
            var obj = Laya.stage.getChildAt(i);
            if(!obj || !obj.roleType || obj.hp <=0)
                continue;
            //子弹或者hero血量为0时，不再检测碰撞
            if(this.hp<=0 || (this.roleType == 3 && !this.visible)){
                Laya.timer.clear(this,arguments.callee);
                break;
            }
            if(this.roleType == 1 && obj.roleType != 3 && obj.roleType != 1){//检测hero碰撞
                var hitRadius = this.hitRadius + obj.hitRadius
                if(hitRadius > Math.abs(this.x-obj.x) && hitRadius > Math.abs(this.y-obj.y)){
                    this.hp--;
                    obj.hp--;
                    if(this.hp<=0)
                        this.play('hero_down');
                    if(obj.hp<=0)
                        obj.play('enemy'+obj.enemyType+'_down');
                }
            }else if(this.roleType == 3 && obj.roleType != 3 && obj.roleType != 1){//检测子弹碰撞
                var hitRadius = this.hitRadius + obj.hitRadius
                if(hitRadius > Math.abs(this.x-obj.x) && hitRadius > Math.abs(this.y-obj.y)){
                    this.hp--;
                    if(this.hp<=0)
                        this.removeSelf();
                    obj.hp--;
                    if(obj.hp<=0)
                        obj.play('enemy'+obj.enemyType+'_down');
                }
            }
        }
    }
})()


