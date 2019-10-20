<script>
export default {
    name: 'DocumentationList',
    props: {
        pages: {
            type: Array,
            default: []
        },
        pageSize: {
            type: Number,
            default: 5
        },
        startPage: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            currentPage: Math.ceil(this.startPage / this.pageSize),
            selectedTags: []
        }
    },
    computed: {
        filteredList() {
            if (this.pages) {
                return this.pages.filter(item => {
                    return item.frontmatter.docs == true
                    
                })
            }
        },

        data () {
            return this.$page.frontmatter
        },

        totalPages() {
            return Math.ceil(this.filteredList.length / this.pageSize)
        },
    },

    mounted() {
        this.currentPage =  Math.min(Math.max(this.currentPage, 0), this.totalPages - 1)
    },

    methods: {
        nextPage() {
            this.currentPage = this.currentPage >= this.totalPages - 1 ? this.totalPages - 1 : this.currentPage + 1
        },
        previousPage() {
            this.currentPage = this.currentPage < 0 ? 0 : this.currentPage - 1
        },
    }
}
</script>

<template>
	<div class="docs">
        <h1>{{ data.title }}</h1>
        <hr/>
        <div v-for="(doc) in filteredList">
            <router-link :to="doc.path">
                <h3>{{ doc.title }}</h3>
            </router-link>
        </div>


    </div>
</template>

<style scoped>
    .docs {

    }
</style>
