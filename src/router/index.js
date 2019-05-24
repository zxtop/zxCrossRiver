import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index';
import {Edit,Preview} from 'xes-tem-edit';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            component: Index,
        },
        {
            path: '/edit',
            component: Edit,
        },
        {
            path: '/preview',
            component: Preview,
        }
    ]
})
