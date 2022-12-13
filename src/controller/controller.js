const axios = require('axios')

const USERS_URL    = "https://jsonplaceholder.typicode.com/users"
const PHOTOS_URL   = "https://jsonplaceholder.typicode.com/photos"
const ALBUMS_URL   = "https://jsonplaceholder.typicode.com/albums"
const POSTS_URL    = "https://jsonplaceholder.typicode.com/posts"
const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments"


exports.render_home = ('/home', async(req, res) => {
    try 
    {
        const request_users  = axios.get(USERS_URL,  { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        const request_photos = axios.get(PHOTOS_URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        const request_albums = axios.get(ALBUMS_URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        const request_posts  = axios.get(POSTS_URL,  { headers: { "Accept-Encoding": "gzip,deflate,compress" } })

        let final_render_response = []

        axios.all([request_users,request_photos,request_albums,request_posts]).then(
            axios.spread((...responses) => 
            {
                const res_users  = responses[0]["data"]
                const res_photos = responses[1]["data"]
                const res_albums = responses[2]["data"]
                const res_posts  = responses[3]["data"]

                
            })
        )
    }
    catch (erro) { console.log(erro) }
})