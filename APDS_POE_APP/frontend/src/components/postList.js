import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../App.css';


const Post = (props) => (
    <tr>
        <td>{props.post.user}</td>
        <td>{props.post.content}</td>

        <td>{props.post.image && (
            <img
                src = {'data:image/Jpeg,base64,${props.post.image}'} //convert base64 string to image
                alt = "Post Image"
                style = {{maxWidth: '100px', maxHeight: '100px', objectFit: 'cover'}} //ensure the image fits within the size limits

            />
            )}
        </td>
        <td>
            <button className = "btn btn-link"
                onClick={() => {
                    props.deletePost(props.post.id);
                }}
            >
                Delete
            </button>
        </td>
    </tr>
);

export default function PostList() {
    const [post, setPosts] = useState([]);

    //this method fetches posts from the database
    useEffect(() => {
        const response = await fetch('https://localhost:3001/post/');

        if(!response.ok) {
            const message = 'an error occured: ${response.statuseText}';
            window.alert(message)
            return;
        }

        const posts = await response.json();
        setPosts(posts);
    }

    getPosts();

    return;
}

























/*export default function PostList() {
    return (
        <body>
            <div className="container">
                <h3 className="header">APDS NOTICE BOARD</h3>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Caption</th>
                            <th>Image</th>
                            <th>Action</th> {/* Added column for actions }
                        </tr>
                    </thead>
                </table>
            </div>
        </body>
    );
}
*/
