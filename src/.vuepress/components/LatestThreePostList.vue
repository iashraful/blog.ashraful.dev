<script>
export default {
    name: 'LatestThreePostList',
    props: {
        pages: {
            type: Array,
            default: []
        },
        pageSize: {
            type: Number,
            default: 3
        },
        startPage: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            currentPage: Math.ceil(this.startPage / this.pageSize),
        }
    },
    computed: {
        filteredList() {
            if (this.pages) {
                return this.pages.filter(item => {
                    const isBlogPost = !!item.frontmatter.blog
                    const isReadyToPublish = new Date(item.frontmatter.date) <= new Date()
                     // check for locales
                    let isCurrentLocale = true;
                    if(this.$site.locales) {
                        const localePath = this.$route.path.split('/')[1] || "";
                        isCurrentLocale = item.relativePath.startsWith(localePath);   
                    }

                    if (!isBlogPost || !isReadyToPublish || !isCurrentLocale){ 
                        return false
                    }

                    return true
                    
                }).sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
            }
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
        addTag(tag) {
            this.$router.push({path: '/posts/', query: {tag: tag}})
        }
    }
}
</script>

<template>
	<div>
        <ul class="blog-list">
            <li v-for="(item, index) in filteredList"
                class="blog-list__item">
                <BlogPostPreview 
                    v-show="index >= currentPage * pageSize && index < (currentPage + 1) * pageSize"
                    :item="item" @addedTag="addTag"
                />
            </li>
        </ul>
    </div>
</template>

<style scoped>
.blog-list {
	padding: 0;
	margin: 0;
}

.blog-list__item {
	list-style-type: none;
}
</style>
