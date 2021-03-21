// https://jsfiddle.net/Linusborg/w9d8ujn8/
import Vue from "vue"

/**
 * component die root of wrapper al of niet toont
 */
Vue.component('with-root', {
    functional: true,
    props: ['show'],
    render(h, ctx) {
        const children = ctx.children.filter(vnode => vnode.tag) // remove unnecessary text nodes
        console.log(children)
        if (children.length !== 1) {
            console.warn('this component accepts only one root node in its slot')
        }
        if (ctx.props.show) {
            return children[0]
        } else {
            return children[0].children
        }
    }
})
