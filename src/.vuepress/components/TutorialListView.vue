<script>
export default {
    name: 'TutorialListView',
    props: {
        pages: {
            type: Array,
            default: []
        }
    },
    computed: {
        filteredList() {
            if (this.pages) {
                return this.pages.filter(item => {
                    return item.frontmatter.tutorial == true && item.frontmatter.published == true
                })
            }
        },

        data () {
            return this.$page.frontmatter
        },

        totalPages() {
            return Math.ceil(this.filteredList.length / this.pageSize)
        },
    }
}
</script>

<template>
	<div class="docs">
        <h1>{{ data.title }}</h1>
        <hr/>
        <div v-for="(doc, _i) in filteredList" :key="_i">
            <router-link :to="doc.path">
                <h3>{{_i + 1}}) {{ doc.title }}</h3>
            </router-link>
        </div>
    </div>
</template>
