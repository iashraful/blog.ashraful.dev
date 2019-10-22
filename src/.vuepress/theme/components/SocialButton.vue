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
                'github': {
                    'icon': ['fab', 'github-square'],
                    'link': 'https://github.com/iashraful'
                },
                'linkedin': {
                    'icon': ['fab', 'linkedin'],
                    'link': 'https://www.linkedin.com/in/~ashraful/'
                },
                'twitter': {
                    'icon': ['fab', 'twitter-square'],
                    'link': 'https://twitter.com/__ashraful'
                },
                'stackoverflow': {
                    'icon': ['fab', 'stack-overflow'],
                    'link': 'https://stackoverflow.com/users/5527679/ashraful-islam'
                },
                'facebook': {
                    'icon': ['fab', 'facebook-square'],
                    'link': 'https://facebook.com/ashraful.py'
                },
            }
        }
    }
}
</script>


<style scoped>
    .social-link {
        padding: 0 7px;
        font-size: 2.8em;
        color: #2c3e50;
    }

    .social-link:hover {
        color: #3eaf7c;
    }
</style>