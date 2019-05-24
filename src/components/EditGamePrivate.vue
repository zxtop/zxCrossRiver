<template>
    <div>
        <div class="game-title">
            <i :class="tabShowStatus[index].child.option1?'el-icon-arrow-down':'el-icon-arrow-right'"
               @click="tabShow(index,'option1')" ref="option1Title"></i>
            <span @click="tabShow(index,'option1')">
            配置项1
        </span>
        </div>
        <div class="game-inner" v-show="tabShowStatus[index].child.option1">
            <div class="option-animate">
                <div class="option-animate-title">
                    复选框
                </div>
                <div>
                    <div class="edit-checkbox-title">
                        <el-checkbox v-model="checkbox" size="small"
                        >图片
                        </el-checkbox>
                    </div>
                </div>
            </div>
            <div class="option-animate">
                <div class="option-animate-title">
                    单选框
                </div>
                <div>
                    <div class="edit-radio-title">
                        <el-radio v-model="radio" label="1">图片</el-radio>
                        <el-radio v-model="radio" label="2">动画</el-radio>
                        <el-radio v-model="radio" label="3">精灵序列</el-radio>
                    </div>
                </div>
            </div>
            <div class="option-animate">
                <div class="option-animate-title">
                    开关
                </div>
                <div>
                    <div class="edit-switch">
                        <el-switch style="float: left"
                                v-model="switchStatus"
                                active-color="#77DC04"
                                inactive-color="#ff4949">
                        </el-switch>
                        <span style="float: left">loop</span>
                    </div>
                </div>
            </div>
            <div class="option-animate">
                <div class="option-animate-title">
                    上传图片
                </div>
                <div>
                    <div class="upload">
                        <div class="img-box">
                            <img :src="resourceData[image.name]" alt="" width="131" height="96">
                        </div>
                        <div class="upload-btn">
                            <div class="upload-btn-file">
                                <span>更改图片</span>
                                <input type="file" @change="uploadImage('image',$event)">
                            </div>
                        </div>
                    </div>
                    <el-input placeholder="请输入内容" @input.native="setAttr('image','x')" v-model="image.x" size="mini">
                        <template slot="prepend">X：</template>
                    </el-input>
                    <el-input placeholder="请输入内容" @input.native="setAttr('image','y')" v-model="image.y" size="mini">
                        <template slot="prepend">Y：</template>
                    </el-input>
                    <el-input placeholder="请输入内容" style="width: 40%" @input="setAttr('image','width')"  v-model="image.width" size="mini">
                        <template slot="prepend">W：</template>
                    </el-input>
                    <div style="float: left;text-align: center;width: 20%;height: 28px;margin-top: 15px;line-height: 32px;">
                        <img :src="resourceData.image_lock_on" alt="" @click="setImageLock()" style="height: 14px;cursor: pointer" v-if="image.lock">
                        <img :src="resourceData.image_lock_off" alt="" @click="setImageLock()" style="height: 14px;cursor: pointer" v-if="!image.lock">
                    </div>
                    <el-input placeholder="请输入内容" style="width: 40%" @input="setAttr('image','height')"  v-model="image.height" size="mini">
                        <template slot="prepend">H：</template>
                    </el-input>
                </div>
            </div>

            <div class="option-animate">
                <div class="option-animate-title">
                    上传动画
                </div>
                <div>
                    <div class="upload">
                        <span class="file-title">动画文件：</span>
                        <div class="animate-box">
                            <span v-text="animate.name"></span>
                        </div>
                        <div class="upload-btn">
                            <div class="upload-btn-file">
                                <span>更改文件</span>
                                <input type="file" multiple="multiple" @change="uploadAnimation('option',$event)">
                            </div>
                        </div>
                    </div>
                    <el-input placeholder="请输入内容" v-model="animate.x" size="mini">
                        <template slot="prepend">X：</template>
                    </el-input>
                    <el-input placeholder="请输入内容" v-model="animate.y" size="mini">
                        <template slot="prepend">Y：</template>
                    </el-input>
                    <el-input placeholder="请输入内容" v-model="animate.scale" size="mini">
                        <template slot="prepend">Scale：</template>
                    </el-input>
                    <div class="edit-switch">
                        <span>loop</span>
                        <el-switch
                                v-model="animate.loop"
                                active-color="#77DC04"
                                inactive-color="#ff4949">
                        </el-switch>
                    </div>
                </div>
            </div>
            <div class="option-animate">
                <div class="option-animate-title">
                    上传精灵序列
                </div>
                <div>
                    <div class="upload">
                        <span class="file-title">
                            精灵文件：
                        </span>
                        <div class="animate-box">
                            <span v-text="sprite.name"></span>
                        </div>
                        <div class="upload-btn">
                            <div class="upload-btn-file">
                                <span>更改文件</span>
                                <input type="file" multiple="multiple" @change="uploadSprite('option',$event)">
                            </div>
                        </div>
                    </div>
                    <el-input placeholder="请输入内容" v-model="sprite.x" size="mini">
                        <template slot="prepend">X：</template>
                    </el-input>
                    <el-input placeholder="请输入内容" v-model="sprite.y" size="mini">
                        <template slot="prepend">Y：</template>
                    </el-input>
                    <el-input placeholder="请输入内容" v-model="sprite.scale" size="mini">
                        <template slot="prepend">Scale：</template>
                    </el-input>
                    <div class="edit-switch">
                        <span>loop</span>
                        <el-switch
                                v-model="sprite.loop"
                                active-color="#77DC04"
                                inactive-color="#ff4949">
                        </el-switch>
                    </div>
                </div>
            </div>
            <div class="option-animate">
                <div class="option-animate-title">
                    音频文件
                </div>
                <div>
                    <div class="upload">
                        <div class="animate-box">
                            <span v-text="audio_name"></span>
                        </div>
                        <div class="upload-btn">
                            <div class="upload-btn-file">
                                <span>更改文件</span>
                                <input type="file" @change="uploadAudio('audio',$event)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {CopyAndRender,DeleteEleByName,UploadAndRenderEle,RenderElementByIndex} from 'xes-tem-render'
    export default {
        name: "EditGamePrivate",
        data() {
            return {
                lockImg:this.resourceData['image_lock_off'],
                checkbox:false,
                radio:1,
                switchStatus:false,
                audio_name:'',
                image:{
                    "show": true,
                    "x": 0,
                    "y": 0,
                    "lock":false,
                    "width":0,
                    "height":0,
                    "name": "",
                    "ratio":0
                },
                sprite:{
                    "show": false,
                    "x": "500",
                    "y": "0",
                    "name": "",
                    "scale": "1",
                    "loop": false
                },
                animate:{
                    "show": false,
                    "x": "100",
                    "y": "100",
                    "name": "",
                    "scale": "3",
                    "loop": true
                }
            }
        },
        props: [
            "allData",
            "gameData",
            "resourceData",
            "item",
            "index",
            "tabShowStatus"
        ],
        mounted() {
        },
        methods: {
            setImageLock(){
                this.image.lock = !this.image.lock;
                if(!this.image.height||!this.image.width){
                    this.$message({
                        message: 'X或Y为0或为空 无法计算比例',
                        type: 'warning'
                    });
                    return;
                }
                if(this.image.lock){
                    this.image.ratio = this.image.width/this.image.height;
                }
            },
            setAttr(name,attr){
                if(this.image.ratio>0&&(attr === 'width'||attr === 'height')&&this.image.lock){
                    if(attr === 'width'){
                        console.log(this.image.width,this.image.ratio);
                        this.image.height = this.image.width/this.image.ratio;
                    }else if(attr === 'height'){
                        this.image.width = this.image.height*this.image.ratio;
                    }
                }
            },
            tabShow(index, name) {
                let title = this.$refs[name + 'Title'];
                let nameTab = this.tabShowStatus[index].child[name];
                if (nameTab) {
                    this.tabShowStatus[index].child[name] = false;
                    title.className = 'el-icon-arrow-right'
                } else {
                    Object.keys(this.tabShowStatus[index].child).forEach((item, index1) => {
                        this.tabShowStatus[index].child[item] = false
                    })
                    this.tabShowStatus[index].child[name] = true;
                    title.className = 'el-icon-arrow-down'
                }
            },
            verifyAnimationFiles(filesArr) {
                let arr = Object.values(filesArr).map((item, index) => item.name);
                let extArr = [];
                let nameArr = arr.map((item)=>{
                    extArr.push(item.split('.')[1]);
                    return item.split('.')[0]
                });
                let extArrString = extArr.sort((a,b)=>a.length-b.length).toString();
                let extTestArrString = ["png", "json", "atlas"].toString();
                let testName = nameArr[0];
                let nameStatus = nameArr.every((item,index)=>{
                    return testName === item
                });
                let extStatus = extArrString === extTestArrString;
                return nameStatus&&extStatus;
            },
            verifySpriteFiles(filesArr) {
                let arr = Object.values(filesArr).map((item, index) => item.name);
                let extArr = [];
                let nameArr = arr.map((item)=>{
                    extArr.push(item.split('.')[1]);
                    return item.split('.')[0]
                });
                let extArrString = extArr.sort((a,b)=>a.length-b.length).toString();
                let extTestArrString = ["png", "json"].toString();
                let testName = nameArr[0];
                let nameStatus = nameArr.every((item,index)=>{
                    return testName === item
                });
                let extStatus = extArrString === extTestArrString;
                return nameStatus&&extStatus;
            },
            uploadImage(name, e) {
                let ext = e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1];
                let extArr = ['jpg', 'png'];
                if (extArr.indexOf(ext) === -1) {
                    this.$message({
                        message: '上传类型不符',
                        type: 'error'
                    });
                    return;
                }
                if (e.target.files.length === 0) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                this.$http.post('/uploadingImage',
                    {
                        image: e.target.files[0]
                    },
                    {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.image.name = res.resourceName;
                    this.image.width = res.width;
                    this.image.height = res.height;
                    this.updateResourceData();
                    e.target.value = '';
                })
            },
            uploadAnimation(name, e) {
                if (e.target.files.length === 0 || e.target.files.length !== 3){
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                if(!this.verifyAnimationFiles(e.target.files)){
                    this.$message({
                        message: '上传文件不符合',
                        type: 'warning',
                    });
                    return;
                }
                let object = {};
                let type = 'Animate';
                let files = Object.values(e.target.files);
                files.forEach((item, index) => {
                    object['animation' + (index + 1)] = item;
                });
                this.$http.post('/uploadingAnimation', object, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.animate.name = res.resourceName;
                    e.target.value = '';
                })
            },
            uploadSprite(name, e) {
                if (e.target.files.length === 0 || e.target.files.length !== 2) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                if(!this.verifySpriteFiles(e.target.files)){
                    this.$message({
                        message: '上传文件不符合',
                        type: 'warning',
                    });
                    return;
                }
                let object = {};
                let files = Object.values(e.target.files);
                files.forEach((item, index) => {
                    object['sprite' + (index + 1)] = item;
                });
                console.log(object);
                this.$http.post('/uploadingSprite', object, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.sprite.name = res.resourceName;
                    e.target.value = '';
                })
            },
            uploadAudio(name,e) {
                let ext = e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1];
                let extArr = ['mp3', 'wav'];
                if (extArr.indexOf(ext) === -1) {
                    this.$message({
                        message: '上传类型不符',
                        type: 'error'
                    });
                    return;
                }
                if (e.target.files.length === 0) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                this.$http.post('/uploadingAudio',
                    {audio: e.target.files[0]}, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.audio_name = res.resourceName;
                    e.target.value = '';
                })
            },
            updateResourceData() {
                this.$emit('updateResourceData')
            },
        }
    }
</script>
<style scoped lang="scss">

</style>