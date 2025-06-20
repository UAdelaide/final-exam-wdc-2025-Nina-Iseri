const { createApp } = Vue;

createApp({
    data() {
        return {
            dog_of_the_day: {
                name: '',
                description: '',
                owner: '',
                imageUrl: ''
            }
        };
    },
    async created() {
        try {
            await fetch("https://dog.ceo/api/breeds/image/random")
            .then((res) => res.json)
            .then((data) => {
                this.dog_of_the_day.imageUrl = data.message;
            });
        } catch (err) {
            console.error()
        }
    }
}).mount("body");
