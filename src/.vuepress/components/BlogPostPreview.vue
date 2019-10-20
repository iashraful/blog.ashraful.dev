<script>
export default {
    name: 'BlogPostPreview',
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        formatPublishDate() {
            const dateFormat = new Date(this.item.frontmatter.date)
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            } 

            return dateFormat.toLocaleDateString('en-US', options)
        }
    },
    methods: {
        addTag(tag) {
            this.$emit('addedTag', tag)
        },
    }
}
</script>

<template>
	<section>
        <time>{{ formatPublishDate }}</time>
        <h3 class="blog-post__title">
            <router-link :to="item.path">{{ item.frontmatter.title }}</router-link>
        </h3>
        <p v-if="item.frontmatter.excerpt">{{ item.frontmatter.excerpt }}</p>
        <p v-if="item.readingTime">Estimated time: {{ item.readingTime.text }}</p>
        <ul class="blog-list__tags">
            <li v-for="tag in item.frontmatter.tags">
                <a @click="addTag(tag)" class="blog-list__tag">{{ tag }}</a>
            </li>
        </ul>
        <router-link class="button blog-post__button" :to="item.path">Read More ></router-link>
    </section>
</template>

<style scoped>
.blog-post__button {
	margin-bottom: 1.5rem;
	display: inline-block;
}

.blog-post__title {
	margin-top: 0.5rem;
    margin-bottom: -0.5rem;
}

.blog-list__tags {
  list-style: none;
  margin: 0;
  overflow: hidden; 
  padding: 0;
}

.blog-list__tags li {
  float: left; 
}

.blog-list__tag {
  background: #eee;
  border-radius: 3px 0 0 3px;
  color: #999;
  display: inline-block;
  height: 26px;
  line-height: 26px;
  padding: 0 20px 0 23px;
  position: relative;
  margin: 0 10px 10px 0;
  text-decoration: none;
  -webkit-transition: color 0.2s;
}

.blog-list__tag::before {
  background: #fff;
  border-radius: 10px;
  box-shadow: inset 0 1px rgba(0, 0, 0, 0.25);
  content: '';
  height: 6px;
  left: 10px;
  position: absolute;
  width: 6px;
  top: 10px;
}

.blog-list__tag::after {
  background: #fff;
  border-bottom: 13px solid transparent;
  border-left: 10px solid #eee;
  border-top: 13px solid transparent;
  content: '';
  position: absolute;
  right: 0;
  top: 0;
}

.blog-list__tag:hover {
  background-color: crimson;
  color: white;
}

.blog-list__tag:hover::after {
   border-left-color: crimson; 
}





.button {
	border: 1px solid #32c8cf;
	border-radius: 4px;
	color: #32c8cf;
	font-size: 0.8rem;
	padding: 0.5rem 0.75rem;
	text-transform: uppercase;
	font-weight: 700;
	box-shadow: 0 0;
	transition: background-color 0.2s ease-in, color 0.2s ease-in;
}

.tag-list {
    list-style: none;
    padding-left: 0;
    display: flex;
    margin-bottom: 25px;
}

.tag-list__item {
    margin-left: 10px;
}

.tag-list__item:first-child {
    margin-left: 0;
}

.tag-list__btn {
    padding: 5px;
    font-size: 0.9rem;
    background-color: #fff;
}
</style>
