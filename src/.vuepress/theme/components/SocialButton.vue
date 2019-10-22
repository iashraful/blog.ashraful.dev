<template>
    <div>
        <a class="social-link"
            target="_blank"
            :href="link.link" 
            v-for="link in socialLinks" 
            :key="link.link">
            <font-awesome-icon :icon="link.icon"/>
        </a>
    </div>
</template>


<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faFacebookSquare, faTwitterSquare, faLinkedin, faStackOverflow, faGithubSquare
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faFacebookSquare, faTwitterSquare, faLinkedin, faStackOverflow, faGithubSquare)

export default {
    name: 'SocialButton',
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            socialLinks: {
                'facebook': {
                    'icon': ['fab', 'facebook-square'],
                    'link': 'https://facebook.com/ashraful.py'
                },
                'twitter': {
                    'icon': ['fab', 'twitter-square'],
                    'link': 'https://twitter.com/__ashraful'
                }
            }
        }
    }
}
</script>


<style scoped>
    .social-link {
        padding: 0 7px;
        font-size: 2.8em;
    }
</style>