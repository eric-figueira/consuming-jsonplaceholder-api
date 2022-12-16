const axios = require('axios')

const USERS_URL    = "https://jsonplaceholder.typicode.com/users"
const PHOTOS_URL   = "https://jsonplaceholder.typicode.com/photos"
const ALBUMS_URL   = "https://jsonplaceholder.typicode.com/albums"
const POSTS_URL    = "https://jsonplaceholder.typicode.com/posts"
const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments"


function shuffleArray(array) { 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


exports.render_home = ('/home', async(req, res) => {
    try 
    {
        const request_users  = axios.get(USERS_URL,  { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        const request_photos = axios.get(PHOTOS_URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        const request_albums = axios.get(ALBUMS_URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        const request_posts  = axios.get(POSTS_URL,  { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        const request_comments  = axios.get(COMMENTS_URL,  { headers: { "Accept-Encoding": "gzip,deflate,compress" } })

        let final_render_response = []

        axios.all([request_users,request_photos,request_albums,request_posts,request_comments]).then(
            axios.spread((...responses) => 
            {
                const res_users  = responses[0]["data"]
                const res_photos = responses[1]["data"]
                const res_albums = responses[2]["data"]
                const res_posts  = responses[3]["data"]
                const res_comm   = responses[4]["data"]

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

                                // Changing the order here because thumbnailUrl is 150x150 and url is 600x600
                                obj.thumbnailUrl = photos_from_that_album[index]["url"]

                                index = Math.floor(Math.random() * photos_from_that_album.length); // Getting a new photo from the same album
                                obj.profileImg = photos_from_that_album[index]["thumbnailUrl"]
                            }

                            // Getting the number of comments from that post
                            let comments_from_that_post = res_comm.filter(comment => comment["postId"] == res_posts[i]["id"])
                            obj.numComments = comments_from_that_post.length

                            final_render_response.push(obj)
                        }
                    }
                }
                shuffleArray(final_render_response) // We dont want the page to display the posts in order, to we are going to shuffle the array
                res.render('../src/views/home', {final_render_response: final_render_response})
            })
        )
    }
    catch (erro) { console.log(erro) }
})


exports.render_profile = ('/profile/:username', (req, res) => {

    const username = req.params.username

    try 
    {
        const request_users = axios.get(USERS_URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
        const request_posts = axios.get(POSTS_URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })

        let final_render_response_user_info = []
        let final_render_response_posts = []

        axios.all([request_users, request_posts]).then(
            axios.spread((...responses) => 
            {
                const res_users = responses[0]["data"]
                const res_posts = responses[1]["data"]

                for (let user of res_users){

                    if (user["username"] == username) {
                        // Getting the informations of the user
                        let user_info = {}
                        user_info.name       = user["name"]
                        user_info.username   = user["username"]
                        user_info.email      = user["email"]
                        user_info.city       = user["address"]["city"]
                        user_info.website    = user["website"]

                        final_render_response_user_info.push(user_info)

                        // Getting the posts of the user
                        for (let post of res_posts) {

                            if (post["userId"] == user["id"]) {
                                let obj = {}
                                obj.post_title = post["title"]

                                final_render_response_posts.push(obj)
                            }
                        }
                    }
                }
                res.render('../src/views/profile', {final_render_response_user_info: final_render_response_user_info, final_render_response_posts: final_render_response_posts})
            })
        )
    }
    catch (erro) { console.error(erro) }
})