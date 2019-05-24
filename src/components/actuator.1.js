import {Application,Container,Graphics,Sprite,Point} from 'pixi.js';
import { getAnimation, getSound, load, createSprite,  getTexture} from '../loader';
import {TweenLite,TimeLine,TweenMax} from 'gsap';
import {AnswerInfo} from 'xes-answer';
import {RenderPageByIndex} from 'xes-tem-render'
import Animate from 'xes-animate';

class Actuator {

    constructor() {
        this.pixiStage = null;
        this.chuan = null;
        this.child_jl1 = null;
        this.child_jl2 = null;
        this.child_gw1 = null;
        this.child_gw2 = null;

        this.paizi = null;
        this.paizi_text = null;
        this.paizi_num = 0;

        this.reset = null;
        this.submit = null;

        this.guideLayer = null; //引导层
        this.guideAn = null;

        this.mouseStyle = null;
        this.mainArr = null;
        this.currentTarget = null;
        this.gra = null;
        this.gra1 = null;
        this.gra2 = null;
        this.gra3 = null;
        this.complete = true;

        this.message = null;
        this.temContainer = new Container();
        this.tishi = null;
        this.tishi1 = null;
        
        this.manContainer = new Container();
        this.child_gw1_sprite = null;
        this.child_gw2_sprite = null;
        this.child_jl1_sprite = null;
        this.child_jl2_sprite = null;

        this.chuan_sprite = null;
        this.chuan_after = null;
        this.chuan_after_sprite = null;

        this.cursor = true;
    }

    exec(){
        console.log("= 开始执行逻辑 =");
        this.initGame(store.state.pageNumber);
    }

    initGame(pageNum){     //初始化页面数据
        let _that = this;
        console.log("第"+pageNum+'页');
        this.pixiStage = stage.getChildByName('GAME').getChildByName('GAME'+pageNum);
        RenderPageByIndex(pageNum);

        this.mouseStyle = new PIXI.Sprite.fromImage(res['image_hand1'].url);//初始化鼠标
        this.mouseStyle.default = PIXI.Texture.fromImage('image_hand1');
        this.mouseStyle.anchor.set(.4);
        _that.pixiStage.interactive = true;
        _that.pixiStage.on('pointermove',(e)=>{
            let nowPos = e.data.getLocalPosition(stage);
            if(nowPos.x>0 && nowPos.x<1910 && nowPos.y>0 && nowPos.y<1070){
                if(_that.cursor){
                    _that.pixiStage.cursor = 'auto';
                    _that.mouseStyle.visible = false;

                }else{
                    _that.pixiStage.cursor = 'none';
                    _that.mouseStyle.x = nowPos.x;
                    _that.mouseStyle.y = nowPos.y;
                    _that.mouseStyle.visible = true;

                }
            }
        })

        _that.init();
        _that.guide();
        _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);

    }
    init(){ //初始化动物 船 过河次数 重置 提交
        let _that = this;
        _that.pixiStage.addChild(this.mouseStyle);

        _that.mainArr = [];

        _that.message = new Graphics();  //引导层
        _that.message.beginFill(0x000);
        _that.message.lineStyle(0,0x99ff44,0);
        _that.message.drawRect(0,0,1920,1080);
        _that.message.endFill();
        _that.message.alpha = .5;

        _that.tishi = new PIXI.Sprite.fromImage(res['image_jinggao1'].url);
        _that.tishi.x = 500;
        _that.tishi.y = 250;

        _that.tishi1 = new PIXI.Sprite.fromImage(res['image_jinggao2'].url);
        _that.tishi1.x = 500;
        _that.tishi1.y = 250;

        this.temContainer.addChild(_that.message);
        this.temContainer.addChild(_that.tishi);
        this.temContainer.addChild(_that.tishi1);
        this.temContainer.visible = false;


        this.chuan = getAnimation('animation_main');
        this.chuan.x = 680;
        this.chuan.y = 600;

        this.chuan_sprite = new PIXI.Sprite.fromImage(res['image_boad_hover'].url);
        this.chuan_sprite.x = -262;
        this.chuan_sprite.y = -150;
        this.chuan_sprite.visible = false;
        this.chuan.addChild(this.chuan_sprite);

        this.chuan_after = getAnimation('animation_main');
        this.chuan_after.state.setAnimation(1,'wait_chuan2',true);
        this.chuan_after.x = 680;
        this.chuan_after.y = 600;

        this.chuan_after_sprite = new PIXI.Sprite.fromImage(res['image_boad_hover1'].url);
        this.chuan_after_sprite.x = -262;
        this.chuan_after_sprite.y = -150;
        this.chuan_after_sprite.visible = false;
        _that.chuan_after.addChild(this.chuan_after_sprite);

        this.manContainer.addChild(this.chuan_after);
        this.chuan.state.setAnimation(1,'wait_chuan1',true);
        this.chuan.num1 = false;
        this.chuan.num2 = false;

        this.chuan.obj1 = null;
        this.chuan.obj2 = null;
        this.chuan.reserve = true;
        this.chuan.on('pointerover',function(){
            _that.chuan.cursor = 'none';
        })

        this.child_gw1 = getAnimation('animation_main');
        this.child_gw1.reserve = true;
        this.child_gw1.x = 200;
        this.child_gw1.y = 410;

        
        
        this.child_gw1_sprite = new PIXI.Sprite.fromImage(res['image_gw_hover'].url);
        this.child_gw1_sprite.name = 'child_gw1';
        this.child_gw1_sprite.x = -110;
        this.child_gw1_sprite.y = -190;
        this.child_gw1_sprite.visible = false;
        this.child_gw1.addChild(this.child_gw1_sprite);

        this.child_gw1.left_x = 200;
        this.child_gw1.left_y = 410;

        this.child_gw1.right_x = 1800;
        this.child_gw1.right_y = 410;

        this.child_gw1.name = 'child_gw1';
        this.child_gw1.wait = 'wait_GW';
        this.child_gw1.move = 'move_GW';
        this.child_gw1.right = 'right_GW';
        this.child_gw1.wrong = 'wrong_GW';

        this.child_gw1.state.setAnimation(1,'wait_GW',true);
        this.pixiStage.addChild(this.child_gw1);
     

        this.child_gw2 = getAnimation('animation_main');
        this.child_gw2.reserve = true;
        this.child_gw2.x = 360;
        this.child_gw2.y = 470;

        this.child_gw2_sprite = new PIXI.Sprite.fromImage(res['image_gw_hover'].url);
        this.child_gw2_sprite.x = -110;
        this.child_gw2_sprite.y = -190;
        this.child_gw2_sprite.name = 'child_gw2';
        this.child_gw2_sprite.visible = false;
        this.child_gw2.addChild(this.child_gw2_sprite);

        this.child_gw2.left_x = 360;
        this.child_gw2.left_y = 470;

        this.child_gw2.right_x = 1700;
        this.child_gw2.right_y = 470;

        this.child_gw2.name = 'child_gw2';
        this.child_gw2.wait = 'wait_GW';
        this.child_gw2.move = 'move_GW';
        this.child_gw2.right = 'right_GW';
        this.child_gw2.wrong = 'wrong_GW';
        this.child_gw2.state.setAnimation(1,'wait_GW',true);
        this.pixiStage.addChild(this.child_gw2);
      
        

        this.child_jl1 = getAnimation('animation_main');
        this.child_jl1.reserve = true;
        this.child_jl1.x = 122;
        this.child_jl1.y = 528;

        this.child_jl1_sprite = new PIXI.Sprite.fromImage(res['image_jl_hover'].url);
        this.child_jl1_sprite.x = -105;
        this.child_jl1_sprite.y = -155;
        this.child_jl1_sprite.name = 'child_jl1';
        this.child_jl1_sprite.visible = false;
        this.child_jl1.addChild(this.child_jl1_sprite);

        this.child_jl1.left_x = 122;
        this.child_jl1.left_y = 528;

        this.child_jl1.right_x = 1800;
        this.child_jl1.right_y = 528;

        this.child_jl1.name = 'child_jl1';
        this.child_jl1.wait = 'wait_JL';
        this.child_jl1.move = 'move_JL';
        this.child_jl1.right = 'right_JL';
        this.child_jl1.wrong = 'wrong_JL';

        this.child_jl1.state.setAnimation(1,'wait_JL',true);
        this.pixiStage.addChild(this.child_jl1);
       

        this.child_jl2 = getAnimation('animation_main');
        this.child_jl2.reserve = true;
        this.child_jl2.x = 282;
        this.child_jl2.y = 650;

        this.child_jl2_sprite = new PIXI.Sprite.fromImage(res['image_jl_hover'].url);
        this.child_jl2_sprite.x = -105;
        this.child_jl2_sprite.y = -155;
        this.child_jl2_sprite.name = 'child_jl2';
        this.child_jl2_sprite.visible = false;
        this.child_jl2.addChild(this.child_jl2_sprite);

        this.child_jl2.left_x = 282;
        this.child_jl2.left_y = 650;

        this.child_jl2.right_x = 1700;
        this.child_jl2.right_y = 650;

        this.child_jl2.name = 'child_jl2';
        this.child_jl2.wait = 'wait_JL';
        this.child_jl2.move = 'move_JL';
        this.child_jl2.right = 'right_JL';
        this.child_jl2.wrong = 'wrong_JL';

        this.child_jl2.state.setAnimation(1,'wait_JL',true);
        this.pixiStage.addChild(this.child_jl2);
        

        this.paizi = new PIXI.Sprite.fromImage('image_paizi');
        this.paizi.x = 790;
        this.paizi.y = 810;
        this.pixiStage.addChild(this.paizi);
        
        this.paizi_text = new PIXI.Text('0',{fontFamily:'Arial',fontSize:48,fill:'#3b0d01',fontWeight:'bold'})
        this.paizi_text.x = 280;
        this.paizi_text.y = 60;
        this.paizi.addChild(this.paizi_text);

        this.reset = new PIXI.Sprite.fromImage('image_chongzhi');
        this.reset.interactive = true;
        this.reset.anchor.set(.5,.5);
        this.reset.x = 1660+110;
        this.reset.y = 840+50;
        this.reset.startWidth = 220;
        this.reset.startHeight = 100;
        this.pixiStage.addChild(this.reset);

        this.submit = new PIXI.Sprite.fromImage('image_tijiao');
        this.submit.interactive = true;
        this.submit.anchor.set(.5,.5);
        this.submit.x = 1662+110;
        this.submit.y = 954+50;
        this.submit.startWidth = 220;
        this.submit.startHeight = 100;
        this.pixiStage.addChild(this.submit);

        this.pixiStage.addChild(this.temContainer);
        this.pixiStage.addChild(this.manContainer);
        // this.manContainer.addChild(this.child_gw1_sprite,this.child_gw2_sprite,this.child_jl1_sprite,this.child_jl2_sprite);
        this.pixiStage.addChild(this.chuan);


        this.reset.on('pointerover',_that.overAndScale.bind(this));
        this.reset.on('pointerout',_that.outAndScale.bind(this));
        this.reset.on('pointerdown',function(){
            _that.pixiStage.removeChildren(2,12);
            _that.manContainer.removeChildren();

            _that.init();
            _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
            _that.pixiStage.children.map((item,index)=>{
                if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                    _that.mainArr.push(item);
                }
            })
            _that.paizi_num = 0;
            _that.complete = true;
            //进入游戏主逻辑
            _that.runGame();
        })
        this.submit.on('pointerover',_that.overAndScale.bind(this));
        this.submit.on('pointerout',_that.outAndScale.bind(this));
        this.submit.on('pointerdown',function(){
            let answer = new AnswerInfo();
            answer.init({type: 0, useranswer: '', answer: '', id: store.state.pageNumber, rightnum: 1, wrongnum: 0});
            store.dispatch('pushToPostArr', answer);
            store.dispatch('postAnswer');
        })
        _that.child_gw1.index = _that.pixiStage.getChildIndex(_that.child_gw1);
        _that.child_gw2.index = _that.pixiStage.getChildIndex(_that.child_gw2);
        _that.child_jl1.index = _that.pixiStage.getChildIndex(_that.child_jl1);
        _that.child_jl2.index = _that.pixiStage.getChildIndex(_that.child_jl2);

        // console.log("ssssssss",_that.pixiStage.getChildIndex(_that.child_gw2));

    }
    mainArrover(e){
        let _that = this;
        let target = e.currentTarget;
        target.cursor = 'none';
        target.getChildByName(target.name).visible = true;
        _that.cursor = false;
    }

    mainArrout(e){
        let _that = this;
        let target = e.currentTarget;
        target.getChildByName(target.name).visible = false;
        _that.cursor = true;

    }
    overAndScale(e){
        let target = e.currentTarget;
        TweenLite.to(target,.4,{width:1.05*target.width,height:1.05*target.height});
    }

    outAndScale(e){
        let target = e.currentTarget;
        TweenLite.to(target,.4,{width:target.startWidth,height:target.startHeight});
    }

    runGame(){
        let _that = this;
        _that.mainArr.map((item,index)=>{
            item.interactive = true;
            item.buttonMode = true;
            item.on('pointerdown',_that.getCurrentTarget.bind(this));
            item.on('pointerover',_that.mainArrover.bind(this));
            item.on('pointerout',_that.mainArrout.bind(this));
        });
        _that.chuan.on('pointerdown',_that.getBoatMove.bind(this));

        _that.chuan.on('pointerover',function(){
            if(_that.complete){

                _that.chuan_sprite.visible = true;
                _that.chuan_after_sprite.visible = true;
                _that.cursor = false;
            }
        });
        _that.chuan.on('pointerout',function(){
            _that.chuan_sprite.visible = false;
            _that.chuan_after_sprite.visible = false;
            _that.cursor = true;
        });
    }

    getCurrentTarget(e){ //点击人物

        let _that = this;
        _that.cursor = true;
        console.log(_that.complete)
        if(_that.complete){
            if(_that.chuan.reserve){

                _that.currentTarget = e.target;
                _that.currentTarget.getChildByName(_that.currentTarget.name).visible = false;
                _that.currentTarget.interactive = false;
                
                if(_that.currentTarget.reserve){
                    _that.complete = false;
                    //一人坐船
                    if(_that.chuan.num1 == false ){
                        res['audio_click'].sound.play();

                        console.log("只能进入1人");
                        _that.pixiStage.setChildIndex(_that.currentTarget,_that.pixiStage.children.length-3);
                        _that.pixiStage.setChildIndex(_that.chuan,_that.pixiStage.children.length-2);
                        _that.currentTarget.state.setAnimation(1,_that.currentTarget.move,true);
                        TweenLite.to(_that.currentTarget,.5,{alpha:0,x:750,y:520,onComplete:function(){
                            TweenLite.to(_that.currentTarget,.5,{alpha:1,onComplete:function(){
                                _that.complete = true;
                                _that.chuan.num1 = true;
                                _that.chuan.obj1 = _that.currentTarget;
                                // _that.currentTarget.state.setAnimation(1,_that.currentTarget.wait,true);
                                _that.chuan.interactive = true;
                                _that.chuan.buttonMode = true;
                            }})
                            // _that.gra = new PIXI.Graphics();
                            // _that.gra.beginFill("0xffffff",1);
                            // _that.gra.lineStyle(10,0xffffff);
                            // _that.gra.moveTo(650-650,330-330);
                            // _that.gra.lineTo(900-650,330-330);
                            // _that.gra.lineTo(900-650,410-330);
                            // _that.gra.lineTo(850-650,525-330);
                            // _that.gra.lineTo(690-650,544-330);
                            // _that.gra.lineTo(630-650,410-330);
                            // _that.gra.lineTo(650-650,330-330);
                            // _that.gra.endFill();
                            // _that.gra = new PIXI.Sprite.fromImage(res['image_mask'].url)
            
                            // _that.chuan.skeleton.findSlot("chuan0002").currentSprite.addChild(_that.gra);
                            // _that.gra.position.set(-242.71477060050466 , -460.32168672047254);
                            // _that.currentTarget.mask = _that.gra;
                            // _that._moveInterface(_that.gra)
                        }});
                    }
        
                    //两人坐船
                    if(_that.chuan.num1  && _that.chuan.num2 == false){
                        console.log("进入第二个人");
                        res['audio_click'].sound.play();

                        _that.pixiStage.setChildIndex(_that.currentTarget,_that.pixiStage.children.length-3);
                        _that.pixiStage.setChildIndex(_that.chuan,_that.pixiStage.children.length-2);
                        _that.currentTarget.state.setAnimation(1,_that.currentTarget.move,true);
                        TweenLite.to(_that.currentTarget,.5,{alpha:0,x:570,y:520,onComplete:function(){
                            TweenLite.to(_that.currentTarget,.5,{alpha:1,onComplete:function(){
                                _that.complete = true;
                                // _that.currentTarget.state.setAnimation(1,_that.currentTarget.wait,true);
                                _that.chuan.num2 = true;
                                _that.chuan.obj2 = _that.currentTarget;
                                _that.chuan.interactive = true;
                                _that.chuan.buttonMode = true;
                            }})
                            // _that.gra1 = new PIXI.Graphics();
                            // _that.gra1.beginFill("0xffffff",1);
                            // _that.gra1.lineStyle(10,0xffffff);
                            // _that.gra1.moveTo(470-470,340-340);
                            // _that.gra1.lineTo(744-470,338-340);
                            // _that.gra1.lineTo(704-470,514-340);
                            // _that.gra1.lineTo(684-470,566-340);
                            // _that.gra1.lineTo(578-470,558-340);
                            // _that.gra1.lineTo(476-470,533-340);
                            // _that.gra1.lineTo(470-470,340-340);
                            // _that.gra1.endFill();
                            // _that.gra1 = new PIXI.Sprite.fromImage(res['image_mask'].url)
            
                            // _that.chuan.skeleton.findSlot("chuan0002").currentSprite.addChild(_that.gra1);
                            // _that.gra1.position.set(-242.71477060050466 , -460.32168672047254);
                            // _that.currentTarget.mask = _that.gra1;
                            // _that._moveInterface(_that.gra1);
                            // _that.currentTarget.interactive = false;
            
                        }})
                    }
                }

            }else{
                _that.currentTarget = e.target;
                _that.currentTarget.getChildByName(_that.currentTarget.name).visible = false;
                _that.currentTarget.interactive = false;

                if(_that.currentTarget.reserve == false){
                    _that.complete = false;
                    //反向一人坐船
                    if(_that.chuan.num1 == false){
                        res['audio_click'].sound.play();

                        console.log("反向只能进入1人");
                        _that.pixiStage.setChildIndex(_that.currentTarget,_that.pixiStage.children.length-3);
                        _that.pixiStage.setChildIndex(_that.chuan,_that.pixiStage.children.length-2);

                        _that.currentTarget.state.setAnimation(1,_that.currentTarget.move,true);
                        TweenLite.to(_that.currentTarget,.5,{alpha:0,x:1195,y:520,onComplete:function(){
                            TweenLite.to(_that.currentTarget,.5,{alpha:1,onComplete:function(){
                                _that.complete = true;
                                _that.chuan.num1 = true;
                                _that.chuan.obj1 = _that.currentTarget;
                                // _that.currentTarget.state.setAnimation(1,_that.currentTarget.wait,true);
                                _that.chuan.interactive = true;
                                _that.chuan.buttonMode = true;
                            }})

                            // _that.gra2 = new PIXI.Graphics();
                            // _that.gra2.beginFill("0xffffff",1);
                            // _that.gra2.lineStyle(10,0xffffff);
                            // _that.gra2.moveTo(1264-1264,338-338);
                            // _that.gra2.lineTo(1496-1264,336-338);
                            // _that.gra2.lineTo(1520-1264,488-338);
                            // _that.gra2.lineTo(1462-1264,546-338);
                            // _that.gra2.lineTo(1300-1264,562-338);
                            // _that.gra2.lineTo(1246-1264,454-338);
                            // _that.gra2.lineTo(1264-1264,338-338);
                            // _that.gra2.endFill();
                            // _that.gra2 = new PIXI.Sprite.fromImage(res['image_mask'].url);

                            // _that.chuan.skeleton.findSlot("chuan0002").currentSprite.addChild(_that.gra2);
                            // _that.gra2.position.set(-243.50906450384673 , -460.5088806405683);
                            // _that.currentTarget.mask = _that.gra2;
                            // _that._moveInterface(_that.gra2)
            
                        }})
                    }

                    //反向两人坐船
                    if(_that.chuan.num1  && _that.chuan.num2 == false){
                        console.log("反向进入第二个人");
                        res['audio_click'].sound.play();

                        _that.pixiStage.setChildIndex(_that.currentTarget,_that.pixiStage.children.length-3);
                        _that.pixiStage.setChildIndex(_that.chuan,_that.pixiStage.children.length-2);

                        _that.currentTarget.state.setAnimation(1,_that.currentTarget.move,true);
                        TweenLite.to(_that.currentTarget,.5,{alpha:0,x:1375,y:518,onComplete:function(){
                            TweenLite.to(_that.currentTarget,.5,{alpha:1,onComplete:function(){
                                _that.complete = true;
                                // _that.currentTarget.state.setAnimation(1,_that.currentTarget.wait,true);
                                _that.chuan.num2 = true;
                                _that.chuan.obj2 = _that.currentTarget;
                                _that.chuan.interactive = true;
                                _that.chuan.buttonMode = true;
                            }});
                            // _that.gra3 = new PIXI.Graphics();
                            // _that.gra3.beginFill("0xffffff",1);
                            // _that.gra3.lineStyle(10,0xffffff);
                            // _that.gra3.moveTo(1122-1122,352-352);
                            // _that.gra3.lineTo(1310-1122,334-352);
                            // _that.gra3.lineTo(1348-1122,456-352);
                            // _that.gra3.lineTo(1290-1122,560-352);
                            // _that.gra3.lineTo(1140-1122,536-352);
                            // _that.gra3.lineTo(1088-1122,468-352);
                            // _that.gra3.lineTo(1122-1122,352-352);
                            // _that.gra3.endFill();

                            // _that.gra3 = new PIXI.Sprite.fromImage(res['image_mask'].url);
                            
                            // _that.chuan.skeleton.findSlot("chuan0002").currentSprite.addChild(_that.gra3);
                            // _that.gra3.position.set(-243.50906450384673 , -460.5088806405683);
                            // _that.currentTarget.mask = _that.gra3;
                            // _that._moveInterface(_that.gra3);
                            
                            
                        }});
                    }
                }
            }

            
            
        }

    }
    
    getBoatMove(e){ //点击小船
        let _that = this;
        _that.cursor = true;
        if(_that.complete){
           
            if(_that.chuan.reserve){

                _that.currentTarget = e.target;
                _that.complete = false;

                //一人过河
                if(_that.currentTarget.num1 && _that.currentTarget.num2 == false){
                    res['audio_hc'].sound.play();
                    
                    _that.chuan.state.setAnimation(1,'move_chuan1',false);
                    _that.chuan_after.state.setAnimation(1,'move_chuan2',false);
                    TweenLite.to(_that.chuan_after,1,{x:1290})
                    TweenLite.to(_that.chuan,1,{x:1290,onComplete:function(){
                        _that.chuan.reserve = false;
                        _that.chuan.state.setAnimation(1,'wait_chuan1',false);
                        _that.chuan_after.state.setAnimation(1,'wait_chuan2',false);
                    }});
        
                    TweenLite.to(_that.currentTarget.obj1,1,{x:1360,onComplete:function(){
                        // _that.currentTarget.obj1.mask = null;
                        // _that.gra.alpha = 0;
                        _that.currentTarget.obj1.state.setAnimation(1,_that.currentTarget.obj1.move,true);
                        //上岸
                        TweenLite.to(_that.currentTarget.obj1,1,{x:_that.currentTarget.obj1.right_x,y:_that.currentTarget.obj1.right_y,alpha:0,onComplete:function(){
                            _that.currentTarget.obj1.reserve = false;
                            _that.currentTarget.obj1.interactive = true;
                            _that.complete = true;
                            _that.chuan.num1 = false;
                            _that.chuan.interactive = false;
                            _that.chuan.scale.set(-1,1);
                            _that.chuan_after.scale.set(-1,1);
                            _that.currentTarget.obj1.alpha = 1;
                            _that.currentTarget.obj1.state.setAnimation(1,_that.currentTarget.obj1.wait,true);
                            _that.currentTarget.obj1.scale.set(-1,1);
                            _that.paizi_num ++;
                            _that.paizi_text.setText(_that.paizi_num);

                            // 判断过河次数是否超过5次
                            let d = _that.mainArr[0].reserve == false &&
                            _that.mainArr[1].reserve == false &&
                            _that.mainArr[2].reserve == false &&
                            _that.mainArr[3].reserve == false
                            if(_that.paizi_num >5 && d){
                                res['audio_wrong'].sound.play();
                                _that.pixiStage.setChildIndex(_that.temContainer,_that.pixiStage.children.length-2)
                                _that.temContainer.removeChildren();
                                _that.temContainer.addChild(_that.message);
                                _that.temContainer.addChild(_that.tishi1);
                                _that.temContainer.visible = true;
                                _that.tishi1.visible = true;
                                
                                setTimeout(()=>{
                                    _that.pixiStage.removeChildren(2,12);
                                    _that.manContainer.removeChildren();
                                    _that.init();
                                    _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                    _that.pixiStage.children.map((item,index)=>{
                                        if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                            _that.mainArr.push(item);
                                        }
                                    })
                                    _that.paizi_num = 0;
                                    _that.complete = true;
                                    //进入游戏主逻辑
                                    _that.runGame();
                                },2000)
                            }
                            //判断是否正确
                            if(_that.paizi_num == 5 && d){
                                res['audio_right'].sound.play();
                                _that.mainArr.map((item,index)=>{
                                    item.state.setAnimation(1,item.right,true);
                                });
                                setTimeout(()=>{
                                    _that.pixiStage.removeChildren(2,12);
                                    _that.manContainer.removeChildren();
                                    _that.init();
                                    _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                    _that.pixiStage.children.map((item,index)=>{
                                        if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                            _that.mainArr.push(item);
                                        }
                                    })
                                    _that.paizi_num = 0;
                                    _that.complete = true;
                                    //进入游戏主逻辑
                                    _that.runGame();
                                },2000)
                            }

                            // 判断某一案是否出现两个怪物
                            let strArr = [];
                            let strArrAn = [];
                            _that.mainArr.map((item,index)=>{
                                if(item.reserve){
                                    strArr.push(item.name);
                                    strArrAn.push(item);
                                }
                            });

                            let a = strArr.indexOf('child_gw1')>-1 && strArr.indexOf('child_gw2')>-1;
                            let b = strArr.indexOf('child_jl1')>-1 || strArr.indexOf('child_jl2')>-1;
                            let c = strArr.length == 3 ? true : false;
                            if(a&&b&&c){
                                console.log('出现警告提示.....');

                                //播放错误声音
                                res['audio_message'].sound.play();

                                //播放错误动画
                                strArrAn.map((item,index)=>{
                                    item.state.setAnimation(1,item.wrong,false)
                                })
                                setTimeout(()=>{
                                    _that.pixiStage.setChildIndex(_that.temContainer,_that.pixiStage.children.length-2)
    
                                    _that.temContainer.removeChildren();
                                    _that.temContainer.addChild(_that.message);
                                    _that.temContainer.addChild(_that.tishi);
                                    _that.temContainer.visible = true;
                                    _that.tishi.visible = true;
                                    setTimeout(()=>{
                                        _that.pixiStage.removeChildren(2,12);
                                        _that.manContainer.removeChildren();
                                        _that.init();
                                        _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                        _that.pixiStage.children.map((item,index)=>{
                                            if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                                _that.mainArr.push(item);
                                            }
                                        })
                                        _that.paizi_num = 0;
                                        _that.complete = true;
                                        //进入游戏主逻辑
                                        _that.runGame();
                                    },2000)
                                },2000)
                            }
                            _that.pixiStage.setChildIndex(_that.reset,_that.pixiStage.children.length-2);
                            _that.pixiStage.setChildIndex(_that.submit,_that.pixiStage.children.length-3);
                            _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                            _that.pixiStage.setChildIndex(_that.child_jl1,_that.pixiStage.children.length-5);
                            _that.pixiStage.setChildIndex(_that.child_jl2,_that.pixiStage.children.length-4);

                            _that.pixiStage.setChildIndex(_that.child_gw2,_that.pixiStage.children.length-7);
                            _that.pixiStage.setChildIndex(_that.child_gw1,_that.pixiStage.children.length-8);
                        }});
                        
                    }})
        
                }

                //两人过河
                if(_that.currentTarget.num2 && _that.currentTarget.num1){
                    res['audio_hc'].sound.play();

                    _that.chuan.state.setAnimation(1,'move_chuan1',false);
                    _that.chuan_after.state.setAnimation(1,'move_chuan2',false);
                    TweenLite.to(_that.chuan_after,1,{x:1290})                    
                    TweenLite.to(_that.chuan,1,{x:1290,onComplete:function(){
                        _that.chuan.reserve = false;
                        _that.chuan.state.setAnimation(1,'wait_chuan1',false);
                    _that.chuan_after.state.setAnimation(1,'wait_chuan2',false);
                    }});
                    
                    TweenLite.to(_that.currentTarget.obj1,1,{x:1360,onComplete:function(){
                        // _that.currentTarget.obj1.mask = null;
                        // _that.gra.alpha = 0;
                        _that.currentTarget.obj1.state.setAnimation(1,_that.currentTarget.obj1.move,true);
                        //obj1 上岸
                        TweenLite.to(_that.currentTarget.obj1,1,{x:_that.currentTarget.obj1.right_x,y:_that.currentTarget.obj1.right_y,alpha:0,onComplete:function(){
                            
                            _that.chuan.num1 = false;
                            _that.currentTarget.obj1.reserve = false;
                            _that.currentTarget.obj1.interactive = true;
                            _that.complete = true;
                            _that.currentTarget.obj1.alpha = 1;
                            _that.currentTarget.obj1.state.setAnimation(1,_that.currentTarget.obj1.wait,true);
                            _that.currentTarget.obj1.scale.set(-1,1);
                            
                        }})
                        
                    }})
        
                    TweenLite.to(_that.currentTarget.obj2,1,{x:1200,onComplete:function(){
                        // _that.currentTarget.obj2.mask = null;
                        // _that.gra1.alpha = 0;
                        _that.currentTarget.obj2.state.setAnimation(1,_that.currentTarget.obj2.move,true);
                        //obj2 上岸
                        TweenLite.to(_that.currentTarget.obj2,1,{x:_that.currentTarget.obj2.right_x,y:_that.currentTarget.obj2.right_y,alpha:0,onComplete:function(){

                            _that.currentTarget.obj2.reserve = false;
                            _that.currentTarget.obj2.interactive = true;
                            _that.complete = true;
                            _that.chuan.num2 = false;
                            _that.chuan.interactive = false;
                            _that.chuan.scale.set(-1,1);
                            _that.chuan_after.scale.set(-1,1);

                            _that.currentTarget.obj2.alpha = 1;
                            _that.currentTarget.obj2.state.setAnimation(1,_that.currentTarget.obj2.wait,true);
                            _that.currentTarget.obj2.scale.set(-1,1);
                            _that.paizi_num ++;
                            _that.paizi_text.setText(_that.paizi_num);

                            // 判断过河次数是否超过5次
                            let d = _that.mainArr[0].reserve == false &&
                            _that.mainArr[1].reserve == false &&
                            _that.mainArr[2].reserve == false &&
                            _that.mainArr[3].reserve == false
                            if(_that.paizi_num >5 && d){
                                res['audio_wrong'].sound.play();
                                _that.pixiStage.setChildIndex(_that.temContainer,_that.pixiStage.children.length-2)

                                _that.temContainer.removeChildren();
                                _that.temContainer.addChild(_that.message);
                                _that.temContainer.addChild(_that.tishi1);
                                _that.temContainer.visible = true;
                                _that.tishi1.visible = true;
                                
                                setTimeout(()=>{
                                    _that.pixiStage.removeChildren(2,12);
                                    _that.manContainer.removeChildren();
                                    _that.init();
                                    _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                    _that.pixiStage.children.map((item,index)=>{
                                        if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                            _that.mainArr.push(item);
                                        }
                                    })
                                    _that.paizi_num = 0;
                                    _that.complete = true;
                                    //进入游戏主逻辑
                                    _that.runGame();
                                },2000)
                            }

                            //判断是否正确
                            if(_that.paizi_num == 5 && d){
                                res['audio_right'].sound.play();
                                _that.mainArr.map((item,index)=>{
                                    item.state.setAnimation(1,item.right,true);
                                });
                                setTimeout(()=>{
                                    _that.pixiStage.removeChildren(2,12);
                                    _that.manContainer.removeChildren();
                                    _that.init();
                                    _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                    _that.pixiStage.children.map((item,index)=>{
                                        if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                            _that.mainArr.push(item);
                                        }
                                    })
                                    _that.paizi_num = 0;
                                    _that.complete = true;
                                    //进入游戏主逻辑
                                    _that.runGame();
                                },2000)
                            }
                            //判断是否出现怪物
                            let strArr = [];
                            let strArrAn = [];
                            _that.mainArr.map((item,index)=>{
                                
                                if(item.reserve == false){
                                    strArr.push(item.name);
                                    strArrAn.push(item);
                                }
                            });

                            let a = strArr.indexOf('child_gw1')>-1 && strArr.indexOf('child_gw2')>-1;
                            let b = strArr.indexOf('child_jl1')>-1 || strArr.indexOf('child_jl2')>-1;
                            let c = strArr.length==3?true:false;
                            if(a&&b&&c){
                                console.log('出现警告提示.....');
                                
                                //播放错误声音
                                res['audio_message'].sound.play();

                                //播放错误动画
                                strArrAn.map((item,index)=>{
                                    item.state.setAnimation(1,item.wrong,false)
                                })
                                setTimeout(() => {
                                    _that.pixiStage.setChildIndex(_that.temContainer,_that.pixiStage.children.length-2)
    
                                    _that.temContainer.removeChildren();
                                    _that.temContainer.addChild(_that.message);
                                    _that.temContainer.addChild(_that.tishi);
                                    _that.temContainer.visible = true;
                                  
                                    _that.tishi.visible = true;
                                    setTimeout(()=>{
                                        _that.pixiStage.removeChildren(2,12);
                                        _that.manContainer.removeChildren();
                                        _that.init();
                                        _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                        _that.pixiStage.children.map((item,index)=>{
                                            if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                                _that.mainArr.push(item);
                                            }
                                        })
                                        _that.paizi_num = 0;
                                        _that.complete = true;
                                        //进入游戏主逻辑
                                        _that.runGame();
                                    },2000)
                                    
                                }, 2000);
                            }
                            _that.pixiStage.setChildIndex(_that.reset,_that.pixiStage.children.length-2);
                            _that.pixiStage.setChildIndex(_that.submit,_that.pixiStage.children.length-3);
                            _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                            _that.pixiStage.setChildIndex(_that.child_jl1,_that.pixiStage.children.length-5);
                            _that.pixiStage.setChildIndex(_that.child_jl2,_that.pixiStage.children.length-4);

                            _that.pixiStage.setChildIndex(_that.child_gw2,_that.pixiStage.children.length-7);
                            _that.pixiStage.setChildIndex(_that.child_gw1,_that.pixiStage.children.length-8);

                        }})
        
                    }})
        
                }

            }else{

                _that.currentTarget = e.target;
                _that.complete = false;

                //一人反向过河
                if(_that.currentTarget.num1 && _that.currentTarget.num2 == false){
                    res['audio_hc'].sound.play();

                    _that.chuan.state.setAnimation(1,'move_chuan1',false);
                    _that.chuan_after.state.setAnimation(1,'move_chuan2',false);
                    TweenLite.to(_that.chuan_after,1,{x:680});
                    TweenLite.to(_that.chuan,1,{x:680,onComplete:function(){
                        _that.chuan.state.setAnimation(1,'wait_chuan1',false);
                        _that.chuan_after.state.setAnimation(1,'wait_chuan2',false);
                        _that.chuan.reserve = true;
                    }});
        
                    TweenLite.to(_that.currentTarget.obj1,1,{x:580,onComplete:function(){
                        // _that.currentTarget.obj1.mask = null;
                        // _that.gra2.alpha = 0;
                        _that.currentTarget.obj1.state.setAnimation(1,_that.currentTarget.obj1.move,true);
                        //上岸
                        TweenLite.to(_that.currentTarget.obj1,1,{x:_that.currentTarget.obj1.left_x,y:_that.currentTarget.obj1.left_y,alpha:0,onComplete:function(){

                            _that.currentTarget.obj1.reserve = true;
                            _that.currentTarget.obj1.interactive = true;

                            _that.complete = true;
                            _that.chuan.num1 = false;
                            _that.chuan.interactive = false;
                            _that.chuan.scale.set(1,1);
                            _that.chuan_after.scale.set(1,1);
                            _that.currentTarget.obj1.alpha = 1;
                            _that.currentTarget.obj1.state.setAnimation(1,_that.currentTarget.obj1.wait,true);
                            _that.currentTarget.obj1.scale.set(1,1);
                            _that.paizi_num ++;
                            _that.paizi_text.setText(_that.paizi_num);




                            //判断是否出现怪物
                            let strArr = [];
                            let strArrAn = [];
                            _that.mainArr.map((item,index)=>{
                                if(item.reserve){
                                    strArr.push(item.name);
                                    strArrAn.push(item);
                                }
                            });

                            let a = strArr.indexOf('child_gw1')>-1 && strArr.indexOf('child_gw2')>-1;
                            let b = strArr.indexOf('child_jl1')>-1 || strArr.indexOf('child_jl2')>-1;
                            let c = strArr.length == 3?true:false;
                            if(a&&b&&c){
                                console.log('出现警告提示.....');
                                
                                //播放错误声音
                                res['audio_message'].sound.play();

                                //播放错误动画
                                strArrAn.map((item,index)=>{
                                    item.state.setAnimation(1,item.wrong,false)
                                })
                                setTimeout(() => {
                                    _that.pixiStage.setChildIndex(_that.temContainer,_that.pixiStage.children.length-2)
    
                                    _that.temContainer.removeChildren();
                                    _that.temContainer.addChild(_that.message);
                                    _that.temContainer.addChild(_that.tishi);
                                    _that.temContainer.visible = true;
                                   
                                    _that.tishi.visible = true;
                                    setTimeout(()=>{
                                        _that.pixiStage.removeChildren(2,12);
                                        _that.manContainer.removeChildren();
                                        _that.init();
                                        _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                        _that.pixiStage.children.map((item,index)=>{
                                            if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                                _that.mainArr.push(item);
                                            }
                                        })
                                        _that.paizi_num = 0;
                                        _that.complete = true;
                                        //进入游戏主逻辑
                                        _that.runGame();
                                    },2000)
                                    
                                }, 2000);
                            }
                            _that.pixiStage.setChildIndex(_that.reset,_that.pixiStage.children.length-2);
                            _that.pixiStage.setChildIndex(_that.submit,_that.pixiStage.children.length-3);
                            _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                            _that.pixiStage.setChildIndex(_that.child_jl1,_that.pixiStage.children.length-5);
                            _that.pixiStage.setChildIndex(_that.child_jl2,_that.pixiStage.children.length-4);

                            _that.pixiStage.setChildIndex(_that.child_gw2,_that.pixiStage.children.length-7);
                            _that.pixiStage.setChildIndex(_that.child_gw1,_that.pixiStage.children.length-8);

                        }})
                        
                    }})
                }

                //两人反向过河
                if(_that.currentTarget.num2 && _that.currentTarget.num1){
                    res['audio_hc'].sound.play();

                    _that.chuan.state.setAnimation(1,'move_chuan1',false);
                    _that.chuan_after.state.setAnimation(1,'move_chuan2',false);
                    TweenLite.to(_that.chuan_after,1,{x:680});
                    TweenLite.to(_that.chuan,1,{x:680,onComplete:function(){
                        _that.chuan.state.setAnimation(1,'wait_chuan1',false);
                        _that.chuan_after.state.setAnimation(1,'wait_chuan2',false);
                        _that.chuan.reserve = true;
                    }});
                    
                    TweenLite.to(_that.currentTarget.obj1,1,{x:580,onComplete:function(){
                        // _that.currentTarget.obj1.mask = null;
                        // _that.gra2.alpha = 0;
                        //obj1 上岸
                        TweenLite.to(_that.currentTarget.obj1,1,{x:_that.currentTarget.obj1.left_x,y:_that.currentTarget.obj1.left_y,alpha:0,onComplete:function(){
                            _that.pixiStage.setChildIndex(_that.currentTarget.obj1,_that.currentTarget.obj1.index);

                            _that.chuan.num1 = false;
                            _that.currentTarget.obj1.reserve = true;
                            _that.currentTarget.obj1.interactive = true;
                            _that.complete = true;
                            _that.currentTarget.obj1.alpha = 1;
                            _that.currentTarget.obj1.state.setAnimation(1,_that.currentTarget.obj1.wait,true);
                            _that.currentTarget.obj1.scale.set(1,1);
                            
                        }})
                        
                    }})
        
                    TweenLite.to(_that.currentTarget.obj2,1,{x:750,onComplete:function(){
                        // _that.currentTarget.obj2.mask = null;
                        // _that.gra3.alpha = 0;
                        _that.currentTarget.obj2.state.setAnimation(1,_that.currentTarget.obj2.move,true);
                        //obj2 上岸
                        TweenLite.to(_that.currentTarget.obj2,1,{x:_that.currentTarget.obj2.left_x,y:_that.currentTarget.obj2.left_y,alpha:0,onComplete:function(){

                            _that.currentTarget.obj2.reserve = true;
                            _that.currentTarget.obj2.interactive = true;
                            _that.complete = true;
                            _that.chuan.num2 = false;
                            _that.chuan.interactive = false;
                            _that.chuan.scale.set(1,1);
                            _that.chuan_after.scale.set(1,1);
                            _that.currentTarget.obj2.alpha = 1;
                            _that.currentTarget.obj2.state.setAnimation(1,_that.currentTarget.obj2.wait,true);
                            _that.currentTarget.obj2.scale.set(1,1);
                            _that.paizi_num ++;
                            _that.paizi_text.setText(_that.paizi_num);

                            //判断是否出现怪物
                            let strArr = [];
                            let strArrAn = [];
                            _that.mainArr.map((item,index)=>{
                                // console.log("ddddd",item.reserve)
                                if(item.reserve){
                                    strArr.push(item.name);
                                    strArrAn.push(item);
                                }
                            });

                            let a = strArr.indexOf('child_gw1')>-1 && strArr.indexOf('child_gw2')>-1;
                            let b = strArr.indexOf('child_jl1')>-1 || strArr.indexOf('child_jl2')>-1;
                            let c = strArr.length == 3 ? true :false;
                            if(a&&b&&c){
                                console.log('出现警告提示.....');
                                
                                //播放错误声音
                                res['audio_message'].sound.play();

                                //播放错误动画
                                strArrAn.map((item,index)=>{
                                    item.state.setAnimation(1,item.wrong,false)
                                })
                                setTimeout(() => {
                                    
                                    _that.pixiStage.setChildIndex(_that.temContainer,_that.pixiStage.children.length-2)
    
                                    _that.temContainer.removeChildren();
                                    _that.temContainer.addChild(_that.message);
                                    _that.temContainer.addChild(_that.tishi);
                                    _that.temContainer.visible = true;
                                    _that.tishi.visible = true;
                                    setTimeout(()=>{
                                        _that.pixiStage.removeChildren(2,12);
                                        _that.manContainer.removeChildren();
                                        _that.init();
                                        _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                        _that.pixiStage.children.map((item,index)=>{
                                            if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                                _that.mainArr.push(item);
                                            }
                                        })
                                        _that.paizi_num = 0;
                                        _that.complete = true;
                                        //进入游戏主逻辑
                                        _that.runGame();
                                    },2000)
                                }, 2000);
                            }
                            _that.pixiStage.setChildIndex(_that.reset,_that.pixiStage.children.length-2);
                            _that.pixiStage.setChildIndex(_that.submit,_that.pixiStage.children.length-3);
                            _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                            _that.pixiStage.setChildIndex(_that.child_jl1,_that.pixiStage.children.length-5);
                            _that.pixiStage.setChildIndex(_that.child_jl2,_that.pixiStage.children.length-4);

                            _that.pixiStage.setChildIndex(_that.child_gw2,_that.pixiStage.children.length-7);
                            _that.pixiStage.setChildIndex(_that.child_gw1,_that.pixiStage.children.length-8);

                        }})
        
                    }})
                }
            }

        }
        
    }



    
    guide(){ //指引层

        let _that = this;
        _that.reset.interactive = false;
        _that.submit.interactive = false;

        this.guideLayer = new Container();
        this.guideLayer.name = 'guideLayer';

        let layer = new Graphics();  //引导层
        layer.beginFill(0x000);
        layer.lineStyle(0,0x99ff44,0);
        layer.drawRect(0,0,1920,1080);
        layer.endFill();
        layer.alpha = .5;
        this.guideLayer.addChild(layer);
        this.pixiStage.addChild(this.guideLayer);

        let shuoming = new PIXI.Sprite.fromImage('image_youxishuoming');
        shuoming.x = 300;
        shuoming.y = 200;
        this.guideLayer.addChild(shuoming);

        let zhidao = new PIXI.Sprite.fromImage('image_zhidao_default');
        zhidao.interactive = true;
        zhidao.default = PIXI.Texture.fromImage('image_zhidao_default');
        zhidao.xf = PIXI.Texture.fromImage('image_zhidao_xf');
        zhidao.x = 780;
        zhidao.y = 700;
        this.guideLayer.addChild(zhidao);

        this.guideAn = getAnimation('animation_main');
        this.guideAn.state.setAnimation(1,'zhiyin',true);
        this.guideAn.x = 1000;
        this.guideAn.y = 780;
        this.pixiStage.addChild(this.guideAn);

        zhidao.on('pointerover',function(){
            zhidao.texture = zhidao.xf;
            _that.cursor = false;
        })
        zhidao.on('pointerout',function(){
            zhidao.texture = zhidao.default;
            _that.cursor = true;

        })
        zhidao.on('pointerdown',function(){
            _that.cursor = true;

            shuoming.alpha = 0;
            zhidao.alpha = 0;
           
            _that.pixiStage.setChildIndex(_that.child_gw2,_that.pixiStage.children.length-3);
            _that.pixiStage.setChildIndex(_that.guideAn,_that.pixiStage.children.length-2);
            _that.guideAn.x = 420;
            _that.guideAn.y = 480;

            let image_dianjiguaiwu = new PIXI.Sprite.fromImage('image_dianjiguaiwu');
            image_dianjiguaiwu.x = 468;
            image_dianjiguaiwu.y = 234;
            _that.guideLayer.addChild(image_dianjiguaiwu);

            _that.child_gw2.interactive = true;
            _that.child_gw2.buttonMode = true;

            _that.child_gw2.on('pointerover',function(){
                _that.child_gw2.cursor = 'none';
                _that.cursor = false;
            });
            _that.child_gw2.on('pointerout',function(){
                _that.cursor = true;
            })
            _that.child_gw2.on('pointerdown',function(){
                _that.cursor = true;

                res['audio_click'].sound.play();
               
                _that.guideAn.alpha = 0;
                image_dianjiguaiwu.alpha = 0;
                _that.child_gw2.interactive = false;
               
                TweenLite.to(_that.child_gw2,1,{alpha:0,x:750,y:520,onComplete:function(){
                    
                    _that.child_gw2.state.setAnimation(1,'move_GW',true);
                    TweenLite.to(_that.child_gw2,1,{alpha:1});
                    _that.guideAn.alpha = 1;

                    // let gra = new PIXI.Sprite.fromImage(res['image_mask'].url)
                    // _that.chuan.skeleton.findSlot("chuan0002").currentSprite.addChild(gra);
                    // gra.position.set(-242.71477060050466 , -460.32168672047254);
                    // _that.child_gw2.mask = gra;
                    

                    let image_dianjixiaochuan = new PIXI.Sprite.fromImage('image_dianjixiaochuan');
                    image_dianjixiaochuan.x = 548;
                    image_dianjixiaochuan.y = 200;
                    _that.guideLayer.addChild(image_dianjixiaochuan);

                
                    _that.guideAn.x = 690;
                    _that.guideAn.y = 600;
                
                    _that.chuan.interactive = true;
                    _that.chuan.buttonMode = true;

                    _that.chuan.on('pointerover',function(){
                        _that.chuan.cursor = 'none';
                        _that.cursor = false;
                    });
                    _that.chuan.on('pointerout',function(){
                        _that.cursor = true;
                    })
                    _that.chuan.on('pointerdown',function(){
                        _that.cursor = true;
                        res['audio_hc'].sound.play();

                        _that.guideAn.alpha = 0;
                        image_dianjixiaochuan.alpha = 0;
                        _that.chuan.state.setAnimation(1,'move_chuan1',false);
                        _that.chuan_after.state.setAnimation(1,'move_chuan2',false);
                        TweenLite.to(_that.chuan,1,{x:1290,onComplete:function(){
                            _that.chuan.state.setAnimation(1,'wait_chuan1',false);
                             _that.chuan_after.state.setAnimation(1,'wait_chuan2',false);
                        }});
                        TweenLite.to(_that.chuan_after,1,{x:1290});
                        TweenLite.to(_that.child_gw2,1,{x:1360,onComplete:function(){
                            // _that.child_gw2.mask = null;
                            // gra.alpha = 0;

                            _that.guideAn.alpha = 0;
                            TweenLite.to(_that.child_gw2,1,{x:1700,alpha:0,onComplete:function(){
                                _that.child_gw2.alpha = 1;
                                _that.child_gw2.scale.set(-1,1);
                                _that.pixiStage.setChildIndex(_that.child_gw2,_that.pixiStage.children.length-6);
                                _that.pixiStage.setChildIndex(_that.chuan,_that.pixiStage.children.length-6);
                                _that.pixiStage.setChildIndex(_that.manContainer,_that.pixiStage.children.length-6);
                                _that.paizi_num ++;
                                _that.paizi_text.setText(_that.paizi_num);
                                
                                _that.pixiStage.setChildIndex(_that.paizi,_that.pixiStage.children.length-3);
                                
                                let meicijilu = new PIXI.Sprite.fromImage(res['image_meicijilu'].url);
                                meicijilu.x = 618;
                                meicijilu.y = 446;
                                _that.pixiStage.addChild(meicijilu);
                                
                                let xiayibu = new PIXI.Sprite.fromImage(res['image_xiayibu_df'].url);
                                xiayibu.interactive = true;
                                xiayibu.default = PIXI.Texture.fromImage('image_xiayibu_df');
                                xiayibu.xf = PIXI.Texture.fromImage('image_xiayibu_xf');
                                xiayibu.x = 280;
                                xiayibu.y = 180;
                                meicijilu.addChild(xiayibu);

                                _that.guideAn.alpha = 1;
                                _that.guideAn.x = 1032;
                                _that.guideAn.y = 702;

                                _that.pixiStage.setChildIndex(_that.guideAn,_that.pixiStage.children.length-1);
                                _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                _that.chuan.interactive = false;
                                xiayibu.on('pointerover',function(){
                                  _that.child_gw2.interactive = false;

                                    xiayibu.texture = xiayibu.xf;
                                    // console.log(_that.cursor);
                                    _that.cursor = false;
                                    
                                });
                                xiayibu.on('pointerout',function(){
                                    xiayibu.texture = xiayibu.default;
                                    _that.cursor = true;
                                });
                                xiayibu.on('pointerdown',function(){
                                    _that.cursor = true;
                                    _that.guideAn.alpha = 0;
                                    meicijilu.alpha = 0;
                                    _that.pixiStage.setChildIndex(_that.paizi,_that.pixiStage.children.length-5);

                                    let chongzhishuoming = new PIXI.Sprite.fromImage(res['image_chongzhishuoming'].url)
                                    chongzhishuoming.x = 966;
                                    chongzhishuoming.y = 500;
                                    _that.pixiStage.addChild(chongzhishuoming);

                                    let xiayibu2 = new PIXI.Sprite.fromImage(res['image_xiayibu_df'].url);
                                    xiayibu2.interactive = true;
                                    xiayibu2.default = PIXI.Texture.fromImage('image_xiayibu_df');
                                    xiayibu2.xf = PIXI.Texture.fromImage('image_xiayibu_xf');
                                    xiayibu2.x = 280;
                                    xiayibu2.y = 180;
                                    chongzhishuoming.addChild(xiayibu2);
                                    _that.pixiStage.setChildIndex(_that.guideAn,_that.pixiStage.children.length-1);
                                    _that.guideAn.alpha = 1;
                                    _that.guideAn.x = 1400;
                                    _that.guideAn.y = 780;
                                    _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1)
                                    _that.pixiStage.setChildIndex(_that.reset,_that.pixiStage.children.length-2);

                                    xiayibu.interactive = false;
                                    xiayibu2.on('pointerover',function(){
                                        xiayibu2.texture = xiayibu2.xf;
                                        _that.cursor = false;
                                    })
                                    xiayibu2.on('pointerout',function(){
                                        xiayibu2.texture = xiayibu2.default;
                                        _that.cursor = true;
                                    })
                                    xiayibu2.on('pointerdown',function(){
                                        _that.cursor = true;
                                        chongzhishuoming.alpha = 0;
                                        _that.guideAn.alpha = 0;
                                        let tiiaoshuoming = new PIXI.Sprite.fromImage(res['image_tijiaoshuoming'].url);
                                        tiiaoshuoming.x = 966;
                                        tiiaoshuoming.y = 500;
                                        _that.pixiStage.addChild(tiiaoshuoming);

                                        let xiayibu3 = new PIXI.Sprite.fromImage(res['image_xiayibu_df'].url);
                                        xiayibu3.interactive = true;
                                        xiayibu3.default = PIXI.Texture.fromImage('image_xiayibu_df');
                                        xiayibu3.xf = PIXI.Texture.fromImage('image_xiayibu_xf');
                                        xiayibu3.x = 280;
                                        xiayibu3.y = 180;
                                        tiiaoshuoming.addChild(xiayibu3);
                                        _that.guideAn.alpha = 1;
                                        _that.guideAn.x = 1400;
                                        _that.guideAn.y = 780;
                                        _that.pixiStage.setChildIndex(_that.guideLayer,_that.pixiStage.children.length-3);

                                        _that.pixiStage.setChildIndex(_that.submit,_that.pixiStage.children.length-2);

                                        _that.pixiStage.setChildIndex(_that.guideAn,_that.pixiStage.children.length-1);

                                        _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                        xiayibu2.interactive = false;
                                        xiayibu3.on('pointerover',function(){
                                            xiayibu3.texture = xiayibu3.xf;
                                            _that.cursor = false;
                                        })
                                        xiayibu3.on('pointerout',function(){
                                            xiayibu3.texture = xiayibu3.default;
                                            _that.cursor = true;
                                        })
                                        xiayibu3.on('pointerdown',function(){
                                            _that.cursor = true;
                                            console.log(_that.pixiStage)
                                            _that.pixiStage.removeChildren(2,18);
                                            _that.manContainer.removeChildren();
                                            _that.init();
                                            _that.pixiStage.setChildIndex(_that.mouseStyle,_that.pixiStage.children.length-1);
                                            _that.pixiStage.children.map((item,index)=>{
                                                if(item.name == 'child_jl1' || item.name == 'child_jl2' || item.name == 'child_gw1' || item.name == 'child_gw2'){
                                                    _that.mainArr.push(item);
                                                }
                                            })
                                            _that.paizi_num = 0;
                                            //进入游戏主逻辑
                                            _that.runGame();
                                        })
                                        
                                    })
                                })
                            }})
                            
                        }})
                    })

                }});
                _that.pixiStage.setChildIndex(_that.chuan,_that.pixiStage.children.length-3);
                _that.pixiStage.setChildIndex(_that.child_gw2,_that.pixiStage.children.length-4);
                _that.pixiStage.setChildIndex(_that.manContainer,_that.pixiStage.children.length-5);

                _that.pixiStage.setChildIndex(_that.guideAn,_that.pixiStage.children.length-2);
                // console.log(_that.pixiStage)
            })

        });

    }


    _moveInterface(obj) {
        var graphics1 = new PIXI.Graphics();
        graphics1.beginFill(0x000000, 0.2);
        graphics1.drawRect(-0.5 * obj.width || -100, -0.5 * obj.height || -100, obj.width || 200, obj.height || 200);
        graphics1.interactive = true;
        var graphics2 = new PIXI.Graphics();
        graphics2.beginFill(0xff0000, 0.2);
        graphics2.drawRect(-10, -10, 20, 20);
        graphics2.position.set(0.5 * obj.width || -100, -0.5 * obj.height || -100);
        graphics2.interactive = true;
        graphics2.on("pointerdown", function (e) {
            this.basePosition = {};
            this.basePosition.x = e.data.global.x;
            this.basePosition.y = e.data.global.y;
        });
        graphics2.on("pointermove", function (e) {
            if (this.basePosition) {
                var dx = e.data.global.x - this.basePosition.x;
                var dy = e.data.global.y - this.basePosition.y;
                var p = obj.toLocal(e.data.global, stage);
                graphics2.position.set(p.x, p.y);
                this.parent.scale.set(this.parent.scale.x + dx * 0.001, this.parent.scale.y - dy * 0.001);
            }
        });
        graphics2.on("pointerup", function (e) {
            console.log("scale:", this.parent.scale.x, ",", this.parent.scale.y);
            delete this.basePosition;
        });
        graphics2.on("pointerout", function (e) {
            console.log("scale:", this.parent.scale.x, ",", this.parent.scale.y);
            delete this.basePosition;
        });
        graphics1.on("pointerup", function () {
            this.allowMove = false;
            console.log("Position:", this.parent.x, ",", this.parent.y);
        });
        obj.addChild(graphics1, graphics2);
        var startPoint = void 0;
        graphics1.on("pointerdown", function (e) {
            this.allowMove = true;
            startPoint = obj.toLocal(e.data.global, stage);
            console.log("StartPoint",startPoint);
        });
        graphics1.on("pointermove", function (e) {
            // console.log("StartPoint",obj.toLocal(e.data.global, stage));
            if (this.allowMove) {
                var p = obj.parent.toLocal(e.data.global, stage);
                obj.position.set(p.x - startPoint.x, p.y - startPoint.y);
            }
        });
        graphics1.on("pointerup", function () {
            this.allowMove = false;
            console.log("Position:", this.parent.x, ",", this.parent.y);
        });
    }

}

export {Actuator};