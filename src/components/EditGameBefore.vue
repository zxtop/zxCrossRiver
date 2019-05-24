<template>
    <div>

    </div>
</template>

<script>
    export default {
        name: "EditGameBefore",
        props:['allData','resourceData'],
        data(){
            return{
            }
        },
        methods:{
            updateResourceData() {
                /*
                * 此方法在上传图片请求成功后执行
                * */

                this.$emit('updateResourceData')
            },
        },
        mounted(){

        }
    }
</script>
<style scoped>

</style>