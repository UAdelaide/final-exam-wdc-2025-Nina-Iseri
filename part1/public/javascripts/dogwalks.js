const { createApp } = Vue;

createApp({
    data() {
        return {
            dog_of_the_day: {
                name: '',
                description: '',
                owner: '',
                
            }
        };
    },
    methods: {

    }
}).mount("body");
