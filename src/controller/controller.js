const axios = require('axios')

const USERS_URL    = "https://jsonplaceholder.typicode.com/users"
const PHOTOS_URL   = "https://jsonplaceholder.typicode.com/photos"
const ALBUMS_URL   = "https://jsonplaceholder.typicode.com/albums"
const POSTS_URL    = "https://jsonplaceholder.typicode.com/posts"
const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments"


function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


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

                for (let user of res_users) {
                    for (let i = 0; i < res_posts.length; i++) {
                        //Every post has an album, so this for loop is valid, since 10 posts have 10 albums and 10 thumbnails
                        // if the post id is 37, then the album id is 37 as well
                        let obj = {}
                        if (res_posts[i]["userId"] == user["id"]) {
                            obj.username = user["username"]
                            obj.title = res_posts[i]["title"]
                            obj.body = res_posts[i]["body"]
                            if (res_albums[i]["userId"] == user["id"]) {
                                let photos_from_that_album = res_photos.filter(photo => photo["albumId"] == res_albums[i]["id"])
                                // Since the api gives 50 photos for each album, we are going to random one of them to be the thumbnail
                                let index = Math.floor(Math.random() * photos_from_that_album.length);
                                obj.thumbnailUrl = photos_from_that_album[index]["thumbnailUrl"]
                            }
                            final_render_response.push(obj)
                        }
                    }
                }
                res.render('views/home')
            })
        )
    }
    catch (erro) { console.log(erro) }
})