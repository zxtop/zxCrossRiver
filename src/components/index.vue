<template>
    <div class="container">
        <div class="canvas" ref="canvas"></div>
        <img src="static/images/logo.png" class="logo"/>
    </div>
</template>
<script>
    import {Application, Container, Graphics,Sprite} from 'pixi.js';
    import {RenderAllData,RenderPageByIndex} from 'xes-tem-render'
    import {getAnimation, load, createSprite,getTexture} from '../loader';
    import $store from '../store/index.js';
    import START from "xes-preview-start";
    import {Actuator} from './actuator.js';
    import {AnswerInfo,Loading,Question} from 'xes-answer';
    const pixiSound = require('pixi-sound');
    let question;
    export default {
        name: "start",
        methods: {
            createApp() {
                return new Application({
                    width: 1920,
                    height: 1080,
                    autoSize: true,
                    transparent: true //背景是否设为透明
                })
            }
        },
        components: {},
        data() {
            return {
                isShow: false
            }
        },
        created() {
            let loading = document.getElementsByClassName('page-loading')[0];
            loading.style.display = 'block';
        },
        destroyed() {
            PIXI.sound.stopAll();
            app.destroy();
        },
        mounted() {
            PIXI.sound.stopAll();
            window.app = this.createApp();
            app.view.style.width = '19.2rem';
            app.view.style.height = '10.8rem';
            window.stage = app.stage;
            const self = this;
            self.$refs.canvas.appendChild(app.view);
            stage.interactive = true;
            load().then(res => {
                console.log("%c资源加载完啦✌️", "color:#FF323B;font-weight:bold;");
                window.question = res.question.data;
                question = res.question.data;
                store.state.testNum = question.sources.length;
                //创建答题接口实例
                let answer = new AnswerInfo();
                //loading接口
                Loading();
                //初始化每题的答题数据
                answer.answerDefault({type:0,useranswer:''})
                //每小题的答题数据，该题加载完成前调用此方法
                Question({id:'0',currentTotalOption:'1'})

                let start = new START(question.one.start, res);
                RenderAllData(false,question);
                self.$store.state.pageNumber = parseInt(self.$route.query.id)?parseInt(self.$route.query.id):0;
                RenderPageByIndex(self.$store.state.pageNumber)
                if(self.$route.query.startStatus){
                    if(window.question.one.start.show&&self.$route.query.startStatus=='true'){
                        stage.addChild(start);
                        
                        start.button(()=>{
                            stage.removeChild(start);
                            stage.getChildByName('gameBgSound')?stage.setChildIndex(stage.getChildByName('gameBgSound'),stage.children.length-1):"";
                            let actuator = new Actuator();
                            actuator.exec();
                        });
                    }else{
                        let actuator = new Actuator();
                        actuator.exec();
                    }
                }else{
                     if(window.question.one.start.show){
                        stage.addChild(start);
                        start.button(()=>{
                            stage.removeChild(start);
                            stage.getChildByName('gameBgSound')?stage.setChildIndex(stage.getChildByName('gameBgSound'),stage.children.length-1):"";
                            let actuator = new Actuator();
                            actuator.exec();
                        });
                    }else{
                        let actuator = new Actuator();
                        actuator.exec();
                    }
                }
            })
        }
    }
</script>
<style scoped>
    .canvas {
        width: 19.2rem;
        height: 10.8rem;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -9.6rem;
        margin-top: -5.4rem;
    }
    .animateCanvas {
        width: 19.2rem;
        height: 10.8rem;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -9.6rem;
        margin-top: -5.4rem;
        display: none;
    }
    .canvasBox{
        width: 19.2rem;
        height: 10.8rem;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -9.6rem;
        margin-top: -5.4rem;
        display:none;
    }
    .logo {
        position: absolute;
        z-index: 999;
        left: .5rem;
        bottom: .3rem;
        width: 1.9rem;
    }
</style>