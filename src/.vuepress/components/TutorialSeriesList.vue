<template>
	<div style="margin-bottom: 2rem">
        <h3 style="margin-bottom: 0;">{{ title }}</h3>
        <hr />
        <ul class="blog-list">
            <li v-for="(item, index) in filteredList" class="blog-list__item" :key="index">
                <tutorial-item-list
                    :item="item"  :order="item.frontmatter.order"
                />
            </li>
        </ul>
    </div>
</template>

<script>
import TutorialItemList from './TutorialItemList.vue'
export default {
  components: { TutorialItemList },
    name: 'TutorialSeriesList',
    props: {
        pages: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: "Tutorial Series"
        },
        tutorialKey: {
            type: String,
            default: 'series'
        }
    },
    computed: {
        filteredList() {
            if (this.pages) {
                return this.pages.filter(item => {
                    const isSeries = !!item.frontmatter[this.tutorialKey]
                    const isReadyToPublish = new Date(item.frontmatter.date) <= new Date()
                     // check for locales
                    let isCurrentLocale = true;
                    if(this.$site.locales) {
                        const localePath = this.$route.path.split('/')[1] || "";
                        isCurrentLocale = item.relativePath.startsWith(localePath);   
                    }

                    if (!isSeries || !isReadyToPublish || !isCurrentLocale){ 
                        return false
                    }
                    return true
                    
                }).sort((a, b) => (a.frontmatter.order < b.frontmatter.order) ? -1 : 1)
            }
        }
    }
}
</script>

<style scoped>
.blog-list {
	padding: 0;
	margin: 0;
}

.blog-list__item {
	list-style-type: none;
}

.button--pagination {
	background-color: #3eaf7c;
	border-radius: 2px;
    border: 1px solid #3eaf7c;
	color: #fff;
	font-size: 0.8rem;
	padding: 0.5rem 0.75rem;
	text-transform: uppercase;
	font-weight: 700;
	box-shadow: 0 0;
	transition: background-color 0.2s ease-in, color 0.2s ease-in;
}

.button--pagination:hover {
    background-color: #fff;
    border: 1px solid #3eaf7c;
    border-radius: 2px;
    color: #3eaf7c;
}

.clear-filter-btn {
    align-self: center;
    margin-left: 20px;
}

.filtered-heading {
    display: flex;
}

.pagination {
    text-align: center;
}

.selected-tag {
    background-color: #3eaf7c;
    color: #fff;
    border-radius: 2px;
    padding: 2px 10px;
}
</style>
