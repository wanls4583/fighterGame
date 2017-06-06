/**
 * TODO：工具类
 * date: 2017-6-6
 */
(function(Util){
    'use strict';
    Util.HERO_FLY = 'hero_fly';
    Util.HERO_DOWN = 'hero_down';
    Util.BULLET_1 = 'bullet1';
    Util.getDownActionByEnemyType = function(enemyType){
        var down = null;
        switch(enemyType){
            case 1: down = 'enemy1_down';break;
            case 2: down = 'enemy2_down';break;
            case 3: down = 'enemy3_down';break;
        }
        return down;
    }
    Util.getFlyActionByEnemyType = function(enemyType){
        var fly = null;
        switch(enemyType){
            case 1: fly = 'enemy1_fly';break;
            case 2: fly = 'enemy2_fly';break;
            case 3: fly = 'enemy3_fly';break;
        }
        return fly;
    }
    Util.getHitActionByEnemyType = function(enemyType){
        var hit = null;
        switch(enemyType){
            case 1: hit = 'enemy1_hit';break;
            case 2: hit = 'enemy2_hit';break;
            case 3: hit = 'enemy3_hit';break;
        }
        return hit;
    }
    Util.isDownAction = function(action){
        if(action.indexOf('_down')!=-1){
            return true;
        }
        return false;
    }
    Util.isFlyAction = function(action){
        if(action.indexOf('_fly')!=-1){
            return true;
        }
        return false;
    }
    Util.isHitAction = function(action){
        if(action.indexOf('_hit')!=-1){
            return true;
        }
        return false;
    }
})(window.Util||(window.Util={}))